'use client';

import type { HTMLAttributes } from 'react';
import { cn } from '@/shared/lib/cn';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-success-100 text-success-600',
  warning: 'bg-warning-100 text-warning-600',
  danger: 'bg-danger-100 text-danger-600',
  info: 'bg-info-100 text-info-600',
};

export default function Badge({
  className,
  variant = 'info',
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium',
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
