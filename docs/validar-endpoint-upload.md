# Validación del endpoint de carga masiva

## Endpoint

- **URL:** `POST http://localhost:8080/api/v1/uploads/{tipoLista}`
- **tipoLista:** `NEGRA` o `BLANCA` (path variable)
- **Content-Type:** `multipart/form-data`
- **Parámetro obligatorio:** `file` (archivo Excel .xlsx o .xls)
- **Autenticación:** Bearer JWT (Supabase). Si está configurado, el header `Authorization: Bearer <token>` es obligatorio.

## Respuesta correcta (200)

```json
{
  "totalRows": 2,
  "insertedRows": 2,
  "rejectedRows": 0,
  "errors": []
}
```

## Errores posibles

| Status | Causa |
|--------|--------|
| 400 | Archivo vacío o parámetro `file` ausente |
| 401 | Token ausente o inválido (cuando JWT está configurado) |
| 415 | Content-Type no es multipart/form-data |
| 500 | Error leyendo el Excel (p. ej. archivo corrupto o no es .xlsx) |

## Probar con curl

Obtén un `access_token` desde el frontend (Supabase) o desde Supabase Dashboard → Authentication.

```bash
# Reemplaza YOUR_ACCESS_TOKEN y la ruta del archivo
curl -X POST "http://localhost:8080/api/v1/uploads/NEGRA" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "file=@/ruta/a/plantilla.xlsx"
```

Sin auth (solo si el backend está sin JWT configurado):

```bash
curl -X POST "http://localhost:8080/api/v1/uploads/NEGRA" \
  -F "file=@frontend/public/plantilla_lista.csv"
```

Nota: el backend espera Excel (.xlsx). Si envías un CSV, responderá 200 pero en el body puede haber `errors` con "Error leyendo archivo". Para carga correcta, usa un .xlsx con las columnas: nombresCompletos, dni, paisOrigen, wallet, oficioJustificacion.

## Logs en backend

Tras añadir logs en `UploadController`, en la consola del backend verás:

- Al recibir: `Upload recibido: tipoLista=NEGRA, file=nombre.xlsx, size=1234 bytes`
- Si archivo vacío: `Upload rechazado: archivo vacío`
- Al terminar: `Upload procesado: totalRows=2, inserted=2, rejected=0`
