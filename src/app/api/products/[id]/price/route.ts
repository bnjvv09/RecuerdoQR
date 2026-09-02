import { NextRequest, NextResponse } from 'next/server';
import { priceUpdateSchema } from '@/schemas/product';
import { createServerSupabaseClient } from '@/lib/supabaseServer';
import { handleApiError, AppError, ErrorCodes } from '@/lib/errors';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    if (!id) {
      throw new AppError('ID de producto requerido', ErrorCodes.VALIDATION_ERROR, 400);
    }

    const body = await req.json();
    const validated = priceUpdateSchema.parse(body);

    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from('products')
      .update({ price: validated.price })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new AppError(`Error al actualizar el precio: ${error.message}`, ErrorCodes.DATABASE_ERROR, 500);
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'Precio actualizado exitosamente',
    });
  } catch (error) {
    return handleApiError(error);
  }
}
