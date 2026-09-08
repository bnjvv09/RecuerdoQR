import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabaseServer';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID de experiencia requerido' }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();

    // 1. Fetch current config
    const { data: exp, error: fetchErr } = await supabase
      .from('experiences')
      .select('id, config')
      .eq('id', id)
      .single();

    if (fetchErr || !exp) {
      return NextResponse.json({ success: false, error: 'Experiencia no encontrada' }, { status: 404 });
    }

    const currentConfig = (exp.config as any) || {};
    const currentViews = typeof currentConfig.views_count === 'number' ? currentConfig.views_count : 0;
    const updatedViews = currentViews + 1;

    const updatedConfig = {
      ...currentConfig,
      views_count: updatedViews,
      last_viewed_at: new Date().toISOString(),
    };

    // 2. Update config in database
    const { error: updateErr } = await supabase
      .from('experiences')
      .update({ config: updatedConfig })
      .eq('id', id);

    if (updateErr) {
      console.error('Error updating views_count:', updateErr);
      return NextResponse.json({ success: false, error: updateErr.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      views_count: updatedViews,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Error interno' }, { status: 500 });
  }
}