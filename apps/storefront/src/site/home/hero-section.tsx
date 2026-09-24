import Image from "next/image";
import { Link } from '@/platform/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { getRouteLocale } from '@/platform/i18n/server';
import { Play, Sparkles } from "lucide-react";

function AfricanGeometricWatermark({ className = "" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 400 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`pointer-events-none select-none ${className}`}
        >
            <g stroke="#D4A43C" strokeWidth="1.2" opacity="0.22" strokeLinecap="round">
                {/* Stepped chevron & diamond motifs */}
                <path d="M0 40L40 0M0 80L80 0M0 120L120 0M0 160L160 0M0 200L200 0M0 240L240 0M0 280L280 0M0 320L320 0M0 360L360 0M0 400L400 0" />
                <path d="M40 400L400 40M80 400L400 80M120 400L400 120M160 400L400 160M200 400L400 200M240 400L400 240M280 400L400 280M320 400L400 320M360 400L400 360" />
                {/* Cultural Diamond Insets */}
                <rect x="30" y="30" width="30" height="30" transform="rotate(45 45 45)" stroke="#A66B2D" strokeWidth="1.5" />
                <rect x="90" y="90" width="30" height="30" transform="rotate(45 105 105)" stroke="#A66B2D" strokeWidth="1.5" />
                <rect x="150" y="150" width="30" height="30" transform="rotate(45 165 165)" stroke="#A66B2D" strokeWidth="1.5" />
                <circle cx="45" cy="45" r="3" fill="#D4A43C" />
                <circle cx="105" cy="105" r="3" fill="#D4A43C" />
                <circle cx="165" cy="165" r="3" fill="#D4A43C" />
            </g>
        </svg>
    );
}

