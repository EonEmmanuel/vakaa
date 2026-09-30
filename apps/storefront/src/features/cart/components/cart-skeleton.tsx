import { Skeleton } from '@/components/ui/skeleton';

export function CartSkeleton() {
    return (
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Items Column (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
                {/* Header bar skeleton */}
                <Skeleton className="h-11 w-full rounded-xl" />

                {/* Items */}
                <div className="bg-white dark:bg-[#1A120B] rounded-2xl border border-stone-200/80 dark:border-stone-800 p-4 space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4 py-3">
                            <Skeleton className="size-20 rounded-2xl" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-5 w-48 rounded" />
                                <Skeleton className="h-4 w-28 rounded" />
                            </div>
                            <Skeleton className="h-8 w-24 rounded-lg hidden sm:block" />
                            <Skeleton className="h-5 w-20 rounded" />
                        </div>
                    ))}
                </div>

                {/* Bottom coupon & clear skeleton */}
                <div className="flex justify-between items-center pt-2">
                    <Skeleton className="h-10 w-64 rounded-full" />
                    <Skeleton className="h-6 w-32 rounded" />
                </div>
            </div>

            {/* Right Summary Column (4 cols) */}
            <div className="lg:col-span-4">
                <div className="bg-white dark:bg-[#1A120B] rounded-2xl border border-stone-200/80 dark:border-stone-800 p-6 space-y-4">
                    <Skeleton className="h-6 w-44 rounded" />
                    <div className="space-y-3 pt-2">
                        <div className="flex justify-between">
                            <Skeleton className="h-4 w-20 rounded" />
                            <Skeleton className="h-4 w-16 rounded" />
                        </div>
                        <div className="flex justify-between">
                            <Skeleton className="h-4 w-20 rounded" />
                            <Skeleton className="h-4 w-24 rounded" />
                        </div>
                        <div className="flex justify-between">
                            <Skeleton className="h-4 w-20 rounded" />
                            <Skeleton className="h-4 w-16 rounded" />
                        </div>
                        <div className="pt-3 border-t border-stone-200">
                            <div className="flex justify-between">
                                <Skeleton className="h-6 w-20 rounded" />
                                <Skeleton className="h-6 w-28 rounded" />
                            </div>
                        </div>
                    </div>
                    <Skeleton className="h-12 w-full rounded-full" />
                    <Skeleton className="h-10 w-full rounded-full" />
                </div>
            </div>
        </div>
    );
}
