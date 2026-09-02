'use client';

import React from 'react';
import { Product } from '@/lib/db';
import { Check, CheckCircle2, Sparkles, Image as ImageIcon, Music, Heart, Mic, Video, MapPin, KeyRound, Calendar } from 'lucide-react';
import { THEME_HIGHLIGHTS } from './Step1Tematica';

interface Step2PlanProps {
  products: Product[];
  selectedPlan: string;
  setSelectedPlan: (id: string) => void;
  selectedTheme: string;
}

export default function Step2Plan({
  products,
  selectedPlan,
  setSelectedPlan,
  selectedTheme,
}: Step2PlanProps) {
  const themeInfo = THEME_HIGHLIGHTS[selectedTheme] || THEME_HIGHLIGHTS['anniversary'];

  const basicFeatures = themeInfo?.plans?.basic || [
    '📸 Hasta 10 Fotos en Polaroid & Collage',
    '⏱️ Contador de Tiempo en Vivo (Años, meses y días juntos)',
    '💖 Portada Interactiva con corazón palpitante',
    '💌 Dedicatoria y Carta personalizada',
    '🎨 Tarjeta de Regalo Digital Clásica (Color personalizado)',
    '📱 Código QR en Alta Calidad activo de por vida'
  ];

  const mediumFeatures = themeInfo?.plans?.medium || [
    '✓ Todo lo incluido en el Plan Básico',
    '📸 Hasta 20 Fotos en HD (6 estilos de galería a elección)',
    '🎵 Música Personalizada (Banda Sonora Oficial sin anuncios)',
    '🔢 Estadísticas de la Pareja / Momentos Compartidos',
    '💌 Carta de Dedicatoria Interactiva',
    '✨ Tarjeta de Regalo Personalizable (Catálogo de 145 Personajes)'
  ];

  const premiumFeatures = themeInfo?.plans?.premium || [
    '✓ Todo lo incluido en el Plan Medio',
    '📸 Hasta 40 Fotos en HD (Combina 2 galerías distintas juntas)',
    '🎙️ Nota de Voz Real de WhatsApp (Grabada con micrófono en vivo)',
    '🎬 Video Dedicado en HD (Subida directa de video)',
    '⏳ Línea de Tiempo Histórica (Hitos con fotos y fechas especiales)',
    '📍 Mapa Interactivo del lugar especial donde se conocieron',
    '🔒 Rincón Secreto Protegido con PIN de 4 dígitos'
  ];

  const planItems = [
    {
      id: 'basic',
      name: 'Plan Básico',
      subtitle: 'El detalle romántico esencial',
      photoBadge: '10 Fotos',
      price: products.find(p => p.id === 'basic' || p.id === 'digital')?.price || 4990,
      description: `Página web con la interacción clave de ${themeInfo.name}, dedicatoria y tarjeta digital.`,
      features: basicFeatures,
      badge: null,
    },
    {
      id: 'medium',
      name: 'Plan Medio',
      subtitle: 'Música Oficial + 145 Personajes',
      photoBadge: '20 Fotos',
      price: products.find(p => p.id === 'medium' || p.id === 'card')?.price || 6990,
      description: `La opción más recomendada: incluye música de fondo oficial y tarjeta con 145 personajes temáticos.`,
      features: mediumFeatures,
      badge: 'Más Recomendado',
    },
    {
      id: 'premium',
      name: 'Plan Máximo',
      subtitle: 'Nota de Voz + Video + 40 Fotos 👑',
      photoBadge: '40 Fotos Dual',
      price: products.find(p => p.id === 'premium')?.price || 7990,
      description: `La experiencia definitiva: nota de voz grabada estilo WhatsApp, video HD, línea de tiempo y rincón secreto.`,
      features: premiumFeatures,
      badge: 'Experiencia Pro',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in text-left">
      <div className="border-b border-rose-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span>🎁</span>
            <span>2. Elige tu Plan para {themeInfo.emoji} {themeInfo.name}</span>
          </h2>
          <p className="text-xs text-gray-500 font-light mt-1">
            Planes adaptados a tu celebración. Los planes <strong>Medio y Máximo</strong> desbloquean el catálogo de 145 personajes temáticos y música de fondo.
          </p>
        </div>

        <div className="bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-2xl flex items-center gap-1.5 self-start sm:self-auto shadow-2xs">
          <span className="text-sm">{themeInfo.emoji}</span>
          <span className="text-[10px] font-bold text-[#a21232]">{themeInfo.name}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 items-stretch">
        {planItems.map((plan) => {
          const isSelected = selectedPlan === plan.id;
          const isFeatured = plan.id === 'medium';

          return (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative rounded-3xl p-5 sm:p-6 cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                isSelected
                  ? 'border-2 border-[#a21232] bg-white shadow-xl shadow-rose-950/10 scale-[1.02] ring-2 ring-rose-200'
                  : isFeatured
                  ? 'border-2 border-rose-300 bg-white/95 shadow-md hover:border-[#a21232]'
                  : 'border border-gray-200 bg-white/90 hover:border-rose-300 hover:shadow-md'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#a21232] text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-xs tracking-wider whitespace-nowrap z-10">
                  {plan.badge}
                </div>
              )}

              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-2 border-b border-gray-100 pb-3">
                  <div className="space-y-1">
                    <h3 className="font-serif font-bold text-lg text-gray-900">{plan.name}</h3>
                    <p className="text-[11px] text-[#a21232] font-semibold leading-snug">{plan.subtitle}</p>
                  </div>

                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center border shrink-0 mt-0.5 transition ${
                      isSelected
                        ? 'border-[#a21232] bg-[#a21232] text-white shadow-xs'
                        : 'border-gray-300 bg-gray-50'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>

                {/* Price & Photos Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-1">
                    <span className="font-serif text-2xl sm:text-3xl font-black text-gray-900">
                      ${Number(plan.price).toLocaleString('es-CL')}
                    </span>
                    <span className="text-[10px] text-gray-500 font-bold uppercase">CLP</span>
                  </div>

                  <span className="px-2.5 py-1 bg-rose-50 text-[#a21232] border border-rose-200 text-[10px] font-bold rounded-lg flex items-center gap-1">
                    <ImageIcon className="w-3 h-3 text-[#a21232]" />
                    <span>{plan.photoBadge}</span>
                  </span>
                </div>

                {/* Features List */}
                <ul className="space-y-2 pt-2 border-t border-gray-100">
                  {plan.features.map((f, fIdx) => {
                    const isAllIncluded = f.startsWith('✓ Todo');
                    return (
                      <li 
                        key={fIdx} 
                        className={`text-xs flex items-start gap-2 leading-snug py-0.5 ${
                          isAllIncluded
                            ? 'font-bold text-[#a21232] bg-rose-50/70 p-1.5 rounded-lg border border-rose-200/60'
                            : 'text-gray-700'
                        }`}
                      >
                        <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                          isAllIncluded ? 'text-[#a21232]' : 'text-emerald-600'
                        }`} />
                        <span>{f}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPlan(plan.id);
                }}
                className={`w-full mt-5 py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-[#a21232] text-white shadow-xs'
                    : 'bg-gray-100 hover:bg-rose-50 text-gray-800 hover:text-[#a21232] border border-gray-200'
                }`}
              >
                {isSelected ? '✓ Plan Seleccionado' : 'Elegir este Plan'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
