import Image from 'next/image';
import {Link} from '@/platform/i18n/navigation';
import {getTranslations} from 'next-intl/server';
import {getRouteLocale} from '@/platform/i18n/server';
import {Sparkles, ShieldCheck, ArrowRight} from 'lucide-react';

export async function HeritageSavoirFaire() {
    const locale = await getRouteLocale();
    const tHome = await getTranslations({locale, namespace: 'Home'});
    const tStory = await getTranslations({locale, namespace: 'Story'});

    const pillars = [
        {
            title: tStory('pillar1Title'),
            desc: tStory('pillar1Desc'),
        },
        {
            title: tStory('pillar2Title'),
            desc: tStory('pillar2Desc'),
        },
        {
            title: tStory('pillar3Title'),
            desc: tStory('pillar3Desc'),
        },
        {
            title: tStory('pillar4Title'),
            desc: tStory('pillar4Desc'),
        },
    ];

    return (
        <section className="py-20 sm:py-24 md:py-32 bg-[#120B06] text-[#FAF7F2] relative overflow-hidden transition-colors border-y border-[#3A291C]/60">
            {/* Subtle background warm ambient glow */}
            <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-[#D4A43C]/10 blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-[#A66B2D]/15 blur-3xl pointer-events-none" />

            <div className="vakaa-container relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
                    {/* Left: Magazine Double-Spread Photography */}
                    <div className="lg:col-span-6 relative">
                        <div className="relative aspect-[4/5] sm:aspect-[4/4] lg:aspect-[4/5] w-full rounded-md overflow-hidden bg-[#1E140C] border border-[#D4A43C]/20 shadow-2xl">
                            <Image
                                src="/images/artisan-hands.jpg"
                                alt="Maître artisan tissant un sac de luxe en raphia naturel"
                                fill
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                className="object-cover object-center transition-transform duration-1000 hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                            {/* Floating artisan seal */}
                            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xs bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-[#D4A43C] font-bold">
                                        Atelier Bolgatanga & Nairobi
                                    </p>
                                    <p className="text-xs text-white/90 font-serif mt-0.5">
                                        48+ heures de confection patiente par pièce
                                    </p>
                                </div>
                                <span className="size-8 rounded-full bg-[#D4A43C] text-[#140C06] flex items-center justify-center shrink-0">
                                    <Sparkles className="size-4" />
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Savoir-Faire & Manifesto */}
                    <div className="lg:col-span-6 space-y-6 lg:space-y-8">
                        <div className="space-y-3">
                            <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-[#D4A43C]">
                                <ShieldCheck className="size-3.5" />
                                <span>{tStory('badge')}</span>
                            </div>
                            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight text-[#FAF7F2] leading-[1.1] uppercase">
                                {tStory('title')}
                            </h2>
                            <p className="text-sm sm:text-base text-[#FAF7F2]/80 leading-relaxed font-sans pt-2">
                                {tStory('originP1')}
                            </p>
                        </div>

                        {/* 4 Pillars Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-2">
                            {pillars.map((pillar, idx) => (
                                <div
                                    key={idx}
                                    className="p-4 rounded-xs bg-[#1A110A]/80 border border-[#3A291C] hover:border-[#D4A43C]/40 transition-colors space-y-1.5"
                                >
                                    <h4 className="font-serif text-sm font-bold text-[#D4A43C] uppercase tracking-wide">
                                        {pillar.title}
                                    </h4>
                                    <p className="text-xs text-[#FAF7F2]/70 leading-relaxed">
                                        {pillar.desc}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* CTA Buttons */}
                        <div className="pt-4 flex flex-wrap items-center gap-4">
                            <Link
                                href="/our-story"
                                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xs text-xs font-semibold uppercase tracking-wider bg-[#D4A43C] hover:bg-[#C29332] text-[#140C06] transition-all shadow-md"
                            >
                                <span>{tStory('ctaButton')}</span>
                                <ArrowRight className="size-3.5" />
                            </Link>

                            <Link
                                href="/artisans"
                                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xs text-xs font-semibold uppercase tracking-wider text-[#FAF7F2] hover:text-[#D4A43C] border border-[#FAF7F2]/20 hover:border-[#D4A43C]/50 transition-all"
                            >
                                <span>Les Maîtres Artisans</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
