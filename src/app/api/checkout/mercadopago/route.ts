import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { orderId, productName, total, customerEmail } = await request.json();

    if (!orderId || !productName || !total) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN || '';
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Si no hay token de Mercado Pago configurado o es de prueba, simular la redirección
    if (!accessToken || accessToken.includes('MOCK') || accessToken === 'APP_USR-xxxxxx-xxxxxx-xxxxxx') {
      console.log('Using simulated Mercado Pago checkout for order:', orderId);
      
      // Creamos una URL local de simulación de pago
      const mockCheckoutUrl = `${appUrl}/checkout/simulate-payment?orderId=${orderId}&productName=${encodeURIComponent(productName)}&total=${total}`;
      return NextResponse.json({ init_point: mockCheckoutUrl, isMock: true });
    }

    // Integración real con Mercado Pago
    const mpResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [
          {
            title: `RecuerdoQR - ${productName}`,
            quantity: 1,
            unit_price: Number(total),
            currency_id: 'CLP',
          },
        ],
        back_urls: {
          success: `${appUrl}/gracias?orderId=${orderId}&status=success`,
          failure: `${appUrl}/checkout?orderId=${orderId}&status=failure`,
          pending: `${appUrl}/checkout?orderId=${orderId}&status=pending`,
        },
        auto_return: 'approved',
        external_reference: orderId,
        payer: {
          email: customerEmail,
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
