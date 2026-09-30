import Image from "next/image";
import { Link } from '@/platform/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { getRouteLocale } from '@/platform/i18n/server';
import { MapPin, Users, Award, Clock, ArrowRight } from "lucide-react";
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getRouteLocale();
    const t = await getTranslations({locale, namespace: 'Artisans'});
    return {
        title: `${t('title')} | VAKAA`,
        description: t('subtitle'),
    };
}

export async function ArtisansPage() {
    const locale = await getRouteLocale();
    const t = await getTranslations({locale, namespace: 'Artisans'});

    const stats = [
        { value: t('stat1Value'), label: t('stat1Label'), icon: Users },
        { value: t('stat2Value'), label: t('stat2Label'), icon: MapPin },
        { value: t('stat3Value'), label: t('stat3Label'), icon: Award },
        { value: t('stat4Value'), label: t('stat4Label'), icon: Clock },
    ];

    const cooperatives = [
        {
            title: t('coop1Title'),
            location: t('coop1Location'),
            desc: t('coop1Desc'),
            image: "/images/cat-tote.jpg",
            specialty: "Elephant Grass & Wild Raffia",
        },
        {
            title: t('coop2Title'),
            location: t('coop2Location'),
            desc: t('coop2Desc'),
            image: "/images/cat-shoulder.jpg",
            specialty: "Vegetable-Tanned Saddle Leather",
        },
        {
            title: t('coop3Title'),
            location: t('coop3Location'),
            desc: t('coop3Desc'),
            image: "/images/cat-accessory.jpg",
            specialty: "Lost-Wax Cast Brass Hardware",
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
                        <h1 className="font-sans text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.08] uppercase">
                            {t('title')}
                        </h1>
                        <div className="w-16 h-[2px] bg-[#D4A43C] mx-auto rounded-full" />
                        <p className="text-base sm:text-lg md:text-xl text-[#3A2418]/80 dark:text-[#F8F4EE]/75 font-sans leading-relaxed">
                            {t('subtitle')}
                        </p>
                    </div>
                </div>
            </section>

            {/* Impact Metrics Bar */}
            <section className="py-12 sm:py-16 bg-[#FAF7F2] dark:bg-[#1D120A]/60 border-b border-[#E7DED0]/70 dark:border-[#3A291C]">
                <div className="vakaa-container">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                        {stats.map((stat, idx) => {
                            const Icon = stat.icon;
                            return (
                                <div key={idx} className="text-center space-y-2">
                                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#EFE8DD] dark:bg-[#2A1B10] text-[#D4A43C] mb-1">
                                        <Icon className="w-4 h-4 stroke-[2]" />
                                    </div>
                                    <p className="font-sans text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1D120A] dark:text-[#F8F4EE]">
                                        {stat.value}
                                    </p>
                                    <p className="text-xs sm:text-sm text-[#6B5E55] dark:text-[#B5A496] font-medium tracking-wide">
                                        {stat.label}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Cooperative Spotlights */}
            <section className="py-16 sm:py-24">
                <div className="vakaa-container">
                    <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                        <span className="text-xs font-semibold tracking-widest text-[#D4A43C] uppercase">
                            REGIONAL COOPERATIVES
                        </span>
                        <h2 className="font-sans text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                            Custodians of Sacred Craft
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
                        {cooperatives.map((coop, idx) => (
                            <div
                                key={idx}
                                className="bg-[#FAF7F2] dark:bg-[#1D120A]/70 rounded-sm border border-[#E7DED0]/80 dark:border-[#3A291C] overflow-hidden group hover:shadow-lg transition-all duration-300 flex flex-col"
                            >
                                <div className="relative aspect-[4/3] overflow-hidden bg-[#EFE8DD] dark:bg-[#2A1B10]">
                                    <Image
                                        src={coop.image}
                                        alt={coop.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                    />
                                    <div className="absolute top-3 left-3 bg-[#1D120A]/90 text-[#F8F4EE] text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-xs">
                                        {coop.specialty}
                                    </div>
                                </div>
                                <div className="p-6 sm:p-7 space-y-3 flex-1 flex flex-col justify-between">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-1.5 text-xs text-[#A66B2D] font-semibold">
                                            <MapPin className="w-3.5 h-3.5" />
                                            <span>{coop.location}</span>
                                        </div>
                                        <h3 className="font-sans text-xl font-bold tracking-tight">
                                            {coop.title}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-[#6B5E55] dark:text-[#B5A496] leading-relaxed font-sans">
                                            {coop.desc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bottom CTA Banner */}
                    <div className="mt-16 sm:mt-20 text-center bg-[#1D120A] text-[#F8F4EE] rounded-sm p-10 sm:p-14 space-y-6">
                        <h3 className="font-sans text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight uppercase">
                            {t('ctaTitle')}
                        </h3>
                        <p className="text-sm sm:text-base text-[#F8F4EE]/80 max-w-xl mx-auto font-sans">
                            Every purchase directly supports dignified living wages, artisan cooperative funds, and the preservation of African heritage crafts.
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
