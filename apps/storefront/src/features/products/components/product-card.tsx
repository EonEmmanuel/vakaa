'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { FragmentOf, readFragment } from '@/platform/vendure/graphql';
import { ProductCardFragment } from '@/features/products/graphql';
import { Price } from '@/features/pricing/price';
import { Link } from '@/platform/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Plus, Check, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useFlyToCart } from '@/lib/motion/fly-to-cart';
import { toast } from 'sonner';
import { cn, normalizeAssetUrl } from '@/lib/utils';
import { useCart } from '@/features/cart';
import { PRIMARY_LOCAL_FALLBACKS, TRANSPARENT_LOCAL_IMAGES } from '../transparent-cutouts';

// Soft Luxury Pastel Color Palette (Exact KVIST bento surface tints allowing bags to blend seamlessly)
const PRODUCT_SPECIFIC_BG: Record<string, string> = {
    'maa-tote': 'bg-[#ebe2d4] dark:bg-[#201d19]', // Natural warm sand
    'cabas-maa-raphia': 'bg-[#ebe2d4] dark:bg-[#201d19]',
    'vakaa-duo-hero': 'bg-[#efded7] dark:bg-[#241c19]',
    'baguette-indigo-savane': 'bg-[#ebe2d4] dark:bg-[#201d19]', // Warm linen sand
    'baguette-terre-emeraude': 'bg-[#dbe4d3] dark:bg-[#1a211a]', // Soft palm sage
    'kemi-shoulder-bag': 'bg-[#f3dfc6] dark:bg-[#231e18]', // Soft artisanal biscuit
    'porte-epaule-kemi': 'bg-[#f3dfc6] dark:bg-[#231e18]',
    'zuri-clutch': 'bg-[#f1e7c6] dark:bg-[#222019]', // Warm butter straw
    'pochette-zuri-laiton': 'bg-[#f1e7c6] dark:bg-[#222019]',
    'asa-crossbody': 'bg-[#efded7] dark:bg-[#241c19]', // Soft terracotta blush
    'aya-cardholder': 'bg-[#f7efe4] dark:bg-[#1f1d1a]', // Parchment atelier ivory
};

const VAKAA_CARD_TINTS = [
    'bg-[#ebe2d4] dark:bg-[#201d19]', // Warm Sand
    'bg-[#f3dfc6] dark:bg-[#231e18]', // Artisanal Biscuit
    'bg-[#f1e7c6] dark:bg-[#222019]', // Warm Butter Straw
    'bg-[#efded7] dark:bg-[#241c19]', // Soft Blush
    'bg-[#dbe4d3] dark:bg-[#1a211a]', // Muted Sage
    'bg-[#f7efe4] dark:bg-[#1f1d1a]', // Atelier Ivory
    'bg-[#e5e2db] dark:bg-[#1e1d1b]', // Raw Stone
];

interface ProductCardProps {
    product: FragmentOf<typeof ProductCardFragment>;
    index?: number;
    className?: string;
}

