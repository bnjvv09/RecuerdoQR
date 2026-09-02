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
  anniversary: {
    emoji: '❤️',
    name: 'Aniversario',
    badge: 'Contador de Amor & Corazones',
    desc: 'Contador de tiempo en vivo (años, días y segundos) con lluvia de corazones palpitantes.',
    plans: {
      basic: [
        '📸 Hasta 10 Fotos en Polaroid & Collage',
        '⏱️ Contador de Tiempo en Vivo (Años, meses y días juntos)',
        '💖 Portada Interactiva con corazón palpitante',
        '💌 Dedicatoria y Carta de amor personalizada',
        '🎨 Tarjeta de Regalo con Código QR (Diseño clásico listo para imprimir o enviar)',
        '📱 Código QR en Alta Calidad activo de por vida'
      ],
      medium: [
        '✓ Todo lo incluido en el Plan Básico',
        '📸 Hasta 20 Fotos en HD (6 estilos de galería a elección)',
        '🎵 Música Personalizada (Banda Sonora Oficial sin anuncios)',
        '🔢 Estadísticas de la Pareja (Besos, cafés y momentos juntos)',
        '💌 Carta de Aniversario Interactiva',
        '✨ Tarjeta de Regalo con Código QR (Catálogo de 145 Personajes para imprimir o regalar)'
      ],
      premium: [
        '✓ Todo lo incluido en el Plan Medio',
        '📸 Hasta 40 Fotos en HD (Combina 2 galerías distintas juntas)',
        '🎙️ Nota de Voz Real de WhatsApp (Grabada con micrófono en vivo)',
        '🎬 Video Dedicado en HD (Subida directa de video)',
        '⏳ Línea de Tiempo Histórica (Hitos con fotos y fechas especiales)',
        '📍 Mapa Interactivo del lugar donde se conocieron',
        '🔒 Rincón Secreto Protegido con PIN de 4 dígitos'
      ]
    }
  },
  birthday: {
    emoji: '🎂',
    name: 'Cumpleaños',
    badge: 'Torta & Velas para Soplar',
    desc: 'Torta interactiva con velas encendidas para pedir un deseo, soplar con animación y estallido de confeti.',
    plans: {
      basic: [
        '📸 Hasta 10 Fotos en Polaroid & Collage',
        '🎂 Torta virtual interactiva con velas encendidas para soplar',
        '🎉 Animación de confeti festivo y deseos',
        '💌 Dedicatoria de Cumpleaños personalizada',
        '🎨 Tarjeta de Regalo con Código QR (Diseño clásico listo para imprimir o enviar)',
        '📱 Código QR en Alta Calidad activo de por vida'
      ],
      medium: [
        '✓ Todo lo incluido en el Plan Básico',
        '📸 Hasta 20 Fotos en HD (6 estilos de galería a elección)',
        '🎵 Música Personalizada (Banda Sonora Oficial sin anuncios)',
        '🎈 Globos flotantes interactivos para reventar sorpresas',
        '💌 Carta de Felicitación Interactiva',
        '✨ Tarjeta de Regalo con Código QR (Catálogo de 145 Personajes para imprimir o regalar)'
      ],
      premium: [
        '✓ Todo lo incluido en el Plan Medio',
        '📸 Hasta 40 Fotos en HD (Combina 2 galerías distintas juntas)',
        '🎙️ Nota de Voz Real de WhatsApp con saludos y risas',
        '🎬 Video Dedicado en HD (Saludos en video de amigos/familia)',
        '⏳ Línea de Tiempo con fotos de su vida y mejores momentos',
        '📍 Mapa Interactivo de la fiesta o lugar especial',
        '🔒 Rincón Secreto Protegido con PIN de 4 dígitos'
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
        '📸 Hasta 10 Fotos de sus mejores salidas juntos',
        '💍 Pregunta interactiva con botón "¡Sí, Acepto! ❤️"',
        '💖 Lluvia de corazones y confeti al aceptar',
        '💌 Carta de Declaración Romántica personalizada',
        '🎨 Tarjeta de Regalo con Código QR (Diseño clásico listo para imprimir o enviar)',
        '📱 Código QR en Alta Calidad activo de por vida'
      ],
      medium: [
        '✓ Todo lo incluido en el Plan Básico',
        '📸 Hasta 20 Fotos en HD (6 estilos de galería a elección)',
        '🎵 Música Personalizada (Banda Sonora Oficial sin anuncios)',
        '🏃 Botón travieso "No" que se escapa al intentar tocarlo',
        '💌 Carta de Amor Interactiva',
        '✨ Tarjeta de Regalo con Código QR (Catálogo de 145 Personajes para imprimir o regalar)'
      ],
      premium: [
        '✓ Todo lo incluido en el Plan Medio',
        '📸 Hasta 40 Fotos en HD (Combina 2 galerías distintas juntas)',
        '🎙️ Nota de Voz Real de WhatsApp declarando tus sentimientos',
        '🎬 Video Dedicado en HD de su historia',
        '⏳ Línea de Tiempo Histórica de cómo se conocieron',
        '📜 Certificado oficial de noviazgo descargable',
        '🔒 Rincón Secreto Protegido con PIN de 4 dígitos'
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
        '📸 Hasta 10 Fotos de su historia de amor',
        '💍 Pregunta solemne "¿Te casas conmigo? 💍" con botón interactivo',
        '✨ Lluvia dorada de fuegos artificiales y confeti',
        '💌 Carta de Promesa de Amor para toda la vida',
        '🎨 Tarjeta de Regalo con Código QR (Diseño clásico listo para imprimir o enviar)',
        '📱 Código QR en Alta Calidad activo de por vida'
      ],
      medium: [
        '✓ Todo lo incluido en el Plan Básico',
        '📸 Hasta 20 Fotos en HD (6 estilos de galería a elección)',
        '🎵 Música Personalizada (Banda Sonora Oficial solemne)',
        '🏃 Botón travieso "No" que se escapa por la pantalla',
        '💌 Carta de Compromiso Interactiva',
        '✨ Tarjeta de Regalo con Código QR (Catálogo de 145 Personajes para imprimir o regalar)'
      ],
      premium: [
        '✓ Todo lo incluido en el Plan Medio',
        '📸 Hasta 40 Fotos en HD (Combina 2 galerías distintas juntas)',
        '🎙️ Nota de Voz Real de WhatsApp con tu propuesta grabada',
        '🎬 Video Dedicado en HD para la gran sorpresa',
        '💎 Caja de anillo 3D animada que se abre al tocarla',
        '⏳ Línea de Tiempo de todo su camino juntos hacia el altar',
        '🔒 Rincón Secreto Protegido con PIN de 4 dígitos'
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
        '📸 Hasta 10 Fotos de la dulce espera y familia',
        '🍼 Tarjeta "Rasca y Gana" digital para revelar la ecografía',
        '✨ Anuncio de la fecha estimada de llegada del bebé',
        '💌 Mensaje y dedicatoria emotiva para el futuro papá/abuelos',
        '🎨 Tarjeta de Regalo con Código QR (Diseño clásico listo para imprimir o enviar)',
        '📱 Código QR en Alta Calidad activo de por vida'
      ],
      medium: [
        '✓ Todo lo incluido en el Plan Básico',
        '📸 Hasta 20 Fotos en HD (6 estilos de galería a elección)',
        '🎵 Música Personalizada (Banda Sonora Oficial tierna)',
        '📊 Encuesta familiar en vivo: ¿Crees que es Niño 💙 o Niña 💖?',
        '💌 Carta Emotiva de Anuncio Interactiva',
        '✨ Tarjeta de Regalo con Código QR (Catálogo de 145 Personajes para imprimir o regalar)'
      ],
      premium: [
        '✓ Todo lo incluido en el Plan Medio',
        '📸 Hasta 40 Fotos en HD (Combina 2 galerías distintas juntas)',
        '🎙️ Nota de Voz Real de WhatsApp con los latidos o anuncio',
        '🎬 Video Dedicado en HD de la ecografía o reacción familiar',
        '👣 Contador de semanas al parto con tamaño del bebé',
        '⏳ Línea de Tiempo del crecimiento del embarazo',
        '🔒 Rincón Secreto Protegido con PIN de 4 dígitos'
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
        '📸 Hasta 10 Fotos de pistas y momentos especiales',
        '🎁 Caja de regalo 3D animada que tiembla y se abre al tocar',
        '🎟️ Mensaje con la sorpresa o regalo revelado',
        '💌 Carta y dedicatoria de sorpresa personalizada',
        '🎨 Tarjeta de Regalo con Código QR (Diseño clásico listo para imprimir o enviar)',
        '📱 Código QR en Alta Calidad activo de por vida'
      ],
      medium: [
        '✓ Todo lo incluido en el Plan Básico',
        '📸 Hasta 20 Fotos en HD (6 estilos de galería a elección)',
        '🎵 Música Personalizada (Banda Sonora Oficial sin anuncios)',
        '🎟️ Ticket Dorado VIP personalizado con código de barras',
        '💌 Carta de Sorpresa Interactiva',
        '✨ Tarjeta de Regalo con Código QR (Catálogo de 145 Personajes para imprimir o regalar)'
      ],
      premium: [
        '✓ Todo lo incluido en el Plan Medio',
        '📸 Hasta 40 Fotos en HD (Combina 2 galerías distintas juntas)',
        '🎙️ Nota de Voz Real de WhatsApp con pistas o saludo',
        '🎬 Video Dedicado en HD revelando la gran sorpresa',
        '📍 Mapa Interactivo con la ubicación secreta de la sorpresa',
        '⏳ Línea de Tiempo de recuerdos antes del gran día',
        '🔒 Rincón Secreto Protegido con PIN de 4 dígitos'
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
        '📸 Hasta 10 Fotos de sus momentos juntos',
        '💌 Sobre vintage con sello de cera que se abre al tocar',
        '📜 Despliegue de la carta en formato pergamino elegante',
        '💖 Dedicatoria profunda y mensaje del corazón',
        '🎨 Tarjeta de Regalo con Código QR (Diseño clásico listo para imprimir o enviar)',
        '📱 Código QR en Alta Calidad activo de por vida'
      ],
      medium: [
        '✓ Todo lo incluido en el Plan Básico',
        '📸 Hasta 20 Fotos en HD (6 estilos de galería a elección)',
        '🎵 Música Personalizada (Banda Sonora Oficial romántica)',
        '✨ Despliegue con tipografía caligráfica clásica',
        '💌 Carta de Amor Extensa Interactiva',
        '✨ Tarjeta de Regalo con Código QR (Catálogo de 145 Personajes para imprimir o regalar)'
      ],
      premium: [
        '✓ Todo lo incluido en el Plan Medio',
        '📸 Hasta 40 Fotos en HD (Combina 2 galerías distintas juntas)',
        '🎙️ Nota de Voz Real de WhatsApp leyendo tu carta con tu voz',
        '🎬 Video Dedicado en HD con dedicatoria especial',
        '⏳ Línea de Tiempo de todos los capítulos de su historia',
        '📍 Mapa Interactivo del lugar donde nació su amor',
        '🔒 Rincón Secreto Protegido con PIN de 4 dígitos'
      ]
    }
  },
  'love-confession': {
    emoji: '💖',
    name: 'Declaración de Amor',
    badge: 'Corazón de Cristal Interactivo',
    desc: 'Corazón de cristal resplandeciente que se ilumina y revela tu mensaje de confesión.',
    plans: {
      basic: [
        '📸 Hasta 10 Fotos de sus citas y momentos',
        '💖 Corazón de cristal interactivo que se ilumina al tocar',
        '✨ Efecto de destellos mágicos y lluvia de corazones',
        '💌 Mensaje de confesión de amor sincero',
        '🎨 Tarjeta de Regalo con Código QR (Diseño clásico listo para imprimir o enviar)',
        '📱 Código QR en Alta Calidad activo de por vida'
      ],
      medium: [
        '✓ Todo lo incluido en el Plan Básico',
        '📸 Hasta 20 Fotos en HD (6 estilos de galería a elección)',
        '🎵 Música Personalizada (Banda Sonora Oficial sin anuncios)',
        '🔢 Estadísticas de cuántos días llevo pensando en ti',
        '💌 Carta de Declaración Interactiva',
        '✨ Tarjeta de Regalo con Código QR (Catálogo de 145 Personajes para imprimir o regalar)'
      ],
      premium: [
        '✓ Todo lo incluido en el Plan Medio',
        '📸 Hasta 40 Fotos en HD (Combina 2 galerías distintas juntas)',
        '🎙️ Nota de Voz Real de WhatsApp confesando lo que sientes',
        '🎬 Video Dedicado en HD especial para ella/él',
        '⏳ Línea de Tiempo de cómo empezó a nacer este sentimiento',
        '📍 Mapa Interactivo de aquel lugar donde todo cambió',
        '🔒 Rincón Secreto Protegido con PIN de 4 dígitos'
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
        '📸 Hasta 10 Fotos románticas de la pareja',
        '🌹 Lluvia de pétalos de rosas y corazones flotantes',
        '⏱️ Contador de tiempo de enamorados en vivo',
        '💌 Carta de San Valentín personalizada',
        '🎨 Tarjeta de Regalo con Código QR (Diseño clásico listo para imprimir o enviar)',
        '📱 Código QR en Alta Calidad activo de por vida'
      ],
      medium: [
        '✓ Todo lo incluido en el Plan Básico',
        '📸 Hasta 20 Fotos en HD (6 estilos de galería a elección)',
        '🎵 Música Personalizada (Banda Sonora Oficial de San Valentín)',
        '🍫 Caja de bombones interactiva con vales sorpresa',
        '💌 Carta de Amor Apasionada Interactiva',
        '✨ Tarjeta de Regalo con Código QR (Catálogo de 145 Personajes para imprimir o regalar)'
      ],
      premium: [
        '✓ Todo lo incluido en el Plan Medio',
        '📸 Hasta 40 Fotos en HD (Combina 2 galerías distintas juntas)',
        '🎙️ Nota de Voz Real de WhatsApp de San Valentín',
        '🎬 Video Dedicado en HD de su amor',
        '⏳ Línea de Tiempo con sus momentos más bellos',
        '🎁 Vale interactivo por una cena o escapada romántica',
        '🔒 Rincón Secreto Protegido con PIN de 4 dígitos'
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
        '📸 Hasta 10 Fotos del camino y logros',
        '🎆 Show de fuegos artificiales interactivos en pantalla',
        '🏆 Mensaje de felicitación y orgullo por la meta cumplida',
        '💌 Dedicatoria personalizada de reconocimiento',
        '🎨 Tarjeta de Regalo con Código QR (Diseño clásico listo para imprimir o enviar)',
        '📱 Código QR en Alta Calidad activo de por vida'
      ],
      medium: [
        '✓ Todo lo incluido en el Plan Básico',
        '📸 Hasta 20 Fotos en HD (6 estilos de galería a elección)',
        '🎵 Música Personalizada (Banda Sonora Oficial triunfal)',
        '🏆 Trofeo o Medalla de Oro 3D interactiva que gira',
        '💌 Carta de Orgullo y Admiración Interactiva',
        '✨ Tarjeta de Regalo con Código QR (Catálogo de 145 Personajes para imprimir o regalar)'
      ],
      premium: [
        '✓ Todo lo incluido en el Plan Medio',
        '📸 Hasta 40 Fotos en HD (Combina 2 galerías distintas juntas)',
        '🎙️ Nota de Voz Real de WhatsApp con felicitaciones',
        '🎬 Video Dedicado en HD con saludos de orgullo',
        '⏳ Línea de Tiempo de todo el esfuerzo hasta la meta',
        '📜 Diploma digital de honor descargable',
        '🔒 Rincón Secreto Protegido con PIN de 4 dígitos'
      ]
    }
  },
  gratitude: {
    emoji: '🙏',
    name: 'Agradecimiento',
    badge: 'Constelación de Estrellas',
    desc: 'Un cielo nocturno interactivo donde cada estrella representa un motivo por el que estás agradecido.',
    plans: {
      basic: [
        '📸 Hasta 10 Fotos de recuerdos juntos',
        '🌟 Constelación interactiva de estrellas de gratitud',
        '✨ Mensaje sincero de "Gracias por estar en mi vida"',
        '💌 Dedicatoria de agradecimiento personalizada',
        '🎨 Tarjeta de Regalo con Código QR (Diseño clásico listo para imprimir o enviar)',
        '📱 Código QR en Alta Calidad activo de por vida'
      ],
      medium: [
        '✓ Todo lo incluido en el Plan Básico',
        '📸 Hasta 20 Fotos en HD (6 estilos de galería a elección)',
        '🎵 Música Personalizada (Banda Sonora Oficial emotiva)',
        '✨ 3 Estrellas interactivas para tocar y descubrir agradecimientos',
        '💌 Carta de Gratitud Profunda Interactiva',
        '✨ Tarjeta de Regalo con Código QR (Catálogo de 145 Personajes para imprimir o regalar)'
      ],
      premium: [
        '✓ Todo lo incluido en el Plan Medio',
        '📸 Hasta 40 Fotos en HD (Combina 2 galerías distintas juntas)',
        '🎙️ Nota de Voz Real de WhatsApp dando las gracias de corazón',
        '🎬 Video Dedicado en HD con dedicatoria especial',
        '⏳ Línea de Tiempo de los momentos en que estuvo a tu lado',
        '📍 Mapa Interactivo de aquel lugar inolvidable',
        '🔒 Rincón Secreto Protegido con PIN de 4 dígitos'
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
        '📸 Hasta 10 Fotos de sus mejores recuerdos juntos',
        '🕊️ Mensaje sincero de disculpas y reencuentro',
        '🤝 Botón interactivo "¿Hacemos las paces? ❤️"',
        '💌 Dedicatoria abierta de reconciliación',
        '🎨 Tarjeta de Regalo con Código QR (Diseño clásico listo para imprimir o enviar)',
        '📱 Código QR en Alta Calidad activo de por vida'
      ],
      medium: [
        '✓ Todo lo incluido en el Plan Básico',
        '📸 Hasta 20 Fotos en HD (6 estilos de galería a elección)',
        '🎵 Música Personalizada (Banda Sonora Oficial suave)',
        '🤝 Mensaje y botón interactivo de perdón',
        '💌 Carta del Corazón Interactiva',
        '✨ Tarjeta de Regalo con Código QR (Catálogo de 145 Personajes para imprimir o regalar)'
      ],
      premium: [
        '✓ Todo lo incluido en el Plan Medio',
        '📸 Hasta 40 Fotos en HD (Combina 2 galerías distintas juntas)',
        '🎙️ Nota de Voz Real de WhatsApp con tu mensaje de perdón',
        '🎬 Video Dedicado en HD recordando por qué vale la pena luchar',
        '⏳ Línea de Tiempo de los momentos más felices juntos',
        '🔒 Rincón Secreto Protegido con PIN de 4 dígitos y promesa de futuro'
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
