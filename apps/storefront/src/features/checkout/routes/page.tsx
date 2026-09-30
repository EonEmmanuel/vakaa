import type {Metadata} from 'next';
import {getActiveCurrencyCode} from '@/features/currency/currency-server';
import {getRouteLocale} from '@/platform/i18n/server';
import {getTranslations} from 'next-intl/server';
import {query} from '@/platform/vendure/api';
import {GetActiveOrderForCheckoutQuery, GetEligiblePaymentMethodsQuery, GetEligibleShippingMethodsQuery} from '@/features/checkout/graphql';
import {GetCustomerAddressesQuery} from '@/features/account/graphql';
import {Link, redirect} from '@/platform/i18n/navigation';
import CheckoutFlow from './checkout-flow';
import {CheckoutProvider} from './checkout-provider';
import {noIndexRobots, SITE_NAME} from '@/config/metadata';
import {getActiveCustomer} from '@/features/account/customer';
import {getAvailableCountriesCached} from '@/features/checkout/countries';
import {getDetectedCountry} from '@/platform/geolocation';
import {TrustBar} from '@/site/home/trust-bar';
import {DecorativeDotCluster} from '@/components/ui/decorative-dot-cluster';

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getRouteLocale();
    const t = await getTranslations({locale, namespace: 'Checkout'});
    return {
        title: `${t('pageTitle')} | ${SITE_NAME}`,
        robots: noIndexRobots(),
    };
}

export default async function CheckoutPage() {
    const locale = await getRouteLocale();
    const currencyCode = await getActiveCurrencyCode();
    const detectedCountryCode = await getDetectedCountry();
    const t = await getTranslations({locale, namespace: 'Checkout'});
    const tCart = await getTranslations({locale, namespace: 'Cart'});
    const customer = await getActiveCustomer();
    const isGuest = !customer;

    const [orderRes, addressesRes, countries, shippingMethodsRes, paymentMethodsRes] =
        await Promise.all([
            query(GetActiveOrderForCheckoutQuery, {}, {useAuthToken: true, currencyCode}),
            isGuest
                ? Promise.resolve({ data: { activeCustomer: null } })
                : query(GetCustomerAddressesQuery, {}, {useAuthToken: true}),
            getAvailableCountriesCached(locale),
            query(GetEligibleShippingMethodsQuery, {}, {useAuthToken: true, currencyCode}),
            query(GetEligiblePaymentMethodsQuery, {}, {useAuthToken: true, currencyCode}),
        ]);

    const activeOrder = orderRes.data.activeOrder;

    if (!activeOrder || activeOrder.lines.length === 0) {
        return redirect({href: '/cart', locale});
    }

    if (activeOrder.state !== 'AddingItems' && activeOrder.state !== 'ArrangingPayment') {
        return redirect({href: `/order-confirmation/${activeOrder.code}`, locale});
    }

    const addresses = addressesRes.data.activeCustomer?.addresses || [];
    const shippingMethods = shippingMethodsRes.data.eligibleShippingMethods || [];
    const paymentMethods =
        paymentMethodsRes.data.eligiblePaymentMethods?.filter((m) => m.isEligible) || [];

    return (
        <div className="min-h-screen bg-[#FAF8F5] text-[#1D120A] flex flex-col">
            {/* 1. Hero Breadcrumb Header Banner */}
            <section className="relative w-full overflow-hidden bg-[#FAF8F5] border-b border-[#E7DED0]/60 pt-28 sm:pt-32 pb-12 sm:pb-16 text-center transition-colors">
                <div className="absolute left-4 sm:left-12 top-1/2 -translate-y-1/2 w-32 sm:w-44 h-20 pointer-events-none opacity-70">
                    <DecorativeDotCluster className="w-full h-full" />
                </div>
                <div className="absolute right-4 sm:right-12 top-1/2 -translate-y-1/2 w-32 sm:w-44 h-20 pointer-events-none opacity-70 transform rotate-180">
                    <DecorativeDotCluster className="w-full h-full" />
                </div>

                <div className="vakaa-container relative z-10 space-y-3">
                    <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1D120A] leading-tight">
                        {t('pageTitle')}
                    </h1>

                    <nav aria-label="Fil d'ariane" className="flex items-center justify-center gap-2 text-xs sm:text-sm text-[#3A2418]/60">
                        <Link href="/" className="hover:text-[#A66B2D] transition-colors cursor-pointer">
                            {tCart('home')}
                        </Link>
                        <span className="text-[#3A2418]/30">/</span>
                        <Link href="/cart" className="hover:text-[#A66B2D] transition-colors cursor-pointer">
                            {tCart('title')}
                        </Link>
                        <span className="text-[#3A2418]/30">/</span>
                        <span className="font-semibold text-[#1D120A]">
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
