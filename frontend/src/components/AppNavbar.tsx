'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/shared/ui/navbar';
import HeaderAuth from '@/components/HeaderAuth';

const NAV_LINKS = [
  { href: '/', label: 'Inicio' },
  { href: '/lista-negra', label: 'Lista Negra' },
  //{ href: '/lista-blanca', label: 'Lista Blanca' },
  //{ href: '/busqueda', label: 'Búsqueda' },
];

export default function AppNavbar() {
  const pathname = usePathname();
  return (
    <Navbar
      links={NAV_LINKS}
      activePath={pathname ?? undefined}
      rightSlot={<HeaderAuth />}
    />
  );
}
