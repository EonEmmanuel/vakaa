'use client';

import { useState } from 'react';
import { Loader2, MapPin, Truck, CreditCard, Edit, Mail } from 'lucide-react';
import { useCheckout } from '@/features/checkout/routes/checkout-provider';
import { placeOrder as placeOrderAction } from '@/features/checkout/routes/actions';
import { Price } from '@/features/pricing/price';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/platform/i18n/navigation';
import { Button } from '@/components/ui/button';

/**
 * Payment error codes for which we show a generic, customer-friendly message.
 * The real provider reason is logged server-side (placeOrder) but must never be
 * surfaced to shoppers (it can contain API-key / infrastructure details).
 */
const PAYMENT_ERROR_CODES = new Set([
  'PAYMENT_DECLINED_ERROR',
  'PAYMENT_FAILED_ERROR',
  'PAYMENT_FAILED',
]);

interface ReviewStepProps {
  onComplete?: () => void;
  onEditStep?: (step: 'contact' | 'shipping' | 'delivery' | 'payment') => void;
}

export default function ReviewStep({ onComplete: _onComplete, onEditStep }: ReviewStepProps) {
  const t = useTranslations('Checkout');
  const router = useRouter();
  const { order, paymentMethods, selectedPaymentMethodCode, paymentMetadata, isGuest } = useCheckout();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedPaymentMethod = paymentMethods.find(
    (method) => method.code === selectedPaymentMethodCode
  );

  const handlePlaceOrder = async () => {
    if (!selectedPaymentMethodCode) return;

    setLoading(true);
    setErrorMessage(null);
    try {
      const result = await placeOrderAction(selectedPaymentMethodCode, paymentMetadata, order?.state);

      if (!result.success) {
        // Log the real reason for diagnostics, but never expose provider or
        // infrastructure details (e.g. API-key / IP errors) to the customer.
        console.error('Error placing order:', result.errorCode, result.message);
        setErrorMessage(
          PAYMENT_ERROR_CODES.has(result.errorCode) ? t('paymentFailed') : result.message
        );
        setLoading(false);
        return;
      }

      if (result.redirectUrl) {
        if (selectedPaymentMethodCode === 'sebpay') {
          // SebPay's provider_link (e.g. Wave) must be opened so the customer can
          // validate. Open it in a new tab and keep this tab on the confirmation
          // page, where the SebPay reconciler polls for settlement.
          window.open(result.redirectUrl, '_blank', 'noopener,noreferrer');
          router.push(`/order-confirmation/${result.orderCode}`);
          return;
        }
        window.location.assign(result.redirectUrl);
        return;
      }
      router.push(`/order-confirmation/${result.orderCode}`);
    } catch (error) {
      if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
        throw error;
      }
      console.error('Error placing order:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Une erreur est survenue lors de l\'initialisation du paiement.');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-base sm:text-lg text-stone-900 dark:text-stone-100">
        {t('reviewYourOrder')}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        {isGuest && order.customer && (
          <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF8F5]/80 dark:bg-stone-900/50 border border-[#E7DED0]/80 dark:border-stone-800 space-y-3.5 hover:border-[#D4A43C]/40 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-stone-900 dark:text-stone-100">
                <div className="p-1.5 rounded-lg bg-white dark:bg-stone-800 border border-[#E7DED0]/60 shadow-2xs">
                  <Mail className="h-4 w-4 text-[#D4A43C]" />
                </div>
                <h4 className="font-semibold text-xs tracking-wider uppercase text-stone-800 dark:text-stone-200">{t('contact')}</h4>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="xs"
                disabled={loading}
                onClick={() => onEditStep?.('contact')}
                className="h-7 px-2.5 rounded-full text-[11px] font-medium text-stone-600 hover:text-stone-900 dark:hover:text-stone-200 flex items-center gap-1 hover:bg-[#FAF8F5] dark:hover:bg-stone-800 border border-transparent hover:border-[#E7DED0]/80 disabled:opacity-40 transition-all"
              >
                <Edit className="h-3 w-3" />
                {t('edit')}
              </Button>
            </div>
            <div className="text-xs text-stone-600 dark:text-stone-400 space-y-0.5 pt-1">
              <p className="font-semibold text-stone-900 dark:text-stone-100">
                {order.customer.firstName} {order.customer.lastName}
              </p>
              <p className="truncate">{order.customer.emailAddress}</p>
            </div>
          </div>
        )}

        {/* Shipping Address */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF8F5]/80 dark:bg-stone-900/50 border border-[#E7DED0]/80 dark:border-stone-800 space-y-3.5 hover:border-[#D4A43C]/40 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-stone-900 dark:text-stone-100">
              <div className="p-1.5 rounded-lg bg-white dark:bg-stone-800 border border-[#E7DED0]/60 shadow-2xs">
                <MapPin className="h-4 w-4 text-[#D4A43C]" />
              </div>
              <h4 className="font-semibold text-xs tracking-wider uppercase text-stone-800 dark:text-stone-200">{t('shippingAddress')}</h4>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="xs"
              disabled={loading}
              onClick={() => onEditStep?.('shipping')}
              className="h-7 px-2.5 rounded-full text-[11px] font-medium text-stone-600 hover:text-stone-900 dark:hover:text-stone-200 flex items-center gap-1 hover:bg-[#FAF8F5] dark:hover:bg-stone-800 border border-transparent hover:border-[#E7DED0]/80 disabled:opacity-40 transition-all"
            >
              <Edit className="h-3 w-3" />
              {t('edit')}
            </Button>
          </div>
          {order.shippingAddress ? (
            <div className="text-xs text-stone-600 dark:text-stone-400 space-y-0.5 pt-1 leading-relaxed">
              <p className="font-semibold text-stone-900 dark:text-stone-100">{order.shippingAddress.fullName}</p>
              <p className="line-clamp-2">
                {order.shippingAddress.streetLine1}
                {order.shippingAddress.streetLine2 && `, ${order.shippingAddress.streetLine2}`}
              </p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.postalCode}
              </p>
              <p>{order.shippingAddress.country}</p>
              {order.shippingAddress.phoneNumber && (
                <p className="text-stone-500 font-mono text-[11px]">{order.shippingAddress.phoneNumber}</p>
              )}
            </div>
          ) : (
            <p className="text-xs text-stone-400 pt-1">{t('noShippingAddress')}</p>
          )}
        </div>

        {/* Delivery Method */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF8F5]/80 dark:bg-stone-900/50 border border-[#E7DED0]/80 dark:border-stone-800 space-y-3.5 hover:border-[#D4A43C]/40 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-stone-900 dark:text-stone-100">
              <div className="p-1.5 rounded-lg bg-white dark:bg-stone-800 border border-[#E7DED0]/60 shadow-2xs">
                <Truck className="h-4 w-4 text-[#D4A43C]" />
              </div>
              <h4 className="font-semibold text-xs tracking-wider uppercase text-stone-800 dark:text-stone-200">{t('deliveryMethod')}</h4>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="xs"
              disabled={loading}
              onClick={() => onEditStep?.('delivery')}
              className="h-7 px-2.5 rounded-full text-[11px] font-medium text-stone-600 hover:text-stone-900 dark:hover:text-stone-200 flex items-center gap-1 hover:bg-[#FAF8F5] dark:hover:bg-stone-800 border border-transparent hover:border-[#E7DED0]/80 disabled:opacity-40 transition-all"
            >
              <Edit className="h-3 w-3" />
              {t('edit')}
            </Button>
          </div>
          {order.shippingLines && order.shippingLines.length > 0 ? (
            <div className="text-xs text-stone-600 dark:text-stone-400 space-y-0.5 pt-1">
              <p className="font-semibold text-stone-900 dark:text-stone-100">{order.shippingLines[0].shippingMethod.name}</p>
              <p className="font-medium text-stone-900 dark:text-stone-100">
                {order.shippingLines[0].priceWithTax === 0
                  ? t('free')
                  : <Price value={order.shippingLines[0].priceWithTax} currencyCode={order.currencyCode} />}
              </p>
            </div>
          ) : (
            <p className="text-xs text-stone-400 pt-1">{t('noDeliveryMethod')}</p>
          )}
        </div>

        {/* Payment Method */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF8F5]/80 dark:bg-stone-900/50 border border-[#E7DED0]/80 dark:border-stone-800 space-y-3.5 hover:border-[#D4A43C]/40 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-stone-900 dark:text-stone-100">
              <div className="p-1.5 rounded-lg bg-white dark:bg-stone-800 border border-[#E7DED0]/60 shadow-2xs">
                <CreditCard className="h-4 w-4 text-[#D4A43C]" />
              </div>
              <h4 className="font-semibold text-xs tracking-wider uppercase text-stone-800 dark:text-stone-200">{t('paymentMethod')}</h4>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="xs"
              disabled={loading}
              onClick={() => onEditStep?.('payment')}
              className="h-7 px-2.5 rounded-full text-[11px] font-medium text-stone-600 hover:text-stone-900 dark:hover:text-stone-200 flex items-center gap-1 hover:bg-[#FAF8F5] dark:hover:bg-stone-800 border border-transparent hover:border-[#E7DED0]/80 disabled:opacity-40 transition-all"
            >
              <Edit className="h-3 w-3" />
              {t('edit')}
            </Button>
          </div>
          {selectedPaymentMethod ? (
            <div className="text-xs text-stone-600 dark:text-stone-400 space-y-0.5 pt-1">
              <p className="font-semibold text-stone-900 dark:text-stone-100">{selectedPaymentMethod.name}</p>
              {selectedPaymentMethodCode === 'sebpay' && typeof paymentMetadata.phone === 'string' && paymentMetadata.phone ? (
                <p className="text-[11px] font-mono text-stone-500">
                  {String(paymentMetadata.operator || '').toUpperCase()} • {String(paymentMetadata.phone)}
                </p>
              ) : null}
            </div>
          ) : (
            <p className="text-xs text-stone-400 pt-1">{t('noPaymentMethod')}</p>
          )}
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-xs sm:text-sm font-medium animate-fade-in">
          {errorMessage}
        </div>
      )}

      <Button
        onClick={handlePlaceOrder}
        disabled={loading || !order.shippingAddress || !order.shippingLines?.length || !selectedPaymentMethodCode}
        className="w-full h-14 rounded-full mt-6 bg-[#1D120A] hover:bg-[#1D120A]/90 text-[#FAF8F5] font-medium tracking-wide shadow-md transition-all cursor-pointer"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {selectedPaymentMethodCode === 'sebpay'
              ? 'Envoi de l\'invite de paiement...'
              : selectedPaymentMethodCode === 'flutterwave'
              ? 'Redirection vers Flutterwave...'
              : t('placeOrder')}
          </>
        ) : selectedPaymentMethodCode === 'sebpay' ? (
          'Confirmer & Régler par Mobile Money'
        ) : selectedPaymentMethodCode === 'flutterwave' ? (
          'Confirmer & Payer avec Flutterwave'
        ) : (
          t('placeOrder')
        )}
      </Button>

      {(!order.shippingAddress || !order.shippingLines?.length || !selectedPaymentMethodCode) && (
        <p className="text-xs text-red-500 text-center font-medium">
          {t('completeAllSteps')}
        </p>
      )}
    </div>
  );
}