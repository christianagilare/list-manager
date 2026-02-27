'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import Card from '@/shared/ui/card';
import Input from '@/shared/ui/input';
import Button from '@/shared/ui/button';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/lista-negra';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const supabase = createClient();
    if (!supabase) {
      setError('Supabase no está configurado. Añade NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en .env');
      return;
    }
    setLoading(true);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <Card className="max-w-md mx-auto">
      <div className="flex flex-col items-center mb-6">
        <div className="relative h-200 w-200 rounded-xl bg-primary-800 flex items-center justify-center p-3">
          <Image
            src="/buenblock-icon.png"
            alt="BuenBlock"
            width={400}
            height={400}
            className="object-contain"
            priority
          />
        </div>
        <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-[var(--color-text)]">
          Iniciar sesión
        </h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="text-sm text-danger-600" role="alert">
            {error}
          </p>
        )}
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <Input
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
        <Button type="submit" disabled={loading} loading={loading} className="w-full">
          {loading ? 'Entrando…' : 'Entrar'}
        </Button>
      </form>
    </Card>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-md mx-auto p-8 text-center text-[var(--color-text-muted)]">
          Cargando…
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
