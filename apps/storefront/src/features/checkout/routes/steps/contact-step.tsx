'use client';

import { useState } from 'react';
import { Field, FieldLabel, FieldError, FieldGroup } from '@/components/ui/field';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useForm } from 'react-hook-form';
import { Loader2, AlertCircle } from 'lucide-react';
import { Link, useRouter } from '@/platform/i18n/navigation';
import { setCustomerForOrder, SetCustomerForOrderResult } from '../actions';
import { useTranslations } from 'next-intl';

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<SetCustomerForOrderResult | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>();

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
        router.refresh();
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
      <div className="flex items-center justify-between text-xs sm:text-sm text-stone-500">
        <span>Renseignez vos coordonnées pour le suivi de votre commande.</span>
        <Link href="/sign-in?redirectTo=/checkout" className="text-[#1B3B2B] dark:text-[#D4A43C] font-semibold hover:underline">
          {t('signInLink')}
        </Link>
      </div>

      {error && !error.success && (
        <Alert variant="destructive" className="rounded-xl">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{getErrorMessage(error)}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field className="sm:col-span-2">
              <FieldLabel htmlFor="emailAddress" className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                {t('emailAddress')}
              </FieldLabel>
              <input
                id="emailAddress"
                type="email"
                placeholder="ex. contact@exemple.com"
                className="w-full h-11 px-5 rounded-full border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#1A120B] text-sm focus:outline-none focus:border-[#1B3B2B] dark:focus:border-[#D4A43C] focus:ring-1 focus:ring-[#1B3B2B] transition-all"
                {...register('emailAddress', {
                  required: t('emailRequired'),
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: t('invalidEmail'),
                  },
                })}
              />
              <FieldError>{errors.emailAddress?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="firstName" className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                {t('firstName')}
              </FieldLabel>
              <input
                id="firstName"
                type="text"
                placeholder="ex. Leslie"
                className="w-full h-11 px-5 rounded-full border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#1A120B] text-sm focus:outline-none focus:border-[#1B3B2B] dark:focus:border-[#D4A43C] focus:ring-1 focus:ring-[#1B3B2B] transition-all"
                {...register('firstName', { required: t('firstNameRequired') })}
              />
              <FieldError>{errors.firstName?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="lastName" className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                {t('lastName')}
              </FieldLabel>
              <input
                id="lastName"
                type="text"
                placeholder="ex. Cooper"
                className="w-full h-11 px-5 rounded-full border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#1A120B] text-sm focus:outline-none focus:border-[#1B3B2B] dark:focus:border-[#D4A43C] focus:ring-1 focus:ring-[#1B3B2B] transition-all"
                {...register('lastName', { required: t('lastNameRequired') })}
              />
              <FieldError>{errors.lastName?.message}</FieldError>
            </Field>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto h-12 px-8 rounded-full bg-[#1B3B2B] hover:bg-[#152e22] text-white font-semibold text-sm transition-all shadow-sm active:scale-[0.99] disabled:opacity-60 flex items-center justify-center mt-6 cursor-pointer"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('continue')}
          </button>
        </FieldGroup>
      </form>
    </div>
  );
}
