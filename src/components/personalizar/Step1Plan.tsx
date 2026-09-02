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
  const planItems = [
    {
      id: 'basic',
      name: 'Plan Básico',
      subtitle: 'Hasta 10 Fotos • Polaroid & Collage',
      price: products.find(p => p.id === 'basic' || p.id === 'digital')?.price || 7990,
      description: 'Página web personalizada con la interacción clave de tu temática, 2 estilos de fotos y tarjeta con color libre.',
      features: [
        'Hasta 10 Fotos en HD (con dedicatorias)',
        '2 Estilos de galería (Polaroid & Collage)',
        '🎯 Interacción clave de la temática (ej. Soplar velas)',
        '💍 Propuesta Interactiva incluida ("¡Sí, Acepto!")',
        '⏱️ Contador de tiempo juntos en vivo',
        '🎨 Tarjeta Clásica con Color 100% Personalizado',
        '✍️ Tipografía de Tarjeta a elección',
        '📱 Código QR en alta resolución'
      ],
      popular: false,
    },
    {
      id: 'medium',
      name: 'Plan Medio',
      subtitle: 'Hasta 20 Fotos + Tarjeta 145 Personajes + Música 🎵',
      price: products.find(p => p.id === 'medium' || p.id === 'card')?.price || 12990,
      description: 'Nuestra opción más popular. Añade tu canción de YouTube, tarjeta con 145 personajes temáticos y 6 estilos de fotos.',
      features: [
        'Todo lo del Plan Básico',
        '✨ Tarjeta Temática Personalizada (145 Personajes a elección)',
        'Hasta 20 Fotos en galería',
        '🎵 Música de fondo personalizada (YouTube)',
        '💌 Carta de amor interactiva',
        '🖼️ Todos los 6 Estilos de galería a elección',
        '🎈 Interacciones extra según temática (Globos sorpresa)',
        '✍️ Tipografía de Tarjeta a elección'
      ],
      popular: true,
    },
    {
      id: 'premium',
      name: 'Plan Máximo',
      subtitle: '+40 Fotos • Doble Galería o 40 en Una • Video & Hitos 👑',
      price: products.find(p => p.id === 'premium')?.price || 17990,
      description: 'La experiencia multimedia definitiva: hasta 40 fotos en alta definición (o 2 galerías de 20), video, hitos históricos con fotos y rincón secreto.',
      features: [
        'Todo lo del Plan Medio (incluye Tarjeta 145 personajes y Música)',
        '+40 Fotos en HD (hasta 40 en una galería o 20 en cada una)',
        '✨ Doble Galería de Fotos simultánea con estilos independientes',
        '🎬 Video dedicado en alta definición o YouTube',
        '✨ Línea de Tiempo de Hitos con fotos y fechas',
        '🔒 Rincón Secreto con PIN de 4 dígitos',
        '🎙️ Grabador de Nota de Voz real estilo WhatsApp',
        '🎁 Caja de Regalo Sorpresa animada',
        '📍 Mapa de Nuestro Lugar Especial'
      ],
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
