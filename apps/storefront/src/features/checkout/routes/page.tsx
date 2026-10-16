import {Metadata} from 'next';
import {getRouteLocale} from '@/platform/i18n/server';
import {getTranslations} from 'next-intl/server';
import {Link, redirect} from '@/platform/i18n/navigation';
import CheckoutFlow from './checkout-flow';
import {CheckoutProvider} from './checkout-provider';
import {noIndexRobots, SITE_NAME} from '@/config/metadata';
import {TrustBar} from '@/components/shared/trust-bar';
import {DecorativeDotCluster} from '@/components/ui/decorative-dot-cluster';
import {getCheckoutData} from './checkout-data';

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getRouteLocale();
    const t = await getTranslations({locale, namespace: 'Checkout'});
    return {
        title: `${t('pageTitle')} | ${SITE_NAME}`,
        robots: noIndexRobots(),
    };
}

export default async function CheckoutPage() {
    const {
        locale,
        detectedCountryCode,
        isGuest,
        activeOrder,
        addresses,
        countries,
        shippingMethods,
        paymentMethods,
    } = await getCheckoutData();

    const t = await getTranslations({locale, namespace: 'Checkout'});
    const tCommon = await getTranslations({locale, namespace: 'Common'});

    if (!activeOrder || activeOrder.lines.length === 0) {
        return redirect({href: '/cart', locale});
    }

    if (activeOrder.state !== 'AddingItems' && activeOrder.state !== 'ArrangingPayment') {
        return redirect({href: `/order-confirmation/${activeOrder.code}`, locale});
    }

    return (
        <div className="min-h-screen bg-[#f2efe9] dark:bg-[#151413] text-[#1c1b18] dark:text-[#fbfaf7] flex flex-col">
            {/* 1. Hero Breadcrumb Header Banner */}
            <section className="relative w-full overflow-hidden bg-[#f2efe9] dark:bg-[#151413] border-b border-[#e2ddd2]/80 dark:border-[#2e2c28] pt-28 sm:pt-32 pb-12 sm:pb-16 text-center transition-colors">
                <div className="absolute left-4 sm:left-12 top-1/2 -translate-y-1/2 w-32 sm:w-44 h-20 pointer-events-none opacity-50">
                    <DecorativeDotCluster className="w-full h-full" />
                </div>
                <div className="absolute right-4 sm:right-12 top-1/2 -translate-y-1/2 w-32 sm:w-44 h-20 pointer-events-none opacity-50 transform rotate-180">
                    <DecorativeDotCluster className="w-full h-full" />
                </div>

                <div className="vakaa-container relative z-10 space-y-3">
                    <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1c1b18] dark:text-[#fbfaf7] leading-tight">
                        {t('pageTitle')}
                    </h1>

                    <nav aria-label="Fil d'ariane" className="flex items-center justify-center gap-2 text-xs sm:text-sm text-[#57544c] dark:text-[#a6a29a]">
                        <Link href="/" className="hover:text-[#D4A43C] transition-colors cursor-pointer">
                            {tCommon('home')}
                        </Link>
                        <span className="text-[#e2ddd2]">/</span>
                        <Link href="/cart" className="hover:text-[#D4A43C] transition-colors cursor-pointer">
                            {tCommon('cart')}
                        </Link>
                        <span className="text-[#e2ddd2]">/</span>
                        <span className="font-semibold text-[#1c1b18] dark:text-[#fbfaf7]">
                            {t('pageTitle')}
                        </span>
                    </nav>
                </div>
            </section>

            {/* 2. Main Checkout Flow */}
            <main className="vakaa-container py-10 sm:py-14 flex-1">
                <CheckoutProvider
                    order={activeOrder}
                    addresses={addresses}
                    countries={countries}
                    detectedCountryCode={detectedCountryCode}
                    shippingMethods={shippingMethods}
                    paymentMethods={paymentMethods}
                    isGuest={isGuest}
                >
                    <CheckoutFlow/>
                </CheckoutProvider>
            </main>

            {/* 3. Universal Trust Bar */}
            <TrustBar />
        </div>
    );
}
