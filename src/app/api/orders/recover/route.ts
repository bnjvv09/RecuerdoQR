import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabaseServer';
import { enviarEmailConfirmacionCliente } from '@/lib/servicioEmail';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    const cleanEmail = (email || '').trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Por favor ingresa un correo electrónico válido.' },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();

    // 1. Search orders by email
    const { data: orders, error: ordersErr } = await supabase
      .from('orders')
      .select('*')
      .ilike('customer_email', cleanEmail)
      .order('created_at', { ascending: false });

    if (ordersErr) {
      console.error('Error fetching orders for recovery:', ordersErr);
    }

    if (!orders || orders.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No encontramos ningún pedido registrado con este correo electrónico. Por favor verifica que esté bien escrito o escríbenos a soporte por WhatsApp.',
        },
        { status: 404 }
      );
    }

    // 2. Fetch experiences linked to these orders
    const orderIds = orders.map((o) => o.id);
    let experiences: any[] = [];

    if (orderIds.length > 0) {
      const { data: exps } = await supabase
        .from('experiences')
        .select('*')
        .in('order_id', orderIds);
      experiences = exps || [];
    }

    const domain = process.env.NEXT_PUBLIC_APP_URL || 'https://recuerdo-qr.vercel.app';

    // 3. Resend email for the latest order
    if (orders.length > 0 && experiences.length > 0) {
      const latestOrder = orders[0];
      const latestExp = experiences.find((e) => e.order_id === latestOrder.id) || experiences[0];
      if (latestExp) {
        enviarEmailConfirmacionCliente({
          orderId: latestOrder.id,
          customerName: latestOrder.customer_name,
          customerEmail: latestOrder.customer_email,
          customerPhone: latestOrder.customer_phone,
          productName: 'Recuerdo QR Digital',
          total: latestOrder.total,
          slug: latestExp.slug,
          partnerName: latestExp.partner_name,
          userName: latestExp.user_name,
          theme: latestExp.theme,
          specialDate: latestExp.special_date,
        }).catch((err) => console.error('Error resending recovery email:', err));
      }
    }

    const formattedExperiences = experiences.map((e) => ({
      id: e.id,
      slug: e.slug,
      partner_name: e.partner_name,
      user_name: e.user_name,
      title: e.title,
      special_date: e.special_date,
      created_at: e.created_at,
      live_url: `${domain}/amor/${e.slug}`,
      print_url: `${domain}/imprimir/${e.slug}`,
    }));

    return NextResponse.json({
      success: true,
      ordersCount: orders.length,
      experiences: formattedExperiences,
      message: `¡Encontramos ${orders.length} pedido(s)! Te hemos mostrado tus accesos directos abajo y reenviado un correo de respaldo.`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Error interno al procesar la solicitud' },
      { status: 500 }
    );
  }
}