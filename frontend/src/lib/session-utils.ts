/**
 * Obtiene el claim 'exp' (expiración) de un JWT sin verificar la firma.
 * Solo para uso en el cliente para mostrar cuenta atrás / renovar a tiempo.
 */
export function getExpFromJwt(token: string): number | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    return typeof payload.exp === 'number' ? payload.exp : null;
  } catch {
    return null;
  }
}

export const SESSION_CONFIG = {
  /** Tiempo de inactividad antes de considerar la sesión expirada (ms) */
  INACTIVITY_MS: 15 * 60 * 1000, // 15 min
  /** Mostrar modal de aviso cuando queden esta cantidad de segundos o menos */
  WARNING_SECONDS: 20,
  /** Renovar token cuando queden menos de estos segundos y haya actividad */
  REFRESH_THRESHOLD_SECONDS: 5 * 60, // 5 min
} as const;
