'use server';

import {mutate, query} from '@/platform/vendure/api';
import {
    RemoveFromCartMutation,
    RemoveAllOrderLinesMutation,
    AdjustCartItemMutation,
    ApplyPromotionCodeMutation,
    RemovePromotionCodeMutation,
    GetActiveOrderQuery,
} from '@/features/cart/graphql';
import {TransitionOrderToStateMutation} from '@/features/checkout/graphql';
import {getActiveCurrencyCode} from '@/features/currency/currency-server';
import {setAuthToken} from '@/platform/vendure/auth-token';
import {updateTag} from 'next/cache';
import type {CartOrder} from '../context/cart-context';

const INTERACTIVE_TIMEOUT_MS = 30000;

export type CartMutationResult =
    | {success: true; order?: CartOrder | null}
    | {success: false; error: 'invalid-input' | 'request-failed'};

export type CartSnapshotResult =
    | {success: true; order: CartOrder | null}
    | {success: false};

function isOpaqueId(value: unknown): value is string {
    return typeof value === 'string' && value.length > 0 && value.length <= 128 && !value.startsWith('temp-');
}

function isValidQuantity(value: unknown): value is number {
    return typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= 999;
}

function markCartStale() {
    // Cart UI is updated optimistically in the client. SWR invalidation keeps
    // future reads fresh without making each click wait for a route re-render.
    updateTag('cart');
    updateTag('active-order');
}

async function ensureAddingItemsState(currencyCode?: string) {
    try {
        const res = await mutate(
            TransitionOrderToStateMutation,
            {state: 'AddingItems'},
            {useAuthToken: true, currencyCode, timeoutMs: INTERACTIVE_TIMEOUT_MS}
        );
        if (res.token) await setAuthToken(res.token);
    } catch (err) {
        console.warn('Failed to transition order to AddingItems:', err);
    }
}

/** Fetches the canonical order only after an optimistic mutation fails. */
export async function getCartSnapshot(): Promise<CartSnapshotResult> {
    const currencyCode = await getActiveCurrencyCode();
    const result = await query(
        GetActiveOrderQuery,
        {},
        {useAuthToken: true, currencyCode, timeoutMs: INTERACTIVE_TIMEOUT_MS}
    );

    if (result.token) await setAuthToken(result.token);

    if (result.error) return {success: false};
    return {success: true, order: (result.data.activeOrder as CartOrder | null) || null};
}

export async function removeFromCart(lineId: string): Promise<CartMutationResult> {
    if (!isOpaqueId(lineId)) return {success: false, error: 'invalid-input'};

    const currencyCode = await getActiveCurrencyCode();
    try {
        let result = await mutate(
            RemoveFromCartMutation,
            {lineId},
            {useAuthToken: true, currencyCode, timeoutMs: INTERACTIVE_TIMEOUT_MS}
        );
        if (result.token) await setAuthToken(result.token);

        if (result.data?.removeOrderLine?.__typename === 'OrderModificationError') {
            await ensureAddingItemsState(currencyCode);
            result = await mutate(
                RemoveFromCartMutation,
                {lineId},
                {useAuthToken: true, currencyCode, timeoutMs: INTERACTIVE_TIMEOUT_MS}
            );
            if (result.token) await setAuthToken(result.token);
        }

        // Self-healing: if line was already removed or absent from the order, treat as successful removal
        if (
            result.error?.message?.includes('order-does-not-contain-line-with-id') ||
            (result.data?.removeOrderLine as any)?.errorCode === 'ORDER_MODIFICATION_ERROR'
        ) {
            markCartStale();
            return {success: true};
        }
        if (result.error || result.data?.removeOrderLine?.__typename !== 'Order') {
            return {success: false, error: 'request-failed'};
        }
        markCartStale();
        return {success: true, order: result.data.removeOrderLine as unknown as CartOrder};
    } catch (e) {
        console.warn('Failed to remove from cart:', e);
        return {success: false, error: 'request-failed'};
    }
}

