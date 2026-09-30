import { Link } from '@/platform/i18n/navigation';
import { Lock, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { Price } from '@/features/pricing/price';
import { getTranslations } from 'next-intl/server';

type ActiveOrder = {
    id: string;
    currencyCode: string;
    subTotalWithTax: number;
    shippingWithTax: number;
    totalWithTax: number;
    lines: Array<{ quantity: number }>;
    discounts?: Array<{
        description: string;
        amountWithTax: number;
    }> | null;
};

export async function OrderSummary({ activeOrder }: { activeOrder: ActiveOrder }) {
    const t = await getTranslations('Cart');
    const totalItemCount = activeOrder.lines.reduce((acc, l) => acc + l.quantity, 0);

    return (
        <div className="bg-white dark:bg-[#1A120B] rounded-2xl border border-stone-200/80 dark:border-stone-800 p-6 sm:p-7 shadow-xs sticky top-28 space-y-6">
            <h2 className="font-sans text-xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
                {t('orderSummary')}
            </h2>

            <div className="space-y-3.5 text-sm">
                {/* Items Count */}
                <div className="flex justify-between items-center text-stone-600 dark:text-stone-400">
                    <span>{t('items')}</span>
                    <span className="font-medium text-stone-900 dark:text-stone-200 tabular-nums">
                        {totalItemCount}
                    </span>
                </div>

                {/* Sub Total */}
                <div className="flex justify-between items-center text-stone-600 dark:text-stone-400">
                    <span>{t('subtotal')}</span>
                    <span className="font-semibold text-stone-900 dark:text-stone-200">
                        <Price value={activeOrder.subTotalWithTax} currencyCode={activeOrder.currencyCode} />
                    </span>
                </div>

                {/* Shipping */}
                <div className="flex justify-between items-center text-stone-600 dark:text-stone-400">
                    <span>{t('shipping')}</span>
                    <span className="text-stone-900 dark:text-stone-200">
                        {activeOrder.shippingWithTax > 0 ? (
                            <Price value={activeOrder.shippingWithTax} currencyCode={activeOrder.currencyCode} />
                        ) : (
                            <span className="text-xs text-stone-500 italic">{t('calculatedAtCheckout')}</span>
                        )}
                    </span>
                </div>

                {/* Discounts */}
                {activeOrder.discounts && activeOrder.discounts.length > 0 && (
                    <>
                        {activeOrder.discounts.map((discount, index) => (
                            <div key={index} className="flex justify-between items-center text-emerald-600 dark:text-emerald-400">
                                <span>{discount.description || t('discount')}</span>
                                <span className="font-semibold">
                                    -<Price value={discount.amountWithTax} currencyCode={activeOrder.currencyCode} />
                                </span>
                            </div>
                        ))}
                    </>
                )}

                {/* Divider */}
                <div className="border-t border-stone-200/80 dark:border-stone-800 pt-3.5">
                    <div className="flex justify-between items-baseline">
                        <span className="text-base font-bold text-stone-900 dark:text-stone-100">
                            {t('total')}
                        </span>
                        <span className="text-2xl font-bold text-stone-950 dark:text-white tabular-nums">
                            <Price value={activeOrder.totalWithTax} currencyCode={activeOrder.currencyCode} />
                        </span>
                    </div>
                    <p className="text-[11px] text-stone-400 dark:text-stone-500 text-right mt-1">
                        Règlement sécurisé en {activeOrder.currencyCode || 'XAF'}
                    </p>
                </div>
            </div>

            {/* Primary Action Button */}
            <Link
                href="/checkout"
                className="w-full h-12 flex items-center justify-center rounded-full bg-[#1B3B2B] hover:bg-[#152e22] text-white text-sm font-semibold tracking-wide transition-all shadow-sm active:scale-[0.99] cursor-pointer"
            >
                {t('proceedToCheckout')}
            </Link>

            {/* Secondary Action: Continue Shopping */}
            <Link
                href="/search"
                className="w-full h-10 flex items-center justify-center rounded-full border border-stone-300 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-medium transition-all"
            >
                {t('continueShopping')}
            </Link>

            {/* Reassurance Badges */}
            <div className="pt-4 border-t border-stone-200/70 dark:border-stone-800 space-y-2.5 text-[11px] text-stone-600 dark:text-stone-400">
                <div className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-[#A66B2D] shrink-0" />
                    <span>{t('secureCheckout')}</span>
                </div>
                <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#A66B2D] shrink-0" />
                    <span>Paiements Mobile Money & Cartes bancaires</span>
                </div>
                <div className="flex items-center gap-2">
                    <Truck className="w-3.5 h-3.5 text-[#A66B2D] shrink-0" />
                    <span>Livraison express avec suivi en direct</span>
                </div>
                <div className="flex items-center gap-2">
                    <RotateCcw className="w-3.5 h-3.5 text-[#A66B2D] shrink-0" />
                    <span>Retours & échanges simplifiés 14 jours</span>
                </div>
            </div>
        </div>
    );
}
