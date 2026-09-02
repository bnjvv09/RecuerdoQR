'use client';

import React from 'react';
import { Product } from '@/lib/db';
import { Check, CheckCircle2 } from 'lucide-react';

interface Step1PlanProps {
  products: Product[];
  selectedPlan: string;
  setSelectedPlan: (id: string) => void;
}

export default function Step1Plan({
  products,
  selectedPlan,
  setSelectedPlan,
}: Step1PlanProps) {
  const basicProd = products.find(p => p.id === 'basic' || p.id === 'digital');
  const mediumProd = products.find(p => p.id === 'medium' || p.id === 'card');
  const premiumProd = products.find(p => p.id === 'premium');

  const planItems = [
    {
      id: 'basic',
      name: basicProd?.name || 'Plan Básico',
      subtitle: basicProd?.subtitle || 'Hasta 10 Fotos • Polaroid & Collage',
      price: basicProd?.price || 4990,
      description: basicProd?.description || 'Página web con la interacción clave de Aniversario, 2 estilos de fotos y tarjeta digital con color libre.',
      features: basicProd?.features || [
        '⏱️ Contador de amor en tiempo real (años, días, segundos)',
        '💖 Dedicatoria final con corazón palpitante',
        '📸 Hasta 10 Fotos en Polaroid y Collage',
        '🎨 Tarjeta digital con color personalizado'
      ],
      badge: basicProd?.badge,
      popular: false,
    },
    {
      id: 'medium',
      name: mediumProd?.name || 'Plan Medio',
      subtitle: mediumProd?.subtitle || 'Tarjeta 145 Personajes + Música 🎵 + Interacciones Extra',
      price: mediumProd?.price || 5990,
      description: mediumProd?.description || 'Nuestra opción más recomendada para Aniversario. Incluye música de fondo, tarjeta con 145 personajes temáticos e interacciones adicionales.',
      features: mediumProd?.features || [
        '⏱️ Contador de amor en vivo + Corazones',
        '🔢 Estadísticas divertidas (horas juntos, cafés compartidos)',
        '🎵 Canción especial de la pareja de fondo (YouTube)',
        '💌 Carta de aniversario interactiva',
        '📸 Hasta 20 Fotos + Tarjeta con 145 personajes'
      ],
      badge: mediumProd?.badge || 'Más Recomendado',
      popular: true,
    },
    {
      id: 'premium',
      name: premiumProd?.name || 'Plan Máximo',
      subtitle: premiumProd?.subtitle || '🎙️ Nota de Voz Real + 🎬 Video Directo + 35 Fotos 👑',
      price: premiumProd?.price || 7990,
      description: premiumProd?.description || 'La experiencia definitiva de Aniversario: tu nota de voz grabada estilo WhatsApp, subida de video directo, combina 2 estilos de fotos, línea de tiempo y rincón secreto.',
      features: premiumProd?.features || [
        '⏱️ Contador + Estadísticas + 🎵 Música + 💌 Carta',
        '✨ Línea de tiempo de hitos con fotos y fechas',
        '📍 Mapa interactivo del lugar donde se conocieron',
        '📸 Hasta 35 Fotos (combina 2 estilos juntos)'
      ],
      badge: premiumProd?.badge,
      popular: false,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in text-left">
      <div className="border-b border-rose-100 pb-3">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span>🎁</span>
          <span>1. Elige tu Plan Digital</span>
        </h2>
        <p className="text-xs text-gray-500 font-light mt-1">
          Todos los planes incluyen la interacción real de la temática elegida y código QR. Los planes <strong>Medio y Máximo</strong> desbloquean el catálogo de 145 personajes temáticos y música de fondo.
        </p>
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
                  Más Popular
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-gray-900">{plan.name}</h3>
                    <p className="text-[10px] text-[#a21232] font-semibold">{plan.subtitle}</p>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center border transition ${
                      isSelected
                        ? 'border-[#a21232] bg-[#a21232] text-white'
                        : 'border-gray-300 bg-gray-50'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>

                <div className="py-2 border-y border-gray-100">
                  <span className="font-serif text-2xl font-black text-gray-900">
                    ${Number(plan.price).toLocaleString('es-CL')}
                  </span>
                  <span className="text-[10px] text-gray-400 font-light ml-1">CLP</span>
                </div>

                <p className="text-xs text-gray-500 font-light leading-relaxed">
                  {plan.description}
                </p>

                <ul className="space-y-2 pt-2">
                  {plan.features.map((f, fIdx) => (
                    <li key={fIdx} className="text-[11px] text-gray-600 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
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
