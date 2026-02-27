'use client';

import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  /** Si true, usa padding vertical grande (estilo landing) */
  large?: boolean;
}

export default function Section({
  className,
  title,
  subtitle,
  children,
  large = false,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(
        'w-full',
        large ? 'py-16 sm:py-24' : 'py-10 sm:py-12',
        className
      )}
      {...props}
    >
      {(title || subtitle) && (
        <div className="mb-8">
          {title && (
            <h2 className="text-3xl font-extrabold tracking-tight text-[var(--color-text)]">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="mt-2 text-lg text-[var(--color-text-muted)]">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