export function ProductCard({ product: productProp, index, className }: ProductCardProps) {
    const t = useTranslations('Product');
    const product = readFragment(ProductCardFragment, productProp);

    const rawPreview = normalizeAssetUrl(product.productAsset?.preview);
    const transparentImg = TRANSPARENT_LOCAL_IMAGES[product.slug] || PRIMARY_LOCAL_FALLBACKS[product.slug];
    // Products not in the cutout maps show their real backend asset — never another product's image.
    const defaultImg = transparentImg || rawPreview || '/images/placeholder-product.svg';

    const [isAdding, setIsAdding] = useState(false);
    const [isAdded, setIsAdded] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsTouchDevice(window.matchMedia('(hover: none)').matches);
        }
    }, []);

    const imageContainerRef = useRef<HTMLDivElement>(null);

    const { triggerFly } = useFlyToCart();
    const cart = useCart();

    const handleMouseEnterCard = () => {
        setIsHovered(true);
    };

    const handleMouseLeaveCard = () => {
        setIsHovered(false);
    };

    const handleQuickAdd = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isAdding || isAdded) return;

        // Instant visual feedback: trigger checkmark & fly animation immediately
        setIsAdded(true);
        if (imageContainerRef.current) {
            const rect = imageContainerRef.current.getBoundingClientRect();
            triggerFly(rect, defaultImg, product.productName);
        }

        const toastId = toast.success(t('addedToCartMessage'), {
            description: t('addedToCartDescription', { name: product.productName }),
            action: {
                label: t('viewCart'),
                onClick: () => cart.openCart(),
            },
        });

        try {
            setIsAdding(true);
            await cart.addItem({
                variantId: product.productVariantId || undefined,
                slug: product.slug,
                name: product.productName,
                priceWithTax: product.priceWithTax?.__typename === 'SinglePrice' ? product.priceWithTax.value : (product.priceWithTax?.__typename === 'PriceRange' ? product.priceWithTax.min : undefined),
                assetPreview: defaultImg,
                quantity: 1,
                openDrawer: false,
            });
        } catch (err) {
            setIsAdded(false);
            toast.dismiss(toastId);
            toast.error(err instanceof Error ? err.message : t('errorAddToCart'));
        } finally {
            setIsAdding(false);
            setTimeout(() => {
                setIsAdded(false);
            }, 1800);
        }
    };

    const specificBg = PRODUCT_SPECIFIC_BG[product.slug];
    const tintClass = specificBg || VAKAA_CARD_TINTS[(index ?? 0) % VAKAA_CARD_TINTS.length];

    return (
        <motion.article
            initial="rest"
            whileHover="hover"
            animate={isHovered ? "hover" : "rest"}
            onMouseEnter={handleMouseEnterCard}
            onMouseLeave={handleMouseLeaveCard}
            className={cn("group relative", className)}
        >
            <Link
                href={`/product/${product.slug}`}
                className="block rounded-[26px] focus-visible:outline-offset-4"
            >
                {/* ═══ Top Image Container: aspect-[4/5] rounded-[26px] with Authentic Vakaa Tint & Shadow-Tile ═══ */}
                <div
                    ref={imageContainerRef}
                    className={cn(
                        "relative aspect-[4/5] w-full overflow-hidden rounded-[26px] border border-[#e2ddd2]/70 dark:border-white/10 shadow-tile transition-all duration-300 group-hover:shadow-lift",
                        tintClass
                    )}
                >
                    {/* Contracting Ground Shadow (Exact KVIST Physics) */}
                    <motion.span
                        aria-hidden={true}
                        className="pointer-events-none absolute bottom-[13%] left-1/2 h-6 w-[58%] -translate-x-1/2 rounded-[50%] bg-[#1c1b18]/20 dark:bg-black/50 blur-md z-0"
                        animate={{
                            scaleX: isHovered ? 0.78 : 1,
                            opacity: isHovered ? 0.32 : 0.55,
                        }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    />

                    {/* Floating Product Image (Exact KVIST inset-[11%] bottom-[15%]) */}
                    <motion.div
                        className="absolute inset-[11%] bottom-[15%] z-1 flex items-center justify-center pointer-events-none"
                        animate={{
                            y: isHovered ? -14 : 0,
                            rotate: isHovered ? -1.5 : 0,
                            scale: isHovered ? 1.05 : 1,
                        }}
                        transition={{ type: "spring", stiffness: 200, damping: 18 }}
                    >
                        <Image
                            src={defaultImg}
                            alt={product.productName}
                            fill
                            priority={index !== undefined && index < 4}
                            loading={index !== undefined && index < 4 ? undefined : 'lazy'}
                            className="size-full object-contain drop-shadow-[0_12px_24px_rgba(29,18,10,0.08)]"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                    </motion.div>
                </div>

                {/* ═══ Exact KVIST Typographic Hierarchy (Calm, Airy, Scandinavian) ═══ */}
                <div className="grid grid-cols-[1fr_auto] items-baseline gap-x-3 px-1 pt-3 sm:px-1.5 sm:pt-4">
                    <h3 className="col-span-2 sm:col-span-1 text-[14px] sm:text-[15.5px] font-sans font-medium leading-snug sm:truncate text-[#1c1b18] dark:text-[#fbfaf7] tracking-normal group-hover:text-[#D4A43C] dark:group-hover:text-[#D4A43C] transition-colors mt-0.5">
                        {product.productName}
                    </h3>
                    <div className="mt-1 text-right font-display text-[15px] sm:col-start-2 sm:mt-0 sm:self-end sm:text-[17px] font-semibold tabular text-[#1c1b18] dark:text-[#fbfaf7]">
                        <Suspense fallback={<span className="h-5 w-16 inline-block rounded bg-muted/40 animate-pulse" />}>
                            {product.priceWithTax ? (
                                product.priceWithTax?.__typename === 'PriceRange' ? (
                                    product.priceWithTax.min !== product.priceWithTax.max ? (
                                        <div className="flex items-center gap-1 justify-end">
                                            <span className="text-[11px] font-normal text-[#57544c]">{t('from')}</span>
                                            <Price value={product.priceWithTax.min} currencyCode={product.currencyCode} />
                                        </div>
                                    ) : (
                                        <Price value={product.priceWithTax.min} currencyCode={product.currencyCode} />
                                    )
                                ) : product.priceWithTax?.__typename === 'SinglePrice' ? (
                                    <Price value={product.priceWithTax.value} currencyCode={product.currencyCode} />
                                ) : null
                            ) : null}
                        </Suspense>
                    </div>
                </div>
            </Link>

            {/* ═══ Circular Spring Plus Quick-Add Button (Exact KVIST layout & rotating spring) ═══ */}
            <div className="pointer-events-none absolute inset-x-0 top-0 aspect-[4/5] z-30">
                <motion.button
                    type="button"
                    onClick={handleQuickAdd}
                    disabled={isAdding && !isAdded}
                    aria-label={`Ajouter ${product.productName} au panier`}
                    className={cn(
                        "pointer-events-auto absolute bottom-3.5 right-3.5 sm:bottom-4 sm:right-4 grid size-11 sm:size-12 place-items-center rounded-full shadow-tile hover:shadow-lift cursor-pointer transition-[background-color,color,border-color,box-shadow] duration-200 z-30",
                        "[@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:focus-visible:opacity-100",
                        isTouchDevice ? "opacity-100" : "",
                        isAdded
                            ? "bg-[#D4A43C] text-[#1D120A] opacity-100!"
                            : "bg-[#1c1b18] text-[#fbfaf7] dark:bg-[#fbfaf7] dark:text-[#1c1b18] hover:bg-[#D4A43C] hover:text-[#1D120A] dark:hover:bg-[#D4A43C] dark:hover:text-[#1D120A]"
                    )}
                    animate={{
                        y: (isHovered || isTouchDevice) ? 0 : 8,
                        scale: (isHovered || isTouchDevice) ? 1 : 0.88,
                        rotate: isHovered ? 90 : 0,
                    }}
                    transition={{ type: "spring", stiffness: 320, damping: 22 }}
                    whileTap={{ scale: 0.92 }}
                    whileHover={{ scale: 1.12, transition: { type: "spring", stiffness: 400, damping: 20 } }}
                >
                    {isAdded ? (
                        <Check className="size-5 stroke-[2.5]" />
                    ) : isAdding ? (
                        <Loader2 className="size-5 animate-spin" />
                    ) : (
                        <Plus className="size-5 stroke-[2.2]" />
                    )}
                </motion.button>
            </div>
        </motion.article>
    );
}