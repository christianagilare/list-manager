import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const protectedPaths = ['/lista-negra', '/lista-blanca', '/busqueda'];

function isProtected(pathname: string) {
  return protectedPaths.some((p) => pathname.startsWith(p));
}

function isSupabaseConfigured() {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  if (!isSupabaseConfigured()) {
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();

  if (isProtected(request.nextUrl.pathname) && !session) {
    const redirect = new URL('/login', request.url);
    redirect.searchParams.set('next', request.nextUrl.pathname);
    return NextResponse.redirect(redirect);
  }

  if (request.nextUrl.pathname === '/login' && session) {
    return NextResponse.redirect(new URL('/lista-negra', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/lista-negra/:path*', '/lista-blanca/:path*', '/busqueda/:path*', '/login'],
};
