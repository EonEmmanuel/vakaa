import type {Metadata} from 'next';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { ResetPasswordForm } from './reset-password-form';

export const metadata: Metadata = {
    title: 'Reset Password',
    description: 'Create a new password for your account.',
};

export default function ResetPasswordPage({searchParams}: PageProps<'/[locale]/reset-password'>) {
    return (
        <div className="min-h-[calc(100vh-140px)] flex items-center justify-center px-4 py-16 bg-gradient-to-b from-[#FAF8F5] via-[#FDFBF7] to-[#F5EFEB] dark:from-[#0E0704] dark:via-[#140C06] dark:to-[#0A0503]">
            <div className="w-full max-w-md">
                <Suspense fallback={
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-[#D4A43C]" />
                    </div>
                }>
                    <ResetPasswordForm searchParams={searchParams} />
                </Suspense>
            </div>
        </div>
    );
}
