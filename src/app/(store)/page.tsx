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
  X,
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
    <div className="overflow-hidden bg-gradient-animated">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 md:pt-20 md:pb-32 relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        
        {/* Decorative Blurs Background */}
        <div className="absolute top-10 left-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-rose-300/30 rounded-full blur-[80px] md:blur-[100px] -z-10 mix-blend-multiply"></div>
        <div className="absolute bottom-0 right-0 w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-[#a21232]/10 rounded-full blur-[60px] md:blur-[80px] -z-10"></div>

        {/* Left Text Content */}
        <div className="flex-1 space-y-6 md:space-y-8 relative z-20 text-center lg:text-left w-full">
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full border border-rose-200 shadow-sm mx-auto lg:mx-0"
          >
            <span className="text-rose-500 animate-pulse">❤️</span>
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#a21232]">El regalo del año</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-black leading-[1.05] text-gray-900"
          >
            Regala una <br className="hidden lg:block"/>
            <span className="relative whitespace-nowrap">
              <span className="relative z-10 text-[#a21232] italic pr-2">experiencia</span>
              <svg className="absolute -bottom-1 md:-bottom-2 w-full h-3 md:h-4 -z-0 text-rose-200" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 15 100 5 L 100 10 L 0 10 Z" fill="currentColor"/></svg>
            </span> inolvidable.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base md:text-lg text-gray-600 font-light max-w-xl mx-auto lg:mx-0 leading-relaxed"
          >
            Tus fotos, su canción favorita y una dedicatoria secreta escondida en un Código QR premium. Una página web exclusiva que durará para siempre.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 md:gap-5 pt-4"
          >
            <Link 
              href="/personalizar" 
              className="btn-glow w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 bg-[#a21232] hover:bg-[#8a0f2a] text-white rounded-[2rem] text-sm font-bold uppercase tracking-wider shadow-[0_10px_40px_rgba(162,18,50,0.4)] transition-transform hover:-translate-y-1 flex items-center justify-center gap-3"
            >
              <span>Crear mi QR</span>
              <Heart className="w-4 h-4 fill-current" />
            </Link>
            
            <Link 
              href="/ejemplos" 
              className="w-full sm:w-auto px-8 py-4 md:py-5 glass hover:bg-white text-gray-800 rounded-[2rem] text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 group border border-gray-200"
            >
              <span className="bg-white/80 p-1 md:p-1.5 rounded-full shadow-sm group-hover:scale-110 transition flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-[#a21232]" />
              </span>
              Ver Demostración
            </Link>
          </motion.div>
          
          {/* Trust badges */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center lg:justify-start gap-3 md:gap-4 pt-6 md:pt-8"
          >
            <div className="flex -space-x-3">
              <img src="https://i.pravatar.cc/100?img=1" className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white shadow-sm" alt="User" />
              <img src="https://i.pravatar.cc/100?img=5" className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white shadow-sm" alt="User" />
              <img src="https://i.pravatar.cc/100?img=9" className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white shadow-sm" alt="User" />
            </div>
            <div className="text-left">
              <div className="flex text-amber-400 text-xs md:text-sm">★★★★★</div>
              <p className="text-[10px] md:text-xs font-semibold text-gray-700">Más de 3,000 parejas sorprendidas</p>
            </div>
          </motion.div>
        </div>

        {/* Right STRIKING Visual Mockup */}
        <div className="flex-1 relative w-full flex justify-center lg:justify-end mt-12 lg:mt-0 max-w-lg mx-auto lg:max-w-none">
          
          {/* Big beautiful Glass Card holding the QR */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="glass w-full max-w-xs md:max-w-md rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 shadow-[0_20px_60px_rgba(162,18,50,0.15)] animate-float-smooth relative z-20 border border-white"
          >
            
            {/* Top decorative dots */}
            <div className="flex justify-center gap-1.5 mb-6 md:mb-8">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-rose-200"></div>
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-rose-300"></div>
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#a21232]"></div>
            </div>

            <div className="bg-white rounded-[1.5rem] md:rounded-3xl p-4 md:p-6 shadow-lg relative group overflow-hidden">
              <div className="aspect-square bg-gray-50 flex items-center justify-center rounded-xl md:rounded-2xl border border-gray-100 p-2 md:p-4 relative">
                <QrCode className="w-full h-full text-gray-800" />
                {/* Scan Line Animation */}
                <div className="absolute top-0 left-0 w-full h-1 md:h-1.5 bg-[#a21232] shadow-[0_0_15px_#a21232] opacity-0 group-hover:opacity-100 group-hover:animate-scan"></div>
              </div>
            </div>

            <div className="mt-6 md:mt-8 text-center space-y-1 md:space-y-2">
              <p className="text-[10px] md:text-xs font-bold text-rose-400 uppercase tracking-widest">Para:</p>
              <p className="font-serif text-2xl md:text-3xl font-bold text-gray-900">Valentina & Diego</p>
            </div>
          </motion.div>

          {/* Floating Elements for depth */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="absolute -top-6 -left-4 md:-top-10 md:-left-10 lg:left-0 glass-dark p-3 md:p-4 rounded-2xl animate-float-delayed z-30 shadow-xl border border-white/40"
          >
            <Heart className="w-6 h-6 md:w-8 md:h-8 text-[#a21232] fill-current animate-heartbeat-slow" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="absolute bottom-6 -right-2 md:bottom-10 md:-right-5 lg:-right-10 bg-white p-2 md:p-3 rounded-2xl animate-float-smooth shadow-2xl rotate-12 z-30 border border-rose-100"
          >
            <div className="w-16 h-16 md:w-24 md:h-24 rounded-lg md:rounded-xl bg-gray-100 overflow-hidden relative">
              <Image src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=300&auto=format&fit=crop" alt="Pareja" fill sizes="96px" className="object-cover" />
            </div>
          </motion.div>

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
