import {ProductGridSkeleton} from '@/features/products/product-grid-skeleton';

export function SearchResultsSkeleton() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Filters Sidebar Skeleton */}
            <div className="lg:col-span-3">
                <div className="h-96 animate-pulse bg-[#F3EFE9] rounded-2xl border border-[#E7DED0]/60" />
            </div>

            {/* Product Grid Skeleton */}
            <div className="lg:col-span-9">
                <ProductGridSkeleton />
            </div>
        </div>
    );
}
