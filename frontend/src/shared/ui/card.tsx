'use client';

import type { HTMLAttributes } from 'react';
import { cn } from '@/shared/lib/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
}

export default function Card({
  className,
  title,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-surface p-6 shadow-sm',
        className
      )}
      {...props}
    >
      {title && (
        <h3 className="mb-4 text-lg font-semibold tracking-tight text-[var(--color-text)]">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}
