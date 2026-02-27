'use client';

import { useEffect, useRef, useCallback, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/shared/lib/cn';
import Button from './button';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}

function focusTrap(container: HTMLElement | null) {
  if (!container) return;
  const focusable = container.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (!first) return;

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key !== 'Tab') return;
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  first.focus();
  container.addEventListener('keydown', handleKeyDown);
  return () => container.removeEventListener('keydown', handleKeyDown);
}

export default function Modal({
  open,
  onClose,
  title,
  children,
  className,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleEscape);
    const cleanupTrap = focusTrap(contentRef.current);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEscape);
      cleanupTrap?.();
    };
  }, [open, handleEscape]);

  useEffect(() => {
    if (open && contentRef.current) {
      const t = setTimeout(() => focusTrap(contentRef.current), 50);
      return () => clearTimeout(t);
    }
  }, [open]);

  if (!open) return null;

  const modal = (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden
      />
      <div
        ref={contentRef}
        className={cn(
          'relative z-10 w-full max-w-lg rounded-lg border border-border bg-surface p-6 shadow-lg',
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2
            id="modal-title"
            className="text-lg font-semibold text-[var(--color-text)]"
          >
            {title}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Cerrar"
            className="-mr-2"
          >
            ×
          </Button>
        </div>
        <div className="text-[var(--color-text-secondary)]">{children}</div>
      </div>
    </div>
  );

  if (typeof document !== 'undefined') {
    return createPortal(modal, document.body);
  }
  return null;
}
