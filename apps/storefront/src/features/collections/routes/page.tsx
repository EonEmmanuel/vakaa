import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Link } from '@/platform/i18n/navigation';
import { query } from '@/platform/vendure/api';
import {SearchProductsQuery} from '@/features/search/graphql';
import {GetCollectionProductsQuery} from '@/features/collections/graphql';
import {ProductGrid} from '@/features/products/product-grid';
import {FacetFilters} from '@/features/search/facet-filters';
import {ProductGridSkeleton} from '@/features/products/product-grid-skeleton';
import { buildSearchInput, getCurrentPage } from '@/features/search/search-helpers';
import { cacheLife, cacheTag } from 'next/cache';

import { routing } from '@/platform/i18n/routing';
import {
    SITE_NAME,
    truncateDescription,
    buildCanonicalUrl,
    buildOgImages,
} from '@/config/metadata';
import {toOgLocale} from '@/platform/i18n/locale-utils';
import {getActiveCurrencyCode} from '@/features/currency/currency-server';
import {getRouteLocale} from '@/platform/i18n/server';
import {getTranslations} from 'next-intl/server';
import {TrustBar} from '@/site/home/trust-bar';

async function getCollectionProducts(slug: string, searchParams: { [key: string]: string | string[] | undefined }, currencyCode: string) {
    'use cache';
    cacheLife('hours');

    const locale = await getRouteLocale();
    cacheTag(`collection-${slug}-${locale}-${currencyCode}`);
    cacheTag('collection');

    return query(SearchProductsQuery, {
        input: buildSearchInput({
            searchParams,
            collectionSlug: slug
        })
    }, {languageCode: locale, currencyCode}).catch(() => ({
        data: {
            search: {
                totalItems: 0,
                items: [],
                facetValues: []
            }
        }
    } as any));
}

async function getCollectionMetadata(slug: string) {
    'use cache';
    cacheLife('hours');

    const locale = await getRouteLocale();
    cacheTag(`collection-meta-${slug}-${locale}`);

    return query(GetCollectionProductsQuery, {
        slug,
        input: { take: 0, collectionSlug: slug, groupByProduct: true },
    }, {languageCode: locale});
}

export async function generateMetadata({
    params,
}: PageProps<'/[locale]/collection/[slug]'>): Promise<Metadata> {
    const { slug } = await params;
    const locale = await getRouteLocale();
    const result = await getCollectionMetadata(slug);
    const collection = result?.data?.collection;

    const t = await getTranslations({locale, namespace: 'Collection'});

    if (!collection) {
        return {
            title: slug.replace(/-/g, ' ').toUpperCase(),
        };
    }

    const description =
        truncateDescription(collection.description) ||
        t('browseCollectionAt', {name: collection.name, siteName: SITE_NAME});
    const ogLocale = toOgLocale(locale);
    const collectionPath = `/collection/${collection.slug}`;

    return {
        title: collection.name,
        description,
        alternates: {
            canonical: buildCanonicalUrl(`/${locale}${collectionPath}`),
            languages: Object.fromEntries(
                routing.locales.map((l) => [l, buildCanonicalUrl(`/${l}${collectionPath}`)])
            ),
        },
        openGraph: {
            title: collection.name,
            description,
            type: 'website',
            locale: ogLocale,
            url: buildCanonicalUrl(`/${locale}${collectionPath}`),
            images: buildOgImages(collection.featuredAsset?.preview, collection.name),
        },
        twitter: {
            card: 'summary_large_image',
            title: collection.name,
            description,
            images: collection.featuredAsset?.preview
                ? [collection.featuredAsset.preview]
                : undefined,
        },
    };
}

function DecorativeDotCluster({ className = "" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 160 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-hidden="true"
        >
            <g fill="#D4A43C" fillOpacity="0.25">
                <circle cx="20" cy="20" r="3" />
                <circle cx="40" cy="15" r="2.5" />
                <circle cx="60" cy="25" r="3" />
                <circle cx="80" cy="18" r="2" />
                <circle cx="100" cy="28" r="3.5" />
                <circle cx="120" cy="16" r="2.5" />
                <circle cx="140" cy="24" r="3" />

                <circle cx="30" cy="45" r="3.5" />
                <circle cx="50" cy="40" r="2" />
                <circle cx="70" cy="50" r="3" />
                <circle cx="90" cy="42" r="2.5" />
                <circle cx="110" cy="52" r="3" />
                <circle cx="130" cy="44" r="2" />

                <circle cx="40" cy="65" r="2.5" />
                <circle cx="60" cy="70" r="3" />
                <circle cx="80" cy="62" r="2" />
                <circle cx="100" cy="68" r="3" />
            </g>
        </svg>
    );
}

