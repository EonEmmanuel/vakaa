import type {Metadata} from 'next';
import {Suspense} from 'react';
import {noIndexRobots} from '@/config/metadata';
import {AccountNavLinks, type NavItem} from '@/features/account/components/account-nav-links';
import {DecorativeDotCluster} from '@/components/ui/decorative-dot-cluster';
import {TrustBar} from '@/site/home/trust-bar';
import {Link} from '@/platform/i18n/navigation';
import {getRouteLocale} from '@/platform/i18n/server';
import {getTranslations} from 'next-intl/server';

export const metadata: Metadata = {
    robots: noIndexRobots(),
};

const navItems: NavItem[] = [
    {href: '/account/profile', labelKey: 'personalInformation', icon: 'User'},
    {href: '/account/orders', labelKey: 'orders', icon: 'Package'},
    {href: '/account/addresses', labelKey: 'addresses', icon: 'MapPin'},
    {href: '/account/password', labelKey: 'passwordManager', icon: 'KeyRound'},
    {href: '/account/logout', labelKey: 'logout', icon: 'LogOut'},
];

export default async function AccountLayout({children}: LayoutProps<'/[locale]/account'>) {
    const locale = await getRouteLocale();
    const t = await getTranslations({locale, namespace: 'Account'});

    return (
        <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#120B07] text-[#1D120A] dark:text-[#F8F4EE] flex flex-col">
            {/* 1. Hero Breadcrumb Header Banner */}
            <section className="relative w-full overflow-hidden bg-[#FAF8F5] dark:bg-[#140D08] border-b border-[#E7DED0]/60 dark:border-[#3A291C]/60 pt-28 sm:pt-32 pb-12 sm:pb-16 text-center transition-colors">
                {/* Decorative Dot Clusters */}
                <div className="absolute left-4 sm:left-12 top-1/2 -translate-y-1/2 w-32 sm:w-44 h-20 pointer-events-none opacity-60">
                    <DecorativeDotCluster className="w-full h-full" />
                </div>
                <div className="absolute right-4 sm:right-12 top-1/2 -translate-y-1/2 w-32 sm:w-44 h-20 pointer-events-none opacity-60 transform rotate-180">
                    <DecorativeDotCluster className="w-full h-full" />
                </div>

                <div className="vakaa-container relative z-10 space-y-3">
                    <div className="text-[11px] font-semibold uppercase tracking-widest text-[#A66B2D]">
                        <span>{t('clientSpace')}</span>
                    </div>

                    <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1D120A] dark:text-[#F8F4EE] leading-tight">
                        {t('myAccount')}
                    </h1>

                    <nav aria-label="Fil d'ariane" className="flex items-center justify-center gap-2 text-xs sm:text-sm text-[#3A2418]/60 dark:text-[#E0D8D0]/60">
                        <Link href="/" className="hover:text-[#A66B2D] transition-colors cursor-pointer">
                            {t('home')}
                        </Link>
                        <span className="text-[#3A2418]/30 dark:text-[#E0D8D0]/30">/</span>
                        <span className="font-semibold text-[#1D120A] dark:text-[#F8F4EE]">
                            {t('myAccount')}
                        </span>
                    </nav>
                </div>
            </section>

            {/* 2. Main Account Body & Sidebar */}
            <main className="vakaa-container py-10 sm:py-14 flex-1">
                {/* Mobile: horizontal tab bar */}
                <div className="md:hidden mb-6">
                    <Suspense>
                        <AccountNavLinks items={navItems} layout="horizontal" />
                    </Suspense>
                </div>

                <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
                    {/* Desktop: FutureCommerce pill sidebar */}
                    <aside className="hidden md:block w-64 lg:w-72 shrink-0">
                        <div className="sticky top-28 space-y-4">
                            <Suspense>
                                <AccountNavLinks items={navItems} layout="vertical" />
                            </Suspense>
                        </div>
                    </aside>

                    {/* Main View Area */}
                    <div className="flex-1 min-w-0 w-full">
                        {children}
                    </div>
                </div>
            </main>

            {/* 3. 4-Pillar Universal Trust Bar */}
            <TrustBar />
        </div>
    );
}
