'use client';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from '@/platform/i18n/navigation';
import { useTranslations } from 'next-intl';

export function SortDropdown() {
    const t = useTranslations('Sort');
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();

    const sortOptions = [
        { value: 'name-asc', label: t('nameAsc') },
        { value: 'name-desc', label: t('nameDesc') },
        { value: 'price-asc', label: t('priceAsc') },
        { value: 'price-desc', label: t('priceDesc') },
    ];

    const currentSort = searchParams.get('sort') || 'name-asc';

    const handleSortChange = (value: string | null) => {
        if (!value) return;
        const params = new URLSearchParams(searchParams);
        params.set('sort', value);
        params.delete('page'); // Reset to page 1 when sort changes
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm text-[#3A2418]/65 font-medium whitespace-nowrap hidden sm:inline">
                {t('sortBy')} :
            </span>
            <Select value={currentSort} onValueChange={handleSortChange} items={sortOptions}>
                <SelectTrigger className="w-[170px] sm:w-[190px] h-9 sm:h-10 rounded-full border border-[#E7DED0] bg-white text-xs sm:text-sm font-medium text-[#1D120A] shadow-xs focus:ring-1 focus:ring-[#D4A43C]">
                    <SelectValue placeholder={t('placeholder')} />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-[#E7DED0] bg-white text-xs sm:text-sm">
                    {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value} className="cursor-pointer">
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
