'use client';

import React from 'react';
import { Theme } from '@/lib/db';
import { Sparkles, Check } from 'lucide-react';

interface Step1TematicaProps {
  themes: Theme[];
  selectedTheme: string;
  setSelectedTheme: (id: string) => void;
}

export const THEME_HIGHLIGHTS: Record<string, { 
  emoji: string; 
  name: string;
  badge: string; 
  desc: string;
  plans: {
    basic: string[];
    medium: string[];
    premium: string[];
  }
}> = {
  birthday: {
    emoji: '🎂',
    name: 'Cumpleaños',
    badge: 'Torta & Velas para Soplar',
    desc: 'Torta interactiva con velas encendidas para pedir un deseo, soplar con animación y estallido de confeti.',
    plans: {
      basic: [
        '🎂 Torta virtual interactiva con velas encendidas para soplar',
        '🎉 Animación de confeti de colores festivo',
        '📸 Hasta 10 Fotos con dedicatorias',
        '🎨 Tarjeta física con Color 100% Personalizado',
        '📱 Código QR de alta resolución'
      ],
      medium: [
        '🎂 Torta virtual interactiva con velas para soplar',
        '🎈 Globos flotantes interactivos para reventar sorpresas',
        '🎵 Canción de Cumpleaños / Mañanitas de fondo (YouTube)',
        '📸 Hasta 20 Fotos en galería (6 estilos)',
        '✨ Tarjeta física con 145 Personajes Temáticos a elección',
        '💌 Mensaje largo y carta de dedicatoria'
      ],
      premium: [
        '🎂 Torta interactiva + 🎈 Globos sorpresa + 🎵 Música',
        '🎬 Video sorpresa de YouTube dedicado (saludos de amigos)',
        '✨ Línea de tiempo de fotos de su vida y mejores momentos',
        '📸 Hasta 35 Fotos en HD (combina 2 estilos juntos)',
        '🔒 Rincón Secreto con PIN de 4 dígitos',
        '👑 Tarjeta de Regalo Premium con personajes'
      ]
    }
  },
  'dating-proposal': {
    emoji: '💌',
    name: 'Pedir Noviazgo',
    badge: 'Propuesta con Botones Interactivos',
    desc: 'Pregunta romántica "¿Quieres ser mi novia/o?" con botón interactivo "¡Sí, Acepto!" y confeti.',
    plans: {
      basic: [
        '💍 Pregunta interactiva con botón "¡Sí, Acepto! ❤️"',
        '💖 Lluvia de corazones y confeti al aceptar',
        '⏱️ Contador de tiempo de amor en vivo',
        '📸 Hasta 10 Fotos de sus salidas',
        '🎨 Tarjeta física con color personalizado'
      ],
      medium: [
        '💍 Pregunta interactiva con botón "¡Sí, Acepto! ❤️"',
        '🏃 Botón travieso "No" que se escapa si intentan tocarlo',
        '🎵 Canción romántica de fondo (YouTube)',
        '💌 Carta de declaración interactiva',
        '📸 Hasta 20 Fotos (6 estilos de galería)',
        '✨ Tarjeta con 145 personajes temáticos'
      ],
      premium: [
        '💍 Pregunta + Botón escapista + 🎵 Música + 💌 Carta',
        '📜 Certificado oficial de pareja listo para descargar',
        '✨ Línea de tiempo de cómo se conocieron con fotos',
        '📸 Hasta 35 Fotos en HD (combina 2 estilos)',
        '🔒 Mensaje confidencial con PIN secreto'
      ]
    }
  },
  'marriage-proposal': {
    emoji: '💍',
    name: 'Pedir Matrimonio',
    badge: 'Propuesta de Boda Solemne',
    desc: 'Pregunta de boda "¿Te quieres casar conmigo? 💍" con animación de anillo brillante.',
    plans: {
      basic: [
        '💍 Pregunta solemne "¿Te casas conmigo? 💍" con botón "¡Sí!"',
        '✨ Lluvia dorada de fuegos artificiales y confeti',
        '📸 Hasta 10 Fotos memorables',
        '🎨 Tarjeta física con color personalizado'
      ],
      medium: [
        '💍 Pregunta de propuesta con botón "¡Sí, Acepto!"',
        '🏃 Botón travieso "No" que se escapa por la pantalla',
        '🎵 Música solemne y romántica de fondo',
        '💌 Carta de amor para toda la vida',
        '📸 Hasta 20 Fotos + Tarjeta con 145 personajes'
      ],
      premium: [
        '💍 Pregunta + Botón escapista + Música + Carta',
        '💎 Caja de anillo 3D animada que se abre al tocarla',
        '📜 Certificado oficial de compromiso descargable',
        '📸 Hasta 35 Fotos + Video de su historia de amor'
      ]
    }
  },
  pregnancy: {
    emoji: '👶',
    name: 'Anunciar Embarazo',
    badge: 'Tarjeta Rasca y Gana Digital',
    desc: 'Tarjeta dorada interactiva para raspar con el dedo y revelar la ecografía y fecha del bebé.',
    plans: {
      basic: [
        '🍼 Tarjeta "Rasca y Gana" digital (raspar para revelar ecografía)',
        '✨ Anuncio de la fecha estimada de llegada del bebé',
        '📸 Hasta 10 Fotos de la familia y test',
        '🎨 Tarjeta física personalizada con color a elección'
      ],
      medium: [
        '🍼 Tarjeta Rasca y Gana interactiva',
        '📊 Encuesta familiar en vivo: ¿Crees que es Niño 💙 o Niña 💖?',
        '🎵 Música tierna y emotiva de fondo',
        '📸 Hasta 20 Fotos de la dulce espera',
        '✨ Tarjeta física con personajes (Disney, etc.)'
      ],
      premium: [
        '🍼 Rasca y Gana + 📊 Encuesta familiar + 🎵 Música',
        '👣 Contador de semanas al parto con tamaño del bebé',
        '🎬 Video de la reacción de los padres',
        '📸 Hasta 35 Fotos de recuerdos familiares'
      ]
    }
  },
  surprise: {
    emoji: '🎁',
    name: 'Regalo Sorpresa',
    badge: 'Caja de Regalo 3D que se Abre',
    desc: 'Caja con moño que tiembla y se abre al tocarla revelando un Ticket Dorado sorpresa.',
    plans: {
      basic: [
        '🎁 Caja de regalo 3D animada que tiembla y se abre al tocar',
        '🎟️ Mensaje con el regalo o sorpresa revelada',
        '📸 Hasta 10 Fotos de pistas o recuerdos',
        '🎨 Tarjeta física con color personalizado'
      ],
      medium: [
        '🎁 Caja de regalo 3D que se abre con destellos',
        '🎟️ Ticket Dorado VIP personalizado con código de barras',
        '🎵 Música de fondo misteriosa o festiva',
        '📸 Hasta 20 Fotos + Tarjeta con personajes'
      ],
      premium: [
        '🎁 Caja + Ticket Dorado VIP + 🎵 Música',
        '📍 Mapa interactivo con la ubicación secreta de la sorpresa',
        '🔒 Rincón con PIN secreto para pistas adicionales',
        '📸 Hasta 35 Fotos en HD'
      ]
    }
  },
  'love-letter': {
    emoji: '📜',
    name: 'Carta de Amor',
    badge: 'Sobre con Sello de Cera',
    desc: 'Sobre vintage que se rompe al tocarlo y despliega la carta en formato pergamino antiguo.',
    plans: {
      basic: [
        '💌 Sobre vintage con sello de cera que se abre al tocar',
        '📜 Despliegue de la carta en formato pergamino elegante',
        '📸 Hasta 10 Fotos especiales',
        '🎨 Tarjeta física con color personalizado'
      ],
      medium: [
        '💌 Sobre con sello de cera + Pergamino',
        '🖋️ Efecto de escritura en vivo (las letras se van escribiendo)',
        '🎵 Música acústica de piano/guitarra de fondo',
        '📸 Hasta 20 Fotos + Tarjeta con 145 personajes'
      ],
      premium: [
        '💌 Sobre + Pergamino + Escritura en vivo + Música',
        '🔒 Rincón secreto con PIN para una confesión oculta',
        '✨ Línea de tiempo de los capítulos de su amor',
        '📸 Hasta 35 Fotos en HD'
      ]
    }
  },
  anniversary: {
    emoji: '❤️',
    name: 'Aniversario',
    badge: 'Contador de Amor & Corazones',
    desc: 'Contador de tiempo en vivo (años, días y segundos) con lluvia de corazones palpitantes.',
    plans: {
      basic: [
        '⏱️ Contador de amor en tiempo real (años, días, segundos)',
        '💖 Dedicatoria final con corazón palpitante',
        '📸 Hasta 10 Fotos en Polaroid y Collage',
        '🎨 Tarjeta física con color personalizado'
      ],
      medium: [
        '⏱️ Contador de amor en vivo + Corazones',
        '🔢 Estadísticas divertidas (horas juntos, cafés compartidos)',
        '🎵 Canción especial de la pareja de fondo (YouTube)',
        '💌 Carta de aniversario interactiva',
        '📸 Hasta 20 Fotos + Tarjeta con 145 personajes'
      ],
      premium: [
        '⏱️ Contador + Estadísticas + 🎵 Música + 💌 Carta',
        '✨ Línea de tiempo de hitos con fotos y fechas',
        '📍 Mapa interactivo del lugar donde se conocieron',
        '📸 Hasta 35 Fotos (combina 2 estilos juntos)'
      ]
    }
  },
  valentines: {
    emoji: '🌹',
    name: 'San Valentín',
    badge: 'Edición Especial de Enamorados',
    desc: 'Lluvia de rosas y corazones flotantes con contador romántico y dedicatoria.',
    plans: {
      basic: [
        '🌹 Lluvia de corazones y rosas flotantes',
        '⏱️ Contador de tiempo de novios en vivo',
        '📸 Hasta 10 Fotos románticas',
        '🎨 Tarjeta física con color personalizado'
      ],
      medium: [
        '🌹 Lluvia de rosas + Contador de amor',
        '🎵 Canción romántica de San Valentín de fondo',
        '💌 Carta de amor apasionada',
        '📸 Hasta 20 Fotos + Tarjeta con 145 personajes'
      ],
      premium: [
        '🌹 Todo lo de San Valentín + 🎵 Música + 💌 Carta',
        '🎁 Caja sorpresa interactiva con cupón de cena',
        '✨ Línea de tiempo con sus fotos más hermosas',
        '📸 Hasta 35 Fotos en HD'
      ]
    }
  },
  special: {
    emoji: '⭐',
    name: 'Felicitación Especial',
    badge: 'Fuegos Artificiales & Celebración',
    desc: 'Efecto de fuegos artificiales digitales para felicitar por un logro, titulación o graduación.',
    plans: {
      basic: [
        '🎆 Lluvia de fuegos artificiales dorados digitales',
        '🏆 Mensaje de orgullo y felicitaciones',
        '📸 Hasta 10 Fotos de logros y recuerdos',
        '🎨 Tarjeta física con color personalizado'
      ],
      medium: [
        '🎆 Fuegos artificiales + Mensaje especial',
        '🎵 Música de celebración o triunfo de fondo',
        '📜 Diploma digital de honor interactivo',
        '📸 Hasta 20 Fotos + Tarjeta con 145 personajes'
      ],
      premium: [
        '🎆 Fuegos artificiales + Música + Diploma',
        '🎬 Video de saludos de amigos y familiares',
        '✨ Línea de tiempo del camino al éxito',
        '📸 Hasta 35 Fotos en HD'
      ]
    }
  },
  gratitude: {
    emoji: '🙏',
    name: 'Agradecimiento',
    badge: 'Agradecimiento Cálido',
    desc: 'Diseño sereno y emotivo centrado en palabras de gratitud y aprecio.',
    plans: {
      basic: [
        '🌟 Mensaje emotivo de gratitud sincera',
        '📸 Hasta 10 Fotos de momentos compartidos',
        '🎨 Tarjeta física personalizada'
      ],
      medium: [
        '🌟 Mensaje de gratitud + 🎵 Música relajante de fondo',
        '💌 Carta de agradecimiento extendida',
        '📸 Hasta 20 Fotos + Tarjeta con personajes'
      ],
      premium: [
        '🌟 Carta de gratitud + 🎵 Música + 🎬 Video dedicado',
        '✨ Línea de tiempo de momentos de apoyo mutuo',
        '📸 Hasta 35 Fotos en HD'
      ]
    }
  },
  reconciliation: {
    emoji: '🕊️',
    name: 'Reconciliación',
    badge: 'Hacer las Paces 🤝',
    desc: 'Mensaje reconfortante para reencontrarse, perdonar y abrazar los buenos momentos.',
    plans: {
      basic: [
        '🕊️ Mensaje sincero de disculpas y reencuentro',
        '🤝 Botón interactivo "¿Hacemos las paces? ❤️"',
        '📸 Hasta 10 Fotos de sus mejores recuerdos',
        '🎨 Tarjeta física personalizada'
      ],
      medium: [
        '🕊️ Mensaje + Botón "¿Hacemos las paces?"',
        '🎵 Canción suave y reconfortante de fondo',
        '💌 Carta abierta del corazón',
        '📸 Hasta 20 Fotos + Tarjeta con personajes'
      ],
      premium: [
        '🕊️ Todo lo anterior + 🎵 Música + 💌 Carta',
        '🔒 Rincón con PIN secreto con promesa de futuro',
        '📸 Hasta 35 Fotos en HD'
      ]
    }
  },
};

