import {getRouteLocale} from '@/platform/i18n/server';
import {getTranslations} from 'next-intl/server';

interface SearchTermProps {
    searchParams: Promise<{
        q?: string
    }>;
}

export async function SearchTerm({searchParams}: SearchTermProps) {
    const searchParamsResolved = await searchParams;
    const searchTerm = (searchParamsResolved.q as string) || '';
    const locale = await getRouteLocale();
    const t = await getTranslations({locale, namespace: 'Search'});

    return (
        <div className="mb-8">
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#1D120A] dark:text-[#F8F4EE] uppercase leading-tight">
                {searchTerm ? t('resultsFor', {query: searchTerm}) : t('title')}
            </h1>
        </div>
    )
}

export function SearchTermSkeleton() {
    return (
        <div className="mb-8">
            <div className="h-10 w-64 bg-[#EFE8DD] dark:bg-[#20150D] rounded-xs animate-pulse" />
        </div>
    )
}
