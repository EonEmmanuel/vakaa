import {ProductCarousel} from "@/features/products/components/product-carousel";
import {getRouteLocale} from "@/platform/i18n/server";
import {cacheLife, cacheTag} from "next/cache";
import {getActiveCurrencyCode} from '@/features/currency/currency-server';
import {query} from "@/platform/vendure/api";
import {GetCollectionProductsQuery} from '@/features/collections/graphql';
import {getTranslations} from 'next-intl/server';

async function getFeaturedCollectionProducts(currencyCode: string) {
    'use cache'
    cacheLife('days')

    const locale = await getRouteLocale();
    cacheTag(`featured-${locale}-${currencyCode}`);
    cacheTag('products');

    try {
        const result = await query(GetCollectionProductsQuery, {
            slug: "bags",
            input: {
                collectionSlug: "bags",
                take: 8,
                skip: 0,
                groupByProduct: true
            }
        }, {languageCode: locale, currencyCode});

        return result.data?.search?.items || [];
    } catch {
        return [];
    }
}

export async function FeaturedProducts() {
    const locale = await getRouteLocale();
    const currencyCode = await getActiveCurrencyCode();
    const t = await getTranslations({locale, namespace: 'Product'});
    const products = await getFeaturedCollectionProducts(currencyCode);

    if (!products || products.length === 0) {
        return null;
    }

    return (
        <ProductCarousel
            title={t('featuredProducts')}
            products={products}
        />
    );
}
