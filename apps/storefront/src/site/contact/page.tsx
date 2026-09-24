import { getTranslations } from 'next-intl/server';
import { getRouteLocale } from '@/platform/i18n/server';
import { Mail, Phone, MapPin, Clock, MessageSquare, ShieldCheck, HelpCircle } from "lucide-react";
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getRouteLocale();
    const t = await getTranslations({locale, namespace: 'Contact'});
    return {
        title: `${t('title')} | VAKAA Concierge`,
        description: t('subtitle'),
    };
}

export async function ContactPage() {
    const locale = await getRouteLocale();
    const t = await getTranslations({locale, namespace: 'Contact'});

    const faqs = [
        {
            q: t('faq1Question'),
            a: t('faq1Answer'),
        },
        {
            q: t('faq2Question'),
            a: t('faq2Answer'),
        },
        {
            q: t('faq3Question'),
            a: t('faq3Answer'),
        },
    ];

    return (
        <div className="bg-[#F8F4EE] dark:bg-[#140C06] min-h-screen text-[#1D120A] dark:text-[#F8F4EE] transition-colors pt-28 pb-20">
            {/* Editorial Hero Header */}
            <section className="relative overflow-hidden py-16 sm:py-20 md:py-24 border-b border-[#E7DED0]/60 dark:border-[#3A291C]">
                <div className="vakaa-container">
                    <div className="max-w-3xl mx-auto text-center space-y-6">
                        <span className="text-[11px] font-bold tracking-[0.25em] text-[#D4A43C] uppercase">
                            {t('badge')}
                        </span>
                        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.08] uppercase">
                            {t('title')}
                        </h1>
                        <div className="w-16 h-[2px] bg-[#D4A43C] mx-auto rounded-full" />
                        <p className="text-base sm:text-lg md:text-xl text-[#3A2418]/80 dark:text-[#F8F4EE]/75 font-sans leading-relaxed">
                            {t('subtitle')}
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Details & Inquiry Form Grid */}
            <section className="py-16 sm:py-24 border-b border-[#E7DED0]/60 dark:border-[#3A291C]">
                <div className="vakaa-container">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                        {/* Left Column: Direct Concierge Channels */}
                        <div className="lg:col-span-5 space-y-8">
                            <div>
                                <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight mb-3">
                                    Direct Channels
                                </h2>
                                <p className="text-sm text-[#6B5E55] dark:text-[#B5A496] font-sans leading-relaxed">
                                    Whether you need assistance selecting the ideal silhouette, tracking your shipment, or arranging bespoke monogramming, our team is at your disposal.
                                </p>
                            </div>

                            <div className="space-y-6">
                                {/* Email */}
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[#FAF7F2] dark:bg-[#1D120A] border border-[#E7DED0] dark:border-[#3A291C] flex items-center justify-center text-[#D4A43C] shrink-0">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold tracking-wider uppercase text-[#A66B2D]">
                                            {t('emailLabel')}
                                        </p>
                                        <a
                                            href={`mailto:${t('emailValue')}`}
                                            className="text-sm font-medium hover:text-[#D4A43C] transition-colors"
                                        >
                                            {t('emailValue')}
                                        </a>
                                    </div>
                                </div>

                                {/* Phone & WhatsApp */}
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[#FAF7F2] dark:bg-[#1D120A] border border-[#E7DED0] dark:border-[#3A291C] flex items-center justify-center text-[#D4A43C] shrink-0">
                                        <Phone className="w-4 h-4" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold tracking-wider uppercase text-[#A66B2D]">
                                            {t('phoneLabel')}
                                        </p>
                                        <p className="text-sm font-medium">{t('phoneValue')}</p>
                                        <p className="text-[11px] text-[#6B5E55] dark:text-[#B5A496]">{t('phoneHours')}</p>
                                    </div>
                                </div>

                                {/* Atelier Locations */}
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[#FAF7F2] dark:bg-[#1D120A] border border-[#E7DED0] dark:border-[#3A291C] flex items-center justify-center text-[#D4A43C] shrink-0">
                                        <MapPin className="w-4 h-4" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <p className="text-xs font-bold tracking-wider uppercase text-[#A66B2D]">
                                            {t('atelierTitle')}
                                        </p>
                                        <p className="text-xs text-[#6B5E55] dark:text-[#B5A496] leading-relaxed">
                                            {t('accraOffice')}
                                        </p>
                                        <p className="text-xs text-[#6B5E55] dark:text-[#B5A496] leading-relaxed">
                                            {t('londonOffice')}
                                        </p>
                                    </div>
                                </div>

                                {/* Press & Wholesale */}
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[#FAF7F2] dark:bg-[#1D120A] border border-[#E7DED0] dark:border-[#3A291C] flex items-center justify-center text-[#D4A43C] shrink-0">
                                        <ShieldCheck className="w-4 h-4" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold tracking-wider uppercase text-[#A66B2D]">
                                            {t('pressLabel')}
                                        </p>
                                        <a
                                            href={`mailto:${t('pressValue')}`}
                                            className="text-sm font-medium hover:text-[#D4A43C] transition-colors"
                                        >
                                            {t('pressValue')}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Concierge Inquiry Form */}
                        <div className="lg:col-span-7 bg-[#FAF7F2] dark:bg-[#1D120A]/70 border border-[#E7DED0]/80 dark:border-[#3A291C] p-8 sm:p-10 lg:p-12 rounded-sm shadow-xs">
                            <div className="space-y-2 mb-8">
                                <h3 className="font-serif text-2xl font-bold tracking-tight">
                                    {t('formTitle')}
                                </h3>
                                <p className="text-xs sm:text-sm text-[#6B5E55] dark:text-[#B5A496] font-sans">
                                    Please submit your message below and an atelier concierge will respond within 24 hours.
                                </p>
                            </div>

                            <form className="space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold tracking-wider uppercase text-[#6B5E55] dark:text-[#B5A496]">
                                            {t('formName')} *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. Amara Mensah"
                                            className="w-full bg-white dark:bg-[#140C06] border border-[#E7DED0] dark:border-[#3A291C] px-4 py-3 text-xs rounded-sm focus:outline-none focus:border-[#D4A43C] transition-colors"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold tracking-wider uppercase text-[#6B5E55] dark:text-[#B5A496]">
                                            {t('formEmail')} *
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            placeholder="amara@example.com"
                                            className="w-full bg-white dark:bg-[#140C06] border border-[#E7DED0] dark:border-[#3A291C] px-4 py-3 text-xs rounded-sm focus:outline-none focus:border-[#D4A43C] transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold tracking-wider uppercase text-[#6B5E55] dark:text-[#B5A496]">
                                        {t('formSubject')}
                                    </label>
                                    <select
                                        className="w-full bg-white dark:bg-[#140C06] border border-[#E7DED0] dark:border-[#3A291C] px-4 py-3 text-xs rounded-sm focus:outline-none focus:border-[#D4A43C] transition-colors"
                                    >
                                        <option>{t('formSubjectOption1')}</option>
                                        <option>{t('formSubjectOption2')}</option>
                                        <option>{t('formSubjectOption3')}</option>
                                        <option>{t('formSubjectOption4')}</option>
                                        <option>{t('formSubjectOption5')}</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold tracking-wider uppercase text-[#6B5E55] dark:text-[#B5A496]">
                                        {t('formMessage')} *
                                    </label>
                                    <textarea
                                        rows={5}
                                        required
                                        placeholder="Please provide any details or order numbers..."
                                        className="w-full bg-white dark:bg-[#140C06] border border-[#E7DED0] dark:border-[#3A291C] px-4 py-3 text-xs rounded-sm focus:outline-none focus:border-[#D4A43C] transition-colors resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-[#1D120A] hover:bg-[#3A2418] text-[#F8F4EE] dark:bg-[#D4A43C] dark:hover:bg-[#BF9232] dark:text-[#140C06] font-semibold text-xs uppercase tracking-widest py-4 rounded-sm transition-all duration-300 shadow-sm cursor-pointer"
                                >
                                    {t('formSubmit')}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Concierge FAQ Section */}
            <section className="py-16 sm:py-24">
                <div className="vakaa-container max-w-4xl mx-auto">
                    <div className="text-center mb-12 space-y-3">
                        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#EFE8DD] dark:bg-[#2A1B10] text-[#D4A43C] mb-2">
                            <HelpCircle className="w-5 h-5 stroke-[1.75]" />
                        </div>
                        <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
                            Frequently Answered Questions
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <div
                                key={idx}
                                className="bg-[#FAF7F2] dark:bg-[#1D120A]/70 border border-[#E7DED0]/80 dark:border-[#3A291C] p-6 sm:p-7 rounded-sm space-y-2"
                            >
                                <h3 className="font-serif text-base sm:text-lg font-bold text-[#1D120A] dark:text-[#F8F4EE]">
                                    {faq.q}
                                </h3>
                                <p className="text-xs sm:text-sm text-[#6B5E55] dark:text-[#B5A496] leading-relaxed font-sans">
                                    {faq.a}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
