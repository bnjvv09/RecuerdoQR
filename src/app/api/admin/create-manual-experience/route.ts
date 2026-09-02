import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import QRCode from 'qrcode';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerPhone,
      customerEmail,
      productId = 'digital',
      title,
      partnerName,
      userName,
      specialDate,
      message,
      historyText,
      songUrl,
      themeId = 'anniversary',
      customFont = 'great-vibes',
      customColors,
      photoStyle = 'polaroid',
      slug,
      sections,
      photos = [],
      milestones = [],
      extraConfig = {}
    } = body;

    if (!partnerName || !userName) {
      return NextResponse.json(
        { error: 'Faltan los nombres de la pareja' },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    const isMock = !supabaseUrl || !supabaseServiceRoleKey || supabaseUrl.includes('placeholder-project');

    // Generate unique slug if not provided
    let finalSlug = (slug || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    if (!finalSlug) {
      const cleanPartner = partnerName.toLowerCase().replace(/[^a-z0-9]/g, '');
      const cleanUser = userName.toLowerCase().replace(/[^a-z0-9]/g, '');
      finalSlug = `${cleanPartner}-${cleanUser}-${Math.floor(100 + Math.random() * 900)}`;
    }

    const orderId = typeof crypto !== 'undefined' && crypto.randomUUID 
      ? crypto.randomUUID 
        ? crypto.randomUUID() 
        : Math.random().toString(36).substring(2, 15)
      : Math.random().toString(36).substring(2, 15);

    const experienceId = typeof crypto !== 'undefined' && crypto.randomUUID 
      ? crypto.randomUUID() 
      : Math.random().toString(36).substring(2, 15);

    const fullConfig = {
      themeId,
      customFont,
      customColors: customColors || { primary: '#a21232', bg: '#fffcfd', text: '#111827' },
      photoStyle,
      sections: sections || [],
      ...extraConfig
    };

    if (!isMock) {
      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: { persistSession: false }
      });

      // 1. Insert Order
      const { data: orderData, error: orderError } = await supabaseAdmin
        .from('orders')
        .insert([{
          id: orderId,
          product_id: productId,
          customer_name: customerName || userName,
          customer_email: customerEmail || `${finalSlug}@recuerdoqr.cl`,
          customer_phone: customerPhone || '',
          delivery_address: 'Entrega Directa WhatsApp ($0 Admin)',
          total: productId === 'premium' ? 14990 : productId === 'card' ? 9990 : 4990,
          status: 'paid',
          payment_id: 'manual_whatsapp'
        }])
        .select()
        .single();

      if (orderError) {
        console.error('Error inserting order via Service Role:', orderError);
        throw new Error(`Error en tabla orders: ${orderError.message}`);
      }

      // 2. Insert Experience
      const { data: expData, error: expError } = await supabaseAdmin
        .from('experiences')
        .insert([{
          id: experienceId,
          order_id: orderId,
          slug: finalSlug,
          title: title || 'Para el amor de mi vida ❤️',
          partner_name: partnerName,
          user_name: userName,
          special_date: specialDate || '2024-02-14',
          message: message || '',
          history_text: historyText || '',
          song_url: songUrl || '',
          theme: themeId,
          config: fullConfig
        }])
        .select()
        .single();

      if (expError) {
        console.error('Error inserting experience via Service Role:', expError);
        throw new Error(`Error en tabla experiences: ${expError.message}`);
      }

      // 3. Insert Photos
      if (photos.length > 0) {
        const photoRows = photos.map((p: any, idx: number) => ({
          id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
          experience_id: experienceId,
          url: p.url || p.previewUrl,
          caption: p.caption || '',
          order_index: idx
        }));
        const { error: photoErr } = await supabaseAdmin.from('photos').insert(photoRows);
        if (photoErr) console.error('Error inserting photo rows:', photoErr);
      }

      // 4. Insert Milestones
      if (milestones.length > 0) {
        const milestoneRows = milestones.map((m: any, idx: number) => ({
          id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
          experience_id: experienceId,
          title: m.title,
          date: m.date,
          description: m.description || '',
          image_url: m.image_url || m.previewUrl || '',
          order_index: idx
        }));
        const { error: milestoneErr } = await supabaseAdmin.from('milestones').insert(milestoneRows);
        if (milestoneErr) console.error('Error inserting milestone rows:', milestoneErr);
      }
    }

    // Generate QR Code
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://recuerdoqr.cl';
    const liveUrl = `${appUrl}/amor/${finalSlug}`;
    const qrDataUrl = await QRCode.toDataURL(liveUrl, {
      width: 600,
      margin: 2,
      color: { dark: '#a21232', light: '#ffffff' }
    });

    return NextResponse.json({
      success: true,
      orderId,
      experienceId,
      slug: finalSlug,
      url: liveUrl,
      qrDataUrl,
      customerName: customerName || userName,
      customerPhone: customerPhone || '',
      partnerName
    });

  } catch (error: any) {
    console.error('Error in create-manual-experience API:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
