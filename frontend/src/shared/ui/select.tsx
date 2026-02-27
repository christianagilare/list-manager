'use client';

import { forwardRef, useId, type SelectHTMLAttributes } from 'react';
import { cn } from '@/shared/lib/cn';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      id: idProp,
      label,
      options,
      error,
      helperText,
      placeholder,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = idProp ?? `select-${generatedId.replace(/:/g, '')}`;
    const hasError = Boolean(error);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="mb-1 block text-sm font-medium text-[var(--color-text)]"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={id}
          className={cn(
            'block w-full rounded-md border bg-surface px-3 py-2 text-[var(--color-text)]',
            'transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-0',
            'disabled:cursor-not-allowed disabled:bg-surface-subtle disabled:opacity-70',
            hasError
              ? 'border-danger-500 focus-visible:ring-danger-500'
              : 'border-border hover:border-[var(--color-text-muted)]',
            className
          )}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={
            error ? `${id}-error` : helperText ? `${id}-helper` : undefined
          }
          data-focus-visible
          {...props}
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
        {error && (
          <p
            id={`${id}-error`}
            className="mt-1 text-sm text-danger-600"
            role="alert"
          >
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${id}-helper`} className="mt-1 text-sm text-[var(--color-text-muted)]">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
