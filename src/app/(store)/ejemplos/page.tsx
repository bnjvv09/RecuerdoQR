'use client';

import Link from 'next/link';
import { Heart, Smartphone, Sparkles, ArrowRight, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EjemplosPage() {
  const examples = [
    {
      slug: 'ejemplo-aniversario',
      title: 'Aniversario de María & Carlos',
      emoji: '❤️',
      themeName: 'Aniversario',
      partner: 'María',
      creator: 'Carlos',
      date: '14 de Abril de 2020',
      interaction: 'Contador de Amor en Vivo & Lluvia de Corazones',
      features: ['Contador de Tiempo en Vivo', 'Lluvia de Corazones Palpitantes', 'Música Romántica', 'Línea de Tiempo'],
      bg: 'from-rose-600 to-pink-600',
      description: 'Una experiencia emotiva que calcula en tiempo real los años, meses, días y segundos que llevan juntos con música de fondo.'
    },
    {
      slug: 'ejemplo-cumpleanos',
      title: 'Cumpleaños de Valentina',
      emoji: '🎂',
      themeName: 'Cumpleaños',
      partner: 'Valentina',
      creator: 'Mateo',
      date: '24 de Septiembre',
      interaction: 'Torta con Velas para Soplar & Globos con Sorpresas',
      features: ['Torta Virtual Interactiva', 'Velas para Soplar con Deseo', 'Globos para Reventar', 'Lluvia de Confeti'],
      bg: 'from-pink-500 to-rose-500',
      description: 'Celebra su cumpleaños con una torta interactiva donde puede pedir un deseo, soplar las velas y reventar globos con mensajes.'
    },
    {
      slug: 'ejemplo-noviazgo',
      title: 'Propuesta para Camila',
      emoji: '💌',
      themeName: 'Pedir Noviazgo',
      partner: 'Camila',
      creator: 'Sebastián',
      date: '14 de Febrero de 2024',
      interaction: 'Pregunta con Botón Travieso "No" y "¡Sí, Acepto!"',
      features: ['Botón Travieso que se Escapa', 'Certificado Oficial de Noviazgo', 'Confeti Festivo', 'Dedicatoria'],
      bg: 'from-rose-500 to-purple-600',
      description: 'La forma más original de pedir pololeo o noviazgo. Incluye un botón "No" que huye al intentar presionarlo y diploma oficial al aceptar.'
    },
    {
      slug: 'ejemplo-matrimonio',
      title: 'Propuesta de Boda de Daniela & Nicolás',
      emoji: '💍',
      themeName: 'Pedir Matrimonio',
      partner: 'Daniela',
      creator: 'Nicolás',
      date: '20 de Noviembre de 2019',
      interaction: 'Caja de Anillo 3D de Terciopelo con Pregunta Solemne',
      features: ['Caja de Anillo que se Abre', 'Pregunta Solemne de Boda', 'Música de Gala', 'Álbum Digital'],
      bg: 'from-amber-600 to-rose-700',
      description: 'Una propuesta elegante e inolvidable con tonos dorados, caja de anillo 3D interactiva y música solemne para dar el gran sí.'
    },
    {
      slug: 'ejemplo-embarazo',
      title: '¡Vamos a Ser Papás!',
      emoji: '👶',
      themeName: 'Anunciar Embarazo',
      partner: 'Familia Querida',
      creator: 'Mamá & Papá',
      date: 'Noviembre de 2026',
      interaction: 'Tarjeta "Raspa y Gana" Digital para Revelar Ecografía',
      features: ['Tarjeta Raspa y Gana con el Dedo', 'Ecografía Oculta', 'Encuesta de Género', 'Fecha Estimada'],
      bg: 'from-cyan-600 to-teal-500',
      description: 'Anuncia la llegada del nuevo integrante de la familia con una tarjeta interactiva para rascar y revelar la ecografía del bebé.'
    },
    {
      slug: 'ejemplo-sorpresa',
      title: 'Regalo Sorpresa para Martina',
      emoji: '🎁',
      themeName: 'Regalo Sorpresa',
      partner: 'Martina',
      creator: 'Joaquín',
      date: '10 de Agosto de 2023',
      interaction: 'Caja de Regalo 3D que Tiembla y Despliega Ticket Dorado',
      features: ['Caja de Regalo 3D Interactiva', 'Ticket Dorado Revelable', 'Código de Regalo', 'Galería Collage'],
      bg: 'from-indigo-600 to-purple-600',
      description: 'Entrega un viaje, una cena o cualquier sorpresa dentro de una caja de regalo animada que se abre al tocarla con un estallido de confeti.'
    },
    {
      slug: 'ejemplo-carta',
      title: 'Carta de Amor para Elena',
      emoji: '📜',
      themeName: 'Carta de Amor',
      partner: 'Elena',
      creator: 'Gabriel',
      date: '03 de Junio de 2020',
      interaction: 'Sobre Vintage con Sello de Cera que se Rompe al Tocar',
      features: ['Sello de Cera Realista', 'Pergamino Desplegable', 'Tipografía Manuscrita', 'Fotos Vintage'],
      bg: 'from-amber-700 to-yellow-800',
      description: 'Formato pergamino clásico con un sello de cera que se quiebra al tocarlo, revelando una carta de amor profunda y emotiva.'
    },
    {
      slug: 'ejemplo-declaracion',
      title: 'Declaración de Sentimientos para Isidora',
      emoji: '💖',
      themeName: 'Declaración de Amor',
      partner: 'Isidora',
      creator: 'Tomás',
      date: '12 de Mayo de 2024',
      interaction: 'Corazón de Cristal que se Ilumina Revelando Confesión',
      features: ['Corazón de Cristal con Aura Neón', 'Confesión Secreta', 'Música Acústica', 'Destellos'],
      bg: 'from-pink-600 to-rose-700',
      description: 'Diseño nocturno y elegante para confesar sentimientos con un corazón de cristal resplandeciente que revela tu mensaje secreto.'
    },
    {
      slug: 'ejemplo-san-valentin',
      title: 'Edición Especial San Valentín',
      emoji: '🌹',
      themeName: 'San Valentín',
      partner: 'Francisca',
      creator: 'Cristóbal',
      date: '14 de Febrero',
      interaction: 'Caja de Bombones Interactiva con Vale de Amor',
      features: ['Caja de Bombones que se Abre', 'Vale Romántico Canjeable', 'Lluvia de Pétalos de Rosas', 'Contador'],
      bg: 'from-rose-700 to-red-600',
      description: 'Edición especial de enamorados con lluvia de rosas, caja de bombones interactiva y un cupón romántico canjeable.'
    },
    {
      slug: 'ejemplo-felicitacion',
      title: 'Graduación de Benjamín',
      emoji: '⭐',
      themeName: 'Felicitación Especial',
      partner: 'Benjamín',
      creator: 'Familia Orgullosa',
      date: '15 de Enero de 2024',
      interaction: 'Fuegos Artificiales Digitales & Diploma de Honor',
      features: ['Botón de Fuegos Artificiales', 'Trofeo Oficial de Logro', 'Diploma de Honor', 'Música Alegre'],
      bg: 'from-amber-500 to-orange-600',
      description: 'Felicita por una titulación, graduación o logro especial con fuegos artificiales digitales y un trofeo de reconocimiento.'
    },
    {
      slug: 'ejemplo-agradecimiento',
      title: 'Agradecimiento Infinito a Papás',
      emoji: '🙏',
      themeName: 'Agradecimiento',
      partner: 'Papás',
      creator: 'Hijo Agradecido',
      date: 'Para Siempre',
      interaction: 'Constelación de Estrellas con Motivos de Gratitud',
      features: ['Estrellas Interactivas', 'Motivos Revelables', 'Música Serena', 'Galería de Recuerdos'],
      bg: 'from-teal-600 to-emerald-700',
      description: 'Un homenaje cálido y sereno donde cada estrella en pantalla revela una razón especial por la cual estás agradecido.'
    },
    {
      slug: 'ejemplo-reconciliacion',
      title: 'Hagamos las Paces',
      emoji: '🕊️',
      themeName: 'Reconciliación',
      partner: 'Mi Amor',
      creator: 'De Corazón',
      date: '19 de Julio de 2022',
      interaction: 'Corazón Roto que se Une al Tocarlo & Mensaje de Paz',
      features: ['Corazón Roto que se Une', 'Mensaje de Reencuentro', 'Música Reconfortante', 'Fotos Felices'],
      bg: 'from-slate-600 to-zinc-700',
      description: 'Un mensaje reconfortante para limar asperezas, recordar los momentos felices y volver a abrazar a quien amas.'
    }
  ];

  return (
    <div className="py-12 sm:py-20 bg-gradient-to-b from-rose-50/20 via-white to-rose-50/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Header */}
        <div className="max-w-3xl mx-auto mb-12 sm:mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-100 text-[#a21232] text-xs font-semibold uppercase tracking-wider"
          >
            <Smartphone className="w-3.5 h-3.5" />
            Catálogo Completo de Demostraciones
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-3xl sm:text-5xl font-bold text-gray-900"
          >
            Ejemplos de Cada Temática
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 text-sm sm:text-base font-light max-w-2xl mx-auto"
          >
            Haz clic en cualquiera de nuestras <strong>12 temáticas reales</strong> para interactuar con la web exactamente como la verá tu persona especial en su teléfono al escanear el código QR.
          </motion.p>
        </div>

        {/* Ejemplos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {examples.map((example, idx) => (
            <motion.div
              key={example.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-3xl overflow-hidden border border-rose-100 shadow-md flex flex-col justify-between hover:shadow-xl transition-all duration-300 group"
            >
              {/* Preview banner simulating mobile header */}
              <div className={`h-36 bg-gradient-to-r ${example.bg} p-5 flex flex-col justify-between text-white relative overflow-hidden`}>
                <div className="absolute right-[-15px] bottom-[-15px] opacity-15 pointer-events-none">
                  <Heart className="w-32 h-32 fill-white" />
                </div>
                <div className="flex justify-between items-start z-10">
                  <span className="bg-white/25 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase flex items-center gap-1">
                    <span>{example.emoji}</span>
                    <span>{example.themeName}</span>
                  </span>
                  <span className="text-[11px] text-white/90 font-medium">{example.date}</span>
                </div>
                <div className="text-left z-10">
                  <p className="text-[10px] text-rose-100 font-medium">Para</p>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold truncate">{example.partner}</h3>
                </div>
              </div>

              {/* Description and Features */}
              <div className="p-5 sm:p-6 text-left flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-gray-900 leading-tight">
                      {example.title}
                    </h4>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-rose-50 text-[#a21232] text-[10px] font-bold rounded-md border border-rose-200/50">
                      ⚡ {example.interaction}
                    </span>
                  </div>

                  <p className="text-gray-600 text-xs font-light leading-relaxed">
                    {example.description}
                  </p>
                  
                  <div className="space-y-1.5 pt-1">
                    <h5 className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Incluye en la web</h5>
                    <div className="flex flex-wrap gap-1.5">
                      {example.features.map((feat, fIdx) => (
                        <span 
                          key={fIdx} 
                          className="bg-gray-50 text-gray-700 text-[10px] font-medium px-2 py-0.5 rounded-md border border-gray-200"
                        >
                          ✓ {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
                  <Link
                    href={`/amor/${example.slug}`}
                    target="_blank"
                    prefetch={false}
                    className="w-full py-2.5 bg-gradient-to-r from-[#a21232] to-rose-700 hover:from-rose-800 hover:to-rose-900 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm group-hover:shadow-md cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Ver Demostración en Vivo</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>

                  <Link
                    href={`/personalizar?theme=${example.slug.replace('ejemplo-', '')}`}
                    className="text-center text-[11px] text-gray-500 hover:text-[#a21232] font-semibold py-1 transition"
                  >
                    Personalizar con esta temática →
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tip */}
        <div className="mt-12 sm:mt-16 p-4 bg-rose-50/60 rounded-2xl border border-rose-200 max-w-lg mx-auto text-xs text-gray-600 font-light text-center space-y-1">
          <p className="font-bold text-rose-900">💡 Tip de la Experiencia</p>
          <p>Al abrir cualquier ejemplo, toca el gran corazón palpitante 5 veces para activar la música de fondo y los efectos interactivos tal como lo vivirá tu persona especial.</p>
        </div>
      </div>
    </div>
  );
}
