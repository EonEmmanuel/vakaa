import type {Metadata} from 'next';
import {getRouteLocale} from '@/platform/i18n/server';
import {getTranslations} from 'next-intl/server';
import {Cart} from "@/features/cart/routes/cart";
import {Suspense} from "react";
import {CartSkeleton} from "@/features/cart/components/cart-skeleton";
import {noIndexRobots} from '@/config/metadata';

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getRouteLocale();
    const t = await getTranslations({locale, namespace: 'Cart'});
    return {
        title: t('title'),
        robots: noIndexRobots(),
    };
}

export default async function CartPage() {
    const locale = await getRouteLocale();
    const t = await getTranslations({locale, namespace: 'Cart'});

    return (
        <div className="vakaa-container pt-28 pb-16 sm:pt-32 sm:pb-24">
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-[#1D120A] dark:text-[#F8F4EE] mb-8">{t('title')}</h1>

            <Suspense fallback={<CartSkeleton />}>
                <Cart/>
            </Suspense>
        </div>
    );
}
