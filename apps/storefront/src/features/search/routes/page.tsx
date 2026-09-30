import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { getRouteLocale } from '@/platform/i18n/server';
import { SearchResults } from "@/features/search/routes/search-results";
import { SearchTerm, SearchTermSkeleton } from "@/features/search/routes/search-term";
import { SearchResultsSkeleton } from "@/features/search/components/search-results-skeleton";
import { TrustBar } from '@/site/home/trust-bar';
import { SITE_NAME, noIndexRobots } from '@/config/metadata';

export async function generateMetadata({
    searchParams,
}: PageProps<'/[locale]/search'>): Promise<Metadata> {
    const resolvedParams = await searchParams;
    const locale = await getRouteLocale();
    const t = await getTranslations({ locale, namespace: 'Search' });
    const searchQuery = resolvedParams.q as string | undefined;

    const title = searchQuery
        ? t('resultsTitle', { query: searchQuery })
        : t('pageTitle');

    return {
        title: `${title} | ${SITE_NAME}`,
        description: searchQuery
            ? t('metaDescription', { query: searchQuery, siteName: SITE_NAME })
            : t('metaCatalogDescription', { siteName: SITE_NAME }),
        robots: noIndexRobots(),
    };
}

export default async function SearchPage({ searchParams }: PageProps<'/[locale]/search'>) {
    return (
        <div className="min-h-screen bg-[#FAF8F5] text-[#1D120A] flex flex-col">
            {/* 1. Shop Hero Header (Breadcrumbs, Title & Decorative Accents) */}
            <Suspense fallback={<SearchTermSkeleton />}>
                <SearchTerm searchParams={searchParams} />
            </Suspense>

            {/* 2. Main Shop Area (Filter Options Sidebar + Product Grid) */}
            <main className="vakaa-container py-10 sm:py-14 flex-1">
                <Suspense fallback={<SearchResultsSkeleton />}>
                    <SearchResults searchParams={searchParams} />
                </Suspense>
            </main>

            {/* 3. Universal Trust Bar at Bottom of Shop Page */}
            <TrustBar />
        </div>
    );
}
