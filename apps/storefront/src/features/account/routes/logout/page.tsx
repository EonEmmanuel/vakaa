'use client';

import { useTransition } from 'react';
import { logoutAction } from '@/features/authentication/logout';
import { Button } from '@/components/ui/button';
import { Link } from '@/platform/i18n/navigation';
import { useTranslations } from 'next-intl';
import { LogOut, Loader2 } from 'lucide-react';

export default function LogoutPage() {
    const t = useTranslations('Account');
    const [isPending, startTransition] = useTransition();

    const handleLogout = () => {
        startTransition(async () => {
            await logoutAction();
        });
    };

    return (
        <div className="bg-white dark:bg-[#160E08] border border-[#EAE6DF] dark:border-[#3A291C] rounded-xl p-8 sm:p-12 shadow-xs text-center max-w-xl mx-auto space-y-6">
            <div className="mx-auto w-16 h-16 rounded-full bg-[#FAF8F5] dark:bg-[#22160F] border border-[#EAE6DF] dark:border-[#3A291C] flex items-center justify-center text-[#EAA838]">
                <LogOut className="w-8 h-8 ml-0.5" />
            </div>

            <div className="space-y-2">
                <h1 className="font-sans text-2xl sm:text-3xl font-bold text-[#1D120A] dark:text-[#F8F4EE] tracking-tight">
                    {t('logout')}
                </h1>
                <p className="text-sm text-[#6B5E55] dark:text-[#B5A496] max-w-md mx-auto leading-relaxed">
                    {t('logoutConfirm')}
                </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Button
                    onClick={handleLogout}
                    disabled={isPending}
                    className="w-full sm:w-auto min-w-[180px] h-11 bg-[#0F291E] hover:bg-[#1A3D2E] text-white rounded-xl font-medium shadow-xs"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            {t('updating')}
                        </>
                    ) : (
                        t('yesLogout')
                    )}
                </Button>
                <Link
                    href="/account/profile"
                    className="w-full sm:w-auto inline-flex items-center justify-center min-w-[140px] h-11 px-5 rounded-xl border border-[#EAE6DF] dark:border-[#3A291C] text-sm font-medium text-[#4A3728] dark:text-[#D5C7B8] hover:bg-[#FAF8F5] dark:hover:bg-[#1E140D] transition-colors"
                >
                    {t('stayConnected')}
                </Link>
            </div>
        </div>
    );
}
