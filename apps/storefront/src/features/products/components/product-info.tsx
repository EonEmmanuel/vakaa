'use client';

import { useState, useMemo, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { usePathname, useRouter } from '@/platform/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import {
    ShoppingCart,
    CheckCircle2,
    MessageCircle,
    ShieldCheck,
    Truck,
    Heart,
    Minus,
    Plus,
    Star,
    Check,
    Share2,
    Sparkles,
} from 'lucide-react';
import { addToCart } from '@/features/products/add-to-cart';
import { toast } from 'sonner';
import { Price } from '@/features/pricing/price';
import { useTranslations } from 'next-intl';
import { useCart } from '@/features/cart/context/cart-context';

function FacebookIcon({ className = "size-4" }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
    );
}

function PinterestIcon({ className = "size-4" }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
            <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
        </svg>
    );
}

function InstagramIcon({ className = "size-4" }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
    );
}

interface ProductInfoProps {
    product: {
        id: string;
        name: string;
        description: string;
        slug?: string;
        variants: Array<{
            id: string;
            name: string;
            sku: string;
            priceWithTax: number;
            stockLevel: string;
            customFields?: {
                allowPreOrder?: boolean | null;
                preOrderLeadTime?: string | null;
            } | null;
            options: Array<{
                id: string;
                code: string;
                name: string;
                groupId: string;
                group: {
                    id: string;
                    code: string;
                    name: string;
                };
            }>;
        }>;
        optionGroups: Array<{
            id: string;
            code: string;
            name: string;
            options: Array<{
                id: string;
                code: string;
                name: string;
            }>;
        }>;
    };
    searchParams: { [key: string]: string | string[] | undefined };
    currencyCode: string;
    averageRating?: number;
    reviewsCount?: number;
}

