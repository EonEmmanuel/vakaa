'use client';

import {Link, usePathname} from '@/platform/i18n/navigation';
import {useTranslations} from 'next-intl';

export function DesktopNav() {
    const t = useTranslations('Navigation');
    const pathname = usePathname();

    const navItems = [
        {
            label: t('home'),
            href: '/',
            isActive: (path: string) => path === '/',
        },
        {
            label: t('shop'),
            href: '/search',
            isActive: (path: string) =>
                path === '/search' ||
                path.startsWith('/collection/') ||
                path.startsWith('/product/'),
        },
        {
            label: t('ourStory'),
            href: '/our-story',
            isActive: (path: string) => path === '/our-story',
        },
        {
            label: t('artisans'),
            href: '/artisans',
            isActive: (path: string) => path === '/artisans',
        },
        {
            label: t('journal'),
            href: '/journal',
            isActive: (path: string) => path === '/journal',
        },
        {
            label: t('contact'),
            href: '/contact',
            isActive: (path: string) => path === '/contact',
        },
    ];

    return (
        <nav aria-label={t('menu')} className="hidden lg:flex items-center gap-0.5 xl:gap-1.5 text-[13px] xl:text-[14px]">
            {navItems.map((item) => {
                const active = item.isActive(pathname);
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`rounded-full px-2.5 xl:px-3 py-1.5 font-medium transition-colors cursor-pointer select-none whitespace-nowrap ${
                            active
                                ? 'text-[#1D120A] dark:text-[#fbfaf7] font-semibold bg-black/5 dark:bg-white/5'
                                : 'text-[#57544c] hover:text-[#1D120A] dark:text-[#a6a29a] dark:hover:text-[#fbfaf7] hover:bg-black/5 dark:hover:bg-white/5'
                        }`}
                    >
                        {item.label}
                    </Link>
                );
            })}
        </nav>
    );
}
