'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/shared/lib/cn';

export type ButtonVariant = 'primary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary-700 text-white hover:bg-primary-800 active:bg-primary-900 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
  outline:
    'border-2 border-primary-600 text-primary-700 bg-transparent hover:bg-primary-50 active:bg-primary-100 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
  ghost:
    'text-[var(--color-text)] bg-transparent hover:bg-surface-subtle active:bg-border focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-md',
  md: 'px-4 py-2 text-sm rounded-md',
  lg: 'px-6 py-3 text-base rounded-md',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          'inline-flex items-center justify-center font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        disabled={isDisabled}
        aria-busy={loading}
        aria-disabled={isDisabled}
        data-focus-visible
        {...props}
      >
        {loading ? (
          <>
            <span
              className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
              aria-hidden
            />
            Cargando…
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
