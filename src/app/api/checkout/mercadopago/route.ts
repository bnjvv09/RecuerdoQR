import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rateLimit';
import { sanitizeText } from '@/lib/sanitize';
import { createServerSupabaseClient } from '@/lib/supabaseServer';
import { getPlanPromos } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown-ip';
    const rateCheck = checkRateLimit(`checkout-${ip}`, 10, 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes. Por favor espera un minuto antes de reintentar.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const orderId = sanitizeText(body.orderId);
    const customerEmail = sanitizeText(body.customerEmail).toLowerCase();

    if (!orderId) {
      return NextResponse.json({ error: 'ID de pedido requerido' }, { status: 400 });
    }

    // 🔒 SEGURIDAD: Verificar el precio real en la base de datos (NUNCA confiar en body.total)
    const supabase = createServerSupabaseClient();
    const planPromos = await getPlanPromos();
    
    // 1. Buscar la orden real en la base de datos
    const { data: order } = await supabase
      .from('orders')
      .select('*, products(*)')
      .eq('id', orderId)
      .single();

    let verifiedPrice = 4990;
    let verifiedProductName = 'Plan Básico RecuerdoQR';

    if (order) {
      // 🎟️ Priorizar el total real de la orden (con cupón o precio de lanzamiento aplicado)
      const orderPlan = order.product_id || 'basic';
      const orderPromo = planPromos[orderPlan];

      if (order.total !== undefined && order.total !== null && Number(order.total) > 0) {
        verifiedPrice = Math.round(Number(order.total));
      } else if (orderPromo?.isActive && orderPromo.remainingSlots > 0) {
        verifiedPrice = orderPromo.promoPrice;
      } else if (order.products && order.products.price) {
        verifiedPrice = Number(order.products.price);
      }

      if (order.products && order.products.name) {
        verifiedProductName = order.products.name;
      }
    } else {
      // Fallback a precios oficiales verificados por el servidor
      const planPrices: Record<string, number> = { 
        basic: (planPromos.basic?.isActive && planPromos.basic.remainingSlots > 0) ? planPromos.basic.promoPrice : 4990, 
        digital: (planPromos.basic?.isActive && planPromos.basic.remainingSlots > 0) ? planPromos.basic.promoPrice : 4990, 
        medium: (planPromos.medium?.isActive && planPromos.medium.remainingSlots > 0) ? planPromos.medium.promoPrice : 6990, 
        card: (planPromos.medium?.isActive && planPromos.medium.remainingSlots > 0) ? planPromos.medium.promoPrice : 6990, 
        premium: (planPromos.premium?.isActive && planPromos.premium.remainingSlots > 0) ? planPromos.premium.promoPrice : 7990 
      };
      const fallbackPlan = body.productName?.toLowerCase().includes('máximo') || body.productName?.toLowerCase().includes('premium') ? 'premium'
        : body.productName?.toLowerCase().includes('medio') ? 'medium' : 'basic';
      verifiedPrice = planPrices[fallbackPlan] || 4990;
      verifiedProductName = `RecuerdoQR - ${fallbackPlan.toUpperCase()}`;
    }

    const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
    const proto = request.headers.get('x-forwarded-proto') || (host?.includes('localhost') ? 'http' : 'https');
    const defaultAppUrl = host ? `${proto}://${host}` : 'https://recuerdoqr.cl';
    const appUrl = (process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes('localhost'))
      ? process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '')
      : defaultAppUrl;

    const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN || '';

    // Si no hay token de Mercado Pago configurado o es de prueba, simular la redirección
    if (!accessToken || accessToken.includes('MOCK') || accessToken === 'APP_USR-xxxxxx-xxxxxx-xxxxxx') {
      console.log('Using simulated Mercado Pago checkout for order:', orderId, 'Verified Price:', verifiedPrice);
      const mockCheckoutUrl = `${appUrl}/checkout/simulate-payment?orderId=${orderId}&productName=${encodeURIComponent(verifiedProductName)}&total=${verifiedPrice}`;
      return NextResponse.json({ init_point: mockCheckoutUrl, isMock: true });
    }

    // Integración real con Mercado Pago con PRECIO VERIFICADO POR EL SERVIDOR y medios de pago chilenos habilitados
    const mpResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [
          {
            title: `RecuerdoQR - ${verifiedProductName}`,
            quantity: 1,
            unit_price: verifiedPrice,
            currency_id: 'CLP',
          },
        ],
        payment_methods: {
          excluded_payment_methods: [],
          excluded_payment_types: [],
          installments: 12,
        },
        back_urls: {
          success: `${appUrl}/gracias?orderId=${orderId}&status=success`,
          failure: `${appUrl}/personalizar?step=6&orderId=${orderId}&status=failure`,
          pending: `${appUrl}/personalizar?step=6&orderId=${orderId}&status=pending`,
        },
        auto_return: 'approved',
        external_reference: orderId,
        payer: {
          email: customerEmail || order?.customer_email || 'cliente@recuerdoqr.cl',
        },
      }),
    });

    if (!mpResponse.ok) {
      const errorData = await mpResponse.json();
      console.error('Mercado Pago API error:', errorData);
      throw new Error(errorData.message || 'Error generating Mercado Pago preference');
    }

    const data = await mpResponse.json();
    return NextResponse.json({ init_point: data.init_point, isMock: false });
  } catch (error: any) {
    console.error('Mercado Pago checkout route error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
