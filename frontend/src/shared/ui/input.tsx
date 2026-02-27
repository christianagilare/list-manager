'use client';

import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import { cn } from '@/shared/lib/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      id: idProp,
      label,
      error,
      helperText,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = idProp ?? `input-${generatedId.replace(/:/g, '')}`;
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
        <input
          ref={ref}
          id={id}
          className={cn(
            'block w-full rounded-md border bg-surface px-3 py-2 text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]',
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
        />
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

Input.displayName = 'Input';

export default Input;
