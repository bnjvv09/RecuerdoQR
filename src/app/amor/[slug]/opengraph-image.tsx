import { ImageResponse } from 'next/og';
import { getExperienceBySlug } from '@/lib/db';

export const runtime = 'edge';

export const alt = 'Nuestra Historia de Amor ❤️ | RecuerdoQR';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
  const exp = await getExperienceBySlug(params.slug);
  const partnerName = exp?.partner_name || 'Mi Amor';
  const userName = exp?.user_name || 'Tu Pareja';
  const specialDate = exp?.special_date || '';

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1c0308 0%, #4a0614 40%, #880e28 75%, #a21232 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 40px',
          fontFamily: 'sans-serif',
          color: 'white',
          position: 'relative',
          textAlign: 'center',
        }}
      >
        {/* Glow Effects */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(244,63,94,0.3) 0%, rgba(244,63,94,0) 70%)',
          }}
        />

        {/* Floating Heart Icon */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80px',
            height: '80px',
            borderRadius: '24px',
            background: 'rgba(255, 255, 255, 0.15)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            fontSize: '40px',
            marginBottom: '20px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          }}
        >
          ❤️
        </div>

        {/* Small Tag */}
        <div
          style={{
            fontSize: '20px',
            color: '#fda4af',
            fontWeight: 700,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            marginBottom: '12px',
          }}
        >
          Un Regalo Especial Para Ti
        </div>

        {/* Couple Names */}
        <div
          style={{
            fontSize: '58px',
            fontWeight: 900,
            lineHeight: 1.1,
            color: '#ffffff',
            marginBottom: '16px',
            maxWidth: '900px',
            textShadow: '0 4px 20px rgba(0,0,0,0.5)',
          }}
        >
          {partnerName} & {userName}
        </div>

        {specialDate && (
          <div
            style={{
              fontSize: '22px',
              color: '#ffe4e6',
              fontWeight: 500,
              marginBottom: '24px',
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '6px 20px',
              borderRadius: '9999px',
            }}
          >
            Juntos desde el {specialDate}
          </div>
        )}

        {/* CTA box */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'linear-gradient(90deg, #e11d48 0%, #f43f5e 100%)',
            color: 'white',
            padding: '14px 36px',
            borderRadius: '9999px',
            fontSize: '22px',
            fontWeight: 800,
            boxShadow: '0 10px 25px rgba(225,29,72,0.5)',
            border: '2px solid rgba(255, 255, 255, 0.4)',
          }}
        >
          <span>Toca para abrir nuestro recuerdo 🎁</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