export default function Step1Tematica({
  themes,
  selectedTheme,
  setSelectedTheme,
}: Step1TematicaProps) {
  return (
    <div className="space-y-6 animate-fade-in text-left">
      <div className="border-b border-rose-100 pb-3">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span>✨</span>
          <span>1. ¿Qué vamos a Celebrar Hoy?</span>
        </h2>
        <p className="text-xs text-gray-500 font-light mt-1">
          Elige el motivo de tu regalo. Cada temática incluye una <strong>interacción real</strong> (soplar velas, rascar tarjeta, abrir caja de regalo o propuesta) que tu persona especial vivirá al escanear el QR.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {themes.map((t) => {
          const isSelected = selectedTheme === t.id;
          const info = THEME_HIGHLIGHTS[t.id] || { emoji: '✨', name: t.name, badge: 'Interacción Especial', desc: t.description };

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
                    <h3 className="font-bold text-xs sm:text-sm text-gray-900">{info.name || t.name}</h3>
                    <span className="inline-block px-2 py-0.5 bg-rose-100/70 text-[#a21232] text-[9px] font-bold rounded-md mt-0.5">
                      ⚡ {info.badge}
                    </span>
                  </div>
                </div>

                <p className="text-[10px] text-gray-500 font-light leading-relaxed pt-1">
                  {info.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
