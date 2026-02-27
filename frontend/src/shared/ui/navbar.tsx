'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

export interface NavLink {
  href: string;
  label: string;
}

export interface NavbarProps {
  logo?: ReactNode;
  links: NavLink[];
  activePath?: string;
  rightSlot?: ReactNode;
  className?: string;
}

export default function Navbar({
  logo,
  links,
  activePath,
  rightSlot,
  className,
}: NavbarProps) {
  return (
    <header
      className={cn(
        'border-b border-border bg-surface',
        className
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-8">
          {logo ?? (
            <Link
              href="/"
              className="text-lg font-semibold tracking-tight text-[var(--color-text)]"
            >
              Gestor de Listas
            </Link>
          )}
          <div className="flex items-center gap-1">
            {links.map((link) => {
              const isActive =
                activePath !== undefined && (activePath === link.href || link.href !== '/' && activePath.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
                    isActive
                      ? 'text-primary-700 bg-primary-50'
                      : 'text-[var(--color-text-secondary)] hover:bg-surface-subtle hover:text-[var(--color-text)]'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
        {rightSlot && <div className="flex items-center gap-4">{rightSlot}</div>}
      </nav>
    </header>
  );
}
