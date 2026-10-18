import { getTranslations } from 'next-intl/server';
import { getRouteLocale } from '@/platform/i18n/server';
import { Link } from '@/platform/i18n/navigation';
import { DecorativeDotCluster } from '@/components/ui/decorative-dot-cluster';
import { ContactForm } from './contact-form';
import { ContactMap } from './contact-map';
import { TrustBar } from '@/components/shared/trust-bar';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getRouteLocale();
    const t = await getTranslations({ locale, namespace: 'Contact' });
    return {
        title: `${t('title')} | VAKAA Concierge`,
        description: t('subtitle'),
    };
}

function FacebookIcon({ className = "w-4 h-4" }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
    );
}

function TwitterIcon({ className = "w-4 h-4" }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
}

function PinterestIcon({ className = "w-4 h-4" }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
            <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
        </svg>
    );
}

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
    );
}

function YoutubeIcon({ className = "w-4 h-4" }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
    );
}

export async function ContactPage() {
    const locale = await getRouteLocale();
    const t = await getTranslations({ locale, namespace: 'Contact' });
    const tCommon = await getTranslations({ locale, namespace: 'Common' });

    return (
        <div className="bg-[#FAF8F5] min-h-screen text-[#1D120A] flex flex-col">
            {/* 1. Centered Breadcrumb Hero Banner (Matching reference a7d0a0195762505.69ca92c632005.png) */}
            <section className="relative w-full overflow-hidden bg-[#FAF8F5] border-b border-[#E7DED0]/60 pt-28 sm:pt-32 pb-12 sm:pb-16 text-center transition-colors">
                {/* Decorative dot clusters on left and right */}
                <div className="absolute left-4 sm:left-12 top-1/2 -translate-y-1/2 w-32 sm:w-44 h-20 pointer-events-none opacity-70">
                    <DecorativeDotCluster className="w-full h-full" />
                </div>
                <div className="absolute right-4 sm:right-12 top-1/2 -translate-y-1/2 w-32 sm:w-44 h-20 pointer-events-none opacity-70 transform rotate-180">
                    <DecorativeDotCluster className="w-full h-full" />
                </div>

                <div className="vakaa-container relative z-10 space-y-3 max-w-3xl mx-auto">
                    <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1D120A] leading-tight">
                        {t('title') || 'Contact Us'}
                    </h1>

                    {/* Centered Breadcrumbs */}
                    <nav aria-label="Fil d'ariane" className="flex items-center justify-center gap-2 text-xs sm:text-sm text-[#3A2418]/60 pt-1">
                        <Link
                            href="/"
                            className="hover:text-[#A66B2D] transition-colors cursor-pointer"
                        >
                            {tCommon('home') || 'Home'}
                        </Link>
                        <span className="text-[#3A2418]/30">/</span>
                        <span className="font-semibold text-[#1D120A]">
                            {t('title') || 'Contact Us'}
                        </span>
                    </nav>
                </div>
            </section>

            {/* 2. Main Two-Column Content Area */}
            <main className="vakaa-container py-14 sm:py-20 flex-1">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start max-w-6xl mx-auto">
                    {/* Left Column: Get in Touch Form */}
                    <div className="lg:col-span-7 space-y-7">
                        <div>
                            <h2 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-[#1D120A] mb-2">
                                {t('formTitle') || 'Get in Touch'}
                            </h2>
                            <p className="text-xs sm:text-sm text-[#3A2418]/60 font-sans">
                                {t('subtitle')}
                            </p>
                        </div>

                        <ContactForm />
                    </div>

                    {/* Right Column card: upgrade to bg-[#1D120A] text-[#FAF8F5] rounded-3xl p-8 sm:p-10 border border-[#E7DED0]/20 shadow-xl space-y-8 */}
                    <div className="lg:col-span-5 bg-[#1D120A] text-[#FAF8F5] rounded-3xl p-8 sm:p-10 border border-[#E7DED0]/20 shadow-xl space-y-8">
                        {/* Ateliers */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-sans text-xl font-bold tracking-tight text-[#FAF8F5] mb-2">
                                    {t('atelierTitle')}
                                </h3>
                                <p className="text-sm text-[#FAF8F5]/80 leading-relaxed font-sans">
                                    {t('atelierValue')}
                                </p>
                            </div>
                        </div>

                        {/* Contact */}
                        <div className="space-y-3 pt-6 border-t border-[#E7DED0]/10">
                            <div>
                                <h3 className="font-sans text-xl font-bold tracking-tight text-[#FAF8F5] mb-2">
                                    {t('phoneLabel')}
                                </h3>
                                <div className="text-sm text-[#FAF8F5]/80 space-y-1 font-sans">
                                    <p>{t('phoneValue')}</p>
                                    <p>
                                        <span className="text-[#FAF8F5]/60">{t('emailLabel')} : </span>
                                        <a href={`mailto:${t('emailValue')}`} className="hover:text-[#D4A43C] transition-colors underline-offset-4 hover:underline">
                                            {t('emailValue')}
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* VIP Appointments & Hours */}
                        <div className="pt-6 border-t border-[#E7DED0]/10">
                            <h3 className="font-sans text-sm font-semibold uppercase tracking-wider text-[#D4A43C] mb-2">
                                {t('vipAppointments')}
                            </h3>
                            <p className="text-xs text-[#FAF8F5]/60 font-sans">
                                {t('phoneHours')}
                            </p>
                        </div>

                        {/* Stay Connected */}
                        <div className="pt-6 border-t border-[#E7DED0]/10">
                            <h3 className="font-sans text-xl font-bold tracking-tight text-[#FAF8F5] mb-4">
                                {t('stayConnected')}
                            </h3>
                            <div className="flex items-center gap-3">
                                <a
                                    href="https://facebook.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Facebook"
                                    className="w-10 h-10 rounded-full bg-[#2D1B10] text-[#D4A43C] hover:bg-[#D4A43C] hover:text-[#1D120A] hover:scale-105 transition-all flex items-center justify-center shadow-xs"
                                >
                                    <FacebookIcon className="w-4 h-4" />
                                </a>
                                <a
                                    href="https://twitter.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Twitter"
                                    className="w-10 h-10 rounded-full bg-[#2D1B10] text-[#D4A43C] hover:bg-[#D4A43C] hover:text-[#1D120A] hover:scale-105 transition-all flex items-center justify-center shadow-xs"
                                >
                                    <TwitterIcon className="w-4 h-4" />
                                </a>
                                <a
                                    href="https://pinterest.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Pinterest"
                                    className="w-10 h-10 rounded-full bg-[#2D1B10] text-[#D4A43C] hover:bg-[#D4A43C] hover:text-[#1D120A] hover:scale-105 transition-all flex items-center justify-center shadow-xs"
                                >
                                    <PinterestIcon className="w-4 h-4" />
                                </a>
                                <a
                                    href="https://instagram.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Instagram"
                                    className="w-10 h-10 rounded-full bg-[#2D1B10] text-[#D4A43C] hover:bg-[#D4A43C] hover:text-[#1D120A] hover:scale-105 transition-all flex items-center justify-center shadow-xs"
                                >
                                    <InstagramIcon className="w-4 h-4" />
                                </a>
                                <a
                                    href="https://youtube.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="YouTube"
                                    className="w-10 h-10 rounded-full bg-[#2D1B10] text-[#D4A43C] hover:bg-[#D4A43C] hover:text-[#1D120A] hover:scale-105 transition-all flex items-center justify-center shadow-xs"
                                >
                                    <YoutubeIcon className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* 3. Full-Width Grayscale Map Banner (Matching reference image) */}
            <ContactMap />

            {/* 4. Universal Trust Bar */}
            <TrustBar />
        </div>
    );
}
