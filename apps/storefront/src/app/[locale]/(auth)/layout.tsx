import {NavigationLink} from '@/site/navigation/navigation-link';
import {VakaaLogo} from '@/site/navigation/vakaa-logo';
import {ArrowLeft, ShieldCheck} from 'lucide-react';

const COPYRIGHT_YEAR = 2026;

export default function AuthLayout({children}: {children: React.ReactNode}) {
    return (
        <div className="min-h-screen bg-[#F8F4EE] dark:bg-[#140C06] flex flex-col justify-between text-[#1D120A] dark:text-[#F8F4EE] transition-colors selection:bg-[#D4A43C]/20">
            {/* Minimal Distraction-Free Luxury Header */}
            <header className="h-16 sm:h-20 border-b border-[#E7DED0]/60 dark:border-[#3A291C]/60 bg-[#F8F4EE]/80 dark:bg-[#140C06]/80 backdrop-blur-md sticky top-0 z-40">
                <div className="vakaa-container h-full flex items-center justify-between">
                    <NavigationLink
                        href="/"
                        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#1D120A]/75 dark:text-[#F8F4EE]/75 hover:text-[#D4A43C] transition-colors group"
                    >
                        <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                        <span>Boutique</span>
                    </NavigationLink>

                    <NavigationLink href="/" className="inline-block">
                        <VakaaLogo />
                    </NavigationLink>

                    <div className="w-20" />
                </div>
            </header>

            {/* Auth Page Content */}
            <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
                <div className="w-full max-w-5xl">
                    {children}
                </div>
            </main>

            {/* Discreet Luxury Footer */}
            <footer className="py-6 border-t border-[#E7DED0]/60 dark:border-[#3A291C]/60 bg-[#F8F4EE]/50 dark:bg-[#140C06]/50">
                <div className="vakaa-container flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6B5E55] dark:text-[#B5A496]">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#D4A43C]" />
                        <span>Maison VAKAA — Authentique Maroquinerie d&apos;Afrique</span>
                    </div>
                    <p>© {COPYRIGHT_YEAR} VAKAA. Slow Luxury Handcrafted in Africa.</p>
                </div>
            </footer>
        </div>
    );
}
