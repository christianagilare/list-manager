'use client';

import { useEffect, useState } from 'react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import FormUpload from '@/components/FormUpload';
import FormEntry from '@/components/FormEntry';
import FileStatusBadge from '@/components/FileStatusBadge';
import { listUploads, downloadFileBlob } from '@/lib/api';
import type { UploadSummary, FileUploadMetadata, TipoLista } from '@/lib/types';
import PageHeader from '@/shared/ui/page-header';
import Section from '@/shared/ui/section';
import Card from '@/shared/ui/card';
import Table, { type TableColumn } from '@/shared/ui/table';
import Button from '@/shared/ui/button';

const TIPO_LISTA: TipoLista = 'NEGRA';

const uploadColumns: TableColumn<FileUploadMetadata>[] = [
  { key: 'originalFilename', header: 'Archivo', render: (u) => u.originalFilename },
  { key: 'uploadedBy', header: 'Subido por', render: (u) => u.uploadedBy || '—' },
  { key: 'uploadedAt', header: 'Fecha', render: (u) => new Date(u.uploadedAt).toLocaleString() },
  { key: 'status', header: 'Estado', render: (u) => <FileStatusBadge status={u.status} /> },
  { key: 'rows', header: 'Filas', render: (u) => `${u.insertedRows} / ${u.totalRows}` },
];

export default function ListaNegraPage() {
  const [accessToken, setAccessToken] = useState<string | undefined>(undefined);
  const [authReady, setAuthReady] = useState(!isSupabaseConfigured());
  const [uploadSummary, setUploadSummary] = useState<UploadSummary | null>(null);
  const [uploads, setUploads] = useState<FileUploadMetadata[]>([]);
  const [totalUploads, setTotalUploads] = useState(0);
  const [page, setPage] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setAuthReady(true);
      return;
    }
    const supabase = createClient();
    if (!supabase) {
      setAuthReady(true);
      return;
    }
    supabase.auth.getSession().then(({ data: { session } }) => {

      console.log(session);
      setAccessToken(session?.access_token);
      setAuthReady(true);
    });
  }, []);

  useEffect(() => {
    if (!authReady) return;
    listUploads(TIPO_LISTA, page, 10, accessToken)
      .then((r) => {
        setUploads(r.content);
        setTotalUploads(r.totalElements);
      })
      .catch(() => {});
  }, [authReady, accessToken, page, refreshKey]);

  function handleDownload(fileId: string) {
    if (accessToken === undefined && isSupabaseConfigured()) return;
    downloadFileBlob(fileId, accessToken)
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'respaldo.xlsx';
        a.click();
        URL.revokeObjectURL(url);
      })
      .catch(() => {});
  }

  const totalPages = Math.max(1, Math.ceil(totalUploads / 10));
  const columnsWithDownload: TableColumn<FileUploadMetadata>[] = [
    ...uploadColumns,
    {
      key: 'id',
      header: 'Descarga',
      render: (u) => (
        <Button variant="ghost" size="sm" type="button" onClick={() => handleDownload(u.id)}>
          Descargar
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-10">
      <PageHeader
        title="Lista Negra"
        description="Carga masiva por Excel, alta manual y estado de procesamiento."
      />

      <Section title="Carga masiva (Excel)" subtitle="Sube un archivo Excel con las columnas requeridas.">
        <Card>
          <FormUpload
            tipoLista={TIPO_LISTA}
            accessToken={accessToken}
            onUpload={(s) => {
              setUploadSummary(s);
              setRefreshKey((k) => k + 1);
            }}
          />
          {uploadSummary && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-sm text-[var(--color-text-secondary)]">
                Total filas: {uploadSummary.totalRows} — Insertadas: {uploadSummary.insertedRows} — Rechazadas: {uploadSummary.rejectedRows}
              </p>
              {uploadSummary.errors.length > 0 && (
                <ul className="mt-2 text-sm text-danger-600 list-disc list-inside" role="list">
                  {uploadSummary.errors.slice(0, 10).map((e, i) => (
                    <li key={i}>
                      Fila {e.row} {e.column}: {e.message}
                    </li>
                  ))}
                  {uploadSummary.errors.length > 10 && <li>… y más</li>}
                </ul>
              )}
            </div>
          )}
        </Card>
      </Section>

      <Section title="Alta manual" subtitle="Registra una entrada manualmente.">
        <Card>
          <FormEntry
            tipoLista={TIPO_LISTA}
            accessToken={accessToken}
            onCreated={() => setRefreshKey((k) => k + 1)}
          />
        </Card>
      </Section>

      <Section title="Estado de procesamiento" subtitle="Historial de cargas y descarga de respaldos.">
        <Card>
          <Table<FileUploadMetadata>
            columns={columnsWithDownload}
            data={uploads}
            getRowKey={(u) => u.id}
            emptyMessage="Aún no hay cargas."
          />
          {totalPages > 1 && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-border">
              <span className="text-sm text-[var(--color-text-muted)]">
                Total: {totalUploads} — Página {page + 1} de {totalPages}
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={(page + 1) * 10 >= totalUploads}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </Card>
      </Section>
    </div>
  );
}
