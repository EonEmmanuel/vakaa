'use server';

import {getLocale, getTranslations} from 'next-intl/server';
import {AddToCartMutation} from '@/features/cart/graphql';
import {TransitionOrderToStateMutation} from '@/features/checkout/graphql';
import {getActiveCurrencyCode} from '@/features/currency/currency-server';
import {mutate, query} from '@/platform/vendure/api';
import {setAuthToken} from '@/platform/vendure/auth-token';
import {GetProductDetailQuery} from '@/features/products/graphql';

const SLUG_ALIASES: Record<string, string> = {
    'cabas-maa-raphia': 'maa-tote',
    'pochette-zuri-laiton': 'zuri-clutch',
    'porte-epaule-kemi': 'kemi-shoulder-bag',
    'sac-baguette-indigo': 'baguette-indigo-savane',
    'sac-baguette-terre': 'baguette-terre-emeraude',
};

const VARIANT_FALLBACKS: Record<string, string> = {
    'baguette-indigo-savane': '94',
    'baguette-terre-emeraude': '95',
    'maa-tote': '89',
    'cabas-maa-raphia': '89',
    'kemi-shoulder-bag': '90',
    'porte-epaule-kemi': '90',
    'zuri-clutch': '91',
    'pochette-zuri-laiton': '91',
    'asa-crossbody': '92',
    'aya-cardholder': '93',
};

export async function addToCart(variantId: string, quantity = 1) {
    const locale = await getLocale();
    const currencyCode = await getActiveCurrencyCode();
    const t = await getTranslations({locale, namespace: 'Errors'});

    if (!isOpaqueId(variantId) || !isValidQuantity(quantity)) {
        return {success: false, error: t('failedAddToCart')};
    }

    try {
        let result = await mutate(
            AddToCartMutation,
            {variantId, quantity},
            {useAuthToken: true, currencyCode, timeoutMs: 30000},
        );

        if (result.token) await setAuthToken(result.token);

        // Auto-recover if the cart was previously transitioned to ArrangingPayment
        if (result.data?.addItemToOrder?.__typename === 'OrderModificationError') {
            try {
                await mutate(
                    TransitionOrderToStateMutation,
                    {state: 'AddingItems'},
                    {useAuthToken: true, currencyCode, timeoutMs: 30000}
                );
                result = await mutate(
                    AddToCartMutation,
                    {variantId, quantity},
                    {useAuthToken: true, currencyCode, timeoutMs: 30000}
                );
                if (result.token) await setAuthToken(result.token);
            } catch (transitionErr) {
                console.warn('Auto transition to AddingItems failed:', transitionErr);
            }
        }

        if (result.data?.addItemToOrder?.__typename === 'Order') {
            return {success: true, order: result.data.addItemToOrder};
        }

        const errorPayload = result.data?.addItemToOrder;
        const errorMessage =
            errorPayload && 'message' in errorPayload && typeof (errorPayload as { message?: unknown }).message === 'string'
                ? ((errorPayload as { message: string }).message)
                : t('failedAddToCart');

        return {
            success: false,
            error: errorMessage,
        };
    } catch {
        return {success: false, error: t('failedAddToCart')};
    }
}

function isOpaqueId(value: unknown): value is string {
    return typeof value === 'string' && value.length > 0 && value.length <= 128;
}

function isValidQuantity(value: unknown): value is number {
    return typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= 999;
}

export async function addProductToCartBySlug(slug: string, quantity = 1) {
    const locale = await getLocale();
    const currencyCode = await getActiveCurrencyCode();
    const t = await getTranslations({locale, namespace: 'Errors'});
    if (typeof slug !== 'string' || slug.length === 0 || slug.length > 160 || !isValidQuantity(quantity)) {
        return {success: false, error: t('failedAddToCart')};
    }
    const resolvedSlug = SLUG_ALIASES[slug] || slug;

    try {
        const res = await query(
            GetProductDetailQuery,
            {slug: resolvedSlug},
            {languageCode: locale, currencyCode}
        );

        const variants = res.data?.product?.variants;
        if (!variants || variants.length === 0) {
            const fallbackId = VARIANT_FALLBACKS[resolvedSlug] || VARIANT_FALLBACKS[slug];
            if (fallbackId) {
                console.warn(`[add-to-cart] Using VARIANT_FALLBACKS for slug "${slug}" -> variant "${fallbackId}"`);
                return addToCart(fallbackId, quantity);
            }
            return {success: false, error: t('failedAddToCart')};
        }

        const targetVariant = variants.find((v) => v.stockLevel !== '0') || variants[0];
        return addToCart(targetVariant.id, quantity);
    } catch {
        const fallbackId = VARIANT_FALLBACKS[resolvedSlug] || VARIANT_FALLBACKS[slug];
        if (fallbackId) {
            console.warn(`[add-to-cart] Using VARIANT_FALLBACKS after error for slug "${slug}" -> variant "${fallbackId}"`);
            return addToCart(fallbackId, quantity);
        }
        return {success: false, error: t('failedAddToCart')};
    }
}