export async function clearCart(): Promise<CartMutationResult> {
    const currencyCode = await getActiveCurrencyCode();
    try {
        let result = await mutate(
            RemoveAllOrderLinesMutation,
            {},
            {useAuthToken: true, currencyCode, timeoutMs: INTERACTIVE_TIMEOUT_MS}
        );
        if (result.token) await setAuthToken(result.token);

        if (result.data?.removeAllOrderLines?.__typename === 'OrderModificationError') {
            await ensureAddingItemsState(currencyCode);
            result = await mutate(
                RemoveAllOrderLinesMutation,
                {},
                {useAuthToken: true, currencyCode, timeoutMs: INTERACTIVE_TIMEOUT_MS}
            );
            if (result.token) await setAuthToken(result.token);
        }

        if (result.error || result.data?.removeAllOrderLines?.__typename !== 'Order') {
            return {success: false, error: 'request-failed'};
        }
        markCartStale();
        return {success: true, order: result.data.removeAllOrderLines as unknown as CartOrder};
    } catch (e) {
        console.error('Failed to clear cart:', e);
        return {success: false, error: 'request-failed'};
    }
}

export async function adjustQuantity(lineId: string, quantity: number): Promise<CartMutationResult> {
    if (!isOpaqueId(lineId) || !isValidQuantity(quantity)) {
        return {success: false, error: 'invalid-input'};
    }

    const currencyCode = await getActiveCurrencyCode();
    try {
        let result = await mutate(
            AdjustCartItemMutation,
            {lineId, quantity},
            {useAuthToken: true, currencyCode, timeoutMs: INTERACTIVE_TIMEOUT_MS}
        );
        if (result.token) await setAuthToken(result.token);

        if (result.data?.adjustOrderLine?.__typename === 'OrderModificationError') {
            await ensureAddingItemsState(currencyCode);
            result = await mutate(
                AdjustCartItemMutation,
                {lineId, quantity},
                {useAuthToken: true, currencyCode, timeoutMs: INTERACTIVE_TIMEOUT_MS}
            );
            if (result.token) await setAuthToken(result.token);
        }

        if (
            result.error?.message?.includes('order-does-not-contain-line-with-id') ||
            (result.data?.adjustOrderLine as any)?.errorCode === 'ORDER_MODIFICATION_ERROR'
        ) {
            markCartStale();
            return {success: false, error: 'request-failed'};
        }
        if (result.error || result.data?.adjustOrderLine?.__typename !== 'Order') {
            return {success: false, error: 'request-failed'};
        }
        markCartStale();
        return {success: true, order: result.data.adjustOrderLine as unknown as CartOrder};
    } catch (e) {
        console.warn('Failed to adjust quantity:', e);
        return {success: false, error: 'request-failed'};
    }
}

export type ApplyCouponResult = {
    success: boolean;
    error?: string;
    couponCode?: string;
};

export async function applyPromotionCode(
    stateOrFormData: ApplyCouponResult | undefined | FormData,
    maybeFormData?: FormData
): Promise<ApplyCouponResult> {
    const formData = (maybeFormData instanceof FormData ? maybeFormData : stateOrFormData) as FormData;
    const rawCode = formData?.get?.('code');
    const code = typeof rawCode === 'string' ? rawCode.trim() : '';

    if (!code || code.length > 128) {
        return { success: false, error: 'Veuillez saisir un code promo.' };
    }

    const currencyCode = await getActiveCurrencyCode();
    const result = await mutate(
        ApplyPromotionCodeMutation,
        { couponCode: code },
        { useAuthToken: true, currencyCode, timeoutMs: INTERACTIVE_TIMEOUT_MS }
    );

    if (result.token) await setAuthToken(result.token);

    const res = result.data?.applyCouponCode;
    if (!res) {
        return {
            success: false,
            error: 'Le serveur n\'a pas répondu à temps. Veuillez réessayer.',
        };
    }
    if (res.__typename === 'Order') {
        markCartStale();
        return { success: true, couponCode: code };
    } else {
        return {
            success: false,
            error: res.message || 'Code promo invalide ou expiré.',
        };
    }
}

export async function removePromotionCode(formData: FormData): Promise<void> {
    const rawCode = formData.get('code');
    const code = typeof rawCode === 'string' ? rawCode.trim() : '';
    if (!code || code.length > 128) return;

    const currencyCode = await getActiveCurrencyCode();
    const result = await mutate(
        RemovePromotionCodeMutation,
        {couponCode: code},
        {useAuthToken: true, currencyCode, timeoutMs: INTERACTIVE_TIMEOUT_MS}
    );
    if (result.token) await setAuthToken(result.token);
    if (result.error || !result.data?.removeCouponCode) {
        return;
    }
    markCartStale();
}
