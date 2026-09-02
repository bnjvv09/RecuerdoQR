import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabaseServer';
import { handleApiError, AppError, ErrorCodes } from '@/lib/errors';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    if (!id) {
      throw new AppError('ID de experiencia requerido', ErrorCodes.VALIDATION_ERROR, 400);
    }

    const body = await req.json();
    const {
      partner_name,
      user_name,
      title,
      special_date,
      theme,
      song_url,
      message,
      history_text,
      config,
      photosList,
    } = body;

    const supabase = createServerSupabaseClient();

    // 1. Update experience record
    const updateData: any = {};
    if (partner_name !== undefined) updateData.partner_name = partner_name;
    if (user_name !== undefined) updateData.user_name = user_name;
    if (title !== undefined) updateData.title = title;
    if (special_date !== undefined) updateData.special_date = special_date;
    if (theme !== undefined) updateData.theme = theme;
    if (song_url !== undefined) updateData.song_url = song_url;
    if (message !== undefined) updateData.message = message;
    if (history_text !== undefined) updateData.history_text = history_text;
    if (config !== undefined) updateData.config = config;

    const { data: updatedExp, error: expError } = await supabase
      .from('experiences')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (expError) {
      throw new AppError(`Error al actualizar la experiencia: ${expError.message}`, ErrorCodes.DATABASE_ERROR, 500);
    }

    // 2. If photosList provided, synchronize photos table
    if (Array.isArray(photosList)) {
      // Remove previous photos
      await supabase.from('photos').delete().eq('experience_id', id);

      // Insert updated photos
      if (photosList.length > 0) {
        const photoInserts = photosList.map((p: any, idx: number) => ({
          experience_id: id,
          url: p.url,
          caption: p.caption || '',
          order_index: idx,
        }));
        await supabase.from('photos').insert(photoInserts);
      }
    }

    return NextResponse.json({
      success: true,
      data: updatedExp,
      message: 'Experiencia actualizada exitosamente',
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    if (!id) {
      throw new AppError('ID de experiencia requerido', ErrorCodes.VALIDATION_ERROR, 400);
    }

    const supabase = createServerSupabaseClient();
    const { error } = await supabase.from('experiences').delete().eq('id', id);

    if (error) {
      throw new AppError(`Error al eliminar la experiencia: ${error.message}`, ErrorCodes.DATABASE_ERROR, 500);
    }

    return NextResponse.json({
      success: true,
      message: 'Experiencia eliminada exitosamente',
    });
  } catch (error) {
    return handleApiError(error);
  }
}

