import { NextRequest, NextResponse } from 'next/server';
import { obtenerPedidoPorId, obtenerExperienciaPorPedidoId } from '@/lib/bd';
import { enviarEmailConfirmacionCliente } from '@/lib/servicioEmail';

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json().catch(() => ({}));
    if (!orderId) {
      return NextResponse.json({ success: false, error: 'ID de orden requerido' }, { status: 400 });
    }

    const order = await obtenerPedidoPorId(orderId);
    if (!order) {
      return NextResponse.json({ success: false, error: 'Pedido no encontrado' }, { status: 404 });
    }

    const exp = await obtenerExperienciaPorPedidoId(orderId);
    if (!exp) {
      return NextResponse.json({ success: false, error: 'Experiencia no encontrada' }, { status: 404 });
    }

    const emailPayload = {
      orderId: order.id,
      customerName: order.customer_name || exp.user_name,
      customerEmail: order.customer_email,
      customerPhone: order.customer_phone,
      productName: order.product?.name || `Plan ${(order.product_id || 'premium').toUpperCase()}`,
      total: order.total,
      slug: exp.slug,
      partnerName: exp.partner_name,
      userName: exp.user_name,
      theme: exp.theme,
      couponCode: (exp.config as any)?.couponCode,
    };

    const res = await enviarEmailConfirmacionCliente(emailPayload);

    return NextResponse.json({
      success: true,
      message: `Correo enviado con éxito a ${order.customer_email}`,
      data: res
    });
  } catch (error: any) {
    console.error('Error resending order email:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
