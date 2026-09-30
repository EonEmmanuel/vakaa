import { Link } from '@/platform/i18n/navigation';
import { getRouteLocale } from '@/platform/i18n/server';
import { getTranslations } from 'next-intl/server';

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

interface SearchTermProps {
    searchParams: Promise<{
        q?: string;
        category?: string;
    }>;
}

export async function SearchTerm({ searchParams }: SearchTermProps) {
    const searchParamsResolved = await searchParams;
    const searchTerm = (searchParamsResolved.q as string) || '';
    const category = (searchParamsResolved.category as string) || '';
    const locale = await getRouteLocale();
    const t = await getTranslations({ locale, namespace: 'Search' });

    let pageTitle = t('title');
    if (searchTerm) {
        pageTitle = t('resultsFor', { query: searchTerm });
    } else if (category) {
        if (category === 'tote-bags') pageTitle = 'Sacs Cabas & Totes';
        else if (category === 'shoulder-bags') pageTitle = 'Porté Épaule & Baguettes';
        else if (category === 'clutches') pageTitle = 'Pochettes & Minaudières';
        else pageTitle = category.replace(/-/g, ' ');
    }

    return (
        <section className="relative w-full overflow-hidden bg-[#FAF8F5] border-b border-[#E7DED0]/60 pt-28 sm:pt-32 pb-12 sm:pb-16 text-center transition-colors">
            {/* Decorative dot clusters on left and right (FutureCommerce style) */}
            <div className="absolute left-4 sm:left-12 top-1/2 -translate-y-1/2 w-32 sm:w-44 h-20 pointer-events-none opacity-70">
                <DecorativeDotCluster className="w-full h-full" />
            </div>
            <div className="absolute right-4 sm:right-12 top-1/2 -translate-y-1/2 w-32 sm:w-44 h-20 pointer-events-none opacity-70 transform rotate-180">
                <DecorativeDotCluster className="w-full h-full" />
            </div>

            <div className="vakaa-container relative z-10 space-y-3">
                {/* Title */}
                <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1D120A] leading-tight">
                    {pageTitle}
                </h1>

                {/* Breadcrumbs */}
                <nav aria-label="Fil d'ariane" className="flex items-center justify-center gap-2 text-xs sm:text-sm text-[#3A2418]/60">
                    <Link
                        href="/"
                        className="hover:text-[#A66B2D] transition-colors cursor-pointer"
                    >
                        {t('home')}
                    </Link>
                    <span className="text-[#3A2418]/30">/</span>
                    <Link
                        href="/search"
                        className={!searchTerm && !category ? "font-semibold text-[#1D120A]" : "hover:text-[#A66B2D] transition-colors cursor-pointer"}
                    >
                        {t('shop')}
                    </Link>
                    {searchTerm && (
                        <>
                            <span className="text-[#3A2418]/30">/</span>
                            <span className="font-semibold text-[#1D120A] truncate max-w-xs">
                                « {searchTerm} »
                            </span>
                        </>
                    )}
                    {category && !searchTerm && (
                        <>
                            <span className="text-[#3A2418]/30">/</span>
                            <span className="font-semibold text-[#1D120A] truncate max-w-xs">
                                {pageTitle}
                            </span>
                        </>
                    )}
                </nav>
            </div>
        </section>
    );
}

export function SearchTermSkeleton() {
    return (
        <section className="relative w-full bg-[#FAF8F5] border-b border-[#E7DED0]/60 pt-28 sm:pt-32 pb-12 sm:pb-16 text-center">
            <div className="vakaa-container space-y-3 flex flex-col items-center">
                <div className="h-10 w-48 sm:w-72 bg-[#EFE8DD] rounded-xl animate-pulse" />
                <div className="h-4 w-32 bg-[#EFE8DD]/70 rounded-full animate-pulse" />
            </div>
        </section>
    );
}
