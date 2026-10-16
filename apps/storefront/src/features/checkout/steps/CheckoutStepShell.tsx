'use client';

import { useRef } from 'react';
import { Check } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { useGsapMagnetic } from '@/lib/motion/gsap-hooks';
import { useTranslations } from 'next-intl';
import { type CheckoutStep } from './index';

interface CheckoutStepShellProps {
  step: {
    key: CheckoutStep;
    label: string;
  };
  isCompleted: boolean;
  isCurrent: boolean;
  canAccess: boolean;
  stepNumber: number;
  onClick: () => void;
  children: React.ReactNode;
}

export function CheckoutStepShell({
  step,
  isCompleted,
  isCurrent,
  canAccess,
  stepNumber,
  onClick,
  children,
}: CheckoutStepShellProps) {
  const t = useTranslations('Checkout');
  const triggerRef = useRef<HTMLButtonElement>(null);

  // GSAP magnetic effect on trigger
  useGsapMagnetic(triggerRef, { strength: 0.08, disableOnTouch: true });

  const getStepLabel = (key: CheckoutStep): string => {
    const labels: Record<CheckoutStep, string> = {
      contact: t('contactInformation'),
      shipping: t('shippingAddress'),
      delivery: t('deliveryMethod'),
      payment: t('paymentMethod'),
      review: t('reviewAndPlaceOrder'),
    };
    return labels[key] || key;
  };

  // ARIA attributes for the accordion item
  const accordionItemAriaProps = {
    'aria-expanded': isCurrent,
    'aria-disabled': !canAccess,
    'aria-current': isCurrent ? 'step' as const : undefined,
    'aria-labelledby': `step-${step.key}-trigger`,
    'aria-describedby': `step-${step.key}-description`,
  };

  // ARIA attributes for the accordion trigger
  const accordionTriggerAriaProps = {
    id: `step-${step.key}-trigger`,
    'aria-controls': `step-${step.key}-content`,
    'aria-label': `${t('step')} ${stepNumber}: ${getStepLabel(step.key)}`,
  };

  // ARIA attributes for the accordion content
  const accordionContentAriaProps = {
    id: `step-${step.key}-content`,
    'aria-hidden': !isCurrent,
    'aria-labelledby': `step-${step.key}-trigger`,
  };

  return (
    <AccordionItem
      value={step.key}
      className={cn(
        'bg-[#fbfaf7] dark:bg-[#1c1b19] rounded-2xl sm:rounded-3xl border transition-all duration-300 overflow-hidden',
        isCompleted || isCurrent
          ? 'border-[#D4A43C]/60 shadow-sm'
          : 'border-[#e2ddd2] dark:border-[#2e2c28]',
        !canAccess && 'opacity-50 pointer-events-none'
      )}
      disabled={!canAccess}
      {...accordionItemAriaProps}
    >
      <AccordionTrigger
        ref={triggerRef}
        className={cn(
          'hover:no-underline px-5 sm:px-8 py-5 sm:py-6 transition-colors group/trigger',
          !canAccess && 'cursor-not-allowed'
        )}
        disabled={!canAccess}
        {...accordionTriggerAriaProps}
      >
        <div className="flex items-center gap-3.5 sm:gap-4 min-w-0 flex-1">
          <div
            className={cn(
              'flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full text-xs font-bold transition-all shrink-0',
              isCompleted
                ? 'bg-[#1c1b18] text-white shadow-xs'
                : isCurrent
                ? 'bg-[#D4A43C] text-[#1D120A] ring-4 ring-[#D4A43C]/20'
                : 'bg-[#ebe2d4] dark:bg-[#272522] text-[#57544c]'
            )}
          >
            {isCompleted ? (
              <Check className="w-4 h-4" strokeWidth={2.5} />
            ) : (
              stepNumber
            )}
          </div>
          <span
            className={cn(
              'font-display text-sm sm:text-base md:text-lg font-semibold text-left transition-colors',
              isCurrent
                ? 'text-[#D4A43C]'
                : isCompleted
                ? 'text-[#1c1b18] dark:text-[#fbfaf7]'
                : 'text-[#57544c] dark:text-[#a6a29a]'
            )}
          >
            {getStepLabel(step.key)}
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent
        className="px-5 sm:px-8 pt-1 pb-7 sm:pb-8 border-t border-[#e2ddd2]/50 dark:border-[#2e2c28]"
        {...accordionContentAriaProps}
      >
        <div className="pt-3 sm:pt-4">
          {children}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

/**
 * Step progress indicator (top bar with circles and connector lines)
 */
export function StepProgressIndicator({
  stepOrder,
  completedSteps,
  currentStep,
  canAccessStep,
  onStepClick,
}: {
  stepOrder: CheckoutStep[];
  completedSteps: Set<CheckoutStep>;
  currentStep: CheckoutStep;
  canAccessStep: (step: CheckoutStep) => boolean;
  onStepClick: (step: CheckoutStep) => void;
}) {
  const t = useTranslations('Checkout');

  // ARIA attributes for the progress indicator
  const progressIndicatorAriaProps = {
    'aria-label': t('checkoutProgress'),
    'aria-live': 'polite' as const,
    'aria-atomic': true,
  };

  // ARIA attributes for each step button
  const getStepButtonAriaProps = (step: CheckoutStep) => ({
    'aria-current': currentStep === step ? 'step' as const : undefined,
    'aria-disabled': !canAccessStep(step),
    'aria-label': `${t('step')} ${getStepNumber(step)}: ${getStepLabel(step)}`,
    'aria-describedby': `step-${step}-description`,
  });

  const getStepLabel = (key: CheckoutStep): string => {
    const labels: Record<CheckoutStep, string> = {
      contact: t('steps.contact'),
      shipping: t('steps.address'),
      delivery: t('steps.delivery'),
      payment: t('steps.payment'),
      review: t('steps.review'),
    };
    return labels[key] || key;
  };

  const getStepNumber = (step: CheckoutStep): number => {
    return stepOrder.indexOf(step) + 1;
  };

  return (
    <>
      {/* Mobile Compact Step Pill */}
      <div className="sm:hidden mb-5 p-4 bg-[#fbfaf7] dark:bg-[#1c1b19] rounded-2xl border border-[#e2ddd2] dark:border-[#2e2c28] shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="size-6 rounded-full bg-[#D4A43C] text-[#1D120A] text-[11px] font-bold flex items-center justify-center">
            {getStepNumber(currentStep)}
          </span>
          <span className="text-xs font-semibold text-[#1c1b18] dark:text-[#fbfaf7]">
            {getStepLabel(currentStep)}
          </span>
        </div>
        <span className="text-[11px] text-[#7d796f] font-mono tracking-wide">
          {getStepNumber(currentStep)} / {stepOrder.length}
        </span>
      </div>

      {/* Desktop Step Bar */}
      <div
        className="mb-6 p-5 sm:p-6 bg-[#fbfaf7] dark:bg-[#1c1b19] rounded-2xl sm:rounded-3xl border border-[#e2ddd2] dark:border-[#2e2c28] shadow-xs hidden sm:block"
        {...progressIndicatorAriaProps}
      >
        <div className="flex items-center justify-between">
          {stepOrder.map((step, index) => {
            const isCompleted = completedSteps.has(step);
            const isCurrent = currentStep === step;

            return (
              <div key={step} className="flex items-center flex-1 last:flex-0">
                <div className="flex flex-col items-center gap-2">
                  <button
                    type="button"
                    disabled={!canAccessStep(step)}
                    onClick={() => canAccessStep(step) && onStepClick(step)}
                    className={cn(
                      'flex items-center justify-center w-9 h-9 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer disabled:cursor-not-allowed shrink-0',
                      isCompleted
                        ? 'bg-[#1c1b18] text-white hover:bg-[#D4A43C] hover:text-[#1D120A]'
                        : isCurrent
                        ? 'bg-[#D4A43C] text-[#1D120A] ring-4 ring-[#D4A43C]/20 scale-105'
                        : 'bg-[#ebe2d4] dark:bg-[#272522] text-[#57544c]'
                    )}
                    {...getStepButtonAriaProps(step)}
                  >
                    {isCompleted ? (
                      <Check className="h-4 w-4" strokeWidth={2.5} />
                    ) : (
                      getStepNumber(step)
                    )}
                  </button>
                  <span
                    className={cn(
                      'text-xs font-medium whitespace-nowrap transition-colors',
                      isCurrent
                        ? 'text-[#D4A43C] font-semibold'
                        : isCompleted
                        ? 'text-[#1c1b18] dark:text-[#fbfaf7]'
                        : 'text-[#7d796f]'
                    )}
                  >
                    {getStepLabel(step)}
                  </span>
                </div>
                {index < stepOrder.length - 1 && (
                  <div className="flex-1 mx-3 -mt-6">
                    <div
                      className={cn(
                        'h-0.5 w-full transition-colors duration-200',
                        isCompleted ? 'bg-[#D4A43C]' : 'bg-[#e2ddd2] dark:bg-[#2e2c28]'
                      )}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}