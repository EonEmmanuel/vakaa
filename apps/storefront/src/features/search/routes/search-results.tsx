import {Suspense} from "react";
import {getRouteLocale} from "@/platform/i18n/server";
import {getActiveCurrencyCode} from '@/features/currency/currency-server';
import {FacetFilters} from '@/features/search/facet-filters';
import {ProductGridSkeleton} from '@/features/products/product-grid-skeleton';
import {ProductGrid} from '@/features/products/product-grid';
import {buildSearchInput, getCurrentPage} from "@/features/search/search-helpers";
import {query} from "@/platform/vendure/api";
import type {ResultOf} from "@/platform/vendure/graphql";
import {SearchProductsQuery} from '@/features/search/graphql';

interface SearchResultsProps {
    searchParams: Promise<{
        page?: string
    }>
}

export async function SearchResults({searchParams}: SearchResultsProps) {
    const searchParamsResolved = await searchParams;
    const locale = await getRouteLocale();
    const currencyCode = await getActiveCurrencyCode();
    const page = getCurrentPage(searchParamsResolved);

    const productDataPromise = query(SearchProductsQuery, {
        input: buildSearchInput({searchParams: searchParamsResolved})
    }, {languageCode: locale, currencyCode}).catch(() => ({
        data: {
            search: {
                totalItems: 0,
                items: [],
                facetValues: []
            }
        }
    } as unknown as { data: ResultOf<typeof SearchProductsQuery> }));


    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Filters Sidebar (col-span-3) */}
            <div className="lg:col-span-3">
                <Suspense fallback={<div className="h-96 animate-pulse bg-[#fbfaf7] border border-[#e2ddd2] rounded-2xl" />}>
                    <FacetFilters productDataPromise={productDataPromise} />
                </Suspense>
            </div>

            {/* Product Grid (col-span-9) */}
            <div className="lg:col-span-9">
                <Suspense fallback={<ProductGridSkeleton />}>
                    <ProductGrid productDataPromise={productDataPromise} currentPage={page} take={12} searchParams={searchParamsResolved} />
                </Suspense>
            </div>
        </div>
    );
}
