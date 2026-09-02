'use client';

import React from 'react';
import { Product } from '@/lib/db';
import { Check, CheckCircle2, Sparkles } from 'lucide-react';
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

  const basicProd = products.find(p => p.id === 'basic' || p.id === 'digital');
  const mediumProd = products.find(p => p.id === 'medium' || p.id === 'card');
  const premiumProd = products.find(p => p.id === 'premium');

  const planItems = [
    {
      id: 'basic',
      name: basicProd?.name || 'Plan Básico',
      subtitle: basicProd?.subtitle || 'Hasta 10 Fotos • Polaroid & Collage',
      price: basicProd?.price || 4990,
      description: basicProd?.description || `Página web con la interacción clave de ${themeInfo.name}, 2 estilos de fotos y tarjeta digital con color personalizado.`,
      features: basicProd?.features && basicProd.features.length > 0 ? basicProd.features : themeInfo.plans.basic,
      badge: basicProd?.badge || null,
    },
    {
      id: 'medium',
      name: mediumProd?.name || 'Plan Medio',
      subtitle: mediumProd?.subtitle || 'Tarjeta 145 Personajes + Música 🎵 + Interacciones Extra',
      price: mediumProd?.price || 5990,
      description: mediumProd?.description || `Nuestra opción más recomendada para ${themeInfo.name}. Incluye música de fondo, tarjeta digital con 145 personajes temáticos e interacciones adicionales.`,
      features: mediumProd?.features && mediumProd.features.length > 0 ? mediumProd.features : themeInfo.plans.medium,
      badge: mediumProd?.badge || 'Más Recomendado',
    },
    {
      id: 'premium',
      name: premiumProd?.name || 'Plan Máximo',
      subtitle: premiumProd?.subtitle || '🎙️ Nota de Voz Real + 🎬 Video Directo + 35 Fotos 👑',
      price: premiumProd?.price || 7990,
      description: premiumProd?.description || `La experiencia definitiva de ${themeInfo.name}: tu nota de voz grabada estilo WhatsApp, subida de video directo, combina 2 estilos de fotos, línea de tiempo y rincón secreto.`,
      features: premiumProd?.features && premiumProd.features.length > 0 ? premiumProd.features : themeInfo.plans.premium,
      badge: premiumProd?.badge || '👑 PRO',
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {planItems.map((plan) => {
          const isSelected = selectedPlan === plan.id;
          const isProOrPremium = plan.id === 'premium' || (plan.badge && plan.badge.toLowerCase().includes('pro'));
          return (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative rounded-3xl p-6 cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                isSelected
                  ? isProOrPremium
                    ? 'border-2 border-amber-500 bg-white shadow-xl shadow-amber-950/10 scale-[1.02] ring-2 ring-amber-400/30'
                    : 'border-2 border-[#a21232] bg-white shadow-xl shadow-rose-950/5 scale-[1.02]'
                  : isProOrPremium
                  ? 'border border-amber-200/80 bg-gradient-to-b from-amber-50/20 to-white hover:border-amber-400 hover:shadow-md'
                  : 'border border-gray-200 bg-white/80 hover:border-rose-300 hover:shadow-md'
              }`}
            >
              {plan.badge && (
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-extrabold uppercase px-3.5 py-0.5 rounded-full shadow-md tracking-wider flex items-center gap-1 whitespace-nowrap z-10 ${
                  isProOrPremium
                    ? 'bg-gradient-to-r from-amber-600 via-rose-600 to-[#a21232] text-white border border-amber-200'
                    : 'bg-[#a21232] text-white'
                }`}>
                  {isProOrPremium && <Sparkles className="w-3 h-3 text-amber-200" />}
                  <span>{plan.badge}</span>
                </div>
              )}

              <div className="space-y-3.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <h3 className="font-serif font-bold text-lg text-gray-900 flex items-center gap-1.5">
                      <span>{plan.name}</span>
                    </h3>
                    <p className={`text-xs font-semibold leading-snug ${
                      isProOrPremium ? 'text-amber-800' : 'text-[#a21232]'
                    }`}>
                      {plan.subtitle}
                    </p>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center border shrink-0 mt-0.5 transition ${
                      isSelected
                        ? isProOrPremium
                          ? 'border-amber-500 bg-amber-500 text-white shadow-xs'
                          : 'border-[#a21232] bg-[#a21232] text-white shadow-xs'
                        : 'border-gray-300 bg-gray-50'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>

                <div className="py-2 border-y border-gray-100 flex items-baseline gap-1">
                  <span className={`font-serif text-2xl sm:text-3xl font-black ${
                    isProOrPremium ? 'text-amber-950' : 'text-gray-900'
                  }`}>
                    ${Number(plan.price).toLocaleString('es-CL')}
                  </span>
                  <span className="text-[11px] text-gray-500 font-medium uppercase">CLP</span>
                </div>

                <p className="text-xs text-gray-600 font-light leading-relaxed">
                  {plan.description}
                </p>

                <ul className="space-y-2 pt-2">
                  {plan.features.map((f, fIdx) => (
                    <li 
                      key={fIdx} 
                      className="text-xs text-gray-700 flex items-start gap-2 leading-snug py-0.5"
                    >
                      <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                        isProOrPremium ? 'text-amber-600' : 'text-emerald-600'
                      }`} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
