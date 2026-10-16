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
            <span className="text-xs sm:text-sm text-[#57544c] dark:text-[#a5a195] font-medium whitespace-nowrap hidden sm:inline">
                {t('sortBy')} :
            </span>
            <Select value={currentSort} onValueChange={handleSortChange} items={sortOptions}>
                <SelectTrigger className="w-[170px] sm:w-[190px] h-9 sm:h-10 rounded-full border border-[#e2ddd2] dark:border-[#2e2c28] bg-[#fbfaf7] dark:bg-[#1a1916] text-xs sm:text-sm font-medium text-[#1c1b18] dark:text-[#fbfaf7] shadow-xs focus:ring-1 focus:ring-[#D4A43C]">
                    <SelectValue placeholder={t('placeholder')} />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-[#e2ddd2] dark:border-[#2e2c28] bg-[#fbfaf7] dark:bg-[#1a1916] text-[#1c1b18] dark:text-[#fbfaf7] text-xs sm:text-sm">
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
