'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, ArrowRight, Trash2, Minus, Plus, Tag, Check, Loader2 } from 'lucide-react';
import { Link } from '@/platform/i18n/navigation';
import { useCart, EMPTY_CART } from '../context/cart-context';
import { Price } from '@/features/pricing/price';
import { normalizeAssetUrl } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { useLenis } from '@/lib/motion/lenis-provider';
import { toast } from 'sonner';
import { TRANSPARENT_LOCAL_IMAGES } from '@/features/products/components/product-card';

// Free shipping threshold (100,000 XAF in minor units)
const FREE_SHIPPING_THRESHOLD = 10000000;

export function CartDrawer() {
    const t = useTranslations('Cart');
    const { isOpen, closeCart, order, removeItem, updateQuantity, totalQuantity, applyCoupon, removeCoupon } = useCart();
    const lenis = useLenis();
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    const [couponInput, setCouponInput] = useState('');
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

    const currentOrder = order || EMPTY_CART;
    const subtotal = currentOrder.subTotalWithTax || 0;
    const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
    const amountRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
    const currencyCode = currentOrder.currencyCode || 'XAF';

    // Handle Escape key to close
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                closeCart();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, closeCart]);

    // Prevent body background scrolling and pause Lenis when drawer is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            lenis?.stop();
            closeButtonRef.current?.focus();
        } else {
            document.body.style.overflow = '';
            lenis?.start();
        }
        return () => {
            document.body.style.overflow = '';
            lenis?.start();
        };
    }, [isOpen, lenis]);

    const handleApplyCoupon = async (e: React.FormEvent) => {
        e.preventDefault();
        const code = couponInput.trim();
        if (!code) return;

        try {
            setIsApplyingCoupon(true);
            const res = await applyCoupon(code);
            if (res.success) {
                toast.success('Code promo appliqué avec succès !');
                setCouponInput('');
            } else {
                toast.error(res.error || 'Code promo invalide');
            }
        } catch {
            toast.error('Erreur lors de l’application du code');
        } finally {
            setIsApplyingCoupon(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label={t('shoppingCart')}>
                    {/* Backdrop Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                        onClick={closeCart}
                        className="fixed inset-0 bg-[#1c1b18]/40 dark:bg-black/60 backdrop-blur-xs cursor-pointer"
                        aria-hidden="true"
                    />

                    {/* Floating Curved Island Drawer (Exact KVIST layout) */}
                    <motion.aside
                        className="absolute inset-y-2 right-2 flex w-[min(440px,calc(100vw-16px))] flex-col overflow-hidden rounded-[28px] bg-[#fbfaf7] dark:bg-[#1a1917] shadow-lift border border-[#e2ddd2]/70 dark:border-white/10"
                        initial={{ x: '108%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '108%' }}
                        transition={{ type: 'spring', stiffness: 260, damping: 32 }}
                    >
                        {/* Drawer Header */}
                        <header className="flex items-center justify-between px-5 pb-4 pt-5 sm:px-6 sm:pt-6">
                            <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-[#1c1b18] dark:text-[#fbfaf7]">
                                {t('shoppingCart')}{' '}
                                <span className="text-[#7d796f] dark:text-[#7d796f] font-normal">
                                    ({totalQuantity})
                                </span>
                            </h2>
                            <button
                                ref={closeButtonRef}
                                type="button"
                                onClick={closeCart}
                                className="grid size-11 place-items-center rounded-full bg-[#f2efe9] dark:bg-[#252320] text-[#1c1b18] dark:text-[#fbfaf7] transition-transform duration-300 hover:rotate-90 cursor-pointer"
                                aria-label={t('dismiss')}
                            >
                                <X className="size-5" />
                            </button>
                        </header>

                        {/* Free Delivery Progress Tracker */}
                        {currentOrder.lines.length > 0 && (
                            <div className="mx-5 sm:mx-6 mb-3 rounded-2xl bg-[#f2efe9] dark:bg-[#22201d] p-3.5">
                                <p className="text-[13px] text-[#57544c] dark:text-[#a6a29a]">
                                    {isFreeShipping ? (
                                        <strong className="text-[#2e7d32] dark:text-[#81c784] font-semibold">
                                            {t('freeShippingUnlocked')}
                                        </strong>
                                    ) : (
                                        <>
                                            Plus que{' '}
                                            <strong className="text-[#1c1b18] dark:text-[#fbfaf7]">
                                                <Price value={amountRemaining} currencyCode={currencyCode} />
                                            </strong>{' '}
                                            pour la livraison offerte
                                        </>
                                    )}
                                </p>
                                <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-[#e2ddd2] dark:bg-white/10">
                                    <motion.div
                                        className="h-full origin-left rounded-full bg-[#1c1b18] dark:bg-[#fbfaf7]"
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: Math.min(1, subtotal / FREE_SHIPPING_THRESHOLD) }}
                                        transition={{ type: 'spring', stiffness: 120, damping: 22 }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Drawer Body / Scrollable Content with data-lenis-prevent */}
                        <div data-lenis-prevent className="min-h-0 flex-1 overflow-y-auto px-5 sm:px-6 space-y-3">
                            {currentOrder.lines.length === 0 ? (
                                <motion.div
                                    className="grid h-full place-items-center py-16 text-center"
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.15 }}
                                >
                                    <div>
                                        <motion.div
                                            className="mx-auto grid size-20 place-items-center rounded-full bg-[#f2efe9] dark:bg-[#22201d]"
                                            animate={{ y: [0, -8, 0] }}
                                            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                                        >
                                            <ShoppingBag className="size-8 text-[#7d796f]" />
                                        </motion.div>
                                        <p className="mt-5 font-display text-2xl font-semibold text-[#1c1b18] dark:text-[#fbfaf7]">
                                            {t('empty')}
                                        </p>
                                        <p className="mt-1 text-[13px] text-[#57544c] dark:text-[#a6a29a]">
                                            Prenez le temps de choisir vos pièces d&apos;exception.
                                        </p>
                                        <Link
                                            href="/search"
                                            onClick={closeCart}
                                            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#1c1b18] dark:bg-[#fbfaf7] text-[#fbfaf7] dark:text-[#1c1b18] px-6 py-2.5 text-[13px] font-medium hover:bg-[#D4A43C] hover:text-[#1D120A] transition-colors"
                                        >
                                            {t('emptyCta')}
                                        </Link>
                                    </div>
                                </motion.div>
                            ) : (
                                <>
                                    <motion.ul layout className="space-y-3 pb-1">
                                        <AnimatePresence initial={false}>
                                            {currentOrder.lines.map((line, idx) => {
                                                const slug = line.productVariant.product.slug;
                                                const transparentImg = slug ? TRANSPARENT_LOCAL_IMAGES[slug] : null;
                                                const assetUrl = transparentImg || normalizeAssetUrl(
                                                    line.productVariant.product.featuredAsset?.preview
                                                ) || '/images/bags/maa-tote-transparent.png';

                                                return (
                                                    <motion.li
                                                        layout
                                                        key={line.id}
                                                        initial={{ opacity: 0, x: 40 }}
                                                        animate={{
                                                            opacity: 1,
                                                            x: 0,
                                                            transition: { delay: 0.08 + idx * 0.04, type: 'spring', stiffness: 300, damping: 30 },
                                                        }}
                                                        exit={{ opacity: 0, x: 60, transition: { duration: 0.25 } }}
                                                        className="flex gap-4 rounded-2xl bg-[#f2efe9] dark:bg-[#22201d] p-3"
                                                    >
                                                        {/* Thumbnail */}
                                                        <div className="grid size-22 shrink-0 place-items-center rounded-xl bg-[#fbfaf7] dark:bg-[#1a1917] p-1.5 overflow-hidden border border-[#e2ddd2]/50 dark:border-white/5">
                                                            <Image
                                                                src={assetUrl}
                                                                alt={line.productVariant.name}
                                                                width={80}
                                                                height={80}
                                                                className="size-full object-contain"
                                                            />
                                                        </div>

                                                        {/* Line Details */}
                                                        <div className="flex min-w-0 flex-1 flex-col">
                                                            <div className="flex items-start justify-between gap-2">
                                                                <div className="min-w-0">
                                                                    <p className="truncate font-medium text-[15px] text-[#1c1b18] dark:text-[#fbfaf7]">
                                                                        {line.productVariant.product.name}
                                                                    </p>
                                                                    {line.productVariant.name !== line.productVariant.product.name && (
                                                                        <p className="text-[12px] text-[#7d796f] truncate mt-0.5">
                                                                            {line.productVariant.name}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeItem(line.id)}
                                                                    className="grid size-8 shrink-0 place-items-center rounded-full text-[#7d796f] hover:bg-white dark:hover:bg-white/10 hover:text-red-500 transition-colors cursor-pointer"
                                                                    aria-label={t('remove')}
                                                                >
                                                                    <Trash2 className="size-4" />
                                                                </button>
                                                            </div>

                                                            <div className="mt-auto flex items-center justify-between pt-2">
                                                                {/* Quantity Pill matching KVIST */}
                                                                <div className="flex items-center rounded-full bg-[#fbfaf7] dark:bg-[#1a1917] ring-1 ring-[#e2ddd2]/80 dark:ring-white/10">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => updateQuantity(line.id, line.quantity - 1)}
                                                                        className="grid size-8 place-items-center text-[#57544c] hover:text-[#1c1b18] dark:hover:text-white cursor-pointer"
                                                                        aria-label={t('decreaseQuantity')}
                                                                    >
                                                                        <Minus className="size-3.5" />
                                                                    </button>
                                                                    <span className="w-6 text-center text-xs font-semibold tabular text-[#1c1b18] dark:text-[#fbfaf7]">
                                                                        {line.quantity}
                                                                    </span>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => updateQuantity(line.id, line.quantity + 1)}
                                                                        className="grid size-8 place-items-center text-[#57544c] hover:text-[#1c1b18] dark:hover:text-white cursor-pointer"
                                                                        aria-label={t('increaseQuantity')}
                                                                    >
                                                                        <Plus className="size-3.5" />
                                                                    </button>
                                                                </div>

                                                                <span className="font-semibold text-[15px] tabular text-[#1c1b18] dark:text-[#fbfaf7]">
                                                                    <Price
                                                                        value={line.linePriceWithTax}
                                                                        currencyCode={currencyCode}
                                                                    />
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </motion.li>
                                                );
                                            })}
                                        </AnimatePresence>
                                    </motion.ul>

                                    {/* ═══ Coupon Code Area (Requested by User) ═══ */}
                                    <div className="rounded-2xl bg-[#f2efe9] dark:bg-[#22201d] p-3.5 border border-[#e2ddd2]/60 dark:border-white/5">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="flex items-center gap-1.5 text-xs font-semibold text-[#1c1b18] dark:text-[#fbfaf7]">
                                                <Tag className="size-3.5 text-[#D4A43C]" />
                                                {t('enterCode')}
                                            </span>
                                        </div>

                                        <form onSubmit={handleApplyCoupon} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={couponInput}
                                                onChange={(e) => setCouponInput(e.target.value)}
                                                placeholder="Ex: VAKAA10, PRIVILEGE"
                                                className="flex-1 bg-[#fbfaf7] dark:bg-[#1a1917] rounded-full px-3.5 py-2 text-xs text-[#1c1b18] dark:text-[#fbfaf7] placeholder:text-[#7d796f] ring-1 ring-[#e2ddd2]/80 dark:ring-white/10 focus:outline-none focus:ring-2 focus:ring-[#D4A43C]"
                                            />
                                            <button
                                                type="submit"
                                                disabled={isApplyingCoupon || !couponInput.trim()}
                                                className="px-4 py-2 rounded-full bg-[#1c1b18] text-[#fbfaf7] dark:bg-[#fbfaf7] dark:text-[#1c1b18] text-xs font-semibold hover:bg-[#D4A43C] hover:text-[#1D120A] disabled:opacity-40 transition-colors cursor-pointer"
                                            >
                                                {isApplyingCoupon ? <Loader2 className="size-3.5 animate-spin" /> : t('apply')}
                                            </button>
                                        </form>

                                        {/* Applied Coupon Tags */}
                                        {currentOrder.couponCodes && currentOrder.couponCodes.length > 0 && (
                                            <div className="mt-2.5 flex flex-wrap gap-1.5">
                                                {currentOrder.couponCodes.map((code) => (
                                                    <span
                                                        key={code}
                                                        className="inline-flex items-center gap-1 rounded-full bg-[#2e7d32]/10 dark:bg-[#81c784]/15 px-2.5 py-1 text-[11px] font-semibold text-[#2e7d32] dark:text-[#81c784]"
                                                    >
                                                        <Check className="size-3" />
                                                        {code}
                                                        <button
                                                            type="button"
                                                            onClick={() => removeCoupon(code)}
                                                            className="ml-1 hover:text-red-500 cursor-pointer"
                                                            aria-label={`Supprimer le code ${code}`}
                                                        >
                                                            <X className="size-3" />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Drawer Footer (Exact KVIST layout) */}
                        {currentOrder.lines.length > 0 && (
                            <footer className="border-t border-[#e2ddd2]/80 dark:border-white/10 p-5 sm:p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] bg-[#fbfaf7] dark:bg-[#1a1917]">
                                {/* Discount row if active */}
                                {currentOrder.discounts && currentOrder.discounts.length > 0 && (
                                    <div className="mb-2 flex items-center justify-between text-xs text-[#2e7d32] dark:text-[#81c784]">
                                        <span>{t('discount')}</span>
                                        <span className="font-semibold tabular">
                                            - <Price value={currentOrder.discounts.reduce((acc, d) => acc + d.amountWithTax, 0)} currencyCode={currencyCode} />
                                        </span>
                                    </div>
                                )}

                                <div className="mb-4 flex items-end justify-between">
                                    <span className="text-[14px] text-[#57544c] dark:text-[#a6a29a]">
                                        {t('subtotal')}
                                    </span>
                                    <span className="font-display text-2xl sm:text-3xl font-semibold tracking-tight tabular text-[#1c1b18] dark:text-[#fbfaf7]">
                                        <Price
                                            value={currentOrder.totalWithTax || subtotal}
                                            currencyCode={currencyCode}
                                        />
                                    </span>
                                </div>

                                <Link
                                    href="/checkout"
                                    onClick={closeCart}
                                    className="group flex w-full items-center justify-center gap-2 rounded-full bg-[#1c1b18] text-[#fbfaf7] dark:bg-[#fbfaf7] dark:text-[#1c1b18] py-4 text-[15px] font-medium shadow-tile hover:bg-[#D4A43C] hover:text-[#1D120A] dark:hover:bg-[#D4A43C] dark:hover:text-[#1D120A] transition-colors cursor-pointer"
                                >
                                    <span>{t('checkout')}</span>
                                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                                </Link>

                                <div className="mt-3 flex items-center justify-center gap-3 text-[11px] text-[#7d796f]">
                                    <span>Paiement sécurisé chiffré</span>
                                    <span>•</span>
                                    <span>Expédié sous 48h</span>
                                </div>
                            </footer>
                        )}
                    </motion.aside>
                </div>
            )}
        </AnimatePresence>
    );
}
