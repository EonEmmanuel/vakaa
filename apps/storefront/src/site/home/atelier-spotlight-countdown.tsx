'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Link } from '@/platform/i18n/navigation';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

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
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
                if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
                if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
                if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
                return prev;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const pad = (n: number) => n.toString().padStart(2, '0');

    return (
        <section className="py-24 sm:py-40 bg-[#1D120A] text-[#FAF8F5] overflow-hidden">
            <div className="vakaa-container">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                    
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
                        className="relative w-full aspect-[4/5] bg-[#140C06]"
                    >
                        <Image
                            src="/images/bags/baguette-indigo-savane-1.jpg"
                            alt="Baguette Indigo Savane"
                            fill
                            className="object-cover object-center"
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1], delay: 0.2 }}
                        className="space-y-12"
                    >
                        <div className="space-y-6">
                            <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#D4A43C]">
                                Édition Limitée
                            </p>
                            <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tighter uppercase leading-[0.95]">
                                Baguette<br/>Indigo Savane
                            </h2>
                            <p className="text-xl sm:text-2xl font-light tracking-wide text-[#E7DED0]">
                                Tirage : 14 / 50 ex.
                            </p>
                        </div>

                        <div className="grid grid-cols-4 gap-4 py-8 border-y border-[#3A2418]">
                            {[
                                { label: 'Jours', value: mounted ? pad(timeLeft.days) : '04' },
                                { label: 'Heures', value: mounted ? pad(timeLeft.hours) : '14' },
                                { label: 'Minutes', value: mounted ? pad(timeLeft.minutes) : '48' },
                                { label: 'Secondes', value: mounted ? pad(timeLeft.seconds) : '18' },
                            ].map((slot, i) => (
                                <div key={i} className="flex flex-col items-center justify-center">
                                    <span className="font-mono text-4xl sm:text-5xl font-light tracking-tighter text-[#D4A43C]">
                                        {slot.value}
                                    </span>
                                    <span className="text-[10px] uppercase tracking-widest text-[#E7DED0]/60 mt-2">
                                        {slot.label}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div>
                            <Link
                                href="/product/baguette-indigo-savane"
                                className="group inline-flex items-center justify-center gap-4 px-10 py-5 bg-[#FAF8F5] text-[#1D120A] hover:bg-[#D4A43C] transition-colors"
                            >
                                <span className="text-xs font-bold uppercase tracking-widest">
                                    Réserver la pièce
                                </span>
                                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
