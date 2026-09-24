import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';
import {getRouteLocale} from '@/platform/i18n/server';
import { ForgotPasswordForm } from './forgot-password-form';

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getRouteLocale();
    const t = await getTranslations({locale, namespace: 'Auth'});
    return {
        title: t('forgotPasswordPageTitle'),
    };
}

export default async function ForgotPasswordPage() {
    return (
        <div className="min-h-[calc(100vh-140px)] flex items-center justify-center px-4 py-16 bg-gradient-to-b from-[#FAF8F5] via-[#FDFBF7] to-[#F5EFEB] dark:from-[#0E0704] dark:via-[#140C06] dark:to-[#0A0503]">
            <div className="w-full max-w-md">
                <ForgotPasswordForm />
            </div>
        </div>
    );
}
