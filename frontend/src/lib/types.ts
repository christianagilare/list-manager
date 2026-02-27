export type TipoLista = 'NEGRA' | 'BLANCA';

export type SourceType = 'MANUAL' | 'EXCEL';

export type UploadStatus = 'CARGADO' | 'PROCESADO' | 'CON_ERRORES';

export interface Entry {
  id: string;
  tipoLista: TipoLista;
  nombresCompletos: string;
  dni: string;
  paisOrigen: string;
  wallet: string;
  oficioJustificacion: string;
  sourceType: SourceType;
  fileUploadId: string | null;
  createdAt: string;
  /** Presente cuando la búsqueda es en lista NEGRA: indica si también está en lista blanca. */
  enListaBlanca?: boolean;
  /** Presente cuando la búsqueda es en lista NEGRA: true si puede transaccionar (está en lista blanca). */
  puedeTransaccionar?: boolean;
}

export interface FileUploadMetadata {
  id: string;
  tipoLista: TipoLista;
  originalFilename: string;
  uploadedBy: string;
  uploadedAt: string;
  status: UploadStatus;
  totalRows: number;
  insertedRows: number;
  rejectedRows: number;
}

export interface SearchResult {
  content: Entry[];
  totalElements: number;
  page: number;
}

export interface UploadSummary {
  totalRows: number;
  insertedRows: number;
  rejectedRows: number;
  errors: { row: number; column: string; message: string }[];
}

export interface BreCheckResult {
  found: boolean;
  /** true si alguna coincidencia en lista negra está también en lista blanca (puede transaccionar). */
  puedeTransaccionar?: boolean;
  entries: {
    tipoLista: TipoLista;
    dni: string;
    wallet: string;
    nombresCompletos: string;
    enListaBlanca?: boolean;
  }[];
}

export interface UploadListResult {
  content: FileUploadMetadata[];
  totalElements: number;
  page: number;
}
