'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import QRCode from 'qrcode';
import { getExperienceBySlug, Experience } from '@/lib/db';
import { CHARACTERS_DATABASE, CharacterTheme } from '@/data/charactersData';
import { getFontFamily } from '@/lib/fonts';
import { Printer, ArrowLeft, Scissors, Sparkles } from 'lucide-react';

export default function ImprimirTarjetaPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    if (!slug) return;
    let isMounted = true;

    async function loadData() {
      try {
        const exp = await getExperienceBySlug(slug);
        if (isMounted) {
          setExperience(exp);
          if (exp) {
            const domain = process.env.NEXT_PUBLIC_APP_URL || 'https://recuerdo-qr.vercel.app';
            const liveUrl = `${domain}/${exp.theme || 'amor'}/${exp.slug}`;
            const expConfig = (exp.config as any) || {};

            // Resuelve el personaje tanto por objeto completo como por ID
            const foundChar: CharacterTheme | null = 
              expConfig.selectedCharacter 
              || (expConfig.selectedCharacterId ? CHARACTERS_DATABASE.find(c => c.id === expConfig.selectedCharacterId) : null)
              || (expConfig.selectedCharacter?.id ? CHARACTERS_DATABASE.find(c => c.id === expConfig.selectedCharacter.id) : null)
              || null;

            const primaryColor = foundChar ? foundChar.primary : (expConfig.cardPalette || '#a21232');
            
            const qr = await QRCode.toDataURL(liveUrl, {
              width: 800,
              margin: 1,
              color: {
                dark: primaryColor,
                light: '#ffffff'
              }
            });
            setQrDataUrl(qr);
          }
        }
      } catch (err) {
        console.error('Error loading experience for card:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => { isMounted = false; };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-rose-50/50 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin mb-4" />
        <p className="text-gray-600 font-medium text-sm">Preparando tu tarjeta de regalo para imprimir...</p>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="min-h-screen bg-rose-50/50 flex flex-col items-center justify-center p-4 text-center">
        <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center text-rose-500 mb-4 text-2xl">
          💔
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">No encontramos esta experiencia</h1>
        <p className="text-gray-600 text-sm max-w-md mb-6">
          El enlace que abriste no existe o el identificador es incorrecto.
        </p>
        <Link
          href="/"
          className="px-5 py-2.5 bg-[#a21232] text-white rounded-xl font-bold text-sm hover:bg-[#880e28] transition"
        >
          Ir al Inicio
        </Link>
      </div>
    );
  }

  const expConfig = (experience.config as any) || {};
  
  // Resuelve el personaje de forma infalible
  const foundChar: CharacterTheme | null = 
    expConfig.selectedCharacter 
    || (expConfig.selectedCharacterId ? CHARACTERS_DATABASE.find(c => c.id === expConfig.selectedCharacterId) : null)
    || (expConfig.selectedCharacter?.id ? CHARACTERS_DATABASE.find(c => c.id === expConfig.selectedCharacter.id) : null)
    || null;

  const cardPalette = expConfig.cardPalette || '#a21232';
  const cardOrientation: 'vertical' | 'horizontal' = expConfig.cardOrientation || 'vertical';
  const cardFont = expConfig.cardFont || 'great-vibes';
  const displayTitle = expConfig.cardTitle || `Para ${experience.partner_name || 'Mi Amor'}`;
  const displayFrom = expConfig.cardFrom || experience.user_name || 'Alguien que te ama';
  const quoteText = expConfig.cardMessage || (foundChar ? foundChar.quote : (experience.message || 'Hoy es el día más especial con mi persona favorita ❤️'));
  const formattedDate = experience.special_date || new Date().toISOString().split('T')[0];

  const primaryColor = foundChar ? foundChar.primary : cardPalette;
  const accentColor = foundChar ? foundChar.accent : primaryColor;
  const activeFontFamily = getFontFamily(cardFont);
  const isHorizontal = cardOrientation === 'horizontal';

  const domain = process.env.NEXT_PUBLIC_APP_URL || 'https://recuerdo-qr.vercel.app';
  const liveUrl = `${domain}/${experience.theme || 'amor'}/${experience.slug}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Print Stylesheet */}
      <style>{`
        @media print {
          @page {
            size: portrait;
            margin: 8mm;
          }
          body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
          .print-container {
            padding: 0 !important;
            margin: 0 auto !important;
            width: 100% !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
          }
          .cutting-box {
            box-shadow: none !important;
            background: white !important;
            border-color: #9ca3af !important;
          }
        }
      `}</style>

      {/* Screen Header & Controls */}
      <header className="no-print bg-white border-b border-gray-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <Link
              href={liveUrl}
              className="text-xs font-semibold text-gray-600 hover:text-gray-900 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Ver Experiencia Online</span>
            </Link>
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-full border"
              style={{
                backgroundColor: `${primaryColor}15`,
                borderColor: `${primaryColor}40`,
                color: primaryColor
              }}
            >
              {foundChar ? `Tarjeta Temática: ${foundChar.name}` : 'RecuerdoQR Chile 🎁'}
            </span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={handlePrint}
              type="button"
              style={{ backgroundColor: primaryColor }}
              className="flex-1 sm:flex-initial px-5 py-2.5 hover:opacity-90 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Guardar como PDF / Imprimir</span>
            </button>
          </div>
        </div>
      </header>

      {/* Screen Instructional Banner */}
      <section className="no-print max-w-3xl mx-auto px-4 pt-6 pb-2">
        <div className="bg-gradient-to-r from-rose-50 via-white to-rose-50 border border-rose-200 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-rose-100 rounded-xl text-[#a21232] shrink-0">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm sm:text-base text-gray-900 flex items-center gap-2">
                <span>¡Tu Tarjeta de Regalo lista para Imprimir y Cortar!</span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </h2>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                1. Presiona el botón <strong>&quot;Guardar como PDF / Imprimir&quot;</strong>.<br />
                2. En la ventana de impresión, selecciona <strong>&quot;Guardar como PDF&quot;</strong> o tu impresora en hoja tamaño Carta o A4.<br />
                3. Una vez impresa, recorta la tarjeta con tijeras siguiendo la <strong>línea punteada con tijeritas</strong> ✂️.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Printable Area */}
      <main className="max-w-4xl mx-auto p-4 sm:p-8 flex flex-col items-center justify-center print-container">
        
        {/* CUTTING BOUNDARY WRAPPER */}
        <div className="cutting-box relative my-2 sm:my-6 p-4 sm:p-6 bg-white rounded-3xl border-2 border-dashed border-gray-400 shadow-md">
          
          {/* Top Scissors Line Indicator */}
          <div className="flex items-center justify-center gap-2 text-gray-400 font-mono text-[10px] sm:text-xs mb-3 select-none">
            <span>- - - - - - - - -</span>
            <span className="flex items-center gap-1 text-gray-600 font-bold">
              <Scissors className="w-3.5 h-3.5" />
              <span>LÍNEA DE CORTE PARA TIJERAS</span>
              <Scissors className="w-3.5 h-3.5 scale-x-[-1]" />
            </span>
            <span>- - - - - - - - -</span>
          </div>

          {/* THE GIFT CARD ITSELF */}
          <div
            id="printable-card"
            style={{
              fontFamily: activeFontFamily,
              borderColor: primaryColor,
              backgroundImage: foundChar
                ? `radial-gradient(circle at 10% 20%, ${foundChar.bgStart} 0%, transparent 50%), radial-gradient(circle at 90% 80%, ${foundChar.bgEnd} 0%, transparent 50%)`
                : undefined
            }}
            className={`bg-white rounded-[28px] border-2 border-dashed p-6 sm:p-8 relative overflow-hidden shadow-xs ${
              isHorizontal
                ? 'w-full max-w-[560px] min-h-[340px] text-left flex gap-6 items-center justify-between'
                : 'w-full max-w-[370px] text-center space-y-4'
            }`}
          >
            {isHorizontal ? (
              /* HORIZONTAL CARD LAYOUT */
              <>
                <div className="flex-1 space-y-2.5 z-10">
                  <div className="flex items-center gap-3">
                    {foundChar ? (
                      <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                        <div
                          className="absolute inset-0 rounded-full filter blur-sm opacity-35"
                          style={{ backgroundColor: primaryColor }}
                        />
                        <Image
                          src={`/personajes/${foundChar.file}`}
                          alt={foundChar.name}
                          width={64}
                          height={64}
                          className="relative z-10 w-16 h-16 object-contain filter drop-shadow-md shrink-0"
                        />
                      </div>
                    ) : (
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-sm shrink-0"
                        style={{ backgroundColor: primaryColor }}
                      >
                        <span className="text-2xl">🎁</span>
                      </div>
                    )}
                    <div>
                      <h2 className="font-serif text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight">
                        {displayTitle}
                      </h2>
                      <p className="text-xs text-gray-500 italic font-serif">
                        De parte de: <span className="font-semibold" style={{ color: primaryColor }}>{displayFrom}</span>
                      </p>
                    </div>
                  </div>

                  <div
                    className="rounded-2xl p-3 border backdrop-blur-xs"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.92)',
                      borderColor: accentColor
                    }}
                  >
                    <p className="text-[11px] text-gray-800 font-serif italic leading-relaxed">
                      «{quoteText}»
                    </p>
                  </div>

                  <p className="text-[10px] text-gray-400 font-mono">
                    📅 {formattedDate}
                  </p>
                </div>

                <div
                  className="w-40 flex flex-col items-center justify-center p-3 rounded-2xl bg-white border-2 border-dashed shadow-xs shrink-0"
                  style={{ borderColor: primaryColor }}
                >
                  {qrDataUrl ? (
                    <Image
                      src={qrDataUrl}
                      alt="Código QR"
                      width={128}
                      height={128}
                      unoptimized
                      priority
                      className="w-32 h-32 mx-auto object-contain rounded-lg"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-gray-100 flex items-center justify-center text-[10px] text-gray-400">
                      Cargando QR...
                    </div>
                  )}
                  <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-gray-700 mt-1.5 block text-center">
                    Escanea con tu celular 📱
                  </span>
                </div>
              </>
            ) : (
              /* VERTICAL CARD LAYOUT */
              <>
                {/* Character or Heart Icon */}
                {foundChar ? (
                  <div className="relative w-28 h-28 mx-auto flex items-center justify-center my-1">
                    <div
                      className="absolute w-24 h-24 rounded-full filter blur-md opacity-35"
                      style={{ backgroundColor: primaryColor }}
                    />
                    <Image
                      src={`/personajes/${foundChar.file}`}
                      alt={foundChar.name}
                      width={112}
                      height={112}
                      className="relative z-10 max-h-28 max-w-28 object-contain drop-shadow-md"
                    />
                  </div>
                ) : (
                  <div className="flex justify-center my-1">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-sm"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <span className="text-2xl">🎁</span>
                    </div>
                  </div>
                )}

                {/* Subtitle tag */}
                <div
                  className="text-[9px] font-bold uppercase tracking-[0.25em] select-none"
                  style={{ color: primaryColor }}
                >
                  {foundChar ? `— TARJETA TEMÁTICA: ${foundChar.name.toUpperCase()} —` : '— UN REGALO DIGITAL ESPECIAL —'}
                </div>

                {/* Titles */}
                <div className="space-y-0.5">
                  <h2 className="font-serif text-2xl font-extrabold text-gray-900 leading-tight">
                    {displayTitle}
                  </h2>
                  <p className="text-xs text-gray-500 italic font-serif">
                    De parte de: <span className="font-semibold" style={{ color: primaryColor }}>{displayFrom}</span>
                  </p>
                </div>

                {/* Dedication Quote */}
                <div
                  className="rounded-2xl p-3 border backdrop-blur-xs mx-auto max-w-[320px]"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.92)',
                    borderColor: accentColor
                  }}
                >
                  <p className="text-[11px] text-gray-800 font-serif italic leading-relaxed">
                    «{quoteText}»
                  </p>
                </div>

                {/* High Resolution QR Code */}
                <div className="flex justify-center my-2">
                  <div className="p-3 bg-white rounded-2xl border-2 border-gray-100 shadow-sm inline-block">
                    {qrDataUrl ? (
                      <Image
                        src={qrDataUrl}
                        alt="Código QR"
                        width={160}
                        height={160}
                        unoptimized
                        priority
                        className="w-36 h-36 mx-auto object-contain rounded-lg"
                      />
                    ) : (
                      <div className="w-36 h-36 bg-gray-100 flex items-center justify-center text-[10px] text-gray-400">
                        Cargando QR...
                      </div>
                    )}
                  </div>
                </div>

                {/* Instructions & Date */}
                <div className="space-y-1">
                  <p className="text-[10px] font-bold flex items-center justify-center gap-1.5" style={{ color: primaryColor }}>
                    <span>📱</span>
                    <span>Escanea con la cámara de tu celular para abrir tu sorpresa</span>
                  </p>
                  <p className="text-[9px] text-gray-400 font-mono">
                    {formattedDate}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Bottom Scissors Line Indicator */}
          <div className="flex items-center justify-center gap-2 text-gray-400 font-mono text-[10px] sm:text-xs mt-3 select-none">
            <span>- - - - - - - - -</span>
            <span className="flex items-center gap-1 text-gray-600 font-bold">
              <Scissors className="w-3.5 h-3.5" />
              <span>LÍNEA DE CORTE PARA TIJERAS</span>
              <Scissors className="w-3.5 h-3.5 scale-x-[-1]" />
            </span>
            <span>- - - - - - - - -</span>
          </div>

        </div>

        {/* Online link reminder */}
        <p className="no-print text-center text-xs text-gray-500 mt-4">
          Enlace permanente de esta experiencia: <Link href={liveUrl} className="text-[#a21232] font-semibold underline" target="_blank">{liveUrl}</Link>
        </p>

      </main>
    </div>
  );
}
