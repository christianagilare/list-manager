'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { getExpFromJwt, SESSION_CONFIG } from '@/lib/session-utils';
import Modal from '@/shared/ui/modal';
import Button from '@/shared/ui/button';

type SessionTimeoutContextValue = {
  resetInactivity: () => void;
};

const SessionTimeoutContext = createContext<SessionTimeoutContextValue | null>(null);

export function useSessionTimeout() {
  const ctx = useContext(SessionTimeoutContext);
  return ctx;
}

const ACTIVITY_EVENTS = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'] as const;

export function SessionTimeoutProvider({ children }: { children: ReactNode }) {
  const lastActivityRef = useRef<number>(Date.now());
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const resetInactivity = useCallback(() => {
    lastActivityRef.current = Date.now();
  }, []);

  const doLogout = useCallback(async () => {
    setShowWarning(false);
    const supabase = createClient();
    if (supabase) await supabase.auth.signOut();
    if (typeof window !== 'undefined') window.location.replace('/');
  }, []);

  const refreshSessionAndExtend = useCallback(async () => {
    const supabase = createClient();
    if (!supabase) return;
    lastActivityRef.current = Date.now();
    const { error } = await supabase.auth.refreshSession();
    if (!error) setShowWarning(false);
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();
    if (!supabase) return;

    function onActivity() {
      lastActivityRef.current = Date.now();
    }

    ACTIVITY_EVENTS.forEach((ev) => window.addEventListener(ev, onActivity));

    const checkInterval = setInterval(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session?.access_token) return;
        const now = Date.now();
        const tokenExp = getExpFromJwt(session.access_token);
        const tokenExpiresAt = tokenExp ? tokenExp * 1000 : null;
        const inactivityExpiresAt = lastActivityRef.current + SESSION_CONFIG.INACTIVITY_MS;
        const effectiveExpiresAt =
          tokenExpiresAt != null
            ? Math.min(tokenExpiresAt, inactivityExpiresAt)
            : inactivityExpiresAt;

        const remainingMs = effectiveExpiresAt - now;
        const remainingSec = Math.max(0, Math.ceil(remainingMs / 1000));

        if (remainingMs <= 0) {
          doLogout();
          return;
        }

        if (remainingSec <= SESSION_CONFIG.WARNING_SECONDS) {
          setCountdown(remainingSec);
          setShowWarning(true);
          return;
        }

        setShowWarning(false);

        const tokenRemainingSec = tokenExpiresAt != null ? (tokenExpiresAt - now) / 1000 : Infinity;
        const recentActivity = now - lastActivityRef.current < 60 * 1000;
        if (
          tokenRemainingSec < SESSION_CONFIG.REFRESH_THRESHOLD_SECONDS &&
          tokenRemainingSec > 0 &&
          recentActivity
        ) {
          supabase.auth.refreshSession();
        }
      });
    }, 1000);

    intervalRef.current = checkInterval;
    return () => {
      ACTIVITY_EVENTS.forEach((ev) => window.removeEventListener(ev, onActivity));
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [doLogout]);

  const handleContinue = useCallback(() => {
    refreshSessionAndExtend();
  }, [refreshSessionAndExtend]);

  return (
    <SessionTimeoutContext.Provider value={{ resetInactivity }}>
      {children}
      <Modal open={showWarning} onClose={handleContinue} title="Sesión por expirar">
        <div className="space-y-4">
          <p className="text-[var(--color-text-secondary)]">
            Tu sesión expirará en{' '}
            <strong className="text-[var(--color-text)]">{countdown}</strong> segundos por
            inactividad o por tiempo. Serás cerrado y redirigido al inicio.
          </p>
          <p className="text-sm text-[var(--color-text-muted)]">
            Haz clic en &quot;Continuar&quot; para mantener la sesión activa.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={doLogout}>
              Cerrar sesión ahora
            </Button>
            <Button onClick={handleContinue}>Continuar</Button>
          </div>
        </div>
      </Modal>
    </SessionTimeoutContext.Provider>
  );
}
