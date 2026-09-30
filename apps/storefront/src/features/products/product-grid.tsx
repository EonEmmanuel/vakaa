import { ResultOf, readFragment } from '@/platform/vendure/graphql';
import { ProductCard } from './components/product-card';
import { Pagination } from './components/pagination';
import { SortDropdown } from '@/features/search/sort-dropdown';
import { ActiveFiltersBar } from '@/features/search/active-filters-bar';
import { SearchProductsQuery } from '@/features/search/graphql';
import { ProductCardFragment } from '@/features/products/graphql';
import { getRouteLocale } from '@/platform/i18n/server';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/platform/i18n/navigation';
import { ArrowRight } from 'lucide-react';

interface ProductGridProps {
    productDataPromise: Promise<{
        data: ResultOf<typeof SearchProductsQuery>;
        token?: string;
    }>;
    currentPage: number;
    take: number;
    searchParams?: { [key: string]: string | string[] | undefined };
}

export async function ProductGrid({ productDataPromise, currentPage, take, searchParams }: ProductGridProps) {
    const locale = await getRouteLocale();
    const t = await getTranslations({ locale, namespace: 'Product' });
    const result = await productDataPromise;

    const searchResult = result?.data?.search || { totalItems: 0, items: [] };

    const minPriceParam = searchParams?.minPrice ? Number(searchParams.minPrice) : null;
    const maxPriceParam = searchParams?.maxPrice ? Number(searchParams.maxPrice) : null;
    const priceBracket = searchParams?.price as string | undefined;

    let items = searchResult.items || [];

    if (minPriceParam !== null || maxPriceParam !== null || priceBracket) {
        items = items.filter((item) => {
            const product = readFragment(ProductCardFragment, item);
            if (!product.priceWithTax) return false;

            const rawVal = product.priceWithTax.__typename === 'SinglePrice'
                ? product.priceWithTax.value
                : product.priceWithTax.min;
            const price = rawVal / 100;

            if (minPriceParam !== null && price < minPriceParam) return false;
            if (maxPriceParam !== null && price > maxPriceParam) return false;

            if (priceBracket === 'under-75k' && price >= 75000) return false;
            if (priceBracket === '75k-150k' && (price < 75000 || price > 150000)) return false;
            if (priceBracket === 'over-150k' && price <= 150000) return false;

            return true;
        });
    }

    const totalCount = (minPriceParam !== null || maxPriceParam !== null || priceBracket)
        ? items.length
        : searchResult.totalItems;
    const totalPages = Math.ceil(totalCount / take);

    if (!items.length) {
        return (
            <div className="text-center py-16 px-6 rounded-3xl bg-[#F3EFE9] border border-[#E7DED0] space-y-4">
                <p className="font-sans text-lg sm:text-xl font-bold text-[#1D120A]">
                    {t('noProductsFound')}
                </p>
                <p className="text-xs sm:text-sm text-[#3A2418]/70 max-w-md mx-auto">
                    Aucune création ne correspond exactement à vos critères de prix ou filtres sélectionnés. Réinitialisez vos filtres pour découvrir l&apos;ensemble de la collection.
                </p>
                <div className="pt-2">
                    <Link
                        href="/search"
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#1D120A] text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider hover:bg-[#3A2418] transition-colors cursor-pointer"
                    >
                        <span>Voir tout le catalogue</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-5 sm:space-y-6">
            {/* Top Control Bar (Results count & SortDropdown) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E7DED0]">
                <p className="text-xs sm:text-sm text-[#3A2418]/75 font-medium tabular-nums">
                    {t('productCount', { count: totalCount })}
                </p>
                <SortDropdown />
            </div>

            {/* Active Filters Pill Bar */}
            <ActiveFiltersBar />

            {/* 3-Column Product Grid with #F3EFE9 Pedestals */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-7">
                {items.map((product, i) => (
                    <ProductCard key={'product-grid-item' + i} product={product} index={i} />
                ))}
            </div>

            {totalPages > 1 && (
                <div className="pt-8">
                    <Pagination currentPage={currentPage} totalPages={totalPages} />
                </div>
            )}
        </div>
    );
}
