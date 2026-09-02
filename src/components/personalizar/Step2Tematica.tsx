'use client';

import React from 'react';
import { Theme } from '@/lib/db';
import { Sparkles, Check, Heart, Cake, Gift, Baby, Mail, Gem, Smile } from 'lucide-react';

interface Step2TematicaProps {
  themes: Theme[];
  selectedTheme: string;
  setSelectedTheme: (id: string) => void;
  selectedPlan: string;
}

export default function Step2Tematica({
  themes,
  selectedTheme,
  setSelectedTheme,
  selectedPlan,
}: Step2TematicaProps) {
  
  const themeHighlights: Record<string, { emoji: string; featureBadge: string; featureDesc: string }> = {
    birthday: { emoji: '🎂', featureBadge: 'Torta & Velas para Soplar', featureDesc: 'Torta interactiva con velas encendidas para pedir un deseo, soplar con animación y estallido de confeti.' },
    anniversary: { emoji: '❤️', featureBadge: 'Contador de Amor & Corazones', featureDesc: 'Contador de tiempo en vivo (años, días y segundos) con lluvia de corazones palpitantes.' },
    'dating-proposal': { emoji: '💌', featureBadge: 'Propuesta con Botones Interactivos', featureDesc: 'Pregunta "¿Quieres ser mi novia/o?" con botón gigante "¡Sí, Acepto!" y confeti.' },
    'marriage-proposal': { emoji: '💍', featureBadge: 'Propuesta de Matrimonio Solemne', featureDesc: 'Pregunta de boda "¿Te casas conmigo? 💍" con animación de anillo brillante.' },
    pregnancy: { emoji: '👶', featureBadge: 'Tarjeta Rasca y Gana Digital', featureDesc: 'Tarjeta dorada interactiva para raspar con el dedo y revelar la ecografía y fecha del bebé.' },
    surprise: { emoji: '🎁', featureBadge: 'Caja de Regalo 3D que se Abre', featureDesc: 'Caja con moño que tiembla y se abre al tocarla revelando un Ticket Dorado sorpresa.' },
    'love-letter': { emoji: '📜', featureBadge: 'Sobre con Sello de Cera', featureDesc: 'Sobre vintage que se rompe al tocarlo y despliega la carta en formato pergamino antiguo.' },
    'love-confession': { emoji: '💖', featureBadge: 'Declaración de Sentimientos', featureDesc: 'Carta emotiva con dedicatoria íntima y lluvia de destellos.' },
    valentines: { emoji: '🌹', featureBadge: 'San Valentín Edición Especial', featureDesc: 'Lluvia de rosas y corazones flotantes con contador romántico.' },
    special: { emoji: '⭐', featureBadge: 'Fuegos Artificiales & Celebración', featureDesc: 'Efecto de fuegos artificiales digitales para felicitar por un logro o graduación.' },
    gratitude: { emoji: '🙏', featureBadge: 'Agradecimiento Cálido', featureDesc: 'Diseño sereno y emotivo centrado en palabras de gratitud.' },
    reconciliation: { emoji: '🕊️', featureBadge: 'Hacer las Paces 🤝', featureDesc: 'Mensaje reconfortante para reencontrarse y abrazar los buenos momentos.' },
  };

  return (
    <div className="space-y-6 animate-fade-in text-left">
      <div className="border-b border-rose-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span>✨</span>
            <span>2. Elige la Temática y Ocasión de tu Regalo</span>
          </h2>
          <p className="text-xs text-gray-500 font-light mt-1">
            Cada temática incluye una <strong>interacción real</strong> (soplar velas, rascar tarjeta, abrir caja de regalo o propuesta) que tu homenajeado vivirá al escanear el QR.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {themes.map((t) => {
          const isSelected = selectedTheme === t.id;
          const info = themeHighlights[t.id] || { emoji: '✨', featureBadge: 'Interacción Especial', featureDesc: t.description };

          return (
            <div
              key={t.id}
              onClick={() => setSelectedTheme(t.id)}
              className={`p-4 sm:p-5 rounded-3xl cursor-pointer transition-all duration-200 border text-left flex flex-col justify-between relative bg-white ${
                isSelected
                  ? 'border-2 border-[#a21232] bg-rose-50/40 shadow-md ring-2 ring-[#a21232]/15 scale-[1.02]'
                  : 'border-gray-200 hover:border-rose-300 hover:shadow-xs'
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#a21232] text-white flex items-center justify-center shadow-xs">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl select-none">{info.emoji}</span>
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-gray-900">{t.name}</h3>
                    <span className="inline-block px-2 py-0.5 bg-rose-100/70 text-[#a21232] text-[9px] font-bold rounded-md mt-0.5">
                      ⚡ {info.featureBadge}
                    </span>
                  </div>
                </div>

                <p className="text-[10px] text-gray-500 font-light leading-relaxed pt-1">
                  {info.featureDesc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
