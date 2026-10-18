import { getTranslations } from 'next-intl/server';
import { getRouteLocale } from '@/platform/i18n/server';
import { getActiveCurrencyCode } from '@/features/currency/currency-server';
import { query } from '@/platform/vendure/api';
import { SearchProductsQuery } from '@/features/search/graphql';
import { FragmentOf } from '@/platform/vendure/graphql';
import { ProductCardFragment } from '@/features/products/graphql';
import { cacheLife, cacheTag } from 'next/cache';
import { BestSellersShowcase, CategoryTab } from './best-sellers-showcase';

async function getBestSellerProducts(locale: string, currencyCode: string): Promise<Array<FragmentOf<typeof ProductCardFragment>>> {
    'use cache';
    cacheLife('hours');
    cacheTag('products');

    try {
        const result = await query(
            SearchProductsQuery,
            {
                input: {
                    take: 24,
                    skip: 0,
                    groupByProduct: true,
                },
            },
            { languageCode: locale, currencyCode }
        );
        return (result.data?.search?.items as Array<FragmentOf<typeof ProductCardFragment>>) || [];
    } catch {
        return [];
    }
}

export async function BestSellersPreview() {
    const locale = await getRouteLocale();
    const currencyCode = await getActiveCurrencyCode();
    const t = await getTranslations({ locale, namespace: 'Home' });
    const liveProducts = await getBestSellerProducts(locale, currencyCode);

    const isFr = (locale || 'fr').startsWith('fr');

    const fallbackProducts = [
        {
            productId: 'vakaa-baguette-savane',
            productName: 'Le Sac Baguette Savane',
            slug: 'baguette-indigo-savane',
            productVariantId: '2',
            productAsset: {
                id: 'asset-baguette-1',
                preview: '/images/bags/baguette-indigo-savane-transparent.png',
            },
            priceWithTax: {
                __typename: 'SinglePrice' as const,
                value: 8500000,
            },
            currencyCode: currencyCode || 'XAF',
        },
        {
            productId: 'vakaa-maa-tote',
            productName: 'Le Grand Cabas Maa',
            slug: 'maa-tote',
            productVariantId: '1',
            productAsset: {
                id: 'asset-maa-1',
                preview: '/images/bags/maa-tote-transparent.png',
            },
            priceWithTax: {
                __typename: 'SinglePrice' as const,
                value: 9500000,
            },
            currencyCode: currencyCode || 'XAF',
        },
        {
            productId: 'vakaa-zuri-clutch',
            productName: 'La Pochette Bijou Zuri',
            slug: 'zuri-clutch',
            productVariantId: '5',
            productAsset: {
                id: 'asset-zuri-1',
                preview: '/images/bags/zuri-clutch-transparent.png',
            },
            priceWithTax: {
                __typename: 'SinglePrice' as const,
                value: 5500000,
            },
            currencyCode: currencyCode || 'XAF',
        },
        {
            productId: 'vakaa-kemi-shoulder',
            productName: 'Le Sac Porté Épaule Kemi',
            slug: 'kemi-shoulder-bag',
            productVariantId: '4',
            productAsset: {
                id: 'asset-kemi-1',
                preview: '/images/bags/kemi-shoulder-transparent.png',
            },
            priceWithTax: {
                __typename: 'SinglePrice' as const,
                value: 8000000,
            },
            currencyCode: currencyCode || 'XAF',
        },
        {
            productId: 'vakaa-baguette-terre-emeraude',
            productName: 'Le Sac Baguette Terre Émeraude',
            slug: 'baguette-terre-emeraude',
            productVariantId: '3',
            productAsset: {
                id: 'asset-baguette-2',
                preview: '/images/bags/baguette-terre-emeraude-transparent.png',
            },
            priceWithTax: {
                __typename: 'SinglePrice' as const,
                value: 8500000,
            },
            currencyCode: currencyCode || 'XAF',
        },
        {
            productId: 'vakaa-cabas-nomade',
            productName: 'Le Grand Cabas Tressé Savane',
            slug: 'cabas-maa-raphia',
            productVariantId: '1',
            productAsset: {
                id: 'asset-cabas-nomade',
                preview: '/images/bags/maa-tote-transparent.png',
            },
            priceWithTax: {
                __typename: 'SinglePrice' as const,
                value: 11000000,
            },
            currencyCode: currencyCode || 'XAF',
        },
        {
            productId: 'vakaa-aya-cardholder',
            productName: 'Le Porte-Cartes Artisanal Aya',
            slug: 'aya-cardholder',
            productVariantId: '6',
            productAsset: {
                id: 'asset-aya-1',
                preview: '/images/bags/aya-cardholder-transparent.png',
            },
            priceWithTax: {
                __typename: 'SinglePrice' as const,
                value: 3500000,
            },
            currencyCode: currencyCode || 'XAF',
        },
        {
            productId: 'vakaa-asa-crossbody',
            productName: 'Le Sac Bandoulière Asa',
            slug: 'asa-crossbody',
            productVariantId: '7',
            productAsset: {
                id: 'asset-asa-1',
                preview: '/images/bags/asa-crossbody-transparent.png',
            },
            priceWithTax: {
                __typename: 'SinglePrice' as const,
                value: 7500000,
            },
            currencyCode: currencyCode || 'XAF',
        },
    ];

    const displayProducts = liveProducts.length > 0
        ? liveProducts
        : (fallbackProducts as unknown as Array<FragmentOf<typeof ProductCardFragment>>);

    const categories: CategoryTab[] = isFr
        ? [
            { id: 'all', name: 'Tous' },
            { id: 'cabas', name: 'Sacs & Cabas' },
            { id: 'epaule', name: 'Sacs Épaule' },
            { id: 'pochettes', name: 'Pochettes & Soirée' },
            { id: 'accessoires', name: 'Petite Maroquinerie' },
        ]
        : [
            { id: 'all', name: 'All' },
            { id: 'cabas', name: 'Totes & Baskets' },
            { id: 'epaule', name: 'Shoulder Bags' },
            { id: 'pochettes', name: 'Clutches & Evening' },
            { id: 'accessoires', name: 'Small Leather Goods' },
        ];

    return (
        <BestSellersShowcase
            products={displayProducts}
            eyebrow={t('bestSellers.title')}
            title="Atelier Bolgatanga"
            viewAllLabel={t('bestSellers.viewAll')}
            categories={categories}
        />
    );
}
