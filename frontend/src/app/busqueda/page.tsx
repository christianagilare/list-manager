'use client';

import { useEffect, useState } from 'react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import DataTable from '@/components/DataTable';
import { searchEntries, downloadFileBlob } from '@/lib/api';
import type { Entry, TipoLista } from '@/lib/types';
import PageHeader from '@/shared/ui/page-header';
import Section from '@/shared/ui/section';
import Card from '@/shared/ui/card';
import Input from '@/shared/ui/input';
import Select from '@/shared/ui/select';
import Button from '@/shared/ui/button';

export default function BusquedaPage() {
  const [accessToken, setAccessToken] = useState<string | undefined>(undefined);
  const [authReady, setAuthReady] = useState(!isSupabaseConfigured());
  const [tipoLista, setTipoLista] = useState<TipoLista>('NEGRA');
  const [dni, setDni] = useState('');
  const [wallet, setWallet] = useState('');
  const [nombres, setNombres] = useState('');
  const [pais, setPais] = useState('');
  const [page, setPage] = useState(0);
  const [result, setResult] = useState<{ content: Entry[]; totalElements: number } | null>(null);
  const [loading, setLoading] = useState(false);

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
      setAccessToken(session?.access_token);
      setAuthReady(true);
    });
  }, []);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (accessToken === undefined && isSupabaseConfigured()) return;
    setLoading(true);
    try {
      const r = await searchEntries(
        {
          tipoLista,
          dni: dni || undefined,
          wallet: wallet || undefined,
          nombres: nombres || undefined,
          pais: pais || undefined,
          page,
          size: 20,
        },
        accessToken
      );
      setResult({ content: r.content, totalElements: r.totalElements });
    } catch {
      setResult({ content: [], totalElements: 0 });
    } finally {
      setLoading(false);
    }
  }

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

  return (
    <div className="space-y-10">
      <PageHeader
        title="Búsqueda"
        description="Busca registros por tipo de lista, DNI, wallet, nombres o país."
      />

      <Section title="Criterios" subtitle="Filtra por los campos que necesites.">
        <Card>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <Select
                label="Tipo lista"
                value={tipoLista}
                onChange={(e) => setTipoLista(e.target.value as TipoLista)}
                options={[
                  { value: 'NEGRA', label: 'Lista Negra' },
                  { value: 'BLANCA', label: 'Lista Blanca' },
                ]}
              />
              <Input label="DNI" value={dni} onChange={(e) => setDni(e.target.value)} />
              <Input label="Wallet" value={wallet} onChange={(e) => setWallet(e.target.value)} />
              <Input label="Nombres" value={nombres} onChange={(e) => setNombres(e.target.value)} />
              <Input label="País" value={pais} onChange={(e) => setPais(e.target.value)} />
            </div>
            <Button type="submit" disabled={loading} loading={loading}>
              {loading ? 'Buscando…' : 'Buscar'}
            </Button>
          </form>
        </Card>
      </Section>

      {result && (
        <Section title="Resultados" subtitle={`${result.totalElements} registro(s) encontrado(s).`}>
          <Card>
            <DataTable
              rows={result.content}
              totalElements={result.totalElements}
              page={page}
              pageSize={20}
              tipoLista={tipoLista}
              onPageChange={async (p) => {
                setPage(p);
                if (accessToken === undefined && isSupabaseConfigured()) return;
                setLoading(true);
                try {
                  const r = await searchEntries(
                    {
                      tipoLista,
                      dni: dni || undefined,
                      wallet: wallet || undefined,
                      nombres: nombres || undefined,
                      pais: pais || undefined,
                      page: p,
                      size: 20,
                    },
                    accessToken
                  );
                  setResult({ content: r.content, totalElements: r.totalElements });
                } finally {
                  setLoading(false);
                }
              }}
              onDownload={handleDownload}
            />
          </Card>
        </Section>
      )}
    </div>
  );
}
