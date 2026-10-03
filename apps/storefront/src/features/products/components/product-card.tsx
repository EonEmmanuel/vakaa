'use client';

import { useState } from 'react';
import { FragmentOf, readFragment } from '@/platform/vendure/graphql';
import { ProductCardFragment } from '@/features/products/graphql';
import { Price } from '@/features/pricing/price';
import { Suspense } from 'react';
import { Link } from '@/platform/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Heart, ShoppingBag } from 'lucide-react';
import Image from 'next/image';

interface ProductCardProps {
    product: FragmentOf<typeof ProductCardFragment>;
    index?: number;
}

export function ProductCard({ product: productProp }: ProductCardProps) {
    const t = useTranslations('Product');
    const product = readFragment(ProductCardFragment, productProp);

    const defaultImg = product.productAsset?.preview || '/images/bags/baguette-indigo-savane-1.jpg';
    const [isFavorited, setIsFavorited] = useState(false);

    return (
        <div className="group relative flex flex-col bg-transparent">
            {/* ═══ Borderless Image Pedestal (Blends seamlessly with #FAF8F5) ═══ */}
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-transparent">
                <Link
                    href={`/product/${product.slug}`}
                    className="relative block w-full h-full cursor-pointer overflow-hidden"
                >
                    {defaultImg ? (
                        <Image
                            src={defaultImg}
                            alt={product.productName}
                            fill
                            className="object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:transform-none"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground text-xs uppercase tracking-widest gap-2 bg-[#EFEAE2]/60">
                            <ShoppingBag className="size-5 text-[#D4A43C]/40" />
                            <span>{t('noImage')}</span>
                        </div>
                    )}
                </Link>

                {/* Minimalist Floating Wishlist Heart (Discreet, zero borders) */}
                <button
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        setIsFavorited(!isFavorited);
                    }}
                    aria-label="Ajouter aux favoris"
                    className={`absolute top-2.5 right-2.5 size-7 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
                        isFavorited
                            ? 'text-[#D4A43C] opacity-100'
                            : 'text-[#1D120A]/40 hover:text-[#D4A43C] opacity-0 group-hover:opacity-100'
                    }`}
                >
                    <Heart
                        className={`w-4 h-4 stroke-[1.75] ${
                            isFavorited ? 'fill-[#D4A43C] stroke-[#D4A43C]' : ''
                        }`}
                    />
                </button>
            </div>

            {/* ═══ Quiet Luxury Typography (Minimal info, clean spacing) ═══ */}
            <div className="flex flex-col space-y-1 pt-3">
                <Link href={`/product/${product.slug}`} className="block group/link cursor-pointer">
                    <h3 className="font-sans text-sm sm:text-[15px] font-medium tracking-tight text-[#1D120A] dark:text-[#FAF8F5] group-hover/link:text-[#A66B2D] transition-colors line-clamp-1">
                        {product.productName}
                    </h3>
                </Link>

                <div className="text-xs sm:text-sm text-[#3A2418]/75 dark:text-[#FAF8F5]/70 font-normal">
                    <Suspense fallback={<div className="h-4 w-16 rounded bg-muted/40 animate-pulse" />}>
                        {product.priceWithTax ? (
                            product.priceWithTax.__typename === 'PriceRange' ? (
                                product.priceWithTax.min !== product.priceWithTax.max ? (
                                    <div className="flex items-center gap-1">
                                        <span className="text-[10px] text-[#785D48]">{t('from')}</span>
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
                    </Suspense>
                </div>
            </div>
        </div>
    );
}