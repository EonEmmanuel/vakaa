'use client';

import { useActionState, useEffect } from 'react';
import { updatePasswordAction } from '@/features/account/routes/profile/actions';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';
import { Link } from '@/platform/i18n/navigation';
import { useTranslations } from 'next-intl';
import { ShieldCheck, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function PasswordPage() {
    const t = useTranslations('Account');
    const [state, formAction, isPending] = useActionState(updatePasswordAction, undefined);

    useEffect(() => {
        if (state?.success) {
            const form = document.getElementById('password-manager-form') as HTMLFormElement;
            form?.reset();
        }
    }, [state?.success]);

    return (
        <div className="bg-white dark:bg-[#160E08] border border-[#EAE6DF] dark:border-[#3A291C] rounded-xl p-6 sm:p-8 shadow-xs max-w-2xl space-y-6">
            <div className="space-y-1.5 pb-4 border-b border-[#F0EBE1] dark:border-[#2A1D15]">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#A66B2D]">
                    <ShieldCheck className="h-4 w-4" />
                    <span>{t('passwordManager')}</span>
                </div>
                <h1 className="font-sans text-2xl sm:text-3xl font-bold text-[#1D120A] dark:text-[#F8F4EE] tracking-tight">
                    {t('passwordManager')}
                </h1>
                <p className="text-sm text-[#6B5E55] dark:text-[#B5A496]">
                    {t('passwordManagerDesc')}
                </p>
            </div>

            <form id="password-manager-form" action={formAction} className="space-y-5">
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="currentPassword" className="text-xs font-semibold uppercase tracking-wider text-[#3A2418] dark:text-[#E0D8D0]">
                            {t('currentPassword')} *
                        </Label>
                        <Link
                            href="/forgot-password"
                            className="text-xs font-medium text-[#A66B2D] hover:underline"
                        >
                            {t('forgotPassword')}
                        </Link>
                    </div>
                    <PasswordInput
                        id="currentPassword"
                        name="currentPassword"
                        placeholder="••••••••••••"
                        required
                        disabled={isPending}
                        className="rounded-xl h-11 border-[#EAE6DF] dark:border-[#3A291C] bg-[#FAF8F5]/50 dark:bg-[#1E140D] focus:border-[#D4A43C]"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-xs font-semibold uppercase tracking-wider text-[#3A2418] dark:text-[#E0D8D0]">
                        {t('newPassword')} *
                    </Label>
                    <PasswordInput
                        id="newPassword"
                        name="newPassword"
                        placeholder="••••••••••••"
                        required
                        disabled={isPending}
                        className="rounded-xl h-11 border-[#EAE6DF] dark:border-[#3A291C] bg-[#FAF8F5]/50 dark:bg-[#1E140D] focus:border-[#D4A43C]"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-xs font-semibold uppercase tracking-wider text-[#3A2418] dark:text-[#E0D8D0]">
                        {t('confirmNewPassword')} *
                    </Label>
                    <PasswordInput
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="••••••••••••"
                        required
                        disabled={isPending}
                        className="rounded-xl h-11 border-[#EAE6DF] dark:border-[#3A291C] bg-[#FAF8F5]/50 dark:bg-[#1E140D] focus:border-[#D4A43C]"
                    />
                </div>

                {state?.error && (
                    <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 flex items-center gap-2.5 text-xs text-red-700 dark:text-red-300">
                        <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                        <span>{state.error}</span>
                    </div>
                )}

                {state?.success && (
                    <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-300">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                        <span>{t('passwordUpdated')}</span>
                    </div>
                )}

                <div className="pt-2">
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="bg-[#0F291E] hover:bg-[#1A382B] text-white rounded-full px-8 py-3.5 text-sm font-semibold transition-all shadow-xs cursor-pointer active:scale-[0.98]"
                    >
                        <Lock className="mr-2 h-4 w-4" />
                        {isPending ? t('updating') : t('updatePassword')}
                    </Button>
                </div>
            </form>
        </div>
    );
}
