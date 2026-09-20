import { NextRequest, NextResponse } from 'next/server';
import { esquemaActualizacionEstadoPedido } from '@/schemas/pedido';
import { createServerSupabaseClient } from '@/lib/supabaseServer';
import { manejarErrorApi, ErrorApp, CodigosError } from '@/lib/errores';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    if (!id) {
      throw new ErrorApp('ID de pedido requerido', CodigosError.VALIDATION_ERROR, 400);
    }

    // 🔒 SEGURIDAD: Validar sesión de administrador
    const token = req.cookies.get('sb-access-token')?.value || req.headers.get('authorization')?.replace('Bearer ', '');
    const isMock = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder-project');
    if (!token && !isMock && process.env.NODE_ENV === 'production') {
      throw new ErrorApp('No autorizado. Se requiere sesión de administrador.', CodigosError.UNAUTHORIZED, 401);
    }

    const body = await req.json();
    const validated = esquemaActualizacionEstadoPedido.parse(body);

    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from('orders')
      .update({ status: validated.status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new ErrorApp(`Error al actualizar el pedido: ${error.message}`, CodigosError.DATABASE_ERROR, 500);
    }

    return NextResponse.json({
      success: true,
      data,
      message: `Pedido actualizado a estado "${validated.status}"`,
    });
  } catch (error) {
    return manejarErrorApi(error);
  }
}
