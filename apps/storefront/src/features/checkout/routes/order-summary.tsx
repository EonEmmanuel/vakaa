'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronDown, ShoppingBag, ShieldCheck, Lock, Truck } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { OrderLine } from './types';
import { useCheckout } from './checkout-provider';
import { Price } from '@/features/pricing/price';
import { useTranslations } from 'next-intl';

function OrderSummaryContent({ order, t }: { order: ReturnType<typeof useCheckout>['order']; t: ReturnType<typeof useTranslations<'Checkout'>> }) {
  return (
    <div className="space-y-5">
      {/* Items List */}
      <div className="space-y-3.5 max-h-[340px] overflow-y-auto pr-1">
        {order.lines.map((line: OrderLine) => (
          <div key={line.id} className="flex items-center gap-3.5">
            {line.productVariant.product.featuredAsset ? (
              <div className="size-16 rounded-2xl bg-[#F3EFE9] dark:bg-[#20150E] p-1.5 flex items-center justify-center shrink-0 border border-stone-200/60 dark:border-stone-800">
                <Image
                  src={line.productVariant.product.featuredAsset.preview}
                  alt={line.productVariant.name}
                  width={64}
                  height={64}
                  className="object-contain w-full h-full mix-blend-multiply dark:mix-blend-normal"
                />
              </div>
            ) : (
              <div className="size-16 rounded-2xl bg-[#F3EFE9] dark:bg-[#20150E] flex items-center justify-center shrink-0 border border-stone-200/60 dark:border-stone-800">
                <ShoppingBag className="h-5 w-5 text-stone-400" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-stone-900 dark:text-stone-100 line-clamp-1">
                {line.productVariant.product.name}
              </p>
              {line.productVariant.name !== line.productVariant.product.name && (
                <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-1">
                  {line.productVariant.name}
                </p>
              )}
              <div className="mt-1">
                <span className="inline-flex text-[11px] font-medium bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 px-2 py-0.5 rounded-full">
                  {t('qty', { quantity: line.quantity })}
                </span>
              </div>
            </div>
            <div className="text-sm font-bold text-stone-900 dark:text-stone-100 shrink-0">
              <Price value={line.linePriceWithTax} currencyCode={order.currencyCode} />
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-stone-200/80 dark:border-stone-800 pt-4 space-y-3 text-sm">
        <div className="flex justify-between items-center text-stone-600 dark:text-stone-400">
          <span>{t('subtotal')}</span>
          <span className="font-semibold text-stone-900 dark:text-stone-200">
            <Price value={order.subTotalWithTax} currencyCode={order.currencyCode} />
          </span>
        </div>

        {order.discounts && order.discounts.length > 0 && (
          <>
            {order.discounts.map((discount, index: number) => (
              <div key={index} className="flex justify-between items-center text-emerald-600 dark:text-emerald-400">
                <span>{discount.description}</span>
                <span className="font-semibold">
                  -<Price value={discount.amountWithTax} currencyCode={order.currencyCode} />
                </span>
              </div>
            ))}
          </>
        )}

        <div className="flex justify-between items-center text-stone-600 dark:text-stone-400">
          <span>{t('shipping')}</span>
          <span className="text-stone-900 dark:text-stone-200">
            {order.shippingWithTax > 0 ? (
              <Price value={order.shippingWithTax} currencyCode={order.currencyCode} />
            ) : (
              <span className="text-xs text-stone-500 italic">{t('toBeCalculated')}</span>
            )}
          </span>
        </div>

        <div className="border-t border-stone-200/80 dark:border-stone-800 pt-3">
          <div className="flex justify-between items-baseline">
            <span className="text-base font-bold text-stone-900 dark:text-stone-100">{t('total')}</span>
            <span className="text-2xl font-bold text-stone-950 dark:text-white tabular-nums">
              <Price value={order.totalWithTax} currencyCode={order.currencyCode} />
            </span>
          </div>
          <p className="text-[11px] text-stone-400 dark:text-stone-500 text-right mt-1">
            Règlement en {order.currencyCode || 'XAF'}
          </p>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="pt-4 border-t border-stone-200/70 dark:border-stone-800 space-y-2 text-[11px] text-stone-600 dark:text-stone-400">
        <div className="flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-[#A66B2D] shrink-0" />
          <span>Paiement sécurisé et crypté SSL</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-[#A66B2D] shrink-0" />
          <span>Mobile Money, Orange & MTN, Cartes bancaires</span>
        </div>
        <div className="flex items-center gap-2">
          <Truck className="w-3.5 h-3.5 text-[#A66B2D] shrink-0" />
          <span>Expédition protégée avec numéro de suivi</span>
        </div>
      </div>
    </div>
  );
}

export default function OrderSummary() {
  const t = useTranslations('Checkout');
  const { order } = useCheckout();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile: Collapsible summary */}
      <div className="lg:hidden mb-6">
        <div className="bg-white dark:bg-[#1A120B] rounded-2xl border border-stone-200/80 dark:border-stone-800 p-4 shadow-xs">
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger className="w-full text-left">
              <div className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 text-[#A66B2D]" />
                  <span className="font-bold text-sm text-stone-900 dark:text-stone-100">
                    {t('orderSummary')} ({order.lines.length} {order.lines.length === 1 ? t('item') : t('items')})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base text-stone-950 dark:text-white">
                    <Price value={order.totalWithTax} currencyCode={order.currencyCode} />
                  </span>
                  <ChevronDown className={`h-4 w-4 text-stone-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </div>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4">
              <OrderSummaryContent order={order} t={t} />
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>

      {/* Desktop: Always visible sticky summary */}
      <div className="hidden lg:block">
        <div className="bg-white dark:bg-[#1A120B] rounded-2xl border border-stone-200/80 dark:border-stone-800 p-6 sm:p-7 shadow-xs sticky top-28 space-y-5">
          <h2 className="font-sans text-xl font-bold text-stone-900 dark:text-stone-100 tracking-tight flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#A66B2D]" />
            {t('orderSummary')}
          </h2>
          <OrderSummaryContent order={order} t={t} />
        </div>
      </div>
    </>
  );
}
