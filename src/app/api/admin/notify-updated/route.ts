import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabaseServer';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const { experienceId } = await req.json();
    if (!experienceId) {
      return NextResponse.json({ success: false, error: 'experienceId requerido' }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    const { data: exp, error } = await supabase
      .from('experiences')
      .select('id, partner_name, user_name, slug, theme, title, order_id')
      .eq('id', experienceId)
      .single();

    if (error || !exp) {
      return NextResponse.json({ success: false, error: 'Experiencia no encontrada' }, { status: 404 });
    }

    let customerEmail = '';
    let customerName = exp.user_name || 'Estimado cliente';
    if (exp.order_id) {
      const { data: order } = await supabase
        .from('orders')
        .select('customer_email, customer_name')
        .eq('id', exp.order_id)
        .single();
      if (order) {
        customerEmail = order.customer_email || '';
        customerName = order.customer_name || customerName;
      }
    }

    if (!customerEmail) {
      return NextResponse.json({ success: false, error: 'No hay email del cliente' });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://recuerdoqr.cl';
    const experienceUrl = `${appUrl}/amor/${exp.slug}`;

    const gmailUser = process.env.GMAIL_USER || 'somosrecuerdosqr@gmail.com';
    const gmailPass = (process.env.GMAIL_APP_PASSWORD || '').replace(/\s+/g, '');

    if (!gmailPass) {
      return NextResponse.json({ success: false, error: 'Email no configurado' });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: gmailUser, pass: gmailPass },
    });

    await transporter.sendMail({
      from: `"RecuerdoQR ❤️" <${gmailUser}>`,
      to: customerEmail,
      subject: `❤️ Tu Recuerdo de ${exp.partner_name} ha sido actualizado`,
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head><meta charset="UTF-8"><style>
          body { font-family: -apple-system, sans-serif; background: #fffafb; margin: 0; padding: 20px; color: #1f2937; }
          .container { max-width: 560px; margin: 0 auto; background: #fff; border-radius: 20px; border: 1px solid #ffe4e6; overflow: hidden; }
          .header { background: linear-gradient(135deg, #a21232, #881337); padding: 32px 24px; text-align: center; color: white; }
          .header h1 { margin: 0; font-size: 22px; font-weight: 800; }
          .body { padding: 28px 24px; }
          .btn { display: inline-block; background: #a21232; color: #fff !important; padding: 13px 28px; border-radius: 9999px; text-decoration: none; font-weight: 700; font-size: 14px; margin: 8px 0; }
          .footer { background: #fdf2f4; padding: 16px 24px; text-align: center; font-size: 11px; color: #9ca3af; border-top: 1px solid #ffe4e6; }
        </style></head>
        <body>
          <div class="container">
            <div class="header">
              <h1>❤️ Tu Recuerdo fue Actualizado</h1>
              <p style="margin: 8px 0 0; opacity: 0.9; font-size: 13px;">Hemos realizado mejoras en tu experiencia</p>
            </div>
            <div class="body">
              <p>Hola <strong>${customerName}</strong>,</p>
              <p>Hemos actualizado tu experiencia personalizada para <strong>${exp.partner_name}</strong>. Ya puedes verla con los cambios aplicados:</p>
              <div style="text-align: center; margin: 24px 0;">
                <a href="${experienceUrl}" class="btn">❤️ Ver Experiencia Actualizada</a>
              </div>
              <p style="font-size: 12px; color: #6b7280;">Si tienes preguntas o necesitas más cambios, respóndenos este correo.</p>
            </div>
            <div class="footer">❤️ RecuerdoQR Chile • Experiencias Románticas</div>
          </div>
        </body>
        </html>
      `,
    });

    return NextResponse.json({ success: true, emailSent: customerEmail });
  } catch (err: any) {
    console.error('Error sending update notification:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
