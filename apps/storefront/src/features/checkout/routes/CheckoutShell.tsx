'use client';

import { Suspense, use, createContext, useContext, ReactNode } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import CheckoutFlow from './checkout-flow';
import { CheckoutProvider, type CustomerAddress, type Country, type ShippingMethod, type PaymentMethod } from './checkout-provider';
import type { CheckoutOrder } from './types';

// Context for streamed checkout data
interface StreamedCheckoutData {
    addresses: Promise<unknown> | null;
    countries: Promise<unknown> | null;
    shippingMethods: Promise<unknown> | null;
    paymentMethods: Promise<unknown> | null;
    detectedCountryCode: Promise<string | null> | null;
    isGuest: boolean;
}

const StreamedCheckoutContext = createContext<StreamedCheckoutData | null>(null);

export function useStreamedCheckout() {
    const context = useContext(StreamedCheckoutContext);
    if (!context) {
        throw new Error('useStreamedCheckout must be used within CheckoutShell');
    }
    return context;
}

// Client Component that reads streamed promises using React 19's `use` hook
function CheckoutContent({
    order,
    addressesPromise,
    countriesPromise,
    shippingMethodsPromise,
    paymentMethodsPromise,
    detectedCountryCodePromise,
    isGuest,
}: {
    order: CheckoutOrder;
    addressesPromise: Promise<unknown>;
    countriesPromise: Promise<unknown>;
    shippingMethodsPromise: Promise<unknown>;
    paymentMethodsPromise: Promise<unknown>;
    detectedCountryCodePromise: Promise<string | null>;
    isGuest: boolean;
}) {
    // Read promises using React 19's `use` hook - suspends until resolved
    const addresses = addressesPromise ? use(addressesPromise) : [];
    const countries = countriesPromise ? use(countriesPromise) : [];
    const shippingMethods = shippingMethodsPromise ? use(shippingMethodsPromise) : [];
    const paymentMethods = paymentMethodsPromise ? use(paymentMethodsPromise) : [];
    const detectedCountryCode = detectedCountryCodePromise ? use(detectedCountryCodePromise) : null;

    return (
        <CheckoutProvider
            order={order}
            addresses={addresses as CustomerAddress[]}
            countries={countries as Country[]}
            detectedCountryCode={detectedCountryCode as string | undefined}
            shippingMethods={shippingMethods as ShippingMethod[]}
            paymentMethods={paymentMethods as PaymentMethod[]}
            isGuest={isGuest}
        >
            <CheckoutFlow />
        </CheckoutProvider>
    );
}

// Suspense-wrapped content for streaming
function CheckoutStreamingContent({
    order,
    addressesPromise,
    countriesPromise,
    shippingMethodsPromise,
    paymentMethodsPromise,
    detectedCountryCodePromise,
    isGuest,
}: {
    order: CheckoutOrder;
    addressesPromise: Promise<unknown>;
    countriesPromise: Promise<unknown>;
    shippingMethodsPromise: Promise<unknown>;
    paymentMethodsPromise: Promise<unknown>;
    detectedCountryCodePromise: Promise<string | null>;
    isGuest: boolean;
}) {
    return (
        <Suspense fallback={<CheckoutSkeleton />}>
            <CheckoutContent
                order={order}
                addressesPromise={addressesPromise}
                countriesPromise={countriesPromise}
                shippingMethodsPromise={shippingMethodsPromise}
                paymentMethodsPromise={paymentMethodsPromise}
                detectedCountryCodePromise={detectedCountryCodePromise}
                isGuest={isGuest}
            />
        </Suspense>
    );
}

// Skeletons for each data piece
function CheckoutSkeleton() {
    return (
        <div className="vakaa-container py-10 sm:py-14">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                <div className="lg:col-span-8 space-y-6">
                    <Skeleton className="h-8 w-48 mb-8" />
                    <div className="space-y-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-[#fbfaf7] dark:bg-[#1c1b19] rounded-2xl border border-[#e2ddd2] dark:border-[#2e2c28] p-6 animate-pulse">
                                <Skeleton className="h-6 w-48 mb-4" />
                                <div className="grid grid-cols-2 gap-4">
                                    <Skeleton className="h-10 w-full" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                                <Skeleton className="h-10 w-full mt-4" />
                                <Skeleton className="h-10 w-full mt-2" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-4">
                    <div className="bg-[#fbfaf7] dark:bg-[#1c1b19] rounded-2xl border border-[#e2ddd2] dark:border-[#2e2c28] p-6 sticky top-28 animate-pulse space-y-4">
                        <Skeleton className="h-6 w-32" />
                        <div className="space-y-3">
                            {[...Array(2)].map((_, i) => (
                                <div key={i} className="flex gap-3">
                                    <Skeleton className="h-16 w-16 rounded-md" />
                                    <div className="flex-1 space-y-1">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-3 w-16" />
                                    </div>
                                    <Skeleton className="h-4 w-16" />
                                </div>
                            ))}
                        </div>
                        <div className="border-t pt-4 space-y-2">
                            <div className="flex justify-between"><Skeleton className="h-4 w-16" /><Skeleton className="h-4 w-16" /></div>
                            <div className="flex justify-between"><Skeleton className="h-4 w-16" /><Skeleton className="h-4 w-16" /></div>
                            <div className="flex justify-between font-bold pt-2 border-t"><Skeleton className="h-5 w-12" /><Skeleton className="h-5 w-20" /></div>
                        </div>
                        <Skeleton className="h-12 w-full rounded-full" />
                        <Skeleton className="h-10 w-full rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}

// Main exported component - receives promises from Server Component
export default function CheckoutShell({
    order,
    addressesPromise,
    countriesPromise,
    shippingMethodsPromise,
    paymentMethodsPromise,
    detectedCountryCodePromise,
    isGuest,
}: {
    order: CheckoutOrder;
    addressesPromise: Promise<unknown>;
    countriesPromise: Promise<unknown>;
    shippingMethodsPromise: Promise<unknown>;
    paymentMethodsPromise: Promise<unknown>;
    detectedCountryCodePromise: Promise<string | null>;
    isGuest: boolean;
}) {
    return (
        <StreamedCheckoutContext.Provider
            value={{
                addresses: addressesPromise,
                countries: countriesPromise,
                shippingMethods: shippingMethodsPromise,
                paymentMethods: paymentMethodsPromise,
                detectedCountryCode: detectedCountryCodePromise,
                isGuest,
            }}
        >
            <CheckoutStreamingContent
                order={order}
                addressesPromise={addressesPromise}
                countriesPromise={countriesPromise}
                shippingMethodsPromise={shippingMethodsPromise}
                paymentMethodsPromise={paymentMethodsPromise}
                detectedCountryCodePromise={detectedCountryCodePromise}
                isGuest={isGuest}
            />
        </StreamedCheckoutContext.Provider>
    );
}