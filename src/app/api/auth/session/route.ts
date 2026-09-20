import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { manejarErrorApi } from '@/lib/errores';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('sb-access-token')?.value;
    const { data, error } = await supabase.auth.getSession();

    if (error || (!data?.session && !token)) {
      return NextResponse.json({ success: true, authenticated: false, user: null });
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
      user: data.session?.user || null,
    });
  } catch (error) {
    return manejarErrorApi(error);
  }
}
