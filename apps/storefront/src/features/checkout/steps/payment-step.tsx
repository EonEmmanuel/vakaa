'use client';

import { useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CreditCard, Smartphone, ShieldCheck } from 'lucide-react';
import { useCheckout } from '@/features/checkout/routes/checkout-provider';
import { useTranslations } from 'next-intl';
import { SebpayPaymentForm } from '@/features/checkout/components/sebpay-payment-form';
import { Button } from '@/components/ui/button';

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
      <h3 className="font-semibold text-sm sm:text-base text-stone-900 dark:text-stone-100">
        {t('selectPaymentMethod')}
      </h3>

      <RadioGroup
        value={selectedPaymentMethodCode || ''}
        onValueChange={(val) => {
          setSelectedPaymentMethodCode(val);
          setValidationError(null);
        }}
        className="space-y-3.5"
      >
        {paymentMethods.map((method) => {
          const isSelected = selectedPaymentMethodCode === method.code;
          const isSebpay = method.code === 'sebpay';

          return (
            <div key={method.code} className="space-y-2">
              <div
                onClick={() => {
                  setSelectedPaymentMethodCode(method.code);
                  setValidationError(null);
                }}
                className={`p-5 sm:p-6 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#1D120A] bg-[#FAF8F5] dark:bg-[#1B3B2B]/10 ring-1 ring-[#1D120A] shadow-xs'
                    : 'border-[#E7DED0]/80 dark:border-stone-800 bg-white dark:bg-[#1A120B] hover:border-stone-300'
                }`}
              >
                {/* Header row: Radio, Icon, Title, Badges */}
                <div className="flex items-center gap-3.5 sm:gap-4">
                  <RadioGroupItem value={method.code} id={method.code} />
                  <div className="size-11 rounded-2xl bg-[#F3EFE9] dark:bg-stone-800 flex items-center justify-center shrink-0">
                    {isSebpay ? (
                      <Smartphone className="h-5 w-5 text-[#A66B2D]" />
                    ) : (
                      <CreditCard className="h-5 w-5 text-[#A66B2D]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                    <Label
                      htmlFor={method.code}
                      className="font-semibold text-sm sm:text-base text-stone-900 dark:text-stone-100 cursor-pointer"
                    >
                      {method.name}
                    </Label>
                    {isSebpay && (
                      <span className="text-[11px] bg-[#1B3B2B]/10 text-[#1B3B2B] dark:text-[#D4A43C] px-3 py-1 rounded-full font-semibold shrink-0">
                        MoMo & Cartes
                      </span>
                    )}
                    {method.code === 'flutterwave' && (
                      <span className="text-[11px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full font-semibold shrink-0">
                        Cartes & MoMo
                      </span>
                    )}
                  </div>
                </div>

                {/* Description row: full width below header */}
                {method.description && (
                  <div className="mt-3 pl-0 sm:pl-15 text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                    <p dangerouslySetInnerHTML={{ __html: method.description }} />
                  </div>
                )}

                {/* Flutterwave Info */}
                {method.code === 'flutterwave' && isSelected && (
                  <div className="mt-4 pt-4 border-t border-[#E7DED0]/60 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-300 bg-white dark:bg-stone-900/60 p-4 rounded-xl border border-stone-200/60 dark:border-stone-800 flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
                    <span className="leading-relaxed">{getFlutterwaveDescription(shippingCountryCode)}</span>
                  </div>
                )}

                {/* Expandable SebPay Mobile Money configuration: full width without left indent */}
                {isSebpay && isSelected && (
                  <div onClick={(e) => e.stopPropagation()} className="cursor-default mt-4 pt-4 border-t border-[#E7DED0]/60 dark:border-stone-800">
                    <SebpayPaymentForm
                      initialCountryCode={order.shippingAddress?.country ?? undefined}
                      value={paymentMetadata}
                      onChange={setPaymentMetadata}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </RadioGroup>

      {validationError && (
        <p className="text-xs text-red-500 font-medium pl-1">{validationError}</p>
      )}

      <div className="pt-2">
        <Button
          onClick={handleContinue}
          disabled={!selectedPaymentMethodCode}
          className="w-full sm:w-auto h-12 px-9 rounded-full bg-[#1D120A] text-[#FAF8F5] hover:bg-[#3A2418] dark:bg-[#FAF8F5] dark:text-[#1D120A] font-semibold transition-all"
        >
          {t('continueToReview')}
        </Button>
      </div>
    </div>
  );
}