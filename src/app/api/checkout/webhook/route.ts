import { NextResponse } from 'next/server';
import { updateOrderPayment } from '@/lib/db';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    // 🔒 SEGURIDAD: Verificar firma criptográfica si MERCADO_PAGO_WEBHOOK_SECRET está configurado
    const webhookSecret = process.env.MERCADO_PAGO_WEBHOOK_SECRET;
    const xSignature = request.headers.get('x-signature');
    const xRequestId = request.headers.get('x-request-id');
    const url = new URL(request.url);
    const dataId = url.searchParams.get('data.id') || url.searchParams.get('id');

    if (webhookSecret && xSignature && dataId) {
      const parts = xSignature.split(',');
      let ts = '';
      let hash = '';
      for (const part of parts) {
        const [key, val] = part.split('=');
        if (key.trim() === 'ts') ts = val.trim();
        if (key.trim() === 'v1') hash = val.trim();
      }

      if (ts && hash) {
        const manifest = `id:${dataId};request-id:${xRequestId || ''};ts:${ts};`;
        const expectedHash = crypto.createHmac('sha256', webhookSecret).update(manifest).digest('hex');
        if (hash !== expectedHash) {
          console.warn('⚠️ Webhook Signature Mismatch: Request rejected for security.');
          return NextResponse.json({ error: 'Firma inválida' }, { status: 401 });
        }
      }
    }

    const body = await request.json().catch(() => ({}));
    console.log('Received Mercado Pago Webhook:', body);

    const paymentId = body?.data?.id || dataId;

    if (paymentId) {
      const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN || '';

      if (!accessToken || accessToken.includes('MOCK')) {
        return NextResponse.json({ received: true, msg: 'Sandbox/Mock mode active, skipping webhook API call' });
      }

      // Consultar detalles reales del pago a la API de Mercado Pago con Access Token del servidor
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
          await updateOrderPayment(orderId, String(paymentId), 'paid');
          console.log(`Order ${orderId} successfully marked as PAID via verified webhook for payment ${paymentId}`);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Error in Mercado Pago webhook route:', error);
    return NextResponse.json({ received: false, error: error.message }, { status: 200 });
  }
}
