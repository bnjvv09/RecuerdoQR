import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const alt = 'RecuerdoQR — Experiencia Romántica Personalizada';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const THEME_META: Record<string, { bg: string; emoji: string; label: string }> = {
  anniversary: { bg: '#a21232', emoji: '❤️', label: 'Aniversario' },
  birthday: { bg: '#db2777', emoji: '🎂', label: 'Cumpleaños' },
  'dating-proposal': { bg: '#be185d', emoji: '💕', label: 'Propuesta de Noviazgo' },
  'marriage-proposal': { bg: '#92400e', emoji: '💍', label: 'Propuesta de Matrimonio' },
  'love-confession': { bg: '#e11d48', emoji: '🔥', label: 'Confesión de Amor' },
  'love-letter': { bg: '#78350f', emoji: '💌', label: 'Carta de Amor' },
  surprise: { bg: '#4338ca', emoji: '🎁', label: 'Sorpresa' },
  valentines: { bg: '#9f1239', emoji: '💝', label: 'San Valentín' },
  pregnancy: { bg: '#0e7490', emoji: '👶', label: 'Anuncio de Embarazo' },
  special: { bg: '#b45309', emoji: '✨', label: 'Momento Especial' },
  gratitude: { bg: '#0f766e', emoji: '🙏', label: 'Gratitud' },
  reconciliation: { bg: '#374151', emoji: '🤝', label: 'Reconciliación' },
};

export default async function Image({ params }: { params: { slug: string } }) {
  const { slug } = params;
  let partnerName = '';
  let userName = '';
  let theme = 'anniversary';
  let title = 'Una experiencia romántica especial';

  if (!slug.startsWith('ejemplo-')) {
    try {
      const { createServerSupabaseClient } = await import('@/lib/supabaseServer');
      const supabase = createServerSupabaseClient();
      const { data: exp } = await supabase
        .from('experiences')
        .select('partner_name, user_name, theme, title')
        .eq('slug', slug)
        .single();
      if (exp) {
        partnerName = exp.partner_name || '';
        userName = exp.user_name || '';
        theme = exp.theme || 'anniversary';
        title = exp.title || `Para ${partnerName} con amor`;
      }
    } catch {}
  }

  const meta = THEME_META[theme] || THEME_META.anniversary;

  return new ImageResponse(
    (
      <div
        style={{
          background: `linear-gradient(135deg, ${meta.bg}ee 0%, ${meta.bg} 50%, #0d0205 100%)`,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '70px',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background glow */}
        <div style={{
          position: 'absolute', top: '-100px', right: '-100px',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)',
        }} />
        {/* Theme badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          background: 'rgba(255,255,255,0.15)',
          borderRadius: '999px', padding: '10px 24px',
          fontSize: '18px', fontWeight: 700, letterSpacing: '3px',
          textTransform: 'uppercase', marginBottom: '28px', border: '1px solid rgba(255,255,255,0.2)',
        }}>
          <span>{meta.emoji}</span>
          <span>{meta.label}</span>
        </div>
        {/* Title */}
        <div style={{
          fontSize: title.length > 40 ? '52px' : '66px', fontWeight: 900,
          textAlign: 'center', lineHeight: 1.1, marginBottom: '20px',
          textShadow: '0 4px 24px rgba(0,0,0,0.4)', maxWidth: '950px',
        }}>
          {title}
        </div>
        {/* Subtitle */}
        {(partnerName || userName) && (
          <div style={{
            fontSize: '24px', opacity: 0.8, marginBottom: '36px', fontStyle: 'italic',
          }}>
            {userName ? `De ${userName} para ${partnerName}` : `Para ${partnerName}`}
          </div>
        )}
        {/* Divider */}
        <div style={{ width: '80px', height: '3px', background: 'rgba(255,255,255,0.35)', marginBottom: '30px', borderRadius: '9999px' }} />
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '22px' }}>❤️</span>
          <span style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '1px' }}>RecuerdoQR</span>
          <span style={{ opacity: 0.4, fontSize: '20px' }}>•</span>
          <span style={{ fontSize: '17px', opacity: 0.7 }}>Experiencias Románticas</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
