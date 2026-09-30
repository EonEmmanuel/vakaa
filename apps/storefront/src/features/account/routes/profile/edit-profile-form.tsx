'use client';

import { useActionState, useEffect } from 'react';
import { updateCustomerAction } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslations } from 'next-intl';
import { User, Phone, CheckCircle2, AlertCircle, Camera, Check } from 'lucide-react';

interface EditProfileFormProps {
    customer: {
        id?: string;
        title?: string | null;
        firstName?: string | null;
        lastName?: string | null;
        emailAddress?: string | null;
        phoneNumber?: string | null;
    } | null;
}

export function EditProfileForm({ customer }: EditProfileFormProps) {
    const t = useTranslations('Account');
    const [state, formAction, isPending] = useActionState(updateCustomerAction, undefined);

    const firstName = customer?.firstName || '';
    const lastName = customer?.lastName || '';
    const initials = `${firstName ? firstName[0] : ''}${lastName ? lastName[0] : ''}`.toUpperCase() || 'V';

    return (
        <div className="bg-white dark:bg-[#160E08] border border-[#EAE6DF] dark:border-[#3A291C] rounded-xl p-6 sm:p-8 shadow-xs space-y-8">
            {/* Header / Avatar Profile Row */}
            <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-[#F0EBE1] dark:border-[#2A1D15]">
                <div className="relative group">
                    <div className="w-20 h-20 rounded-full bg-[#FAF8F5] dark:bg-[#22160F] border-2 border-[#EAA838] flex items-center justify-center text-[#1D120A] dark:text-[#F8F4EE] font-sans text-2xl font-bold tracking-wider shadow-xs">
                        {initials}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#0F291E] text-white flex items-center justify-center border-2 border-white dark:border-[#160E08] shadow-xs">
                        <Camera className="w-3.5 h-3.5" />
                    </div>
                </div>

                <div className="space-y-1.5 text-center sm:text-left">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                        <h2 className="font-sans text-2xl font-bold text-[#1D120A] dark:text-[#F8F4EE]">
                            {firstName || lastName ? `${customer?.title ? customer.title + ' ' : ''}${firstName} ${lastName}`.trim() : t('personalInformation')}
                        </h2>
                        {customer?.emailAddress && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                                <Check className="w-3 h-3" />
                                {t('verifiedEmail')}
                            </span>
                        )}
                    </div>
                    <p className="text-xs sm:text-sm text-[#6B5E55] dark:text-[#B5A496]">
                        {customer?.emailAddress || t('updatePersonalDetails')}
                    </p>
                </div>
            </div>

            {/* Profile Form */}
            <form id="edit-profile-form" action={formAction} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Civility / Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-xs font-semibold uppercase tracking-wider text-[#3A2418] dark:text-[#E0D8D0]">
                            {t('titleCivility')}
                        </Label>
                        <select
                            id="title"
                            name="title"
                            defaultValue={customer?.title || ''}
                            disabled={isPending}
                            className="w-full h-11 px-3.5 rounded-xl border border-[#EAE6DF] dark:border-[#3A291C] bg-[#FAF8F5]/50 dark:bg-[#1E140D] text-sm text-[#1D120A] dark:text-[#F8F4EE] focus:outline-none focus:border-[#D4A43C] transition-colors"
                        >
                            <option value="">-- {t('titleCivility')} --</option>
                            <option value="Mr">{t('titleMr')}</option>
                            <option value="Mrs">{t('titleMrs')}</option>
                            <option value="Other">{t('titleOther')}</option>
                        </select>
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-2">
                        <Label htmlFor="phoneNumber" className="text-xs font-semibold uppercase tracking-wider text-[#3A2418] dark:text-[#E0D8D0]">
                            {t('phoneNumber')}
                        </Label>
                        <div className="relative">
                            <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C7A6B]" />
                            <Input
                                id="phoneNumber"
                                name="phoneNumber"
                                type="tel"
                                placeholder={t('phonePlaceholder')}
                                defaultValue={customer?.phoneNumber || ''}
                                disabled={isPending}
                                className="pl-10 h-11 rounded-xl border-[#EAE6DF] dark:border-[#3A291C] bg-[#FAF8F5]/50 dark:bg-[#1E140D] text-sm focus:border-[#D4A43C]"
                            />
                        </div>
                    </div>

                    {/* First Name */}
                    <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-xs font-semibold uppercase tracking-wider text-[#3A2418] dark:text-[#E0D8D0]">
                            {t('firstName')} *
                        </Label>
                        <Input
                            id="firstName"
                            name="firstName"
                            type="text"
                            placeholder="John"
                            defaultValue={firstName}
                            required
                            disabled={isPending}
                            className="h-11 rounded-xl border-[#EAE6DF] dark:border-[#3A291C] bg-[#FAF8F5]/50 dark:bg-[#1E140D] text-sm focus:border-[#D4A43C]"
                        />
                    </div>

                    {/* Last Name */}
                    <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-xs font-semibold uppercase tracking-wider text-[#3A2418] dark:text-[#E0D8D0]">
                            {t('lastName')} *
                        </Label>
                        <Input
                            id="lastName"
                            name="lastName"
                            type="text"
                            placeholder="Doe"
                            defaultValue={lastName}
                            required
                            disabled={isPending}
                            className="h-11 rounded-xl border-[#EAE6DF] dark:border-[#3A291C] bg-[#FAF8F5]/50 dark:bg-[#1E140D] text-sm focus:border-[#D4A43C]"
                        />
                    </div>
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
                        <span>{t('profileUpdated')}</span>
                    </div>
                )}

                <div className="pt-2">
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="min-w-[200px] h-11 bg-[#0F291E] hover:bg-[#1A3D2E] text-white rounded-xl font-medium shadow-xs"
                    >
                        {isPending ? t('updating') : t('updateProfile')}
                    </Button>
                </div>
            </form>
        </div>
    );
}
