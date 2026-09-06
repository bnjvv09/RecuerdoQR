import { NextResponse } from 'next/server';
import { updateOrderPayment, getOrderById, getExperienceByOrderId, recordPlanPromoSale } from '@/lib/db';
import { sendCustomerConfirmationEmail, sendAdminSalesNotification } from '@/lib/emailService';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { orderId, paymentId = 'mercadopago_success' } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'orderId es requerido' }, { status: 400 });
    }

    const order = await getOrderById(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });
    }

    // Si el pedido ya estaba pagado y con emails procesados, responder ok
    const isAlreadyPaid = order.status === 'paid' || order.status === 'shipped';

    if (!isAlreadyPaid) {
      await updateOrderPayment(orderId, String(paymentId), 'paid');
      const planId = order.product_id || 'basic';
      await recordPlanPromoSale(planId).catch(() => {});
    }

    // Despachar correos si aún no se han enviado para esta orden
    const exp = await getExperienceByOrderId(orderId);
    if (exp) {
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

      await Promise.allSettled([
        sendCustomerConfirmationEmail(emailPayload),
        sendAdminSalesNotification(emailPayload)
      ]);
    }

    return NextResponse.json({ success: true, status: 'paid' });
  } catch (error: any) {
    console.error('Error confirming order payment on thank you page:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
