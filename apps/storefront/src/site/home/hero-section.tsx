import Image from "next/image";
import { Link } from '@/platform/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { getRouteLocale } from '@/platform/i18n/server';
import { ArrowRight, Star } from "lucide-react";

function AfricanGeometricWatermark({ className = "" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 400 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-hidden="true"
        >
            <g stroke="#D4A43C" strokeWidth="1" strokeOpacity="0.18">
                <circle cx="200" cy="200" r="180" />
                <circle cx="200" cy="200" r="140" strokeDasharray="4 6" />
                <circle cx="200" cy="200" r="100" />
                <circle cx="200" cy="200" r="60" strokeDasharray="3 5" />
                <path d="M200 20 L200 380" strokeDasharray="6 8" />
                <path d="M20 200 L380 200" strokeDasharray="6 8" />
                <rect x="73" y="73" width="254" height="254" transform="rotate(45 200 200)" strokeWidth="0.75" />
                <circle cx="200" cy="20" r="4" fill="#D4A43C" />
                <circle cx="200" cy="380" r="4" fill="#D4A43C" />
                <circle cx="20" cy="200" r="4" fill="#D4A43C" />
                <circle cx="380" cy="200" r="4" fill="#D4A43C" />
            </g>
        </svg>
    );
}

export async function HeroSection() {
    const locale = await getRouteLocale();
    const t = await getTranslations({ locale, namespace: 'Hero' });

    return (
        <section className="relative overflow-hidden bg-[#FAF8F5] transition-colors pt-24 sm:pt-28 lg:pt-32 pb-8 sm:pb-12 lg:pb-16 border-b border-[#E7DED0]/60">
            {/* ═══ Background Layers ═══ */}
            <div className="absolute inset-0 pointer-events-none select-none z-0">
                {/* Subtle African geometric watermark in upper-left corner */}
                <div className="absolute -top-10 -left-10 w-72 sm:w-96 lg:w-[480px] h-72 sm:h-96 lg:h-[480px] opacity-60">
                    <AfricanGeometricWatermark className="w-full h-full" />
                </div>

                {/* 3D Studio Arch/Portal — centered directly behind the model on the right */}
                <div
                    style={{
                        maskImage: 'radial-gradient(ellipse 55% 55% at 50% 50%, black 18%, transparent 60%)',
                        WebkitMaskImage: 'radial-gradient(ellipse 55% 55% at 50% 50%, black 18%, transparent 60%)',
                    }}
                    className="absolute right-[-6%] sm:right-[-2%] lg:right-[4%] top-[2%] sm:top-[0%] lg:top-[-2%] w-[70%] sm:w-[62%] lg:w-[54%] aspect-square"
                >
                    <Image
                        src="/images/hero.png"
                        alt=""
                        fill
                        priority
                        unoptimized
                        className="object-contain mix-blend-multiply opacity-55"
                    />
                </div>

                {/* Warm sun-dappled ambient glow directly behind model */}
                <div className="absolute right-[6%] sm:right-[10%] lg:right-[16%] top-[40%] -translate-y-1/2 w-[34%] sm:w-[30%] lg:w-[26%] aspect-square rounded-full bg-[#E5DFD5]/40 blur-3xl" />

                {/* Soft gradient text-readability scrim */}
                <div className="absolute inset-y-0 left-0 w-[72%] sm:w-[58%] lg:w-[48%] bg-gradient-to-r from-[#FAF8F5] via-[#FAF8F5]/95 to-transparent z-[1]" />
            </div>

            {/* ═══ Model Image — Positioned on right, fully visible, no clipping ═══ */}
            <div
                className="absolute inset-y-0 right-0 w-[46%] sm:w-[50%] lg:w-[56%] z-[5] pointer-events-none flex items-end justify-end"
                style={{
                    maskImage: 'linear-gradient(to bottom, black 88%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 88%, transparent 100%)',
                }}
            >
                <div className="relative w-full h-full max-h-[96%] sm:max-h-[98%] lg:max-h-[100%] flex items-end justify-end pr-0.5 sm:pr-4 lg:pr-8 xl:pr-14">
                    <div className="relative h-full aspect-[2025/2078] max-w-full">
                        <Image
                            src="/images/character.png"
                            alt="VAKAA Luxury Handcrafted African Bag"
                            fill
                            priority
                            unoptimized
                            sizes="(max-width: 640px) 46vw, (max-width: 1024px) 50vw, 56vw"
                            className="object-contain object-bottom-right drop-shadow-[0_12px_28px_rgba(29,18,10,0.10)]"
                        />
                    </div>
                </div>
            </div>

            {/* ═══ Left Column: Typography, CTAs & Rating ═══ */}
            <div className="vakaa-container relative z-10 min-h-[420px] sm:min-h-[480px] lg:min-h-[560px] xl:min-h-[600px] flex items-center">
                <div className="w-[62%] sm:w-[54%] lg:w-[46%] xl:w-[44%] pt-2 sm:pt-6 lg:pt-8 pb-6 sm:pb-8 lg:pb-10">
                    
                    {/* Micro-Eyebrow Badge */}
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#F2ECE4] border border-[#E7DED0]/70 text-[10px] sm:text-[11px] font-semibold text-[#8C5824] mb-3 sm:mb-4">
                        <span>Maison de Haute Maroquinerie Africaine</span>
                    </div>

                    {/* Headline in Modern Sans Title Case */}
                    <h1 className="font-sans text-[1.85rem] xs:text-[2.15rem] sm:text-[2.85rem] md:text-[3.5rem] lg:text-[4.2rem] font-bold tracking-tight text-[#1D120A] leading-[1.03]">
                        <span className="block">{t('titleLine1')}</span>
                        <span className="block text-[#1D120A]">{t('titleLine2')}</span>
                        <span className="block text-[#A66B2D]">{t('titleLine3')}</span>
                    </h1>

                    {/* Gold accent line */}
                    <div className="mt-3 sm:mt-4 mb-2.5 sm:mb-3.5 w-10 sm:w-12 h-[2.5px] bg-[#D4A43C] rounded-full" />

                    {/* Subtitle with comfortable line spacing */}
                    <div className="space-y-0.5 sm:space-y-1 text-xs sm:text-sm md:text-base text-[#3A2418]/80 font-sans leading-relaxed max-w-md">
                        <p>{t('subtitle')}</p>
                    </div>

                    {/* Action buttons (New button-in-button layout) */}
                    <div className="pt-3.5 sm:pt-5 flex flex-wrap items-center gap-2.5 sm:gap-4">
                        <Link
                            href="/search"
                            className="group inline-flex items-center justify-center gap-2.5 bg-[#1D120A] hover:bg-[#3A2418] text-[#FAF8F5] font-semibold tracking-wide text-xs sm:text-[13px] pl-5 sm:pl-6 pr-2 sm:pr-2.5 py-2.5 sm:py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer whitespace-nowrap"
                        >
                            <span>{t('shopCollection')}</span>
                            <span className="size-6 sm:size-7 rounded-full bg-white/15 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                                <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                        </Link>

                        <Link
                            href="/our-story"
                            className="inline-flex items-center justify-center border border-[#1D120A]/20 hover:border-[#D4A43C] text-[#1D120A] hover:text-[#D4A43C] font-semibold tracking-wide text-xs sm:text-[13px] px-4 sm:px-6 py-2.5 sm:py-3 rounded-full transition-all duration-200 hover:-translate-y-0.5 cursor-pointer whitespace-nowrap bg-white/70 backdrop-blur-xs"
                        >
                            {t('ourStory')}
                        </Link>
                    </div>

                    {/* Ratings in the hero: social proof row */}
                    <div className="pt-3.5 sm:pt-4 border-t border-[#E7DED0]/50 flex items-center gap-2.5 sm:gap-3 mt-4 sm:mt-5">
                        <div className="flex items-center gap-0.5 text-[#D4A43C]">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-3.5 h-3.5 fill-[#D4A43C] text-[#D4A43C]" />
                            ))}
                        </div>
                        <div className="text-[11px] sm:text-xs text-[#1D120A] font-medium truncate">
                            <span className="font-bold">4.9 / 5</span>
                            <span className="text-[#3A2418]/60 ml-1.5">• 2 500+ clientes comblées</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
