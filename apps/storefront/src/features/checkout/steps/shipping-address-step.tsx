'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { Loader2, Plus, MapPin } from 'lucide-react';
import { useRouter } from '@/platform/i18n/navigation';
import { useCheckout } from '@/features/checkout/routes/checkout-provider';
import { setShippingAddress, createCustomerAddress } from '@/features/checkout/routes/actions';
import { CountrySelect } from '@/components/ui/country-select';
import { useTranslations } from 'next-intl';
import { FormField } from '@/components/ui/form-field';

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

const inputClass =
  'h-12 rounded-xl px-4 border-[#E7DED0] dark:border-stone-700 ' +
  'bg-white dark:bg-[#1A120B] text-sm focus:outline-none ' +
  'focus:border-[#D4A43C] dark:focus:border-[#D4A43C] ' +
  'focus:ring-1 focus:ring-[#D4A43C]/20 transition-all';

export default function ShippingAddressStep({ onComplete }: ShippingAddressStepProps) {
  const t = useTranslations('Checkout');
  const router = useRouter();
  const {
    addresses,
    countries,
    detectedCountryCode,
    order,
    isGuest,
    updateOrder,
    addCustomerAddress,
    setShippingMethods,
  } = useCheckout();
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

  const addressForm = useForm<AddressFormData>({
    defaultValues: getDefaultFormValues()
  });
  const { handleSubmit, reset, control } = addressForm;

  const handleSelectExistingAddress = async () => {
    if (!selectedAddressId) return;

    setLoading(true);
    try {
      const selectedAddress = addresses.find(a => a.id === selectedAddressId);
      if (!selectedAddress) return;

      const result = await setShippingAddress({
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

      if (result.success) {
        updateOrder({
          shippingAddress: result.shippingAddress,
          billingAddress: result.billingAddress || (useSameForBilling ? result.shippingAddress : undefined),
        });
        if (result.shippingMethods && result.shippingMethods.length > 0) {
          setShippingMethods(result.shippingMethods);
        }
        onComplete();
      }
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
      addCustomerAddress(newAddress);
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
      const result = await setShippingAddress(data, useSameForBilling);
      if (result.success) {
        updateOrder({
          shippingAddress: result.shippingAddress,
          billingAddress: result.billingAddress || (useSameForBilling ? result.shippingAddress : undefined),
        });
        if (result.shippingMethods && result.shippingMethods.length > 0) {
          setShippingMethods(result.shippingMethods);
        }
        onComplete();
      }
    } catch (error) {
      console.error('Error setting address:', error);
    } finally {
      setLoading(false);
    }
  };

  if (isGuest) {
    return (
      <FormProvider {...addressForm}>
        <div className="space-y-6">
          <form onSubmit={handleSubmit(onSubmitGuestAddress)}>
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div className="sm:col-span-2">
                  <FormField
                    name="fullName"
                    label={t('fullName')}
                    type="text"
                    placeholder="ex. Leslie Cooper"
                    required
                    className={inputClass}
                  />
                </div>

                <div className="sm:col-span-2">
                  <FormField
                    name="company"
                    label={`${t('company')} (Optionnel)`}
                    type="text"
                    placeholder="ex. Entreprise / Atelier"
                    className={inputClass}
                  />
                </div>

                <div className="sm:col-span-2">
                  <FormField
                    name="streetLine1"
                    label={t('streetAddress')}
                    type="text"
                    placeholder="ex. 124 Boulevard de la Liberté, Akwa"
                    required
                    className={inputClass}
                  />
                </div>

                <div className="sm:col-span-2">
                  <FormField
                    name="streetLine2"
                    label={`${t('apartment')} (Optionnel)`}
                    type="text"
                    placeholder="ex. Étage 2, Porte 4"
                    className={inputClass}
                  />
                </div>

                <div>
                  <FormField
                    name="city"
                    label={t('city')}
                    type="text"
                    placeholder="ex. Douala"
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <FormField
                    name="province"
                    label={t('stateProvince')}
                    type="text"
                    placeholder="ex. Littoral"
                    className={inputClass}
                  />
                </div>

                <div>
                  <FormField
                    name="postalCode"
                    label={t('postalCode')}
                    type="text"
                    placeholder="ex. BP 1240"
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <FormField
                    name="countryCode"
                    label={t('country')}
                    required
                    className={inputClass}
                    asChild
                  >
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
                  </FormField>
                </div>

                <div className="sm:col-span-2">
                  <FormField
                    name="phoneNumber"
                    label={t('phoneNumber')}
                    type="tel"
                    placeholder="ex. +237 6XX XX XX XX"
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
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
        </div>
      </FormProvider>
    );
  }

  return (
    <FormProvider {...addressForm}>
      <div className="space-y-6">
        {addresses.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-sm sm:text-base text-stone-900 dark:text-stone-100">
              {t('selectSavedAddress')}
            </h3>
            <RadioGroup value={selectedAddressId || ''} onValueChange={setSelectedAddressId} className="space-y-3.5">
              {addresses.map((address) => {
                const isSelected = selectedAddressId === address.id;
                return (
                  <div key={address.id} className="block">
                    <Label htmlFor={address.id} className="cursor-pointer block">
                      <div
                        className={`p-5 sm:p-6 rounded-2xl border transition-all ${
                          isSelected
                            ? 'border-[#1D120A] bg-[#FAF8F5] dark:bg-[#1B3B2B]/10 ring-1 ring-[#1D120A] shadow-xs'
                            : 'border-[#E7DED0]/80 dark:border-stone-800 bg-white dark:bg-[#1A120B] hover:border-stone-300'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                          <div className="size-10 rounded-2xl bg-[#F3EFE9] dark:bg-stone-800 flex items-center justify-center shrink-0">
                            <MapPin className="h-4 w-4 text-[#A66B2D]" />
                          </div>
                          <div className="min-w-0 flex-1 space-y-1 text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                            <p className="font-semibold text-stone-900 dark:text-stone-100 text-sm sm:text-base">{address.fullName}</p>
                            {address.company && <p className="text-stone-500">{address.company}</p>}
                            <p>
                              {address.streetLine1}
                              {address.streetLine2 && `, ${address.streetLine2}`}
                            </p>
                            <p>
                              {address.city}, {address.province} {address.postalCode}
                            </p>
                            <p className="font-medium text-stone-800 dark:text-stone-200">{address.country.name}</p>
                            <p className="font-mono text-stone-700 dark:text-stone-300 pt-0.5">{address.phoneNumber}</p>
                          </div>
                        </div>
                      </div>
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>

            <div className="flex items-center space-x-2 pt-3">
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

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={handleSelectExistingAddress}
                disabled={!selectedAddressId || loading}
                className="h-12 px-9 rounded-full bg-[#1D120A] text-[#FAF8F5] hover:bg-[#3A2418] dark:bg-[#FAF8F5] dark:text-[#1D120A] font-semibold transition-all"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('continueWithSelected')}
              </Button>

              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger render={
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 px-6 rounded-full border-[#E7DED0] hover:border-[#D4A43C] flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    {t('addNewAddress')}
                  </Button>
                } />
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl">
                  <form onSubmit={handleSubmit(onSaveNewAddress)}>
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold">{t('addNewAddress')}</DialogTitle>
                      <DialogDescription>
                        {t('addNewAddressDescription')}
                      </DialogDescription>
                    </DialogHeader>

                    <div className="my-6 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                        <div className="sm:col-span-2">
                          <FormField
                            name="fullName"
                            label={t('fullNameLabel')}
                            required
                            className={inputClass}
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <FormField
                            name="company"
                            label={t('company')}
                            className={inputClass}
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <FormField
                            name="streetLine1"
                            label={t('streetAddress')}
                            required
                            className={inputClass}
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <FormField
                            name="streetLine2"
                            label={t('apartment')}
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <FormField
                            name="city"
                            label={t('cityLabel')}
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <FormField
                            name="province"
                            label={t('stateProvince')}
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <FormField
                            name="postalCode"
                            label={t('postalCodeLabel')}
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <FormField
                            name="countryCode"
                            label={t('country')}
                            required
                            className={inputClass}
                            asChild
                          >
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
                          </FormField>
                        </div>

                        <div className="sm:col-span-2">
                          <FormField
                            name="phoneNumber"
                            label={t('phoneNumberLabel')}
                            type="tel"
                            className={inputClass}
                          />
                        </div>
                      </div>
                    </div>

                    <DialogFooter className="gap-2">
                      <Button type="button" variant="outline" className="rounded-full" onClick={() => setDialogOpen(false)} disabled={saving}>
                        {t('cancel')}
                      </Button>
                      <Button
                        type="submit"
                        disabled={saving}
                        className="h-11 px-7 rounded-full bg-[#1D120A] text-[#FAF8F5] hover:bg-[#3A2418] dark:bg-[#FAF8F5] dark:text-[#1D120A] font-semibold"
                      >
                        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {t('saveAddress')}
                      </Button>
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
              <Button
                type="button"
                className="w-full sm:w-auto h-12 px-8 rounded-full bg-[#1D120A] text-[#FAF8F5] hover:bg-[#3A2418] dark:bg-[#FAF8F5] dark:text-[#1D120A] font-semibold"
              >
                {t('addShippingAddress')}
              </Button>
            } />
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl">
              <form onSubmit={handleSubmit(onSaveNewAddress)}>
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">{t('addShippingAddress')}</DialogTitle>
                  <DialogDescription>
                    {t('addShippingAddressDescription')}
                  </DialogDescription>
                </DialogHeader>

                <div className="my-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div className="sm:col-span-2">
                      <FormField
                        name="fullName"
                        label={t('fullNameLabel')}
                        required
                        className={inputClass}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <FormField
                        name="company"
                        label={t('company')}
                        className={inputClass}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <FormField
                        name="streetLine1"
                        label={t('streetAddress')}
                        required
                        className={inputClass}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <FormField
                        name="streetLine2"
                        label={t('apartment')}
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <FormField
                        name="city"
                        label={t('cityLabel')}
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <FormField
                        name="province"
                        label={t('stateProvince')}
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <FormField
                        name="postalCode"
                        label={t('postalCodeLabel')}
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <FormField
                        name="countryCode"
                        label={t('country')}
                        required
                        className={inputClass}
                        asChild
                      >
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
                      </FormField>
                    </div>

                    <div className="sm:col-span-2">
                      <FormField
                        name="phoneNumber"
                        label={t('phoneNumberLabel')}
                        type="tel"
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    type="submit"
                    disabled={saving}
                    className="w-full h-12 rounded-full bg-[#1D120A] text-[#FAF8F5] hover:bg-[#3A2418] dark:bg-[#FAF8F5] dark:text-[#1D120A] font-semibold"
                  >
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t('saveAddress')}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </FormProvider>
  );
}