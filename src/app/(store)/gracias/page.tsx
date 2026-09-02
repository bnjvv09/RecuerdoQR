'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { getOrderById, getExperienceByOrderId, Order, Experience } from '@/lib/db';
import QRCode from 'qrcode';
import { 
  Heart, 
  Download, 
  ExternalLink, 
  CheckCircle, 
  Printer, 
  MessageCircle, 
  Sparkles,
  Share2,
  Copy,
  Check,
  Star,
  Lock,
  Unlock
} from 'lucide-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { CHARACTERS_DATABASE } from '@/data/charactersData';
import { getFontFamily } from '@/lib/fonts';

function GraciasContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const cardPrintRef = useRef<HTMLDivElement>(null);
  const orderId = searchParams.get('orderId') || '';

  const [order, setOrder] = useState<Order | null>(null);
  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrDataUrl, setQrDataUrl] = useState('');

  // Estados de Reseña y Desbloqueo de Código QR
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

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
        const matchedOrder = await getOrderById(orderId);

        if (matchedOrder) {
          setOrder(matchedOrder);

          const matchedExp = await getExperienceByOrderId(orderId);
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

  const [copied, setCopied] = useState(false);

  const handlePrintCard = () => {
    window.print();
  };

  const handleCopyLink = () => {
    if (!experience) return;
    const url = `${appUrl}/amor/${experience.slug}`;
    navigator.clipboard.writeText(url);
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(50);
    }
    setCopied(true);
    toast.success('¡Enlace de amor copiado al portapapeles! 📋');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      toast.error('Por favor escribe un breve comentario sobre tu experiencia.');
      return;
    }

    setIsSubmittingReview(true);

    try {
      // Guardar localmente la reseña del cliente
      const existingReviews = JSON.parse(localStorage.getItem('recuerdo_customer_reviews') || '[]');
      existingReviews.push({
        orderId,
        rating,
        comment: reviewComment.trim(),
        partnerName: experience?.partner_name,
        date: new Date().toISOString(),
      });
      localStorage.setItem('recuerdo_customer_reviews', JSON.stringify(existingReviews));
    } catch {
      // Silently continue
    }

    // Celebración con confeti al desbloquear
    confetti({
      particleCount: 160,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#f59e0b', '#ec4899', '#a21232', '#10b981', '#ffffff'],
    });

    toast.success('¡Muchas gracias por tu reseña! Tu Código QR ha sido desbloqueado 🎉');
    setReviewSubmitted(true);
    setIsSubmittingReview(false);
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

  // 🌟 VISTA 1: CALIFICACIÓN OBLIGATORIA ANTES DE DESBLOQUEAR EL QR
  if (!reviewSubmitted) {
    const starLabels = [
      '',
      '😞 Muy mejorable (1/5)',
      '😐 Aceptable (2/5)',
      '🙂 Buena experiencia (3/5)',
      '😊 ¡Muy linda página! (4/5)',
      '💖 ¡Excelente, me encantó para mi pareja! (5/5)',
    ];

    const currentRating = hoverRating || rating;

    return (
      <div className="py-10 md:py-16 bg-rose-50/20 min-h-[85vh] flex items-center justify-center px-4">
        <div className="max-w-lg w-full bg-white rounded-3xl border border-rose-100 shadow-2xl p-6 sm:p-8 text-center space-y-6 animate-fade-in relative overflow-hidden">
          {/* Top Banner */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-rose-500 to-[#a21232]" />

          <div className="space-y-2">
            <div className="w-14 h-14 bg-rose-50 border border-rose-100 rounded-full flex items-center justify-center mx-auto text-[#a21232] shadow-sm">
              <Sparkles className="w-7 h-7 animate-pulse text-amber-500" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-0.5 rounded-full inline-block">
              ✓ ¡Pago Exitoso Confirmado!
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
              ¡Tu Recuerdo de Amor está Listo!
            </h1>
            <p className="text-xs text-gray-600 font-light leading-relaxed max-w-sm mx-auto">
              Ayúdanos con tu calificación y una breve opinión para <strong>desbloquear tu Código QR y Tarjeta Digital en HD</strong>.
            </p>
          </div>

          <form onSubmit={handleSubmitReview} className="space-y-5 text-left">
            {/* 5 Estrellas Interactivas */}
            <div className="bg-rose-50/40 border border-rose-100 rounded-2xl p-4 text-center space-y-2">
              <label className="text-xs font-bold text-gray-700 block">
                ¿Qué tal fue tu experiencia creando el recuerdo? *
              </label>
              <div className="flex justify-center items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition transform hover:scale-125 active:scale-95 cursor-pointer focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= currentRating
                          ? 'text-amber-400 fill-amber-400 filter drop-shadow-xs'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-[11px] font-semibold text-rose-900">
                {starLabels[currentRating]}
              </p>
            </div>

            {/* Comentario / Reseña Obligatoria */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700">
                Tu Opinión o Mensaje para la Pareja *
              </label>
              <textarea
                required
                rows={3}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Ej: ¡Quedó hermoso para nuestro aniversario, las fotos y la música se ven increíbles! ❤️"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-2xl text-xs focus:outline-none focus:border-[#a21232] transition bg-white text-gray-800 placeholder-gray-400"
              />
            </div>

            {/* Botón de Enviar y Desbloquear QR */}
            <button
              type="submit"
              disabled={isSubmittingReview}
              className="w-full py-3.5 bg-gradient-to-r from-[#a21232] via-rose-600 to-[#880e28] hover:from-[#880e28] hover:to-[#a21232] text-white font-bold rounded-2xl text-xs shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Unlock className="w-4 h-4 text-amber-300" />
              <span>Enviar Reseña y Ver Mi Código QR ✨</span>
            </button>
          </form>

          <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 pt-1">
            <Lock className="w-3 h-3 text-emerald-500" />
            <span>Tus datos y tarjeta están protegidos bajo cifrado seguro</span>
          </div>
        </div>
      </div>
    );
  }

  const expConfig = (experience.config as any) || {};
  const isHorizontal = expConfig.cardOrientation === 'horizontal';
  const selectedCharacter = expConfig.selectedCharacterId 
    ? CHARACTERS_DATABASE.find(c => c.id === expConfig.selectedCharacterId) 
    : expConfig.selectedCharacter;
  const primaryColor = selectedCharacter ? selectedCharacter.primary : (expConfig.cardPalette || themeDetails.accentColor);
  const accentColor = selectedCharacter ? selectedCharacter.accent : primaryColor;
  const activeFontFamily = getFontFamily(expConfig.cardFont || 'great-vibes');
  const displayTitle = expConfig.cardTitle || `Para ${experience.partner_name || 'Mi Amor'}`;
  const displayFrom = expConfig.cardFrom || experience.user_name || 'Alguien que te ama';
  const quoteText = expConfig.cardMessage || (selectedCharacter ? selectedCharacter.quote : (experience.message || 'Hoy es el día más especial con mi persona favorita ❤️'));

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
            transform: translate(-50%, -50%) scale(1.05) !important;
            width: 100% !important;
            max-width: ${isHorizontal ? '560px' : '380px'} !important;
            box-shadow: none !important;
            border: 2px dashed ${primaryColor} !important;
            background: white !important;
            padding: 24px !important;
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
          <span className="text-[10px] font-bold uppercase tracking-widest bg-rose-50 border border-rose-200 px-3.5 py-1 rounded-full inline-block" style={{ color: primaryColor }}>
            ✨ {selectedCharacter ? `Tarjeta Temática: ${selectedCharacter.name}` : themeDetails.badgeText} ({isHorizontal ? 'Horizontal 15x10' : 'Vertical 10x15'})
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
            ¡Muchas gracias por tu compra! Tu tarjeta está lista ✨
          </h1>
          <p className="text-gray-600 text-xs sm:text-sm font-light max-w-md mx-auto leading-relaxed">
            Hemos preparado tu tarjeta de regalo personalizada con mucho amor para <strong>{experience.partner_name}</strong>. Ya puedes imprimirla en papel, descargarla en tu celular o compartir el enlace directo.
          </p>
        </div>

        <div className={`grid grid-cols-1 ${isHorizontal ? 'lg:grid-cols-12 max-w-4xl' : 'lg:grid-cols-12 max-w-3xl'} gap-8 items-center mx-auto`}>
          
          {/* Left: The Gorgeous Romantic Gift Card */}
          <div className={`${isHorizontal ? 'lg:col-span-8' : 'lg:col-span-7'} flex justify-center`}>
            <div
              id="printable-digital-card"
              ref={cardPrintRef}
              style={{
                fontFamily: activeFontFamily,
                borderColor: primaryColor,
                backgroundImage: selectedCharacter
                  ? `radial-gradient(circle at 10% 20%, ${selectedCharacter.bgStart} 0%, transparent 45%), radial-gradient(circle at 90% 80%, ${selectedCharacter.bgEnd} 0%, transparent 45%)`
                  : undefined
              }}
              className={`bg-white rounded-[32px] border-2 border-dashed p-6 sm:p-7 w-full shadow-xl relative overflow-hidden ${
                isHorizontal 
                  ? 'max-w-[540px] text-left flex gap-5 items-center justify-between' 
                  : 'max-w-[340px] text-center space-y-3.5'
              }`}
            >
              {isHorizontal ? (
                /* HORIZONTAL LAYOUT */
                <>
                  <div className="flex-1 space-y-2 z-10">
                    <div className="flex items-center gap-3">
                      {selectedCharacter ? (
                        <Image
                          src={`/personajes/${selectedCharacter.file}`}
                          alt={selectedCharacter.name}
                          width={56}
                          height={56}
                          className="w-14 h-14 object-contain filter drop-shadow-md shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-sm shrink-0" style={{ backgroundColor: primaryColor }}>
                          <span className="text-xl">🎁</span>
                        </div>
                      )}
                      <div>
                        <h2 className="font-serif text-lg sm:text-xl font-extrabold text-gray-900 leading-tight">
                          {displayTitle}
                        </h2>
                        <p className="text-[11px] text-gray-500 italic font-serif">
                          De parte de: <span className="font-semibold" style={{ color: primaryColor }}>{displayFrom}</span>
                        </p>
                      </div>
                    </div>

                    <div
                      className="rounded-2xl p-2.5 px-3 border backdrop-blur-xs"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.85)',
                        borderColor: accentColor
                      }}
                    >
                      <p className="text-[10px] text-gray-800 font-serif italic leading-relaxed">
                        «{quoteText}»
                      </p>
                    </div>

                    <p className="text-[9px] text-gray-400 font-mono">
                      📅 {formattedDate}
                    </p>
                  </div>

                  <div className="w-36 flex flex-col items-center justify-center p-3 rounded-2xl bg-white border-2 border-dashed shadow-xs shrink-0" style={{ borderColor: primaryColor }}>
                    {qrDataUrl ? (
                      <Image
                        src={qrDataUrl}
                        alt="Código QR"
                        width={112}
                        height={112}
                        unoptimized
                        priority
                        className="w-28 h-28 mx-auto object-contain rounded-lg"
                      />
                    ) : (
                      <div className="w-28 h-28 bg-gray-100 flex items-center justify-center text-[9px] text-gray-400">
                        Cargando QR...
                      </div>
                    )}
                    <span className="text-[8px] font-sans font-bold uppercase tracking-wider text-gray-600 mt-1 block text-center">
                      Escanea con tu celular 📱
                    </span>
                  </div>
                </>
              ) : (
                /* VERTICAL LAYOUT */
                <>
                  {/* Character or Emoji */}
                  {selectedCharacter ? (
                    <div className="relative w-24 h-24 mx-auto flex items-center justify-center my-1">
                      <div
                        className="absolute w-20 h-20 rounded-full filter blur-md opacity-35"
                        style={{ backgroundColor: primaryColor }}
                      />
                      <Image
                        src={`/personajes/${selectedCharacter.file}`}
                        alt={selectedCharacter.name}
                        width={96}
                        height={96}
                        className="relative z-10 max-h-24 max-w-24 object-contain drop-shadow-md"
                      />
                    </div>
                  ) : (
                    <div className="flex justify-center">
                      <span className="text-3xl select-none animate-pulse">{themeDetails.emoji}</span>
                    </div>
                  )}

                  {/* Tagline */}
                  <div 
                    className="text-[8px] font-bold uppercase tracking-[0.25em] select-none"
                    style={{ color: primaryColor }}
                  >
                    — UN REGALO DIGITAL ESPECIAL —
                  </div>

                  {/* Names */}
                  <div className="space-y-0.5">
                    <h2 className="font-serif text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight">
                      {displayTitle}
                    </h2>
                    <p className="text-[10px] text-gray-500 italic font-serif">
                      De parte de: <span className="font-semibold" style={{ color: primaryColor }}>{displayFrom}</span>
                    </p>
                  </div>

                  {/* Dedication Snippet */}
                  <div className="bg-rose-50/40 border border-rose-100/80 rounded-2xl p-2.5 px-3">
                    <p className="text-[9px] text-gray-700 font-serif italic leading-relaxed">
                      «{quoteText}»
                    </p>
                  </div>

                  {/* Embedded QR Code */}
                  <div className="flex justify-center my-1">
                    <div className="p-2.5 bg-white rounded-2xl border border-gray-200 shadow-sm inline-block">
                      {qrDataUrl ? (
                        <Image
                          src={qrDataUrl}
                          alt="Código QR de Amor"
                          width={140}
                          height={140}
                          unoptimized
                          priority
                          className="w-32 h-32 sm:w-36 sm:h-36 mx-auto object-contain rounded-lg"
                        />
                      ) : (
                        <div className="w-32 h-32 bg-gray-100 flex items-center justify-center text-[9px] text-gray-400">
                          Cargando QR...
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Scan Instruction & Date */}
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold flex items-center justify-center gap-1" style={{ color: primaryColor }}>
                      <span>📱</span>
                      <span>Escanea con tu celular para abrir tu sorpresa</span>
                    </p>
                    <p className="text-[8px] text-gray-400 font-mono">
                      {formattedDate}
                    </p>
                  </div>
                </>
              )}
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
                  className="w-full py-3 bg-[#a21232] hover:bg-[#880e28] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>🖨️ Imprimir Tarjeta Postal en PDF</span>
                </button>

                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`❤️ ¡Hola ${experience.partner_name || 'mi amor'}! Te preparé una sorpresa muy especial hecha con todo mi corazón: ${experienceLink}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>📱 Enviar a {experience.partner_name || 'mi Pareja'} por WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={handleDownloadQr}
                  className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-[#a21232] font-bold rounded-xl text-xs flex items-center justify-center gap-2 border border-rose-200 transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar solo el QR (PNG HD)</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-800 font-bold rounded-xl text-xs flex items-center justify-center gap-2 border border-gray-200 transition active:scale-98 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                      <span className="text-emerald-700">¡Copiado con Éxito!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-gray-500" />
                      <span>Copiar Enlace Directo</span>
                    </>
                  )}
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
