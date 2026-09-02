import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'RecuerdoQR - El Regalo Más Romántico para tu Pareja';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #120205 0%, #3b0510 35%, #7a0b22 70%, #a21232 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '60px 80px',
          fontFamily: 'sans-serif',
          color: 'white',
          position: 'relative',
        }}
      >
        {/* Glow Effects */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '450px',
            height: '450px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(244,63,94,0.35) 0%, rgba(244,63,94,0) 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-100px',
            left: '-100px',
            width: '450px',
            height: '450px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(225,29,72,0.3) 0%, rgba(225,29,72,0) 70%)',
          }}
        />

        {/* Left: Text Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            maxWidth: '620px',
            zIndex: 10,
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              borderRadius: '9999px',
              padding: '8px 18px',
              fontSize: '18px',
              fontWeight: 700,
              color: '#fda4af',
              marginBottom: '24px',
              width: 'fit-content',
            }}
          >
            <span>✨ Experiencias Digitales de Amor</span>
          </div>

          {/* Title */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '56px',
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: '-1px',
              marginBottom: '16px',
            }}
          >
            <span>Recuerdo</span>
            <span style={{ color: '#fb7185' }}>QR</span>
            <span style={{ marginLeft: '12px' }}>❤️</span>
          </div>

          {/* Subtitle / Slogan */}
          <p
            style={{
              fontSize: '28px',
              fontWeight: 400,
              color: '#ffe4e6',
              lineHeight: 1.35,
              margin: 0,
              marginBottom: '32px',
            }}
          >
            El regalo más emotivo para tu pareja: fotos, música, carta y contador de amor en un código QR permanente.
          </p>

          {/* Features pills */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '12px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(255,255,255,0.08)',
                padding: '8px 14px',
                borderRadius: '12px',
                fontSize: '16px',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              ⏱️ Contador en Vivo
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(255,255,255,0.08)',
                padding: '8px 14px',
                borderRadius: '12px',
                fontSize: '16px',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              🎵 Música Favorita
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(255,255,255,0.08)',
                padding: '8px 14px',
                borderRadius: '12px',
                fontSize: '16px',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              💌 Tarjeta Temática
            </div>
          </div>
        </div>

        {/* Right: Romantic QR Card Mockup Illustration */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'linear-gradient(180deg, #ffffff 0%, #fff1f2 100%)',
              borderRadius: '28px',
              padding: '32px',
              width: '320px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(244,63,94,0.4)',
              border: '2px solid rgba(255, 255, 255, 0.9)',
              position: 'relative',
              transform: 'rotate(3deg)',
            }}
          >
            {/* Top Card Icon */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background: '#a21232',
                color: '#ffffff',
                fontSize: '28px',
                marginBottom: '16px',
              }}
            >
              ❤️
            </div>

            <div
              style={{
                fontSize: '20px',
                fontWeight: 800,
                color: '#1f2937',
                marginBottom: '4px',
                textAlign: 'center',
              }}
            >
              Nuestra Historia
            </div>
            <div
              style={{
                fontSize: '13px',
                color: '#e11d48',
                fontWeight: 600,
                marginBottom: '20px',
              }}
            >
              Escanea para abrir 🎁
            </div>

            {/* QR Pattern Representation */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '180px',
                height: '180px',
                background: '#ffffff',
                borderRadius: '18px',
                border: '3px solid #fecdd3',
                padding: '12px',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(135deg, #a21232 0%, #e11d48 100%)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '52px',
                }}
              >
                📱
              </div>
            </div>

            <div
              style={{
                fontSize: '12px',
                color: '#9ca3af',
                marginTop: '16px',
                fontWeight: 500,
              }}
            >
              recuerdo-qr.vercel.app
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
