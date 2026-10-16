'use client';

import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useForm, FormProvider } from 'react-hook-form';
import { Loader2, AlertCircle } from 'lucide-react';
import { Link, useRouter } from '@/platform/i18n/navigation';
import { setCustomerForOrder, SetCustomerForOrderResult } from '@/features/checkout/routes/actions';
import { useCheckout } from '@/features/checkout/routes/checkout-provider';
import { useTranslations } from 'next-intl';
import { FormField } from '@/components/ui/form-field';
import { Button } from '@/components/ui/button';
import * as z from 'zod';

interface ContactStepProps {
  onComplete: () => void;
}

interface ContactFormData {
  emailAddress: string;
  firstName: string;
  lastName: string;
}

export default function ContactStep({ onComplete }: ContactStepProps) {
  const t = useTranslations('Checkout');
  const router = useRouter();
  const { updateOrder } = useCheckout();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<SetCustomerForOrderResult | null>(null);

  const methods = useForm<ContactFormData>();
  const { handleSubmit } = methods;

  function getErrorMessage(error: SetCustomerForOrderResult) {
    if (error.success) return null;

    switch (error.errorCode) {
      case 'EMAIL_CONFLICT':
        return (
          <>
            {t('emailConflict')}{' '}
            <Link href="/sign-in?redirectTo=/checkout" className="underline hover:no-underline font-medium">
              {t('emailConflictSignIn')}
            </Link>{' '}
            {t('emailConflictSuffix')}
          </>
        );
      case 'GUEST_CHECKOUT_DISABLED':
        return t('guestCheckoutDisabled');
      case 'NO_ACTIVE_ORDER':
        return (
          <>
            {t('cartEmpty')}{' '}
            <Link href="/" className="underline hover:no-underline font-medium">
              {t('cartEmptyShop')}
            </Link>
          </>
        );
      default:
        return error.message;
    }
  }

  const onSubmit = async (data: ContactFormData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await setCustomerForOrder(data);

      if (result.success) {
        if ('customer' in result && result.customer) {
          updateOrder({
            customer: {
              id: result.customer.id,
              firstName: result.customer.firstName,
              lastName: result.customer.lastName,
              emailAddress: result.customer.emailAddress,
              phoneNumber: result.customer.phoneNumber ?? null,
            },
          });
        }
        onComplete();
      } else {
        setError(result);
      }
    } catch (err) {
      console.error('Error setting customer:', err);
      setError({ success: false, errorCode: 'UNKNOWN', message: t('unexpectedError') });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-4 border-b border-[#E7DED0]/60 dark:border-stone-800 text-xs sm:text-sm text-stone-500">
        <span>{t('enterContactInfo')}</span>
        <Link href="/sign-in?redirectTo=/checkout" className="text-[#A66B2D] hover:text-[#945A28] dark:text-[#D4A43C] font-semibold hover:underline inline-flex items-center gap-1">
          {t('signInLink')} &rarr;
        </Link>
      </div>

      {error && !error.success && (
        <Alert variant="destructive" className="rounded-2xl border-red-200">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{getErrorMessage(error)}</AlertDescription>
        </Alert>
      )}

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div className="sm:col-span-2">
                <FormField
                  name="emailAddress"
                  label={t('emailAddress')}
                  type="email"
                  placeholder="ex. contact@exemple.com"
                  required
                  validation={z.string().email({ message: t('invalidEmail') })}
                />
              </div>

              <div>
                <FormField
                  name="firstName"
                  label={t('firstName')}
                  type="text"
                  placeholder="ex. Leslie"
                  required
                />
              </div>

              <div>
                <FormField
                  name="lastName"
                  label={t('lastName')}
                  type="text"
                  placeholder="ex. Cooper"
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto h-12 px-9 rounded-full bg-[#1D120A] text-[#FAF8F5] hover:bg-[#3A2418] dark:bg-[#FAF8F5] dark:text-[#1D120A] font-semibold transition-all"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('continue')}
              </Button>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}