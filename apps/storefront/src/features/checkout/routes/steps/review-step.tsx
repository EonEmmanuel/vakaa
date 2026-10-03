'use client';

import { useState } from 'react';
import { Loader2, MapPin, Truck, CreditCard, Edit, Mail } from 'lucide-react';
import { useCheckout } from '../checkout-provider';
import { placeOrder as placeOrderAction } from '../actions';
import { Price } from '@/features/pricing/price';
import { useTranslations } from 'next-intl';

interface ReviewStepProps {
  onEditStep: (step: 'contact' | 'shipping' | 'delivery' | 'payment') => void;
}

export default function ReviewStep({ onEditStep }: ReviewStepProps) {
  const t = useTranslations('Checkout');
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
      const result = await placeOrderAction(selectedPaymentMethodCode, paymentMetadata);
      if (result?.redirectUrl) {
        setTimeout(() => {
          window.location.assign(result.redirectUrl!);
        }, 150);
        return;
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
        throw error;
      }
      console.error('Error placing order:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Une erreur est survenue lors de l’initialisation du paiement.');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-base sm:text-lg text-stone-900 dark:text-stone-100">{t('reviewYourOrder')}</h3>

      <div className={`grid grid-cols-1 gap-4 ${isGuest ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-3'}`}>
        {isGuest && order.customer && (
          <div className="p-4 rounded-2xl bg-stone-50/70 dark:bg-stone-900/40 border border-stone-200/70 dark:border-stone-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-stone-800 dark:text-stone-200">
                <Mail className="h-4 w-4 text-[#A66B2D]" />
                <h4 className="font-semibold text-xs tracking-wider uppercase">{t('contact')}</h4>
              </div>
              <button
                type="button"
                onClick={() => onEditStep('contact')}
                className="text-[11px] font-medium text-stone-500 hover:text-stone-900 dark:hover:text-stone-200 flex items-center gap-1 cursor-pointer"
              >
                <Edit className="h-3 w-3" />
                {t('edit')}
              </button>
            </div>
            <div className="text-xs text-stone-600 dark:text-stone-400 space-y-0.5">
              <p className="font-semibold text-stone-900 dark:text-stone-100">
                {order.customer.firstName} {order.customer.lastName}
              </p>
              <p className="truncate">{order.customer.emailAddress}</p>
            </div>
          </div>
        )}

        {/* Shipping Address */}
        <div className="p-4 rounded-2xl bg-stone-50/70 dark:bg-stone-900/40 border border-stone-200/70 dark:border-stone-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-stone-800 dark:text-stone-200">
              <MapPin className="h-4 w-4 text-[#A66B2D]" />
              <h4 className="font-semibold text-xs tracking-wider uppercase">{t('shippingAddress')}</h4>
            </div>
            <button
              type="button"
              onClick={() => onEditStep('shipping')}
              className="text-[11px] font-medium text-stone-500 hover:text-stone-900 dark:hover:text-stone-200 flex items-center gap-1 cursor-pointer"
            >
              <Edit className="h-3 w-3" />
              {t('edit')}
            </button>
          </div>
          {order.shippingAddress ? (
            <div className="text-xs text-stone-600 dark:text-stone-400 space-y-0.5">
              <p className="font-semibold text-stone-900 dark:text-stone-100">{order.shippingAddress.fullName}</p>
              <p className="line-clamp-1">
                {order.shippingAddress.streetLine1}
                {order.shippingAddress.streetLine2 && `, ${order.shippingAddress.streetLine2}`}
              </p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.postalCode}
              </p>
              <p>{order.shippingAddress.country}</p>
              <p>{order.shippingAddress.phoneNumber}</p>
            </div>
          ) : (
            <p className="text-xs text-stone-400">{t('noShippingAddress')}</p>
          )}
        </div>

        {/* Delivery Method */}
        <div className="p-4 rounded-2xl bg-stone-50/70 dark:bg-stone-900/40 border border-stone-200/70 dark:border-stone-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-stone-800 dark:text-stone-200">
              <Truck className="h-4 w-4 text-[#A66B2D]" />
              <h4 className="font-semibold text-xs tracking-wider uppercase">{t('deliveryMethod')}</h4>
            </div>
            <button
              type="button"
              onClick={() => onEditStep('delivery')}
              className="text-[11px] font-medium text-stone-500 hover:text-stone-900 dark:hover:text-stone-200 flex items-center gap-1 cursor-pointer"
            >
              <Edit className="h-3 w-3" />
              {t('edit')}
            </button>
          </div>
          {order.shippingLines && order.shippingLines.length > 0 ? (
            <div className="text-xs text-stone-600 dark:text-stone-400 space-y-0.5">
              <p className="font-semibold text-stone-900 dark:text-stone-100">{order.shippingLines[0].shippingMethod.name}</p>
              <p className="font-medium text-stone-900 dark:text-stone-100">
                {order.shippingLines[0].priceWithTax === 0
                  ? t('free')
                  : <Price value={order.shippingLines[0].priceWithTax} currencyCode={order.currencyCode} />}
              </p>
            </div>
          ) : (
            <p className="text-xs text-stone-400">{t('noDeliveryMethod')}</p>
          )}
        </div>

        {/* Payment Method */}
        <div className="p-4 rounded-2xl bg-stone-50/70 dark:bg-stone-900/40 border border-stone-200/70 dark:border-stone-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-stone-800 dark:text-stone-200">
              <CreditCard className="h-4 w-4 text-[#A66B2D]" />
              <h4 className="font-semibold text-xs tracking-wider uppercase">{t('paymentMethod')}</h4>
            </div>
            <button
              type="button"
              onClick={() => onEditStep('payment')}
              className="text-[11px] font-medium text-stone-500 hover:text-stone-900 dark:hover:text-stone-200 flex items-center gap-1 cursor-pointer"
            >
              <Edit className="h-3 w-3" />
              {t('edit')}
            </button>
          </div>
          {selectedPaymentMethod ? (
            <div className="text-xs text-stone-600 dark:text-stone-400 space-y-0.5">
              <p className="font-semibold text-stone-900 dark:text-stone-100">{selectedPaymentMethod.name}</p>
              {selectedPaymentMethodCode === 'sebpay' && typeof paymentMetadata.phone === 'string' && paymentMetadata.phone ? (
                <p className="text-[11px] font-mono text-stone-500">
                  {String(paymentMetadata.operator || '').toUpperCase()} • {String(paymentMetadata.phone)}
                </p>
              ) : null}
            </div>
          ) : (
            <p className="text-xs text-stone-400">{t('noPaymentMethod')}</p>
          )}
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-xs sm:text-sm font-medium animate-fade-in">
          {errorMessage}
        </div>
      )}

      <button
        onClick={handlePlaceOrder}
        disabled={loading || !order.shippingAddress || !order.shippingLines?.length || !selectedPaymentMethodCode}
        className="w-full h-14 rounded-xl bg-[#1B3B2B] hover:bg-[#152e22] text-white font-semibold text-base transition-all shadow-md active:scale-[0.99] disabled:opacity-50 flex items-center justify-center cursor-pointer mt-6"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {selectedPaymentMethodCode === 'sebpay'
              ? 'Envoi de l’invite de paiement...'
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
      </button>

      {(!order.shippingAddress || !order.shippingLines?.length || !selectedPaymentMethodCode) && (
        <p className="text-xs text-red-500 text-center font-medium">
          {t('completeAllSteps')}
        </p>
      )}
    </div>
  );
}
