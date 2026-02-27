'use client';

import Badge from '@/shared/ui/badge';
import type { UploadStatus } from '@/lib/types';

const variantMap: Record<UploadStatus, 'success' | 'warning' | 'danger'> = {
  CARGADO: 'warning',
  PROCESADO: 'success',
  CON_ERRORES: 'danger',
};

export default function FileStatusBadge({ status }: { status: UploadStatus }) {
  return <Badge variant={variantMap[status]}>{status}</Badge>;
}
