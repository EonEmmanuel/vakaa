import {CartView} from "@/features/cart/routes/cart-view";
import {getRouteLocale} from "@/platform/i18n/server";
import {getActiveCurrencyCode} from "@/features/currency/currency-server";
import {query} from "@/platform/vendure/api";
import {GetActiveOrderQuery} from '@/features/cart/graphql';

export const dynamic = 'force-dynamic';

export async function Cart() {
    const locale = await getRouteLocale();
    const currencyCode = await getActiveCurrencyCode();
    let activeOrder = null;
    try {
        const {data} = await query(GetActiveOrderQuery, {}, {
            useAuthToken: true,
            languageCode: locale,
            currencyCode,
        });
        activeOrder = data?.activeOrder ?? null;
    } catch {
        activeOrder = null;
    }

    return <CartView initialOrder={activeOrder} />;
}
