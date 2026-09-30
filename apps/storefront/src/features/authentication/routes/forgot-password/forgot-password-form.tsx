'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { requestPasswordResetAction } from './actions';
import { MailCheck, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

function createForgotPasswordSchema(t: ReturnType<typeof useTranslations<'Auth'>>) {
    return z.object({
        emailAddress: z.email(t('emailValidation')),
    });
}

type ForgotPasswordFormData = z.infer<ReturnType<typeof createForgotPasswordSchema>>;

export function ForgotPasswordForm() {
    const t = useTranslations('Auth');
    const [isPending, startTransition] = useTransition();
    const [serverError, setServerError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const forgotPasswordSchema = createForgotPasswordSchema(t);
    const form = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            emailAddress: '',
        },
    });

    const onSubmit = (data: ForgotPasswordFormData) => {
        setServerError(null);

        startTransition(async () => {
            const formData = new FormData();
            formData.append('emailAddress', data.emailAddress);

            const result = await requestPasswordResetAction(undefined, formData);
            if (result?.error) {
                setServerError(result.error);
            } else if (result?.success) {
                setSuccess(true);
            }
        });
    };

    if (success) {
        return (
            <div className="rounded-2xl border border-[#E7DED0] dark:border-[#2C1D11] bg-white/90 dark:bg-[#180E08]/90 shadow-2xl p-8 sm:p-10 backdrop-blur-md text-center space-y-6">
                <div className="w-14 h-14 rounded-full bg-[#D4A43C]/10 border border-[#D4A43C]/25 flex items-center justify-center mx-auto text-[#D4A43C]">
                    <MailCheck className="w-7 h-7" />
                </div>
                <div className="space-y-2">
                    <h2 className="font-sans text-2xl font-bold tracking-tight text-[#140C06] dark:text-[#FAF6F0]">
                        {t('checkYourEmail')}
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
                        {t('checkYourEmailDescription')}
                    </p>
                </div>
                <div className="pt-2">
                    <Link href="/sign-in" className="block">
                        <Button
                            variant="outline"
                            className="w-full h-12 rounded-full uppercase tracking-[0.14em] text-xs font-bold border-[#E7DED0] dark:border-[#352317] hover:border-[#D4A43C] hover:text-[#D4A43C] transition-all"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            {t('backToSignIn')}
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
                <h2 className="font-sans font-bold text-2xl sm:text-3xl tracking-tight text-[#140C06] dark:text-[#FAF6F0]">
                    {t('forgotPasswordTitle')}
                </h2>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
                    {t('forgotPasswordDescription')}
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="emailAddress"
                        render={({ field }) => (
                            <FormItem className="space-y-1.5">
                                <FormLabel className="text-xs font-bold uppercase tracking-[0.12em] text-[#140C06]/80 dark:text-[#FAF6F0]/80">
                                    {t('email')}
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="email"
                                        placeholder="you@domain.com"
                                        disabled={isPending}
                                        className="h-12 rounded-xl bg-white/80 dark:bg-[#1E140C]/80 border-[#E7DED0] dark:border-[#352317] focus-visible:border-[#D4A43C] focus-visible:ring-[#D4A43C]/20 transition-colors"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="text-xs text-destructive" />
                            </FormItem>
                        )}
                    />

                    {serverError && (
                        <div className="p-3.5 rounded-xl text-xs bg-destructive/10 text-destructive border border-destructive/20 font-medium">
                            {serverError}
                        </div>
                    )}

                    <div className="space-y-4 pt-2">
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="w-full h-12 rounded-full uppercase tracking-[0.16em] text-xs font-bold bg-[#D4A43C] hover:bg-[#C2932E] text-[#140C06] shadow-md transition-all active:scale-[0.99]"
                        >
                            {isPending ? t('sending') : t('sendResetLink')}
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
            </Form>
        </div>
    );
}
