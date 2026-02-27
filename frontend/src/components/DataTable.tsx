'use client';

import Table, { type TableColumn } from '@/shared/ui/table';
import Button from '@/shared/ui/button';
import type { Entry } from '@/lib/types';

type Props = {
  rows: Entry[];
  totalElements: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onDownload?: (fileId: string) => void;
  /** Si es 'NEGRA', se muestra columna En lista blanca / Puede transaccionar */
  tipoLista?: 'NEGRA' | 'BLANCA';
};

export default function DataTable({
  rows,
  totalElements,
  page,
  pageSize,
  onPageChange,
  onDownload,
  tipoLista,
}: Props) {
  const totalPages = Math.max(1, Math.ceil(totalElements / pageSize));
  const hasNext = page < totalPages - 1;
  const hasPrev = page > 0;

  const columns: TableColumn<Entry>[] = [
    { key: 'nombresCompletos', header: 'Nombres', render: (r) => r.nombresCompletos },
    { key: 'dni', header: 'DNI', render: (r) => r.dni },
    { key: 'paisOrigen', header: 'País', render: (r) => r.paisOrigen },
    { key: 'wallet', header: 'Wallet', render: (r) => <span className="font-mono text-xs">{r.wallet}</span> },
    { key: 'sourceType', header: 'Origen', render: (r) => r.sourceType },
  ];

  if (tipoLista === 'NEGRA') {
    columns.push({
      key: 'puedeTransaccionar',
      header: 'En lista blanca / Puede transaccionar',
      render: (r) =>
        r.puedeTransaccionar === true || r.enListaBlanca === true ? (
          <span className="inline-flex items-center rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
            Sí
          </span>
        ) : (
          '—'
        ),
    });
  }

  if (onDownload) {
    columns.push({
      key: 'fileUploadId',
      header: 'Respaldo',
      render: (r) =>
        r.fileUploadId ? (
          <Button variant="ghost" size="sm" type="button" onClick={() => onDownload(r.fileUploadId!)}>
            Descargar
          </Button>
        ) : (
          '—'
        ),
    });
  }

  return (
    <div className="space-y-4">
      <Table
        columns={columns}
        data={rows}
        getRowKey={(r) => r.id}
        emptyMessage="No hay registros"
      />
      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm text-[var(--color-text-muted)]">
            Total: {totalElements} — Página {page + 1} de {totalPages}
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={!hasPrev} onClick={() => onPageChange(page - 1)}>
              Anterior
            </Button>
            <Button variant="outline" size="sm" disabled={!hasNext} onClick={() => onPageChange(page + 1)}>
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
