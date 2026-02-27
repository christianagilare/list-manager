const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8085';

import type { Entry, FileUploadMetadata, SearchResult, UploadSummary, BreCheckResult, UploadListResult } from './types';
import { createClient } from '@/lib/supabase/client';

const LOG_API = true; // Log de consumo del backend en consola

function logRequest(method: string, url: string, extra?: Record<string, unknown>) {
  if (!LOG_API) return;
  console.log('[API] →', method, url, extra ?? '');
}

function logResponse(method: string, url: string, status: number, body?: unknown) {
  if (!LOG_API) return;
  console.log('[API] ←', method, url, 'status:', status, body !== undefined ? body : '');
}

function logResponseError(method: string, url: string, status: number, errBody: unknown) {
  if (!LOG_API) return;
  console.warn('[API] ← ERROR', method, url, 'status:', status, 'body:', errBody);
}

/**
 * Ante 401 del backend: cierra sesión en Supabase y redirige al login.
 */
async function handleUnauthorized(): Promise<never> {
  const supabase = createClient();
  if (supabase) await supabase.auth.signOut();
  if (typeof window !== 'undefined') window.location.replace('/');
  throw new Error('Sesión expirada o no autorizado. Redirigiendo al login.');
}

async function getAuthHeaders(accessToken: string | undefined): Promise<HeadersInit> {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (accessToken) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${accessToken}`;
  }
  return headers;
}

export async function uploadExcel(
  tipoLista: string,
  file: File,
  accessToken: string | undefined
): Promise<UploadSummary> {
  const url = `${API_URL}/api/v1/uploads/${tipoLista}`;
  logRequest('POST', url, { file: file.name, size: file.size });
  const formData = new FormData();
  formData.append('file', file);
  const headers: HeadersInit = {};
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: formData,
  });
  const text = await res.text();
  let data: UploadSummary | { message?: string } | null = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    logResponseError('POST', url, res.status, text || '(empty)');
  }
  if (!res.ok) {
    const err = data && typeof data === 'object' && 'message' in data ? data.message : `Upload failed: ${res.status}`;
    logResponseError('POST', url, res.status, data ?? text);
    if (res.status === 401) await handleUnauthorized();
    throw new Error(String(err));
  }
  logResponse('POST', url, res.status, data);
  return data as UploadSummary;
}

export async function createEntry(
  tipoLista: string,
  data: {
    nombresCompletos: string;
    dni: string;
    paisOrigen: string;
    wallet: string;
    oficioJustificacion: string;
  },
  accessToken: string | undefined
): Promise<Entry> {
  const url = `${API_URL}/api/v1/entries/${tipoLista}`;
  logRequest('POST', url, { dni: data.dni });
  const res = await fetch(url, {
    method: 'POST',
    headers: await getAuthHeaders(accessToken),
    body: JSON.stringify(data),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    logResponseError('POST', url, res.status, json);
    if (res.status === 401) await handleUnauthorized();
    throw new Error((json as { message?: string }).message || `Create failed: ${res.status}`);
  }
  logResponse('POST', url, res.status, json);
  return json as Entry;
}

export async function searchEntries(
  params: {
    tipoLista: string;
    dni?: string;
    wallet?: string;
    nombres?: string;
    pais?: string;
    page?: number;
    size?: number;
  },
  accessToken: string | undefined
): Promise<SearchResult> {
  const sp = new URLSearchParams();
  sp.set('tipoLista', params.tipoLista);
  if (params.dni) sp.set('dni', params.dni);
  if (params.wallet) sp.set('wallet', params.wallet);
  if (params.nombres) sp.set('nombres', params.nombres);
  if (params.pais) sp.set('pais', params.pais);
  sp.set('page', String(params.page ?? 0));
  sp.set('size', String(params.size ?? 20));
  const url = `${API_URL}/api/v1/entries/search?${sp}`;
  logRequest('GET', url);
  const res = await fetch(url, {
    headers: await getAuthHeaders(accessToken),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    logResponseError('GET', url, res.status, json);
    if (res.status === 401) await handleUnauthorized();
    throw new Error(`Search failed: ${res.status}`);
  }
  logResponse('GET', url, res.status, json);
  return json as SearchResult;
}

export async function listUploads(
  tipoLista: string,
  page: number,
  size: number,
  accessToken: string | undefined
): Promise<UploadListResult> {
  const url = `${API_URL}/api/v1/uploads?tipoLista=${tipoLista}&page=${page}&size=${size}`;
  logRequest('GET', url);
  const res = await fetch(url, { headers: await getAuthHeaders(accessToken) });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    logResponseError('GET', url, res.status, json);
    if (res.status === 401) await handleUnauthorized();
    throw new Error(`List uploads failed: ${res.status}`);
  }
  logResponse('GET', url, res.status, json);
  return json as UploadListResult;
}

export async function getUploadMetadata(
  fileId: string,
  accessToken: string | undefined
): Promise<FileUploadMetadata | null> {
  const url = `${API_URL}/api/v1/uploads/${fileId}`;
  logRequest('GET', url);
  const res = await fetch(url, { headers: await getAuthHeaders(accessToken) });
  const json = await res.json().catch(() => ({}));
  if (res.status === 404) {
    logResponse('GET', url, 404, null);
    return null;
  }
  if (!res.ok) {
    logResponseError('GET', url, res.status, json);
    if (res.status === 401) await handleUnauthorized();
    throw new Error(`Metadata failed: ${res.status}`);
  }
  logResponse('GET', url, res.status, json);
  return json as FileUploadMetadata;
}

export function getDownloadUrl(fileId: string): string {
  return `${API_URL}/api/v1/uploads/${fileId}/download`;
}

export async function downloadFileBlob(
  fileId: string,
  accessToken: string | undefined
): Promise<Blob> {
  const url = getDownloadUrl(fileId);
  logRequest('GET', url);
  const headers: HeadersInit = {};
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    logResponseError('GET', url, res.status, await res.text().catch(() => ''));
    if (res.status === 401) await handleUnauthorized();
    throw new Error('Descarga fallida');
  }
  logResponse('GET', url, res.status, { blob: res.headers.get('content-type'), size: res.headers.get('content-length') });
  return res.blob();
}

export async function breCheck(
  params: { wallet?: string; dni?: string; nombres?: string; tipoLista?: string },
  accessToken: string | undefined
): Promise<BreCheckResult> {
  const sp = new URLSearchParams();
  if (params.wallet) sp.set('wallet', params.wallet);
  if (params.dni) sp.set('dni', params.dni);
  if (params.nombres) sp.set('nombres', params.nombres);
  if (params.tipoLista) sp.set('tipoLista', params.tipoLista);
  const url = `${API_URL}/api/v1/bre/check?${sp}`;
  logRequest('GET', url);
  const res = await fetch(url, {
    headers: await getAuthHeaders(accessToken),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    logResponseError('GET', url, res.status, json);
    if (res.status === 401) await handleUnauthorized();
    throw new Error(`BRE check failed: ${res.status}`);
  }
  logResponse('GET', url, res.status, json);
  return json as BreCheckResult;
}