export async function HeroSection() {
    const locale = await getRouteLocale();
    const t = await getTranslations({ locale, namespace: 'Hero' });

    return (
        <section className="relative overflow-hidden bg-[#F8F4EE] dark:bg-[#140C06] transition-colors pt-24 sm:pt-28 lg:pt-32 pb-4 sm:pb-8 lg:pb-10">
            {/* ═══ Background Layers ═══ */}
            <div className="absolute inset-0 pointer-events-none select-none z-0">
                {/* Subtle African geometric watermark in upper-left corner */}
                <div className="absolute -top-10 -left-10 w-72 sm:w-96 lg:w-[480px] h-72 sm:h-96 lg:h-[480px] opacity-70">
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
                        className="object-contain mix-blend-multiply dark:mix-blend-screen opacity-55 dark:opacity-30"
                    />
                </div>

                {/* Warm sun-dappled ambient glow directly behind model */}
                <div className="absolute right-[6%] sm:right-[10%] lg:right-[16%] top-[40%] -translate-y-1/2 w-[34%] sm:w-[30%] lg:w-[26%] aspect-square rounded-full bg-[#E5DFD5]/40 dark:bg-[#20150D]/30 blur-3xl" />

                {/* Soft gradient text-readability scrim */}
                <div className="absolute inset-y-0 left-0 w-[58%] sm:w-[54%] lg:w-[46%] bg-gradient-to-r from-[#F8F4EE] via-[#F8F4EE]/90 to-transparent dark:from-[#140C06] dark:via-[#140C06]/90 z-[1]" />
            </div>

            {/* ═══ Model Image — Positioned on right, fully visible, no clipping ═══ */}
            <div
                className="absolute inset-y-0 right-0 w-[52%] sm:w-[50%] lg:w-[56%] z-[5] pointer-events-none flex items-end justify-end"
                style={{
                    maskImage: 'linear-gradient(to bottom, black 88%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 88%, transparent 100%)',
                }}
            >
                <div className="relative w-full h-full max-h-[96%] sm:max-h-[98%] lg:max-h-[100%] flex items-end justify-end pr-1 sm:pr-4 lg:pr-8 xl:pr-14">
                    <div className="relative h-full aspect-[2025/2078] max-w-full">
                        <Image
                            src="/images/character.png"
                            alt="VAKAA Luxury Handcrafted African Bag"
                            fill
                            priority
                            unoptimized
                            sizes="(max-width: 640px) 52vw, (max-width: 1024px) 50vw, 56vw"
                            className="object-contain object-bottom-right drop-shadow-[0_12px_28px_rgba(29,18,10,0.10)]"
                        />
                    </div>
                </div>
            </div>

            {/* ═══ Left Column: Typography & CTAs ═══ */}
            <div className="vakaa-container relative z-10 min-h-[440px] sm:min-h-[480px] lg:min-h-[580px] xl:min-h-[640px]">
                <div className="w-[56%] sm:w-[54%] lg:w-[42%] xl:w-[40%] pt-2 sm:pt-6 lg:pt-10 pb-6 sm:pb-8 lg:pb-12">
                    {/* Complete 3-line headline */}
                    <h1 className="font-serif text-[2.1rem] sm:text-[2.75rem] md:text-[3.35rem] lg:text-[4.25rem] xl:text-[4.85rem] font-bold tracking-tight text-[#1D120A] dark:text-[#F8F4EE] leading-[0.96] uppercase">
                        <span className="block">{t('titleLine1')}</span>
                        <span className="block">{t('titleLine2')}</span>
                        <span className="block">{t('titleLine3')}</span>
                    </h1>

                    {/* Gold accent line */}
                    <div className="mt-3.5 sm:mt-5 lg:mt-6 mb-3 sm:mb-4 lg:mb-5 w-10 sm:w-12 lg:w-14 h-[2.5px] bg-[#D4A43C] rounded-full" />

                    {/* Subtitle with comfortable line spacing */}
                    <div className="space-y-0.5 sm:space-y-1 text-[11px] sm:text-sm md:text-base lg:text-lg text-[#3A2418]/85 dark:text-[#F8F4EE]/80 font-sans leading-snug sm:leading-relaxed">
                        <p>Luxury bags. African soul.</p>
                        <p>Made by hand, made to last.</p>
                    </div>

                    {/* Action buttons: stacked on mobile, side-by-side on sm+ */}
                    <div className="pt-4 sm:pt-6 lg:pt-8 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 lg:gap-5">
                        <Link
                            href="/search"
                            className="inline-flex items-center justify-center bg-[#1D120A] hover:bg-[#3A2418] text-[#F8F4EE] dark:bg-[#D4A43C] dark:hover:bg-[#BF9232] dark:text-[#140C06] font-semibold tracking-wider text-[10px] sm:text-xs uppercase px-5 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-3.5 rounded-xs shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer whitespace-nowrap"
                        >
                            {t('shopCollection')}
                        </Link>

                        <Link
                            href="/our-story"
                            className="group inline-flex items-center gap-2 sm:gap-2.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[#1D120A] dark:text-[#F8F4EE] hover:text-[#D4A43C] transition-colors cursor-pointer py-1"
                        >
                            <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-[#1D120A]/60 dark:border-[#F8F4EE]/60 flex items-center justify-center transition-all group-hover:border-[#D4A43C] bg-white/60 dark:bg-black/30 backdrop-blur-xs">
                                <Play className="w-2 h-2 sm:w-3 sm:h-3 fill-[#1D120A] dark:fill-[#F8F4EE] text-[#1D120A] dark:text-[#F8F4EE] ml-0.5 group-hover:fill-[#D4A43C] group-hover:text-[#D4A43C]" />
                            </span>
                            <span>{t('ourStory')}</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* ═══ "Handmade in Africa" Pill Badge — Desktop Only ═══ */}
            <div className="hidden lg:flex absolute bottom-8 xl:bottom-12 right-[4%] xl:right-[6%] z-20 items-center gap-2.5 bg-[#1D120A] text-[#F8F4EE] px-3.5 py-2.5 rounded-lg border border-[#D4A43C]/25 shadow-lg">
                <div className="w-7 h-7 rounded-full bg-[#D4A43C] flex items-center justify-center text-[#1D120A]">
                    <Sparkles className="w-3.5 h-3.5 fill-[#1D120A]" />
                </div>
                <div className="text-left">
                    <p className="font-serif text-[10px] xl:text-[11px] font-bold uppercase tracking-wider text-[#D4A43C] leading-none">
                        Handmade
                    </p>
                    <p className="text-[9px] xl:text-[10px] font-medium tracking-wider text-[#F8F4EE]/90 uppercase leading-none mt-0.5">
                        In Africa
                    </p>
                </div>
            </div>
        </section>
    );
}
