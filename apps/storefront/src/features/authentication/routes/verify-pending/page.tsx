import type {Metadata} from 'next';
import {Suspense} from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NavigationLink } from '@/site/navigation/navigation-link';
import { CheckCircle } from 'lucide-react';
import {getRouteLocale} from '@/platform/i18n/server';
import {getTranslations} from 'next-intl/server';

export const metadata: Metadata = {
    title: 'Verification Pending',
    description: 'Check your email to verify your account.',
};

async function VerifyPendingContent({searchParams}: {searchParams: Promise<Record<string, string | string[] | undefined>>}) {
    const locale = await getRouteLocale();
    const t = await getTranslations({locale, namespace: 'Verify'});
    const resolvedParams = await searchParams;
    const redirectTo = resolvedParams?.redirectTo as string | undefined;

    const signInHref = redirectTo
        ? `/sign-in?redirectTo=${encodeURIComponent(redirectTo)}`
        : '/sign-in';

    return (
        <div className="rounded-2xl border border-[#E7DED0] dark:border-[#2C1D11] bg-white/90 dark:bg-[#180E08]/90 shadow-2xl p-8 sm:p-10 backdrop-blur-md text-center space-y-6">
            <div className="w-14 h-14 rounded-full bg-[#D4A43C]/10 border border-[#D4A43C]/25 flex items-center justify-center mx-auto text-[#D4A43C]">
                <CheckCircle className="h-7 w-7" />
            </div>
            <div className="space-y-2">
                <h1 className="font-sans font-bold text-2xl sm:text-3xl tracking-tight text-[#140C06] dark:text-[#FAF6F0]">{t('pending.title')}</h1>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
                    {t('pending.message')}
                </p>
            </div>
            <div className="bg-[#FAF8F5] dark:bg-[#1E140C]/60 border border-[#E7DED0] dark:border-[#352317] p-4 rounded-xl text-left">
                <p className="text-xs text-muted-foreground leading-relaxed">
                    {t('pending.spamNote')}
                </p>
            </div>
            <div className="pt-2">
                <NavigationLink href={signInHref} className="block w-full">
                    <Button className="w-full h-12 rounded-full uppercase tracking-[0.16em] text-xs font-bold bg-[#D4A43C] hover:bg-[#C2932E] text-[#140C06] shadow-md transition-all active:scale-[0.99]">
                        {t('pending.goToSignIn')}
                    </Button>
                </NavigationLink>
            </div>
        </div>
    );
}

export default async function VerifyPendingPage({searchParams}: PageProps<'/[locale]/verify-pending'>) {
    const locale = await getRouteLocale();
    const t = await getTranslations({locale, namespace: 'Verify'});
    return (
        <div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4 py-16 bg-gradient-to-b from-[#FAF8F5] via-[#FDFBF7] to-[#F5EFEB] dark:from-[#0E0704] dark:via-[#140C06] dark:to-[#0A0503]">
            <div className="w-full max-w-md">
                <Suspense fallback={<div className="text-center text-xs tracking-widest uppercase text-muted-foreground">{t('loading')}</div>}>
                    <VerifyPendingContent searchParams={searchParams} />
                </Suspense>
            </div>
        </div>
    );
}
