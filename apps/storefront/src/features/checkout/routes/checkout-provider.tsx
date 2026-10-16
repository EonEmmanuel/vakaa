'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { CheckoutOrder } from './types';

export interface CustomerAddress {
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

export interface Country {
  id: string;
  code: string;
  name: string;
}

export interface ShippingMethod {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  priceWithTax: number;
}

export interface PaymentMethod {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  isEligible: boolean;
  eligibilityMessage?: string | null;
}

interface CheckoutContextType {
  order: CheckoutOrder;
  setOrder: React.Dispatch<React.SetStateAction<CheckoutOrder>>;
  updateOrder: (patch: Partial<CheckoutOrder>) => void;
  addresses: CustomerAddress[];
  setAddresses: React.Dispatch<React.SetStateAction<CustomerAddress[]>>;
  addCustomerAddress: (address: CustomerAddress) => void;
  countries: Country[];
  detectedCountryCode?: string;
  shippingMethods: ShippingMethod[];
  setShippingMethods: React.Dispatch<React.SetStateAction<ShippingMethod[]>>;
  paymentMethods: PaymentMethod[];
  selectedPaymentMethodCode: string | null;
  setSelectedPaymentMethodCode: (code: string | null) => void;
  paymentMetadata: Record<string, unknown>;
  setPaymentMetadata: React.Dispatch<React.SetStateAction<Record<string, unknown>>>;
  isGuest: boolean;
}

const CheckoutContext = createContext<CheckoutContextType | null>(null);

interface CheckoutProviderProps {
  children: ReactNode;
  order: CheckoutOrder;
  addresses: CustomerAddress[];
  countries: Country[];
  detectedCountryCode?: string;
  shippingMethods: ShippingMethod[];
  paymentMethods: PaymentMethod[];
  isGuest: boolean;
}

export function CheckoutProvider({
  children,
  order: initialOrder,
  addresses: initialAddresses,
  countries,
  detectedCountryCode,
  shippingMethods: initialShippingMethods,
  paymentMethods,
  isGuest,
}: CheckoutProviderProps) {
  const [order, setOrder] = useState<CheckoutOrder>(initialOrder);
  const [addresses, setAddresses] = useState<CustomerAddress[]>(initialAddresses);
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>(initialShippingMethods);
  const [selectedPaymentMethodCode, setSelectedPaymentMethodCode] = useState<string | null>(
    paymentMethods.length === 1 ? paymentMethods[0].code : null
  );
  const [paymentMetadata, setPaymentMetadata] = useState<Record<string, unknown>>({});

  // Synchronize state if props change (e.g. background RSC reload)
  useEffect(() => {
    setOrder(initialOrder);
  }, [initialOrder]);

  useEffect(() => {
    setAddresses(initialAddresses);
  }, [initialAddresses]);

  useEffect(() => {
    setShippingMethods(initialShippingMethods);
  }, [initialShippingMethods]);

  const updateOrder = (patch: Partial<CheckoutOrder>) => {
    setOrder((prev) => ({
      ...prev,
      ...patch,
    }));
  };

  const addCustomerAddress = (newAddress: CustomerAddress) => {
    setAddresses((prev) => {
      const exists = prev.some((a) => a.id === newAddress.id);
      if (exists) {
        return prev.map((a) => (a.id === newAddress.id ? newAddress : a));
      }
      return [...prev, newAddress];
    });
  };

  return (
    <CheckoutContext.Provider
      value={{
        order,
        setOrder,
        updateOrder,
        addresses,
        setAddresses,
        addCustomerAddress,
        countries,
        detectedCountryCode,
        shippingMethods,
        setShippingMethods,
        paymentMethods,
        selectedPaymentMethodCode,
        setSelectedPaymentMethodCode,
        paymentMetadata,
        setPaymentMetadata,
        isGuest,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error('useCheckout must be used within CheckoutProvider');
  }
  return context;
}
