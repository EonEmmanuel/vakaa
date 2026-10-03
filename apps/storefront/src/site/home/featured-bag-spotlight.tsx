'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Link } from '@/platform/i18n/navigation';
import { ArrowRight } from 'lucide-react';
import { useCurrency } from '@/features/currency/currency-context';

export function FeaturedBagSpotlight() {
    const { activeCurrency } = useCurrency();

    const formatPrice = (baseXaf: number, eurStr: string) => {
        if (activeCurrency === 'EUR') return eurStr;
        if (activeCurrency === 'USD') return `$${Math.round(baseXaf / 600)}`;
        return `${baseXaf.toLocaleString('fr-FR')} FCFA`;
    };

    const featuredBags = [
        {
            title: 'Sac Baguette Terre Émeraude',
            category: 'Maroquinerie Sculptée',
            material: 'Raphia sauvage de Bolgatanga & Cuir végétal',
            price: formatPrice(145000, '390 €'),
            image: '/images/bags/baguette-terre-emeraude-1.jpg',
            slug: 'baguette-terre-emeraude',
        },
        {
            title: 'Cabas Maa Bolgatanga',
            category: 'Architecture Tressée',
            material: 'Fibre d’éléphant haute densité & Anses cuir',
            price: formatPrice(185000, '460 €'),
            image: '/images/bags/maa-tote.jpg',
            slug: 'maa-tote',
        },
    ];

    return (
        <section className="py-24 sm:py-36 bg-[#FAF8F5]">
            <div className="vakaa-container space-y-16">
                
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
                >
                    <div className="space-y-4">
                        <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#A66B2D]">
                            Créations Signatures
                        </span>
                        <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tighter text-[#1D120A] uppercase leading-none">
                            L&apos;Éloge du Détail
                        </h2>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-8 lg:gap-12 items-end">
                    {featuredBags.map((bag, idx) => (
                        <motion.div
                            key={bag.slug}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-100px' }}
                            transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1], delay: idx * 0.15 }}
                            className="group flex flex-col bg-transparent"
                        >
                            {/* Borderless Image Container (Blends seamlessly with #FAF8F5) */}
                            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-transparent">
                                <Image
                                    src={bag.image}
                                    alt={bag.title}
                                    fill
                                    className="object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.03]"
                                    sizes="(max-width: 1024px) 100vw, 55vw"
                                />
                            </div>

                            {/* Refined Editorial Info Strip */}
                            <div className="pt-4 pb-1 flex items-end justify-between">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#A66B2D]">
                                        {bag.category}
                                    </span>
                                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1D120A] dark:text-[#FAF8F5] transition-colors group-hover:text-[#A66B2D]">
                                        {bag.title}
                                    </h3>
                                    <p className="text-xs text-[#3A2418]/70 dark:text-[#FAF8F5]/60">
                                        {bag.material}
                                    </p>
                                    <p className="text-sm sm:text-base font-bold text-[#1D120A] dark:text-[#FAF8F5] pt-1">
                                        {bag.price}
                                    </p>
                                </div>
                                <Link
                                    href={`/product/${bag.slug}`}
                                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#1D120A] dark:text-[#FAF8F5] hover:text-[#A66B2D] transition-colors pb-1"
                                >
                                    <span>Explorer</span>
                                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
