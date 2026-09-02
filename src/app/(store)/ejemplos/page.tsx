'use client';

import Link from 'next/link';
import { Heart, QrCode, Smartphone, Sparkles, Music, Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EjemplosPage() {
  const examples = [
    {
      slug: 'ejemplo-digital',
      title: 'Regalo de Cumpleaños para Sofía',
      partner: 'Sofía',
      creator: 'Lucas',
      date: '12 de Febrero de 2023',
      features: ['Contador de Días', '10 Fotos Especiales', 'Carta Romántica', 'Código QR en PDF'],
      bg: 'from-pink-500 to-rose-500',
      description: 'Una experiencia minimalista y elegante enfocada en sus fotos y el contador de tiempo de la pareja.'
    },
    {
      slug: 'ejemplo-premium',
      title: 'Aniversario de Bodas de María & Carlos',
      partner: 'María',
      creator: 'Carlos',
      date: '05 de Octubre de 2018',
      features: ['Música de Fondo Integrada', 'Línea de Tiempo con 4 momentos claves', 'Hasta 30 Fotos en Carrusel', 'Contador con Segundos', 'Diseño Animado Premium'],
      bg: 'from-purple-600 to-rose-500',
      description: 'Nuestra experiencia de gala. Incluye música romántica sonando automáticamente y una línea de tiempo relatando sus mayores hitos.'
    }
  ];

  return (
    <div className="py-16 md:py-24 bg-gradient-to-b from-rose-50/20 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Header */}
        <div className="max-w-3xl mx-auto mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-100 text-rose-600 text-xs font-semibold uppercase tracking-wider"
          >
            <Smartphone className="w-3.5 h-3.5" />
            Demostración Interactiva
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl sm:text-5xl font-bold text-gray-900"
          >
            Ejemplos de Páginas de Amor
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 text-base sm:text-lg font-light max-w-xl mx-auto"
          >
            Haz clic en cualquiera de nuestros ejemplos para interactuar con la web exactamente como la vería tu pareja en su teléfono al escanear el código QR.
          </motion.p>
        </div>

        {/* Ejemplos list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {examples.map((example, idx) => (
            <motion.div
              key={example.slug}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-3xl overflow-hidden border border-rose-100 shadow-md flex flex-col justify-between hover:shadow-xl transition-shadow duration-300"
            >
              {/* Preview banner simulating mobile header */}
              <div className={`h-40 bg-gradient-to-r ${example.bg} p-6 flex flex-col justify-between text-white relative overflow-hidden`}>
                <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
                  <Heart className="w-40 h-40 fill-white" />
                </div>
                <div className="flex justify-between items-start z-10">
                  <span className="bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase">
                    {example.slug === 'ejemplo-premium' ? 'Premium' : 'Digital'}
                  </span>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="text-xs">{example.date}</span>
                  </div>
                </div>
                <div className="text-left z-10">
                  <p className="text-[10px] text-rose-100 font-medium">De {example.creator} para</p>
                  <h3 className="font-serif text-2xl font-bold">{example.partner}</h3>
                </div>
              </div>

              {/* Description and Features */}
              <div className="p-6 md:p-8 text-left flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-gray-800 leading-tight">
                    {example.title}
                  </h4>
                  <p className="text-gray-500 text-xs font-light leading-relaxed">
                    {example.description}
                  </p>
                  
                  <div className="space-y-2">
                    <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Características Destacadas</h5>
                    <div className="flex flex-wrap gap-1.5">
                      {example.features.map((feat, fIdx) => (
                        <span 
                          key={fIdx} 
                          className="bg-rose-50 text-rose-600 text-[10px] font-semibold px-2.5 py-1 rounded-lg border border-rose-100/50"
                        >
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <Link
                  href={`/amor/${example.slug}`}
                  target="_blank"
                  className="w-full py-3.5 bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 text-white font-bold rounded-2xl transition flex items-center justify-center gap-2 shadow-md shadow-rose-500/10 hover:shadow-lg hover:shadow-rose-500/20"
                >
                  Ver experiencia en vivo
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tip */}
        <div className="mt-16 text-xs text-gray-400 max-w-md mx-auto">
          Tip: En el demo premium, presiona el gran botón de corazón al entrar para activar la música de fondo y los efectos visuales.
        </div>
      </div>
    </div>
  );
}
