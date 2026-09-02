import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { handleApiError } from '@/lib/errors';

export async function POST() {
  try {
    await supabase.auth.signOut();
    const response = NextResponse.json({ success: true, message: 'Sesión cerrada correctamente' });
    response.cookies.delete('sb-access-token');
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
