'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { registerAction } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Link } from '@/platform/i18n/navigation';
import {useTranslations} from 'next-intl';

function createRegistrationSchema(t: ReturnType<typeof useTranslations<'Auth'>>) {
    return z.object({
        emailAddress: z.string().email(t('emailValidation')),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        phoneNumber: z.string().optional(),
        password: z.string().min(8, t('passwordMinLength')),
        confirmPassword: z.string(),
    }).refine((data) => data.password === data.confirmPassword, {
        message: t('passwordsMismatch'),
        path: ["confirmPassword"],
    });
}

type RegistrationFormData = z.infer<ReturnType<typeof createRegistrationSchema>>;

interface RegistrationFormProps {
    redirectTo?: string;
}

export function RegistrationForm({ redirectTo }: RegistrationFormProps) {
    const t = useTranslations('Auth');
    const [isPending, startTransition] = useTransition();
    const [serverError, setServerError] = useState<string | null>(null);

    const registrationSchema = createRegistrationSchema(t);
    const form = useForm<RegistrationFormData>({
        resolver: zodResolver(registrationSchema),
        defaultValues: {
            emailAddress: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            password: '',
            confirmPassword: '',
        },
    });

    const onSubmit = (data: RegistrationFormData) => {
        setServerError(null);

        startTransition(async () => {
            const formData = new FormData();
            formData.append('emailAddress', data.emailAddress);
            if (data.firstName) formData.append('firstName', data.firstName);
            if (data.lastName) formData.append('lastName', data.lastName);
            if (data.phoneNumber) formData.append('phoneNumber', data.phoneNumber);
            formData.append('password', data.password);
            if (redirectTo) {
                formData.append('redirectTo', redirectTo);
            }

            const result = await registerAction(undefined, formData);
            if (result?.error) {
                setServerError(result.error);
            }
        });
    };

    const signInHref = redirectTo
        ? `/sign-in?redirectTo=${encodeURIComponent(redirectTo)}`
        : '/sign-in';

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="emailAddress"
                    render={({ field }) => (
                        <FormItem className="space-y-1.5">
                            <FormLabel className="text-xs font-semibold uppercase tracking-wider text-[#1D120A]/80 dark:text-[#F8F4EE]/80">
                                {t('emailAddressLabel')}
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    placeholder="nom@exemple.com"
                                    disabled={isPending}
                                    className="h-12 px-4 rounded-xl bg-white/70 dark:bg-[#1E140C]/80 border-[#E7DED0] dark:border-[#352317] focus-visible:border-[#D4A43C] focus-visible:ring-[#D4A43C]/20 text-[#1D120A] dark:text-[#F8F4EE] placeholder:text-[#6B5E55]/50 transition-all text-sm"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage className="text-xs text-red-600 dark:text-red-400" />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem className="space-y-1.5">
                                <FormLabel className="text-xs font-semibold uppercase tracking-wider text-[#1D120A]/80 dark:text-[#F8F4EE]/80">
                                    {t('firstNameLabel')}
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="Aïssatou"
                                        disabled={isPending}
                                        className="h-12 px-4 rounded-xl bg-white/70 dark:bg-[#1E140C]/80 border-[#E7DED0] dark:border-[#352317] focus-visible:border-[#D4A43C] focus-visible:ring-[#D4A43C]/20 text-[#1D120A] dark:text-[#F8F4EE] placeholder:text-[#6B5E55]/50 transition-all text-sm"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="text-xs text-red-600 dark:text-red-400" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem className="space-y-1.5">
                                <FormLabel className="text-xs font-semibold uppercase tracking-wider text-[#1D120A]/80 dark:text-[#F8F4EE]/80">
                                    {t('lastNameLabel')}
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="Diallo"
                                        disabled={isPending}
                                        className="h-12 px-4 rounded-xl bg-white/70 dark:bg-[#1E140C]/80 border-[#E7DED0] dark:border-[#352317] focus-visible:border-[#D4A43C] focus-visible:ring-[#D4A43C]/20 text-[#1D120A] dark:text-[#F8F4EE] placeholder:text-[#6B5E55]/50 transition-all text-sm"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="text-xs text-red-600 dark:text-red-400" />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                        <FormItem className="space-y-1.5">
                            <FormLabel className="text-xs font-semibold uppercase tracking-wider text-[#1D120A]/80 dark:text-[#F8F4EE]/80">
                                {t('phoneNumberLabel')}
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="tel"
                                    placeholder="+237 600 000 000"
                                    disabled={isPending}
                                    className="h-12 px-4 rounded-xl bg-white/70 dark:bg-[#1E140C]/80 border-[#E7DED0] dark:border-[#352317] focus-visible:border-[#D4A43C] focus-visible:ring-[#D4A43C]/20 text-[#1D120A] dark:text-[#F8F4EE] placeholder:text-[#6B5E55]/50 transition-all text-sm"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage className="text-xs text-red-600 dark:text-red-400" />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem className="space-y-1.5">
                                <FormLabel className="text-xs font-semibold uppercase tracking-wider text-[#1D120A]/80 dark:text-[#F8F4EE]/80">
                                    {t('passwordLabel')}
                                </FormLabel>
                                <FormControl>
                                    <PasswordInput
                                        placeholder="••••••••"
                                        disabled={isPending}
                                        className="h-12 px-4 rounded-xl bg-white/70 dark:bg-[#1E140C]/80 border-[#E7DED0] dark:border-[#352317] focus-visible:border-[#D4A43C] focus-visible:ring-[#D4A43C]/20 text-[#1D120A] dark:text-[#F8F4EE] placeholder:text-[#6B5E55]/50 transition-all text-sm"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="text-xs text-red-600 dark:text-red-400" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem className="space-y-1.5">
                                <FormLabel className="text-xs font-semibold uppercase tracking-wider text-[#1D120A]/80 dark:text-[#F8F4EE]/80">
                                    {t('confirmPasswordLabel')}
                                </FormLabel>
                                <FormControl>
                                    <PasswordInput
                                        placeholder="••••••••"
                                        disabled={isPending}
                                        className="h-12 px-4 rounded-xl bg-white/70 dark:bg-[#1E140C]/80 border-[#E7DED0] dark:border-[#352317] focus-visible:border-[#D4A43C] focus-visible:ring-[#D4A43C]/20 text-[#1D120A] dark:text-[#F8F4EE] placeholder:text-[#6B5E55]/50 transition-all text-sm"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="text-xs text-red-600 dark:text-red-400" />
                            </FormItem>
                        )}
                    />
                </div>

                {serverError && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs font-medium text-red-600 dark:text-red-400 text-center animate-in fade-in-50">
                        {serverError}
                    </div>
                )}

                <div className="pt-2">
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full h-12 rounded-full bg-[#D4A43C] hover:bg-[#C29332] text-[#140C06] font-bold tracking-[0.16em] uppercase text-xs transition-all shadow-md hover:shadow-lg active:scale-[0.99] disabled:opacity-50"
                    >
                        {isPending ? t('creatingAccount') : t('createAccount')}
                    </Button>
                </div>

                <div className="pt-4 border-t border-[#E7DED0]/60 dark:border-[#352317]/60 text-center">
                    <p className="text-xs text-[#6B5E55] dark:text-[#A18E81]">
                        {t('alreadyHaveAccount')}{' '}
                        <Link
                            href={signInHref}
                            className="font-bold text-[#1D120A] dark:text-[#F8F4EE] hover:text-[#D4A43C] dark:hover:text-[#D4A43C] underline decoration-[#D4A43C]/50 hover:decoration-[#D4A43C] underline-offset-4 transition-colors"
                        >
                            {t('signInLink')}
                        </Link>
                    </p>
                </div>
            </form>
        </Form>
    );
}
