'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { getExperiences, getOrders, Order, Experience } from '@/lib/db';
import QRCode from 'qrcode';
import { 
  Heart, 
  Download, 
  ExternalLink, 
  CheckCircle, 
  Printer, 
  MessageCircle, 
  Sparkles,
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';

function GraciasContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const cardPrintRef = useRef<HTMLDivElement>(null);
  const orderId = searchParams.get('orderId') || '';

  const [order, setOrder] = useState<Order | null>(null);
  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrDataUrl, setQrDataUrl] = useState('');

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    // Romantic celebration confetti
    confetti({
      particleCount: 140,
      spread: 85,
      origin: { y: 0.6 },
      colors: ['#a21232', '#e11d48', '#fda4af', '#fecdd3', '#ffffff'],
    });

    const loadData = async () => {
      try {
        const orderList = await getOrders();
        const matchedOrder = orderList.find(o => o.id === orderId);

        if (matchedOrder) {
          setOrder(matchedOrder);

          const expList = await getExperiences();
          const matchedExp = expList.find(e => e.order_id === orderId);
          if (matchedExp) {
            setExperience(matchedExp);

            const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
            const fullUrl = `${appUrl}/amor/${matchedExp.slug}`;

            const qrUrl = await QRCode.toDataURL(fullUrl, {
              width: 500,
              margin: 2,
              color: {
                dark: '#a21232',
                light: '#ffffff',
              },
            });
            setQrDataUrl(qrUrl);
          }
        }
      } catch (error) {
        console.error('Error loading confirmation page data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [orderId]);

  const handleDownloadQr = () => {
    if (!qrDataUrl || !experience) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `recuerdo-qr-${experience.slug}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintCard = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-12 h-12 border-4 border-rose-200 border-t-[#a21232] rounded-full animate-spin"></div>
        <p className="text-xs text-gray-500 font-medium">Cargando confirmación de tu regalo...</p>
      </div>
    );
  }

  if (!order || !experience) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center bg-white p-8 rounded-3xl border border-rose-100 shadow-xl space-y-4">
          <Heart className="w-14 h-14 text-[#a21232] mx-auto animate-bounce" />
          <h2 className="text-xl font-serif font-bold text-gray-900">¡Gracias por tu Compra!</h2>
          <p className="text-xs text-gray-500 font-light leading-relaxed">
            Tu pedido está registrado en el sistema. Puedes volver a la tienda o contactarnos por WhatsApp si tienes alguna consulta.
          </p>
          <button
            onClick={() => router.push('/')}
            className="w-full py-3 bg-[#a21232] text-white font-bold rounded-xl transition hover:bg-[#880e28] text-xs"
          >
            Volver a la Tienda
          </button>
        </div>
      </div>
    );
  }

  const appUrl = typeof window !== 'undefined' ? window.location.origin : 'https://recuerdoqr.cl';
  const experienceLink = `${appUrl}/amor/${experience.slug}`;
  const formattedDate = experience.special_date || new Date().toLocaleDateString('es-CL');

  // Theme helper for the gift card
  const getThemeCardDetails = (themeId?: string) => {
    switch (themeId) {
      case 'birthday':
      case 'cumpleanos':
        return {
          emoji: '🎂',
          tagline: '— F E L I Z &nbsp; C U M P L E A Ñ O S —',
          borderDashed: 'border-fuchsia-300',
          accentColor: '#c026d3',
          badgeText: 'Temática de Cumpleaños 🎉',
        };
      case 'proposal':
      case 'propuesta':
        return {
          emoji: '💍',
          tagline: '— U N A &nbsp; P R O P U E S T A &nbsp; I N O L V I D A B L E —',
          borderDashed: 'border-amber-400',
          accentColor: '#d97706',
          badgeText: 'Temática de Propuesta 💍',
        };
      case 'letters':
      case 'carta':
        return {
          emoji: '💌',
          tagline: '— C A R T A &nbsp; D E &nbsp; A M O R &nbsp; E T E R N O —',
          borderDashed: 'border-amber-300',
          accentColor: '#92400e',
          badgeText: 'Temática Carta de Amor 💌',
        };
      case 'anniversary':
      case 'aniversario':
      default:
        return {
          emoji: '❤️',
          tagline: '— U N &nbsp; R E G A L O &nbsp; E S P E C I A L —',
          borderDashed: 'border-rose-300',
          accentColor: '#a21232',
          badgeText: 'Temática de Aniversario ❤️',
        };
    }
  };

  const themeDetails = getThemeCardDetails(experience.theme);

  return (
    <div className="py-10 md:py-16 bg-rose-50/15">
      
      {/* Print Styles for the Gift Card */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-digital-card, #printable-digital-card * {
            visibility: visible !important;
          }
          #printable-digital-card {
            position: fixed !important;
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) scale(1.1) !important;
            width: 100% !important;
            max-width: 400px !important;
            box-shadow: none !important;
            border: 2px dashed ${themeDetails.accentColor} !important;
            background: white !important;
            padding: 32px !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 animate-fade-in no-print">
        
        {/* Header */}
        <div className="space-y-3">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-inner">
            <CheckCircle className="w-9 h-9" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest bg-rose-50 border border-rose-200 px-3.5 py-1 rounded-full inline-block" style={{ color: themeDetails.accentColor }}>
            ✨ {themeDetails.badgeText}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
            ¡Muchas gracias por tu compra! Tu tarjeta está lista ✨
          </h1>
          <p className="text-gray-600 text-xs sm:text-sm font-light max-w-md mx-auto leading-relaxed">
            Hemos preparado tu tarjeta de regalo personalizada con mucho amor para <strong>{experience.partner_name}</strong>. Ya puedes imprimirla en papel, descargarla en tu celular o compartir el enlace directo.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-3xl mx-auto">
          
          {/* Left: The Gorgeous Romantic Gift Card */}
          <div className="lg:col-span-7 flex justify-center">
            <div
              id="printable-digital-card"
              ref={cardPrintRef}
              className={`bg-white rounded-[32px] border-2 border-dashed ${themeDetails.borderDashed} p-6 sm:p-8 max-w-[340px] w-full text-center space-y-4 shadow-xl relative`}
            >
              {/* Theme Emoji Top */}
              <div className="flex justify-center">
                <span className="text-3xl select-none animate-pulse">{themeDetails.emoji}</span>
              </div>

              {/* Tagline */}
              <div 
                className="text-[8px] font-bold uppercase tracking-[0.25em] select-none"
                style={{ color: themeDetails.accentColor }}
                dangerouslySetInnerHTML={{ __html: themeDetails.tagline }}
              />

              {/* Names */}
              <div className="space-y-0.5">
                <h2 className="font-serif text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight">
                  Para {experience.partner_name || 'Mi Amor'}
                </h2>
                <p className="text-[10px] text-gray-500 italic font-serif">
                  De parte de: <span className="font-semibold text-gray-800">{experience.user_name || 'Alguien que te ama'}</span>
                </p>
              </div>

              {/* Dedication Snippet */}
              {experience.message && (
                <div className="bg-rose-50/40 border border-rose-100/80 rounded-2xl p-2.5 px-3">
                  <p className="text-[9px] text-gray-700 font-serif italic leading-relaxed">
                    «{experience.message}»
                  </p>
                </div>
              )}

              {/* Embedded QR Code */}
              <div className="flex justify-center my-1">
                <div className="p-2.5 bg-white rounded-2xl border border-gray-200 shadow-sm inline-block">
                  {qrDataUrl ? (
                    <Image
                      src={qrDataUrl}
                      alt="Código QR de Amor"
                      width={160}
                      height={160}
                      unoptimized
                      priority
                      className="w-36 h-36 sm:w-40 sm:h-40 mx-auto object-contain rounded-lg"
                    />
                  ) : (
                    <div className="w-36 h-36 bg-gray-100 flex items-center justify-center text-[9px] text-gray-400">
                      Cargando QR...
                    </div>
                  )}
                </div>
              </div>

              {/* Scan Instruction & Date */}
              <div className="space-y-1">
                <p className="text-[9px] font-bold flex items-center justify-center gap-1" style={{ color: themeDetails.accentColor }}>
                  <span>📱</span>
                  <span>Escanea con tu celular para abrir tu sorpresa</span>
                </p>
                <p className="text-[8px] text-gray-400 font-mono">
                  {formattedDate}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Quick Action Buttons */}
          <div className="lg:col-span-5 text-left space-y-3">
            <div className="bg-white rounded-2xl border border-rose-100 p-5 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider font-serif">
                Opciones de Tu Regalo
              </h3>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handlePrintCard}
                  className="w-full py-3 bg-[#a21232] hover:bg-[#880e28] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir / Guardar Tarjeta (PDF)</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadQr}
                  className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-[#a21232] font-bold rounded-xl text-xs flex items-center justify-center gap-2 border border-rose-200 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar solo el QR (PNG HD)</span>
                </button>

                <a
                  href={experienceLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Ver Experiencia en Vivo</span>
                </a>

                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`❤️ ¡Hola mi amor! He preparado una sorpresa muy especial para ti: ${experienceLink}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Enviar enlace por WhatsApp</span>
                </a>
              </div>
            </div>

            <div className="text-[11px] text-gray-500 font-light px-1">
              ✉️ Confirmación y enlace enviados a: <strong>{order.customer_email}</strong>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

export default function GraciasPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-rose-200 border-t-[#a21232] rounded-full animate-spin"></div>
      </div>
    }>
      <GraciasContent />
    </Suspense>
  );
}
