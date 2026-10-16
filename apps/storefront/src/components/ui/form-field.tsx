'use client';

import { Slot } from '@radix-ui/react-slot';
import { Controller, useFormContext, type ControllerRenderProps, type FieldValues } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useTranslations } from 'next-intl';
import * as z from 'zod';
import * as React from 'react';

export interface FormFieldProps {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'tel' | 'password' | 'number';
  placeholder?: string;
  required?: boolean;
  validation?: z.ZodSchema;
  className?: string;
  asChild?: boolean;
  children?: React.ReactElement;
  disabled?: boolean;
  errorMessage?: string;
}

const inputBaseClass =
  'h-11 w-full rounded-full px-5 border border-input bg-background text-sm transition-all ' +
  'focus:outline-none focus:border-ring focus:ring-3 focus:ring-ring/50 ' +
  'disabled:opacity-50 disabled:cursor-not-allowed ' +
  'aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20';

// Helper to get error message from ZodError
function getZodErrorMessage(error: z.ZodError): string {
  return error.issues[0]?.message || 'Invalid';
}

export function FormField({
  name,
  label,
  type = 'text',
  placeholder,
  required,
  validation,
  className,
  asChild = false,
  children,
  disabled,
  errorMessage,
}: FormFieldProps) {
  const t = useTranslations('Common');
  const { control, formState: { errors } } = useFormContext();
  const error = errors[name];
  const hasError = !!error || !!errorMessage;
  const displayError = errorMessage || (typeof error?.message === 'string' ? error.message : undefined);

  const combinedValidation = (value: unknown) => {
    if (required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return t('required', { field: label });
    }
    if (validation) {
      const result = validation.safeParse(value);
      if (!result.success) {
        return getZodErrorMessage(result.error);
      }
    }
    return true;
  };

  const renderInput = (field: ControllerRenderProps<FieldValues, string>) => {
    const inputProps = {
      ...field,
      type,
      placeholder,
      disabled,
      'aria-invalid': hasError,
      'aria-describedby': hasError ? `${name}-error` : undefined,
      className: cn(
        inputBaseClass,
        hasError && 'border-red-300 dark:border-red-700 focus:border-red-400 focus:ring-red-200',
        className
      ),
    };

    if (asChild && children) {
      return (
        <Slot>
          {React.cloneElement(children, inputProps)}
        </Slot>
      );
    }

    return <Input {...inputProps} />;
  };

  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
        {label}
        {required && <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>}
      </Label>

      <Controller
        name={name}
        control={control}
        rules={{ validate: combinedValidation }}
        render={({ field }) => renderInput(field)}
      />

      {hasError && (
        <p
          id={`${name}-error`}
          className="text-xs text-red-500"
          role="alert"
          aria-live="polite"
        >
          {displayError}
        </p>
      )}
    </div>
  );
}

/**
 * Specialized form field for select/dropdown components
 */
export function FormSelectField({
  name,
  label,
  placeholder,
  required,
  validation,
  className,
  options,
  disabled,
}: FormFieldProps & {
  options: Array<{ value: string; label: string }>;
}) {
  const { control, formState: { errors } } = useFormContext();
  const error = errors[name];
  const hasError = !!error;

  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
        {label}
        {required && <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>}
      </Label>

      <Controller
        name={name}
        control={control}
        rules={{
          required: required ? true : undefined,
          validate: validation ? (value) => {
            const result = validation.safeParse(value);
            if (!result.success) {
              return getZodErrorMessage(result.error);
            }
            return true;
          } : undefined
        }}
        render={({ field }) => (
          <select
            {...field}
            disabled={disabled}
            className={cn(
              inputBaseClass,
              hasError && 'border-red-300 dark:border-red-700 focus:border-red-400 focus:ring-red-200',
              className
            )}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${name}-error` : undefined}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}
      />

      {hasError && (
        <p
          id={`${name}-error`}
          className="text-xs text-red-500"
          role="alert"
        >
          {typeof error?.message === 'string' ? error.message : null}
        </p>
      )}
    </div>
  );
}

/**
 * Form field for textarea
 */
export function FormTextareaField({
  name,
  label,
  placeholder,
  required,
  validation,
  className,
  rows = 3,
  disabled,
}: FormFieldProps & { rows?: number }) {
  const { control, formState: { errors } } = useFormContext();
  const error = errors[name];
  const hasError = !!error;

  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
        {label}
        {required && <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>}
      </Label>

      <Controller
        name={name}
        control={control}
        rules={{
          required: required ? true : undefined,
          validate: validation ? (value) => {
            const result = validation.safeParse(value);
            if (!result.success) {
              return getZodErrorMessage(result.error);
            }
            return true;
          } : undefined
        }}
        render={({ field }) => (
          <textarea
            {...field}
            placeholder={placeholder}
            rows={rows}
            disabled={disabled}
            className={cn(
              'w-full rounded-xl px-4 py-3 border border-input bg-background text-sm transition-all',
              'focus:outline-none focus:border-ring focus:ring-3 focus:ring-ring/50',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              hasError && 'border-red-300 dark:border-red-700 focus:border-red-400 focus:ring-red-200',
              className
            )}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${name}-error` : undefined}
          />
        )}
      />

      {hasError && (
        <p
          id={`${name}-error`}
          className="text-xs text-red-500"
          role="alert"
        >
          {typeof error?.message === 'string' ? error.message : null}
        </p>
      )}
    </div>
  );
}