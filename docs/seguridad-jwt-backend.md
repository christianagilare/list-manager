# Validación del token JWT en el backend

## Estrategia única: Spring Security + JWT contra issuer Supabase

**No hay validación de autenticación hardcodeada en los controllers.** Toda la protección se hace en la capa de seguridad:

- Las peticiones a `/api/v1/**` (excepto `/api/v1/bre/**` y la documentación) **exigen** el header `Authorization: Bearer <token>`.
- El token se valida con **NimbusJwtDecoder** usando las claves del JWKS de Supabase (`SUPABASE_JWKS_URI`) y el **issuer** de Supabase (`iss` del JWT).
- Si el token falta, es inválido o el issuer no coincide, **Spring Security responde 401** y el controller no se ejecuta.
- Los controllers reciben `Authentication` ya rellenado por Spring Security; no comprueban ni devuelven 401 por su cuenta.
- El **principal** de la autenticación es un `AuthenticatedUser` (email y sub del JWT), obtenido de forma automática al validar el token; los controllers usan `@AuthenticationPrincipal AuthenticatedUser user` y `user.getIdentifierForAudit()` para guardar en BD (p. ej. `uploadedBy`) sin parsear el JWT.

Así, **GET /api/v1/entries/search** (búsqueda) y el resto de endpoints de uploads y entries están detrás de la misma estrategia.

## Reglas de autorización (Spring Security)

Las reglas se evalúan **en orden**; la primera coincidencia decide si la petición es pública o requiere autenticación:

| Orden | Patrón | Acceso | Descripción |
|-------|--------|--------|-------------|
| 1 | `/api/v1/bre/**` | Público | API para el motor de reglas (BRE). |
| 2 | `/swagger-ui/**`, `/v3/api-docs/**`, `/api-docs/**` | Público | Documentación OpenAPI. |
| 3 | `/error` | Público | Rutas de error de Spring Boot. |
| 4 | `/api/v1/**` | **Autenticado** | Resto de la API (uploads, entries). |
| 5 | `anyRequest()` | Público | Raíz, favicon, etc. |

**Endpoints protegidos (requieren `Authorization: Bearer <token>`):**

| Método | Ruta | Controller |
|--------|------|------------|
| POST | `/api/v1/uploads/{tipoLista}` | UploadController – carga masiva |
| GET | `/api/v1/uploads` | UploadController – listar uploads |
| GET | `/api/v1/uploads/{fileId}` | UploadController – metadatos |
| GET | `/api/v1/uploads/{fileId}/download` | UploadController – descarga |
| POST | `/api/v1/entries/{tipoLista}` | EntryController – alta manual |
| GET | `/api/v1/entries/search` | EntryController – búsqueda |

**Endpoints públicos (sin token):**

| Método | Ruta | Controller |
|--------|------|------------|
| GET | `/api/v1/bre/check` | BreController – consulta BRE |

## Cómo se valida el token

1. **El frontend** envía cada petición a `/api/v1/**` con el header:
   ```
   Authorization: Bearer <access_token>
   ```
   El `access_token` es el JWT que devuelve Supabase al hacer login (session.access_token).

2. **Spring Security** (OAuth2 Resource Server) intercepta la petición:
   - Si no hay header `Authorization` o el token no es válido → responde **401 Unauthorized** y el controller no se ejecuta.
   - Si el token es válido → crea un `Authentication` con principal de tipo `AuthenticatedUser` (email y sub del JWT) y deja pasar la petición.

3. **Validaciones que hace el backend** (con `NimbusJwtDecoder` + `JwtValidators.createDefaultWithIssuer`):
   - **Firma:** el token está firmado con la clave del proyecto Supabase (se obtienen las claves públicas desde `SUPABASE_JWKS_URI`).
   - **Issuer (iss):** el claim `iss` del token debe ser exactamente la URL configurada (p. ej. `https://<project-ref>.supabase.co/auth/v1`). Se infiere de `SUPABASE_JWKS_URI` o se puede fijar con `SUPABASE_ISSUER_URI`.
   - **Expiración (exp):** el token no debe estar caducado.
   - **Not before (nbf):** si viene, el token no debe ser usado antes de esa fecha.

4. **Rutas públicas** (no requieren token): `/api/v1/bre/**`, Swagger/OpenAPI, `/error`.  
5. **Rutas protegidas** (requieren token válido): todo lo demás bajo `/api/v1/**` (uploads, entries).

## Variables de entorno necesarias

Para que la capa de seguridad funcione, el backend debe arrancar con al menos una de estas variables:

| Variable | Uso |
|----------|-----|
| `SUPABASE_JWKS_URI` | URL del JWKS de Supabase. Ej: `https://<project-ref>.supabase.co/auth/v1/.well-known/jwks.json` |
| `SUPABASE_JWT_SECRET` | (Alternativa) JWT Secret del proyecto (legacy). Menos recomendado que JWKS. |
| `SUPABASE_ISSUER_URI` | (Opcional) Issuer del token. Ej: `https://<project-ref>.supabase.co/auth/v1`. Si no se define, se infiere desde `SUPABASE_JWKS_URI`. |

**Importante:** Spring Boot no carga archivos `.env` por defecto. Las variables deben estar en el entorno cuando se inicia el proceso:

- **Docker Compose:** usa el `.env` de la raíz del proyecto y se inyectan en el servicio `backend`.
- **Maven/IDE:** hay que exportarlas en la shell o añadirlas en la configuración de ejecución, por ejemplo:
  ```bash
  export SUPABASE_JWKS_URI=https://fdjktlxsoikeozlubeiv.supabase.co/auth/v1/.well-known/jwks.json
  cd backend && ./mvnw spring-boot:run
  ```

## Comprobar que está activa

Al iniciar el backend, en los logs debe aparecer:

- **Si JWT está configurado:**  
  `JWT configurado: todos los endpoints /api/v1/** excepto /api/v1/bre/** y documentación requieren Authorization: Bearer <token> (validado contra issuer Supabase)`  
  y  
  `JWT decoder: jwksUri configurado, issuer validado: https://...`

- **Si no está configurado:**  
  `JWT NO configurado: SUPABASE_JWKS_URI y SUPABASE_JWT_SECRET están vacíos...`

Si ves el mensaje de "JWT NO configurado", las peticiones a `/api/v1/**` se permiten sin token y el backend guardará `uploadedBy=anonymous`. Para que se exija token y se guarde el usuario, configura las variables y reinicia el backend.

## Errores típicos

| Síntoma | Causa |
|--------|--------|
| 401 en todas las peticiones con token | Token caducado, issuer incorrecto o JWKS URI equivocado. Revisar que `iss` del token coincida con la URL de issuer configurada. **Revisar los logs del backend:** al devolver 401 se registra la causa (ej. "Jwt expired at...", "Invalid issuer"). |
| "Another algorithm expected, or no matching key(s) found" | El backend está validando con **JWT Secret (HS256)** pero el token de sesión de Supabase Auth es **ES256**. Solución: usar **JWKS** (configurar `SUPABASE_JWKS_URI` o arrancar con perfil `local`). Si solo tienes `SUPABASE_ISSUER_URI`, el backend infiere la URL del JWKS y usa ES256. |
| uploadedBy=anonymous con token enviado | Backend arrancado sin `SUPABASE_JWKS_URI`/`SUPABASE_JWT_SECRET`, por lo que la seguridad JWT no está activa. |
| CORS o "Failed to fetch" | El backend debe tener CORS habilitado para el origen del frontend (ya configurado para localhost:3000). |
