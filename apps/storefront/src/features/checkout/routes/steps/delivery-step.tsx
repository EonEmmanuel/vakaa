'use client';

import { useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Loader2, Truck } from 'lucide-react';
import { useRouter } from '@/platform/i18n/navigation';
import { useCheckout } from '../checkout-provider';
import { setShippingMethod as setShippingMethodAction } from '../actions';
import { useTranslations } from 'next-intl';
import { Price } from '@/features/pricing/price';

interface DeliveryStepProps {
  onComplete: () => void;
}

export default function DeliveryStep({ onComplete }: DeliveryStepProps) {
  const t = useTranslations('Checkout');
  const router = useRouter();
  const { shippingMethods, order } = useCheckout();
  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(() => {
    if (order.shippingLines && order.shippingLines.length > 0) {
      return order.shippingLines[0].shippingMethod.id;
    }
    return shippingMethods.length === 1 ? shippingMethods[0].id : null;
  });
  const [submitting, setSubmitting] = useState(false);

  const handleContinue = async () => {
    if (!selectedMethodId) return;

    setSubmitting(true);
    try {
      await setShippingMethodAction(selectedMethodId);
      router.refresh();
      onComplete();
    } catch (error) {
      console.error('Error setting shipping method:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (shippingMethods.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-stone-500">{t('noShippingMethods')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-sm sm:text-base text-stone-900 dark:text-stone-100">{t('selectShippingMethod')}</h3>

      <RadioGroup value={selectedMethodId || ''} onValueChange={setSelectedMethodId} className="space-y-3">
        {shippingMethods.map((method) => {
          const isSelected = selectedMethodId === method.id;
          return (
            <Label key={method.id} htmlFor={method.id} className="cursor-pointer block">
              <div
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  isSelected
                    ? 'border-[#1B3B2B] bg-[#1B3B2B]/5 dark:bg-[#1B3B2B]/10 shadow-xs ring-1 ring-[#1B3B2B]'
                    : 'border-stone-200/80 dark:border-stone-800 bg-white dark:bg-[#1A120B] hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    <RadioGroupItem value={method.id} id={method.id} />
                    <div className="size-10 rounded-full bg-[#F3EFE9] dark:bg-stone-800 flex items-center justify-center shrink-0">
                      <Truck className="h-5 w-5 text-[#A66B2D]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm sm:text-base text-stone-900 dark:text-stone-100">{method.name}</p>
                      {method.description && (
                        <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-1">
                          {method.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100">
                      {method.priceWithTax === 0 ? (
                        <span className="text-emerald-700 dark:text-emerald-400 font-bold">{t('free')}</span>
                      ) : (
                        <Price value={method.priceWithTax} currencyCode={order?.currencyCode} />
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </Label>
          );
        })}
      </RadioGroup>

      <button
        onClick={handleContinue}
        disabled={!selectedMethodId || submitting}
        className="w-full sm:w-auto h-12 px-8 rounded-full bg-[#1B3B2B] hover:bg-[#152e22] text-white font-semibold text-sm transition-all shadow-sm active:scale-[0.99] disabled:opacity-60 flex items-center justify-center cursor-pointer mt-6"
      >
        {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {t('continueToPayment')}
      </button>
    </div>
  );
}
