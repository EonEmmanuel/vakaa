'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FragmentOf, readFragment } from '@/platform/vendure/graphql';
import { ProductCardFragment } from '@/features/products/graphql';
import { Price } from '@/features/pricing/price';
import { Suspense } from 'react';
import { Link } from '@/platform/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Heart, Star, ShoppingBag } from 'lucide-react';
import { QuickBuyDrawer, QuickBuyProduct } from './quick-buy-drawer';

interface ProductCardProps {
    product: FragmentOf<typeof ProductCardFragment>;
    index?: number;
}

interface SwatchOption {
    name: string;
    color: string;
    image: string;
}

function getCuratedSwatches(slug: string, defaultImage: string): SwatchOption[] {
    const s = slug.toLowerCase();
    if (s.includes('baguette')) {
        return [
            { name: 'Indigo & Savane', color: '#C4823F', image: '/images/bags/baguette-indigo-savane-1.jpg' },
            { name: 'Terre & Émeraude', color: '#1E3A2F', image: '/images/bags/baguette-terre-emeraude-1.jpg' },
            { name: 'Indigo Nuit', color: '#1E2D4A', image: '/images/bags/baguette-indigo-savane-3.jpg' },
        ];
    }
    if (s.includes('maa') || s.includes('tote') || s.includes('cabas')) {
        return [
            { name: 'Raphia Doré', color: '#D4A43C', image: '/images/bags/maa-tote.jpg' },
            { name: 'Ébène Atelier', color: '#1F1A16', image: '/images/bags/kemi-shoulder.jpg' },
        ];
    }
    if (s.includes('zuri') || s.includes('clutch') || s.includes('pochette')) {
        return [
            { name: 'Cuir Fauve', color: '#A66B2D', image: '/images/bags/zuri-clutch.jpg' },
            { name: 'Noir Nuit', color: '#1A1A1A', image: '/images/bags/cat-clutch.jpg' },
        ];
    }
    if (s.includes('kemi') || s.includes('shoulder') || s.includes('epaule')) {
        return [
            { name: 'Noir Onyx', color: '#1D120A', image: '/images/bags/kemi-shoulder.jpg' },
            { name: 'Sable Solaire', color: '#C8B195', image: '/images/bags/maa-tote.jpg' },
        ];
    }
    if (defaultImage) {
        return [
            { name: 'Cuir Végétal', color: '#A66B2D', image: defaultImage },
            { name: 'Noir Atelier', color: '#1D120A', image: defaultImage },
        ];
    }
    return [];
}

