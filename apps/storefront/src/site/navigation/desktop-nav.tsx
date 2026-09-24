'use client';

import {Link, usePathname} from '@/platform/i18n/navigation';

interface NavItem {
    label: string;
    href: string;
    isActive: (pathname: string) => boolean;
}

const navItems: NavItem[] = [
    {
        label: 'Home',
        href: '/',
        isActive: (pathname) => pathname === '/',
    },
    {
        label: 'Shop',
        href: '/search',
        isActive: (pathname) =>
            pathname === '/search' ||
            pathname.startsWith('/collection/') ||
            pathname.startsWith('/product/'),
    },
    {
        label: 'Our Story',
        href: '/our-story',
        isActive: (pathname) => pathname === '/our-story',
    },
    {
        label: 'Artisans',
        href: '/artisans',
        isActive: (pathname) => pathname === '/artisans',
    },
    {
        label: 'Journal',
        href: '/journal',
        isActive: (pathname) => pathname === '/journal',
    },
    {
        label: 'Contact',
        href: '/contact',
        isActive: (pathname) => pathname === '/contact',
    },
];

export function DesktopNav() {
    const pathname = usePathname();

    return (
        <nav className="hidden lg:flex items-center gap-8 text-[13px] tracking-wide text-[#1D120A] dark:text-[#F8F4EE]">
            {navItems.map((item) => {
                const active = item.isActive(pathname);
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`transition-all ${
                            active
                                ? 'font-semibold pb-1 border-b-2 border-[#1D120A] dark:border-[#F8F4EE] text-[#1D120A] dark:text-[#F8F4EE]'
                                : 'font-medium text-[#1D120A]/75 dark:text-[#F8F4EE]/75 hover:text-[#D4A43C] dark:hover:text-[#D4A43C] pb-1 border-b-2 border-transparent'
                        }`}
                    >
                        {item.label}
                    </Link>
                );
            })}
        </nav>
    );
}
