'use client';

import { useActionState, useEffect } from 'react';
import { requestEmailUpdateAction } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';
import { useTranslations } from 'next-intl';
import { Mail, CheckCircle2, AlertCircle } from 'lucide-react';

interface EditEmailFormProps {
    currentEmail: string;
}

export function EditEmailForm({ currentEmail }: EditEmailFormProps) {
    const t = useTranslations('Account');
    const [state, formAction, isPending] = useActionState(requestEmailUpdateAction, undefined);

    useEffect(() => {
        if (state?.success) {
            const form = document.getElementById('edit-email-form') as HTMLFormElement;
            form?.reset();
        }
    }, [state?.success]);

    return (
        <div className="bg-white dark:bg-[#160E08] border border-[#EAE6DF] dark:border-[#3A291C] rounded-xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="space-y-1.5 pb-4 border-b border-[#F0EBE1] dark:border-[#2A1D15]">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#A66B2D]">
                    <Mail className="h-4 w-4" />
                    <span>{t('emailAddress')}</span>
                </div>
                <h3 className="font-sans text-xl sm:text-2xl font-bold text-[#1D120A] dark:text-[#F8F4EE] tracking-tight">
                    {t('editEmail')}
                </h3>
                <p className="text-xs sm:text-sm text-[#6B5E55] dark:text-[#B5A496]">
                    {t('updateEmailDescription')}
                </p>
            </div>

            <form id="edit-email-form" action={formAction} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                        <Label htmlFor="currentEmail" className="text-xs font-semibold uppercase tracking-wider text-[#3A2418] dark:text-[#E0D8D0]">
                            {t('currentEmail')}
                        </Label>
                        <Input
                            id="currentEmail"
                            type="email"
                            value={currentEmail}
                            disabled
                            className="h-11 rounded-xl border-[#EAE6DF] dark:border-[#3A291C] bg-[#FAF8F5]/80 dark:bg-[#1E140D]/80 text-sm text-[#6B5E55] cursor-not-allowed"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="newEmailAddress" className="text-xs font-semibold uppercase tracking-wider text-[#3A2418] dark:text-[#E0D8D0]">
                            {t('newEmailAddress')} *
                        </Label>
                        <Input
                            id="newEmailAddress"
                            name="newEmailAddress"
                            type="email"
                            placeholder="new.email@example.com"
                            required
                            disabled={isPending}
                            className="h-11 rounded-xl border-[#EAE6DF] dark:border-[#3A291C] bg-[#FAF8F5]/50 dark:bg-[#1E140D] text-sm focus:border-[#D4A43C]"
                        />
                    </div>
                </div>

                <div className="space-y-2 max-w-md">
                    <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-[#3A2418] dark:text-[#E0D8D0]">
                        {t('currentPassword')} *
                    </Label>
                    <PasswordInput
                        id="password"
                        name="password"
                        placeholder="••••••••••••"
                        required
                        disabled={isPending}
                        className="h-11 rounded-xl border-[#EAE6DF] dark:border-[#3A291C] bg-[#FAF8F5]/50 dark:bg-[#1E140D] text-sm focus:border-[#D4A43C]"
                    />
                    <p className="text-xs text-[#8C7A6B]">
                        {t('confirmPasswordChange')}
                    </p>
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
                        <span>{t('verificationEmailSent')}</span>
                    </div>
                )}

                <div className="pt-2">
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="min-w-[180px] h-11 bg-[#0F291E] hover:bg-[#1A3D2E] text-white rounded-xl font-medium shadow-xs"
                    >
                        {isPending ? t('updating') : t('updateEmail')}
                    </Button>
                </div>
            </form>
        </div>
    );
}
