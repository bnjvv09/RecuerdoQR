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

  const planItems = [
    {
      id: 'basic',
      name: 'Plan Básico',
      subtitle: 'Hasta 10 Fotos • Polaroid & Collage',
      price: products.find(p => p.id === 'basic' || p.id === 'digital')?.price || 4990,
      description: `Página web con la interacción clave de ${themeInfo.name}, 2 estilos de fotos y tarjeta digital con color personalizado.`,
      features: themeInfo.plans.basic,
      popular: false,
    },
    {
      id: 'medium',
      name: 'Plan Medio',
      subtitle: 'Tarjeta 145 Personajes + Música 🎵 + Interacciones Extra',
      price: products.find(p => p.id === 'medium' || p.id === 'card')?.price || 5990,
      description: `Nuestra opción más recomendada para ${themeInfo.name}. Incluye música de fondo, tarjeta digital con 145 personajes temáticos e interacciones adicionales.`,
      features: themeInfo.plans.medium,
      popular: true,
    },
    {
      id: 'premium',
      name: 'Plan Máximo',
      subtitle: '🎙️ Nota de Voz Real + 🎬 Video Directo + 35 Fotos 👑',
      price: products.find(p => p.id === 'premium')?.price || 7990,
      description: `La experiencia definitiva de ${themeInfo.name}: tu nota de voz grabada estilo WhatsApp, subida de video directo, combina 2 estilos de fotos, línea de tiempo y rincón secreto.`,
      features: themeInfo.plans.premium,
      popular: false,
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
          return (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative rounded-3xl p-6 cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                isSelected
                  ? 'border-2 border-[#a21232] bg-white shadow-xl shadow-rose-950/5 scale-[1.02]'
                  : 'border border-gray-200 bg-white/80 hover:border-rose-300 hover:shadow-md'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#a21232] text-white text-[10px] font-extrabold uppercase px-3 py-0.5 rounded-full shadow-xs tracking-wider">
                  Más Recomendado
                </div>
              )}

              <div className="space-y-3.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <h3 className="font-serif font-bold text-lg text-gray-900">{plan.name}</h3>
                    <p className="text-xs text-[#a21232] font-bold leading-snug">{plan.subtitle}</p>
                    {plan.id === 'medium' && (
                      <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-100/80 border border-amber-200 text-amber-900 text-[10px] font-extrabold rounded-full mt-1 shadow-2xs">
                        <span>⭐ Incluye 145 Personajes Temáticos</span>
                      </div>
                    )}
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

                <div className="py-2 border-y border-gray-100 flex items-baseline gap-1">
                  <span className="font-serif text-2xl sm:text-3xl font-black text-gray-900">
                    ${Number(plan.price).toLocaleString('es-CL')}
                  </span>
                  <span className="text-[11px] text-gray-500 font-medium uppercase">CLP</span>
                </div>

                <p className="text-xs text-gray-600 font-light leading-relaxed">
                  {plan.description}
                </p>

                <ul className="space-y-2 pt-2">
                  {plan.features.map((f, fIdx) => {
                    const is145 = f.includes('145 Personajes');
                    return (
                      <li 
                        key={fIdx} 
                        className={`text-xs flex items-start gap-2 leading-snug rounded-xl transition-all ${
                          is145 
                            ? 'font-bold text-[#a21232] bg-rose-50 border border-rose-200 p-2 shadow-2xs' 
                            : 'text-gray-700 font-normal py-0.5'
                        }`}
                      >
                        <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${is145 ? 'text-[#a21232]' : 'text-emerald-600'}`} />
                        <span>{f}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
