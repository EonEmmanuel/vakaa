'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldLabel, FieldError, FieldGroup } from '@/components/ui/field';
import { useForm, Controller } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { CountrySelect } from '@/components/ui/country-select';
import { useTranslations } from 'next-intl';

interface Country {
  id: string;
  code: string;
  name: string;
}

interface AddressFormData {
  fullName: string;
  streetLine1: string;
  streetLine2?: string;
  city: string;
  province: string;
  postalCode: string;
  countryCode: string;
  phoneNumber: string;
  company?: string;
}

interface CustomerAddress {
  id: string;
  fullName?: string | null;
  company?: string | null;
  streetLine1: string;
  streetLine2?: string | null;
  city?: string | null;
  province?: string | null;
  postalCode?: string | null;
  country: { id: string; code: string; name: string };
  phoneNumber?: string | null;
  defaultShippingAddress?: boolean | null;
  defaultBillingAddress?: boolean | null;
}

interface AddressFormProps {
  countries: Country[];
  address?: CustomerAddress;
  onSubmit: (data: AddressFormData & { id?: string }) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function AddressForm({ countries, address, onSubmit, onCancel, isSubmitting }: AddressFormProps) {
  const t = useTranslations('Account');
  const { register, handleSubmit, formState: { errors }, control } = useForm<AddressFormData>({
    defaultValues: address ? {
      fullName: address.fullName || '',
      company: address.company || '',
      streetLine1: address.streetLine1,
      streetLine2: address.streetLine2 || '',
      city: address.city || '',
      province: address.province || '',
      postalCode: address.postalCode || '',
      countryCode: address.country.code,
      phoneNumber: address.phoneNumber || '',
    } : {
      countryCode: countries[0]?.code || 'FR',
    }
  });

  const handleFormSubmit = async (data: AddressFormData) => {
    await onSubmit(address ? { ...data, id: address.id } : data);
  };

  const inputClass = "h-11 rounded-xl border-[#EAE6DF] dark:border-[#3A291C] bg-[#FAF8F5]/50 dark:bg-[#1E140D] text-sm focus:border-[#D4A43C]";
  const labelClass = "text-xs font-semibold uppercase tracking-wider text-[#3A2418] dark:text-[#E0D8D0]";

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <FieldGroup className="my-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field className="sm:col-span-2">
            <FieldLabel htmlFor="fullName" className={labelClass}>{t('fullName')}</FieldLabel>
            <Input
              id="fullName"
              {...register('fullName', { required: t('fullNameRequired') })}
              disabled={isSubmitting}
              className={inputClass}
            />
            <FieldError>{errors.fullName?.message}</FieldError>
          </Field>

          <Field className="sm:col-span-2">
            <FieldLabel htmlFor="company" className={labelClass}>{t('company')}</FieldLabel>
            <Input id="company" {...register('company')} disabled={isSubmitting} className={inputClass} />
          </Field>

          <Field className="sm:col-span-2">
            <FieldLabel htmlFor="streetLine1" className={labelClass}>{t('streetAddress')}</FieldLabel>
            <Input
              id="streetLine1"
              {...register('streetLine1', { required: t('streetRequired') })}
              disabled={isSubmitting}
              className={inputClass}
            />
            <FieldError>{errors.streetLine1?.message}</FieldError>
          </Field>

          <Field className="sm:col-span-2">
            <FieldLabel htmlFor="streetLine2" className={labelClass}>{t('apartment')}</FieldLabel>
            <Input id="streetLine2" {...register('streetLine2')} disabled={isSubmitting} className={inputClass} />
          </Field>

          <Field>
            <FieldLabel htmlFor="city" className={labelClass}>{t('city')}</FieldLabel>
            <Input
              id="city"
              {...register('city', { required: t('cityRequired') })}
              disabled={isSubmitting}
              className={inputClass}
            />
            <FieldError>{errors.city?.message}</FieldError>
          </Field>

          <Field>
            <FieldLabel htmlFor="province" className={labelClass}>{t('stateProvince')}</FieldLabel>
            <Input
              id="province"
              {...register('province', { required: t('stateProvinceRequired') })}
              disabled={isSubmitting}
              className={inputClass}
            />
            <FieldError>{errors.province?.message}</FieldError>
          </Field>

          <Field>
            <FieldLabel htmlFor="postalCode" className={labelClass}>{t('postalCode')}</FieldLabel>
            <Input
              id="postalCode"
              {...register('postalCode', { required: t('postalCodeRequired') })}
              disabled={isSubmitting}
              className={inputClass}
            />
            <FieldError>{errors.postalCode?.message}</FieldError>
          </Field>

          <Field>
            <FieldLabel htmlFor="countryCode" className={labelClass}>{t('country')}</FieldLabel>
            <Controller
              name="countryCode"
              control={control}
              rules={{ required: t('countryRequired') }}
              render={({ field }) => (
                <CountrySelect
                  countries={countries}
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isSubmitting}
                />
              )}
            />
            <FieldError>{errors.countryCode?.message}</FieldError>
          </Field>

          <Field className="sm:col-span-2">
            <FieldLabel htmlFor="phoneNumber" className={labelClass}>{t('phoneNumberField')}</FieldLabel>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="+237 6XX XX XX XX"
              {...register('phoneNumber', { required: t('phoneRequired') })}
              disabled={isSubmitting}
              className={inputClass}
            />
            <FieldError>{errors.phoneNumber?.message}</FieldError>
          </Field>
        </div>
      </FieldGroup>

      <div className="flex gap-3 justify-end pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-xl h-11 border-[#EAE6DF] dark:border-[#3A291C]"
        >
          {t('cancel')}
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl h-11 bg-[#0F291E] hover:bg-[#1A3D2E] text-white shadow-xs px-6"
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {address ? t('updateAddress') : t('saveAddress')}
        </Button>
      </div>
    </form>
  );
}
