'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Link } from '@/platform/i18n/navigation';
import { ArrowRight, ArrowUpRight, Sparkles, Truck } from 'lucide-react';

interface HeroBentoGridProps {
    t: {
        titleLine1: string;
        titleLine2: string;
        titleLine3: string;
        subtitle: string;
        shopCollection: string;
        ourStory: string;
    };
}

export function HeroBentoGrid({ t }: HeroBentoGridProps) {
    const heroTileMotion = (index: number) => ({
        initial: { opacity: 0, y: 36 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.95, delay: 0.12 + index * 0.08, ease: [0.16, 1, 0.3, 1] as const },
    });

    return (
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-12 lg:grid-rows-6 lg:h-[calc(100svh-6.75rem)] lg:min-h-[640px] lg:max-h-[730px]">
            {/* ═══ TILE 1: Top Left Brand Manifesto (lg:col-span-7 lg:row-span-4) ═══ */}
            <motion.div
                {...heroTileMotion(0)}
                className="col-span-1 sm:col-span-2 lg:col-span-7 lg:row-span-4 p-5 sm:p-7 lg:p-8 flex flex-col justify-between rounded-3xl bg-[#fbfaf7] dark:bg-[#1c1b19] border border-[#e2ddd2]/80 dark:border-[#2e2c28] relative overflow-hidden shadow-tile"
            >
                {/* Top: Status pill */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-[#272522] border border-[#e2ddd2] dark:border-[#3a3731] shadow-xs text-[11px] sm:text-xs font-medium text-[#1D120A] dark:text-[#fbfaf7] self-start">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4A43C] opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4A43C]" />
                    </span>
                    <span className="tracking-wide">Nouvelle collection · Pièces d&apos;exception</span>
                </div>

                {/* Middle: Giant Headline & Refined Editorial Subtext */}
                <div className="my-auto py-2 sm:py-3 space-y-2.5">
                    <h1 className="font-display text-4xl sm:text-5xl lg:text-[54px] font-bold tracking-tight text-[#1D120A] dark:text-[#fbfaf7] leading-[1.06]">
                        <span>{t.titleLine1} </span>
                        <span className="text-[#D4A43C]">{t.titleLine2} </span>
                        <span>{t.titleLine3}</span>
                    </h1>
                    <p className="text-sm sm:text-[14.5px] lg:text-[15px] text-[#57544c] dark:text-[#a6a29a] max-w-lg font-normal leading-relaxed">
                        {t.subtitle}
                    </p>
                </div>

                {/* Bottom: Action Buttons + Avatar Stack */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3.5 border-t border-[#e2ddd2]/70 dark:border-[#2e2c28]">
                    <div className="flex flex-wrap items-center gap-2.5">
                        <Link
                            href="/search"
                            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#1D120A] text-white hover:bg-[#3A2418] font-semibold text-xs uppercase tracking-wider transition-all duration-200 shadow-sm active:scale-[0.98] cursor-pointer"
                        >
                            <span>{t.shopCollection}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                            href="/our-story"
                            className="inline-flex items-center justify-center px-5 py-3 rounded-full bg-white dark:bg-[#272522] border border-[#e2ddd2] dark:border-[#3a3731] text-[#1D120A] dark:text-[#fbfaf7] hover:border-[#1D120A] font-semibold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer"
                        >
                            {t.ourStory}
                        </Link>
                    </div>

                    {/* Social proof: removed — no real review aggregate exists yet */}
                </div>
            </motion.div>

            {/* ═══ TILE 2: Evergreen Atelier Showcase (lg:col-span-5 lg:row-span-6) ═══ */}
            <motion.div
                {...heroTileMotion(1)}
                className="col-span-1 sm:col-span-2 lg:col-span-5 lg:row-span-6 rounded-3xl bg-[#ede4d6] dark:bg-[#1f1c19] border border-[#ded5c7]/80 dark:border-[#2f2b25] relative overflow-hidden flex flex-col justify-between p-6 sm:p-8 group shadow-tile min-h-[440px] sm:min-h-[520px] lg:min-h-0"
            >
                {/* Full-card link to explore collection */}
                <Link
                    href="/search"
                    className="absolute inset-0 z-0 focus:outline-hidden"
                    aria-label="Explorer toute la collection Vakaa"
                />

                {/* Subtle Ambient Warm Glow */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(212,164,60,0.14)_0%,transparent_68%)]" />

                {/* Top: Header with Kicker + Rotating Badge */}
                <div className="flex items-start justify-between gap-4 z-10 pointer-events-none">
                    <div>
                        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8C6D23] dark:text-[#D4A43C] font-semibold">
                            COLLECTION SIGNATURE
                        </span>
                        <h2 className="font-display text-xl sm:text-2xl font-semibold text-[#1D120A] dark:text-[#fbfaf7] mt-0.5 tracking-tight">
                            L&apos;Art du Raphia & Cuir
                        </h2>
                    </div>

                    {/* Circular Spinning Artisan Seal */}
                    <div className="relative size-18 sm:size-22 shrink-0 flex items-center justify-center">
                        <svg className="size-full animate-spin [animation-duration:22s]" viewBox="0 0 100 100">
                            <defs>
                                <path id="hero-badge-path" d="M 50, 50 m -36, 0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0" />
                            </defs>
                            <text className="text-[9.2px] uppercase tracking-[0.19em] fill-[#1D120A] dark:fill-[#fbfaf7] font-semibold">
                                <textPath href="#hero-badge-path">
                                    Cuir pleine fleur · Paille de Bolgatanga · Fait main ·
                                </textPath>
                            </text>
                        </svg>
                        <div className="absolute size-7 sm:size-8 rounded-full bg-[#D4A43C] flex items-center justify-center text-[#1D120A] shadow-xs">
                            <Sparkles className="size-3.5 sm:size-4 fill-current" />
                        </div>
                    </div>
                </div>

                {/* Center: Seamless Floating Pure Bag Cutout with Organic Ground Shadow */}
                <div className="relative my-auto flex items-center justify-center pt-2 pb-16 sm:pb-20 w-full pointer-events-none">
                    {/* Ground Contact Shadow */}
                    <motion.span
                        aria-hidden={true}
                        className="pointer-events-none absolute bottom-10 sm:bottom-12 left-1/2 h-7 w-[60%] max-w-[270px] -translate-x-1/2 rounded-[50%] bg-[#1c1b18]/22 dark:bg-black/55 blur-md transition-all duration-500 ease-out group-hover:scale-x-85 group-hover:opacity-40"
                    />

                    {/* Floating Pure Cutout */}
                    <div className="relative w-[230px] sm:w-[280px] lg:w-[320px] aspect-square flex items-center justify-center transition-transform duration-500 ease-out group-hover:scale-[1.04] group-hover:-translate-y-2">
                        <Image
                            src="/images/bags/baguette-indigo-savane-transparent.png"
                            alt="Maroquinerie d'exception Vakaa"
                            fill
                            priority
                            unoptimized
                            className="object-contain drop-shadow-[0_16px_28px_rgba(29,18,10,0.18)]"
                            sizes="(max-width: 768px) 80vw, 40vw"
                        />
                    </div>
                </div>

                {/* Bottom: Floating Frosted Glass Capsule (Evergreen Collection Discovery) */}
                <div className="absolute inset-x-4 bottom-4 sm:inset-x-6 sm:bottom-6 z-10 flex items-center justify-between gap-3 rounded-full bg-white/85 dark:bg-[#1c1b19]/90 p-2 pl-4 sm:pl-5 backdrop-blur-md border border-white/70 dark:border-white/10 shadow-glass">
                    <span className="text-xs sm:text-[13px] font-medium text-[#57544c] dark:text-[#a6a29a] flex items-center gap-1.5 truncate">
                        <Sparkles className="size-3.5 text-[#D4A43C] shrink-0" />
                        <span className="truncate">Éditions limitées & durables</span>
                    </span>

                    <span className="inline-flex h-9 sm:h-10 items-center gap-1.5 rounded-full font-medium bg-[#1D120A] text-white group-hover:bg-[#3A2418] px-4 sm:px-5 text-xs sm:text-[13px] shrink-0 whitespace-nowrap transition-all duration-200 shadow-xs pointer-events-none">
                        <span>Explorer</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </span>
                </div>
            </motion.div>

            {/* ═══ TILE 3: Bottom Left Category Highlight (lg:col-span-4 lg:row-span-2) ═══ */}
            <motion.div {...heroTileMotion(2)} className="col-span-1 sm:col-span-1 lg:col-span-4 lg:row-span-2">
                <Link
                    href="/collection/tote-bags"
                    className="h-full w-full min-h-[190px] sm:min-h-[210px] lg:min-h-0 rounded-3xl bg-[#ece4d6] dark:bg-[#24211d] border border-[#e2ddd2]/80 dark:border-[#2e2c28] p-5 sm:p-6 overflow-hidden relative flex flex-col justify-between shadow-tile group cursor-pointer block"
                >
                    <div className="z-10">
                        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#57544c] dark:text-[#a6a29a]">
                            COLLECTION
                        </span>
                        <h3 className="font-display text-xl sm:text-2xl font-semibold leading-snug tracking-tight text-[#1D120A] dark:text-[#fbfaf7] mt-1">
                            Sacs Cabas & Totes
                        </h3>
                    </div>

                    <div className="z-10 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#1D120A] dark:text-[#fbfaf7] group-hover:text-[#D4A43C] transition-colors mt-auto pt-3">
                        <span>Explorer</span>
                        <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>

                    {/* Showcase Bag Visual (Transparent Cutout) */}
                    <div className="absolute -right-2 -bottom-2 w-40 h-40 sm:w-52 sm:h-52 transition-transform duration-500 ease-out group-hover:scale-105 pointer-events-none">
                        <Image
                            src="/images/bags/maa-tote-transparent.png"
                            alt="Grand Cabas Maa"
                            fill
                            className="object-contain object-bottom-right drop-shadow-[0_16px_28px_rgba(29,18,10,0.22)]"
                            sizes="(max-width: 768px) 45vw, 25vw"
                        />
                    </div>
                </Link>
            </motion.div>

            {/* ═══ TILE 4: Bottom Middle Delivery & Service (lg:col-span-3 lg:row-span-2) ═══ */}
            <motion.div
                {...heroTileMotion(3)}
                className="col-span-1 sm:col-span-1 lg:col-span-3 lg:row-span-2 min-h-[190px] sm:min-h-[210px] lg:min-h-0 rounded-3xl bg-[#fbfaf7] dark:bg-[#1c1b19] border border-[#e2ddd2]/80 dark:border-[#2e2c28] p-5 sm:p-6 overflow-hidden relative flex flex-col justify-between shadow-tile"
            >
                <div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#57544c] dark:text-[#a6a29a]">
                        LIVRAISON
                    </span>
                    <h3 className="font-display text-xl sm:text-2xl font-semibold leading-tight tracking-tight text-[#1D120A] dark:text-[#fbfaf7] mt-1">
                        Offerte dès 100 000 FCFA
                    </h3>
                    <p className="text-xs sm:text-[13px] text-[#57544c] dark:text-[#a6a29a] mt-1 leading-snug max-w-[270px]">
                        Expédition sous 48h. Retours offerts sous 30 jours.
                    </p>
                </div>

                {/* Bottom animation: moving road track & delivery truck running through the whole line */}
                <div className="relative h-9 w-full overflow-hidden mt-3 sm:mt-auto" aria-hidden="true">
                    {/* Continuous moving dashed road line */}
                    <motion.div
                        className="absolute inset-x-0 top-1/2 h-px w-[200%] border-t-2 border-dashed border-[#d5cfc4] dark:border-[#3a3731]"
                        animate={{ x: ['0%', '-50%'] }}
                        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                    />

                    {/* Delivery truck traversing 100% of the tile */}
                    <motion.div
                        className="absolute inset-0 pointer-events-none"
                        animate={{ x: ['-12%', '104%'] }}
                        transition={{
                            duration: 4.2,
                            repeat: Infinity,
                            ease: [0.45, 0, 0.55, 1] as const,
                            repeatDelay: 0.6,
                        }}
                    >
                        <div className="flex size-9 items-center justify-center rounded-full bg-[#D4A43C] text-[#1D120A] shadow-sm overflow-hidden aspect-square">
                            <Truck className="w-[18px] h-[18px] shrink-0" strokeWidth={2} />
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
