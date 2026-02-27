'use client';

import type { HTMLAttributes } from 'react';
import { cn } from '@/shared/lib/cn';

export interface TableColumn<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

export interface TableProps<T extends object>
  extends HTMLAttributes<HTMLDivElement> {
  columns: TableColumn<T>[];
  data: T[];
  emptyMessage?: string;
  onRowClick?: (row: T, index: number) => void;
  getRowKey?: (row: T, index: number) => string;
}

export default function Table<T extends object>({
  className,
  columns,
  data,
  emptyMessage = 'No hay datos',
  onRowClick,
  getRowKey,
  ...props
}: TableProps<T>) {
  const getKey = getRowKey ?? ((_, i) => String(i));

  return (
    <div className={cn('overflow-x-auto', className)} {...props}>
      <table className="min-w-full divide-y divide-border text-sm">
        <thead className="bg-surface-subtle">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  'px-4 py-3 text-left font-medium text-[var(--color-text-secondary)]',
                  col.className
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-surface">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-12 text-center text-[var(--color-text-muted)]"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr
                key={getKey(row, index)}
                onClick={onRowClick ? () => onRowClick(row, index) : undefined}
                className={cn(
                  'transition-colors',
                  onRowClick && 'cursor-pointer hover:bg-surface-subtle'
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      'px-4 py-3 text-[var(--color-text)]',
                      col.className
                    )}
                  >
                    {col.render
                      ? col.render(row)
                      : ((row as Record<string, unknown>)[col.key] as React.ReactNode) ?? '—'}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
