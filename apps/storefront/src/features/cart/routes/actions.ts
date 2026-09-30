'use server';

import {mutate, query} from '@/platform/vendure/api';
import {
    RemoveFromCartMutation,
    AdjustCartItemMutation,
    ApplyPromotionCodeMutation,
    RemovePromotionCodeMutation,
    GetActiveOrderQuery,
} from '@/features/cart/graphql';
import {getActiveCurrencyCode} from '@/features/currency/currency-server';
import {updateTag} from 'next/cache';

export async function removeFromCart(lineId: string) {
    const currencyCode = await getActiveCurrencyCode();
    await mutate(RemoveFromCartMutation, {lineId}, {useAuthToken: true, currencyCode});
    updateTag('cart');
}

export async function clearCart() {
    const currencyCode = await getActiveCurrencyCode();
    try {
        const {data} = await query(GetActiveOrderQuery, {}, {useAuthToken: true, currencyCode});
        if (data?.activeOrder?.lines && data.activeOrder.lines.length > 0) {
            for (const line of data.activeOrder.lines) {
                await mutate(RemoveFromCartMutation, {lineId: line.id}, {useAuthToken: true, currencyCode});
            }
        }
    } catch (e) {
        console.error('Failed to clear cart:', e);
    }
    updateTag('cart');
}

export async function adjustQuantity(lineId: string, quantity: number) {
    const currencyCode = await getActiveCurrencyCode();
    await mutate(AdjustCartItemMutation, {lineId, quantity}, {useAuthToken: true, currencyCode});
    updateTag('cart');
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

    if (!code) {
        return { success: false, error: 'Veuillez saisir un code promo.' };
    }

    const currencyCode = await getActiveCurrencyCode();
    const result = await mutate(
        ApplyPromotionCodeMutation,
        { couponCode: code },
        { useAuthToken: true, currencyCode }
    );

    const res = result.data.applyCouponCode;
    if (res.__typename === 'Order') {
        updateTag('cart');
        return { success: true, couponCode: code };
    } else {
        return {
            success: false,
            error: res.message || 'Code promo invalide ou expiré.',
        };
    }
}

export async function removePromotionCode(formData: FormData) {
    const code = formData.get('code') as string;
    if (!code) return;

    const currencyCode = await getActiveCurrencyCode();
    await mutate(RemovePromotionCodeMutation, {couponCode: code}, {useAuthToken: true, currencyCode});
    updateTag('cart');
}