export default async function CollectionPage({params, searchParams}: PageProps<'/[locale]/collection/[slug]'>) {
    const { slug } = await params;
    const searchParamsResolved = await searchParams;
    const locale = await getRouteLocale();
    const currencyCode = await getActiveCurrencyCode();
    const t = await getTranslations({locale, namespace: 'Collection'});
    const tSearch = await getTranslations({locale, namespace: 'Search'});
    const page = getCurrentPage(searchParamsResolved);

    const productDataPromise = getCollectionProducts(slug, searchParamsResolved, currencyCode);
    const collectionResult = await getCollectionMetadata(slug);
    const rawCollectionName = collectionResult?.data?.collection?.name ?? slug.replace(/-/g, ' ');
    // Title Case formatting
    const collectionName = rawCollectionName.charAt(0).toUpperCase() + rawCollectionName.slice(1);
    const collectionDescription = collectionResult?.data?.collection?.description;

    return (
        <div className="min-h-screen bg-[#FAF8F5] text-[#1D120A] flex flex-col">
            {/* 1. Shop Collection Hero Header */}
            <section className="relative w-full overflow-hidden bg-[#FAF8F5] border-b border-[#E7DED0]/60 pt-28 sm:pt-32 pb-12 sm:pb-16 text-center transition-colors">
                <div className="absolute left-4 sm:left-12 top-1/2 -translate-y-1/2 w-32 sm:w-44 h-20 pointer-events-none opacity-70">
                    <DecorativeDotCluster className="w-full h-full" />
                </div>
                <div className="absolute right-4 sm:right-12 top-1/2 -translate-y-1/2 w-32 sm:w-44 h-20 pointer-events-none opacity-70 transform rotate-180">
                    <DecorativeDotCluster className="w-full h-full" />
                </div>

                <div className="vakaa-container relative z-10 space-y-3 max-w-3xl mx-auto">
                    <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1D120A] leading-tight">
                        {collectionName}
                    </h1>

                    {collectionDescription && (
                        <p className="text-sm sm:text-base text-[#3A2418]/70 leading-relaxed font-sans max-w-xl mx-auto">
                            {collectionDescription}
                        </p>
                    )}

                    {/* Breadcrumbs */}
                    <nav aria-label="Fil d'ariane" className="flex items-center justify-center gap-2 text-xs sm:text-sm text-[#3A2418]/60 pt-1">
                        <Link
                            href="/"
                            className="hover:text-[#A66B2D] transition-colors cursor-pointer"
                        >
                            {t('home')}
                        </Link>
                        <span className="text-[#3A2418]/30">/</span>
                        <Link
                            href="/search"
                            className="hover:text-[#A66B2D] transition-colors cursor-pointer"
                        >
                            {tSearch('shop')}
                        </Link>
                        <span className="text-[#3A2418]/30">/</span>
                        <span className="font-semibold text-[#1D120A]">
                            {collectionName}
                        </span>
                    </nav>
                </div>
            </section>

            {/* 2. Main Area (12-column layout: col-span-3 Filters + col-span-9 Grid) */}
            <main className="vakaa-container py-10 sm:py-14 flex-1">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
                    {/* Filters Sidebar */}
                    <div className="lg:col-span-3">
                        <Suspense fallback={<div className="h-96 animate-pulse bg-[#F3EFE9] rounded-2xl" />}>
                            <FacetFilters productDataPromise={productDataPromise} />
                        </Suspense>
                    </div>

                    {/* Product Grid */}
                    <div className="lg:col-span-9">
                        <Suspense fallback={<ProductGridSkeleton />}>
                            <ProductGrid productDataPromise={productDataPromise} currentPage={page} take={12} searchParams={searchParamsResolved} />
                        </Suspense>
                    </div>
                </div>
            </main>

            {/* 3. Universal Trust Bar */}
            <TrustBar />
        </div>
    );
}
