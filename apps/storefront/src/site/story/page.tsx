import Image from "next/image";
import { Link } from '@/platform/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { getRouteLocale } from '@/platform/i18n/server';
import { Sparkles, Shield, Heart, Gem, ArrowRight } from "lucide-react";
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getRouteLocale();
    const t = await getTranslations({locale, namespace: 'Story'});
    return {
        title: `${t('title')} | VAKAA`,
        description: t('subtitle'),
    };
}

export async function OurStoryPage() {
    const locale = await getRouteLocale();
    const t = await getTranslations({locale, namespace: 'Story'});

    const pillars = [
        {
            icon: Gem,
            title: t('pillar1Title'),
            desc: t('pillar1Desc'),
        },
        {
            icon: Sparkles,
            title: t('pillar2Title'),
            desc: t('pillar2Desc'),
        },
        {
            icon: Heart,
            title: t('pillar3Title'),
            desc: t('pillar3Desc'),
        },
        {
            icon: Shield,
            title: t('pillar4Title'),
            desc: t('pillar4Desc'),
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

            {/* Genesis & Origin Story Section */}
            <section className="py-16 sm:py-24 border-b border-[#E7DED0]/60 dark:border-[#3A291C]">
                <div className="vakaa-container">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                        {/* Narrative Column */}
                        <div className="lg:col-span-6 space-y-6">
                            <span className="text-xs font-semibold tracking-widest text-[#A66B2D] uppercase">
                                THE GENESIS
                            </span>
                            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight">
                                {t('originTitle')}
                            </h2>
                            <div className="space-y-4 text-sm sm:text-base text-[#3A2418]/85 dark:text-[#F8F4EE]/80 leading-relaxed font-sans">
                                <p>{t('originP1')}</p>
                                <p>{t('originP2')}</p>
                            </div>
                            <div className="pt-2">
                                <blockquote className="border-l-2 border-[#D4A43C] pl-4 italic text-[#3A2418]/90 dark:text-[#F8F4EE]/90 text-sm sm:text-base font-serif">
                                    &ldquo;True luxury is not about excess. It is about patience, provenance, and the spirit of the hands that shaped it.&rdquo;
                                </blockquote>
                            </div>
                        </div>

                        {/* Photography Showcase */}
                        <div className="lg:col-span-6">
                            <div className="relative aspect-[4/3] rounded-sm overflow-hidden shadow-lg border border-[#E7DED0]/70 dark:border-[#3A291C]">
                                <Image
                                    src="/images/artisan-hands.jpg"
                                    alt="Master artisan handcrafting VAKAA luxury bag"
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4 text-white">
                                    <p className="text-xs font-serif tracking-wider uppercase">Handcrafted in West Africa</p>
                                    <p className="text-[11px] text-white/80">Every piece takes up to 48 hours of artisanal dedication.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Four Pillars Grid */}
            <section className="py-16 sm:py-24">
                <div className="vakaa-container">
                    <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-4">
                        <span className="text-xs font-semibold tracking-widest text-[#D4A43C] uppercase">
                            OUR COMMITMENT
                        </span>
                        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                            {t('pillarsTitle')}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        {pillars.map((pillar, idx) => {
                            const Icon = pillar.icon;
                            return (
                                <div
                                    key={idx}
                                    className="bg-[#FAF7F2] dark:bg-[#1D120A]/70 p-7 sm:p-8 rounded-sm border border-[#E7DED0]/80 dark:border-[#3A291C] space-y-4 transition-all duration-300 hover:shadow-md"
                                >
                                    <div className="w-12 h-12 rounded-full bg-[#EFE8DD] dark:bg-[#2A1B10] flex items-center justify-center text-[#D4A43C]">
                                        <Icon className="w-5 h-5 stroke-[1.75]" />
                                    </div>
                                    <h3 className="font-serif text-lg font-bold tracking-tight">
                                        {pillar.title}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-[#6B5E55] dark:text-[#B5A496] leading-relaxed font-sans">
                                        {pillar.desc}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Bottom CTA Banner */}
                    <div className="mt-16 sm:mt-20 text-center bg-[#1D120A] text-[#F8F4EE] rounded-sm p-10 sm:p-14 space-y-6">
                        <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight uppercase">
                            {t('ctaTitle')}
                        </h3>
                        <p className="text-sm sm:text-base text-[#F8F4EE]/80 max-w-xl mx-auto font-sans">
                            Each bag carries the soul of African heritage, crafted to accompany you on every journey.
                        </p>
                        <div className="pt-2">
                            <Link
                                href="/search"
                                className="inline-flex items-center gap-2.5 bg-[#D4A43C] hover:bg-[#BF9232] text-[#140C06] font-semibold text-xs uppercase tracking-widest px-8 py-4 rounded-sm transition-all duration-300 shadow-sm"
                            >
                                <span>{t('ctaButton')}</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
