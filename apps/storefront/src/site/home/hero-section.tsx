import { getTranslations } from 'next-intl/server';
import { getRouteLocale } from '@/platform/i18n/server';
import { Link } from '@/platform/i18n/navigation';
import { Star, ArrowRight } from 'lucide-react';
import { HeroMotionReveal, HeroInteractiveStage, HeroMagneticCTA } from './hero-motion-reveal';

export async function HeroSection() {
    const locale = await getRouteLocale();
    const t = await getTranslations({ locale, namespace: 'Hero' });

    return (
        <section className="relative w-full bg-[#FAF8F5] overflow-hidden pt-16 sm:pt-18 lg:pt-20 pb-16 lg:pb-24">
            {/* Ambient Background Radial Warmth */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_50%,rgba(212,164,60,0.08)_0%,transparent_60%)] pointer-events-none" />

            <div className="vakaa-container relative z-10 w-full">
                {/* ═══ Desktop Widescreen Layout (lg+) ═══ */}
                <div className="hidden lg:grid grid-cols-12 gap-12 items-center">
                    {/* Left 5 Cols: Brand Typographic Manifesto */}
                    <div className="col-span-5 flex flex-col justify-center">
                        <HeroMotionReveal className="space-y-6">
                            {/* Rectangular Eyebrow Badge (not rounded-full) */}
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#F5EFEB] border border-[#E7DED0]/70 rounded-lg text-[#A66B2D] text-[11px] font-bold uppercase tracking-[0.16em] self-start">
                                Maison de Haute Maroquinerie
                            </div>

                            {/* Massive Editorial Headline */}
                            <h1 className="vakaa-heading-xl text-[#1D120A] leading-[0.95]">
                                <span className="block">{t('titleLine1')}</span>
                                <span className="block text-[#A66B2D]">{t('titleLine2')}</span>
                                <span className="block">{t('titleLine3')}</span>
                            </h1>

                            {/* Poetic Subtitle */}
                            <p className="text-base lg:text-lg text-[#3A2418]/80 max-w-sm leading-relaxed">
                                {t('subtitle')}
                            </p>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap items-center gap-4 pt-2">
                                <HeroMagneticCTA>
                                    <Link
                                        href="/search"
                                        className="group inline-flex items-center justify-center gap-3 bg-[#1D120A] hover:bg-[#3A2418] text-[#FAF8F5] font-semibold tracking-wide text-sm pl-6 pr-3.5 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 active:scale-[0.98] cursor-pointer"
                                    >
                                        <span>{t('shopCollection')}</span>
                                        <span className="size-8 rounded-lg bg-white/10 group-hover:bg-white/20 flex items-center justify-center transition-all duration-300 group-hover:translate-x-0.5">
                                            <ArrowRight className="w-4 h-4" />
                                        </span>
                                    </Link>
                                </HeroMagneticCTA>

                                <HeroMagneticCTA>
                                    <Link
                                        href="/our-story"
                                        className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl border border-[#E7DED0] text-[#1D120A] font-semibold text-sm hover:border-[#1D120A] hover:bg-white transition-all duration-300 cursor-pointer"
                                    >
                                        {t('ourStory')}
                                    </Link>
                                </HeroMagneticCTA>
                            </div>

                            {/* Star Rating Strip */}
                            <div className="flex items-center gap-3 pt-6 mt-4 border-t border-[#E7DED0]/60">
                                <div className="flex gap-0.5 text-[#D4A43C]">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star key={star} className="w-3.5 h-3.5 fill-current" />
                                    ))}
                                </div>
                                <span className="text-xs text-[#3A2418]/70 font-medium">
                                    <span className="font-bold text-[#1D120A]">4.9 / 5</span>
                                    <span className="ml-1.5">• 2 500+ clientes d&apos;exception</span>
                                </span>
                            </div>
                        </HeroMotionReveal>
                    </div>

                    {/* Right 7 Cols: The Levitating Luxury Artifact Stage */}
                    <div className="col-span-7 flex items-center justify-center relative">
                        <HeroInteractiveStage />
                    </div>
                </div>

                {/* ═══ Mobile Fluid Stage Layout (<lg) — Zero Shift, Fully Integrated ═══ */}
                <div className="flex lg:hidden flex-col items-center justify-between gap-6 text-center">
                    {/* Top: Header & Colossal Brand Title */}
                    <HeroMotionReveal className="space-y-3">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F5EFEB] border border-[#E7DED0] rounded-md text-[#A66B2D] text-[10px] font-bold uppercase tracking-[0.16em]">
                            Maison de Haute Maroquinerie
                        </div>
                        <h1 className="font-sans text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1D120A] leading-tight">
                            <span>{t('titleLine1')} </span>
                            <span className="text-[#A66B2D]">{t('titleLine2')} </span>
                            <span>{t('titleLine3')}</span>
                        </h1>
                        <p className="text-xs sm:text-sm text-[#3A2418]/75 max-w-xs mx-auto leading-relaxed">
                            {t('subtitle')}
                        </p>
                    </HeroMotionReveal>

                    {/* Center: The Levitating Luxury Artifact Stage (Visible Above the Fold) */}
                    <div className="w-full py-2">
                        <HeroInteractiveStage />
                    </div>

                    {/* Bottom: High-Tactile CTAs & Social Proof */}
                    <div className="w-full space-y-4 pt-1">
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-sm mx-auto">
                            <Link
                                href="/search"
                                className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 bg-[#1D120A] text-[#FAF8F5] font-semibold text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl shadow-md active:scale-[0.98] cursor-pointer"
                            >
                                <span>{t('shopCollection')}</span>
                                <ArrowRight className="size-3.5" />
                            </Link>

                            <Link
                                href="/our-story"
                                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl border border-[#E7DED0] bg-white/70 text-[#1D120A] font-semibold text-xs uppercase tracking-wider cursor-pointer"
                            >
                                {t('ourStory')}
                            </Link>
                        </div>

                        {/* Social Proof */}
                        <div className="flex items-center justify-center gap-2 text-xs text-[#3A2418]/70">
                            <div className="flex gap-0.5 text-[#D4A43C]">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star key={star} className="w-3 h-3 fill-current" />
                                ))}
                            </div>
                            <span className="text-[11px] font-medium">
                                <strong className="text-[#1D120A]">4.9 / 5</strong> (2 500+ avis)
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
