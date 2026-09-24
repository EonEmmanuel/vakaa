'use client';

import {Button} from '@/components/ui/button';
import { Link } from '@/platform/i18n/navigation';
import {CheckCircle, XCircle, ArrowLeft} from 'lucide-react';
import {useTranslations} from 'next-intl';

export type VerifyResultValue = {success: boolean; error?: undefined} | {error: string; success?: undefined};

interface VerifyResultProps {
    result: VerifyResultValue;
}

export function VerifyResult({result}: VerifyResultProps) {
    const t = useTranslations('Verify');

    const isSuccess = result.success === true;

    return (
        <div className="rounded-2xl border border-[#E7DED0] dark:border-[#2C1D11] bg-white/90 dark:bg-[#180E08]/90 shadow-2xl p-8 sm:p-10 backdrop-blur-md text-center space-y-6">
            {isSuccess ? (
                <>
                    <div className="w-14 h-14 rounded-full bg-[#D4A43C]/10 border border-[#D4A43C]/25 flex items-center justify-center mx-auto text-[#D4A43C]">
                        <CheckCircle className="h-7 w-7"/>
                    </div>
                    <div className="space-y-2">
                        <h1 className="font-serif text-2xl sm:text-3xl tracking-tight text-[#140C06] dark:text-[#FAF6F0]">{t('accountVerified')}</h1>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
                            {t('accountVerifiedMessage')}
                        </p>
                    </div>
                    <div className="pt-2">
                        <Link href="/sign-in" className="block w-full">
                            <Button className="w-full h-12 rounded-full uppercase tracking-[0.16em] text-xs font-bold bg-[#D4A43C] hover:bg-[#C2932E] text-[#140C06] shadow-md transition-all active:scale-[0.99]">
                                {t('backToSignIn')}
                            </Button>
                        </Link>
                    </div>
                </>
            ) : (
                <>
                    <div className="w-14 h-14 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center mx-auto text-destructive">
                        <XCircle className="h-7 w-7"/>
                    </div>
                    <div className="space-y-2">
                        <h1 className="font-serif text-2xl sm:text-3xl tracking-tight text-[#140C06] dark:text-[#FAF6F0]">{t('verificationFailed')}</h1>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
                            {result.error || t('verificationFailedMessage')}
                        </p>
                    </div>
                    <div className="flex flex-col gap-3 pt-2">
                        <Link href="/register" className="block w-full">
                            <Button className="w-full h-12 rounded-full uppercase tracking-[0.16em] text-xs font-bold bg-[#D4A43C] hover:bg-[#C2932E] text-[#140C06] shadow-md transition-all active:scale-[0.99]">
                                {t('createNewAccount')}
                            </Button>
                        </Link>
                        <Link href="/sign-in" className="block w-full">
                            <Button
                                variant="outline"
                                className="w-full h-12 rounded-full uppercase tracking-[0.14em] text-xs font-bold border-[#E7DED0] dark:border-[#352317] hover:border-[#D4A43C] hover:text-[#D4A43C] transition-all"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                {t('backToSignIn')}
                            </Button>
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}
