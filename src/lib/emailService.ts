// src/lib/emailService.ts

export interface OrderEmailData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  productName: string;
  total: number;
  slug: string;
  partnerName: string;
  userName: string;
  theme?: string;
  couponCode?: string;
  specialDate?: string;
}

/**
 * Sends a confirmation email to the customer with their live experience link and QR access.
 */
export async function sendCustomerConfirmationEmail(data: OrderEmailData) {
  const apiKey = process.env.RESEND_API_KEY;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://recuerdoqr.cl';
  const experienceUrl = `${appUrl}/amor/${data.slug}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #fffafb; margin: 0; padding: 20px; color: #1f2937; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 24px; overflow: hidden; border: 1px solid #ffe4e6; box-shadow: 0 10px 25px -5px rgba(162, 18, 50, 0.08); }
        .header { background: linear-gradient(135deg, #a21232 0%, #881337 100%); padding: 36px 24px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
        .header p { margin: 8px 0 0; font-size: 14px; opacity: 0.9; }
        .body { padding: 32px 28px; }
        .box { background: #fff1f2; border: 1.5px dashed #f43f5e; border-radius: 18px; padding: 20px; text-align: center; margin: 24px 0; }
        .btn { display: inline-block; background-color: #a21232; color: #ffffff !important; padding: 14px 32px; border-radius: 9999px; text-decoration: none; font-weight: 700; font-size: 15px; margin: 12px 0; box-shadow: 0 4px 14px rgba(162, 18, 50, 0.3); }
        .footer { background: #fdf2f4; padding: 20px 24px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #ffe4e6; }
        .details-table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px; }
        .details-table td { padding: 8px 0; border-bottom: 1px solid #f3f4f6; }
        .details-table td.label { font-weight: 600; color: #4b5563; }
        .details-table td.value { text-align: right; font-weight: 700; color: #111827; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>¡Tu Recuerdo Romántico está Listo! ❤️</h1>
          <p>Pago confirmado exitosamente</p>
        </div>
        <div class="body">
          <p>Hola <strong>${data.customerName}</strong>,</p>
          <p>¡Muchas gracias por tu compra! Tu experiencia personalizada para <strong>${data.partnerName}</strong> ha sido creada y publicada en vivo.</p>
          
          <div class="box">
            <h3 style="margin: 0 0 8px; color: #9f1239; font-size: 16px;">✨ Tu Enlace Directo</h3>
            <p style="margin: 0; font-size: 12px; color: #6b7280;">Puedes abrirlo desde cualquier celular, tablet o computador:</p>
            <a href="${experienceUrl}" class="btn" target="_blank">Abrir Experiencia Romántica 🎁</a>
            <p style="margin: 4px 0 0; font-size: 11px; color: #9ca3af; word-break: break-all;">${experienceUrl}</p>
          </div>

          <table class="details-table">
            <tr>
              <td class="label">N° de Pedido:</td>
              <td class="value">${data.orderId.slice(0, 12)}...</td>
            </tr>
            <tr>
              <td class="label">Plan Seleccionado:</td>
              <td class="value">${data.productName}</td>
            </tr>
            <tr>
              <td class="label">Total Pagado:</td>
              <td class="value">$${Number(data.total).toLocaleString('es-CL')} CLP</td>
            </tr>
            <tr>
              <td class="label">De:</td>
              <td class="value">${data.userName}</td>
            </tr>
            <tr>
              <td class="label">Para:</td>
              <td class="value">${data.partnerName}</td>
            </tr>
          </table>

          <div style="margin-top: 24px; padding: 16px; background-color: #f9fafb; border-radius: 12px; font-size: 12px; color: #6b7280;">
            <p style="margin: 0 0 6px; font-weight: 700; color: #374151;">💡 ¿Cómo sorprender a tu pareja?</p>
            <ul style="margin: 0; padding-left: 18px;">
              <li>Imprime la tarjeta con código QR o envíale el enlace por WhatsApp.</li>
              <li>Pídele que escanee el código con la cámara de su celular.</li>
              <li>¡Disfruten juntos de la música, fotos y dedicatoria!</li>
            </ul>
          </div>
        </div>
        <div class="footer">
          <p style="margin: 0 0 4px;">RecuerdoQR Chile – Guardando historias inolvidables.</p>
          <p style="margin: 0;">¿Dudas o consultas? Respóndenos a este correo o escríbenos a nuestro WhatsApp oficial.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  if (!apiKey || apiKey === 're_placeholder_key') {
    console.log(`[Email Service - Simulation] Confirmation email for order ${data.orderId} to ${data.customerEmail}: ${experienceUrl}`);
    return { success: true, simulated: true };
  }

  try {
    const fromAddress = process.env.RESEND_FROM_EMAIL || 'RecuerdoQR <onboarding@resend.dev>';
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [data.customerEmail],
        subject: `¡Tu RecuerdoQR para ${data.partnerName} está listo! ❤️✨`,
        html: htmlContent,
      }),
    });

    const result = await res.json();
    return { success: res.ok, data: result };
  } catch (error) {
    console.error('Error sending confirmation email via Resend:', error);
    return { success: false, error };
  }
}

/**
 * Sends a real-time sales alert notification to the store administrator.
 */
export async function sendAdminSalesNotification(data: OrderEmailData) {
  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'somosrecuerdosqr@gmail.com';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://recuerdoqr.cl';
  const experienceUrl = `${appUrl}/amor/${data.slug}`;

  // Extraer dígitos para link de WhatsApp directo
  const rawPhone = (data.customerPhone || '').replace(/\D/g, '');
  const cleanPhone = rawPhone.length >= 9 ? (rawPhone.startsWith('56') ? rawPhone : `56${rawPhone}`) : '';

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 20px; color: #111827; }
        .container { max-width: 550px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #e5e7eb; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); }
        .header { background: linear-gradient(135deg, #059669 0%, #047857 100%); padding: 28px 24px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 22px; font-weight: 800; }
        .header p { margin: 6px 0 0; font-size: 13px; opacity: 0.9; }
        .body { padding: 28px; }
        .amount-box { background: #ecfdf5; border: 1.5px solid #a7f3d0; border-radius: 16px; padding: 16px; text-align: center; margin-bottom: 20px; }
        .amount-title { margin: 0; font-size: 11px; color: #065f46; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
        .amount-val { margin: 4px 0 0; font-size: 28px; font-weight: 900; color: #047857; }
        .table { width: 100%; border-collapse: collapse; font-size: 13px; margin: 16px 0; }
        .table td { padding: 9px 0; border-bottom: 1px solid #f3f4f6; }
        .table td.label { font-weight: 600; color: #6b7280; width: 42%; }
        .table td.val { font-weight: 700; color: #111827; text-align: right; }
        .btn-live { display: block; text-align: center; background: #a21232; color: #ffffff !important; padding: 13px 20px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 14px; margin-top: 20px; box-shadow: 0 4px 12px rgba(162,18,50,0.25); }
        .btn-wa { display: inline-block; background: #25d366; color: #ffffff !important; padding: 4px 10px; border-radius: 6px; text-decoration: none; font-weight: 700; font-size: 10px; margin-left: 6px; }
        .btn-admin { display: block; text-align: center; color: #4b5563; font-size: 12px; text-decoration: none; margin-top: 14px; font-weight: 600; }
        .footer { background: #f9fafb; padding: 16px; text-align: center; font-size: 11px; color: #9ca3af; border-top: 1px solid #f3f4f6; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 ¡Nueva Venta Aprobada en RecuerdoQR!</h1>
          <p>Se ha recibido y confirmado un nuevo pago</p>
        </div>
        <div class="body">
          <div class="amount-box">
            <p class="amount-title">Total Pagado</p>
            <p class="amount-val">$${Number(data.total).toLocaleString('es-CL')} CLP</p>
          </div>

          <table class="table">
            <tr>
              <td class="label">📦 Plan Comprado:</td>
              <td class="val">${data.productName}</td>
            </tr>
            <tr>
              <td class="label">👤 Cliente:</td>
              <td class="val">${data.customerName}</td>
            </tr>
            <tr>
              <td class="label">📧 Correo:</td>
              <td class="val"><a href="mailto:${data.customerEmail}" style="color: #0284c7; text-decoration: none;">${data.customerEmail}</a></td>
            </tr>
            <tr>
              <td class="label">📱 Teléfono:</td>
              <td class="val">
                ${data.customerPhone || 'No registrado'}
                ${cleanPhone ? `<a href="https://wa.me/${cleanPhone}" class="btn-wa" target="_blank">WhatsApp 💬</a>` : ''}
              </td>
            </tr>
            <tr>
              <td class="label">👫 Pareja del Recuerdo:</td>
              <td class="val">${data.partnerName} & ${data.userName}</td>
            </tr>
            ${data.theme ? `
            <tr>
              <td class="label">🎨 Temática:</td>
              <td class="val">${data.theme}</td>
            </tr>
            ` : ''}
            ${data.couponCode ? `
            <tr>
              <td class="label">🎟️ Cupón de Descuento:</td>
              <td class="val" style="color: #059669;">${data.couponCode}</td>
            </tr>
            ` : ''}
            <tr>
              <td class="label">🆔 ID de Pedido:</td>
              <td class="val" style="font-family: monospace; font-size: 11px;">${data.orderId.slice(0, 16)}</td>
            </tr>
          </table>

          <a href="${experienceUrl}" class="btn-live" target="_blank">
            Ver Experiencia Publicada del Cliente 🔗
          </a>

          <a href="${appUrl}/admin" class="btn-admin" target="_blank">
            Ir al Panel de Administración RecuerdoQR →
          </a>
        </div>
        <div class="footer">
          <p style="margin: 0;">Notificación automática de ventas para <strong>${adminEmail}</strong></p>
        </div>
      </div>
    </body>
    </html>
  `;

  if (!apiKey || apiKey === 're_placeholder_key') {
    console.log(`[Admin Alert - Simulation] New Sale for ${adminEmail}: ${data.productName} ($${data.total}) by ${data.customerName}`);
    return { success: true, simulated: true };
  }

  try {
    const fromAddress = process.env.RESEND_FROM_EMAIL || 'RecuerdoQR <onboarding@resend.dev>';
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [adminEmail],
        subject: `💰 ¡Nueva Venta! $${Number(data.total).toLocaleString('es-CL')} CLP - ${data.productName} (${data.customerName})`,
        html: htmlContent,
      }),
    });

    const result = await res.json();
    return { success: res.ok, data: result };
  } catch (error) {
    console.error('Error sending admin sales alert:', error);
    return { success: false, error };
  }
}
