import Image from 'next/image';
import { Link } from '@/platform/i18n/navigation';
import { Minus, Plus, X, ShoppingBag, Tag } from 'lucide-react';
import { Price } from '@/features/pricing/price';
import { removeFromCart, adjustQuantity, clearCart, removePromotionCode } from './actions';
import { getTranslations } from 'next-intl/server';
import { PromotionCodeForm } from './promotion-code-form';

type ActiveOrder = {
    id: string;
    currencyCode: string;
    couponCodes?: string[] | null;
    lines: Array<{
        id: string;
        quantity: number;
        unitPriceWithTax: number;
        linePriceWithTax: number;
        productVariant: {
            id: string;
            name: string;
            sku: string;
            product: {
                name: string;
                slug: string;
                featuredAsset?: {
                    preview: string;
                } | null;
            };
        };
    }>;
};

export async function CartItems({ activeOrder }: { activeOrder: ActiveOrder | null }) {
    const t = await getTranslations('Cart');

    if (!activeOrder || activeOrder.lines.length === 0) {
        return (
            <div className="py-16 sm:py-24 text-center bg-white dark:bg-[#1A120B] rounded-3xl border border-stone-200/80 dark:border-stone-800 p-8 shadow-xs">
                <div className="size-20 sm:size-24 rounded-full bg-[#F3EFE9] dark:bg-[#2A1D13] flex items-center justify-center mx-auto mb-6">
                    <ShoppingBag className="w-9 sm:w-11 h-9 sm:h-11 text-[#A66B2D]" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 mb-3">
                    {t('empty')}
                </h2>
                <p className="text-sm sm:text-base text-stone-500 dark:text-stone-400 max-w-md mx-auto mb-8 leading-relaxed">
                    {t('emptyMessage')}
                </p>
                <Link
                    href="/search"
                    className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-[#1B3B2B] hover:bg-[#152e22] text-white font-semibold text-sm transition-all shadow-sm active:scale-[0.98]"
                >
                    {t('emptyCta')}
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Table Header Bar (Amber / Golden - FutureCommerce Reference) */}
            <div className="hidden sm:grid grid-cols-12 items-center bg-[#EAA838] dark:bg-[#D4A43C] text-white font-semibold text-xs tracking-wider px-6 py-3.5 rounded-xl shadow-xs">
                <span className="col-span-6">{t('product')}</span>
                <span className="col-span-2 text-center">{t('price')}</span>
                <span className="col-span-2 text-center">{t('quantity')}</span>
                <span className="col-span-2 text-right">{t('subtotal')}</span>
            </div>

            {/* Line Items List */}
            <div className="bg-white dark:bg-[#1A120B] rounded-2xl border border-stone-200/80 dark:border-stone-800 divide-y divide-stone-200/70 dark:divide-stone-800 overflow-hidden shadow-xs">
                {activeOrder.lines.map((line) => (
                    <div
                        key={line.id}
                        className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-12 items-center gap-4 hover:bg-stone-50/50 dark:hover:bg-stone-900/40 transition-colors"
                    >
                        {/* Col 1: Remove + Image Pedestal + Product Title / Variant */}
                        <div className="sm:col-span-6 flex items-center gap-3 sm:gap-4">
                            {/* Remove button */}
                            <form
                                action={async () => {
                                    'use server';
                                    await removeFromCart(line.id);
                                }}
                            >
                                <button
                                    type="submit"
                                    className="p-1 text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-full transition-colors cursor-pointer"
                                    title={t('remove')}
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </form>

                            {/* Studio Pedestal Thumbnail */}
                            {line.productVariant.product.featuredAsset ? (
                                <Link
                                    href={`/product/${line.productVariant.product.slug}`}
                                    className="size-20 sm:size-24 rounded-2xl bg-[#F3EFE9] dark:bg-[#24170E] p-2 flex items-center justify-center shrink-0 border border-stone-200/60 dark:border-stone-800 group hover:border-[#1B3B2B]/40 transition-colors"
                                >
                                    <Image
                                        src={line.productVariant.product.featuredAsset.preview}
                                        alt={line.productVariant.name}
                                        width={96}
                                        height={96}
                                        className="object-contain w-full h-full mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-300"
                                    />
                                </Link>
                            ) : (
                                <div className="size-20 sm:size-24 rounded-2xl bg-[#F3EFE9] dark:bg-[#24170E] flex items-center justify-center shrink-0 border border-stone-200/60 dark:border-stone-800">
                                    <ShoppingBag className="w-6 h-6 text-stone-400" />
                                </div>
                            )}

                            {/* Text Metadata */}
                            <div className="min-w-0 flex-1">
                                <Link
                                    href={`/product/${line.productVariant.product.slug}`}
                                    className="font-semibold text-sm sm:text-base text-stone-900 dark:text-stone-100 hover:text-[#1B3B2B] dark:hover:text-[#D4A43C] transition-colors line-clamp-2"
                                >
                                    {line.productVariant.product.name}
                                </Link>
                                {line.productVariant.name !== line.productVariant.product.name && (
                                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-1">
                                        {line.productVariant.name}
                                    </p>
                                )}
                                <p className="text-[11px] text-stone-400 mt-0.5">
                                    {t('sku', { sku: line.productVariant.sku })}
                                </p>

                                {/* Mobile Only: Price row */}
                                <div className="flex sm:hidden items-center justify-between mt-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                                    <div className="text-xs text-stone-500">
                                        <Price value={line.unitPriceWithTax} currencyCode={activeOrder.currencyCode} />
                                    </div>
                                    <div className="font-bold text-sm text-stone-900 dark:text-stone-100">
                                        <Price value={line.linePriceWithTax} currencyCode={activeOrder.currencyCode} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Col 2: Unit Price (Desktop) */}
                        <div className="hidden sm:block sm:col-span-2 text-center text-sm font-medium text-stone-700 dark:text-stone-300">
                            <Price value={line.unitPriceWithTax} currencyCode={activeOrder.currencyCode} />
                        </div>

                        {/* Col 3: Tactile Quantity Stepper */}
                        <div className="sm:col-span-2 flex justify-start sm:justify-center">
                            <div className="inline-flex items-center border border-stone-200 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-900 overflow-hidden shadow-2xs">
                                <form
                                    action={async () => {
                                        'use server';
                                        await adjustQuantity(line.id, Math.max(1, line.quantity - 1));
                                    }}
                                >
                                    <button
                                        type="submit"
                                        disabled={line.quantity <= 1}
                                        className="w-8 sm:w-9 h-8 sm:h-9 flex items-center justify-center text-stone-500 hover:text-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                        aria-label="Decrease quantity"
                                    >
                                        <Minus className="w-3.5 h-3.5" />
                                    </button>
                                </form>
                                <span className="w-9 sm:w-10 text-center text-xs font-semibold tabular-nums text-stone-900 dark:text-stone-100">
                                    {line.quantity}
                                </span>
                                <form
                                    action={async () => {
                                        'use server';
                                        await adjustQuantity(line.id, line.quantity + 1);
                                    }}
                                >
                                    <button
                                        type="submit"
                                        className="w-8 sm:w-9 h-8 sm:h-9 flex items-center justify-center text-stone-500 hover:text-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                                        aria-label="Increase quantity"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Col 4: Line Subtotal (Desktop) */}
                        <div className="hidden sm:block sm:col-span-2 text-right font-bold text-sm sm:text-base text-stone-950 dark:text-stone-50">
                            <Price value={line.linePriceWithTax} currencyCode={activeOrder.currencyCode} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Active Coupon Codes Chips */}
            {activeOrder.couponCodes && activeOrder.couponCodes.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                    {activeOrder.couponCodes.map((code) => (
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

                <form action={clearCart} className="w-full sm:w-auto text-right">
                    <button
                        type="submit"
                        className="text-xs sm:text-sm font-medium text-stone-500 hover:text-stone-900 dark:hover:text-stone-200 underline underline-offset-4 decoration-stone-300 hover:decoration-stone-600 transition-colors cursor-pointer"
                    >
                        {t('clearCart')}
                    </button>
                </form>
            </div>
        </div>
    );
}
