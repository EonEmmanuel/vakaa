import type {Metadata} from 'next';
import {Suspense} from 'react';
import {getTranslations} from 'next-intl/server';
import {getRouteLocale} from '@/platform/i18n/server';
import {OrderConfirmation} from './order-confirmation';
import {OrderConfirmationSkeleton} from './order-confirmation-skeleton';
import {noIndexRobots} from '@/config/metadata';

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getRouteLocale();
    const t = await getTranslations({locale, namespace: 'OrderConfirmation'});
    return {
        title: t('pageTitle'),
        robots: noIndexRobots(),
    };
}

export default async function OrderConfirmationPage(
    props: PageProps<'/[locale]/order-confirmation/[code]'>
) {
    return (
        <Suspense fallback={<OrderConfirmationSkeleton />}>
            <OrderConfirmation paramsPromise={props.params} searchParamsPromise={props.searchParams} />
        </Suspense>
    );
}
