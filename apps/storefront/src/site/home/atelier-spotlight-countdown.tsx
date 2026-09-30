'use client';

import {useState, useEffect} from 'react';
import Image from 'next/image';
import {Link} from '@/platform/i18n/navigation';
import {ShieldCheck, Clock, ArrowRight} from 'lucide-react';

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

export function AtelierSpotlightCountdown() {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({
        days: 4,
        hours: 14,
        minutes: 48,
        seconds: 18,
    });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev.seconds > 0) {
                    return {...prev, seconds: prev.seconds - 1};
                } else if (prev.minutes > 0) {
                    return {...prev, minutes: 59, seconds: 59};
                } else if (prev.hours > 0) {
                    return {...prev, hours: prev.hours - 1, minutes: 59, seconds: 59};
                } else if (prev.days > 0) {
                    return {...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59};
                }
                return prev;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const pad = (n: number) => n.toString().padStart(2, '0');

    return (
        <section className="py-14 sm:py-20 bg-[#FAF8F5] dark:bg-[#140C06] text-[#1D120A] dark:text-[#F8F4EE] relative overflow-hidden transition-colors border-y border-[#E7DED0] dark:border-[#2C1D13]">
            <div className="vakaa-container relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
                    {/* Left: Dual Photography Showcase with Clean Badge */}
                    <div className="lg:col-span-6 relative">
                        <div className="relative aspect-[4/3] sm:aspect-[16/11] rounded-2xl overflow-hidden bg-[#EFE8DD] dark:bg-[#24170E] border border-[#E7DED0] dark:border-[#3A291C] shadow-md group">
                            <Image
                                src="/images/bags/baguette-indigo-savane-1.jpg"
                                alt="Sac Baguette Indigo Savane — Édition Numérotée VAKAA"
                                fill
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />

                            {/* Clean Top Badge (No magic stars) */}
                            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 px-3.5 py-1.5 rounded-full bg-white/95 dark:bg-[#180F08]/90 backdrop-blur-md border border-black/10 dark:border-[#D4A43C]/40 text-[#1D120A] dark:text-[#D4A43C] text-[10px] sm:text-[11px] font-bold tracking-widest uppercase shadow-xs">
                                <span>Édition Confidentielle</span>
                            </div>

                            {/* Floating Bottom Card */}
                            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 p-4 sm:p-5 rounded-xl bg-white/95 dark:bg-[#140C06]/90 backdrop-blur-md border border-[#E7DED0]/80 dark:border-white/10 flex items-center justify-between shadow-lg">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A66B2D] dark:text-[#D4A43C]">
                                        Série Atelier 01 — Bolgatanga
                                    </p>
                                    <h4 className="text-sm sm:text-base font-sans font-bold text-[#1D120A] dark:text-[#F8F4EE] mt-0.5">
                                        Baguette Indigo Savane
                                    </h4>
                                    <p className="text-xs text-[#3A2418]/70 dark:text-[#E7DED0]/70 mt-0.5">
                                        Raphia sauvage teint à la cuve indigo & cuir végétal
                                    </p>
                                </div>
                                <div className="text-right pl-3 shrink-0">
                                    <span className="text-[10px] uppercase font-bold text-[#A66B2D] dark:text-[#D4A43C] tracking-wider block">
                                        Tirage
                                    </span>
                                    <span className="text-sm sm:text-base font-sans font-bold text-[#1D120A] dark:text-[#F8F4EE]">
                                        14 / 50 ex.
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Floating Micro-Badge */}
                        <div className="hidden sm:flex absolute -bottom-5 -right-5 items-center gap-3 p-3.5 rounded-xl bg-white dark:bg-[#20140D] border border-[#E7DED0] dark:border-[#D4A43C]/40 shadow-lg">
                            <span className="w-10 h-10 rounded-lg bg-[#FAF8F5] dark:bg-[#D4A43C]/20 border border-[#E7DED0] dark:border-[#D4A43C]/40 flex items-center justify-center text-[#A66B2D] dark:text-[#D4A43C]">
                                <ShieldCheck className="w-5 h-5" />
                            </span>
                            <div>
                                <p className="text-[10px] uppercase font-bold tracking-wider text-[#A66B2D] dark:text-[#D4A43C]">
                                    Certificat d&apos;Authenticité
                                </p>
                                <p className="text-xs text-[#1D120A] dark:text-[#F8F4EE]/80 font-medium">
                                    Gravure numérotée sur laiton
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Editorial Story, Countdown & Reservation */}
                    <div className="lg:col-span-6 space-y-6 sm:space-y-7">
                        <div className="space-y-3">
                            {/* Minimal Text Eyebrow */}
                            <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#A66B2D] dark:text-[#D4A43C]">
                                Pièce d&apos;Exception Numérotée
                            </p>

                            <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1D120A] dark:text-[#F8F4EE] leading-[1.12] uppercase">
                                L&apos;Excellence de la Série Limitée
                            </h2>

                            <p className="text-sm sm:text-base text-[#3A2418]/80 dark:text-[#E7DED0]/80 leading-relaxed font-sans max-w-xl">
                                Façonnée à la main en série confidentielle de 50 exemplaires uniques. 
                                Chaque pièce réclame 48 heures de tissage méticuleux par nos maîtres artisans 
                                et porte sa numérotation frappée à chaud sur plaque de laiton massif.
                            </p>
                        </div>

                        {/* Clean Whitish Countdown Timer Container */}
                        <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#1C120A] border border-[#E7DED0] dark:border-[#332216] shadow-sm space-y-4">
                            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#A66B2D] dark:text-[#D4A43C]">
                                <span className="flex items-center gap-1.5">
                                    <Clock className="w-4 h-4 text-[#A66B2D] dark:text-[#D4A43C]" />
                                    Temps restant avant clôture d&apos;atelier
                                </span>
                                <span className="text-[#3A2418]/60 dark:text-[#F8F4EE]/60 text-[11px] font-normal">
                                    72% des pièces allouées
                                </span>
                            </div>

                            {/* 4 Time Digit Boxes */}
                            <div className="grid grid-cols-4 gap-3 sm:gap-4 text-center">
                                {[
                                    {label: 'Jours', value: mounted ? pad(timeLeft.days) : '04'},
                                    {label: 'Heures', value: mounted ? pad(timeLeft.hours) : '14'},
                                    {label: 'Minutes', value: mounted ? pad(timeLeft.minutes) : '48'},
                                    {label: 'Secondes', value: mounted ? pad(timeLeft.seconds) : '18'},
                                ].map((slot, i) => (
                                    <div
                                        key={i}
                                        className="p-3 sm:p-4 rounded-xl bg-[#FAF8F5] dark:bg-[#140C06] border border-[#E7DED0]/80 dark:border-[#2C1D13] flex flex-col items-center justify-center transition-all hover:border-[#A66B2D]/40"
                                    >
                                        <span className="font-sans text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1D120A] dark:text-[#F8F4EE] tracking-tight tabular-nums">
                                            {slot.value}
                                        </span>
                                        <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-[#A66B2D] dark:text-[#D4A43C] font-semibold mt-1">
                                            {slot.label}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Allocation Progress Bar */}
                            <div className="space-y-1.5 pt-1">
                                <div className="h-1.5 w-full bg-[#EAE3D6] dark:bg-[#24170E] rounded-full overflow-hidden border border-black/5 dark:border-white/5">
                                    <div
                                        className="h-full bg-gradient-to-r from-[#C29332] to-[#A66B2D] dark:from-[#C29332] dark:to-[#D4A43C] rounded-full"
                                        style={{width: '72%'}}
                                    />
                                </div>
                                <div className="flex items-center justify-between text-[11px] text-[#3A2418]/65 dark:text-[#E7DED0]/60">
                                    <span>36 réservés</span>
                                    <span>14 pièces encore disponibles</span>
                                </div>
                            </div>
                        </div>

                        {/* CTA Row */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                            <Link
                                href="/product/baguette-indigo-savane"
                                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-xs font-bold uppercase tracking-widest bg-[#1D120A] hover:bg-[#3A2418] text-[#F8F4EE] dark:bg-[#D4A43C] dark:hover:bg-[#BF9232] dark:text-[#140C06] transition-all duration-300 shadow-md hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer"
                            >
                                <span>Réserver ma pièce numérotée</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>

                            <Link
                                href="/artisans"
                                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-xs font-semibold uppercase tracking-wider text-[#1D120A] dark:text-[#F8F4EE] hover:text-[#A66B2D] dark:hover:text-[#D4A43C] border border-[#E7DED0] dark:border-white/15 hover:border-[#A66B2D]/40 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer bg-white dark:bg-transparent"
                            >
                                <span>Découvrir l&apos;atelier</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
