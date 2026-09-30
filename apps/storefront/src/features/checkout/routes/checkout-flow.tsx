'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import ContactStep from './steps/contact-step';
import ShippingAddressStep from './steps/shipping-address-step';
import DeliveryStep from './steps/delivery-step';
import PaymentStep from './steps/payment-step';
import ReviewStep from './steps/review-step';
import OrderSummary from './order-summary';
import { useCheckout } from './checkout-provider';
import { useTranslations } from 'next-intl';

type CheckoutStep = 'contact' | 'shipping' | 'delivery' | 'payment' | 'review';

export default function CheckoutFlow() {
  const t = useTranslations('Checkout');
  const { order, isGuest } = useCheckout();

  const getStepOrder = (): CheckoutStep[] => {
    if (isGuest) {
      return ['contact', 'shipping', 'delivery', 'payment', 'review'];
    }
    return ['shipping', 'delivery', 'payment', 'review'];
  };

  const stepOrder = getStepOrder();

  const getInitialState = () => {
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
  };

  const initialState = getInitialState();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>(initialState.current);
  const [completedSteps, setCompletedSteps] = useState<Set<CheckoutStep>>(initialState.completed);

  const handleStepComplete = (step: CheckoutStep) => {
    setCompletedSteps(prev => new Set([...prev, step]));

    const currentIndex = stepOrder.indexOf(step);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  };

  const canAccessStep = (step: CheckoutStep): boolean => {
    const stepIndex = stepOrder.indexOf(step);

    if (stepIndex === 0) return true;

    const previousStep = stepOrder[stepIndex - 1];
    return completedSteps.has(previousStep);
  };

  const getStepNumber = (step: CheckoutStep): number => {
    return stepOrder.indexOf(step) + 1;
  };

  const stepLabels: Record<CheckoutStep, string> = {
    contact: t('steps.contact'),
    shipping: t('steps.address'),
    delivery: t('steps.delivery'),
    payment: t('steps.payment'),
    review: t('steps.review'),
  };

  return (
    <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
      <div className="lg:col-span-8 space-y-6">
        {/* Step Progress Indicator */}
        <div className="mb-6 p-4 sm:p-6 bg-white dark:bg-[#1A120B] rounded-2xl border border-stone-200/80 dark:border-stone-800 shadow-xs hidden sm:block">
          <div className="flex items-center justify-between">
            {stepOrder.map((step, index) => {
              const isCompleted = completedSteps.has(step);
              const isCurrent = currentStep === step;

              return (
                <div key={step} className="flex items-center flex-1 last:flex-0">
                  <div className="flex flex-col items-center gap-1.5">
                    <button
                      type="button"
                      disabled={!canAccessStep(step)}
                      onClick={() => canAccessStep(step) && setCurrentStep(step)}
                      className={`flex items-center justify-center w-9 h-9 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer disabled:cursor-not-allowed ${
                        isCompleted
                          ? 'bg-[#1B3B2B] text-white hover:bg-[#152e22]'
                          : isCurrent
                          ? 'bg-[#1B3B2B] text-white ring-4 ring-[#1B3B2B]/20 scale-105'
                          : 'bg-[#F3EFE9] dark:bg-stone-800 text-stone-500'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="h-4 w-4" strokeWidth={2.5} />
                      ) : (
                        getStepNumber(step)
                      )}
                    </button>
                    <span className={`text-xs font-medium whitespace-nowrap transition-colors ${
                      isCurrent
                        ? 'text-[#1B3B2B] dark:text-[#D4A43C] font-semibold'
                        : isCompleted
                        ? 'text-stone-800 dark:text-stone-200'
                        : 'text-stone-400'
                    }`}>
                      {stepLabels[step]}
                    </span>
                  </div>
                  {index < stepOrder.length - 1 && (
                    <div className="flex-1 mx-3 mb-5">
                      <div className={`h-0.5 w-full transition-colors duration-200 ${
                        isCompleted ? 'bg-[#1B3B2B]' : 'bg-stone-200 dark:bg-stone-800'
                      }`} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <Accordion
          value={[currentStep]}
          onValueChange={(value) => {
            const step = value[0] as CheckoutStep | undefined;
            if (step && canAccessStep(step)) {
              setCurrentStep(step);
            }
          }}
          className="space-y-4"
        >
          {isGuest && (
            <AccordionItem
              value="contact"
              className="bg-white dark:bg-[#1A120B] rounded-2xl border border-stone-200/80 dark:border-stone-800 px-6 py-2 shadow-xs transition-colors"
            >
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3.5">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all ${
                    completedSteps.has('contact')
                      ? 'bg-[#1B3B2B] text-white'
                      : currentStep === 'contact'
                      ? 'bg-[#1B3B2B] text-white ring-4 ring-[#1B3B2B]/15'
                      : 'bg-[#F3EFE9] dark:bg-stone-800 text-stone-500'
                  }`}>
                    {completedSteps.has('contact') ? <Check className="w-4 h-4" strokeWidth={2.5} /> : getStepNumber('contact')}
                  </div>
                  <span className="text-base sm:text-lg font-semibold text-stone-900 dark:text-stone-100">
                    {t('contactInformation')}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-6">
                <ContactStep
                  onComplete={() => handleStepComplete('contact')}
                />
              </AccordionContent>
            </AccordionItem>
          )}

          <AccordionItem
            value="shipping"
            className="bg-white dark:bg-[#1A120B] rounded-2xl border border-stone-200/80 dark:border-stone-800 px-6 py-2 shadow-xs transition-colors"
            disabled={!canAccessStep('shipping')}
          >
            <AccordionTrigger
              className="hover:no-underline py-4"
              disabled={!canAccessStep('shipping')}
            >
              <div className="flex items-center gap-3.5">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all ${
                  completedSteps.has('shipping')
                    ? 'bg-[#1B3B2B] text-white'
                    : currentStep === 'shipping'
                    ? 'bg-[#1B3B2B] text-white ring-4 ring-[#1B3B2B]/15'
                    : 'bg-[#F3EFE9] dark:bg-stone-800 text-stone-500'
                }`}>
                  {completedSteps.has('shipping') ? <Check className="w-4 h-4" strokeWidth={2.5} /> : getStepNumber('shipping')}
                </div>
                <span className="text-base sm:text-lg font-semibold text-stone-900 dark:text-stone-100">
                  {t('shippingAddress')}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-6">
              <ShippingAddressStep
                onComplete={() => handleStepComplete('shipping')}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="delivery"
            className="bg-white dark:bg-[#1A120B] rounded-2xl border border-stone-200/80 dark:border-stone-800 px-6 py-2 shadow-xs transition-colors"
            disabled={!canAccessStep('delivery')}
          >
            <AccordionTrigger
              className="hover:no-underline py-4"
              disabled={!canAccessStep('delivery')}
            >
              <div className="flex items-center gap-3.5">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all ${
                  completedSteps.has('delivery')
                    ? 'bg-[#1B3B2B] text-white'
                    : currentStep === 'delivery'
                    ? 'bg-[#1B3B2B] text-white ring-4 ring-[#1B3B2B]/15'
                    : 'bg-[#F3EFE9] dark:bg-stone-800 text-stone-500'
                }`}>
                  {completedSteps.has('delivery') ? <Check className="w-4 h-4" strokeWidth={2.5} /> : getStepNumber('delivery')}
                </div>
                <span className="text-base sm:text-lg font-semibold text-stone-900 dark:text-stone-100">
                  {t('deliveryMethod')}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-6">
              <DeliveryStep
                onComplete={() => handleStepComplete('delivery')}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="payment"
            className="bg-white dark:bg-[#1A120B] rounded-2xl border border-stone-200/80 dark:border-stone-800 px-6 py-2 shadow-xs transition-colors"
            disabled={!canAccessStep('payment')}
          >
            <AccordionTrigger
              className="hover:no-underline py-4"
              disabled={!canAccessStep('payment')}
            >
              <div className="flex items-center gap-3.5">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all ${
                  completedSteps.has('payment')
                    ? 'bg-[#1B3B2B] text-white'
                    : currentStep === 'payment'
                    ? 'bg-[#1B3B2B] text-white ring-4 ring-[#1B3B2B]/15'
                    : 'bg-[#F3EFE9] dark:bg-stone-800 text-stone-500'
                }`}>
                  {completedSteps.has('payment') ? <Check className="w-4 h-4" strokeWidth={2.5} /> : getStepNumber('payment')}
                </div>
                <span className="text-base sm:text-lg font-semibold text-stone-900 dark:text-stone-100">
                  {t('paymentMethod')}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-6">
              <PaymentStep
                onComplete={() => handleStepComplete('payment')}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="review"
            className="bg-white dark:bg-[#1A120B] rounded-2xl border border-stone-200/80 dark:border-stone-800 px-6 py-2 shadow-xs transition-colors"
            disabled={!canAccessStep('review')}
          >
            <AccordionTrigger
              className="hover:no-underline py-4"
              disabled={!canAccessStep('review')}
            >
              <div className="flex items-center gap-3.5">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${
                  currentStep === 'review'
                    ? 'bg-[#1B3B2B] text-white ring-4 ring-[#1B3B2B]/15'
                    : 'bg-[#F3EFE9] dark:bg-stone-800 text-stone-500'
                }`}>
                  {getStepNumber('review')}
                </div>
                <span className="text-base sm:text-lg font-semibold text-stone-900 dark:text-stone-100">
                  {t('reviewAndPlaceOrder')}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-6">
              <ReviewStep
                onEditStep={setCurrentStep}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="lg:col-span-4">
        <OrderSummary />
      </div>
    </div>
  );
}
