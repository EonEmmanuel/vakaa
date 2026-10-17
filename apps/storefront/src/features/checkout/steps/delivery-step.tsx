'use client';

import { useState, useEffect } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Loader2, Truck } from 'lucide-react';
import { useRouter } from '@/platform/i18n/navigation';
import { useCheckout } from '@/features/checkout/routes/checkout-provider';
import {
  setShippingMethod as setShippingMethodAction,
  getEligibleShippingMethods,
} from '@/features/checkout/routes/actions';
import { useTranslations } from 'next-intl';
import { Price } from '@/features/pricing/price';
import { Button } from '@/components/ui/button';

interface DeliveryStepProps {
  onComplete: () => void;
}

export default function DeliveryStep({ onComplete }: DeliveryStepProps) {
  const t = useTranslations('Checkout');
  const router = useRouter();
  const { shippingMethods, setShippingMethods, order, updateOrder } = useCheckout();
  const [loadingMethods, setLoadingMethods] = useState(shippingMethods.length === 0);
  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(() => {
    if (order.shippingLines && order.shippingLines.length > 0) {
      return order.shippingLines[0].shippingMethod.id;
    }
    return shippingMethods.length === 1 ? shippingMethods[0].id : null;
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (shippingMethods.length === 0) {
      setLoadingMethods(true);
      getEligibleShippingMethods()
        .then((methods) => {
          if (!cancelled) {
            setShippingMethods(methods);
            if (methods.length > 0) {
              setSelectedMethodId((current) => {
                if (current) return current;
                if (order.shippingLines && order.shippingLines.length > 0) {
                  return order.shippingLines[0].shippingMethod.id;
                }
                return methods.length === 1 ? methods[0].id : methods[0].id;
              });
            }
          }
        })
        .catch((error) => {
          console.error('Failed to load eligible shipping methods:', error);
        })
        .finally(() => {
          if (!cancelled) {
            setLoadingMethods(false);
          }
        });
    }
    return () => {
      cancelled = true;
    };
  }, [shippingMethods.length, order.shippingLines, setShippingMethods]);

  const handleContinue = async () => {
    if (!selectedMethodId) return;

    setSubmitting(true);
    try {
      const result = await setShippingMethodAction(selectedMethodId);
      if (result.success) {
        updateOrder({
          shippingWithTax: result.shippingWithTax,
          totalWithTax: result.totalWithTax,
          shippingLines: result.shippingLines,
        });
        onComplete();
      }
    } catch (error) {
      console.error('Error setting shipping method:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingMethods) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Loader2 className="h-6 w-6 animate-spin text-[#A66B2D]" />
        <p className="text-sm font-medium text-stone-500">
          Chargement des modes de livraison...
        </p>
      </div>
    );
  }

  if (shippingMethods.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-stone-500">{t('noShippingMethods')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-sm sm:text-base text-stone-900 dark:text-stone-100">
        {t('selectShippingMethod')}
      </h3>

      <RadioGroup value={selectedMethodId || ''} onValueChange={setSelectedMethodId} className="space-y-3.5">
        {shippingMethods.map((method: { id: string; name: string; description?: string | null; priceWithTax: number }) => {
          const isSelected = selectedMethodId === method.id;
          return (
            <Label key={method.id} htmlFor={method.id} className="cursor-pointer block">
              <div
                className={`p-5 sm:p-6 rounded-2xl border transition-all ${
                  isSelected
                    ? 'border-[#1D120A] bg-[#FAF8F5] dark:bg-[#1B3B2B]/10 shadow-xs ring-1 ring-[#1D120A]'
                    : 'border-[#E7DED0]/80 dark:border-stone-800 bg-white dark:bg-[#1A120B] hover:border-stone-300'
                }`}
              >
                <div className="flex items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
                    <RadioGroupItem value={method.id} id={method.id} className="mt-1 sm:mt-0" />
                    <div className="size-11 rounded-2xl bg-[#F3EFE9] dark:bg-stone-800 flex items-center justify-center shrink-0">
                      <Truck className="h-5 w-5 text-[#A66B2D]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm sm:text-base text-stone-900 dark:text-stone-100">{method.name}</p>
                      {method.description && (
                        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                          {method.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0 pt-0.5 sm:pt-0">
                    <p className="font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100 tabular-nums">
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

      <div className="pt-2">
        <Button
          onClick={handleContinue}
          disabled={!selectedMethodId || submitting}
          className="w-full sm:w-auto h-12 px-9 rounded-full bg-[#1D120A] text-[#FAF8F5] hover:bg-[#3A2418] dark:bg-[#FAF8F5] dark:text-[#1D120A] font-semibold transition-all"
        >
          {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t('continueToPayment')}
        </Button>
      </div>
    </div>
  );
}