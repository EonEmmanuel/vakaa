import type {Metadata} from 'next';
import {Suspense} from 'react';
import {noIndexRobots} from '@/config/metadata';
import {AccountNavLinks} from '@/features/account/components/account-nav-links';
import {Sparkles} from 'lucide-react';

export const metadata: Metadata = {
    robots: noIndexRobots(),
};

const navItems = [
    {href: '/account/orders', labelKey: 'orders', icon: 'Package'},
    {href: '/account/addresses', labelKey: 'addresses', icon: 'MapPin'},
    {href: '/account/profile', labelKey: 'profile', icon: 'User'},
];

export default async function AccountLayout({children}: LayoutProps<'/[locale]/account'>) {
    return (
        <div className="vakaa-container pt-28 sm:pt-32 pb-16 sm:pb-24">
            {/* VIP Portal Header Banner */}
            <div className="mb-8 pb-6 border-b border-[#E7DED0]/60 dark:border-[#3A291C]/60 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="space-y-1.5">
                    <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-[#A66B2D]">
                        <Sparkles className="w-3 h-3 text-[#D4A43C]" />
                        <span>Maison VAKAA • Espace Client Privé</span>
                    </div>
                    <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1D120A] dark:text-[#F8F4EE] tracking-tight">
                        Mon Compte & Commandes
                    </h1>
                </div>
                <div className="text-xs text-[#6B5E55] dark:text-[#B5A496]">
                    <span>Devise de règlement : </span>
                    <strong className="text-[#1D120A] dark:text-[#F8F4EE]">XAF (FCFA)</strong>
                </div>
            </div>

            {/* Mobile: horizontal tab bar */}
            <div className="md:hidden mb-6">
                <Suspense>
                    <AccountNavLinks items={navItems} layout="horizontal" />
                </Suspense>
            </div>

            <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
                {/* Desktop: luxury sidebar */}
                <aside className="hidden md:block w-64 shrink-0">
                    <div className="sticky top-28 space-y-4">
                        <Suspense>
                            <AccountNavLinks items={navItems} layout="vertical" />
                        </Suspense>
                    </div>
                </aside>

                <main className="flex-1 min-w-0">
                    {children}
                </main>
            </div>
        </div>
    );
}
