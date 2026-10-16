'use client';

import { useState, useEffect } from 'react';
import { Accordion } from '@/components/ui/accordion';
import OrderSummary from './order-summary';
import { useCheckout } from './checkout-provider';
import { useTranslations } from 'next-intl';
import {
  CheckoutStepShell,
  StepProgressIndicator,
} from '../steps/CheckoutStepShell';
import {
  checkoutSteps,
  getStepOrder,
  getInitialState,
  type CheckoutStep,
} from '../steps';

export default function CheckoutFlow() {
  const t = useTranslations('Checkout');
  const { order, isGuest } = useCheckout();

  const stepOrder = getStepOrder(isGuest);
  const initialState = getInitialState(stepOrder, order, isGuest);

  const [currentStep, setCurrentStep] = useState<CheckoutStep>(initialState.current);
  const [completedSteps, setCompletedSteps] = useState<Set<CheckoutStep>>(initialState.completed);
  const [announcement, setAnnouncement] = useState<string>('');

  const stepLabels: Record<CheckoutStep, string> = {
    contact: t('steps.contact'),
    shipping: t('steps.address'),
    delivery: t('steps.delivery'),
    payment: t('steps.payment'),
    review: t('steps.review'),
  };

  // Announce step changes for screen readers
  useEffect(() => {
    setAnnouncement(
      `${t('step')} ${stepOrder.indexOf(currentStep) + 1} of ${stepOrder.length}: ${stepLabels[currentStep]}`
    );
  }, [currentStep, stepOrder, t]);

  const handleStepComplete = (step: CheckoutStep) => {
    setCompletedSteps((prev) => new Set([...prev, step]));

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

  const activeStepConfigs = checkoutSteps.filter((s) => !s.guestOnly || isGuest);

  return (
    <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-start">
      {/* ARIA live region for step announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only" role="status">
        {announcement}
      </div>

      <div className="lg:col-span-7 xl:col-span-8 min-w-0 space-y-6">
        {/* Step Progress Indicator with ARIA attributes and GSAP interaction */}
        <StepProgressIndicator
          stepOrder={stepOrder}
          completedSteps={completedSteps}
          currentStep={currentStep}
          canAccessStep={canAccessStep}
          onStepClick={(step) => canAccessStep(step) && setCurrentStep(step)}
        />

        {/* Step Accordion managed via modular CheckoutStepShell */}
        <Accordion
          value={[currentStep]}
          onValueChange={(value) => {
            const step = value[0] as CheckoutStep | undefined;
            if (step && canAccessStep(step)) {
              setCurrentStep(step);
            }
          }}
          className="space-y-5 sm:space-y-6"
        >
          {activeStepConfigs.map((stepConfig) => {
            const StepComponent = stepConfig.component;
            const isCompleted = completedSteps.has(stepConfig.key);
            const isCurrent = currentStep === stepConfig.key;
            const canAccess = canAccessStep(stepConfig.key);
            const stepNumber = stepOrder.indexOf(stepConfig.key) + 1;

            return (
              <CheckoutStepShell
                key={stepConfig.key}
                step={stepConfig}
                isCompleted={isCompleted}
                isCurrent={isCurrent}
                canAccess={canAccess}
                stepNumber={stepNumber}
                onClick={() => canAccess && setCurrentStep(stepConfig.key)}
              >
                <StepComponent
                  onComplete={() => handleStepComplete(stepConfig.key)}
                  onEditStep={setCurrentStep}
                />
              </CheckoutStepShell>
            );
          })}
        </Accordion>
      </div>

      <div className="lg:col-span-5 xl:col-span-4 min-w-0">
        <OrderSummary />
      </div>
    </div>
  );
}