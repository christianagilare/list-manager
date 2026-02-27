import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import AppNavbar from '@/components/AppNavbar';
import { SessionTimeoutProvider } from '@/components/SessionTimeoutProvider';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Gestor de Listas',
  description: 'Listas Negras y Blancas',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="min-h-screen bg-surface-muted font-sans">
        <SessionTimeoutProvider>
          <AppNavbar />
          <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
        </SessionTimeoutProvider>
      </body>
    </html>
  );
}
