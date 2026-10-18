import { getTranslations } from 'next-intl/server';
import { getRouteLocale } from '@/platform/i18n/server';
import { getActiveCurrencyCode } from '@/features/currency/currency-server';
import { query } from '@/platform/vendure/api';
import { SearchProductsQuery } from '@/features/search/graphql';
import { COLLECTION_TABS } from '@/features/collections/collection-config';
import { FragmentOf } from '@/platform/vendure/graphql';
import { ProductCardFragment } from '@/features/products/graphql';
import { cacheLife, cacheTag } from 'next/cache';
import { BestSellersShowcase } from './best-sellers-showcase';
import type { ShowcaseTab } from './best-sellers-showcase';

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

async function getCollectionTabProducts(locale: string, currencyCode: string, collectionSlug: string): Promise<Array<FragmentOf<typeof ProductCardFragment>>> {
    'use cache';
    cacheLife('hours');
    cacheTag('products');

    try {
        const result = await query(
            SearchProductsQuery,
            {
                input: {
                    collectionSlug,
                    take: 8,
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

    const collectionResults = await Promise.all(
        COLLECTION_TABS.map(({ slug }) => getCollectionTabProducts(locale, currencyCode, slug))
    );

    const tabs: ShowcaseTab[] = [
        { id: 'all', name: t('bestSellers.tabs.all'), items: liveProducts },
        ...COLLECTION_TABS.map(({ slug, messageKey }, i) => ({
            id: slug,
            name: t(`bestSellers.tabs.${messageKey}`),
            items: collectionResults[i],
        })),
    ].filter((tab) => tab.items.length > 0);

    return (
        <BestSellersShowcase
            tabs={tabs}
            eyebrow={t('bestSellers.title')}
            title="Atelier Bolgatanga"
        />
    );
}
