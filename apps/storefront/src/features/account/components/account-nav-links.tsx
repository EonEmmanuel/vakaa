'use client';

import {Link, usePathname} from '@/platform/i18n/navigation';
import {cn} from '@/lib/utils';
import {Package, User, MapPin, KeyRound, LogOut} from 'lucide-react';
import type {LucideIcon} from 'lucide-react';
import {useTranslations} from 'next-intl';

const iconMap: Record<string, LucideIcon> = {
    Package,
    MapPin,
    User,
    KeyRound,
    LogOut,
};

export interface NavItem {
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
            <nav className="flex gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
                {items.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/account' && pathname.startsWith(item.href));
                    const Icon = iconMap[item.icon];
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all duration-150 shrink-0 border cursor-pointer select-none active:scale-[0.98]',
                                isActive
                                    ? 'bg-[#EAA838] border-[#EAA838] text-white shadow-xs font-bold'
                                    : 'bg-white dark:bg-[#160E08] border-[#EAE6DF] dark:border-[#3A291C] text-[#3A2418] dark:text-[#E0D8D0] hover:bg-[#FAF6EE] dark:hover:bg-[#22160E] hover:border-[#D4A43C]/40'
                            )}
                        >
                            {Icon && <Icon className={cn('h-3.5 w-3.5', isActive ? 'text-white' : 'text-[#A66B2D]')} />}
                            <span>{t(item.labelKey)}</span>
                        </Link>
                    );
                })}
            </nav>
        );
    }

    return (
        <nav className="space-y-2.5">
            {items.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/account' && pathname.startsWith(item.href));
                const Icon = iconMap[item.icon];
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            'flex items-center justify-between w-full px-5 py-3.5 text-sm font-semibold rounded-xl border transition-all duration-150 cursor-pointer select-none active:scale-[0.98]',
                            isActive
                                ? 'bg-[#EAA838] border-[#EAA838] text-white shadow-xs font-bold'
                                : 'bg-white dark:bg-[#160E08] border-[#EAE6DF] dark:border-[#3A291C] text-[#2C1D13] dark:text-[#E8E0D5] hover:bg-[#FAF6EE] dark:hover:bg-[#22160E] hover:border-[#D4A43C]/40 hover:text-[#1D120A]'
                        )}
                    >
                        <div className="flex items-center gap-3.5">
                            {Icon && <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-white' : 'text-[#A66B2D]')} />}
                            <span>{t(item.labelKey)}</span>
                        </div>
                        {isActive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                        )}
                    </Link>
                );
            })}
        </nav>
    );
}