export function ProductInfo({
    product,
    searchParams,
    currencyCode,
    averageRating = 5.0,
    reviewsCount = 28,
}: ProductInfoProps) {
    const t = useTranslations('Product');
    const pathname = usePathname();
    const router = useRouter();
    const currentSearchParams = useSearchParams();
    const cart = useCart();
    const [isPending, startTransition] = useTransition();
    const [isAdded, setIsAdded] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);

    // Initialize selected options from URL
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
        const initialOptions: Record<string, string> = {};

        product.optionGroups.forEach((group) => {
            const paramValue = searchParams[group.code];
            if (typeof paramValue === 'string') {
                const option = group.options.find((opt) => opt.code === paramValue);
                if (option) {
                    initialOptions[group.id] = option.id;
                }
            } else if (group.options.length > 0) {
                // Default to first option if none specified
                initialOptions[group.id] = group.options[0].id;
            }
        });

        return initialOptions;
    });

    // Find the matching variant based on selected options
    const selectedVariant = useMemo(() => {
        if (product.variants.length === 1) {
            return product.variants[0];
        }

        if (Object.keys(selectedOptions).length !== product.optionGroups.length) {
            return product.variants[0] || null;
        }

        const match = product.variants.find((variant) => {
            const variantOptionIds = variant.options.map((opt) => opt.id);
            const selectedOptionIds = Object.values(selectedOptions);
            return selectedOptionIds.every((optId) => variantOptionIds.includes(optId));
        });

        return match || product.variants[0] || null;
    }, [selectedOptions, product.variants, product.optionGroups]);

    const handleOptionChange = (groupId: string, optionId: string) => {
        setSelectedOptions((prev) => ({
            ...prev,
            [groupId]: optionId,
        }));

        const group = product.optionGroups.find((g) => g.id === groupId);
        const option = group?.options.find((opt) => opt.id === optionId);

        if (group && option) {
            const params = new URLSearchParams(currentSearchParams);
            params.set(group.code, option.code);
            router.push(`${pathname}?${params.toString()}`, { scroll: false });
        }
    };

    const handleAddToCart = async () => {
        if (!selectedVariant) return;

        setIsAdded(true);
        try {
            await cart.addItem({
                variantId: selectedVariant.id,
                slug: product.slug,
                name: product.name,
                priceWithTax: selectedVariant.priceWithTax,
                sku: selectedVariant.sku,
                quantity,
            });
            toast.success(t('addedToCartMessage'), {
                description: t('addedToCartDescription', { name: product.name }),
            });
        } catch (err: any) {
            setIsAdded(false);
            toast.error(t('errorTitle'), {
                description: err?.message || t('errorAddToCart'),
            });
        } finally {
            setTimeout(() => setIsAdded(false), 2000);
        }
    };

    const handleBuyNow = async () => {
        if (!selectedVariant) return;

        try {
            await cart.addItem({
                variantId: selectedVariant.id,
                slug: product.slug,
                name: product.name,
                priceWithTax: selectedVariant.priceWithTax,
                sku: selectedVariant.sku,
                quantity,
            });
            router.push('/checkout');
        } catch (err: any) {
            toast.error(t('errorTitle'), {
                description: err?.message || t('errorAddToCart'),
            });
        }
    };

    const isExplicitOutOfStock = selectedVariant?.stockLevel === 'OUT_OF_STOCK' || selectedVariant?.stockLevel === '0';
    const numericStock = selectedVariant && !isNaN(Number(selectedVariant.stockLevel)) && Number(selectedVariant.stockLevel) > 0
        ? Number(selectedVariant.stockLevel)
        : null;
    const isLowStock = numericStock !== null && numericStock <= 5;
    const isPreOrder = isExplicitOutOfStock && Boolean(selectedVariant?.customFields?.allowPreOrder);
    const isInStock = (!isExplicitOutOfStock && selectedVariant !== null) || isPreOrder;
    const canAddToCart = Boolean(selectedVariant && (isInStock || isPreOrder));
    const maxQuantity = numericStock !== null ? numericStock : 10;

    // Clean plain-text description snippet for the buy box (full description lives in tabs)
    const cleanSnippet = useMemo(() => {
        const text = product.description.replace(/<[^>]*>?/gm, '').trim();
        return text.length > 220 ? `${text.slice(0, 220)}...` : text;
    }, [product.description]);

    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

    return (
        <div className="space-y-5 text-[#1c1b18]">
            {/* Category Micro-Tag & Stock Badge Row */}
            <div className="flex items-center justify-between gap-3">
                <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#D4A43C]">
                    Maroquinerie d’Art & Raphia
                </span>

                {isPreOrder ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-[#D4A43C]/10 text-[#D4A43C] border border-[#D4A43C]/20">
                        <Sparkles className="size-3 text-[#D4A43C]" />
                        <span>Sur Mesure / Précommande</span>
                    </span>
                ) : isExplicitOutOfStock ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                        {t('outOfStock')}
                    </span>
                ) : isLowStock ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/80">
                        <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
                        <span>Plus que {numericStock} {numericStock > 1 ? 'exemplaires en atelier' : 'exemplaire en atelier'}</span>
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]">
                        <span className="size-1.5 rounded-xs bg-[#2E7D32]" />
                        <span>{t('inStock')}</span>
                    </span>
                )}
            </div>

            {/* Product Title */}
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#1c1b18] leading-tight">
                {product.name}
            </h1>

            {/* Micro-Rating & Social Proof Row */}
            <div className="flex items-center gap-3 text-xs sm:text-sm">
                <div className="flex items-center gap-1 text-[#D4A43C]">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="size-4 fill-[#D4A43C] text-[#D4A43C]" />
                    ))}
                </div>
                <span className="font-bold text-[#1c1b18]">{Number(averageRating).toFixed(1)}</span>
                <span className="text-[#7d796f]">({reviewsCount} {reviewsCount > 1 ? 'avis' : 'avis'})</span>
            </div>

            {/* Price Display */}
            {selectedVariant && (
                <div className="pt-1">
                    <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1c1b18] tabular-nums font-mono">
                        <Price value={selectedVariant.priceWithTax} currencyCode={currencyCode} />
                    </div>
                </div>
            )}

            {/* Short Narrative Snippet */}
            <p className="text-xs sm:text-sm text-[#57544c] leading-relaxed font-sans">
                {cleanSnippet || 'Création d’exception façonnée à la main en Afrique, mariant la noblesse du raphia sauvage au cuir pleine fleur tanné aux extraits végétaux.'}
            </p>

            <Separator className="bg-[#e2ddd2]" />

            {/* Option Groups / Color Selectors */}
            {product.optionGroups.length > 0 && (
                <div className="space-y-4">
                    {product.optionGroups.map((group) => {
                        const activeOption = group.options.find((opt) => opt.id === selectedOptions[group.id]);
                        return (
                            <div key={group.id} className="space-y-2.5">
                                <div className="flex items-center justify-between text-xs font-semibold">
                                    <span className="text-[#57544c]">{group.name} :</span>
                                    {activeOption && (
                                        <span className="text-[#1c1b18] font-bold">{activeOption.name}</span>
                                    )}
                                </div>

                                <div className="flex flex-wrap gap-2.5">
                                    {group.options.map((option) => {
                                        const isSelected = selectedOptions[group.id] === option.id;
                                        return (
                                            <button
                                                key={option.id}
                                                type="button"
                                                onClick={() => handleOptionChange(group.id, option.id)}
                                                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                                    isSelected
                                                        ? 'bg-[#1D120A] text-white shadow-xs'
                                                        : 'bg-[#fbfaf7] text-[#1c1b18] hover:bg-white border border-[#e2ddd2]'
                                                }`}
                                            >
                                                {option.name}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Quantity Stepper & Dual CTAs (Matching ff98ca... reference) */}
            <div className="pt-2 space-y-3">
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
                    {/* Stepper [-] 1 [+] in rounded-full pill */}
                    <div className="inline-flex items-center rounded-full bg-[#fbfaf7] border border-[#e2ddd2] h-12 px-3 text-[#1c1b18]">
                        <button
                            type="button"
                            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                            disabled={quantity <= 1}
                            className="size-7 rounded-full flex items-center justify-center hover:bg-white text-[#1c1b18] disabled:opacity-30 transition-colors cursor-pointer"
                            aria-label="Diminuer la quantité"
                        >
                            <Minus className="size-3.5" />
                        </button>
                        <span className="w-10 text-center font-bold text-sm tabular-nums font-mono">
                            {quantity}
                        </span>
                        <button
                            type="button"
                            onClick={() => setQuantity((q) => Math.min(maxQuantity, q + 1))}
                            disabled={quantity >= maxQuantity}
                            className="size-7 rounded-full flex items-center justify-center hover:bg-white text-[#1c1b18] disabled:opacity-30 transition-colors cursor-pointer"
                            aria-label="Augmenter la quantité"
                        >
                            <Plus className="size-3.5" />
                        </button>
                    </div>

                    {/* Primary CTA: Add To Cart / Pre-Order */}
                    <Button
                        size="lg"
                        className="flex-1 h-12 rounded-full bg-[#1c1b18] hover:bg-[#3A2418] text-[#fbfaf7] text-xs font-bold uppercase tracking-wider shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                        disabled={!canAddToCart || isPending}
                        onClick={handleAddToCart}
                    >
                        {isAdded ? (
                            <>
                                <Check className="mr-2 size-4" />
                                <span>{t('addedToCart')}</span>
                            </>
                        ) : isPreOrder ? (
                            <>
                                <Sparkles className="mr-2 size-4 text-[#D4A43C]" />
                                <span>{isPending ? t('adding') : 'Commander sur Mesure'}</span>
                            </>
                        ) : (
                            <>
                                <ShoppingCart className="mr-2 size-4" />
                                <span>{isPending ? t('adding') : t('addToCart')}</span>
                            </>
                        )}
                    </Button>

                    {/* Secondary CTA: Buy Now */}
                    <Button
                        size="lg"
                        className="h-12 px-7 rounded-full bg-[#D4A43C] hover:bg-[#c29330] text-[#1D120A] font-semibold text-xs uppercase tracking-wider shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                        disabled={!canAddToCart || isPending}
                        onClick={handleBuyNow}
                    >
                        <span>Commander</span>
                    </Button>

                    {/* Wishlist Heart Button (Rounded-full) */}
                    <button
                        type="button"
                        onClick={() => {
                            setIsWishlisted(!isWishlisted);
                            toast.success(isWishlisted ? 'Retiré de vos favoris' : 'Ajouté à vos favoris d’atelier');
                        }}
                        aria-label="Ajouter aux favoris"
                        className={`size-12 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                            isWishlisted
                                ? 'bg-rose-50 border-rose-200 text-rose-600'
                                : 'bg-[#fbfaf7] border-[#e2ddd2] text-[#1c1b18] hover:bg-white'
                        }`}
                    >
                        <Heart className={`size-5 ${isWishlisted ? 'fill-rose-600' : ''}`} />
                    </button>
                </div>

                {isPreOrder && selectedVariant?.customFields?.preOrderLeadTime && (
                    <div className="p-3.5 rounded-xl bg-[#D4A43C]/10 border border-[#D4A43C]/20 text-xs text-[#1c1b18] flex items-center gap-2.5">
                        <Sparkles className="size-4 text-[#D4A43C] shrink-0" />
                        <span><strong>Confection sur mesure :</strong> Pièce réalisée à la commande dans notre atelier sous {selectedVariant.customFields.preOrderLeadTime}.</span>
                    </div>
                )}

                {/* Direct WhatsApp Concierge Button */}
                <a
                    href={`https://wa.me/237677077594?text=${encodeURIComponent(`Bonjour Maison VAKÁA, je souhaite des conseils pour la création "${product.name}".`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-11 rounded-xl border border-[#25D366]/40 hover:border-[#25D366] bg-[#25D366]/5 hover:bg-[#25D366]/10 text-[#1B5E20] text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                    <MessageCircle className="size-4 text-[#25D366]" />
                    <span>Conseil Privé & Commande via WhatsApp</span>
                </a>
            </div>

            {/* Reassurance Strip */}
            <div className="py-2.5 px-3 rounded-xl bg-[#fbfaf7] border border-[#e2ddd2] flex items-center justify-between text-[11px] text-[#57544c] font-medium">
                <span className="flex items-center gap-1.5"><ShieldCheck className="size-3.5 text-[#D4A43C]" /> Authenticité Garantie</span>
                <span className="text-[#e2ddd2]">|</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-[#D4A43C]" /> Fait Main en Afrique</span>
                <span className="text-[#e2ddd2]">|</span>
                <span className="flex items-center gap-1.5"><Truck className="size-3.5 text-[#D4A43C]" /> Envoi Sécurisé</span>
            </div>

            <Separator className="bg-[#e2ddd2]" />

            {/* Metadata & Social Share */}
            <div className="space-y-2 text-xs text-[#57544c]">
                {selectedVariant && (
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-[#1c1b18]">SKU :</span>
                        <span className="font-mono text-[11px]">{selectedVariant.sku || 'VAK-CAB-ART-01'}</span>
                    </div>
                )}

                <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-[#1c1b18]">Tags :</span>
                    <span>Maroquinerie d’Exception, Raphia Sauvage, Fait Main, Cuir Végétal</span>
                </div>

                <div className="flex items-center gap-3 pt-1">
                    <span className="font-bold text-[#1c1b18]">Partager :</span>
                    <div className="flex items-center gap-2 text-[#57544c]">
                        <a
                            href={`https://wa.me/?text=${encodeURIComponent(`Découvrez cette création VAKÁA : ${currentUrl}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="size-7 rounded-lg bg-[#fbfaf7] border border-[#e2ddd2] hover:bg-[#25D366] hover:text-white flex items-center justify-center transition-colors"
                            aria-label="Partager sur WhatsApp"
                        >
                            <MessageCircle className="size-3.5" />
                        </a>
                        <a
                            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="size-7 rounded-lg bg-[#fbfaf7] border border-[#e2ddd2] hover:bg-[#1877F2] hover:text-white flex items-center justify-center transition-colors"
                            aria-label="Partager sur Facebook"
                        >
                            <FacebookIcon className="size-3.5" />
                        </a>
                        <a
                            href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(currentUrl)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="size-7 rounded-lg bg-[#fbfaf7] border border-[#e2ddd2] hover:bg-[#BD081C] hover:text-white flex items-center justify-center transition-colors"
                            aria-label="Partager sur Pinterest"
                        >
                            <PinterestIcon className="size-3.5" />
                        </a>
                        <a
                            href="https://instagram.com/vakaaofficial"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="size-7 rounded-lg bg-[#fbfaf7] border border-[#e2ddd2] hover:bg-[#E4405F] hover:text-white flex items-center justify-center transition-colors"
                            aria-label="Partager sur Instagram"
                        >
                            <InstagramIcon className="size-3.5" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