export function ProductCard({ product: productProp, index = 0 }: ProductCardProps) {
    const t = useTranslations('Product');
    const product = readFragment(ProductCardFragment, productProp);

    const defaultImg = product.productAsset?.preview || '/images/bags/baguette-indigo-savane-1.jpg';
    const swatches = getCuratedSwatches(product.slug, defaultImg);

    const [activeSwatchIdx, setActiveSwatchIdx] = useState(0);
    const [isFavorited, setIsFavorited] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const activeImage = swatches[activeSwatchIdx]?.image || defaultImg;
    const activeColorName = swatches[activeSwatchIdx]?.name || 'Cuir Végétal';

    // Calculate raw numeric price for QuickBuy drawer
    const rawPrice = product.priceWithTax
        ? product.priceWithTax.__typename === 'SinglePrice'
            ? product.priceWithTax.value
            : product.priceWithTax.min
        : 14500000;

    const quickBuyProduct: QuickBuyProduct = {
        name: product.productName,
        slug: product.slug,
        price: rawPrice,
        currencyCode: product.currencyCode || 'XAF',
        imageUrl: activeImage,
        finishes: swatches,
    };

    return (
        <>
            {/* Borderless outer container: Product floats naturally on the canvas */}
            <div className="group relative flex flex-col transition-all duration-300">
                {/* ═══ Image Island Pedestal (Tone-on-tone, pillowed, no outer card box) ═══ */}
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-[#F0EBE1] transition-all duration-500 ease-out group-hover:shadow-[0_16px_36px_-10px_rgba(29,18,10,0.12)] group-hover:-translate-y-0.5">
                    <Link
                        href={`/product/${product.slug}`}
                        className="relative block w-full h-full cursor-pointer overflow-hidden"
                    >
                        {activeImage ? (
                            <Image
                                src={activeImage}
                                alt={product.productName}
                                fill
                                className="object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:transform-none"
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground text-xs uppercase tracking-widest gap-2 bg-[#EFEAE2]">
                                <ShoppingBag className="size-5 text-[#D4A43C]/40" />
                                <span>{t('noImage')}</span>
                            </div>
                        )}
                    </Link>

                    {/* Authentic Atelier Badge (Minimal text, clean backdrop, zero sparkles/pulsing dots) */}
                    <div className="absolute top-3 left-3 pointer-events-none">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-widest font-medium bg-black/40 backdrop-blur-md text-[#FAF7F2] border border-white/10">
                            Atelier
                        </span>
                    </div>

                    {/* Floating Wishlist Heart */}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            setIsFavorited(!isFavorited);
                        }}
                        aria-label="Ajouter aux favoris"
                        className={`absolute top-3 right-3 size-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-200 cursor-pointer shadow-xs active:scale-95 ${
                            isFavorited
                                ? 'bg-[#D4A43C] text-white ring-2 ring-white'
                                : 'bg-white/80 text-[#1D120A] hover:bg-[#D4A43C] hover:text-white'
                        }`}
                    >
                        <Heart
                            className={`w-3.5 h-3.5 stroke-[1.75] ${
                                isFavorited ? 'fill-white stroke-white' : ''
                            }`}
                        />
                    </button>

                    {/* Tactile On-Card Swatches Pill (Clean & restrained) */}
                    {swatches.length > 1 && (
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md shadow-xs opacity-90 group-hover:opacity-100 transition-opacity">
                            <span className="text-[10px] font-semibold text-[#1D120A] truncate pr-1">
                                {activeColorName}
                            </span>
                            <div className="flex items-center gap-1.5 shrink-0">
                                {swatches.map((swatch, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        aria-label={`Choisir la teinte ${swatch.name}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setActiveSwatchIdx(idx);
                                        }}
                                        onMouseEnter={() => setActiveSwatchIdx(idx)}
                                        className={`size-3.5 rounded-full shadow-inner transition-transform cursor-pointer ${
                                            activeSwatchIdx === idx
                                                ? 'ring-1.5 ring-[#D4A43C] ring-offset-1 scale-110'
                                                : 'opacity-80 hover:opacity-100 hover:scale-105'
                                        }`}
                                        style={{ backgroundColor: swatch.color }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Direct Buy Drawer Trigger Overlay (Visible on Hover) */}
                    <div className="absolute inset-x-3 bottom-12 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hidden sm:block pointer-events-auto">
                        <button
                            type="button"
                            onClick={() => setIsDrawerOpen(true)}
                            className="w-full py-2.5 flex items-center justify-center gap-2 text-[10px] font-bold tracking-widest uppercase text-[#FAF8F5] bg-[#1D120A]/95 hover:bg-[#3A2418] backdrop-blur-md rounded-full shadow-md transition-all active:scale-[0.98] cursor-pointer"
                        >
                            <ShoppingBag className="w-3.5 h-3.5 text-[#D4A43C]" />
                            <span>Commander en 1 Clic</span>
                        </button>
                    </div>
                </div>

                {/* ═══ Details Block (Clean vertical flow, NO outer border or card boxing) ═══ */}
                <div className="flex flex-col space-y-1 pt-3 px-0.5">
                    {/* Category & Rating Row */}
                    <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold uppercase tracking-wider text-[#A66B2D]">
                            Maroquinerie d&apos;Art
                        </span>
                        <div className="flex items-center gap-1 text-[#D4A43C]">
                            <Star className="w-3 h-3 fill-[#D4A43C] text-[#D4A43C]" />
                            <span className="font-semibold text-[#1D120A]">5.0</span>
                        </div>
                    </div>

                    {/* Title */}
                    <Link href={`/product/${product.slug}`} className="block group/link cursor-pointer">
                        <h3 className="font-sans text-sm sm:text-[15px] font-semibold tracking-tight text-[#1D120A] group-hover/link:text-[#A66B2D] transition-colors line-clamp-1">
                            {product.productName}
                        </h3>
                    </Link>

                    {/* Price & Mobile Quick Action */}
                    <div className="flex items-center justify-between pt-0.5">
                        <Suspense fallback={<div className="h-4 w-20 rounded bg-muted animate-pulse" />}>
                            <div className="text-xs sm:text-sm font-bold tracking-tight text-[#1D120A]">
                                {product.priceWithTax ? (
                                    product.priceWithTax.__typename === 'PriceRange' ? (
                                        product.priceWithTax.min !== product.priceWithTax.max ? (
                                            <div className="flex items-center gap-1 flex-wrap">
                                                <span className="text-[10px] font-normal text-[#785D48]">{t('from')}</span>
                                                <Price value={product.priceWithTax.min} currencyCode={product.currencyCode} />
                                            </div>
                                        ) : (
                                            <Price value={product.priceWithTax.min} currencyCode={product.currencyCode} />
                                        )
                                    ) : product.priceWithTax.__typename === 'SinglePrice' ? (
                                        <Price value={product.priceWithTax.value} currencyCode={product.currencyCode} />
                                    ) : null
                                ) : (
                                    <span>145 000 FCFA</span>
                                )}
                            </div>
                        </Suspense>

                        {/* Mobile Direct Action Icon Button */}
                        <button
                            type="button"
                            onClick={() => setIsDrawerOpen(true)}
                            aria-label={`Acheter ${product.productName}`}
                            className="sm:hidden size-8 rounded-full bg-[#1D120A] text-white flex items-center justify-center active:scale-95 cursor-pointer shadow-xs"
                        >
                            <ShoppingBag className="w-3.5 h-3.5 text-[#D4A43C]" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick Buy Drawer Modal */}
            <QuickBuyDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                product={quickBuyProduct}
            />
        </>
    );
}
