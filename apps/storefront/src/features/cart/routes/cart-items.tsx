'use client';

import Image from 'next/image';
import { normalizeAssetUrl } from '@/lib/utils';
import { Link } from '@/platform/i18n/navigation';
import { X, ShoppingBag, Tag } from 'lucide-react';
import { Price } from '@/features/pricing/price';
import { removePromotionCode } from './actions';
import { useTranslations } from 'next-intl';
import { PromotionCodeForm } from './promotion-code-form';
import { CartItemQuantity } from './cart-item-quantity';
import { useCart, type CartOrder, EMPTY_CART } from '../context/cart-context';
import { motion, AnimatePresence } from 'framer-motion';

export function CartItems({ activeOrder: initialOrder }: { activeOrder: CartOrder | null }) {
    const t = useTranslations('Cart');
    const { order, removeItem, clearCart, error, clearError, isInitialized } = useCart();

    const currentOrder = isInitialized ? (order || EMPTY_CART) : (order || initialOrder || EMPTY_CART);

    if (!currentOrder || currentOrder.lines.length === 0) {
        return (
            <div className="space-y-4">
                {error && (
                    <div role="alert" className="flex items-center justify-between gap-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950">
                        <span>{t('syncError')}</span>
                        <button type="button" onClick={clearError} className="shrink-0 font-semibold underline underline-offset-2">
                            {t('dismiss')}
                        </button>
                    </div>
                )}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
                    className="py-16 sm:py-24 text-center bg-[#fbfaf7] dark:bg-[#1c1b19] rounded-3xl border border-[#e2ddd2] dark:border-[#2e2c28] p-8 shadow-xs"
                >
                    <div className="size-20 sm:size-24 rounded-full bg-[#ebe2d4] dark:bg-[#272522] flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag className="w-9 sm:w-11 h-9 sm:h-11 text-[#D4A43C]" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#1c1b18] dark:text-[#fbfaf7] mb-3">
                        {t('empty')}
                    </h2>
                    <p className="text-sm sm:text-base text-[#57544c] dark:text-[#a6a29a] max-w-md mx-auto mb-8 leading-relaxed">
                        {t('emptyMessage')}
                    </p>
                    <Link
                        href="/search"
                        className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-[#1D120A] hover:bg-[#3A2418] text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-sm active:scale-[0.98]"
                    >
                        {t('emptyCta')}
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="space-y-6" aria-live="polite" aria-atomic="false" aria-label={t('cartItems')}>
            {error && (
                <div role="alert" className="flex items-center justify-between gap-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950">
                    <span>{t('syncError')}</span>
                    <button type="button" onClick={clearError} className="shrink-0 font-semibold underline underline-offset-2">
                        {t('dismiss')}
                    </button>
                </div>
            )}
            {/* Table Header Bar (KVIST Luxury Styling) */}
            <div className="hidden sm:grid grid-cols-12 items-center bg-[#1c1b18] dark:bg-[#151413] text-[#fbfaf7] font-semibold text-xs tracking-wider px-6 py-3.5 rounded-xl border border-[#e2ddd2] dark:border-[#2e2c28] shadow-xs">
                <span className="col-span-6">{t('product')}</span>
                <span className="col-span-2 text-center">{t('price')}</span>
                <span className="col-span-2 text-center">{t('quantity')}</span>
                <span className="col-span-2 text-right">{t('subtotal')}</span>
            </div>

            {/* Line Items List with AnimatePresence */}
            <div
                className="bg-[#fbfaf7] dark:bg-[#1c1b19] rounded-2xl border border-[#e2ddd2] dark:border-[#2e2c28] divide-y divide-[#e2ddd2] dark:divide-[#2e2c28] overflow-hidden shadow-xs"
                role="list"
                aria-label={t('cartItems')}
            >
                <AnimatePresence mode="popLayout" initial={false}>
                    {currentOrder.lines.map((line) => (
                        <motion.div
                            key={line.id}
                            layout
                            initial={{ opacity: 1, height: 'auto', y: 0 }}
                            exit={{
                                opacity: 0,
                                height: 0,
                                y: -16,
                                overflow: 'hidden',
                                transition: {
                                    opacity: { duration: 0.18 },
                                    height: { duration: 0.28, ease: [0.32, 0.72, 0, 1] },
                                    y: { duration: 0.18 },
                                },
                            }}
                            className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-12 items-center gap-4 hover:bg-[#ebe2d4]/30 dark:hover:bg-[#272522]/30 transition-colors"
                            role="listitem"
                        >
                            {/* Col 1: Remove + Image Pedestal + Product Title / Variant */}
                            <div className="sm:col-span-6 flex items-center gap-3 sm:gap-4">
                                {/* Remove button (0ms instant optimistic removal) */}
                                <button
                                    type="button"
                                    onClick={() => removeItem(line.id)}
                                    className="p-1 text-[#7d796f] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-full transition-colors cursor-pointer"
                                    title={t('remove')}
                                    aria-label={`${t('remove')} ${line.productVariant.product.name}`}
                                >
                                    <X className="w-4 h-4" />
                                </button>

                                {/* Studio Pedestal Thumbnail */}
                                {line.productVariant.product.featuredAsset ? (
                                    <Link
                                        href={`/product/${line.productVariant.product.slug}`}
                                        className="size-20 sm:size-24 rounded-2xl bg-[#ebe2d4] dark:bg-[#272522] p-2 flex items-center justify-center shrink-0 border border-[#e2ddd2] dark:border-[#2e2c28] group hover:border-[#D4A43C]/50 transition-colors"
                                    >
                                        <Image
                                            src={normalizeAssetUrl(line.productVariant.product.featuredAsset.preview)}
                                            alt={line.productVariant.name}
                                            width={96}
                                            height={96}
                                            className="object-contain w-full h-full mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </Link>
                                ) : (
                                    <div className="size-20 sm:size-24 rounded-2xl bg-[#ebe2d4] dark:bg-[#272522] flex items-center justify-center shrink-0 border border-[#e2ddd2] dark:border-[#2e2c28]">
                                        <ShoppingBag className="w-6 h-6 text-[#7d796f]" />
                                    </div>
                                )}

                                {/* Text Metadata */}
                                <div className="min-w-0 flex-1">
                                    <Link
                                        href={`/product/${line.productVariant.product.slug}`}
                                        className="font-semibold text-sm sm:text-base text-[#1c1b18] dark:text-[#fbfaf7] hover:text-[#D4A43C] transition-colors line-clamp-2"
                                    >
                                        {line.productVariant.product.name}
                                    </Link>
                                    {line.productVariant.name !== line.productVariant.product.name && (
                                        <p className="text-xs text-[#57544c] dark:text-[#a6a29a] mt-0.5 line-clamp-1">
                                            {line.productVariant.name}
                                        </p>
                                    )}
                                    <p className="text-[11px] text-[#7d796f] mt-0.5">
                                        {t('sku', { sku: line.productVariant.sku })}
                                    </p>

                                    {/* Mobile Only: Price row */}
                                    <div className="flex sm:hidden items-center justify-between mt-2 pt-2 border-t border-[#e2ddd2] dark:border-[#2e2c28]">
                                        <div className="text-xs text-[#57544c]">
                                            <Price value={line.unitPriceWithTax} currencyCode={currentOrder.currencyCode} />
                                        </div>
                                        <div className="font-bold text-sm text-[#1c1b18] dark:text-[#fbfaf7]">
                                            <Price value={line.linePriceWithTax} currencyCode={currentOrder.currencyCode} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Col 2: Unit Price (Desktop) */}
                            <div className="hidden sm:block sm:col-span-2 text-center text-sm font-medium text-[#57544c] dark:text-[#a6a29a]">
                                <Price value={line.unitPriceWithTax} currencyCode={currentOrder.currencyCode} />
                            </div>

                            {/* Col 3: Tactile Quantity Stepper (0ms instant update) */}
                            <div className="sm:col-span-2 flex justify-start sm:justify-center">
                                <CartItemQuantity
                                    lineId={line.id}
                                    initialQuantity={line.quantity}
                                    productName={line.productVariant.product.name}
                                />
                            </div>

                            {/* Col 4: Line Subtotal (Desktop) */}
                            <div className="hidden sm:block sm:col-span-2 text-right font-bold text-sm sm:text-base text-[#1c1b18] dark:text-[#fbfaf7] tabular-nums">
                                <Price value={line.linePriceWithTax} currencyCode={currentOrder.currencyCode} />
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Active Coupon Codes Chips */}
            {currentOrder.couponCodes && currentOrder.couponCodes.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-1" aria-label={t('activePromotions')}>
                    {currentOrder.couponCodes.map((code) => (
                        <div
                            key={code}
                            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs font-medium text-emerald-800 dark:text-emerald-300"
                        >
                            <Tag className="w-3.5 h-3.5" />
                            <span>{code}</span>
                            <form action={removePromotionCode} className="inline-flex">
                                <input type="hidden" name="code" value={code} />
                                <button
                                    type="submit"
                                    className="p-0.5 hover:text-red-600 rounded-full transition-colors cursor-pointer"
                                    title={t('remove')}
                                    aria-label={`${t('remove')} ${code}`}
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </form>
                        </div>
                    ))}
                </div>
            )}

            {/* Bottom Row: Coupon Input Form + Clear Shopping Cart Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div className="w-full sm:w-auto">
                    <PromotionCodeForm />
                </div>

                <button
                    type="button"
                    onClick={() => clearCart()}
                    className="text-xs sm:text-sm font-medium text-[#7d796f] hover:text-[#1c1b18] dark:hover:text-white underline underline-offset-4 decoration-[#e2ddd2] hover:decoration-[#1c1b18] transition-colors cursor-pointer"
                >
                    {t('clearCart')}
                </button>
            </div>
        </div>
    );
}
