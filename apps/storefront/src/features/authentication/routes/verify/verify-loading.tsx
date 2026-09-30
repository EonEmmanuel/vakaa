import {Loader2} from 'lucide-react';

export function VerifyLoading() {
    return (
        <div className="rounded-2xl border border-[#E7DED0] dark:border-[#2C1D11] bg-white/90 dark:bg-[#180E08]/90 shadow-2xl p-8 sm:p-10 backdrop-blur-md text-center space-y-6">
            <div className="flex justify-center py-4">
                <Loader2 className="h-12 w-12 text-[#D4A43C] animate-spin"/>
            </div>
            <div className="space-y-2">
                <h1 className="font-sans font-bold text-2xl sm:text-3xl tracking-tight text-[#140C06] dark:text-[#FAF6F0]">Verifying Your Account</h1>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
                    Please wait while we verify your email address...
                </p>
            </div>
        </div>
    );
}
