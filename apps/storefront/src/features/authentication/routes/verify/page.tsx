import type {Metadata} from 'next';
import {Suspense} from 'react';
import {VerifyLoading} from './verify-loading';
import {VerifyContent} from './verify-content';

export const metadata: Metadata = {
    title: 'Verify Email',
    description: 'Verify your email address to complete registration.',
};

export default function VerifyPage({searchParams}: PageProps<'/[locale]/verify'>) {
    return (
        <div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4 py-16 bg-gradient-to-b from-[#FAF8F5] via-[#FDFBF7] to-[#F5EFEB] dark:from-[#0E0704] dark:via-[#140C06] dark:to-[#0A0503]">
            <div className="w-full max-w-md">
                <Suspense fallback={<VerifyLoading/>}>
                    <VerifyContent searchParams={searchParams}/>
                </Suspense>
            </div>
        </div>
    );
}
