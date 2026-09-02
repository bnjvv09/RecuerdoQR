import { NextRequest, NextResponse } from 'next/server';
import { supabase, isMockMode } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    if (!isMockMode) {
      // Borrar registros de prueba en Supabase
      const { error } = await supabase.from('orders').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (error) {
        console.warn('Supabase delete orders warning:', error.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Todos los pedidos de prueba han sido eliminados correctamente',
    });
  } catch (error: any) {
    console.error('Error clearing test orders:', error);
    return NextResponse.json(
      { success: false, error: 'Error al limpiar pedidos de prueba' },
      { status: 500 }
    );
  }
}
