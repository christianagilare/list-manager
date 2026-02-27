'use client';

import { useState } from 'react';
import Link from 'next/link';
import Button from '@/shared/ui/button';
import type { UploadSummary } from '@/lib/types';
import type { TipoLista } from '@/lib/types';
import { cn } from '@/shared/lib/cn';
import { isSupabaseConfigured } from '@/lib/supabase/client';

type Props = {
  tipoLista: TipoLista;
  accessToken: string | undefined;
  onUpload: (summary: UploadSummary) => void;
};

function isAuthError(message: string): boolean {
  const lower = message.toLowerCase();
  return lower.includes('autenticación') || lower.includes('authorization') || lower.includes('bearer') || lower.includes('401') || lower.includes('no autorizado');
}

export default function FormUpload({ tipoLista, accessToken, onUpload }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const needsAuth = isSupabaseConfigured() && accessToken === undefined;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setError('Seleccione un archivo Excel');
      return;
    }
    if (needsAuth) {
      setError('Debes iniciar sesión para subir archivos.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const { uploadExcel } = await import('@/lib/api');
      const summary = await uploadExcel(tipoLista, file, accessToken);
      onUpload(summary);
      setFile(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al subir';
      if (err instanceof TypeError && (message === 'Failed to fetch' || message.includes('fetch'))) {
        setError('No se pudo conectar con el servidor. Comprueba que el backend esté en ejecución (p. ej. en http://localhost:8080).');
      } else if (isAuthError(message)) {
        setError('Sesión expirada o no autorizado. Vuelve a iniciar sesión.');
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <p className="text-sm text-danger-600" role="alert">
          {error}
        </p>
      )}
      {needsAuth && (
        <p className="text-sm text-[var(--color-text-secondary)]">
          Para subir archivos debes <Link href="/" className="text-primary-600 underline hover:text-primary-700">iniciar sesión</Link>.
        </p>
      )}
      <div className="flex flex-wrap gap-2 items-end">
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          disabled={needsAuth}
          className={cn(
            'block w-full max-w-xs text-sm text-[var(--color-text-muted)]',
            'file:mr-3 file:py-2 file:px-3 file:rounded-md file:border file:border-border file:bg-surface-subtle file:text-[var(--color-text)] file:text-sm file:font-medium',
            'hover:file:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-0'
          )}
        />
        <Button type="submit" disabled={loading || needsAuth} loading={loading}>
          {loading ? 'Subiendo…' : needsAuth ? 'Inicia sesión para subir' : 'Cargar Excel'}
        </Button>
        <a
          href="/plantilla_lista.csv"
          download="plantilla_lista.csv"
          title="Descargar plantilla CSV (abrir en Excel y guardar como .xlsx para usarla aquí)"
          className={cn(
            'inline-flex items-center justify-center font-medium transition-colors rounded-md px-4 py-2 text-sm',
            'border-2 border-primary-600 text-primary-700 bg-transparent hover:bg-primary-50 active:bg-primary-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2'
          )}
        >
          Descargar formato
        </a>
      </div>
      <p className="text-xs text-[var(--color-text-muted)]">
        La plantilla es un CSV con las columnas requeridas. Ábrela en Excel y guárdala como Libro de Excel (.xlsx) para subirla.
      </p>
    </form>
  );
}
