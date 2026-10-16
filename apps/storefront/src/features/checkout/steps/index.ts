import React from 'react';

/**
 * Checkout Step Registry — Centralized step configuration
 * Single source of truth for step order, components, and metadata
 */

export type CheckoutStep = 'contact' | 'shipping' | 'delivery' | 'payment' | 'review';

export interface CheckoutStepProps {
  onComplete: () => void;
  onEditStep?: (step: CheckoutStep) => void;
}

export interface CheckoutStepConfig {
  key: CheckoutStep;
  label: string;
  component: React.ComponentType<CheckoutStepProps>;
  guestOnly?: boolean;
  isFinal?: boolean;
  canSkip?: (context: CheckoutContext) => boolean;
}

export interface CheckoutContext {
  isGuest: boolean;
  order: {
    customer?: { emailAddress?: string | null; firstName?: string | null; lastName?: string | null } | null;
    shippingAddress?: { streetLine1?: string | null; country?: string | null } | null;
    shippingLines?: Array<{ shippingMethod?: { id?: string | null } | null }> | null;
    selectedPaymentMethodCode?: string | null;
  };
}

// Direct imports for reliable bundling
import ContactStep from './contact-step';
import ShippingAddressStep from './shipping-address-step';
import DeliveryStep from './delivery-step';
import PaymentStep from './payment-step';
import ReviewStep from './review-step';

export const checkoutSteps: CheckoutStepConfig[] = [
  {
    key: 'contact',
    label: 'steps.contact',
    component: ContactStep,
    guestOnly: true,
  },
  {
    key: 'shipping',
    label: 'steps.address',
    component: ShippingAddressStep,
  },
  {
    key: 'delivery',
    label: 'steps.delivery',
    component: DeliveryStep,
  },
  {
    key: 'payment',
    label: 'steps.payment',
    component: PaymentStep,
  },
  {
    key: 'review',
    label: 'steps.review',
    component: ReviewStep,
    isFinal: true,
  },
];

export function getCheckoutSteps(): CheckoutStepConfig[] {
  return checkoutSteps;
}

/**
 * Get step order based on guest/authenticated state
 */
export function getStepOrder(isGuest: boolean): CheckoutStep[] {
  if (isGuest) {
    return ['contact', 'shipping', 'delivery', 'payment', 'review'];
  }
  return ['shipping', 'delivery', 'payment', 'review'];
}

/**
 * Get initial completed steps and current step from order state
 */
export function getInitialState(
  stepOrder: CheckoutStep[],
  order: CheckoutContext['order'],
  isGuest: boolean
): { completed: Set<CheckoutStep>; current: CheckoutStep } {
  const completed = new Set<CheckoutStep>();
  let current: CheckoutStep = stepOrder[0];

  if (isGuest) {
    if (order.customer?.emailAddress) {
      completed.add('contact');
      current = 'shipping';
    }
  }

  if (order.shippingAddress?.streetLine1 && order.shippingAddress?.country) {
    if (!isGuest || completed.has('contact')) {
      completed.add('shipping');
      current = 'delivery';
    }
  }

  if (order.shippingLines && order.shippingLines.length > 0) {
    if (completed.has('shipping')) {
      completed.add('delivery');
      current = 'payment';
    }
  }

  return { completed, current };
}
