import { NextResponse } from 'next/server';
import { sendAdminSalesNotification } from '@/lib/emailService';

export async function POST() {
  try {
    const testData = {
      orderId: `test-ord-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: 'Cliente de Prueba',
      customerEmail: 'cliente.prueba@ejemplo.com',
      customerPhone: '+56 9 1234 5678',
      productName: 'Plan Máximo VIP (+40 Fotos)',
      total: 8990,
      slug: 'camila-matias-prueba',
      partnerName: 'Camila',
      userName: 'Matías',
      theme: 'anniversary',
      couponCode: 'PROMO30',
    };

    const res = await sendAdminSalesNotification(testData);

    const apiKey = process.env.RESEND_API_KEY;
    const hasGmail = Boolean(process.env.GMAIL_APP_PASSWORD || 'khilsnssdjzucdtg');
    const hasRealKey = hasGmail || Boolean(apiKey && !apiKey.includes('placeholder') && apiKey.startsWith('re_'));

    return NextResponse.json({
      ...res,
      hasRealKey,
      targetEmail: process.env.ADMIN_NOTIFICATION_EMAIL || 'somosrecuerdosqr@gmail.com',
    });
  } catch (err: any) {
    console.error('Error sending test sales email:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
