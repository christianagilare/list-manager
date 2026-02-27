# Sistema Gestor de Listas Negras y Listas Blancas

Aplicación web para la gestión de listas negras y listas blancas: carga masiva por Excel, alta manual, búsqueda con múltiples criterios y API interna para el motor de reglas (BRE). Incluye autenticación mínima con Supabase Auth.

## Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Supabase Auth
- **Backend**: Java 17, Spring Boot 3.x, Spring Data JPA, PostgreSQL, Apache POI, MinIO
- **Infra**: Docker y Docker Compose (PostgreSQL, MinIO, backend, frontend)

## Arquitectura

Arquitectura tipo **Clean Architecture** (hexagonal):

- **API (Adapters Inbound)**: Controllers REST, DTOs, mappers, `@ControllerAdvice` para errores.
- **Application (Use Cases)**: `UploadExcelUseCase`, `CreateEntryUseCase`, `SearchEntriesUseCase`, `BreCheckUseCase`, `DownloadFileUseCase`, `ListUploadsUseCase`, `GetUploadMetadataUseCase`. Dependen solo de puertos (interfaces).
- **Domain**: Entidades `ListEntry`, `FileUpload`; enums `TipoLista`, `SourceType`, `UploadStatus`; puertos (repositorios, almacenamiento).
- **Infrastructure (Adapters Outbound)**: JPA (entities, repositories, adapters), MinIO, parser Excel (Apache POI).

## Requisitos

