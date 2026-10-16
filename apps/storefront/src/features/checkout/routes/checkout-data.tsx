import { query } from '@/platform/vendure/api';
import {
    GetActiveOrderForCheckoutQuery,
    GetEligiblePaymentMethodsQuery,
    GetEligibleShippingMethodsQuery,
} from '@/features/checkout/graphql';
import { GetCustomerAddressesQuery } from '@/features/account/graphql';
import { getAvailableCountriesCached } from '@/features/checkout/countries';
import { getActiveCustomer } from '@/features/account/customer';
import { getActiveCurrencyCode } from '@/features/currency/currency-server';
import { getDetectedCountry } from '@/platform/geolocation';
import { getRouteLocale } from '@/platform/i18n/server';

// Granular cache tags for checkout data
export const CHECKOUT_TAGS = {
    order: 'checkout:order',
    addresses: 'checkout:addresses',
    countries: 'checkout:countries',
    shippingMethods: 'checkout:shipping-methods',
    paymentMethods: 'checkout:payment-methods',
} as const;

/**
 * Loads all required checkout data in parallel with granular cache tags and
 * defensive fallback checks for resilient checkout TTFB.
 */
export async function getCheckoutData() {
    // 1. Independent local reads resolved in parallel
    const [locale, currencyCode, detectedCountryCode] = await Promise.all([
        getRouteLocale(),
        getActiveCurrencyCode(),
        getDetectedCountry(),
    ]);

    // 2. All Shop API queries executed in parallel in a single roundtrip phase
    const [customer, addressesRes, orderRes, countries, shippingMethodsRes, paymentMethodsRes] =
        await Promise.all([
            getActiveCustomer(),
            query(GetCustomerAddressesQuery, {}, { useAuthToken: true, tags: [CHECKOUT_TAGS.addresses] }),
            query(
                GetActiveOrderForCheckoutQuery,
                {},
                { useAuthToken: true, currencyCode, languageCode: locale, tags: [CHECKOUT_TAGS.order] }
            ),
            getAvailableCountriesCached(locale),
            query(
                GetEligibleShippingMethodsQuery,
                {},
                { useAuthToken: true, currencyCode, tags: [CHECKOUT_TAGS.shippingMethods] }
            ),
            query(
                GetEligiblePaymentMethodsQuery,
                {},
                { useAuthToken: true, currencyCode, tags: [CHECKOUT_TAGS.paymentMethods] }
            ),
        ]);

    const isGuest = !customer;
    const activeOrder = orderRes.data?.activeOrder;
    const addresses = addressesRes.data?.activeCustomer?.addresses || [];
    const shippingMethods = shippingMethodsRes.data?.eligibleShippingMethods || [];
    const paymentMethods =
        paymentMethodsRes.data?.eligiblePaymentMethods?.filter((m) => m.isEligible) || [];

    return {
        locale,
        currencyCode,
        detectedCountryCode,
        customer,
        isGuest,
        activeOrder,
        addresses,
        countries,
        shippingMethods,
        paymentMethods,
    };
}