'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Field, FieldLabel, FieldError, FieldGroup } from '@/components/ui/field';
import { useForm, Controller } from 'react-hook-form';
import { Loader2, Plus, MapPin } from 'lucide-react';
import { useRouter } from '@/platform/i18n/navigation';
import { useCheckout } from '../checkout-provider';
import { setShippingAddress, createCustomerAddress } from '../actions';
import { CountrySelect } from '@/components/ui/country-select';
import { useTranslations } from 'next-intl';

interface ShippingAddressStepProps {
  onComplete: () => void;
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

const inputClass = "h-11 rounded-full px-5 border-stone-200 dark:border-stone-700 bg-white dark:bg-[#1A120B] text-sm focus:outline-none focus:border-[#1B3B2B] dark:focus:border-[#D4A43C] focus:ring-1 focus:ring-[#1B3B2B] dark:focus:ring-[#D4A43C] transition-all";

export default function ShippingAddressStep({ onComplete }: ShippingAddressStepProps) {
  const t = useTranslations('Checkout');
  const router = useRouter();
  const { addresses, countries, detectedCountryCode, order, isGuest } = useCheckout();
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(() => {
    if (order.shippingAddress) {
      const matchingAddress = addresses.find(
        (a) =>
          a.streetLine1 === order.shippingAddress?.streetLine1 &&
          a.postalCode === order.shippingAddress?.postalCode
      );
      if (matchingAddress) return matchingAddress.id;
    }
    const defaultAddress = addresses.find((a) => a.defaultShippingAddress);
    return defaultAddress?.id || null;
  });
  const [dialogOpen, setDialogOpen] = useState(addresses.length === 0 && !isGuest);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [useSameForBilling, setUseSameForBilling] = useState(true);

  const getDefaultFormValues = (): Partial<AddressFormData> => {
    const customerFullName = order.customer
      ? `${order.customer.firstName} ${order.customer.lastName}`.trim()
      : '';

    const initialCountryCode =
      (detectedCountryCode && countries.some(c => c.code.toUpperCase() === detectedCountryCode.toUpperCase()))
        ? detectedCountryCode.toUpperCase()
        : countries.find(c => c.code.toUpperCase() === 'CM')?.code
        || countries[0]?.code
        || 'CM';

    if (isGuest && order.shippingAddress?.streetLine1) {
      return {
        fullName: order.shippingAddress.fullName || customerFullName,
        streetLine1: order.shippingAddress.streetLine1 || '',
        streetLine2: order.shippingAddress.streetLine2 || '',
        city: order.shippingAddress.city || '',
        province: order.shippingAddress.province || '',
        postalCode: order.shippingAddress.postalCode || '',
        countryCode: countries.find(c => c.name === order.shippingAddress?.country)?.code || initialCountryCode,
        phoneNumber: order.shippingAddress.phoneNumber || order.customer?.phoneNumber || '',
        company: order.shippingAddress.company || '',
      };
    }
    return {
      fullName: customerFullName,
      countryCode: initialCountryCode,
      phoneNumber: order.customer?.phoneNumber || '',
    };
  };

  const { register, handleSubmit, formState: { errors }, reset, control } = useForm<AddressFormData>({
    defaultValues: getDefaultFormValues()
  });

  const handleSelectExistingAddress = async () => {
    if (!selectedAddressId) return;

    setLoading(true);
    try {
      const selectedAddress = addresses.find(a => a.id === selectedAddressId);
      if (!selectedAddress) return;

      await setShippingAddress({
        fullName: selectedAddress.fullName || '',
        company: selectedAddress.company || '',
        streetLine1: selectedAddress.streetLine1,
        streetLine2: selectedAddress.streetLine2 || '',
        city: selectedAddress.city || '',
        province: selectedAddress.province || '',
        postalCode: selectedAddress.postalCode || '',
        countryCode: selectedAddress.country.code,
        phoneNumber: selectedAddress.phoneNumber || '',
      }, useSameForBilling);

      router.refresh();
      onComplete();
    } catch (error) {
      console.error('Error setting address:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSaveNewAddress = async (data: AddressFormData) => {
    setSaving(true);
    try {
      const newAddress = await createCustomerAddress(data);
      setDialogOpen(false);
      reset();
      router.refresh();
      setSelectedAddressId(newAddress.id);
    } catch (error) {
      console.error('Error creating address:', error);
      alert(`Error creating address: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  const onSubmitGuestAddress = async (data: AddressFormData) => {
    setLoading(true);
    try {
      await setShippingAddress(data, useSameForBilling);
      router.refresh();
      onComplete();
    } catch (error) {
      console.error('Error setting address:', error);
    } finally {
      setLoading(false);
    }
  };

  if (isGuest) {
    return (
      <div className="space-y-6">
        <form onSubmit={handleSubmit(onSubmitGuestAddress)}>
          <FieldGroup>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field className="sm:col-span-2">
                <FieldLabel htmlFor="fullName" className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                  {t('fullName')}
                </FieldLabel>
                <Input
                  id="fullName"
                  placeholder="ex. Leslie Cooper"
                  className={inputClass}
                  {...register('fullName', { required: t('fullNameRequired') })}
                />
                <FieldError>{errors.fullName?.message}</FieldError>
              </Field>

              <Field className="sm:col-span-2">
                <FieldLabel htmlFor="company" className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                  {t('company')} (Optionnel)
                </FieldLabel>
                <Input
                  id="company"
                  placeholder="ex. Entreprise / Atelier"
                  className={inputClass}
                  {...register('company')}
                />
              </Field>

              <Field className="sm:col-span-2">
                <FieldLabel htmlFor="streetLine1" className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                  {t('streetAddress')}
                </FieldLabel>
                <Input
                  id="streetLine1"
                  placeholder="ex. 124 Boulevard de la Liberté, Akwa"
                  className={inputClass}
                  {...register('streetLine1', { required: t('streetRequired') })}
                />
                <FieldError>{errors.streetLine1?.message}</FieldError>
              </Field>

              <Field className="sm:col-span-2">
                <FieldLabel htmlFor="streetLine2" className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                  {t('apartment')} (Optionnel)
                </FieldLabel>
                <Input
                  id="streetLine2"
                  placeholder="ex. Étage 2, Porte 4"
                  className={inputClass}
                  {...register('streetLine2')}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="city" className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                  {t('city')}
                </FieldLabel>
                <Input
                  id="city"
                  placeholder="ex. Douala"
                  className={inputClass}
                  {...register('city', { required: t('cityRequired') })}
                />
                <FieldError>{errors.city?.message}</FieldError>
              </Field>

              <Field>
                <FieldLabel htmlFor="province" className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                  {t('stateProvince')}
                </FieldLabel>
                <Input
                  id="province"
                  placeholder="ex. Littoral"
                  className={inputClass}
                  {...register('province')}
                />
                <FieldError>{errors.province?.message}</FieldError>
              </Field>

              <Field>
                <FieldLabel htmlFor="postalCode" className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                  {t('postalCode')}
                </FieldLabel>
                <Input
                  id="postalCode"
                  placeholder="ex. BP 1240"
                  className={inputClass}
                  {...register('postalCode', { required: t('postalCodeRequired') })}
                />
                <FieldError>{errors.postalCode?.message}</FieldError>
              </Field>

              <Field>
                <FieldLabel htmlFor="countryCode" className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                  {t('country')}
                </FieldLabel>
                <Controller
                  name="countryCode"
                  control={control}
                  rules={{ required: t('countryRequired') }}
                  render={({ field }) => (
                    <CountrySelect
                      countries={countries}
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={loading}
                    />
                  )}
                />
                <FieldError>{errors.countryCode?.message}</FieldError>
              </Field>

              <Field className="sm:col-span-2">
                <FieldLabel htmlFor="phoneNumber" className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                  {t('phoneNumber')}
                </FieldLabel>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="ex. +237 6XX XX XX XX"
                  className={inputClass}
                  {...register('phoneNumber', { required: t('phoneRequired') })}
                />
                <FieldError>{errors.phoneNumber?.message}</FieldError>
              </Field>
            </div>

            <div className="flex items-center space-x-2 mt-4 pt-2">
              <Checkbox
                id="same-billing-guest"
                checked={useSameForBilling}
                onCheckedChange={(checked) => setUseSameForBilling(checked === true)}
              />
              <label
                htmlFor="same-billing-guest"
                className="text-xs sm:text-sm font-medium leading-none cursor-pointer text-stone-700 dark:text-stone-300"
              >
                {t('useSameForBilling')}
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto h-12 px-8 rounded-full bg-[#1B3B2B] hover:bg-[#152e22] text-white font-semibold text-sm transition-all shadow-sm active:scale-[0.99] disabled:opacity-60 flex items-center justify-center cursor-pointer mt-6"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('continue')}
            </button>
          </FieldGroup>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {addresses.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-sm sm:text-base text-stone-900 dark:text-stone-100">{t('selectSavedAddress')}</h3>
          <RadioGroup value={selectedAddressId || ''} onValueChange={setSelectedAddressId} className="space-y-3">
            {addresses.map((address) => {
              const isSelected = selectedAddressId === address.id;
              return (
                <div key={address.id} className="block">
                  <Label htmlFor={address.id} className="cursor-pointer block">
                    <div
                      className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                        isSelected
                          ? 'border-[#1B3B2B] bg-[#1B3B2B]/5 dark:bg-[#1B3B2B]/10 ring-1 ring-[#1B3B2B] shadow-xs'
                          : 'border-stone-200/80 dark:border-stone-800 bg-white dark:bg-[#1A120B] hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                        <div className="size-9 rounded-full bg-[#F3EFE9] dark:bg-stone-800 flex items-center justify-center shrink-0">
                          <MapPin className="h-4 w-4 text-[#A66B2D]" />
                        </div>
                        <div className="min-w-0 flex-1 space-y-0.5 text-xs sm:text-sm text-stone-600 dark:text-stone-400">
                          <p className="font-semibold text-stone-900 dark:text-stone-100">{address.fullName}</p>
                          {address.company && <p>{address.company}</p>}
                          <p>
                            {address.streetLine1}
                            {address.streetLine2 && `, ${address.streetLine2}`}
                          </p>
                          <p>
                            {address.city}, {address.province} {address.postalCode}
                          </p>
                          <p>{address.country.name}</p>
                          <p className="font-medium text-stone-700 dark:text-stone-300">{address.phoneNumber}</p>
                        </div>
                      </div>
                    </div>
                  </Label>
                </div>
              );
            })}
          </RadioGroup>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="same-billing"
              checked={useSameForBilling}
              onCheckedChange={(checked) => setUseSameForBilling(checked === true)}
            />
            <label
              htmlFor="same-billing"
              className="text-xs sm:text-sm font-medium leading-none cursor-pointer text-stone-700 dark:text-stone-300"
            >
              {t('useSameForBilling')}
            </label>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-3">
            <button
              onClick={handleSelectExistingAddress}
              disabled={!selectedAddressId || loading}
              className="h-12 px-8 rounded-full bg-[#1B3B2B] hover:bg-[#152e22] text-white font-semibold text-sm transition-all shadow-sm active:scale-[0.99] disabled:opacity-60 flex items-center justify-center cursor-pointer"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('continueWithSelected')}
            </button>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger render={
                <button
                  type="button"
                  className="h-12 px-6 rounded-full border border-stone-300 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 font-semibold text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  {t('addNewAddress')}
                </button>
              } />
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl">
                <form onSubmit={handleSubmit(onSaveNewAddress)}>
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold">{t('addNewAddress')}</DialogTitle>
                    <DialogDescription>
                      {t('addNewAddressDescription')}
                    </DialogDescription>
                  </DialogHeader>

                  <FieldGroup className="my-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field className="sm:col-span-2">
                        <FieldLabel htmlFor="fullName">{t('fullNameLabel')}</FieldLabel>
                        <Input
                          id="fullName"
                          className={inputClass}
                          {...register('fullName')}
                        />
                        <FieldError>{errors.fullName?.message}</FieldError>
                      </Field>

                      <Field className="sm:col-span-2">
                        <FieldLabel htmlFor="company">{t('company')}</FieldLabel>
                        <Input id="company" className={inputClass} {...register('company')} />
                      </Field>

                      <Field className="sm:col-span-2">
                        <FieldLabel htmlFor="streetLine1">{t('streetAddress')}</FieldLabel>
                        <Input
                          id="streetLine1"
                          className={inputClass}
                          {...register('streetLine1', { required: t('streetRequired') })}
                        />
                        <FieldError>{errors.streetLine1?.message}</FieldError>
                      </Field>

                      <Field className="sm:col-span-2">
                        <FieldLabel htmlFor="streetLine2">{t('apartment')}</FieldLabel>
                        <Input id="streetLine2" className={inputClass} {...register('streetLine2')} />
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="city">{t('cityLabel')}</FieldLabel>
                        <Input
                          id="city"
                          className={inputClass}
                          {...register('city')}
                        />
                        <FieldError>{errors.city?.message}</FieldError>
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="province">{t('stateProvince')}</FieldLabel>
                        <Input
                          id="province"
                          className={inputClass}
                          {...register('province')}
                        />
                        <FieldError>{errors.province?.message}</FieldError>
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="postalCode">{t('postalCodeLabel')}</FieldLabel>
                        <Input
                          id="postalCode"
                          className={inputClass}
                          {...register('postalCode')}
                        />
                        <FieldError>{errors.postalCode?.message}</FieldError>
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="countryCode">{t('country')}</FieldLabel>
                        <Controller
                          name="countryCode"
                          control={control}
                          rules={{ required: t('countryRequired') }}
                          render={({ field }) => (
                            <CountrySelect
                              countries={countries}
                              value={field.value}
                              onValueChange={field.onChange}
                              disabled={saving}
                            />
                          )}
                        />
                        <FieldError>{errors.countryCode?.message}</FieldError>
                      </Field>

                      <Field className="sm:col-span-2">
                        <FieldLabel htmlFor="phoneNumber">{t('phoneNumberLabel')}</FieldLabel>
                        <Input
                          id="phoneNumber"
                          type="tel"
                          className={inputClass}
                          {...register('phoneNumber')}
                        />
                        <FieldError>{errors.phoneNumber?.message}</FieldError>
                      </Field>
                    </div>
                  </FieldGroup>

                  <DialogFooter className="gap-2">
                    <Button type="button" variant="outline" className="rounded-full" onClick={() => setDialogOpen(false)} disabled={saving}>
                      {t('cancel')}
                    </Button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="h-11 px-6 rounded-full bg-[#1B3B2B] hover:bg-[#152e22] text-white font-semibold text-sm transition-all shadow-sm active:scale-[0.99] flex items-center justify-center cursor-pointer"
                    >
                      {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {t('saveAddress')}
                    </button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}

      {addresses.length === 0 && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger render={
            <button
              type="button"
              className="w-full sm:w-auto h-12 px-8 rounded-full bg-[#1B3B2B] hover:bg-[#152e22] text-white font-semibold text-sm transition-all shadow-sm flex items-center justify-center cursor-pointer"
            >
              {t('addShippingAddress')}
            </button>
          } />
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl">
            <form onSubmit={handleSubmit(onSaveNewAddress)}>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">{t('addShippingAddress')}</DialogTitle>
                <DialogDescription>
                  {t('addShippingAddressDescription')}
                </DialogDescription>
              </DialogHeader>

              <FieldGroup className="my-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field className="sm:col-span-2">
                    <FieldLabel htmlFor="fullName">{t('fullNameLabel')}</FieldLabel>
                    <Input
                      id="fullName"
                      className={inputClass}
                      {...register('fullName')}
                    />
                    <FieldError>{errors.fullName?.message}</FieldError>
                  </Field>

                  <Field className="sm:col-span-2">
                    <FieldLabel htmlFor="company">{t('company')}</FieldLabel>
                    <Input id="company" className={inputClass} {...register('company')} />
                  </Field>

                  <Field className="sm:col-span-2">
                    <FieldLabel htmlFor="streetLine1">{t('streetAddress')}</FieldLabel>
                    <Input
                      id="streetLine1"
                      className={inputClass}
                      {...register('streetLine1', { required: t('streetRequired') })}
                    />
                    <FieldError>{errors.streetLine1?.message}</FieldError>
                  </Field>

                  <Field className="sm:col-span-2">
                    <FieldLabel htmlFor="streetLine2">{t('apartment')}</FieldLabel>
                    <Input id="streetLine2" className={inputClass} {...register('streetLine2')} />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="city">{t('cityLabel')}</FieldLabel>
                    <Input
                      id="city"
                      className={inputClass}
                      {...register('city')}
                    />
                    <FieldError>{errors.city?.message}</FieldError>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="province">{t('stateProvince')}</FieldLabel>
                    <Input
                      id="province"
                      className={inputClass}
                      {...register('province')}
                    />
                    <FieldError>{errors.province?.message}</FieldError>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="postalCode">{t('postalCodeLabel')}</FieldLabel>
                    <Input
                      id="postalCode"
                      className={inputClass}
                      {...register('postalCode')}
                    />
                    <FieldError>{errors.postalCode?.message}</FieldError>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="countryCode">{t('country')}</FieldLabel>
                    <Controller
                      name="countryCode"
                      control={control}
                      rules={{ required: t('countryRequired') }}
                      render={({ field }) => (
                        <CountrySelect
                          countries={countries}
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={saving}
                        />
                      )}
                    />
                    <FieldError>{errors.countryCode?.message}</FieldError>
                  </Field>

                  <Field className="sm:col-span-2">
                    <FieldLabel htmlFor="phoneNumber">{t('phoneNumberLabel')}</FieldLabel>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      className={inputClass}
                      {...register('phoneNumber')}
                    />
                    <FieldError>{errors.phoneNumber?.message}</FieldError>
                  </Field>
                </div>
              </FieldGroup>

              <DialogFooter>
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full h-12 rounded-full bg-[#1B3B2B] hover:bg-[#152e22] text-white font-semibold text-sm transition-all shadow-sm flex items-center justify-center cursor-pointer"
                >
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t('saveAddress')}
                </button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
