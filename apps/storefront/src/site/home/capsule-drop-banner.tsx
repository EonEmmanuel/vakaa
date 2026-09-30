'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Link } from '@/platform/i18n/navigation';
import { ArrowRight, Sparkles } from 'lucide-react';

export function CapsuleDropBanner() {
    // Initialized countdown for real-time visual excitement
    const [timeLeft, setTimeLeft] = useState({
        days: 4,
        hours: 14,
        minutes: 48,
        seconds: 18,
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev.seconds > 0) {
                    return { ...prev, seconds: prev.seconds - 1 };
                }
                if (prev.minutes > 0) {
                    return { ...prev, minutes: 59, seconds: 59 };
                }
                if (prev.hours > 0) {
                    return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
                }
                if (prev.days > 0) {
                    return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
                }
                return prev;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatNum = (num: number) => String(num).padStart(2, '0');

    return (
        <section className="py-12 sm:py-16 bg-[#FAF8F5] border-b border-[#E7DED0]/60 transition-colors">
            <div className="vakaa-container">
                <div className="relative rounded-3xl bg-[#F3EFE9] overflow-hidden p-6 sm:p-10 lg:p-14 shadow-xs">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                        
                        {/* Left Column: Urgency, Offer & Countdown */}
                        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-[#E7DED0]/70 text-[10px] sm:text-[11px] font-semibold text-[#8C5824]">
                                <Sparkles className="w-3.5 h-3.5 text-[#D4A43C]" />
                                <span>Événement Éphémère d&apos;Atelier</span>
                            </div>

                            <div className="space-y-2 max-w-lg mx-auto lg:mx-0">
                                <h2 className="font-sans text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1D120A] tracking-tight leading-tight">
                                    Vente Capsule Exclusive : <span className="text-[#A66B2D]">Série Limitée</span>
                                </h2>
                                <p className="text-xs sm:text-sm text-[#3A2418]/75 leading-relaxed font-sans">
                                    Chaque pièce de cette capsule est façonnée individuellement et numérotée à la main. Seulement 20 exemplaires par modèle.
                                </p>
                            </div>

                            {/* Countdown Digit Blocks */}
                            <div className="flex items-center justify-center lg:justify-start gap-2.5 sm:gap-4 pt-1">
                                <div className="flex flex-col items-center">
                                    <div className="w-13 sm:w-16 h-13 sm:h-16 rounded-2xl bg-white flex items-center justify-center shadow-xs">
                                        <span className="font-sans text-xl sm:text-2xl font-bold text-[#1D120A] tabular-nums">
                                            {formatNum(timeLeft.days)}
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-medium uppercase tracking-wider text-[#3A2418]/60 mt-1.5">
                                        Jours
                                    </span>
                                </div>

                                <span className="text-xl sm:text-2xl font-bold text-[#1D120A]/40 mb-5">:</span>

                                <div className="flex flex-col items-center">
                                    <div className="w-13 sm:w-16 h-13 sm:h-16 rounded-2xl bg-white flex items-center justify-center shadow-xs">
                                        <span className="font-sans text-xl sm:text-2xl font-bold text-[#1D120A] tabular-nums">
                                            {formatNum(timeLeft.hours)}
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-medium uppercase tracking-wider text-[#3A2418]/60 mt-1.5">
                                        Heures
                                    </span>
                                </div>

                                <span className="text-xl sm:text-2xl font-bold text-[#1D120A]/40 mb-5">:</span>

                                <div className="flex flex-col items-center">
                                    <div className="w-13 sm:w-16 h-13 sm:h-16 rounded-2xl bg-white flex items-center justify-center shadow-xs">
                                        <span className="font-sans text-xl sm:text-2xl font-bold text-[#1D120A] tabular-nums">
                                            {formatNum(timeLeft.minutes)}
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-medium uppercase tracking-wider text-[#3A2418]/60 mt-1.5">
                                        Minutes
                                    </span>
                                </div>

                                <span className="text-xl sm:text-2xl font-bold text-[#1D120A]/40 mb-5">:</span>

                                <div className="flex flex-col items-center">
                                    <div className="w-13 sm:w-16 h-13 sm:h-16 rounded-2xl bg-white flex items-center justify-center shadow-xs">
                                        <span className="font-sans text-xl sm:text-2xl font-bold text-[#A66B2D] tabular-nums">
                                            {formatNum(timeLeft.seconds)}
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-medium uppercase tracking-wider text-[#3A2418]/60 mt-1.5">
                                        Secondes
                                    </span>
                                </div>
                            </div>

                            {/* CTA Action */}
                            <div className="pt-2 flex justify-center lg:justify-start">
                                <Link
                                    href="/search?sort=createdAt-DESC"
                                    className="group inline-flex items-center justify-center gap-2.5 bg-[#1D120A] hover:bg-[#3A2418] text-[#FAF8F5] font-semibold text-xs sm:text-sm pl-6 pr-2.5 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer"
                                >
                                    <span>Réserver Ma Pièce d&apos;Atelier</span>
                                    <span className="size-7 rounded-full bg-white/15 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </span>
                                </Link>
                            </div>
                        </div>

                        {/* Right Column: Visual Dual-Pill Imagery */}
                        <div className="lg:col-span-5 grid grid-cols-2 gap-3 sm:gap-4">
                            <div className="relative aspect-[3/4] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs">
                                <Image
                                    src="/images/bags/maa-tote.jpg"
                                    alt="Série Limitée Atelier VAKAA"
                                    fill
                                    className="object-cover object-center hover:scale-105 transition-transform duration-500"
                                    sizes="(max-width: 640px) 50vw, 25vw"
                                />
                                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[9px] font-bold text-white uppercase tracking-wider">
                                    N° 07 / 20
                                </div>
                            </div>
                            <div className="relative aspect-[3/4] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs mt-4 sm:mt-6">
                                <Image
                                    src="/images/bags/zuri-clutch.jpg"
                                    alt="Maroquinerie de Prestige VAKAA"
                                    fill
                                    className="object-cover object-center hover:scale-105 transition-transform duration-500"
                                    sizes="(max-width: 640px) 50vw, 25vw"
                                />
                                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-[#A66B2D]/90 backdrop-blur-md text-[9px] font-bold text-white uppercase tracking-wider">
                                    Édition Capsule
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
