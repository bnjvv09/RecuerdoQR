import { NextRequest, NextResponse } from 'next/server';
import { loginSchema } from '@/schemas/auth';
import { handleApiError, AppError, ErrorCodes } from '@/lib/errors';
import { supabase } from '@/lib/supabase';
import { checkRateLimit } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'unknown-ip';
    // 🔒 SEGURIDAD: Máximo 5 intentos cada 15 minutos por IP
    const rateCheck = checkRateLimit(`login-attempt-${ip}`, 5, 15 * 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Demasiados intentos de inicio de sesión fallidos. Por seguridad, espera 15 minutos antes de volver a intentar.' 
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const validated = loginSchema.parse(body);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: validated.email,
      password: validated.password,
    });

    if (error) {
      throw new AppError(
        error.message || 'Credenciales inválidas. Verifica tu correo y contraseña.',
        ErrorCodes.UNAUTHORIZED,
        401
      );
    }

    const response = NextResponse.json({
      success: true,
      data: {
        user: {
          id: data.user.id,
          email: data.user.email,
        },
        session: data.session ? {
          access_token: data.session.access_token,
          expires_at: data.session.expires_at,
        } : null,
      },
    });

    if (data.session) {
      response.cookies.set('sb-access-token', data.session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });
    }

    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
