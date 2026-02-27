'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export default function HeaderAuth() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();
    if (!supabase) return;
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();
    if (!supabase) return;
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <div className="flex items-center gap-4">
      {user ? (
        <span className="text-sm text-[var(--color-text-muted)]">
          {user.email}
          <button
            type="button"
            onClick={handleLogout}
            className="ml-2 text-danger-600 hover:underline focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded"
          >
            Cerrar sesión
          </button>
        </span>
      ) : (
        <Link href="/login" className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text)] focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded">
          Iniciar sesión
        </Link>
      )}
    </div>
  );
}
