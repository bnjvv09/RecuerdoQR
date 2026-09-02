import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 🔒 Proteger todas las rutas API de administración
  if (pathname.startsWith('/api/admin') && !pathname.startsWith('/api/admin/create-manual-experience')) {
    const token = request.cookies.get('sb-access-token')?.value || request.headers.get('authorization');
    const isMock = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder-project');

    if (!token && !isMock && process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { success: false, error: 'No autorizado. Se requiere sesión de administrador activa.' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
