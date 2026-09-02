import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin API routes if necessary
  if (pathname.startsWith('/api/admin') && !pathname.startsWith('/api/admin/create-manual-experience')) {
    const token = request.cookies.get('sb-access-token')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No autorizado. Se requiere sesión de administrador.' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
