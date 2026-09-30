'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { applyPromotionCode, type ApplyCouponResult } from './actions';
import { Loader2 } from 'lucide-react';

export function PromotionCodeForm() {
    const t = useTranslations('Cart');
    const [state, formAction, isPending] = useActionState<ApplyCouponResult | undefined, FormData>(
        applyPromotionCode,
        undefined
    );
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (state?.success) {
            formRef.current?.reset();
        }
    }, [state?.success]);

    return (
        <form ref={formRef} action={formAction} className="space-y-1.5 w-full sm:w-auto">
            <div className="flex flex-col sm:flex-row items-center gap-2">
                <input
                    type="text"
                    name="code"
                    placeholder={t('enterCode')}
                    className="w-full sm:w-64 h-11 px-5 rounded-full border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#1A120B] text-xs sm:text-sm font-medium uppercase placeholder:normal-case placeholder:text-stone-400 focus:outline-none focus:border-[#1B3B2B] dark:focus:border-[#D4A43C] focus:ring-1 focus:ring-[#1B3B2B] dark:focus:ring-[#D4A43C] transition-all"
                    required
                    disabled={isPending}
                />
                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full sm:w-auto h-11 px-6 rounded-full bg-[#1B3B2B] hover:bg-[#152e22] text-white text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-xs active:scale-[0.98] disabled:opacity-60 flex items-center justify-center shrink-0 cursor-pointer"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                            {t('apply')}
                        </>
                    ) : (
                        t('apply')
                    )}
                </button>
            </div>
            {state?.error && (
                <p className="text-xs text-red-500 font-medium pl-3 animate-in fade-in-50">
                    {state.error}
                </p>
            )}
        </form>
    );
}
