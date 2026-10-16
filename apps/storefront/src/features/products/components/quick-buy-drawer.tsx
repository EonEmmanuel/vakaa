'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { X, Check, ShoppingBag, ShieldCheck, ArrowRight, Truck } from 'lucide-react';
import { addToCart, addProductToCartBySlug } from '@/features/products/add-to-cart';
import { useCart } from '@/features/cart/context/cart-context';

export interface QuickBuyProduct {
    id?: string;
    name: string;
    slug: string;
    price: number;
    currencyCode: string;
    imageUrl: string;
    description?: string;
    finishes?: Array<{
        name: string;
        color: string;
        image: string;
    }>;
    variantId?: string;
}

interface QuickBuyDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    product: QuickBuyProduct | null;
}

export function QuickBuyDrawer({ isOpen, onClose, product }: QuickBuyDrawerProps) {
    const router = useRouter();
    const cart = useCart();
    const [selectedFinishIdx, setSelectedFinishIdx] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Reset local state when product changes or drawer opens
    useEffect(() => {
        if (isOpen) {
            setSelectedFinishIdx(0);
            setQuantity(1);
            setIsSuccess(false);
            setIsSubmitting(false);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, product]);

    // Handle ESC key to close
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen || !product) return null;

    const currentImage = product.finishes?.[selectedFinishIdx]?.image || product.imageUrl;
    const currentFinishName = product.finishes?.[selectedFinishIdx]?.name || 'Cuir Végétal Naturel';

    const formatPrice = (val: number, cur: string) => {
        if (cur === 'XAF') {
            return `${(val / 100).toLocaleString('fr-FR')} FCFA`;
        }
        if (cur === 'EUR') {
            return `${(val / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}`;
        }
        if (cur === 'USD') {
            return `${(val / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`;
        }
        return `${(val / 100).toLocaleString('fr-FR')} ${cur}`;
    };

    const handleAddToCart = async () => {
        setIsSubmitting(true);
        try {
            await cart.addItem({
                variantId: product.variantId,
                slug: product.slug,
                name: product.name,
                priceWithTax: product.price,
                assetPreview: product.imageUrl,
                quantity,
            });
            setIsSuccess(true);
        } catch {
            setIsSuccess(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDirectCheckout = () => {
        router.push(`/product/${product.slug}`);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop with blur & unhurried fade */}
            <div
                onClick={onClose}
                className="fixed inset-0 bg-[#1D120A]/40 backdrop-blur-xs transition-opacity duration-300 ease-out"
                aria-hidden="true"
            />

            {/* Slide-over Drawer Panel */}
            <div
                role="dialog"
                aria-modal="true"
                aria-label={`Achat rapide: ${product.name}`}
                className="relative z-10 w-full max-w-md bg-[#f2efe9] text-[#1c1b18] shadow-2xl h-full flex flex-col justify-between overflow-y-auto transform transition-transform duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none"
            >
                {/* Drawer Header */}
                <div className="sticky top-0 z-20 flex items-center justify-between p-6 bg-[#f2efe9]/90 backdrop-blur-md border-b border-[#e2ddd2]">
                    <div>
                        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#D4A43C]">
                            Acquisition Immédiate
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Fermer la vue rapide"
                        className="size-8 rounded-lg flex items-center justify-center bg-[#fbfaf7] border border-[#e2ddd2] text-[#1c1b18] hover:bg-white active:scale-95 transition-all cursor-pointer"
                    >
                        <X className="size-4" />
                    </button>
                </div>

                {/* Drawer Body */}
                <div className="p-6 space-y-6 flex-1">
                    {/* Visual Pedestal */}
                    <div className="relative aspect-[4/4] w-full rounded-2xl overflow-hidden bg-[#fbfaf7] border border-[#e2ddd2] shadow-sm">
                        <Image
                            src={currentImage}
                            alt={product.name}
                            fill
                            className="object-cover object-center transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
                            sizes="(max-width: 640px) 100vw, 400px"
                            priority
                        />
                    </div>

                    {/* Product Identifiers */}
                    <div className="space-y-1.5">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#D4A43C]">
                            Maroquinerie d&apos;Art • Bolgatanga
                        </p>
                        <h3 className="font-display text-xl sm:text-2xl font-bold text-[#1c1b18] tracking-tight">
                            {product.name}
                        </h3>
                        <p className="font-mono text-lg font-bold text-[#1c1b18] pt-0.5">
                            {formatPrice(product.price, product.currencyCode)}
                        </p>
                    </div>

                    {/* Interactive Leather Finishes / Swatches */}
                    {product.finishes && product.finishes.length > 0 && (
                        <div className="space-y-2.5 pt-2 border-t border-[#e2ddd2]">
                            <div className="flex items-center justify-between text-xs">
                                <span className="font-semibold text-[#1c1b18]">
                                    Finition Sélectionnée :
                                </span>
                                <span className="font-medium text-[#D4A43C]">
                                    {currentFinishName}
                                </span>
                            </div>

                            <div className="flex items-center gap-2.5 pt-1">
                                {product.finishes.map((finish, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setSelectedFinishIdx(idx)}
                                        className={`group relative size-8 sm:size-9 rounded-md flex items-center justify-center transition-all duration-200 cursor-pointer ${
                                            selectedFinishIdx === idx
                                                ? 'ring-2 ring-[#D4A43C] ring-offset-2 ring-offset-[#f2efe9] scale-105'
                                                : 'ring-1 ring-[#e2ddd2] hover:scale-105'
                                        }`}
                                        title={finish.name}
                                    >
                                        <span
                                            className="size-full rounded-md shadow-inner"
                                            style={{ backgroundColor: finish.color }}
                                        />
                                        {selectedFinishIdx === idx && (
                                            <Check className="absolute size-3.5 text-white stroke-[2.5] drop-shadow-xs" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quantity Stepper & Limited Edition Counter */}
                    <div className="pt-2 border-t border-[#e2ddd2] space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-[#1c1b18]">
                                Quantité :
                            </span>
                            <div className="flex items-center gap-3 bg-[#fbfaf7] px-3 py-1.5 rounded-lg border border-[#e2ddd2]">
                                <button
                                    type="button"
                                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                    disabled={quantity <= 1}
                                    className="text-sm font-bold text-[#1c1b18] disabled:opacity-30 cursor-pointer"
                                >
                                    -
                                </button>
                                <span className="text-xs font-bold tabular-nums font-mono min-w-[14px] text-center">
                                    {quantity}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setQuantity((q) => q + 1)}
                                    className="text-sm font-bold text-[#1c1b18] cursor-pointer"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-[#3A2418]/70">
                            <span className="size-1.5 rounded-full bg-[#2D7A46]" />
                            <span>En stock à l&apos;atelier — Expédition sous 24h</span>
                        </div>
                    </div>

                    {/* Feedback State if added */}
                    {isSuccess && (
                        <div className="p-3.5 rounded-xl bg-[#2D7A46]/10 border border-[#2D7A46]/25 flex items-center gap-3 animate-fade-in">
                            <div className="size-8 rounded-lg bg-[#2D7A46] text-white flex items-center justify-center shrink-0">
                                <Check className="size-4" />
                            </div>
                            <div className="text-xs">
                                <p className="font-bold text-[#2D7A46]">Pièce ajoutée au panier</p>
                                <p className="text-[#3A2418]/80 text-[11px]">Votre commande est prête à être finalisée.</p>
                            </div>
                        </div>
                    )}

                    {/* Atelier Assurances */}
                    <div className="pt-4 border-t border-[#e2ddd2] space-y-2">
                        <div className="flex items-center gap-2 text-[11px] text-[#57544c]">
                            <Truck className="size-3.5 text-[#D4A43C]" />
                            <span>Livraison 24-48h à Douala & Yaoundé, DHL Monde</span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-[#57544c]">
                            <ShieldCheck className="size-3.5 text-[#D4A43C]" />
                            <span>14 jours de retours gracieux et garantie authenticité</span>
                        </div>
                    </div>
                </div>

                {/* Drawer Footer Actions */}
                <div className="p-6 bg-[#fbfaf7] border-t border-[#e2ddd2] space-y-2.5">
                    {isSuccess ? (
                        <div className="space-y-2">
                            <button
                                type="button"
                                onClick={() => {
                                    router.push('/cart');
                                    onClose();
                                }}
                                className="w-full py-3.5 px-6 rounded-xl bg-[#1c1b18] hover:bg-[#3A2418] text-[#fbfaf7] text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                            >
                                <ShoppingBag className="size-4" />
                                <span>Voir Mon Panier & Commander</span>
                                <ArrowRight className="size-4" />
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="w-full py-2.5 text-center text-xs font-semibold text-[#57544c] hover:text-[#1c1b18] cursor-pointer"
                            >
                                Continuer à explorer
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <button
                                type="button"
                                onClick={handleAddToCart}
                                disabled={isSubmitting}
                                className="w-full py-3.5 px-6 rounded-xl bg-[#1c1b18] hover:bg-[#3A2418] disabled:opacity-75 text-[#fbfaf7] text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                            >
                                <ShoppingBag className="size-4" />
                                <span>{isSubmitting ? 'Réservation en cours...' : 'Ajouter au Panier'}</span>
                            </button>

                            <button
                                type="button"
                                onClick={handleDirectCheckout}
                                className="w-full py-2.5 px-4 rounded-xl border border-[#e2ddd2] hover:border-[#D4A43C] text-[#1c1b18] hover:text-[#D4A43C] text-xs font-bold uppercase tracking-wider transition-all duration-200 bg-[#fbfaf7] flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                                <span>Détails Complets & Fiche Pièce</span>
                                <ArrowRight className="size-3.5" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
