import { NextResponse } from 'next/server';
import { updateOrderPayment } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received Mercado Pago Webhook:', body);

    // Los webhooks de Mercado Pago envían notificaciones en diferentes formatos
    // Dependiendo del tipo, el ID del pago puede venir en data.id
    if (body.type === 'payment' && body.data && body.data.id) {
      const paymentId = body.data.id;
      const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN || '';

      if (!accessToken || accessToken.includes('MOCK')) {
        return NextResponse.json({ received: true, msg: 'Sandbox/Mock mode active, skipping webhook API call' });
      }

      // Consultar detalles del pago a la API de Mercado Pago
      const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const paymentData = await response.json();
        const orderId = paymentData.external_reference;
        const status = paymentData.status;

        // Si el estado es aprobado, actualizar a pagado
        if (status === 'approved' && orderId) {
          await updateOrderPayment(orderId, paymentId, 'paid');
          console.log(`Order ${orderId} successfully marked as PAID via webhook for payment ${paymentId}`);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Error in Mercado Pago webhook route:', error);
    // Retornamos 200/201 igualmente para que Mercado Pago no reintente infinitamente
    return NextResponse.json({ received: false, error: error.message }, { status: 200 });
  }
}