- Docker y Docker Compose
- Cuenta en [Supabase](https://supabase.com) para autenticación

## Variables de entorno

Copiar `.env.example` a `.env` y completar:

| Variable | Uso |
|----------|-----|
| `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD` | PostgreSQL (por defecto listmanager/listmanager) |
| `MINIO_ROOT_USER`, `MINIO_ROOT_PASSWORD` | MinIO (por defecto minioadmin/minioadmin) |
| `SUPABASE_JWT_SECRET` | **Backend** (opcional): Legacy JWT Secret (Project Settings → JWT Keys → pestaña "Legacy JWT Secret"). Si Supabase ya migró a JWT Signing Keys, usa `SUPABASE_JWKS_URI` en su lugar. |
| `SUPABASE_JWKS_URI` | **Backend** (recomendado): URL del JWKS para verificar tokens con JWT Signing Keys. Formato: `https://<project-ref>.supabase.co/auth/v1/.well-known/jwks.json`. Si está definido, tiene prioridad sobre `SUPABASE_JWT_SECRET`. |
| `NEXT_PUBLIC_API_URL` | **Frontend**: URL del backend (ej. `http://localhost:8080`) |
| `NEXT_PUBLIC_SUPABASE_URL` | **Frontend**: URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **Frontend**: Anon key de Supabase |

### Autenticación (Supabase)

1. Crear proyecto en [supabase.com](https://supabase.com).
2. En **Authentication → Users** crear un usuario (email/contraseña) o permitir registro.
3. En **Project Settings → API** copiar:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **JWT Secret** (legacy) → `SUPABASE_JWT_SECRET`; o **JWT Signing Keys** → `SUPABASE_JWKS_URI` = `https://<project-ref>.supabase.co/auth/v1/.well-known/jwks.json` (recomendado).
4. El frontend hace login en `/login`; la sesión se guarda en cookies; en cada petición al backend se envía `Authorization: Bearer <access_token>`.
5. El backend valida el JWT con `SUPABASE_JWKS_URI` (o con `SUPABASE_JWT_SECRET` si no usas JWKS). El endpoint `/api/v1/bre/check` es público para uso del motor de reglas.

Para más detalle sobre cómo se valida el token y cómo comprobar que la seguridad está activa, ver [docs/seguridad-jwt-backend.md](docs/seguridad-jwt-backend.md).

## Ejecución

### Con Docker (recomendado)

```bash
cp .env.example .env
# Editar .env y configurar SUPABASE_* y NEXT_PUBLIC_*
docker-compose up --build
```

- Frontend: http://localhost:3000  
- Backend: http://localhost:8080  
- Swagger: http://localhost:8080/swagger-ui.html  
- MinIO: http://localhost:9000 (credenciales por defecto minioadmin/minioadmin)

### Solo backend (desarrollo local)

```bash
cd backend
# Configurar application.yml o variables de entorno (Postgres, MinIO, SUPABASE_JWT_SECRET o SUPABASE_JWKS_URI)
./mvnw spring-boot:run
```

**Importante:** Para que el backend identifique al usuario (y guarde el email en "Subido por"), `SUPABASE_JWKS_URI` (o `SUPABASE_JWT_SECRET`) debe estar definido al iniciar. Si usas el `.env` de la raíz del proyecto:

```bash
# Desde la raíz del proyecto (donde está el .env):
export SUPABASE_JWKS_URI=https://<tu-project-ref>.supabase.co/auth/v1/.well-known/jwks.json
cd backend && ./mvnw spring-boot:run
```

O copia las variables de Supabase del `.env` a la configuración de ejecución de tu IDE. Al arrancar, el backend escribe en log si JWT está configurado o no.

### Solo frontend (desarrollo local)

```bash
cd frontend
npm install
cp .env.example .env.local
# Completar NEXT_PUBLIC_* y NEXT_PUBLIC_API_URL=http://localhost:8080
npm run dev
```

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/v1/uploads/{tipoLista}` | Carga masiva Excel (multipart). Requiere auth. |
| GET | `/api/v1/uploads` | Lista de uploads por tipo (`?tipoLista=NEGRA&page=0&size=20`). Requiere auth. |
| GET | `/api/v1/uploads/{fileId}` | Metadatos del upload. Requiere auth. |
| GET | `/api/v1/uploads/{fileId}/download` | Descarga del archivo. Requiere auth. |
| POST | `/api/v1/entries/{tipoLista}` | Alta manual (JSON). Requiere auth. |
| GET | `/api/v1/entries/search` | Búsqueda paginada (query params). Requiere auth. |
| GET | `/api/v1/bre/check` | Consulta BRE (wallet, dni, nombres, tipoLista). Público. |

### Ejemplos curl (con token)

```bash
# Login en Supabase (obtener access_token desde el frontend o Supabase Auth)
TOKEN="your-access-token"

# Alta manual
curl -s -X POST http://localhost:8080/api/v1/entries/NEGRA \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nombresCompletos":"Juan Pérez","dni":"12345678","paisOrigen":"Argentina","wallet":"0x1234","oficioJustificacion":"Resolución 001"}'

# Búsqueda
curl -s "http://localhost:8080/api/v1/entries/search?tipoLista=NEGRA&page=0&size=20" \
  -H "Authorization: Bearer $TOKEN"

# BRE check (público)
curl -s "http://localhost:8080/api/v1/bre/check?dni=12345678&tipoLista=NEGRA"

# Carga Excel (multipart)
curl -s -X POST http://localhost:8080/api/v1/uploads/NEGRA \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@plantilla_lista.xlsx"
```

## Plantilla Excel

Las columnas requeridas en la primera fila son:

- `nombresCompletos`
- `dni`
- `paisOrigen`
- `wallet`
- `oficioJustificacion`

En `docs/plantilla_lista.csv` hay un ejemplo; puede abrirlo en Excel y guardar como **Libro de Excel (.xlsx)** para usarlo en la carga masiva.

## Estructura del repositorio

```
proyecto_listas/
├── backend/          # Spring Boot
├── frontend/         # Next.js
├── docs/             # Plantilla CSV y documentación
├── docker-compose.yml
├── .env.example
└── README.md
```

## Tests

En el backend se pueden añadir tests unitarios para el parser Excel y las validaciones (por ejemplo en `ExcelParser` y DTOs).
