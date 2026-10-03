'use server';

import {getLocale, getTranslations} from 'next-intl/server';
import {updateTag} from 'next/cache';
import {AddToCartMutation} from '@/features/cart/graphql';
import {getActiveCurrencyCode} from '@/features/currency/currency-server';
import {mutate, query} from '@/platform/vendure/api';
import {setAuthToken} from '@/platform/vendure/auth-token';
import {GetProductDetailQuery} from '@/features/products/graphql';

export async function addToCart(variantId: string, quantity = 1) {
    const locale = await getLocale();
    const currencyCode = await getActiveCurrencyCode();
    const t = await getTranslations({locale, namespace: 'Errors'});

    try {
        const result = await mutate(
            AddToCartMutation,
            {variantId, quantity},
            {useAuthToken: true, currencyCode},
        );

        if (result.token) await setAuthToken(result.token);

        if (result.data.addItemToOrder.__typename === 'Order') {
            updateTag('cart');
            updateTag('active-order');
            return {success: true, order: result.data.addItemToOrder};
        }
        return {success: false, error: result.data.addItemToOrder.message};
    } catch {
        return {success: false, error: t('failedAddToCart')};
    }
}

export async function addProductToCartBySlug(slug: string, quantity = 1) {
    const locale = await getLocale();
    const currencyCode = await getActiveCurrencyCode();
    const t = await getTranslations({locale, namespace: 'Errors'});

    try {
        const res = await query(
            GetProductDetailQuery,
            {slug},
            {languageCode: locale, currencyCode}
        );

        const variants = (res.data as any)?.product?.variants;
        if (!variants || variants.length === 0) {
            return {success: false, error: t('failedAddToCart')};
        }

        const targetVariant = variants.find((v: any) => v.stockLevel !== '0') || variants[0];
        return addToCart(targetVariant.id, quantity);
    } catch {
        return {success: false, error: t('failedAddToCart')};
    }
}
