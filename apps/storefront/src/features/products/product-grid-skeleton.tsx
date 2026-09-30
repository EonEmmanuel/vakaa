export function ProductGridSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7DED0]">
                <div className="h-4 w-32 bg-[#EFE8DD] animate-pulse rounded-full" />
                <div className="h-9 w-40 bg-[#EFE8DD] animate-pulse rounded-full" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-7">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex flex-col space-y-3">
                        <div className="aspect-[3/4] w-full bg-[#F3EFE9] animate-pulse rounded-2xl sm:rounded-3xl" />
                        <div className="space-y-1.5 pt-1">
                            <div className="flex justify-between items-center">
                                <div className="h-3 w-20 bg-[#EFE8DD] animate-pulse rounded-full" />
                                <div className="h-3 w-10 bg-[#EFE8DD] animate-pulse rounded-full" />
                            </div>
                            <div className="h-4 w-3/4 bg-[#EFE8DD] animate-pulse rounded-lg" />
                            <div className="h-4 w-1/3 bg-[#EFE8DD] animate-pulse rounded-lg" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
