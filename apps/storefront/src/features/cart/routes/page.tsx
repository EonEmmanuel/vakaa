import type { Metadata } from 'next';
import { Link } from '@/platform/i18n/navigation';
import { getRouteLocale } from '@/platform/i18n/server';
import { getTranslations } from 'next-intl/server';
import { Cart } from "@/features/cart/routes/cart";
import { Suspense } from "react";
import { CartSkeleton } from "@/features/cart/components/cart-skeleton";
import {TrustBar} from '@/components/shared/trust-bar';
import { DecorativeDotCluster } from "@/components/ui/decorative-dot-cluster";
import { noIndexRobots, SITE_NAME } from '@/config/metadata';

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getRouteLocale();
    const t = await getTranslations({ locale, namespace: 'Cart' });
    return {
        title: `${t('title')} | ${SITE_NAME}`,
        robots: noIndexRobots(),
    };
}

export default async function CartPage() {
    const locale = await getRouteLocale();
    const t = await getTranslations({ locale, namespace: 'Cart' });
    const tCommon = await getTranslations({ locale, namespace: 'Common' });

    return (
        <div className="min-h-screen bg-[#f2efe9] dark:bg-[#151413] text-[#1c1b18] dark:text-[#fbfaf7] flex flex-col">
            {/* 1. Hero Breadcrumb Header Banner */}
            <section className="relative w-full overflow-hidden bg-[#f2efe9] dark:bg-[#151413] border-b border-[#e2ddd2]/80 dark:border-[#2e2c28] pt-28 sm:pt-32 pb-12 sm:pb-16 text-center transition-colors">
                {/* Decorative Dot Clusters */}
                <div className="absolute left-4 sm:left-12 top-1/2 -translate-y-1/2 w-32 sm:w-44 h-20 pointer-events-none opacity-50">
                    <DecorativeDotCluster className="w-full h-full" />
                </div>
                <div className="absolute right-4 sm:right-12 top-1/2 -translate-y-1/2 w-32 sm:w-44 h-20 pointer-events-none opacity-50 transform rotate-180">
                    <DecorativeDotCluster className="w-full h-full" />
                </div>

                <div className="vakaa-container relative z-10 space-y-3">
                    <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1c1b18] dark:text-[#fbfaf7] leading-tight">
                        {t('title')}
                    </h1>

                    <nav aria-label="Fil d'ariane" className="flex items-center justify-center gap-2 text-xs sm:text-sm text-[#57544c] dark:text-[#a6a29a]">
                        <Link href="/" className="hover:text-[#D4A43C] transition-colors cursor-pointer">
                            {tCommon('home')}
                        </Link>
                        <span className="text-[#e2ddd2]">/</span>
                        <span className="font-semibold text-[#1c1b18] dark:text-[#fbfaf7]">
                            {t('title')}
                        </span>
                    </nav>
                </div>
            </section>

            {/* 2. Main Cart Content */}
            <main className="vakaa-container py-10 sm:py-14 flex-1">
                <Suspense fallback={<CartSkeleton />}>
                    <Cart />
                </Suspense>
            </main>

            {/* 3. 4-Pillar Universal Trust Bar */}
            <TrustBar />
        </div>
    );
}
