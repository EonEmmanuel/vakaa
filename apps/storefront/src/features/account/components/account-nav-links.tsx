'use client';

import {Link, usePathname} from '@/platform/i18n/navigation';
import {cn} from '@/lib/utils';
import {Package, User, MapPin} from 'lucide-react';
import type {LucideIcon} from 'lucide-react';
import {useTranslations} from 'next-intl';

const iconMap: Record<string, LucideIcon> = {
    Package,
    MapPin,
    User,
};

interface NavItem {
    href: string;
    labelKey: string;
    icon: string;
}

interface AccountNavLinksProps {
    items: NavItem[];
    layout: 'horizontal' | 'vertical';
}

export function AccountNavLinks({items, layout}: AccountNavLinksProps) {
    const pathname = usePathname();
    const t = useTranslations('Account');

    if (layout === 'horizontal') {
        return (
            <nav className="flex gap-2 overflow-x-auto border-b border-[#E7DED0]/60 dark:border-[#3A291C]/60 pb-px">
                {items.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    const Icon = iconMap[item.icon];
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider whitespace-nowrap border-b-2 transition-all',
                                isActive
                                    ? 'border-[#D4A43C] text-[#1D120A] dark:text-[#F8F4EE]'
                                    : 'border-transparent text-[#6B5E55] dark:text-[#B5A496] hover:text-[#1D120A] dark:hover:text-[#F8F4EE]'
                            )}
                        >
                            {Icon && <Icon className={cn('h-4 w-4', isActive && 'text-[#D4A43C]')} />}
                            {t(item.labelKey)}
                        </Link>
                    );
                })}
            </nav>
        );
    }

    return (
        <nav className="space-y-1.5 p-1 rounded-lg bg-[#FAF7F2] dark:bg-[#160E08] border border-[#E7DED0]/60 dark:border-[#3A291C]/60">
            {items.map((item) => {
                const isActive = pathname.startsWith(item.href);
                const Icon = iconMap[item.icon];
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            'flex items-center justify-between px-4 py-3 text-xs font-semibold uppercase tracking-wider rounded-md transition-all',
                            isActive
                                ? 'bg-[#EFE8DD] dark:bg-[#22160E] text-[#1D120A] dark:text-[#F8F4EE] border-l-2 border-[#D4A43C] shadow-xs'
                                : 'text-[#6B5E55] dark:text-[#B5A496] hover:bg-[#EFE8DD]/50 dark:hover:bg-[#22160E]/50 hover:text-[#1D120A] dark:hover:text-[#F8F4EE]'
                        )}
                    >
                        <div className="flex items-center gap-3">
                            {Icon && <Icon className={cn('h-4 w-4', isActive && 'text-[#D4A43C]')} />}
                            <span>{t(item.labelKey)}</span>
                        </div>
                        {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#D4A43C]" />}
                    </Link>
                );
            })}
        </nav>
    );
}
