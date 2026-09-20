'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { obtenerProductos, Producto, obtenerTemas, Tema, obtenerConteoExperienciasCreadas, obtenerPromocionesPlan, MapaPromocionesPlanes } from '@/lib/bd';
import { 
  Heart, 
  QrCode, 
  Sparkles, 
  Camera, 
  Music, 
  Calendar, 
  Clock, 
  ChevronDown, 
  Gift, 
  ArrowRight,
  CheckCircle,
  Smartphone,
  Pencil,
  Zap,
  Star,
  CreditCard,
  Send,
  Check,
  CheckCircle2,
  Image as ImageIcon,
  Cake,
  Mail,
  Baby,
  Smile,
  PartyPopper,
  Flame,
  Gem,
  HeartHandshake,
  Quote
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LandingPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Producto[]>([]);
  const [themes, setThemes] = useState<Tema[]>([]);
  const [planPromos, setPlanPromos] = useState<MapaPromocionesPlanes>({});
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [experiencesCount, setExperiencesCount] = useState<number>(10);
  const [customerReviews, setCustomerReviews] = useState<any[]>([]);

  useEffect(() => {
    obtenerProductos().then(setProducts);
    obtenerTemas().then(data => setThemes(data.filter(t => t.is_active)));
    obtenerConteoExperienciasCreadas().then(setExperiencesCount).catch(() => setExperiencesCount(10));
    obtenerPromocionesPlan().then(setPlanPromos).catch(() => {});

    try {
      const stored = JSON.parse(localStorage.getItem('recuerdo_customer_reviews') || '[]');
      if (stored && Array.isArray(stored) && stored.length > 0) {
        setCustomerReviews(stored.map((s: any) => ({
          name: s.partnerName ? `Para ${s.partnerName}` : 'Cliente RecuerdoQR',
          date: 'Reciente',
          stars: s.rating || 5,
          comment: s.comment,
          tag: 'Opinión Verificada'
        })));
      }
    } catch {
      // Ignore
    }
  }, []);

  const steps = [
    {
      icon: <Gift className="w-5 h-5 text-[#a21232]" />,
      title: 'Elige tu plan digital',
      desc: 'Selecciona la opción con las funciones y fotos que más te gusten.'
    },
    {
      icon: <Pencil className="w-5 h-5 text-[#a21232]" />,
      title: 'Personaliza tu web',
      desc: 'Agrega fotos, dedicatoria, fecha de aniversario y canción especial.'
    },
    {
      icon: <CreditCard className="w-5 h-5 text-[#a21232]" />,
      title: 'Pago seguro en línea',
      desc: 'Pago 100% protegido con Mercado Pago (Débito, Crédito, Webpay).'
    },
    {
      icon: <Zap className="w-5 h-5 text-[#a21232]" />,
      title: 'Recibe tu QR al instante',
      desc: 'Tu página web queda activa de inmediato para compartirla por link o QR.'
    }
  ];

  const defaultReviews = [
    {
      name: 'Sofía & Lucas',
      date: 'Hace 3 días',
      stars: 5,
      comment: '¡Increíble detalle para nuestro aniversario! A mi novio le fascinó escanear el código QR y que comenzara a sonar nuestra canción favorita con todas las fotos.',
      tag: 'Plan Medio'
    },
    {
      name: 'Felipe & Andrea',
      date: 'Hace 1 semana',
      stars: 5,
      comment: 'Se lo envié por WhatsApp justo a las 12:00 de la noche de sorpresa. Se emocionó muchísimo con la carta y ver los días exactos que llevamos juntos.',
      tag: 'Plan Máximo'
    },
    {
      name: 'Valentina & Tomás',
      date: 'Hace 2 semanas',
      stars: 5,
      comment: 'Súper fácil e intuitivo de personalizar. La página web se ve hermosa en el celular y me encanta saber que es un recuerdo digital permanente.',
      tag: 'Plan Básico'
    },
    {
      name: 'Matías & Camila',
      date: 'Hace 2 semanas',
      stars: 5,
      comment: 'La calidad de las fotos y los efectos interactivos están a otro nivel. Es un regalo mucho más original y emotivo que algo tradicional.',
      tag: 'Plan Medio'
    },
    {
      name: 'Javiera & Ignacio',
      date: 'Hace 3 semanas',
      stars: 5,
      comment: 'Excelente servicio. El código QR se generó al instante y la música de fondo sonó perfecta en cuanto abrimos el enlace. 100% recomendado.',
      tag: 'Plan Máximo'
    }
  ];

  const allReviews = [...customerReviews, ...defaultReviews];

  const faqs = [
    {
      q: '¿Qué es RecuerdoQR?',
      a: 'Es una plataforma que te permite inmortalizar tu historia de amor en una página web personalizada e interactiva con fotos, música de fondo, contador de tiempo en vivo y dedicatoria especial, accesible para siempre mediante un enlace web y código QR.'
    },
    {
      q: '¿Cómo se entrega mi experiencia?',
      a: 'La entrega es 100% digital e inmediata. Al completar tu personalización y pago, obtienes al instante el enlace exclusivo a tu página web de amor y tu código QR en alta resolución listo para enviarlo por WhatsApp o descargarlo.'
    },
    {
      q: '¿Puedo modificar la información o cambiar las fotos después de comprar?',
      a: '¡Sí! Al comprar, tu experiencia queda vinculada y puedes contactar a nuestro equipo de soporte para actualizar fotos, dedicatorias o canciones cuando lo necesites.'
    },
    {
      q: '¿Cómo se reproduce la música en la experiencia?',
      a: 'Puedes agregar el enlace de cualquier canción de YouTube. Cuando tu pareja abra la página y presione el botón inicial de bienvenida, la música comenzará a sonar de fondo automáticamente en su teléfono.'
    },
    {
      q: '¿Cuánto tiempo estará activa la página web?',
      a: 'Vuestra página estará activa de forma permanente de por vida. Podrán volver a abrir el enlace o escanear el código QR en cada aniversario para recordar sus momentos más bellos.'
    }
  ];

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="overflow-hidden bg-[#fffcfd]">
      
      {/* Hero Section */}
      <section className="relative pt-10 pb-16 md:pt-16 md:pb-24 bg-gradient-to-b from-rose-50/50 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-100/50 text-[#a21232] text-[10px] font-bold tracking-widest uppercase"
              >
                <Sparkles className="w-3 h-3 fill-current" />
                Experiencias que enamoran
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="font-serif text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-[1.12]"
              >
                Convierte tus recuerdos en una experiencia que <br /> <span className="text-[#a21232] relative inline-block">nunca olvidará ❤️</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed"
              >
                Crea una página personalizada con fotos, música, carta y contador de amor. Recibe tu enlace web exclusivo y código QR digital al instante.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-2"
              >
                <Link
                  href="/personalizar"
                  prefetch={true}
                  className="px-8 py-4 bg-[#a21232] hover:bg-[#880e28] text-white font-bold rounded-full transition shadow-lg shadow-rose-900/10 flex items-center justify-center gap-2 text-sm"
                >
                  Crear mi experiencia ❤️
                </Link>
                <Link
                  href="/ejemplos"
                  prefetch={true}
                  className="px-8 py-4 bg-white hover:bg-rose-50/20 text-[#a21232] border border-rose-200 font-bold rounded-full transition text-sm flex items-center justify-center"
                >
                  Ver ejemplos
                </Link>
              </motion.div>
            </div>

            {/* Right Graphics Mockups (Digital Card + Phone Frame + Roses) */}
            <div className="lg:col-span-5 relative flex justify-center items-center py-6">
              
              {/* Styled Digital QR Card Mockup */}
              <motion.div
                initial={{ opacity: 0, x: -30, rotate: -8 }}
                animate={{ opacity: 1, x: -40, rotate: -4 }}
                transition={{ duration: 0.8 }}
                className="relative w-52 aspect-[0.7/1] bg-rose-50 border border-rose-100 rounded-3xl shadow-xl p-5 flex flex-col justify-between z-10"
              >
                <div className="flex flex-col items-center text-center space-y-2 mt-2">
                  <div className="w-7 h-7 bg-rose-500 rounded-full flex items-center justify-center text-white shrink-0">
                    <Heart className="w-3.5 h-3.5 fill-current" />
                  </div>
                  <h4 className="font-serif font-bold text-gray-800 text-sm leading-snug">
                    Para el amor<br />de mi vida
                  </h4>
                </div>

                <div className="flex flex-col items-center gap-3 bg-white p-3 rounded-2xl border border-rose-100/40">
                  <div className="w-20 h-20 bg-gray-50 flex items-center justify-center rounded-lg border border-gray-150 p-1">
                    <QrCode className="w-full h-full text-gray-800" />
                  </div>
                </div>
              </motion.div>

              {/* Phone Mockup Screen */}
              <motion.div
                initial={{ opacity: 0, x: 30, rotate: 8 }}
                animate={{ opacity: 1, x: 20, rotate: 4 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="relative w-[210px] aspect-[9/18.5] bg-gray-900 rounded-[36px] p-2 shadow-2xl border-[6px] border-gray-800 z-20 overflow-hidden"
              >
                <div className="absolute top-0 inset-x-0 h-4 bg-gray-900 rounded-b-xl z-25 flex justify-center">
                  <div className="w-12 h-2.5 bg-black rounded-b-lg flex items-center justify-center">
                    <div className="w-4 h-0.5 bg-gray-800 rounded-full mb-0.5"></div>
                  </div>
                </div>

                <div className="w-full h-full bg-[#fffafb] rounded-[28px] overflow-hidden flex flex-col pt-5 pb-3 px-3 justify-between relative select-none">
                  {/* Music header */}
                  <div className="flex items-center justify-between border-b border-rose-50 pb-1 text-[8px] text-gray-400 font-medium">
                    <span>Perfect (Ed Sheeran)</span>
                    <Music className="w-3 h-3 text-rose-500 animate-spin" style={{ animationDuration: '4s' }} />
                  </div>

                  {/* Main view mock */}
                  <div className="flex-1 flex flex-col items-center justify-center text-center space-y-2.5 my-2">
                    <Heart className="w-6 h-6 text-rose-500 fill-rose-500 animate-bounce" />
                    <h3 className="font-serif font-extrabold text-gray-900 text-xs leading-tight">Para el amor<br />de mi vida</h3>
                    
                    <button className="px-3 py-1 bg-rose-500 text-white font-bold text-[8px] rounded-full shadow-sm">
                      Te amo ❤️
                    </button>

                    <div className="w-full aspect-[4/3] rounded-xl bg-rose-50 overflow-hidden relative flex items-center justify-center border border-rose-100/50">
                      {/* Simulated couples picture inside phone */}
                      <Image 
                        src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=300&auto=format&fit=crop" 
                        alt="Couples mockup" 
                        fill
                        sizes="180px"
                        priority
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Decorative Rose Flower Image behind or next to mockups */}
              <div className="absolute right-[-40px] bottom-[-20px] w-36 h-36 opacity-90 pointer-events-none select-none z-0 hidden sm:block relative">
                <Image 
                  src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&auto=format&fit=crop" 
                  alt="Decorative Rose" 
                  fill
                  sizes="144px"
                  className="object-contain mix-blend-multiply opacity-25"
                />
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges Bar */}
      <section className="bg-rose-50/30 border-y border-rose-100/60 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-rose-100/80">
            <div className="flex flex-col items-center justify-center p-2">
              <Heart className="w-5 h-5 text-[#a21232] fill-[#a21232] mb-1.5" />
              <p className="text-xs font-bold text-gray-800 leading-tight">+{experiencesCount}</p>
              <p className="text-[10px] text-gray-400 font-light mt-0.5">experiencias creadas</p>
            </div>
            <div className="flex flex-col items-center justify-center p-2 pt-4 md:pt-2">
              <Pencil className="w-5 h-5 text-[#a21232] mb-1.5" />
              <p className="text-xs font-bold text-gray-800 leading-tight">100% Personalizable</p>
              <p className="text-[10px] text-gray-400 font-light mt-0.5">a tu gusto</p>
            </div>
            <div className="flex flex-col items-center justify-center p-2 pt-4 md:pt-2">
              <Zap className="w-5 h-5 text-[#a21232] mb-1.5" />
              <p className="text-xs font-bold text-gray-800 leading-tight">100% Digital</p>
              <p className="text-[10px] text-gray-400 font-light mt-0.5">código QR al instante</p>
            </div>
            <div className="flex flex-col items-center justify-center p-2 pt-4 md:pt-2">
              <div className="flex items-center gap-0.5 mb-1.5 text-amber-500">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-xs font-bold text-gray-800">5.0</span>
              </div>
              <div className="flex text-amber-400 text-[8px]">★★★★★</div>
              <p className="text-[10px] text-gray-400 font-light mt-0.5">5 reseñas de parejas</p>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona Section */}
      <section id="como-funciona" className="py-20 bg-white border-b border-rose-100/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="font-serif text-3xl md:text-4xl font-extrabold text-gray-950">¿Cómo funciona?</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white border border-rose-100 rounded-3xl p-6 text-center space-y-4 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
              >
                {/* Step number badge */}
                <div className="absolute top-3 right-4 font-mono font-bold text-rose-200/50 text-xl leading-none">
                  {idx + 1}
                </div>

                <div className="w-10 h-10 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto text-[#a21232]">
                  {step.icon}
                </div>
                <h3 className="font-serif text-base font-bold text-gray-800">{step.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed font-light">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección ¿Qué quieres celebrar? */}
      <section className="py-20 bg-rose-50/10 border-b border-rose-100/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="font-serif text-3xl md:text-4xl font-extrabold text-gray-950">
              ¿Qué quieres celebrar? 🌹
            </h2>
            <p className="text-gray-500 text-sm font-light">
              Elige una temática especial para tu experiencia. Adaptamos el diseño y el contenido para crear el regalo perfecto.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {themes.map((theme, idx) => {
              const getThemeIcon = (themeId: string) => {
                switch (themeId) {
                  case 'anniversary': return <Heart className="w-6 h-6 text-[#a21232] fill-[#a21232]" />;
                  case 'birthday': return <Cake className="w-6 h-6 text-pink-500" />;
                  case 'dating-proposal': return <HeartHandshake className="w-6 h-6 text-pink-600" />;
                  case 'marriage-proposal': return <Gem className="w-6 h-6 text-amber-600" />;
                  case 'love-confession': return <Flame className="w-6 h-6 text-rose-500" />;
                  case 'love-letter': return <Mail className="w-6 h-6 text-amber-700" />;
                  case 'surprise': return <Gift className="w-6 h-6 text-indigo-600" />;
                  case 'valentines': return <Heart className="w-6 h-6 text-rose-750 fill-rose-750" />;
                  case 'pregnancy': return <Baby className="w-6 h-6 text-cyan-600" />;
                  case 'special': return <PartyPopper className="w-6 h-6 text-yellow-600" />;
                  case 'gratitude': return <Smile className="w-6 h-6 text-teal-650" />;
                  case 'reconciliation': return <HeartHandshake className="w-6 h-6 text-gray-500" />;
                  default: return <Sparkles className="w-6 h-6 text-[#a21232]" />;
                }
              };

              return (
                <motion.div
                  key={theme.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="bg-white border border-rose-100/60 rounded-3xl p-5 text-center flex flex-col justify-between items-center shadow-sm hover:shadow-md hover:border-[#a21232] transition-all duration-300 cursor-pointer group"
                  onClick={() => router.push(`/personalizar?theme=${theme.id}`)}
                >
                  <div className="space-y-3.5">
                    <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-105 transition-transform duration-300">
                      {getThemeIcon(theme.id)}
                    </div>
                    <h3 className="font-serif text-sm font-bold text-gray-900">{theme.name}</h3>
                    <p className="text-[10px] text-gray-400 font-light leading-relaxed">{theme.description}</p>
                  </div>
                  <div className="mt-4 pt-2 w-full border-t border-rose-50/40 text-[9.5px] font-bold text-[#a21232] uppercase group-hover:translate-x-1 transition-transform inline-flex justify-center items-center gap-1">
                    Elegir temática <ArrowRight className="w-3 h-3" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Planes y Precios Section */}
      <section id="productos" className="py-20 bg-[#fffcfd]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-2xl mx-auto text-center mb-12 space-y-3">
            <h2 className="font-serif text-3xl md:text-4xl font-extrabold text-gray-900">Nuestros planes digitales</h2>
            <p className="text-gray-500 text-xs sm:text-sm font-light">
              Todos los planes incluyen tu página web permanente y la tarjeta de regalo temática lista para imprimir o compartir.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
            {products.map((product) => {
              const promo = planPromos[product.id];
              const isPromo = Boolean(promo && promo.isActive && promo.remainingSlots > 0);
              const isSelected = product.id === 'medium';
              const price = isPromo ? promo.promoPrice : product.price;
              const regularPrice = isPromo ? (promo.regularPrice || product.price) : null;
              const badge = isPromo ? `🔥 LANZAMIENTO (${promo.remainingSlots} CUPOS)` : (product.badge || (product.id === 'medium' ? 'Más Recomendado' : null));
              
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className={`relative rounded-3xl p-6 md:p-8 cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                    isSelected
                      ? 'border-2 border-[#a21232] bg-white shadow-xl shadow-rose-950/10 md:scale-[1.02] ring-2 ring-rose-200 z-10'
                      : 'border border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  {badge && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#a21232] text-white text-[10px] font-extrabold uppercase px-4 py-1.5 rounded-full shadow-md tracking-wider whitespace-nowrap z-10">
                      {badge}
                    </div>
                  )}

                  <div className="space-y-4 flex-1">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 border-b border-gray-100 pb-3">
                      <div className="space-y-1">
                        <h3 className="font-serif font-bold text-xl text-gray-900">{product.name}</h3>
                        <p className="text-[11px] text-[#a21232] font-semibold leading-snug">{product.subtitle}</p>
                      </div>
                    </div>

                    {/* Price & Photos Badge */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-1.5">
                        <span className={`font-serif text-3xl font-black ${isPromo ? 'text-[#a21232]' : 'text-gray-900'}`}>
                          ${Number(price).toLocaleString('es-CL')}
                        </span>
                        {regularPrice && (
                          <span className="text-xs text-gray-400 line-through font-semibold">
                            ${Number(regularPrice).toLocaleString('es-CL')}
                          </span>
                        )}
                        <span className="text-[10px] text-gray-500 font-bold uppercase">CLP</span>
                      </div>

                      {product.photoBadge && (
                        <span className="px-2.5 py-1 bg-rose-50 text-[#a21232] border border-rose-200 text-[10px] font-bold rounded-lg flex items-center gap-1">
                          <ImageIcon className="w-3 h-3 text-[#a21232]" />
                          <span>{product.photoBadge}</span>
                        </span>
                      )}
                    </div>

                    {/* Features List */}
                    <ul className="space-y-2.5 pt-4 border-t border-gray-100">
                      {product.features.map((f, fIdx) => {
                        const isAllIncluded = f.startsWith('✓ Todo');
                        return (
                          <li 
                            key={fIdx} 
                            className={`text-xs flex items-start gap-2 leading-relaxed py-0.5 ${
                              isAllIncluded
                                ? 'font-bold text-[#a21232] bg-rose-50/70 p-2 rounded-lg border border-rose-200/60'
                                : 'text-gray-600 font-medium'
                            }`}
                          >
                            <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${
                              isAllIncluded ? 'text-[#a21232]' : 'text-emerald-600'
                            }`} />
                            <span>{f}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {/* Action Button */}
                  <Link
                    href={`/personalizar?plan=${product.id}`}
                    className={`w-full mt-8 py-3.5 text-center text-xs font-bold rounded-xl transition shadow-sm flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#a21232] hover:bg-[#880e28] text-white hover:shadow-md'
                        : 'bg-rose-50 text-[#a21232] hover:bg-rose-100/50 border border-rose-100'
                    }`}
                  >
                    Elegir este plan
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Reseñas de Clientes Section (5 Reseñas Reales) */}
      <section className="py-20 bg-rose-50/20 border-t border-rose-100/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100/70 text-amber-800 text-[10px] font-bold uppercase tracking-wider">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              <span>Opiniones de Parejas Enamoradas</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-extrabold text-gray-950">
              Historias Reales, Emociones Reales ❤️
            </h2>
            <div className="flex items-center justify-center gap-2 pt-1">
              <div className="flex text-amber-400 text-sm">★★★★★</div>
              <span className="text-xs font-bold text-gray-700">5.0 de 5.0</span>
              <span className="text-xs text-gray-400 font-light">• {allReviews.length} reseñas verificadas</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-5 items-stretch">
            {allReviews.slice(0, 6).map((rev, rIdx) => (
              <motion.div
                key={rIdx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: rIdx * 0.08 }}
                className="bg-white rounded-2xl p-5 border border-rose-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex text-amber-400 text-xs">★★★★★</div>
                    <span className="text-[9px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                      {rev.tag}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 font-light leading-relaxed italic">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-rose-50/80 mt-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-serif font-bold text-xs text-gray-900">{rev.name}</h4>
                    <span className="text-[10px] text-gray-400">{rev.date}</span>
                  </div>
                  <span title="Compra verificada" className="inline-flex">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="preguntas" className="py-20 bg-white border-t border-rose-100/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-2">
            <h2 className="font-serif text-3xl font-extrabold text-gray-950">Preguntas Frecuentes</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className="border border-rose-100 rounded-2xl overflow-hidden bg-rose-50/10 hover:bg-rose-50/20 transition-colors animate-fade-in"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="font-medium text-xs sm:text-sm text-gray-800 hover:text-[#a21232] transition-colors">
                    {faq.q}
                  </span>
                  <ChevronDown 
                    className={`w-4 h-4 text-[#a21232] transition-transform duration-300 ${
                      activeFaq === idx ? 'rotate-180' : ''
                    }`} 
                  />
                </button>

                <AnimatePresence initial={false}>
                  {activeFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-6 pb-6 text-xs text-gray-500 font-light leading-relaxed border-t border-rose-50/50 pt-2">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-rose-500 to-[#a21232] text-white relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <Heart className="w-14 h-14 text-white fill-white mx-auto animate-pulse" />
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold leading-tight">
            ¿Listo para sorprenderle?
          </h2>
          <p className="text-sm text-rose-100 font-light max-w-md mx-auto leading-relaxed">
            Personaliza vuestra página web de amor en 5 minutos y regala un detalle emotivo que durará para siempre.
          </p>
          <div className="pt-2">
            <Link
              href="/personalizar"
              className="inline-flex px-8 py-3.5 bg-white hover:bg-rose-50 text-[#a21232] font-extrabold rounded-full transition shadow-xl text-xs gap-2 items-center"
            >
              Crear mi experiencia ahora
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
      
    </div>
  );
}
