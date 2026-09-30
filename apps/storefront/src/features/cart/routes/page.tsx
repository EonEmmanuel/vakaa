import type { Metadata } from 'next';
import { Link } from '@/platform/i18n/navigation';
import { getRouteLocale } from '@/platform/i18n/server';
import { getTranslations } from 'next-intl/server';
import { Cart } from "@/features/cart/routes/cart";
import { Suspense } from "react";
import { CartSkeleton } from "@/features/cart/components/cart-skeleton";
import { TrustBar } from "@/site/home/trust-bar";
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

    return (
        <div className="min-h-screen bg-[#FAF8F5] text-[#1D120A] flex flex-col">
            {/* 1. Hero Breadcrumb Header Banner */}
            <section className="relative w-full overflow-hidden bg-[#FAF8F5] border-b border-[#E7DED0]/60 pt-28 sm:pt-32 pb-12 sm:pb-16 text-center transition-colors">
                {/* Decorative Dot Clusters */}
                <div className="absolute left-4 sm:left-12 top-1/2 -translate-y-1/2 w-32 sm:w-44 h-20 pointer-events-none opacity-70">
                    <DecorativeDotCluster className="w-full h-full" />
                </div>
                <div className="absolute right-4 sm:right-12 top-1/2 -translate-y-1/2 w-32 sm:w-44 h-20 pointer-events-none opacity-70 transform rotate-180">
                    <DecorativeDotCluster className="w-full h-full" />
                </div>

                <div className="vakaa-container relative z-10 space-y-3">
                    <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1D120A] leading-tight">
                        {t('title')}
                    </h1>

                    <nav aria-label="Fil d'ariane" className="flex items-center justify-center gap-2 text-xs sm:text-sm text-[#3A2418]/60">
                        <Link href="/" className="hover:text-[#A66B2D] transition-colors cursor-pointer">
                            {t('home')}
                        </Link>
                        <span className="text-[#3A2418]/30">/</span>
                        <span className="font-semibold text-[#1D120A]">
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
