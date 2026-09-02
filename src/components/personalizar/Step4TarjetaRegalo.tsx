'use client';

import React, { useState } from 'react';
import { CharacterTheme } from '@/data/charactersData';
import CharacterThemeSelector from './CharacterThemeSelector';
import { Printer, Sparkles, Edit3, Heart, Eye, Type, Palette, QrCode as QrIcon } from 'lucide-react';
import PrintableGiftCardModal from '@/components/card/PrintableGiftCardModal';
import { getFontFamily } from '@/lib/fonts';

interface Step4TarjetaRegaloProps {
  selectedPlan: string;
  selectedCharacter: CharacterTheme | null;
  setSelectedCharacter: (char: CharacterTheme | null) => void;
  cardPalette: string;
  setCardPalette: (color: string) => void;
  cardOrientation?: 'vertical' | 'horizontal';
  setCardOrientation?: (val: 'vertical' | 'horizontal') => void;
  cardFont: string;
  setCardFont: (font: string) => void;
  partnerName: string;
  userName: string;
  cardTitle: string;
  setCardTitle: (val: string) => void;
  cardFrom: string;
  setCardFrom: (val: string) => void;
  cardMessage: string;
  setCardMessage: (val: string) => void;
  specialDate: string;
}

export default function Step4TarjetaRegalo({
  selectedPlan,
  selectedCharacter,
  setSelectedCharacter,
  cardPalette,
  setCardPalette,
  cardOrientation = 'vertical',
  setCardOrientation,
  cardFont,
  setCardFont,
  partnerName,
  userName,
  cardTitle,
  setCardTitle,
  cardFrom,
  setCardFrom,
  cardMessage,
  setCardMessage,
  specialDate,
}: Step4TarjetaRegaloProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isThemedCardPlan = selectedPlan === 'medium' || selectedPlan === 'premium';

  const basicPalettes = [
    { name: 'Rosa Romántico', color: '#e11d48' },
    { name: 'Azul Real', color: '#0284c7' },
    { name: 'Dorado / Miel', color: '#d97706' },
    { name: 'Verde Esmeralda', color: '#059669' },
    { name: 'Púrpura Mágico', color: '#7c3aed' },
    { name: 'Negro Medianoche', color: '#0f172a' }
  ];

  const fontOptions = [
    { id: 'great-vibes', name: 'Cursiva Romántica', preview: 'Para Ti Con Amor', style: 'font-great-vibes' },
    { id: 'dancing-script', name: 'Manuscrita Dulce', preview: 'Nuestro Amor Incondicional', style: 'font-dancing' },
    { id: 'playfair', name: 'Elegante Clásica', preview: 'Recuerdo Inolvidable', style: 'font-serif' },
    { id: 'sans', name: 'Moderna Limpia', preview: 'Siempre Juntos', style: 'font-sans' },
    { id: 'cinzel', name: 'Serif Imperial', preview: 'Nuestra Gran Historia', style: 'font-cinzel' }
  ];

  const primaryColor = isThemedCardPlan && selectedCharacter ? selectedCharacter.primary : cardPalette;
  const accentColor = isThemedCardPlan && selectedCharacter ? selectedCharacter.accent : primaryColor;
  const displayTitle = cardTitle || `Para ${partnerName || 'Mi Amor'}`;
  const displayFrom = cardFrom || (userName || 'Alguien que te ama');
  const displayMessage = cardMessage || (selectedCharacter ? selectedCharacter.quote : 'Hoy es el día más especial con mi persona favorita ❤️');
  const activeFont = getFontFamily(cardFont);
  const isHorizontal = cardOrientation === 'horizontal';

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* Header */}
      <div className="border-b border-rose-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span>🎁</span>
            <span>5. Personaliza tu Tarjeta Digital de Regalo con Código QR</span>
          </h2>
          <p className="text-xs text-gray-500 font-light mt-1">
            Elige orientación (Horizontal o Vertical), personajes temáticos, colores y dedicatoria para tu tarjeta digital imprimible o para compartir.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-[#a21232] hover:bg-[#880e28] text-white font-bold rounded-2xl text-xs shadow-sm transition flex items-center gap-1.5 shrink-0 cursor-pointer self-start sm:self-auto"
        >
          <Printer className="w-4 h-4" />
          <span>Imprimir / Ver en Grande</span>
        </button>
      </div>

      {/* Main Grid: Left Controls & Right Live Card Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">

          {/* 1. Orientation Selector (Horizontal vs Vertical) */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 font-serif flex items-center gap-1.5">
              <span>🔄</span>
              <span>1. Orientación de la Tarjeta</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setCardOrientation && setCardOrientation('vertical')}
                className={`p-3.5 rounded-2xl border text-left transition flex items-center gap-3 cursor-pointer ${
                  !isHorizontal
                    ? 'border-[#a21232] bg-rose-50/50 ring-2 ring-[#a21232]/20 shadow-xs'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="w-8 h-12 rounded-lg border-2 border-dashed border-[#a21232] flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold text-[#a21232]">10x15</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Vertical (Retrato)</h4>
                  <p className="text-[9px] text-gray-500 font-light">Ideal para sobre estándar</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setCardOrientation && setCardOrientation('horizontal')}
                className={`p-3.5 rounded-2xl border text-left transition flex items-center gap-3 cursor-pointer ${
                  isHorizontal
                    ? 'border-[#a21232] bg-rose-50/50 ring-2 ring-[#a21232]/20 shadow-xs'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="w-12 h-8 rounded-lg border-2 border-dashed border-[#a21232] flex items-center justify-center shrink-0">
                  <span className="text-[9px] font-bold text-[#a21232]">15x10</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Horizontal (Postal)</h4>
                  <p className="text-[9px] text-gray-500 font-light">Ideal para caja / postal</p>
                </div>
              </button>
            </div>
          </div>
          
          {/* 2. Character Selector (Medium / Premium) */}
          {isThemedCardPlan ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
              <CharacterThemeSelector
                selectedCharacterId={selectedCharacter?.id}
                onSelectCharacter={setSelectedCharacter}
              />
            </div>
          ) : (
            /* Classic Color Selector for Basic Plan */
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 font-serif flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-[#a21232]" />
                  <span>Color de la Tarjeta Clásica</span>
                </label>
                <span className="text-[9px] text-gray-400 font-light">Incluido en Plan Básico</span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {basicPalettes.map((p) => {
                  const isSelected = cardPalette === p.color;
                  return (
                    <button
                      key={p.color}
                      type="button"
                      onClick={() => setCardPalette(p.color)}
                      className={`p-2 rounded-xl border text-center transition flex flex-col items-center gap-1 cursor-pointer ${
                        isSelected
                          ? 'border-[#a21232] bg-rose-50/50 shadow-xs ring-2 ring-rose-200'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <span className="w-6 h-6 rounded-full border border-black/10 shadow-inner" style={{ backgroundColor: p.color }} />
                      <span className="text-[9px] font-bold text-gray-700 truncate w-full">{p.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. Typography Selector */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 font-serif flex items-center gap-1.5">
              <Type className="w-4 h-4 text-[#a21232]" />
              <span>Tipografía de la Tarjeta</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {fontOptions.map((font) => {
                const isSelected = cardFont === font.id;
                return (
                  <button
                    key={font.id}
                    type="button"
                    onClick={() => setCardFont(font.id)}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                      isSelected
                        ? 'border-[#a21232] bg-rose-50/40 text-[#a21232] font-bold shadow-xs'
                        : 'border-gray-200 bg-white hover:border-rose-200 text-gray-700'
                    }`}
                  >
                    <span className="text-xs block truncate" style={{ fontFamily: getFontFamily(font.id) }}>
                      {font.name}
                    </span>
                    <span className="text-[8px] text-gray-400 font-light block mt-0.5">Ejemplo de letra</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Text Customizer */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 font-serif flex items-center gap-1.5">
              <Edit3 className="w-4 h-4 text-[#a21232]" />
              <span>Textos Personalizados a Imprimir</span>
            </label>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                  Título de Encabezado
                </label>
                <input
                  type="text"
                  value={cardTitle}
                  onChange={(e) => setCardTitle(e.target.value)}
                  placeholder={`Para ${partnerName || 'Mi Amor'}`}
                  className="w-full px-3 py-2 border border-gray-250 rounded-xl text-xs focus:outline-none focus:border-[#a21232]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                  De parte de (Remitente)
                </label>
                <input
                  type="text"
                  value={cardFrom}
                  onChange={(e) => setCardFrom(e.target.value)}
                  placeholder={userName || 'Tu Persona Favorita'}
                  className="w-full px-3 py-2 border border-gray-250 rounded-xl text-xs focus:outline-none focus:border-[#a21232]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                  Frase o Dedicatoria en la Tarjeta
                </label>
                <textarea
                  rows={2}
                  value={cardMessage}
                  onChange={(e) => setCardMessage(e.target.value)}
                  placeholder={selectedCharacter ? selectedCharacter.quote : 'Un mensaje especial...'}
                  className="w-full px-3 py-2 border border-gray-250 rounded-xl text-xs focus:outline-none focus:border-[#a21232] leading-relaxed"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right Live Card Preview (5 cols) */}
        <div className="lg:col-span-5 sticky top-6 space-y-4 text-center">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Vista Previa de Impresión ({isHorizontal ? 'Horizontal 15x10' : 'Vertical 10x15'})
            </span>
            <span className="text-[9px] font-mono text-[#a21232] font-bold bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
              Listo para Imprenta
            </span>
          </div>

          {/* 3D Realistic Card Container */}
          <div className="relative mx-auto w-full max-w-[360px] p-2 bg-gradient-to-b from-gray-100 to-gray-200 rounded-[32px] shadow-2xl border border-gray-300">
            
            {/* HORIZONTAL LAYOUT */}
            {isHorizontal ? (
              <div
                className="w-full aspect-[15/10] rounded-[24px] p-4 text-left flex gap-4 items-center justify-between relative shadow-lg overflow-hidden transition-all duration-300"
                style={{
                  backgroundColor: '#ffffff',
                  border: `3px solid ${primaryColor}`,
                  fontFamily: activeFont
                }}
              >
                {/* Left Side: Character & Titles */}
                <div className="flex-1 space-y-1.5 z-10">
                  <div className="flex items-center gap-2">
                    {isThemedCardPlan && selectedCharacter ? (
                      <img
                        src={`/personajes/${selectedCharacter.file}`}
                        alt={selectedCharacter.name}
                        className="w-12 h-12 object-contain filter drop-shadow-md shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm shrink-0" style={{ backgroundColor: primaryColor }}>
                        <Heart className="w-5 h-5 fill-white" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-sm font-bold leading-tight" style={{ color: primaryColor }}>
                        {displayTitle}
                      </h3>
                      <p className="text-[8px] text-gray-500 font-sans font-light">
                        De: <strong className="text-gray-800 font-bold">{displayFrom}</strong>
                      </p>
                    </div>
                  </div>

                  <p className="text-[9px] italic text-gray-700 font-serif leading-relaxed line-clamp-3 bg-gray-50/80 p-2 rounded-xl border border-gray-100">
                    &quot;{displayMessage}&quot;
                  </p>

                  <span className="text-[8px] font-mono text-gray-400 font-light block">
                    📅 {specialDate}
                  </span>
                </div>

                {/* Right Side: QR Code Frame */}
                <div className="w-28 flex flex-col items-center justify-center p-2 rounded-2xl bg-white border-2 border-dashed shadow-xs shrink-0" style={{ borderColor: primaryColor }}>
                  <div className="w-20 h-20 bg-gray-900 rounded-xl flex items-center justify-center text-white p-1">
                    <QrIcon className="w-16 h-16 stroke-[1.5]" />
                  </div>
                  <span className="text-[7px] font-sans font-bold uppercase tracking-wider text-gray-600 mt-1 block text-center">
                    Escanea con tu cámara 📱
                  </span>
                </div>
              </div>
            ) : (
              /* VERTICAL LAYOUT */
              <div
                className="w-full aspect-[10/14] rounded-[24px] p-5 text-center flex flex-col justify-between items-center relative shadow-lg overflow-hidden transition-all duration-300"
                style={{
                  backgroundColor: '#ffffff',
                  border: `3px solid ${primaryColor}`,
                  fontFamily: activeFont
                }}
              >
                {/* Top Character */}
                <div className="space-y-1 z-10 w-full">
                  {isThemedCardPlan && selectedCharacter ? (
                    <img
                      src={`/personajes/${selectedCharacter.file}`}
                      alt={selectedCharacter.name}
                      className="w-16 h-16 mx-auto object-contain filter drop-shadow-md"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center text-white shadow-md" style={{ backgroundColor: primaryColor }}>
                      <Heart className="w-6 h-6 fill-white" />
                    </div>
                  )}

                  <h3 className="text-base font-bold leading-tight mt-1" style={{ color: primaryColor }}>
                    {displayTitle}
                  </h3>

                  <p className="text-[9px] text-gray-500 font-sans font-light">
                    De parte de: <strong className="text-gray-800 font-bold">{displayFrom}</strong>
                  </p>
                </div>

                {/* Center Dedication Quote */}
                <div className="bg-gray-50/80 p-2.5 rounded-2xl border border-gray-100 my-2 w-full z-10">
                  <p className="text-[10px] italic text-gray-700 font-serif leading-relaxed line-clamp-3">
                    &quot;{displayMessage}&quot;
                  </p>
                </div>

                {/* Bottom QR Code */}
                <div className="w-full flex flex-col items-center space-y-1 z-10">
                  <div className="p-2 rounded-2xl bg-white border-2 border-dashed shadow-sm" style={{ borderColor: primaryColor }}>
                    <div className="w-24 h-24 bg-gray-900 rounded-xl flex items-center justify-center text-white p-1">
                      <QrIcon className="w-20 h-20 stroke-[1.5]" />
                    </div>
                  </div>
                  <span className="text-[8px] font-sans font-bold uppercase tracking-wider text-gray-600 block">
                    Escanea con la cámara de tu celular 📱
                  </span>
                  <span className="text-[7px] font-mono text-gray-400 font-light block">
                    Fecha especial: {specialDate}
                  </span>
                </div>
              </div>
            )}

          </div>

          <p className="text-[10px] text-gray-400 font-light">
            ✨ Incluye marcas de corte profesionales y código QR único de alta resolución al momento del despacho.
          </p>
        </div>

      </div>

      {/* Full Size Printable Modal */}
      {isModalOpen && (
        <PrintableGiftCardModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          partnerName={partnerName}
          userName={userName}
          message={displayMessage}
          qrDataUrl="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://recuerdoqr.cl"
          date={specialDate}
          slug="ejemplo-amor"
          theme={selectedCharacter ? selectedCharacter.name : undefined}
          selectedCharacter={selectedCharacter}
          cardOrientation={cardOrientation}
          cardPalette={cardPalette}
          cardFont={cardFont}
        />
      )}
    </div>
  );
}
