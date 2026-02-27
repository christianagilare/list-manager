'use client';

import { useState } from 'react';
import Input from '@/shared/ui/input';
import Button from '@/shared/ui/button';
import type { TipoLista } from '@/lib/types';
import { cn } from '@/shared/lib/cn';

type Props = {
  tipoLista: TipoLista;
  accessToken: string | undefined;
  onCreated: () => void;
};

const inputClass = cn(
  'block w-full rounded-md border bg-surface px-3 py-2 text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]',
  'transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-0',
  'border-border hover:border-[var(--color-text-muted)]'
);

export default function FormEntry({ tipoLista, accessToken, onCreated }: Props) {
  const [form, setForm] = useState({
    nombresCompletos: '',
    dni: '',
    paisOrigen: '',
    wallet: '',
    oficioJustificacion: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { createEntry } = await import('@/lib/api');
      await createEntry(tipoLista, form, accessToken);
      setForm({ nombresCompletos: '', dni: '', paisOrigen: '', wallet: '', oficioJustificacion: '' });
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      {error && (
        <p className="text-sm text-danger-600" role="alert">
          {error}
        </p>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Input
            label="Nombres completos"
            required
            value={form.nombresCompletos}
            onChange={(e) => setForm((f) => ({ ...f, nombresCompletos: e.target.value }))}
          />
        </div>
        <Input
          label="DNI"
          required
          value={form.dni}
          onChange={(e) => setForm((f) => ({ ...f, dni: e.target.value }))}
        />
        <Input
          label="País origen"
          required
          value={form.paisOrigen}
          onChange={(e) => setForm((f) => ({ ...f, paisOrigen: e.target.value }))}
        />
        <div className="sm:col-span-2">
          <Input
            label="Wallet"
            required
            value={form.wallet}
            onChange={(e) => setForm((f) => ({ ...f, wallet: e.target.value }))}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-[var(--color-text)]">
            Oficio / Justificación
          </label>
          <textarea
            required
            rows={2}
            value={form.oficioJustificacion}
            onChange={(e) => setForm((f) => ({ ...f, oficioJustificacion: e.target.value }))}
            className={inputClass}
          />
        </div>
      </div>
      <Button type="submit" disabled={loading} loading={loading}>
        {loading ? 'Guardando…' : 'Alta manual'}
      </Button>
    </form>
  );
}
