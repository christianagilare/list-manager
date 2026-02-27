'use client';

import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

export interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export default function PageHeader({
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'mb-8 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between',
        className
      )}
    >
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--color-text)]">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-[var(--color-text-muted)]">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}
