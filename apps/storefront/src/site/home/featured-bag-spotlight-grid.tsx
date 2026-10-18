'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Link } from '@/platform/i18n/navigation';
import { ArrowRight } from 'lucide-react';
import { Price } from '@/features/pricing/price';
import { TRANSPARENT_LOCAL_IMAGES } from '@/features/products/transparent-cutouts';
import { useGsapTilt, useGsapMagnetic } from '@/lib/motion/gsap-hooks';
import { useRef } from 'react';
import { cn, normalizeAssetUrl } from '@/lib/utils';

interface FeaturedBagProduct {
    name: string;
    slug: string;
    imageUrl: string | null;
    priceWithTax: number | null;
    material: string | null;
}

function FeaturedBagCard({
    bag,
    idx,
}: {
    bag: FeaturedBagProduct;
    idx: number;
}) {
    const cardRef = useRef<HTMLDivElement>(null);
    const linkRef = useRef<HTMLAnchorElement>(null);

    // Apply tilt effect to the featured bag card
    useGsapTilt(cardRef, { maxTilt: 5, scale: 1.015, disableOnTouch: true });
    // Apply magnetic effect to the CTA link
    useGsapMagnetic(linkRef, { strength: 0.2, disableOnTouch: true });

    const imageSrc =
        normalizeAssetUrl(bag.imageUrl) ||
        TRANSPARENT_LOCAL_IMAGES[bag.slug] ||
        '/images/placeholder-product.svg';

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1], delay: idx * 0.15 }}
            ref={cardRef}
            className="group flex flex-col bg-transparent"
        >
            {/* Borderless Image Container (Blends seamlessly with #FAF8F5) */}
            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-transparent">
                <Image
                    src={imageSrc}
                    alt={bag.name}
                    fill
                    className="object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.03]"
                    sizes="(max-width: 1024px) 100vw, 55vw"
                />
            </div>

            {/* Refined Editorial Info Strip */}
            <div className="pt-4 pb-1 flex items-end justify-between">
                <div className="space-y-1">
                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1c1b18] transition-colors group-hover:text-[#D4A43C]">
                        {bag.name}
                    </h3>
                    {bag.material && (
                        <p className="text-xs text-[#57544c]">
                            {bag.material}
                        </p>
                    )}
                    {bag.priceWithTax !== null && (
                        <Price
                            value={bag.priceWithTax}
                            className="block text-sm sm:text-base font-bold text-[#1c1b18] pt-1"
                        />
                    )}
                </div>
                <Link
                    ref={linkRef}
                    href={`/product/${bag.slug}`}
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#1c1b18] hover:text-[#D4A43C] transition-colors pb-1"
                >
                    <span>Explorer</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
            </div>
        </motion.div>
    );
}

export function FeaturedBagSpotlightGrid({ products }: { products: FeaturedBagProduct[] }) {
    return (
        <section className={cn('py-12 sm:py-24 lg:py-32 bg-[#f2efe9]')}>
            <div className="vakaa-container space-y-8 sm:space-y-14">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-30px' }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
                >
                    <div className="space-y-2 sm:space-y-3">
                        <span className="text-[10.5px] sm:text-[11px] font-bold tracking-[0.2em] uppercase text-[#D4A43C]">
                            Créations Signatures
                        </span>
                        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1c1b18] uppercase leading-none font-display">
                            L&apos;Éloge du Détail
                        </h2>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-6 sm:gap-8 lg:gap-12 items-end">
                    {products.map((bag, idx) => (
                        <FeaturedBagCard key={bag.slug} bag={bag} idx={idx} />
                    ))}
                </div>
            </div>
        </section>
    );
}
