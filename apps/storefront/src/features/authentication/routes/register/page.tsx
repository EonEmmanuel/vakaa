import type {Metadata} from 'next';
import {Suspense} from 'react';
import {getRouteLocale} from '@/platform/i18n/server';
import {getTranslations} from 'next-intl/server';
import {RegistrationForm} from './registration-form';
import {Skeleton} from '@/components/ui/skeleton';
import {SITE_NAME} from '@/config/metadata';

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getRouteLocale();
    const t = await getTranslations({locale, namespace: 'Auth'});
    return {
        title: t('createAccount'),
    };
}

function RegistrationFormSkeleton() {
    return (
        <div className="space-y-4 pt-2">
            <div className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-12 w-full rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-12 w-full rounded-xl" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-12 w-full rounded-xl" />
                </div>
            </div>
            <div className="space-y-2">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-12 w-full rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-12 w-full rounded-xl" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-12 w-full rounded-xl" />
                </div>
            </div>
            <Skeleton className="h-12 w-full rounded-full mt-2" />
            <Skeleton className="h-4 w-44 mx-auto mt-4" />
        </div>
    );
}

async function RegisterContent({searchParams}: {searchParams: Promise<Record<string, string | string[] | undefined>>}) {
    const resolvedParams = await searchParams;
    const redirectTo = resolvedParams?.redirectTo as string | undefined;

    return <RegistrationForm redirectTo={redirectTo} />;
}

export default async function RegisterPage({searchParams}: PageProps<'/[locale]/register'>) {
    const locale = await getRouteLocale();
    const t = await getTranslations({locale, namespace: 'Auth'});

    return (
        <div className="w-full bg-[#FAF7F2] dark:bg-[#160E08] rounded-2xl overflow-hidden border border-[#E7DED0]/80 dark:border-[#3A291C] shadow-2xl flex flex-col lg:flex-row">
            {/* Editorial Brand Panel - Desktop */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-[#120B06] text-[#F8F4EE] p-12 lg:p-14 flex-col justify-between overflow-hidden border-r border-[#3A291C]/60">
                {/* Background ambient gold glow */}
                <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-[#D4A43C]/10 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-[#A66B2D]/15 blur-3xl pointer-events-none" />

                {/* Cultural Diamond Inset Background Watermark */}
                <div className="absolute top-1/2 right-4 -translate-y-1/2 w-72 h-72 opacity-5 pointer-events-none">
                    <svg viewBox="0 0 200 200" fill="none" stroke="#D4A43C" strokeWidth="1.5">
                        <rect x="25" y="25" width="150" height="150" transform="rotate(45 100 100)" />
                        <circle cx="100" cy="100" r="40" />
                        <path d="M0 100H200M100 0V200" />
                    </svg>
                </div>

                {/* Top Badge */}
                <div className="relative z-10">
                    <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4A43C] bg-[#2A1B10] border border-[#D4A43C]/30 shadow-xs">
                        Maison VAKAA • {t('invitationPrivilege')}
                    </span>
                </div>

                {/* Center Editorial Quote */}
                <div className="relative z-10 space-y-6 my-auto py-8">
                    <h2 className="font-sans text-3xl xl:text-4xl font-bold tracking-tight text-[#FAF7F2] leading-tight">
                        {SITE_NAME}
                    </h2>
                    <p className="font-sans text-lg xl:text-xl text-[#D4A43C] italic leading-relaxed">
                        {t('brandQuoteRegister')}
                    </p>
                    <p className="text-xs text-[#F8F4EE]/70 font-sans leading-relaxed max-w-sm">
                        {t('joinUs')}
                    </p>
                </div>

                {/* Bottom Trust Features */}
                <div className="relative z-10 grid grid-cols-3 gap-4 pt-6 border-t border-[#3A291C]/80">
                    <div>
                        <p className="font-sans text-base font-bold text-[#FAF7F2]">{t('vipPillar1Title')}</p>
                        <p className="text-[10px] text-[#D4A43C] uppercase tracking-wider mt-0.5">{t('vipPillar1Desc')}</p>
                    </div>
                    <div>
                        <p className="font-sans text-base font-bold text-[#FAF7F2]">{t('vipPillar2Title')}</p>
                        <p className="text-[10px] text-[#D4A43C] uppercase tracking-wider mt-0.5">{t('vipPillar2Desc')}</p>
                    </div>
                    <div>
                        <p className="font-sans text-base font-bold text-[#FAF7F2]">{t('vipPillar3Title')}</p>
                        <p className="text-[10px] text-[#D4A43C] uppercase tracking-wider mt-0.5">{t('vipPillar3Desc')}</p>
                    </div>
                </div>
            </div>

            {/* Form Panel */}
            <div className="flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-10 lg:p-14">
                <div className="w-full max-w-md space-y-6">
                    <div className="space-y-1.5 text-center sm:text-left">
                        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#A66B2D] mb-1">
                            <span>Maison VAKAA</span>
                        </div>
                        <h1 className="font-sans text-2xl sm:text-3xl font-bold text-[#1D120A] dark:text-[#F8F4EE] tracking-tight">
                            {t('createAccount')}
                        </h1>
                        <p className="text-xs text-[#6B5E55] dark:text-[#B5A496]">
                            {t('signUpMessage')}
                        </p>
                    </div>

                    <Suspense fallback={<RegistrationFormSkeleton />}>
                        <RegisterContent searchParams={searchParams} />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
