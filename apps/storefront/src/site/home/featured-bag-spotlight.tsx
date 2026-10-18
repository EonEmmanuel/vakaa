import { query } from '@/platform/vendure/api';
import { GetProductDetailQuery } from '@/features/products/graphql';
import { getRouteLocale } from '@/platform/i18n/server';
import { getActiveCurrencyCode } from '@/features/currency/currency-server';
import { cacheLife, cacheTag } from 'next/cache';
import { FeaturedBagSpotlightGrid } from './featured-bag-spotlight-grid';

// Signature pieces for the editorial spotlight; real catalog slugs.
const FEATURED_BAG_SLUGS = ['baguette-terre-emeraude', 'maa-tote'] as const;

export interface FeaturedBagProduct {
    name: string;
    slug: string;
    imageUrl: string | null;
    priceWithTax: number | null;
    material: string | null;
}

async function getFeaturedBag(locale: string, currencyCode: string, slug: string): Promise<FeaturedBagProduct | null> {
    'use cache';
    cacheLife('hours');
    cacheTag('products');

    try {
        const result = await query(
            GetProductDetailQuery,
            { slug },
            { languageCode: locale, currencyCode }
        );
        const product = result.data?.product;
        if (!product) return null;
        const prices = (product.variants || [])
            .map((variant) => variant.priceWithTax)
            .filter((price): price is number => typeof price === 'number');
        const preview = product.assets?.[0]?.preview;
        return {
            name: product.name,
            slug: product.slug,
            imageUrl: preview ? String(preview) : null,
            priceWithTax: prices.length > 0 ? Math.min(...prices) : null,
            material: typeof product.customFields?.material === 'string'
                ? product.customFields.material
                : null,
        };
    } catch {
        return null;
    }
}

export async function FeaturedBagSpotlight() {
    const locale = await getRouteLocale();
    const currencyCode = await getActiveCurrencyCode();
    const products = await Promise.all(
        FEATURED_BAG_SLUGS.map((slug) => getFeaturedBag(locale, currencyCode, slug))
    );
    const featured = products.filter((product): product is FeaturedBagProduct => product !== null);

    // Real data only — no invented prices, materials or names; the section
    // renders nothing while the API is unavailable.
    if (featured.length === 0) {
        return null;
    }

    return <FeaturedBagSpotlightGrid products={featured} />;
}
