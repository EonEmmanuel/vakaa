'use client';

import { use, useActionState } from 'react';
import { resetPasswordAction } from './actions';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';
import { Link } from '@/platform/i18n/navigation';
import {useTranslations} from 'next-intl';

interface ResetPasswordFormProps {
    searchParams: Promise<{ token?: string }>;
}

export function ResetPasswordForm({ searchParams }: ResetPasswordFormProps) {
    const t = useTranslations('Auth');
    const params = use(searchParams);
    const token = params.token || null;

    const [state, formAction, isPending] = useActionState(resetPasswordAction, undefined);

    if (!token) {
        return (
            <div className="rounded-2xl border border-[#E7DED0] dark:border-[#2C1D11] bg-white/90 dark:bg-[#180E08]/90 shadow-2xl p-8 sm:p-10 backdrop-blur-md text-center space-y-6">
                <div className="w-14 h-14 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center mx-auto text-destructive">
                    <AlertCircle className="w-7 h-7" />
                </div>
                <div className="space-y-2">
                    <h2 className="font-serif text-2xl tracking-tight text-[#140C06] dark:text-[#FAF6F0]">
                        {t('invalidResetLink')}
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
                        {t('invalidResetLinkDescription')}
                    </p>
                </div>
                <div className="pt-2">
                    <Link href="/forgot-password" className="block">
                        <Button
                            variant="outline"
                            className="w-full h-12 rounded-full uppercase tracking-[0.14em] text-xs font-bold border-[#E7DED0] dark:border-[#352317] hover:border-[#D4A43C] hover:text-[#D4A43C] transition-all"
                        >
                            {t('requestNewResetLink')}
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-[#E7DED0] dark:border-[#2C1D11] bg-white/90 dark:bg-[#180E08]/90 shadow-2xl p-8 sm:p-10 backdrop-blur-md">
            <div className="space-y-2 text-center mb-8">
                <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#D4A43C]">
                    {t('brandTagline')}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl tracking-tight text-[#140C06] dark:text-[#FAF6F0]">
                    {t('resetYourPassword')}
                </h2>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
                    {t('resetYourPasswordDescription')}
                </p>
            </div>

            <form action={formAction} className="space-y-5">
                <input type="hidden" name="token" value={token} />

                <div className="space-y-1.5">
                    <Label
                        htmlFor="password"
                        className="text-xs font-bold uppercase tracking-[0.12em] text-[#140C06]/80 dark:text-[#FAF6F0]/80"
                    >
                        {t('newPassword')}
                    </Label>
                    <PasswordInput
                        id="password"
                        name="password"
                        placeholder="••••••••"
                        required
                        disabled={isPending}
                        className="h-12 rounded-xl bg-white/80 dark:bg-[#1E140C]/80 border-[#E7DED0] dark:border-[#352317] focus-visible:border-[#D4A43C] focus-visible:ring-[#D4A43C]/20 transition-colors"
                    />
                </div>

                <div className="space-y-1.5">
                    <Label
                        htmlFor="confirmPassword"
                        className="text-xs font-bold uppercase tracking-[0.12em] text-[#140C06]/80 dark:text-[#FAF6F0]/80"
                    >
                        {t('confirmPassword')}
                    </Label>
                    <PasswordInput
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="••••••••"
                        required
                        disabled={isPending}
                        className="h-12 rounded-xl bg-white/80 dark:bg-[#1E140C]/80 border-[#E7DED0] dark:border-[#352317] focus-visible:border-[#D4A43C] focus-visible:ring-[#D4A43C]/20 transition-colors"
                    />
                </div>

                {state?.error && (
                    <div className="p-3.5 rounded-xl text-xs bg-destructive/10 text-destructive border border-destructive/20 font-medium">
                        {state.error}
                    </div>
                )}

                <div className="space-y-4 pt-2">
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full h-12 rounded-full uppercase tracking-[0.16em] text-xs font-bold bg-[#D4A43C] hover:bg-[#C2932E] text-[#140C06] shadow-md transition-all active:scale-[0.99]"
                    >
                        {isPending ? t('resettingPassword') : t('resetPassword')}
                    </Button>

                    <div className="text-center pt-2">
                        <Link
                            href="/sign-in"
                            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.14em] font-medium text-muted-foreground hover:text-[#D4A43C] transition-colors"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            {t('backToSignIn')}
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    );
}
