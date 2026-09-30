import type {Metadata} from 'next';
import {getActiveCustomer} from '@/features/account/customer';
import { EditProfileForm } from './edit-profile-form';
import { EditEmailForm } from './edit-email-form';
import {getRouteLocale} from '@/platform/i18n/server';
import {getTranslations} from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getRouteLocale();
    const t = await getTranslations({locale, namespace: 'Account'});
    return {
        title: t('profilePageTitle'),
    };
}

export default async function ProfilePage() {
    const customer = await getActiveCustomer();
    const locale = await getRouteLocale();
    const t = await getTranslations({locale, namespace: 'Account'});

    return (
        <div className="space-y-8">
            <div className="space-y-1">
                <h1 className="font-sans text-2xl sm:text-3xl font-bold text-[#1D120A] dark:text-[#F8F4EE] tracking-tight">
                    {t('personalInformation')}
                </h1>
                <p className="text-xs sm:text-sm text-[#6B5E55] dark:text-[#B5A496]">
                    {t('manageAccountInfo')}
                </p>
            </div>

            <EditProfileForm customer={customer} />

            <EditEmailForm currentEmail={customer?.emailAddress || ''} />
        </div>
    );
}
