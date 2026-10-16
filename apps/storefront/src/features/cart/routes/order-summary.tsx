'use client';

import { Link } from '@/platform/i18n/navigation';
import { Lock, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { Price } from '@/features/pricing/price';
import { useTranslations } from 'next-intl';
import { useCart, type CartOrder, EMPTY_CART } from '../context/cart-context';

export function OrderSummary({ activeOrder: initialOrder }: { activeOrder: CartOrder }) {
    const t = useTranslations('Cart');
    const { order, isInitialized } = useCart();

    const currentOrder = isInitialized ? (order || EMPTY_CART) : (order || initialOrder || EMPTY_CART);
    const totalItemCount = currentOrder.lines.reduce((acc, l) => acc + l.quantity, 0);

    return (
        <div className="bg-[#fbfaf7] dark:bg-[#1c1b19] rounded-2xl border border-[#e2ddd2] dark:border-[#2e2c28] p-6 sm:p-7 shadow-[0_4px_24px_rgba(28,27,24,0.03)] sticky top-28 space-y-6">
            <h2 className="font-display text-xl font-bold text-[#1c1b18] dark:text-[#fbfaf7] tracking-tight">
                {t('orderSummary')}
            </h2>

            <div className="space-y-3.5 text-sm">
                {/* Items Count */}
                <div className="flex justify-between items-center text-[#57544c] dark:text-[#a6a29a]">
                    <span>{t('items')}</span>
                    <span className="font-medium text-[#1c1b18] dark:text-[#fbfaf7] tabular-nums">
                        {totalItemCount}
                    </span>
                </div>

                {/* Sub Total */}
                <div className="flex justify-between items-center text-[#57544c] dark:text-[#a6a29a]">
                    <span>{t('subtotal')}</span>
                    <span className="font-semibold text-[#1c1b18] dark:text-[#fbfaf7] tabular-nums">
                        <Price value={currentOrder.subTotalWithTax} currencyCode={currentOrder.currencyCode} />
                    </span>
                </div>

                {/* Shipping */}
                <div className="flex justify-between items-center text-[#57544c] dark:text-[#a6a29a]">
                    <span>{t('shipping')}</span>
                    <span className="text-[#1c1b18] dark:text-[#fbfaf7]">
                        {currentOrder.shippingWithTax > 0 ? (
                            <Price value={currentOrder.shippingWithTax} currencyCode={currentOrder.currencyCode} />
                        ) : (
                            <span className="text-xs text-[#7d796f] italic">{t('calculatedAtCheckout')}</span>
                        )}
                    </span>
                </div>

                {/* Discounts */}
                {currentOrder.discounts && currentOrder.discounts.length > 0 && (
                    <>
                        {currentOrder.discounts.map((discount, index) => (
                            <div key={index} className="flex justify-between items-center text-emerald-600 dark:text-emerald-400">
                                <span>{discount.description || t('discount')}</span>
                                <span className="font-semibold">
                                    -<Price value={discount.amountWithTax} currencyCode={currentOrder.currencyCode} />
                                </span>
                            </div>
                        ))}
                    </>
                )}

                {/* Divider */}
                <div className="border-t border-[#e2ddd2] dark:border-[#2e2c28] pt-3.5">
                    <div className="flex justify-between items-baseline">
                        <span className="text-base font-bold text-[#1c1b18] dark:text-[#fbfaf7]">
                            {t('total')}
                        </span>
                        <span className="text-2xl font-bold text-[#1c1b18] dark:text-white tabular-nums">
                            <Price value={currentOrder.totalWithTax} currencyCode={currentOrder.currencyCode} />
                        </span>
                    </div>
                    <p className="text-[11px] text-[#7d796f] text-right mt-1">
                        {t('settlementNote', { currency: currentOrder.currencyCode || 'XAF' })}
                    </p>
                </div>
            </div>

            {/* Primary Action Button */}
            <Link
                href="/checkout"
                className="w-full h-12 flex items-center justify-center rounded-full bg-[#1D120A] hover:bg-[#3A2418] text-white text-xs font-bold tracking-wider uppercase transition-all shadow-sm active:scale-[0.99] cursor-pointer"
            >
                {t('proceedToCheckout')}
            </Link>

            {/* Secondary Action: Continue Shopping */}
            <Link
                href="/search"
                className="w-full h-10 flex items-center justify-center rounded-full border border-[#e2ddd2] dark:border-[#2e2c28] hover:bg-[#ebe2d4]/50 dark:hover:bg-[#272522] text-[#57544c] dark:text-[#a6a29a] text-xs font-medium transition-all"
            >
                {t('continueShopping')}
            </Link>

            {/* Reassurance Badges */}
            <div className="pt-4 border-t border-[#e2ddd2] dark:border-[#2e2c28] space-y-2.5 text-[11px] text-[#57544c] dark:text-[#a6a29a]">
                <div className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-[#D4A43C] shrink-0" />
                    <span>{t('secureCheckout')}</span>
                </div>
                <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#D4A43C] shrink-0" />
                    <span>{t('mobileMoneyCards')}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Truck className="w-3.5 h-3.5 text-[#D4A43C] shrink-0" />
                    <span>{t('expressDeliveryTracking')}</span>
                </div>
                <div className="flex items-center gap-2">
                    <RotateCcw className="w-3.5 h-3.5 text-[#D4A43C] shrink-0" />
                    <span>{t('easyReturns')}</span>
                </div>
            </div>
        </div>
    );
}
