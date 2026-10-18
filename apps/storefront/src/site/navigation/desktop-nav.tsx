'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, usePathname } from '@/platform/i18n/navigation';
import { useTranslations } from 'next-intl';

export function DesktopNav() {
    const t = useTranslations('Navigation');
    const pathname = usePathname();
    const [hovered, setHovered] = useState<string | null>(null);

    const navItems = [
        {
            label: t('home'),
            href: '/',
            isActive: (path: string) => path === '/' || path === '',
        },
        {
            label: t('shop'),
            href: '/search',
            isActive: (path: string) =>
                path === '/search' ||
                path.startsWith('/search') ||
                path.startsWith('/collection') ||
                path.startsWith('/product'),
        },
        {
            label: t('ourStory'),
            href: '/our-story',
            isActive: (path: string) => path.startsWith('/our-story'),
        },
        {
            label: t('artisans'),
            href: '/artisans',
            isActive: (path: string) => path.startsWith('/artisans'),
        },
        {
            label: t('journal'),
            href: '/journal',
            isActive: (path: string) => path.startsWith('/journal'),
        },
        {
            label: t('contact'),
            href: '/contact',
            isActive: (path: string) => path.startsWith('/contact'),
        },
    ];

    return (
        <nav aria-label={t('menu')}>
            <ul
                className="hidden lg:flex items-center gap-0.5 xl:gap-1 text-[13px] xl:text-[14px]"
                onMouseLeave={() => setHovered(null)}
            >
                {navItems.map((item) => {
                    const active = item.isActive(pathname);
                    return (
                        <li key={item.href} onMouseEnter={() => setHovered(item.href)}>
                            <Link
                                href={item.href}
                                className={`relative isolate block rounded-full px-3 xl:px-3.5 py-1.5 transition-colors cursor-pointer select-none whitespace-nowrap ${
                                    active
                                        ? 'text-white dark:text-[#1c1b18] font-bold'
                                        : 'text-[#57544c] hover:text-[#1c1b18] dark:text-[#a6a29a] dark:hover:text-[#fbfaf7] font-medium'
                                }`}
                                aria-current={active ? 'page' : undefined}
                            >
                                {active && (
                                    <motion.span
                                        layoutId="desktop-nav-active"
                                        className="absolute inset-0 -z-10 rounded-full bg-[#1c1b18] dark:bg-[#fbfaf7]"
                                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                                    />
                                )}
                                {hovered === item.href && !active && (
                                    <motion.span
                                        layoutId="desktop-nav-hover"
                                        className="absolute inset-0 -z-10 rounded-full bg-black/[0.06] dark:bg-white/[0.08]"
                                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                                    />
                                )}
                                {item.label}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
