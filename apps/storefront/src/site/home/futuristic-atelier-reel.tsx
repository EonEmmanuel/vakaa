'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Link } from '@/platform/i18n/navigation';
import { useRef } from 'react';
import { useGsapTilt } from '@/lib/motion/gsap-hooks';

interface ReelProduct {
    src: string;
    name: string;
}

function ReelProductItem({
    product,
    idx,
}: {
    product: ReelProduct;
    idx: number;
}) {
    const productRef = useRef<HTMLDivElement>(null);
    useGsapTilt(productRef, { maxTilt: 3, scale: 1.01, disableOnTouch: true });

    return (
        <motion.div
            ref={productRef}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{
                duration: 0.8,
                delay: idx * 0.1,
                ease: [0.32, 0.72, 0, 1],
            }}
            className="w-[280px] sm:w-[400px] flex flex-col gap-4 group"
        >
            <Link href="/search" className="block relative aspect-[3/4] w-full overflow-hidden bg-[#fbfaf7] border border-[#e2ddd2] rounded-2xl shadow-sm">
                <Image
                    src={product.src}
                    alt={product.name}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
                    sizes="(max-width: 640px) 280px, 400px"
                />
            </Link>
            <h3 className="font-sans text-sm font-bold text-[#1c1b18]">
                {product.name}
            </h3>
        </motion.div>
    );
}

export function FuturisticAtelierReel() {
    const products: ReelProduct[] = [
        { src: '/images/bags/baguette-terre-emeraude-1.jpg', name: 'Baguette Terre & Émeraude' },
        { src: '/images/bags/maa-tote.jpg', name: 'Grand Cabas Maa Solaire' },
        { src: '/images/bags/vakaa-duo-hero.jpg', name: 'Le Duo Signatures' },
        { src: '/images/bags/baguette-indigo-savane-1.jpg', name: 'Baguette Indigo Savane' },
        { src: '/images/bags/zuri-clutch.jpg', name: 'Pochette Zuri' },
        { src: '/images/bags/kemi-shoulder.jpg', name: 'Sac Épaule Kemi' },
    ];

    return (
        <section className="py-24 sm:py-32 bg-[#f2efe9] border-t border-[#e2ddd2] overflow-hidden">
            <div className="vakaa-container mb-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
                    className="flex flex-col sm:flex-row sm:items-end justify-between gap-8"
                >
                    <div className="space-y-4">
                        <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1c1b18] tracking-tight leading-none">
                            L&apos;Atelier
                        </h2>
                        <p className="text-sm text-[#57544c] max-w-md">
                            Chaque pièce est façonnée à la main, honorant le temps et le geste juste.
                        </p>
                    </div>
                    <Link
                        href="/search"
                        className="text-xs font-bold uppercase tracking-widest text-[#D4A43C] hover:text-[#1D120A] transition-colors shrink-0"
                    >
                        Découvrir la Collection
                    </Link>
                </motion.div>
            </div>

            {/* Horizontal Scroll Strip */}
            <div data-lenis-prevent className="w-full overflow-x-auto pb-8 hide-scrollbar cursor-grab active:cursor-grabbing">
                <div className="flex gap-4 sm:gap-6 px-4 sm:px-8 md:px-12 w-max">
                    {products.map((product, idx) => (
                        <ReelProductItem key={idx} product={product} idx={idx} />
                    ))}
                </div>
            </div>

            <style jsx>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </section>
    );
}