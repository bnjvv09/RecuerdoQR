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
      subtitle: basicProd?.subtitle || 'Página web personalizada con hasta 10 fotos, contador de tiempo y tarjeta digital temática.',
      price: basicProd?.price || 4990,
      description: basicProd?.description || 'Página web personalizada con hasta 10 fotos, contador de tiempo y tarjeta digital temática.',
      features: basicProd?.features || [
        'Página web interactiva',
        'Hasta 10 Fotos en HD',
        'Contador de tiempo en vivo',
        'Dedicatoria final con corazón',
        'Tarjeta de Regalo Digital Temática',
        'Código QR Digital HD'
      ],
      badge: basicProd?.badge,
      popular: false,
    },
    {
      id: 'medium',
      name: mediumProd?.name || 'Plan Medio',
      subtitle: mediumProd?.subtitle || 'Nuestra opción más popular. Desbloquea el catálogo de 145 personajes temáticos para tu tarjeta, añade hasta 20 fotos, música de fondo (YouTube) y carta interactiva.',
      price: mediumProd?.price || 5990,
      description: mediumProd?.description || 'Nuestra opción más popular. Desbloquea el catálogo de 145 personajes temáticos para tu tarjeta, añade hasta 20 fotos, música de fondo (YouTube) y carta interactiva.',
      features: mediumProd?.features || [
        'Todo lo del Plan Básico',
        '✨ Tarjeta con 145 Personajes Temáticos',
        'Hasta 20 Fotos en HD',
        'Música de fondo personalizada (YouTube)',
        '6 Estilos de galería (Polaroid, Carrete)',
        'Carta de amor interactiva'
      ],
      badge: mediumProd?.badge || 'Más Popular',
      popular: true,
    },
    {
      id: 'premium',
      name: premiumProd?.name || 'Plan Máximo',
      subtitle: premiumProd?.subtitle || 'La experiencia completa sin límites: hasta 30 fotos, video dedicado, línea de tiempo de hitos y todos los widgets.',
      price: premiumProd?.price || 7990,
      description: premiumProd?.description || 'La experiencia completa sin límites: hasta 30 fotos, video dedicado, línea de tiempo de hitos y todos los widgets.',
      features: premiumProd?.features || [
        'Todo lo del Plan Medio (incluye 145 personajes)',
        'Hasta 30 Fotos en HD',
        'Video de YouTube dedicado',
        'Línea de tiempo con fotos de hitos',
        'Rincón secreto con PIN, Propuesta y Mapa'
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
