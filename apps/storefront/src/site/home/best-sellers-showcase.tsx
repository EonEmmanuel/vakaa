'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FragmentOf, readFragment } from '@/platform/vendure/graphql';
import { ProductCard, ProductCardFragment } from '@/features/products';
import { cn } from '@/lib/utils';

export interface CategoryTab {
    id: string;
    name: string;
}

interface BestSellersShowcaseProps {
    products: Array<FragmentOf<typeof ProductCardFragment>>;
    eyebrow: string;
    title: string;
    viewAllLabel?: string;
    categories: CategoryTab[];
}

function getCategoryIdForSlug(slug: string): string {
    const s = slug.toLowerCase();
    if (s.includes('tote') || s.includes('cabas') || s.includes('maa') || s.includes('nomade')) return 'cabas';
    if (s.includes('clutch') || s.includes('pochette') || s.includes('zuri')) return 'pochettes';
    if (s.includes('cardholder') || s.includes('aya') || s.includes('accessoire') || s.includes('porte-carte')) return 'accessoires';
    if (s.includes('shoulder') || s.includes('baguette') || s.includes('kemi') || s.includes('crossbody') || s.includes('asa')) return 'epaule';
    return 'cabas';
}

export function BestSellersShowcase({
    products,
    eyebrow,
    title,
    categories,
}: BestSellersShowcaseProps) {
    const [activeCategory, setActiveCategory] = useState('all');

    const filteredProducts = useMemo(() => {
        if (activeCategory === 'all') {
            return products.slice(0, 8);
        }
        const matching = products.filter((p) => {
            const unmasked = readFragment(ProductCardFragment, p);
            const catId = getCategoryIdForSlug(unmasked.slug || '');
            return catId === activeCategory;
        });
        return (matching.length > 0 ? matching : products).slice(0, 8);
    }, [activeCategory, products]);

    return (
        <section className="pt-10 sm:pt-16 pb-20 sm:pb-28 lg:pb-36 bg-[#f2efe9] dark:bg-[#151413]">
            <div className="max-w-[1720px] mx-auto px-3 sm:px-5">
                {/* ═══ Section Header with Title on the Left and Filter Tabs in the Right Corner ═══ */}
                <div className="mb-6 sm:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-x-6 gap-y-4">
                    <div>
                        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#D4A43C] font-semibold">
                            {eyebrow}
                        </p>
                        <h2 className="font-display mt-2 text-[clamp(2.15rem,4.5vw,3.75rem)] font-bold text-[#1c1b18] dark:text-[#fbfaf7] tracking-tight leading-[1.05]">
                            {title}
                        </h2>
                    </div>

                    {/* Filter Tabs Pill positioned in the corner, compact and refined */}
                    <div className="-mx-3 w-[calc(100%+1.5rem)] overflow-x-auto px-3 py-1 [scrollbar-width:none] sm:mx-0 sm:w-auto sm:px-0">
                        <div
                            role="tablist"
                            aria-label="Filter pieces"
                            className="flex w-max gap-1 rounded-full bg-[#fbfaf7] dark:bg-[#1a1917] p-1 shadow-tile border border-[#e2ddd2]/70 dark:border-white/10"
                        >
                            {categories.map((cat) => {
                                const isActive = activeCategory === cat.id;
                                return (
                                    <button
                                        key={cat.id}
                                        role="tab"
                                        aria-selected={isActive}
                                        onClick={() => setActiveCategory(cat.id)}
                                        className="relative isolate inline-flex h-8 sm:h-8.5 items-center rounded-full px-3 sm:px-3.5 text-[12px] sm:text-[13px] font-medium transition-colors duration-300 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4A43C]"
                                    >
                                        {isActive && (
                                            <motion.span
                                                layoutId="fav-pill"
                                                className="absolute inset-0 -z-10 rounded-full bg-[#1c1b18] dark:bg-[#fbfaf7]"
                                                transition={{ type: "spring", stiffness: 400, damping: 34 }}
                                            />
                                        )}
                                        <span
                                            className={cn(
                                                "transition-colors duration-200 select-none",
                                                isActive
                                                    ? "text-[#fbfaf7] dark:text-[#1c1b18] font-medium"
                                                    : "text-[#57544c] hover:text-[#1c1b18] dark:text-[#a6a29a] dark:hover:text-[#fbfaf7]"
                                            )}
                                        >
                                            {cat.name}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* ═══ Products Grid with Spring Layout Transitions (Exact KVIST 2-col mobile / 4-col desktop) ═══ */}
                <motion.div
                    layout
                    className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-4 lg:grid-cols-4 items-start"
                >
                    <AnimatePresence mode="popLayout" initial={false}>
                        {filteredProducts.map((product, idx) => {
                            const unmasked = readFragment(ProductCardFragment, product);
                            return (
                                <motion.div
                                    key={unmasked.productId || unmasked.slug || idx}
                                    layout
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                        transition: { delay: (idx % 4) * 0.04, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                                    }}
                                    exit={{ opacity: 0, y: 20, transition: { duration: 0.2 } }}
                                    transition={{ layout: { type: "spring", stiffness: 260, damping: 30 } }}
                                >
                                    <ProductCard
                                        product={product}
                                        index={idx}
                                    />
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </motion.div>
            </div>
        </section>
    );
}
