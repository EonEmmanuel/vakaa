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

    // API unavailable — the section renders nothing rather than fabricated
    // products, variant IDs or prices.
    if (liveProducts.length === 0) {
        return null;
    }

    const isFr = (locale || 'fr').startsWith('fr');

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
            products={liveProducts}
            eyebrow={t('bestSellers.title')}
            title="Atelier Bolgatanga"
            viewAllLabel={t('bestSellers.viewAll')}
            categories={categories}
        />
    );
}
