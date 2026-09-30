'use client';

import { useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CreditCard, Smartphone, ShieldCheck } from 'lucide-react';
import { useCheckout } from '../checkout-provider';
import { useTranslations } from 'next-intl';
import { SebpayPaymentForm } from '../../components/sebpay-payment-form';

interface PaymentStepProps {
  onComplete: () => void;
}

function getFlutterwaveDescription(countryCode?: string | null): string {
  const code = (countryCode || '').toUpperCase();
  if (code === 'KE') {
    return 'Paiement sécurisé via Flutterwave : cartes Visa/Mastercard, Safaricom M-Pesa ou virement.';
  }
  if (code === 'GH') {
    return 'Paiement sécurisé via Flutterwave : cartes Visa/Mastercard, Mobile Money (MTN, Vodafone, AirtelTigo) ou virement.';
  }
  if (code === 'UG' || code === 'RW' || code === 'ZM') {
    return 'Paiement sécurisé via Flutterwave : cartes Visa/Mastercard, Mobile Money local (MTN, Airtel) ou virement.';
  }
  if (['CI', 'SN', 'BJ', 'BF', 'ML', 'NE', 'TG', 'GW'].includes(code)) {
    return 'Paiement sécurisé via Flutterwave : cartes Visa/Mastercard, Mobile Money (Orange, MTN, Wave, Moov) ou virement.';
  }
  if (['CM', 'GA', 'CG', 'CF', 'TD', 'GQ'].includes(code)) {
    return 'Paiement sécurisé via Flutterwave : cartes Visa/Mastercard, Mobile Money (MTN, Orange) ou virement.';
  }
  return 'Paiement sécurisé via Flutterwave : cartes Visa/Mastercard/Apple Pay, Mobile Money africain ou virement.';
}

export default function PaymentStep({ onComplete }: PaymentStepProps) {
  const t = useTranslations('Checkout');
  const {
    order,
    countries,
    paymentMethods,
    selectedPaymentMethodCode,
    setSelectedPaymentMethodCode,
    paymentMetadata,
    setPaymentMetadata,
  } = useCheckout();

  const matchedCountry = countries?.find(
    (c) =>
      c.name.toLowerCase() === order.shippingAddress?.country?.toLowerCase() ||
      c.code.toLowerCase() === order.shippingAddress?.country?.toLowerCase()
  );
  const shippingCountryCode = matchedCountry?.code || order.shippingAddress?.country || '';

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleContinue = () => {
    if (!selectedPaymentMethodCode) return;

    if (selectedPaymentMethodCode === 'sebpay') {
      const phone = (paymentMetadata.phone as string)?.trim();
      if (!phone) {
        setValidationError('Veuillez renseigner votre numéro Mobile Money pour continuer.');
        return;
      }
      setValidationError(null);
    }

    onComplete();
  };

  if (paymentMethods.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-stone-500">{t('noPaymentMethods')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-sm sm:text-base text-stone-900 dark:text-stone-100">{t('selectPaymentMethod')}</h3>

      <RadioGroup
        value={selectedPaymentMethodCode || ''}
        onValueChange={(val) => {
          setSelectedPaymentMethodCode(val);
          setValidationError(null);
        }}
        className="space-y-3"
      >
        {paymentMethods.map((method) => {
          const isSelected = selectedPaymentMethodCode === method.code;
          const isSebpay = method.code === 'sebpay';

          return (
            <div key={method.code} className="space-y-2">
              <Label htmlFor={method.code} className="cursor-pointer block">
                <div
                  className={`p-5 rounded-2xl border transition-all ${
                    isSelected
                      ? 'border-[#1B3B2B] bg-[#1B3B2B]/5 dark:bg-[#1B3B2B]/10 ring-1 ring-[#1B3B2B] shadow-xs'
                      : 'border-stone-200/80 dark:border-stone-800 bg-white dark:bg-[#1A120B] hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <RadioGroupItem value={method.code} id={method.code} className="mt-1" />
                    <div className="size-10 rounded-full bg-[#F3EFE9] dark:bg-stone-800 flex items-center justify-center shrink-0">
                      {isSebpay ? (
                        <Smartphone className="h-5 w-5 text-[#A66B2D]" />
                      ) : (
                        <CreditCard className="h-5 w-5 text-[#A66B2D]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-sm sm:text-base text-stone-900 dark:text-stone-100">{method.name}</p>
                        {isSebpay && (
                          <span className="text-[11px] bg-[#1B3B2B]/10 text-[#1B3B2B] dark:text-[#D4A43C] px-2.5 py-0.5 rounded-full font-semibold">
                            MoMo & Cartes
                          </span>
                        )}
                        {method.code === 'flutterwave' && (
                          <span className="text-[11px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-2.5 py-0.5 rounded-full font-semibold">
                            Cartes & MoMo
                          </span>
                        )}
                      </div>
                      {method.description && (
                        <p
                          className="text-xs text-stone-500 dark:text-stone-400 mt-1"
                          dangerouslySetInnerHTML={{ __html: method.description }}
                        />
                      )}

                      {/* Flutterwave Info */}
                      {method.code === 'flutterwave' && isSelected && (
                        <div className="mt-3.5 text-xs text-stone-600 dark:text-stone-300 bg-stone-50 dark:bg-stone-900/60 p-3.5 rounded-xl border border-stone-200/60 dark:border-stone-800 flex items-center gap-2.5">
                          <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                          <span>{getFlutterwaveDescription(shippingCountryCode)}</span>
                        </div>
                      )}

                      {/* Expandable SebPay Mobile Money configuration */}
                      {isSebpay && isSelected && (
                        <div onClick={(e) => e.stopPropagation()} className="cursor-default mt-2">
                          <SebpayPaymentForm
                            initialCountryCode={order.shippingAddress?.country ?? undefined}
                            value={paymentMetadata}
                            onChange={setPaymentMetadata}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Label>
            </div>
          );
        })}
      </RadioGroup>

      {validationError && (
        <p className="text-xs text-red-500 font-medium pl-1">{validationError}</p>
      )}

      <button
        onClick={handleContinue}
        disabled={!selectedPaymentMethodCode}
        className="w-full sm:w-auto h-12 px-8 rounded-full bg-[#1B3B2B] hover:bg-[#152e22] text-white font-semibold text-sm transition-all shadow-sm active:scale-[0.99] disabled:opacity-60 flex items-center justify-center cursor-pointer mt-6"
      >
        {t('continueToReview')}
      </button>
    </div>
  );
}
