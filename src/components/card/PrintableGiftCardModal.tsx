'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { getFontFamily } from '@/lib/fonts';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Printer, Download } from 'lucide-react';
import { CharacterTheme } from '@/data/charactersData';

interface PrintableGiftCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  partnerName: string;
  userName: string;
  message?: string;
  qrDataUrl: string;
  date?: string;
  slug?: string;
  theme?: string;
  selectedCharacter?: CharacterTheme | null;
  cardPalette?: string;
  cardOrientation?: 'vertical' | 'horizontal';
  cardFont?: string;
  cardTitle?: string;
  cardFrom?: string;
}

export default function PrintableGiftCardModal({
  isOpen,
  onClose,
  partnerName,
  userName,
  message,
  qrDataUrl,
  date,
  slug,
  theme,
  selectedCharacter,
  cardPalette = '#a21232',
  cardOrientation = 'vertical',
  cardFont = 'great-vibes',
  cardTitle,
  cardFrom
}: PrintableGiftCardModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const formattedDate = date || new Date().toISOString().split('T')[0];

  const primaryColor = selectedCharacter ? selectedCharacter.primary : cardPalette;
  const accentColor = selectedCharacter ? selectedCharacter.accent : primaryColor;
  const activeFontFamily = getFontFamily(cardFont);
  const quoteText = message || (selectedCharacter ? selectedCharacter.quote : 'Hoy es el día más especial con mi persona favorita ❤️');
  const isHorizontal = cardOrientation === 'horizontal';
  const displayTitle = cardTitle || `Para ${partnerName || 'Mi Amor'}`;
  const displayFrom = cardFrom || userName || 'Alguien que te ama';

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white">
        
        {/* Print Styles */}
        <style>{`
          @media print {
            body * {
              visibility: hidden;
            }
            #printable-gift-card, #printable-gift-card * {
              visibility: visible;
            }
            #printable-gift-card {
              position: fixed;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
              width: 100%;
              max-width: 420px;
              border: 2.5px dashed ${primaryColor} !important;
              box-shadow: none !important;
              margin: 0 !important;
              padding: 24px !important;
            }
            .no-print {
              display: none !important;
            }
          }
        `}</style>

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className={`bg-white rounded-3xl shadow-2xl border border-gray-100 w-full overflow-hidden no-print ${
            isHorizontal ? 'max-w-2xl' : 'max-w-md'
          }`}
        >
          {/* Modal Header */}
          <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-xs sm:text-sm text-gray-900 flex items-center gap-2">
              <span>🎁</span>
              <span>Tarjeta {selectedCharacter ? `Temática: ${selectedCharacter.name}` : 'Clásica'} ({isHorizontal ? 'Horizontal 15x10' : 'Vertical 10x15'})</span>
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Body: The Printable Card Preview */}
          <div className="p-4 sm:p-6 bg-gray-50/50 flex justify-center">
            
            {/* THE GIFT CARD CONTAINER */}
            <div
              id="printable-gift-card"
              ref={cardRef}
              style={{
                fontFamily: activeFontFamily,
                borderColor: primaryColor,
                backgroundImage: selectedCharacter
                  ? `radial-gradient(circle at 10% 20%, ${selectedCharacter.bgStart} 0%, transparent 45%), radial-gradient(circle at 90% 80%, ${selectedCharacter.bgEnd} 0%, transparent 45%)`
                  : undefined
              }}
              className={`bg-white rounded-[32px] border-2 border-dashed p-6 sm:p-7 w-full shadow-sm relative overflow-hidden ${
                isHorizontal 
                  ? 'max-w-[540px] text-left flex gap-6 items-center justify-between' 
                  : 'max-w-[350px] text-center space-y-3.5'
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
                  {/* Character Transparent Image or Emoji */}
                  {selectedCharacter ? (
                    <div className="relative w-28 h-28 mx-auto flex items-center justify-center my-1">
                      <div
                        className="absolute w-24 h-24 rounded-full filter blur-md opacity-35"
                        style={{ backgroundColor: primaryColor }}
                      />
                      <Image
                        src={`/personajes/${selectedCharacter.file}`}
                        alt={selectedCharacter.name}
                        width={112}
                        height={112}
                        className="relative z-10 max-h-28 max-w-28 object-contain drop-shadow-md"
                      />
                    </div>
                  ) : (
                    <div className="flex justify-center">
                      <span className="text-3xl select-none">🎁</span>
                    </div>
                  )}

                  {/* Tagline */}
                  <div 
                    className="text-[9px] font-bold uppercase tracking-[0.25em] select-none"
                    style={{ color: primaryColor }}
                  >
                    — UN REGALO DIGITAL ESPECIAL —
                  </div>

                  {/* Names */}
                  <div className="space-y-0.5">
                    <h2 className="font-serif text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight">
                      {displayTitle}
                    </h2>
                    <p className="text-[11px] text-gray-500 italic font-serif">
                      De parte de: <span className="font-semibold" style={{ color: primaryColor }}>{displayFrom}</span>
                    </p>
                  </div>

                  {/* Message Box */}
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

                  {/* QR Code Container */}
                  <div className="flex justify-center my-2">
                    <div className="p-2.5 bg-white rounded-2xl border border-gray-100 shadow-sm inline-block">
                      {qrDataUrl ? (
                        <Image
                          src={qrDataUrl}
                          alt="Código QR"
                          width={144}
                          height={144}
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

                  {/* Scan Instruction */}
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold flex items-center justify-center gap-1" style={{ color: primaryColor }}>
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

          </div>

          {/* Modal Footer Controls */}
          <div className="p-4 bg-white border-t border-gray-100 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition cursor-pointer"
            >
              Cerrar
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="px-5 py-2.5 bg-[#a21232] hover:bg-[#880e28] text-white font-bold rounded-xl text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                Imprimir Tarjeta
              </button>
            </div>
          </div>

        </motion.div>

      </div>
    </AnimatePresence>
  );
}
