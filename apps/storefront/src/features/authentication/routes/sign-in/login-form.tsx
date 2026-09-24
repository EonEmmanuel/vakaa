'use client';

import {useState, useTransition} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import * as z from 'zod';
import {loginAction} from './actions';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {PasswordInput} from '@/components/ui/password-input';
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

const loginSchema = z.object({
    username: z.email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
    redirectTo?: string;
}

export function LoginForm({redirectTo}: LoginFormProps) {
    const t = useTranslations('Auth');
    const [isPending, startTransition] = useTransition();
    const [serverError, setServerError] = useState<string | null>(null);

    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    });

    const onSubmit = (data: LoginFormData) => {
        setServerError(null);

        startTransition(async () => {
            const formData = new FormData();
            formData.append('username', data.username);
            formData.append('password', data.password);
            if (redirectTo) {
                formData.append('redirectTo', redirectTo);
            }

            const result = await loginAction(undefined, formData);
            if (result?.error) {
                setServerError(result.error);
            }
        });
    };

    const registerHref = redirectTo
        ? `/register?redirectTo=${encodeURIComponent(redirectTo)}`
        : '/register';

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                    control={form.control}
                    name="username"
                    render={({field}) => (
                        <FormItem className="space-y-1.5">
                            <FormLabel className="text-xs font-semibold uppercase tracking-wider text-[#1D120A]/80 dark:text-[#F8F4EE]/80">
                                {t('email')}
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

                <FormField
                    control={form.control}
                    name="password"
                    render={({field}) => (
                        <FormItem className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <FormLabel className="text-xs font-semibold uppercase tracking-wider text-[#1D120A]/80 dark:text-[#F8F4EE]/80">
                                    {t('password')}
                                </FormLabel>
                                <Link
                                    href="/forgot-password"
                                    className="text-xs font-medium text-[#6B5E55] dark:text-[#A18E81] hover:text-[#D4A43C] dark:hover:text-[#D4A43C] transition-colors"
                                >
                                    {t('forgotPassword')}
                                </Link>
                            </div>

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
                        {isPending ? t('signingIn') : t('signIn')}
                    </Button>
                </div>

                <div className="pt-4 border-t border-[#E7DED0]/60 dark:border-[#352317]/60 text-center">
                    <p className="text-xs text-[#6B5E55] dark:text-[#A18E81]">
                        {t('noAccount')}{' '}
                        <Link
                            href={registerHref}
                            className="font-bold text-[#1D120A] dark:text-[#F8F4EE] hover:text-[#D4A43C] dark:hover:text-[#D4A43C] underline decoration-[#D4A43C]/50 hover:decoration-[#D4A43C] underline-offset-4 transition-colors"
                        >
                            {t('register')}
                        </Link>
                    </p>
                </div>
            </form>
        </Form>
    );
}
