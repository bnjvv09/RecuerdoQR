'use client';

import React from 'react';
import { Product, Theme } from '@/lib/db';
import { Sparkles, Check, CheckCircle2 } from 'lucide-react';

interface Step1ProductoProps {
  products: Product[];
  themes: Theme[];
  selectedPlan: string;
  setSelectedPlan: (id: string) => void;
  selectedTheme: string;
  setSelectedTheme: (id: string) => void;
}

export default function Step1Producto({
  products,
  themes,
  selectedPlan,
  setSelectedPlan,
  selectedTheme,
  setSelectedTheme,
}: Step1ProductoProps) {
  const planItems = [
    {
      id: 'basic',
      name: 'Plan Básico',
      subtitle: 'Hasta 10 Fotos • Polaroid & Collage',
      price: products.find(p => p.id === 'basic' || p.id === 'digital')?.price || 7990,
      description: 'Página web personalizada con contador en vivo, propuesta interactiva y tarjeta de regalo con color y tipografía libre.',
      features: [
        'Hasta 10 Fotos en HD (con dedicatorias)',
        '2 Estilos de galería (Polaroid & Collage)',
        '💍 Pregunta / Propuesta Interactiva ("¡Sí, Acepto!")',
        '⏱️ Contador de tiempo juntos en vivo',
        '🎨 Tarjeta Clásica con Color 100% Personalizado',
        '✍️ Tipografía de Tarjeta a elección',
        '💖 Dedicatoria final con corazón palpitante',
        '📱 Código QR en alta resolución'
      ],
      popular: false,
    },
    {
      id: 'medium',
      name: 'Plan Medio',
      subtitle: 'Hasta 20 Fotos + Tarjeta 145 Personajes + Música 🎵',
      price: products.find(p => p.id === 'medium' || p.id === 'card')?.price || 12990,
      description: 'Nuestra opción más popular. Añade tu canción favorita de YouTube, 6 estilos de fotos y tarjeta personalizada con 145 personajes temáticos.',
      features: [
        'Todo lo del Plan Básico (incluye Propuesta)',
        '✨ Tarjeta Temática Personalizada (145 Personajes a elección)',
        'Hasta 20 Fotos en galería',
        '🎵 Música de fondo personalizada (YouTube)',
        '💌 Carta de amor interactiva',
        '🖼️ Todos los 6 Estilos de galería a elección',
        '✍️ Tipografía de Tarjeta a elección',
        '✨ Efectos de corazones / destellos flotantes'
      ],
      popular: true,
    },
    {
      id: 'premium',
      name: 'Plan Máximo',
      subtitle: 'Hasta 35 Fotos + Combinar 2 Estilos + Video & Hitos 👑',
      price: products.find(p => p.id === 'premium')?.price || 17990,
      description: 'La experiencia multimedia definitiva sin límites: combina 2 estilos de fotos juntos (Polaroid + Collage), video de YouTube, línea de tiempo de hitos y rincón secreto.',
      features: [
        'Todo lo del Plan Medio (incluye Tarjeta 145 personajes y Música)',
        'Hasta 35 Fotos en HD',
        '✨ Combinar 2 Estilos de fotos juntos (ej. Polaroid + Collage)',
        '🎬 Video de YouTube dedicado incrustado',
        '✨ Línea de Tiempo de Hitos con fotos y fechas',
        '🔒 Rincón Secreto con PIN de 4 dígitos',
        '🎁 Caja de Regalo Sorpresa animada',
        '📍 Mapa de Nuestro Lugar Especial'
      ],
      popular: false,
    },
  ];

  return (
    <div className="space-y-10 animate-fade-in text-left">
      {/* 1. Selecciona tu Formato */}
      <div className="space-y-4">
        <div className="border-b border-rose-100 pb-3">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span>🎁</span>
            <span>1. Elige tu Plan Digital</span>
          </h2>
          <p className="text-xs text-gray-500 font-light mt-1">
            Todos los planes incluyen la <strong>Propuesta Interactiva</strong> y código QR de alta resolución. Los planes <strong>Medio y Máximo</strong> desbloquean el catálogo de 145 personajes temáticos y música de fondo.
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

      {/* 2. Selecciona la Atmósfera */}
      <div className="space-y-4">
        <div className="border-b border-rose-100 pb-3">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span>✨</span>
            <span>2. Elige la Atmósfera de la Página Web</span>
          </h2>
          <p className="text-xs text-gray-500 font-light mt-1">
            Adapta la atmósfera y animación de la página web al motivo especial de tu celebración.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {themes.map((t) => {
            const isSelected = selectedTheme === t.id;
            const emoji = (t as any).emoji || (t.config as any)?.emoji || '✨';
            return (
              <div
                key={t.id}
                onClick={() => setSelectedTheme(t.id)}
                className={`p-4 rounded-2xl cursor-pointer transition-all text-center space-y-2 border ${
                  isSelected
                    ? 'border-[#a21232] bg-rose-50/40 shadow-md ring-2 ring-[#a21232]/20'
                    : 'border-gray-200 bg-white hover:border-rose-200 hover:bg-rose-50/10'
                }`}
              >
                <div className="text-3xl">{emoji}</div>
                <h4 className="font-bold text-xs text-gray-900">{t.name}</h4>
                <p className="text-[10px] text-gray-500 font-light line-clamp-2">{t.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
