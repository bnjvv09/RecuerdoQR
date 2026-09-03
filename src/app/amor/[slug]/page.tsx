'use client';

import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { getExperienceBySlug, Experience, Photo, Milestone, ExperienceSection, ensureExperienceSections } from '@/lib/db';
import { getFontFamily } from '@/lib/fonts';
import PhotoGallery from '@/components/gallery/PhotoGallery';
import { 
  Heart, 
  Music, 
  Volume2, 
  VolumeX, 
  Calendar, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
  Cake,
  Mail,
  Baby,
  Smile,
  PartyPopper,
  Flame,
  Gem,
  HeartHandshake,
  Lock,
  Unlock,
  MapPin,
  Gift,
  Video,
  ChevronDown,
  Check,
  Mic,
  Play,
  Pause
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

// --- MOCK TEMPLATE DATA FOR DEMOS ---
const DEMO_DIGITAL: Experience = {
  id: 'demo-digital-id',
  slug: 'ejemplo-digital',
  title: 'Para Sofía con Amor',
  partner_name: 'Sofía',
  user_name: 'Lucas',
  special_date: '2023-02-12',
  theme: 'anniversary',
  message: 'Gracias por ser mi compañera en esta aventura llamada vida. Estos años a tu lado han sido los más felices de mi existencia. Prometo seguir haciéndote sonreír cada día. Te amo infinitamente.',
  history_text: 'Nos conocimos un día lluvioso de febrero en una cafetería del centro de la ciudad. Lucas derramó accidentalmente un poco de café y la risa contagiosa de Sofía dio inicio a una conversación de tres horas. Desde esa tarde supimos que nuestras almas se habían encontrado.',
  song_url: 'https://www.youtube.com/watch?v=rtOvBOTyX00',
  config: { photoStyle: 'polaroid' },
  created_at: new Date().toISOString(),
  photos: [
    { id: '1', experience_id: 'd1', url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&auto=format&fit=crop', caption: 'Nuestra primera salida juntos', order_index: 0 },
    { id: '2', experience_id: 'd1', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop', caption: 'Tu hermosa sonrisa en la playa', order_index: 1 },
    { id: '3', experience_id: 'd1', url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&auto=format&fit=crop', caption: 'Celebrando tu cumpleaños', order_index: 2 },
    { id: '4', experience_id: 'd1', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop', caption: 'Paseando por el parque', order_index: 3 },
    { id: '5', experience_id: 'd1', url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&auto=format&fit=crop', caption: 'Una cita especial de viernes', order_index: 4 },
  ],
  milestones: []
};

const DEMO_PREMIUM: Experience = {
  id: 'demo-premium-id',
  slug: 'ejemplo-premium',
  title: 'Nuestra Vida Juntos',
  partner_name: 'María',
  user_name: 'Carlos',
  special_date: '2018-10-05',
  theme: 'anniversary',
  message: 'Cada segundo a tu lado me confirma que tomar tu mano en el altar fue la mejor decisión de mi vida. Eres mi hogar, mi paz y mi mayor alegría. Gracias por amarme tal y como soy. Feliz aniversario, mi amor.',
  history_text: 'Comenzamos como dos mejores amigos compartiendo apuntes en la universidad. Entre cafés nocturnos y sueños compartidos, la amistad se convirtió en un amor inquebrantable. Hoy, años después, miramos atrás y vemos la maravillosa vida que hemos construido juntos.',
  song_url: 'https://www.youtube.com/watch?v=2Vv-BfVoq4g',
  config: { photoStyle: 'album' },
  created_at: new Date().toISOString(),
  photos: [
    { id: '1', experience_id: 'd2', url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&auto=format&fit=crop', caption: 'Donde todo comenzó', order_index: 0 },
    { id: '2', experience_id: 'd2', url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&auto=format&fit=crop', caption: 'Viaje a las montañas', order_index: 1 },
    { id: '3', experience_id: 'd2', url: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=800&auto=format&fit=crop', caption: 'Nuestra primera navidad', order_index: 2 },
    { id: '4', experience_id: 'd2', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop', caption: 'El día más feliz de nuestras vidas', order_index: 3 },
    { id: '5', experience_id: 'd2', url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&auto=format&fit=crop', caption: 'Brindando por el futuro', order_index: 4 },
  ],
  milestones: [
    { id: 'm1', experience_id: 'demo-premium-id', title: 'El Primer Beso', date: '2016-04-12', description: 'Ocurrió bajo la lluvia, en la plaza principal de la universidad, después de estudiar para un examen.', order_index: 0, image_url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500&auto=format&fit=crop' },
    { id: 'm2', experience_id: 'demo-premium-id', title: 'Adoptamos a Toby', date: '2017-06-20', description: 'El día en que decidimos ampliar nuestra pequeña familia con un travieso cachorro que nos cambió la vida.', order_index: 1, image_url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500&auto=format&fit=crop' },
    { id: 'm3', experience_id: 'demo-premium-id', title: 'La Propuesta', date: '2018-02-14', description: 'Frente al lago en Pucón. Con el atardecer tiñendo el cielo de rosa y el corazón latiendo muy rápido.', order_index: 2, image_url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=500&auto=format&fit=crop' },
    { id: 'm4', experience_id: 'demo-premium-id', title: 'El Gran "Sí, acepto"', date: '2018-10-05', description: 'Prometimos ser compañeros de vida en una pequeña ceremonia íntima rodeados de flores silvestres.', order_index: 3, image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=500&auto=format&fit=crop' }
  ]
};

export default function AmorExperiencePage() {
  const { slug } = useParams();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Gate step states
  const [heartTaps, setHeartTaps] = useState(0);
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [welcomeOpened, setWelcomeOpened] = useState(false);
  const [entered, setEntered] = useState(false);
  
  // Audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoCode, setVideoCode] = useState('');

  // Gallery slider state
  const [photoIndex, setPhotoIndex] = useState(0);

  // Time elapsed state
  const [timeElapsed, setTimeElapsed] = useState({
    years: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Theme-specific interactive states
  const [giftOpened, setGiftOpened] = useState(false);
  const [proposalResponse, setProposalResponse] = useState<'yes' | 'no' | null>(null);
  const [noBtnOffset, setNoBtnOffset] = useState({ x: 0, y: 0 });
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [balloonsPopped, setBalloonsPopped] = useState<number[]>([]);
  const [isScratched, setIsScratched] = useState(false);
  const [pregnancyPollVote, setPregnancyPollVote] = useState<'A' | 'B' | null>(null);
  const [isVoiceNotePlaying, setIsVoiceNotePlaying] = useState(false);
  const [isRingBoxOpened, setIsRingBoxOpened] = useState(false);
  const [isWaxSealBroken, setIsWaxSealBroken] = useState(false);
  const [crystalUnlocked, setCrystalUnlocked] = useState(false);
  const [starsRevealed, setStarsRevealed] = useState<number[]>([]);
  const [heartUnited, setHeartUnited] = useState(false);

  // Custom apartados states
  const [secretUnlocked, setSecretUnlocked] = useState(false);
  const [secretInputPin, setSecretInputPin] = useState('');
  const [surpriseRevealed, setSurpriseRevealed] = useState(false);
  const [isCartaEnvelopeOpen, setIsCartaEnvelopeOpen] = useState(false);

  // Background Audio State (Direct native audio player)
  const [audioFileUrl, setAudioFileUrl] = useState<string | null>(null);
  const bgAudioRef = useRef<HTMLAudioElement | null>(null);

  // Map of preset YouTube video IDs & IDs to local direct full audio files (3-4 mins)
  const PRESET_AUDIO_MAP: Record<string, string> = {
    '1fT2aB6FzFw': '/audio/full/dicelo.m4a',
    'sHj49o05jQI': '/audio/full/dicelo.m4a',
    'Fj-y5M5rPfg': '/audio/full/dicelo.m4a',
    'dicelo': '/audio/full/dicelo.m4a',
    'yP9vWj7R0xI': '/audio/full/vida-de-rico.m4a',
    'vida-de-rico': '/audio/full/vida-de-rico.m4a',
    'K1j31Y8rU7I': '/audio/full/creo-en-ti.m4a',
    'creo-en-ti': '/audio/full/creo-en-ti.m4a',
    'yKNxeF4KMsY': '/audio/full/yellow.m4a',
    'yellow': '/audio/full/yellow.m4a',
    'hKqN5fC60kU': '/audio/full/quiereme-mientras-se-pueda.m4a',
    'quiereme-mientras-se-pueda': '/audio/full/quiereme-mientras-se-pueda.m4a',
    '9g0n6cO552g': '/audio/full/beso.m4a',
    'CFPLIaMpGrY': '/audio/full/beso.m4a',
    'beso': '/audio/full/beso.m4a',
    '2Vv-BfVoq4g': '/audio/full/perfect.m4a',
    'perfect': '/audio/full/perfect.m4a',
    'v2Xk_go2v3U': '/audio/full/un-ano.m4a',
    'un-ano': '/audio/full/un-ano.m4a',
  };

  const resolveMusicSource = (url: string) => {
    if (!url) return;
    
    // Automatically promote preview paths to full complete song files
    let normalizedUrl = url.replace('/audio/previews/', '/audio/full/');

    let directPath = '';
    for (const [key, path] of Object.entries(PRESET_AUDIO_MAP)) {
      if (normalizedUrl.toLowerCase().includes(key.toLowerCase())) {
        directPath = path;
        break;
      }
    }

    if (normalizedUrl.startsWith('/audio/') || normalizedUrl.endsWith('.m4a') || normalizedUrl.endsWith('.mp3') || directPath) {
      setAudioFileUrl(directPath || normalizedUrl);
      setVideoCode('');
    } else {
      extractYoutubeCode(normalizedUrl);
    }
  };

  // Load experience
  useEffect(() => {
    if (!slug) return;

    const loadExp = async () => {
      const lowerSlug = slug.toString().toLowerCase();
      if (lowerSlug === 'ejemplo-digital') {
        const fullExp = ensureExperienceSections(DEMO_DIGITAL);
        setExperience(fullExp);
        resolveMusicSource(DEMO_DIGITAL.song_url || '');
        setLoading(false);
      } else if (lowerSlug === 'ejemplo-premium') {
        const fullExp = ensureExperienceSections(DEMO_PREMIUM);
        setExperience(fullExp);
        resolveMusicSource(DEMO_PREMIUM.song_url || '');
        setLoading(false);
      } else {
        const res = await getExperienceBySlug(slug.toString());
        if (res) {
          setExperience(res);
          const musicSec = res.sections?.find((s: any) => s.type === 'musica');
          const songUrlToUse = res.song_url || musicSec?.content?.url || '';
          resolveMusicSource(songUrlToUse);
        }
        setLoading(false);
      }
    };

    loadExp();
  }, [slug]);

  // Reactive audio playback effect
  useEffect(() => {
    if (isPlaying && bgAudioRef.current) {
      bgAudioRef.current.play().catch(() => {});
    }
  }, [isPlaying, audioFileUrl]);

  // Extract YouTube code helper
  const extractYoutubeCode = (url: string) => {
    if (!url) return;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      setVideoCode(match[2]);
    }
  };

  // Timer counter effect with robust date parsing
  useEffect(() => {
    if (!experience) return;
    const dateStr = experience.special_date || experience.config?.special_date || experience.sections?.find((s: any) => s.type === 'contador')?.content?.date || '2024-02-14';

    const calculateTime = () => {
      let start: Date;
      if (typeof dateStr === 'string' && dateStr.includes('-')) {
        const parts = dateStr.split('T')[0].split('-').map(Number);
        start = new Date(parts[0], (parts[1] || 1) - 1, parts[2] || 1);
      } else {
        start = new Date(dateStr);
      }

      if (isNaN(start.getTime())) {
        start = new Date('2024-02-14T00:00:00');
      }

      const now = new Date();
      let diff = now.getTime() - start.getTime();

      if (diff < 0) diff = 0;

      const msInSecond = 1000;
      const msInMinute = 60 * 1000;
      const msInHour = 60 * 60 * 1000;
      const msInDay = 24 * 60 * 60 * 1000;

      let years = now.getFullYear() - start.getFullYear();
      let anniversary = new Date(start);
      anniversary.setFullYear(start.getFullYear() + years);
      if (anniversary > now) {
        years--;
        anniversary = new Date(start);
        anniversary.setFullYear(start.getFullYear() + years);
      }

      const diffAnniversary = now.getTime() - anniversary.getTime();
      const days = Math.max(0, Math.floor(diffAnniversary / msInDay));
      const hours = Math.max(0, Math.floor((diffAnniversary % msInDay) / msInHour));
      const minutes = Math.max(0, Math.floor((diffAnniversary % msInHour) / msInMinute));
      const seconds = Math.max(0, Math.floor((diffAnniversary % msInMinute) / msInSecond));

      setTimeElapsed({ years, days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [experience]);

  // Entrance action (triggers sound + confetti)
  const handleEnter = () => {
    setWelcomeOpened(true);
    setEntered(true);
    setIsPlaying(true);
    if (bgAudioRef.current) {
      bgAudioRef.current.play().catch(() => {});
    }
    triggerCelebrationConfetti();
  };

  const toggleMusic = () => {
    if (isPlaying) {
      if (bgAudioRef.current) bgAudioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (bgAudioRef.current) bgAudioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const triggerCelebrationConfetti = () => {
    const duration = 4 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 25, spread: 360, ticks: 50, zIndex: 100 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, colors: ['#ff4d6d', '#ff758f', '#ff8fa3'] });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }, colors: ['#ff4d6d', '#ff758f', '#ff8fa3'] });
    }, 250);
  };

  const handleNextPhoto = () => {
    if (!experience || !experience.photos) return;
    setPhotoIndex((photoIndex + 1) % experience.photos.length);
  };

  const handlePrevPhoto = () => {
    if (!experience || !experience.photos) return;
    setPhotoIndex((photoIndex - 1 + experience.photos.length) % experience.photos.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex flex-col items-center justify-center p-4 text-center select-none">
        <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-[#a21232] animate-pulse shadow-lg shadow-rose-950/5 mb-4">
          <Heart className="w-8 h-8 fill-[#a21232] animate-bounce" />
        </div>
        <h2 className="font-serif text-base font-bold text-gray-800">
          Abriendo tu sorpresa de amor...
        </h2>
        <p className="mt-1 text-xs text-gray-500 font-light max-w-xs">
          Sintonizando la música y preparando tus recuerdos especiales ✨
        </p>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="min-h-screen bg-rose-50/20 flex flex-col items-center justify-center px-4 text-center">
        <Heart className="w-12 h-12 text-gray-300 mb-4" />
        <h1 className="font-serif text-lg font-bold text-gray-900">Recuerdo no encontrado</h1>
        <p className="text-xs text-gray-550 mt-2 max-w-xs font-light">Este enlace QR no apunta a una experiencia activa o válida.</p>
      </div>
    );
  }

  // --- Dynamic Themes Engine ---
  const themeId = experience.theme || 'anniversary';

  const themeStyles: Record<string, {
    bgClass: string;
    textColor: string;
    btnClass: string;
    cardClass: string;
    borderColor: string;
    badgeClass: string;
    icon: any;
  }> = {
    anniversary: {
      bgClass: 'bg-gradient-to-b from-[#fff5f6] to-[#fffcfd]',
      textColor: 'text-[#a21232]',
      btnClass: 'bg-[#a21232] hover:bg-[#850e27] text-white',
      cardClass: 'bg-white/80 border-rose-100/50 backdrop-blur-sm',
      borderColor: 'border-rose-100',
      badgeClass: 'bg-rose-50 border border-rose-100 text-[#a21232]',
      icon: Heart
    },
    birthday: {
      bgClass: 'bg-gradient-to-b from-[#fff1f2] to-[#fffafb]',
      textColor: 'text-pink-650',
      btnClass: 'bg-pink-500 hover:bg-pink-600 text-white',
      cardClass: 'bg-white/85 border-pink-100/40 backdrop-blur-sm shadow-pink-50/20',
      borderColor: 'border-pink-100',
      badgeClass: 'bg-pink-50 border border-pink-100 text-pink-600',
      icon: Cake
    },
    'dating-proposal': {
      bgClass: 'bg-gradient-to-b from-[#fff0f6] to-[#fffcfd]',
      textColor: 'text-pink-600',
      btnClass: 'bg-pink-500 hover:bg-pink-600 text-white',
      cardClass: 'bg-white/90 border-pink-100/50',
      borderColor: 'border-pink-150',
      badgeClass: 'bg-pink-50 border border-pink-100 text-pink-600',
      icon: Smile
    },
    'marriage-proposal': {
      bgClass: 'bg-gradient-to-b from-[#fffbf2] to-[#fafaf9]',
      textColor: 'text-amber-800',
      btnClass: 'bg-amber-700 hover:bg-amber-850 text-white',
      cardClass: 'bg-white/90 border-amber-100/40 shadow-amber-50/10',
      borderColor: 'border-amber-150',
      badgeClass: 'bg-amber-50 border border-amber-100 text-amber-800',
      icon: Gem
    },
    'love-confession': {
      bgClass: 'bg-gradient-to-b from-[#fff5f6] to-[#fffcfd]',
      textColor: 'text-rose-600',
      btnClass: 'bg-rose-500 hover:bg-rose-600 text-white border border-rose-450',
      cardClass: 'bg-white/85 border-rose-100/40',
      borderColor: 'border-rose-100',
      badgeClass: 'bg-rose-50 border border-rose-100 text-rose-600',
      icon: Flame
    },
    'love-letter': {
      bgClass: 'bg-[#fefcbf]/20',
      textColor: 'text-[#8b5a2b]',
      btnClass: 'bg-[#8b5a2b] hover:bg-[#6f4520] text-white',
      cardClass: 'bg-[#fffbeb]/90 border-amber-200/55 shadow-amber-100/10',
      borderColor: 'border-amber-200',
      badgeClass: 'bg-amber-50 border border-amber-100 text-amber-800',
      icon: Mail
    },
    surprise: {
      bgClass: 'bg-gradient-to-b from-indigo-50/20 to-[#fdfdff]',
      textColor: 'text-indigo-650',
      btnClass: 'bg-indigo-600 hover:bg-indigo-750 text-white',
      cardClass: 'bg-white/85 border-indigo-100/40',
      borderColor: 'border-indigo-100',
      badgeClass: 'bg-indigo-50 border border-indigo-100 text-indigo-600',
      icon: Gift
    },
    valentines: {
      bgClass: 'bg-gradient-to-b from-[#fff1f2] to-[#fffafb]',
      textColor: 'text-red-650',
      btnClass: 'bg-red-650 hover:bg-red-750 text-white',
      cardClass: 'bg-white/90 border-red-100/50 shadow-red-50/10',
      borderColor: 'border-red-100',
      badgeClass: 'bg-red-50 border border-red-100 text-red-600',
      icon: Heart
    },
    pregnancy: {
      bgClass: 'bg-gradient-to-b from-cyan-50/20 to-[#fcfdff]',
      textColor: 'text-cyan-700',
      btnClass: 'bg-cyan-600 hover:bg-cyan-700 text-white',
      cardClass: 'bg-white/90 border-cyan-100/40',
      borderColor: 'border-cyan-100',
      badgeClass: 'bg-cyan-50 border border-cyan-100 text-cyan-700',
      icon: Baby
    },
    special: {
      bgClass: 'bg-gradient-to-b from-yellow-50/15 to-[#fffdfc]',
      textColor: 'text-yellow-800',
      btnClass: 'bg-yellow-600 hover:bg-yellow-750 text-white',
      cardClass: 'bg-white/95 border-yellow-100/40',
      borderColor: 'border-yellow-100',
      badgeClass: 'bg-yellow-50 border border-yellow-100 text-yellow-800',
      icon: Sparkles
    },
    gratitude: {
      bgClass: 'bg-gradient-to-b from-teal-50/15 to-[#fcfdfd]',
      textColor: 'text-teal-700',
      btnClass: 'bg-teal-600 hover:bg-teal-700 text-white',
      cardClass: 'bg-white/90 border-teal-100/40',
      borderColor: 'border-teal-100',
      badgeClass: 'bg-teal-50 border border-teal-100 text-teal-700',
      icon: HeartHandshake
    },
    reconciliation: {
      bgClass: 'bg-gradient-to-b from-gray-50/30 to-[#fafafa]',
      textColor: 'text-gray-700',
      btnClass: 'bg-gray-650 hover:bg-gray-750 text-white',
      cardClass: 'bg-white/90 border-gray-150',
      borderColor: 'border-gray-200',
      badgeClass: 'bg-gray-100 border border-gray-200 text-gray-700',
      icon: Smile
    }
  };

  const defaultStyle = themeStyles[themeId] || themeStyles.anniversary;
  const TitleIcon = defaultStyle.icon;

  const customColors = experience.config?.customColors;
  const customFont = experience.config?.customFont || 'serif';

  const primaryColor = customColors?.primary || 
    (themeId === 'birthday' ? '#ec4899' : 
     themeId === 'dating-proposal' ? '#db2777' : 
     themeId === 'marriage-proposal' ? '#b45309' : 
     themeId === 'love-letter' ? '#78350f' : 
     themeId === 'surprise' ? '#4f46e5' : 
     themeId === 'valentines' ? '#be123c' : 
     themeId === 'pregnancy' ? '#0891b2' : 
     themeId === 'special' ? '#d97706' : 
     themeId === 'gratitude' ? '#0d9488' : 
     themeId === 'reconciliation' ? '#4b5563' : '#a21232');
  
  const bgColor = customColors?.bg || 
    (themeId === 'birthday' ? '#fff1f2' : 
     themeId === 'love-letter' ? '#fffbeb' : 
     themeId === 'surprise' ? '#eef2ff' : 
     themeId === 'valentines' ? '#fff1f2' : 
     themeId === 'pregnancy' ? '#ecfeff' : 
     themeId === 'special' ? '#fffbeb' : 
     themeId === 'gratitude' ? '#f0fdfa' : 
     themeId === 'reconciliation' ? '#f9fafb' : '#fffcfd');

  const textColor = customColors?.text || '#111827';
  const selectedFontFamily = getFontFamily(customFont);

  const style = {
    bgClass: customColors ? '' : defaultStyle.bgClass,
    textColor: customColors ? 'custom-primary-text' : defaultStyle.textColor,
    btnClass: customColors ? 'custom-primary-bg custom-primary-bg-hover text-white font-bold' : defaultStyle.btnClass,
    cardClass: customColors ? 'bg-white border custom-border backdrop-blur-sm' : defaultStyle.cardClass,
    borderColor: customColors ? 'custom-border' : defaultStyle.borderColor,
    badgeClass: customColors ? 'custom-pill-bg font-bold' : defaultStyle.badgeClass,
    icon: defaultStyle.icon
  };

  return (
    <div 
      className={`min-h-screen pb-12 ${style.bgClass} flex flex-col items-center justify-start text-xs custom-dynamic-bg custom-dynamic-text experience-font-root`}
      style={{
        backgroundColor: customColors?.bg || undefined,
        color: customColors?.text || undefined,
        fontFamily: selectedFontFamily
      }}
    >
      <style>{`
        .custom-dynamic-bg { background-color: ${bgColor} !important; }
        .custom-dynamic-text { color: ${textColor} !important; }
        .custom-primary-text { color: ${primaryColor} !important; }
        .custom-primary-bg { background-color: ${primaryColor} !important; }
        .custom-primary-bg-hover:hover { background-color: ${primaryColor}dd !important; }
        .custom-border { border-color: ${primaryColor}30 !important; }
        .custom-pill-bg { background-color: ${primaryColor}12 !important; color: ${primaryColor} !important; }
        .experience-font-root, .experience-font-root h1, .experience-font-root h2, .experience-font-root h3, .experience-font-root h4, .experience-font-root p, .experience-font-root span, .experience-font-root button { font-family: ${selectedFontFamily} !important; }
      `}</style>
      
      {/* 1. Background Music Player (Direct Native Audio or YouTube Fallback) */}
      {audioFileUrl && (
        <audio
          ref={bgAudioRef}
          src={audioFileUrl}
          preload="auto"
          loop
          className="hidden"
        />
      )}

      {!audioFileUrl && videoCode && isPlaying && (
        <div className="w-0 h-0 overflow-hidden absolute">
          <iframe
            src={`https://www.youtube.com/embed/${videoCode}?autoplay=1&loop=1&playlist=${videoCode}&controls=0`}
            allow="autoplay"
          ></iframe>
        </div>
      )}

      {/* 2. Floating Heart Particles for Valentines theme */}
      {entered && themeId === 'valentines' && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-20">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: '105vh', x: `${Math.random() * 100}vw`, opacity: 0 }}
              animate={{ y: '-5vh', opacity: [0, 0.7, 0] }}
              transition={{ duration: Math.random() * 8 + 8, repeat: Infinity, ease: 'linear', delay: Math.random() * 5 }}
              className="absolute text-red-400 text-sm md:text-base select-none"
            >
              ❤️
            </motion.div>
          ))}
        </div>
      )}

      {/* 3. Floating Balloons and Confetti for Birthday theme */}
      {entered && themeId === 'birthday' && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-20">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: '105vh', x: `${Math.random() * 100}vw` }}
              animate={{ y: '-15vh', x: [`${Math.random() * 100}vw`, `${Math.random() * 100}vw`] }}
              transition={{ duration: Math.random() * 10 + 12, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute text-2xl"
              style={{ filter: `hue-rotate(${Math.random() * 360}deg)` }}
            >
              🎈
            </motion.div>
          ))}
        </div>
      )}

      {/* 4. Elegant Floating Corner Music Widget */}
      {entered && (audioFileUrl || videoCode) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 right-4 z-50 select-none"
        >
          <div className="flex items-center gap-2.5 bg-white/90 backdrop-blur-xl pl-2 pr-3 py-1.5 rounded-full shadow-2xl border border-rose-200/80 shadow-rose-950/10">
            {/* Spinning Mini Vinyl / Disc */}
            <motion.button
              type="button"
              onClick={toggleMusic}
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
              className="w-8 h-8 rounded-full bg-gradient-to-tr from-zinc-900 via-zinc-800 to-zinc-900 border-2 border-zinc-700 flex items-center justify-center shadow-md relative group cursor-pointer"
            >
              {/* Disc Center Hole with Primary Color */}
              <div 
                className="w-2.5 h-2.5 rounded-full flex items-center justify-center"
                style={{ backgroundColor: primaryColor }}
              >
                <div className="w-1 h-1 bg-white rounded-full"></div>
              </div>
            </motion.button>

            {/* Song Label & Sound Equalizer Waves */}
            <div 
              className="flex flex-col cursor-pointer"
              onClick={toggleMusic}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-gray-900 font-serif leading-none tracking-tight">
                  Música de fondo
                </span>
                {/* Equalizer animation */}
                {isPlaying ? (
                  <div className="flex items-end gap-0.5 h-2.5">
                    <span className="w-0.5 h-2 bg-[#a21232] rounded-full animate-pulse"></span>
                    <span className="w-0.5 h-3 bg-[#a21232] rounded-full animate-bounce"></span>
                    <span className="w-0.5 h-1.5 bg-[#a21232] rounded-full animate-pulse"></span>
                  </div>
                ) : (
                  <span className="text-[8px] text-gray-400 font-mono">Pausado</span>
                )}
              </div>
              <span className="text-[8px] text-gray-400 font-light truncate max-w-[95px]">
                {isPlaying ? '♪ Reproduciendo' : 'Toca para sonar'}
              </span>
            </div>

            {/* Play/Pause Button */}
            <button
              type="button"
              onClick={toggleMusic}
              className="p-1.5 rounded-full text-white transition shadow-xs cursor-pointer"
              style={{ backgroundColor: isPlaying ? primaryColor : '#9ca3af' }}
            >
              {isPlaying ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
          </div>
        </motion.div>
      )}

      {/* 5. GATED STAGES FOR DEEP INTERACTIVE INTRODUCTION */}
      <AnimatePresence mode="wait">
         {/* Step A: 5 heart taps portada */}
        {heartTaps < 5 && (
          <motion.div
            key="heart-tap-gate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-sm px-4 pt-12 flex-1 flex flex-col justify-center"
          >
            <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
              <div className="mb-3">
                <span className={`text-[9px] uppercase tracking-widest font-extrabold px-3 py-1 rounded-full border ${style.badgeClass}`}>
                  Experiencia Romántica
                </span>
              </div>
              
              <h2 className="font-serif font-extrabold text-xl md:text-2xl text-gray-950 max-w-sm leading-tight mb-2">
                {experience.title || 'Para el amor de mi vida ❤️'}
              </h2>
              
              {/* Dynamic progressive heart tap phrase */}
              <div className="h-8 flex items-center justify-center mb-6">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={heartTaps}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-sm font-bold font-serif text-[#a21232] tracking-wide"
                  >
                    {[
                      '❤️ Toca el corazón',
                      '❤️ Tócalo otra vez',
                      '❤️ Una vez más',
                      '❤️ Ya casi…',
                      '❤️ Último toque'
                    ][heartTaps] || '❤️ Toca el corazón'}
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* Interactive Bouncing Heart */}
              <motion.div
                key={heartTaps}
                whileTap={{ scale: 0.8 }}
                animate={{ scale: [1, 1.15, 1], rotate: [0, -4, 4, 0] }}
                transition={{ duration: 0.35 }}
                onClick={() => {
                  const nextTaps = heartTaps + 1;
                  setHeartTaps(nextTaps);
                  if (nextTaps === 5) {
                    confetti({ 
                      particleCount: 120, 
                      spread: 90, 
                      origin: { y: 0.6 }, 
                      colors: ['#ff1744', '#ff4081', '#f50057', '#ff80ab', '#ffffff'] 
                    });
                    setEnvelopeOpened(true);
                    setWelcomeOpened(true);
                    setEntered(true);
                    setIsPlaying(true);
                    // 🚀 Reproducción inmediata en el mismo evento táctil (0ms)
                    if (bgAudioRef.current) {
                      bgAudioRef.current.currentTime = 0;
                      bgAudioRef.current.play().catch((err) => console.log('Audio autoplay:', err));
                    }
                  } else {
                    // Pre-cargar audio en memoria durante los toques 1 a 4
                    if (bgAudioRef.current && bgAudioRef.current.paused) {
                      bgAudioRef.current.load();
                    }
                    confetti({ 
                      particleCount: 15, 
                      spread: 40, 
                      origin: { y: 0.6 }, 
                      colors: ['#ff4d6d', '#ff758f'] 
                    });
                  }
                }}
                className="relative w-32 h-32 flex items-center justify-center cursor-pointer mb-8 group"
              >
                <span className="absolute inset-0 bg-rose-300/40 rounded-full animate-ping"></span>
                <span className="absolute inset-2 bg-rose-200/50 rounded-full animate-pulse"></span>
                <Heart className={`w-24 h-24 fill-[#a21232] text-[#a21232] relative z-10 drop-shadow-lg transition-transform group-hover:scale-110`} />
              </motion.div>

              {/* Progress Heart Dots */}
              <div className="flex gap-2 justify-center items-center">
                {[1, 2, 3, 4, 5].map((dot) => (
                  <div
                    key={dot}
                    className={`w-3.5 h-3.5 rounded-full transition-all duration-300 flex items-center justify-center text-[8px] ${
                      heartTaps >= dot 
                        ? 'bg-[#a21232] text-white scale-110 shadow-sm' 
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    ❤️
                  </div>
                ))}
              </div>
              
              <span className="text-[10px] text-gray-400 font-bold uppercase mt-3 tracking-wider">
                {heartTaps} de 5 toques
              </span>
            </div>
          </motion.div>
        )}

        {/* Step B: Envelope wax seal */}
        {heartTaps >= 5 && !envelopeOpened && (
          <motion.div
            key="envelope-seal-gate"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-sm px-4 pt-12 flex-1 flex flex-col justify-center"
          >
            <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center animate-fade-in">
              <div 
                className="relative w-72 h-52 bg-amber-50 rounded-lg shadow-xl border border-amber-100 flex items-center justify-center cursor-pointer group" 
                onClick={() => {
                  setEnvelopeOpened(true);
                  confetti({ particleCount: 30, spread: 50, colors: ['#ff4d6d', '#e11d48'] });
                }}
              >
                {/* Envelope lines */}
                <div className="absolute inset-0 border-t-[100px] border-t-transparent border-b-[100px] border-b-amber-100/90 border-l-[144px] border-l-amber-50/75 border-r-[144px] border-r-amber-50/75 rounded-lg"></div>
                {/* Lid flap when closed */}
                <div className="absolute top-0 inset-x-0 h-0 border-t-[100px] border-t-amber-100/60 border-l-[144px] border-l-transparent border-r-[144px] border-r-transparent origin-top transition-transform duration-500 group-hover:scale-y-[-1] z-10"></div>
                
                {/* Wax Seal */}
                <div className="absolute z-20 w-12 h-12 bg-red-600 rounded-full shadow-md flex items-center justify-center text-white border-2 border-red-500 transform active:scale-95 transition-transform group-hover:animate-pulse">
                  <Heart className="w-6 h-6 fill-current text-red-100" />
                </div>

                {/* Letter card peeking */}
                <div className="absolute w-64 h-40 bg-white rounded shadow-sm top-6 transition-all duration-500 group-hover:-translate-y-12 z-0 flex items-center justify-center p-4">
                  <span className="text-[10px] text-gray-400 italic font-serif">Abre tu carta especial...</span>
                </div>
              </div>
              <p className="mt-8 text-[9px] text-gray-500 uppercase tracking-widest font-extrabold animate-pulse">
                Haz clic en el sobre para romper el lacre
              </p>
            </div>
          </motion.div>
        )}

        {/* Step C: Welcome welcomeOpened letter */}
        {envelopeOpened && !welcomeOpened && (
          <motion.div
            key="welcome-gate"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="w-full max-w-sm px-4 pt-12 flex-1 flex flex-col justify-center"
          >
            <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center w-full">
              <div className="bg-white rounded-3xl p-6 shadow-xl border border-rose-100/50 space-y-6 w-full relative overflow-hidden text-center">
                <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-bl-full -z-10 opacity-60"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-rose-50 rounded-tr-full -z-10 opacity-60"></div>
                
                <div className="flex justify-center">
                  <Mail className={`w-10 h-10 animate-bounce ${style.textColor}`} />
                </div>

                <div className="space-y-3">
                  <h3 className="font-serif font-extrabold text-sm text-gray-900 leading-tight">
                    Hola, mi amor ❤️
                  </h3>
                  <p className="text-[11px] text-gray-650 leading-relaxed font-serif italic whitespace-pre-line px-4 max-h-[160px] overflow-y-auto">
                    &quot;{experience.message}&quot;
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleEnter()}
                  className={`w-full py-3 text-[10px] font-extrabold rounded-xl shadow-md uppercase tracking-wider flex items-center justify-center gap-1.5 ${style.btnClass}`}
                >
                  Descubrir tu regalo
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step D: The main modular builder layout */}
        {entered && (
          <motion.div
            key="main-modular-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-md px-4 mt-6 space-y-8 flex-1 text-center"
          >
            
            {/* Header branding */}
            <div className="flex flex-col items-center justify-center py-4 border-b border-rose-100/20 mb-4">
              <span className={`text-[10px] uppercase font-bold tracking-widest ${style.textColor}`}>Experiencia Digital</span>
              <h1 className="font-serif text-lg font-extrabold text-gray-950 mt-1">{experience.title || `RecuerdoQR de ${experience.partner_name}`}</h1>
            </div>

            {/* 1. Theme Specific Hero Interaction */}
            {themeId === 'birthday' && (
              <div className="bg-gradient-to-b from-rose-50 to-pink-50 rounded-3xl p-5 border border-rose-200 shadow-md space-y-4 text-center">
                <span className="text-xs font-bold text-rose-700 uppercase tracking-widest block">
                  🎉 ¡Feliz Cumpleaños!
                </span>

                <div className="py-2 flex flex-col items-center">
                  {!candlesBlown ? (
                    <div className="flex gap-4 mb-1">
                      <div className="w-2 h-4 bg-amber-400 rounded-full animate-bounce shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                      <div className="w-2 h-4 bg-amber-400 rounded-full animate-bounce delay-75 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                      <div className="w-2 h-4 bg-amber-400 rounded-full animate-bounce delay-150 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                    </div>
                  ) : (
                    <div className="text-[10px] text-gray-400 font-mono italic animate-pulse mb-1">
                      💨 ~ deseo enviado ~
                    </div>
                  )}
                  <div className="text-6xl select-none">🎂</div>
                </div>

                {!candlesBlown ? (
                  <button
                    type="button"
                    onClick={() => {
                      setCandlesBlown(true);
                      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
                    }}
                    className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold rounded-2xl text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer animate-pulse"
                  >
                    <span>🎂 ¡Pide un deseo y toca para soplar!</span>
                  </button>
                ) : (
                  <div className="bg-white/95 p-3.5 rounded-2xl border border-rose-200 space-y-1 animate-fade-in">
                    <p className="text-xs font-bold text-rose-900">✨ ¡Deseo enviado al universo! ✨</p>
                    <p className="text-[10px] text-gray-600 font-light">Que este nuevo año de vida te traiga toda la felicidad.</p>
                  </div>
                )}

                {/* Balloons */}
                <div className="pt-2 border-t border-rose-200/60 space-y-2">
                  <span className="text-[9px] font-bold uppercase text-gray-500 tracking-wider block">
                    🎈 Toca los globos para reventar sorpresas
                  </span>
                  <div className="flex justify-center gap-4">
                    {[
                      { id: 0, msg: '¡Mucho Éxito y Alegría!' },
                      { id: 1, msg: '¡Salud y Risas Siempre!' },
                      { id: 2, msg: '¡Te Queremos Infinito!' }
                    ].map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => {
                          if (!balloonsPopped.includes(b.id)) {
                            setBalloonsPopped([...balloonsPopped, b.id]);
                            confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
                          }
                        }}
                        className="cursor-pointer transition-transform hover:scale-110"
                      >
                        {!balloonsPopped.includes(b.id) ? (
                          <span className="text-3xl">🎈</span>
                        ) : (
                          <span className="text-[9px] font-bold bg-amber-100 text-amber-900 px-2 py-1 rounded-lg border border-amber-300 block shadow-xs animate-scale-up">
                            {b.msg}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {themeId === 'pregnancy' && (
              <div
                className="rounded-3xl p-5 border shadow-md space-y-4 text-center transition-colors duration-300"
                style={{
                  backgroundColor: `${(experience.config?.customColors?.surprisePrimary || experience.config?.customColors?.primary || primaryColor || '#0284c7')}12`,
                  borderColor: `${(experience.config?.customColors?.surprisePrimary || experience.config?.customColors?.primary || primaryColor || '#0284c7')}35`
                }}
              >
                <span
                  className="text-xs font-bold uppercase tracking-wider block"
                  style={{ color: (experience.config?.customColors?.surprisePrimary || experience.config?.customColors?.primary || primaryColor || '#0284c7') }}
                >
                  🍼 Una Noticia que Cambiará Nuestras Vidas
                </span>

                {/* 1. Scratch Card */}
                <div
                  onClick={() => {
                    if (!isScratched) {
                      setIsScratched(true);
                      const sCol = experience.config?.customColors?.surprisePrimary || experience.config?.customColors?.primary || primaryColor || '#0284c7';
                      confetti({ particleCount: 90, spread: 75, colors: [sCol, '#ffffff', '#fbbf24'] });
                    }
                  }}
                  className="bg-white rounded-2xl p-5 border-2 border-dashed text-center cursor-pointer transition-all duration-300 shadow-inner min-h-[120px] flex flex-col items-center justify-center"
                  style={{ borderColor: `${(experience.config?.customColors?.surprisePrimary || experience.config?.customColors?.primary || primaryColor || '#0284c7')}60` }}
                >
                  {!isScratched ? (
                    <div className="space-y-1">
                      <div
                        className="w-12 h-12 text-white rounded-full flex items-center justify-center mx-auto text-xl shadow-md animate-pulse"
                        style={{ backgroundColor: (experience.config?.customColors?.surprisePrimary || experience.config?.customColors?.primary || primaryColor || '#0284c7') }}
                      >
                        🪙
                      </div>
                      <p className="text-xs font-bold text-gray-800">
                        {experience.config?.scratchPrompt || 'Toca aquí con tu dedo para raspar la tarjeta'}
                      </p>
                      <p
                        className="text-[9px] font-light"
                        style={{ color: (experience.config?.customColors?.surprisePrimary || experience.config?.customColors?.primary || primaryColor || '#0284c7') }}
                      >
                        ¿Estás listo/a para la gran sorpresa?
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 animate-fade-in w-full">
                      <span className="text-3xl">👶🍼✨</span>
                      <h4
                        className="font-serif font-bold text-sm"
                        style={{ color: (experience.config?.customColors?.surprisePrimary || experience.config?.customColors?.primary || primaryColor || '#0284c7') }}
                      >
                        {experience.config?.scratchSecretMessage || '¡Sorpresa! ¡Viene un Bebé en Camino!'}
                      </h4>
                      {experience.config?.scratchUltrasoundUrl && (
                        <div 
                          className="relative w-full h-36 rounded-xl overflow-hidden mt-1 shadow-xs border"
                          style={{ borderColor: `${(experience.config?.customColors?.surprisePrimary || experience.config?.customColors?.primary || primaryColor || '#0284c7')}40` }}
                        >
                          <Image 
                            src={experience.config.scratchUltrasoundUrl} 
                            alt="Ecografía" 
                            fill
                            sizes="(max-width: 768px) 100vw, 400px"
                            className="object-cover" 
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 2 & 3: ONLY VISIBLE AFTER SCRATCHING */}
                {isScratched && (
                  <div className="space-y-3 animate-fade-in">
                    
                    {/* FAMILY POLL */}
                    <div
                      className="bg-white/95 rounded-2xl p-3 border space-y-2.5"
                      style={{ borderColor: `${(experience.config?.customColors?.surprisePrimary || experience.config?.customColors?.primary || primaryColor || '#0284c7')}30` }}
                    >
                      <span
                        className="text-xs font-bold block"
                        style={{ color: (experience.config?.customColors?.surprisePrimary || experience.config?.customColors?.primary || primaryColor || '#0284c7') }}
                      >
                        {experience.config?.pollQuestion || '¿Qué crees que será? 🍼'}
                      </span>
                      <div className="grid grid-cols-2 gap-2.5">
                        <button
                          type="button"
                          onClick={() => {
                            setPregnancyPollVote('A');
                            confetti({ particleCount: 40, colors: ['#3b82f6'] });
                          }}
                          className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                            pregnancyPollVote === 'A' ? 'bg-blue-600 text-white shadow-md' : 'bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100'
                          }`}
                        >
                          {pregnancyPollVote === 'A' && <Check className="w-3.5 h-3.5" />}
                          <span>{experience.config?.pollOptionA || 'Team Niño 💙'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setPregnancyPollVote('B');
                            confetti({ particleCount: 40, colors: ['#ec4899'] });
                          }}
                          className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                            pregnancyPollVote === 'B' ? 'bg-pink-600 text-white shadow-md' : 'bg-pink-50 text-pink-800 border border-pink-200 hover:bg-pink-100'
                          }`}
                        >
                          {pregnancyPollVote === 'B' && <Check className="w-3.5 h-3.5" />}
                          <span>{experience.config?.pollOptionB || 'Team Niña 💖'}</span>
                        </button>
                      </div>
                      {pregnancyPollVote && (
                        <p className="text-[10px] text-emerald-700 font-bold animate-fade-in">✓ ¡Voto familiar registrado!</p>
                      )}
                    </div>

                    {/* COUNTDOWN TO ARRIVAL */}
                    <div
                      className="bg-white/95 rounded-2xl p-4 border text-center space-y-1.5 shadow-2xs"
                      style={{ borderColor: `${(experience.config?.customColors?.surprisePrimary || experience.config?.customColors?.primary || primaryColor || '#0284c7')}35` }}
                    >
                      <span
                        className="text-[9px] uppercase tracking-wider font-bold block"
                        style={{ color: (experience.config?.customColors?.surprisePrimary || experience.config?.customColors?.primary || primaryColor || '#0284c7') }}
                      >
                        🍼 Cuenta Regresiva de Llegada del Bebé
                      </span>
                      <div className="grid grid-cols-4 gap-1.5 text-center font-mono">
                        <div
                          className="p-2 rounded-xl border"
                          style={{
                            backgroundColor: `${(experience.config?.customColors?.surprisePrimary || experience.config?.customColors?.primary || primaryColor || '#0284c7')}12`,
                            borderColor: `${(experience.config?.customColors?.surprisePrimary || experience.config?.customColors?.primary || primaryColor || '#0284c7')}25`
                          }}
                        >
                          <span
                            className="block text-sm font-bold"
                            style={{ color: (experience.config?.customColors?.surprisePrimary || experience.config?.customColors?.primary || primaryColor || '#0284c7') }}
                          >
                            {timeElapsed.days}
                          </span>
                          <span className="text-[7px] text-gray-500 uppercase">Días</span>
                        </div>
                        <div
                          className="p-2 rounded-xl border"
                          style={{
                            backgroundColor: `${(experience.config?.customColors?.surprisePrimary || experience.config?.customColors?.primary || primaryColor || '#0284c7')}12`,
                            borderColor: `${(experience.config?.customColors?.surprisePrimary || experience.config?.customColors?.primary || primaryColor || '#0284c7')}25`
                          }}
                        >
                          <span
                            className="block text-sm font-bold"
                            style={{ color: (experience.config?.customColors?.surprisePrimary || experience.config?.customColors?.primary || primaryColor || '#0284c7') }}
                          >
                            {timeElapsed.hours}
                          </span>
                          <span className="text-[7px] text-gray-500 uppercase">Horas</span>
                        </div>
                        <div
                          className="p-2 rounded-xl border"
                          style={{
                            backgroundColor: `${(experience.config?.customColors?.surprisePrimary || experience.config?.customColors?.primary || primaryColor || '#0284c7')}12`,
                            borderColor: `${(experience.config?.customColors?.surprisePrimary || experience.config?.customColors?.primary || primaryColor || '#0284c7')}25`
                          }}
                        >
                          <span
                            className="block text-sm font-bold"
                            style={{ color: (experience.config?.customColors?.surprisePrimary || experience.config?.customColors?.primary || primaryColor || '#0284c7') }}
                          >
                            {timeElapsed.minutes}
                          </span>
                          <span className="text-[7px] text-gray-500 uppercase">Min</span>
                        </div>
                        <div
                          className="p-2 rounded-xl border"
                          style={{
                            backgroundColor: `${(experience.config?.customColors?.surprisePrimary || experience.config?.customColors?.primary || primaryColor || '#0284c7')}12`,
                            borderColor: `${(experience.config?.customColors?.surprisePrimary || experience.config?.customColors?.primary || primaryColor || '#0284c7')}25`
                          }}
                        >
                          <span
                            className="block text-sm font-bold"
                            style={{ color: (experience.config?.customColors?.surprisePrimary || experience.config?.customColors?.primary || primaryColor || '#0284c7') }}
                          >
                            {timeElapsed.seconds}
                          </span>
                          <span className="text-[7px] text-gray-500 uppercase">Seg</span>
                        </div>
                      </div>
                      <p
                        className="text-[8px] font-light"
                        style={{ color: (experience.config?.customColors?.surprisePrimary || experience.config?.customColors?.primary || primaryColor || '#0284c7') }}
                      >
                        Fecha estimada de nacimiento: {experience.special_date || 'Próximamente'}
                      </p>
                    </div>

                  </div>
                )}
              </div>
            )}

            {/* 3. ANNIVERSARY STATS */}
            {themeId === 'anniversary' && (
              <div
                className="rounded-3xl p-5 border shadow-md space-y-4 text-center transition-colors duration-300"
                style={{
                  backgroundColor: `${primaryColor}12`,
                  borderColor: `${primaryColor}35`
                }}
              >
                <span className="text-xs font-bold uppercase tracking-wider block" style={{ color: primaryColor }}>
                  ❤️ Nuestro Aniversario de Amor
                </span>
                <div className="bg-white/95 rounded-2xl p-4 border space-y-2" style={{ borderColor: `${primaryColor}30` }}>
                  <span className="text-[10px] font-bold uppercase block" style={{ color: primaryColor }}>📊 Nuestras Estadísticas</span>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-xl" style={{ backgroundColor: `${primaryColor}10` }}>
                      <span className="text-sm font-bold block" style={{ color: primaryColor }}>{experience.config?.statsKisses || '2.500+'}</span>
                      <span className="text-[9px] font-medium text-gray-600 block mt-0.5">{experience.config?.statsKissesLabel || 'Besos'}</span>
                    </div>
                    <div className="p-2 rounded-xl" style={{ backgroundColor: `${primaryColor}10` }}>
                      <span className="text-sm font-bold block" style={{ color: primaryColor }}>{experience.config?.statsCoffees || '800+'}</span>
                      <span className="text-[9px] font-medium text-gray-600 block mt-0.5">{experience.config?.statsCoffeesLabel || 'Citas'}</span>
                    </div>
                    <div className="p-2 rounded-xl" style={{ backgroundColor: `${primaryColor}10` }}>
                      <span className="text-sm font-bold block" style={{ color: primaryColor }}>{experience.config?.statsSmiles || '1.000.000+'}</span>
                      <span className="text-[9px] font-medium text-gray-600 block mt-0.5">{experience.config?.statsSmilesLabel || 'Sonrisas'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. DATING & MARRIAGE PROPOSALS */}
            {(themeId === 'dating-proposal' || themeId === 'marriage-proposal') && (
              <div
                className="rounded-3xl p-5 border shadow-md space-y-4 text-center transition-colors duration-300"
                style={{
                  backgroundColor: `${primaryColor}12`,
                  borderColor: `${primaryColor}35`
                }}
              >
                <span className="text-4xl select-none">{themeId === 'marriage-proposal' ? '💍' : '💌'}</span>
                <h3 className="font-serif font-bold text-base" style={{ color: textColor }}>
                  {experience.config?.proposalQuestion || (themeId === 'marriage-proposal' ? '¿Te quieres casar conmigo? 💍' : '¿Quieres ser mi novia/o? ❤️')}
                </h3>

                {proposalResponse !== 'yes' ? (
                  <div className="flex justify-center gap-3 pt-1 relative">
                    <button
                      type="button"
                      onClick={() => {
                        setProposalResponse('yes');
                        confetti({ particleCount: 120, spread: 85, origin: { y: 0.5 } });
                      }}
                      style={{ backgroundColor: primaryColor }}
                      className="px-6 py-2.5 text-white font-bold rounded-full text-xs shadow-md transition hover:scale-105 cursor-pointer animate-pulse"
                    >
                      {experience.config?.proposalYesText || '¡Sí, Acepto! ❤️'}
                    </button>

                    <button
                      type="button"
                      onMouseEnter={() => setNoBtnOffset({ x: (Math.random() - 0.5) * 80, y: (Math.random() - 0.5) * 50 })}
                      style={{ transform: `translate(${noBtnOffset.x}px, ${noBtnOffset.y}px)` }}
                      className="px-4 py-2.5 bg-gray-200 text-gray-600 font-bold rounded-full text-xs transition-all duration-150"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <div className="bg-white/95 p-4 rounded-2xl border space-y-2 animate-fade-in" style={{ borderColor: `${primaryColor}40` }}>
                    <p className="text-sm font-bold" style={{ color: primaryColor }}>💖 ¡Dijiste que Sí! 💖</p>
                    <p className="text-xs text-gray-700 font-light">{experience.config?.proposalCelebrationText || '¡Nuestra historia oficial comienza hoy!'}</p>
                    
                    {themeId === 'dating-proposal' && (
                      <div className="mt-3 p-4 bg-gradient-to-br from-rose-50 via-white to-amber-50 rounded-2xl border-2 border-dashed border-rose-300 text-center space-y-1.5 shadow-xs">
                        <span className="text-2xl block">📜❤️</span>
                        <h5 className="font-serif font-extrabold text-xs text-[#a21232]">Certificado Oficial de Noviazgo</h5>
                        <p className="text-[10px] text-gray-700 italic leading-relaxed">
                          Se certifica solemnemente que hoy comienza nuestra historia oficial entre <strong>{experience.user_name || 'Tu pareja'}</strong> y <strong>{experience.partner_name || 'Tú'}</strong>.
                        </p>
                      </div>
                    )}

                    {themeId === 'marriage-proposal' && (
                      <div
                        onClick={() => setIsRingBoxOpened(!isRingBoxOpened)}
                        className="mt-3 p-4 bg-zinc-900 text-amber-200 rounded-2xl cursor-pointer border border-amber-400/40 space-y-1.5 transition-transform active:scale-95"
                      >
                        <span className="text-3xl block">{isRingBoxOpened ? '💎💍✨' : '📦'}</span>
                        <p className="text-xs font-serif font-bold">
                          {isRingBoxOpened ? (experience.config?.ringBoxMessage || 'Prometo amarte y cuidarte cada día de mi vida 💍') : 'Toca la cajita de terciopelo para abrir el anillo'}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 5. SURPRISE GIFT */}
            {themeId === 'surprise' && (
              <div
                className="rounded-3xl p-5 border shadow-md space-y-4 transition-colors duration-300"
                style={{
                  backgroundColor: `${primaryColor}12`,
                  borderColor: `${primaryColor}35`
                }}
              >
                <span className="text-xs font-bold uppercase tracking-wider block" style={{ color: primaryColor }}>
                  🎁 Tienes un Regalo Especial
                </span>

                <div
                  onClick={() => {
                    if (!giftOpened) {
                      setGiftOpened(true);
                      confetti({ particleCount: 80, spread: 70 });
                    }
                  }}
                  className="cursor-pointer py-4 transition-transform hover:scale-105 flex flex-col items-center"
                >
                  {!giftOpened ? (
                    <div className="space-y-1.5 text-center">
                      <span className="text-6xl select-none inline-block animate-bounce">🎁</span>
                      <p className="text-xs font-bold" style={{ color: primaryColor }}>Toca la caja para abrir tu regalo</p>
                    </div>
                  ) : (
                    <div
                      className="rounded-2xl p-5 border-2 border-dashed shadow-md space-y-2.5 animate-fade-in w-full text-left bg-white/95"
                      style={{ borderColor: primaryColor }}
                    >
                      <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: `${primaryColor}30` }}>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest" style={{ color: primaryColor }}>
                          🎟️ {experience.config?.ticketTitle || 'Pase VIP / Cupón de Regalo'}
                        </span>
                        <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded" style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}>
                          VIP-2026
                        </span>
                      </div>
                      
                      <p className="text-sm font-serif font-bold italic leading-relaxed" style={{ color: textColor }}>
                        &quot;{experience.config?.surpriseMessage || experience.message || 'Una cena romántica este fin de semana'}&quot;
                      </p>

                      <p className="text-[9px] opacity-70 font-light border-t pt-1.5" style={{ borderColor: `${primaryColor}20` }}>
                        {experience.config?.ticketConditions || 'Válido para canjear cuando tú quieras ❤️'}
                      </p>

                      {/* Golden Barcode */}
                      <div className="pt-2 flex justify-between items-center border-t border-dashed" style={{ borderColor: `${primaryColor}30` }}>
                        <div className="flex gap-0.5 items-center h-4">
                          {[2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2].map((w, bI) => (
                            <div key={bI} className="bg-gray-800 h-full" style={{ width: `${w * 1.5}px` }} />
                          ))}
                        </div>
                        <span className="font-mono text-[8px] text-gray-400 font-bold">#TICKET-VIP-GOLD</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 6. LOVE LETTER (Wax Seal) */}
            {themeId === 'love-letter' && (
              <div
                className="rounded-3xl p-5 border shadow-md space-y-4 transition-colors duration-300"
                style={{
                  backgroundColor: `${primaryColor}12`,
                  borderColor: `${primaryColor}35`
                }}
              >
                <div onClick={() => setIsWaxSealBroken(!isWaxSealBroken)} className="cursor-pointer space-y-2">
                  {!isWaxSealBroken ? (
                    <div className="space-y-2 text-center">
                      <span className="text-5xl select-none">💌</span>
                      <p className="text-xs font-bold" style={{ color: primaryColor }}>Toca el sello de cera para abrir la carta</p>
                    </div>
                  ) : (
                    <div
                      className="p-4 rounded-2xl border text-left space-y-2 shadow-inner animate-fade-in bg-white/95"
                      style={{ borderColor: `${primaryColor}40` }}
                    >
                      <h4 className="font-serif font-bold text-xs" style={{ color: primaryColor }}>De mi corazón para ti:</h4>
                      <p className="text-xs font-serif leading-relaxed italic whitespace-pre-wrap" style={{ color: textColor }}>
                        {experience.history_text || experience.message}
                      </p>
                      <span className="text-[9px] font-bold block text-right opacity-75" style={{ color: primaryColor }}>
                        ~ {experience.config?.waxSealSender || experience.user_name || 'Con Todo Mi Amor'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 7. LOVE CONFESSION (Crystal Heart) */}
            {themeId === 'love-confession' && (
              <div
                className="text-white rounded-3xl p-5 border shadow-md space-y-4 transition-colors duration-300"
                style={{
                  backgroundColor: '#0f172a',
                  borderColor: `${primaryColor}60`
                }}
              >
                <span className="text-[10px] font-bold uppercase tracking-widest block" style={{ color: primaryColor }}>
                  💖 Confesión Abierta
                </span>
                
                <div
                  onClick={() => setCrystalUnlocked(!crystalUnlocked)}
                  className="cursor-pointer p-4 rounded-2xl border transition space-y-2"
                  style={{
                    backgroundColor: `${primaryColor}15`,
                    borderColor: `${primaryColor}40`
                  }}
                >
                  <span className="text-5xl block animate-pulse">💎✨</span>
                  {!crystalUnlocked ? (
                    <p className="text-xs font-bold" style={{ color: primaryColor }}>
                      {experience.config?.crystalHeartTitle || 'Toca el Corazón de Cristal'}
                    </p>
                  ) : (
                    <div className="space-y-1.5 animate-fade-in">
                      <p className="text-sm font-serif italic text-white font-bold leading-relaxed">
                        &quot;{experience.config?.crystalHeartSecret || experience.message}&quot;
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 8. VALENTINES */}
            {themeId === 'valentines' && (
              <div
                className="rounded-3xl p-5 border shadow-md space-y-4 text-center transition-colors duration-300"
                style={{
                  backgroundColor: `${primaryColor}12`,
                  borderColor: `${primaryColor}35`
                }}
              >
                <span className="text-4xl select-none">🌹🍫</span>
                <h3 className="font-serif font-bold text-sm" style={{ color: primaryColor }}>
                  {experience.config?.valentineBoxTitle || 'Caja de Bombones de San Valentín 🍫'}
                </h3>
                
                {/* VALE ROMÁNTICO VIP */}
                <div className="p-4 bg-gradient-to-br from-amber-50 via-white to-rose-50 rounded-2xl border-2 border-dashed border-rose-300 shadow-md text-left space-y-2 relative overflow-hidden">
                  <div className="flex justify-between items-center border-b border-rose-200 pb-1">
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-rose-800 flex items-center gap-1">
                      <span>🎟️</span> VALE ROMÁNTICO OFICIAL
                    </span>
                    <span className="text-[8px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-mono">
                      SAN VALENTÍN
                    </span>
                  </div>
                  <p className="text-xs font-serif font-bold italic leading-relaxed text-gray-900">
                    &quot;{experience.config?.valentineCoupon || 'Vale por nuestra cita soñada de San Valentín ❤️'}&quot;
                  </p>
                  <div className="flex justify-between items-center text-[7px] text-gray-500 font-light pt-1 border-t border-rose-100">
                    <span>Válido para canjear en cualquier momento ❤️</span>
                    <span className="font-mono font-bold text-rose-700">100% AMOR</span>
                  </div>
                </div>
              </div>
            )}

            {/* 9. SPECIAL CONGRATULATIONS */}
            {themeId === 'special' && (
              <div
                className="rounded-3xl p-5 border shadow-md space-y-4 text-center transition-colors duration-300"
                style={{
                  backgroundColor: `${primaryColor}12`,
                  borderColor: `${primaryColor}35`
                }}
              >
                <button
                  type="button"
                  onClick={() => confetti({ particleCount: 90, spread: 90, origin: { y: 0.5 } })}
                  style={{ backgroundColor: primaryColor }}
                  className="w-full py-2.5 text-white font-bold rounded-2xl text-xs shadow-sm flex items-center justify-center gap-2 cursor-pointer animate-pulse"
                >
                  <PartyPopper className="w-4 h-4" />
                  <span>🎆 Toca para Llenar de Fuegos Artificiales</span>
                </button>

                <div className="bg-gradient-to-b from-amber-50/50 via-white to-amber-50/30 rounded-2xl p-5 border-2 border-amber-300 shadow-md space-y-2 text-center">
                  <div className="flex justify-center items-center gap-1.5">
                    <span className="text-2xl">📜</span>
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-amber-800 font-mono">DIPLOMA DE HONOR OFICIAL</span>
                  </div>
                  <h4 className="font-serif font-extrabold text-sm text-gray-900" style={{ color: primaryColor }}>
                    {experience.config?.trophyTitle || 'Trofeo al Mayor Logro 🏆'}
                  </h4>
                  <p className="text-xs font-bold text-amber-900">{experience.config?.trophyCategory || '¡Orgullo Total por tu Gran Meta Cumplida!'}</p>
                  <p className="text-[10px] font-serif italic text-gray-700 border-t border-amber-200/60 pt-2 leading-relaxed">
                    &quot;{experience.config?.diplomaText || 'Reconocimiento oficial a la persona más talentosa y perseverante.'}&quot;
                  </p>
                  <div className="flex justify-between items-center pt-2 border-t border-amber-200/40 text-[7px] text-gray-400 font-mono">
                    <span>EXPEDIDO CON ORGULLO</span>
                    <span>META CUMPLIDA ✨</span>
                  </div>
                </div>
              </div>
            )}

            {/* 10. GRATITUDE */}
            {themeId === 'gratitude' && (
              <div
                className="rounded-3xl p-5 border shadow-md space-y-4 text-center transition-colors duration-300"
                style={{
                  backgroundColor: `${primaryColor}12`,
                  borderColor: `${primaryColor}35`
                }}
              >
                <span className="text-xs font-bold uppercase tracking-widest block" style={{ color: primaryColor }}>
                  🙏 Frasco de Gratitud Infinita
                </span>
                <p className="text-[10px] text-gray-600 font-light">Toca cada estrella para revelar un agradecimiento especial:</p>

                <div className="flex justify-center gap-3">
                  {[0, 1, 2].map((idx) => {
                    const defaultPhrases = [
                      'Gracias por tu apoyo incondicional ✨',
                      'Gracias por creer siempre en mí 🌟',
                      'Gracias por iluminar mi vida 💛'
                    ];
                    const phrase = [
                      experience.config?.gratitudeStar1,
                      experience.config?.gratitudeStar2,
                      experience.config?.gratitudeStar3
                    ][idx] || defaultPhrases[idx];

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          if (!starsRevealed.includes(idx)) {
                            setStarsRevealed([...starsRevealed, idx]);
                            confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
                          }
                        }}
                        className="cursor-pointer transition-transform hover:scale-110"
                      >
                        {!starsRevealed.includes(idx) ? (
                          <span className="text-4xl">⭐</span>
                        ) : (
                          <span
                            className="text-[9px] font-bold p-2.5 rounded-xl border block shadow-sm max-w-[100px] leading-tight animate-scale-up"
                            style={{
                              backgroundColor: `${primaryColor}15`,
                              borderColor: `${primaryColor}40`,
                              color: primaryColor
                            }}
                          >
                            {phrase}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 11. RECONCILIATION */}
            {themeId === 'reconciliation' && (
              <div
                className="rounded-3xl p-5 border shadow-md space-y-4 text-center transition-colors duration-300"
                style={{
                  backgroundColor: `${primaryColor}12`,
                  borderColor: `${primaryColor}35`
                }}
              >
                <span className="text-xs font-bold uppercase tracking-widest block" style={{ color: primaryColor }}>
                  🕊️ Unir Nuestros Caminos
                </span>

                {!heartUnited ? (
                  <button
                    type="button"
                    onClick={() => {
                      setHeartUnited(true);
                      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
                    }}
                    className="w-full p-4 bg-white rounded-2xl border hover:bg-gray-50 transition cursor-pointer space-y-1.5 shadow-sm"
                    style={{ borderColor: `${primaryColor}35` }}
                  >
                    <span className="text-4xl block animate-bounce">💔 ➔ 💖</span>
                    <p className="text-xs font-bold" style={{ color: primaryColor }}>Toca para unir las dos mitades</p>
                  </button>
                ) : (
                  <div className="bg-white/95 p-4 rounded-2xl border shadow-sm space-y-2.5 animate-fade-in text-center" style={{ borderColor: `${primaryColor}40` }}>
                    <span className="text-4xl block">💖✨</span>
                    <p className="text-sm font-serif font-bold" style={{ color: primaryColor }}>
                      {experience.config?.reconciliationQuestion || 'Nuestro amor es más fuerte que cualquier error. ¿Hacemos las paces? 🤝❤️'}
                    </p>
                    <p className="text-xs italic leading-relaxed text-gray-700">
                      &quot;{experience.config?.reconciliationPromise || 'Prometo aprender, escucharte y valorar cada instante a tu lado.'}&quot;
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Dynamic rendering of chosen sections */}
            {(() => {
              let publicGalleryIdx = 0;
              return experience.sections?.map((sec) => {
              
              if (sec.type === 'portada') return null; // Already displayed in gate steps

              if (sec.type === 'carta') {
                if (themeId === 'love-letter') return null;
                const cartaText = sec.content?.text || sec.content?.message || experience.history_text || experience.message || 'Eres lo más hermoso que me ha pasado en la vida. Cada instante a tu lado es un regalo que atesoro en mi corazón...';
                return (
                  <div key={sec.id} className="py-2 space-y-3">
                    <div 
                      className="relative overflow-hidden rounded-3xl border transition-all duration-300 shadow-md"
                      style={{
                        borderColor: `${primaryColor}40`,
                        backgroundColor: isCartaEnvelopeOpen ? '#fffefc' : `${primaryColor}08`
                      }}
                    >
                      {!isCartaEnvelopeOpen ? (
                        /* SOBRE CERRADO CON LA CHAPITA PULSANTE */
                        <div 
                          onClick={() => {
                            setIsCartaEnvelopeOpen(true);
                            confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 }, colors: [primaryColor, '#f43f5e', '#ffffff'] });
                          }}
                          className="p-5 flex flex-col items-center justify-center text-center space-y-3 cursor-pointer group hover:bg-white/60 transition"
                        >
                          {/* Ilustración de Sobre */}
                          <div className="relative w-32 h-20 bg-gradient-to-b from-rose-100 to-rose-200/90 rounded-2xl border-2 border-rose-300 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                            {/* Solapa del Sobre */}
                            <div className="absolute top-0 inset-x-0 h-10 bg-rose-200/95 rounded-b-xl border-b border-rose-300 shadow-2xs"></div>
                            
                            {/* 🎖️ LA CHAPITA / SELLO DE CERA INTERACTIVO */}
                            <div 
                              className="relative z-10 px-3.5 py-1.5 rounded-full text-white font-bold text-[10px] shadow-xl flex items-center gap-1.5 animate-bounce group-hover:animate-none group-hover:scale-110 transition-transform"
                              style={{ backgroundColor: primaryColor }}
                            >
                              <span className="text-xs">✨</span>
                              <span>¡Aprieta aquí!</span>
                            </div>
                          </div>

                          <div className="space-y-0.5">
                            <h4 className="font-serif font-bold text-xs" style={{ color: primaryColor }}>
                              💌 {sec.title || (themeId === 'love-letter' ? 'Carta de Amor Secreta' : 'Tienes una Carta de Dedicatoria')}
                            </h4>
                            <p className="text-[9px] text-gray-500 font-light">
                              Toca la chapita del sobre para abrirla
                            </p>
                          </div>
                        </div>
                      ) : (
                        /* CARTA ABIERTA EN PERGAMINO */
                        <div className="p-5 text-left space-y-3 bg-gradient-to-b from-amber-50/40 via-white to-rose-50/30 animate-fade-in">
                          <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: `${primaryColor}25` }}>
                            <span className="text-[9px] font-extrabold uppercase tracking-wider flex items-center gap-1.5" style={{ color: primaryColor }}>
                              <Mail className="w-3.5 h-3.5" /> {sec.title || 'Carta de Dedicatoria'}
                            </span>
                            <button
                              type="button"
                              onClick={() => setIsCartaEnvelopeOpen(false)}
                              className="text-[8px] font-bold px-2 py-0.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition cursor-pointer"
                            >
                              ✉️ Guardar en sobre
                            </button>
                          </div>

                          <div className="space-y-2 py-1">
                            <h3 className="font-serif font-extrabold text-sm" style={{ color: primaryColor }}>
                              De mi corazón para ti ❤️
                            </h3>
                            <p className="text-xs font-serif italic leading-relaxed whitespace-pre-line text-gray-800 font-light">
                              {cartaText}
                            </p>
                          </div>

                          <div className="pt-2 border-t flex items-center justify-between" style={{ borderColor: `${primaryColor}15` }}>
                            <span className="text-[8px] font-mono text-gray-400">
                              📅 {experience.special_date || 'Para Siempre'}
                            </span>
                            <span className="text-[9px] font-serif font-bold italic" style={{ color: primaryColor }}>
                              De: {experience.user_name || 'Alguien que te ama'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              }

              if (sec.type === 'contador') {
                let counterHeader = sec.title;
                if (!counterHeader) {
                  if (themeId === 'birthday') counterHeader = `¡Celebrando la Vida de ${experience.partner_name || 'Festejado/a'}! 🎂`;
                  else if (themeId === 'love-confession') counterHeader = 'Días que Llevo Pensando en Ti 💭';
                  else if (themeId === 'special') counterHeader = 'Días de Esfuerzo & Dedicación hasta la Meta 🏆';
                  else if (themeId === 'reconciliation') counterHeader = 'Días Compartidos que Valen Más que Cualquier Error 🕊️';
                  else if (themeId === 'pregnancy') counterHeader = 'Cuenta Regresiva al Nacimiento 👣';
                  else counterHeader = 'Tiempo Compartido Juntos ⏱️';
                }

                let col1Val: string | number = timeElapsed.years;
                let col1Label = 'Años';
                let col2Val: string | number = timeElapsed.days;
                let col2Label = 'Días';

                if (themeId === 'pregnancy') {
                  const target = experience.special_date ? new Date(experience.special_date).getTime() : 0;
                  const diff = target - new Date().getTime();
                  if (diff > 0) {
                    const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
                    col1Val = Math.floor(totalDays / 7).toString();
                    col2Val = (totalDays % 7).toString();
                    col1Label = 'Semanas';
                    col2Label = 'Días';
                  } else {
                    col1Val = '0';
                    col2Val = '0';
                    col1Label = 'Semanas';
                    col2Label = 'Días';
                  }
                }

                return (
                  <div key={sec.id} className={`rounded-3xl p-6 shadow-md border text-center space-y-4 ${style.cardClass}`}>
                    <h3 className={`font-serif font-extrabold text-sm ${style.textColor}`}>
                      {counterHeader}
                    </h3>
                    <div className="grid grid-cols-5 gap-1.5 text-center">
                      <div className="bg-rose-50/40 p-2 rounded-xl border border-rose-100/25">
                        <span className={`block font-serif text-base font-extrabold ${style.textColor}`}>{col1Val}</span>
                        <span className="text-[7px] text-gray-400 font-bold uppercase block">{col1Label}</span>
                      </div>
                      <div className="bg-rose-50/40 p-2 rounded-xl border border-rose-100/25">
                        <span className={`block font-serif text-base font-extrabold ${style.textColor}`}>{col2Val}</span>
                        <span className="text-[7px] text-gray-400 font-bold uppercase block">{col2Label}</span>
                      </div>
                      <div className="bg-rose-50/40 p-2 rounded-xl border border-rose-100/25">
                        <span className={`block font-serif text-base font-extrabold ${style.textColor}`}>{timeElapsed.hours}</span>
                        <span className="text-[7px] text-gray-400 font-bold uppercase block">Horas</span>
                      </div>
                      <div className="bg-rose-50/40 p-2 rounded-xl border border-rose-100/25">
                        <span className={`block font-serif text-base font-extrabold ${style.textColor}`}>{timeElapsed.minutes}</span>
                        <span className="text-[7px] text-gray-400 font-bold uppercase block">Min</span>
                      </div>
                      <div className="bg-rose-50/40 p-2 rounded-xl border border-rose-100/25">
                        <span className={`block font-serif text-base font-extrabold ${style.textColor}`}>{timeElapsed.seconds}</span>
                        <span className="text-[7px] text-gray-400 font-bold uppercase block">Seg</span>
                      </div>
                    </div>
                  </div>
                );
              }

              if (sec.type === 'pregunta') {
                const questionText = sec.content?.question || experience.config?.proposalQuestion || (themeId === 'marriage-proposal' ? '¿Te quieres casar conmigo? 💍' : '¿Quieres ser mi novia/o? ❤️');
                return (
                  <div key={sec.id} className={`rounded-3xl p-6 shadow-md border text-center space-y-4 relative overflow-hidden ${style.cardClass}`}>
                    <h3 className={`font-serif font-extrabold text-sm ${style.textColor}`}>
                      {sec.title || 'Una Pregunta Especial'}
                    </h3>
                    <p className="text-xs text-gray-800 font-serif leading-relaxed px-4">{questionText}</p>
                    
                    {proposalResponse === 'yes' ? (
                      <div className="space-y-2.5 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-800 animate-bounce">
                        <PartyPopper className="w-8 h-8 mx-auto text-emerald-650" />
                        <h4 className="font-extrabold text-xs">¡Dijo que SÍ! 💖</h4>
                        <p className="text-[9px] leading-relaxed">Este momento quedará guardado para siempre en nuestra historia.</p>
                      </div>
                    ) : (
                      <div className="flex gap-4 justify-center items-center py-4 relative min-h-[50px]">
                        <button
                          type="button"
                          onClick={() => {
                            setProposalResponse('yes');
                            confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
                          }}
                          className={`px-6 py-2.5 text-xs font-extrabold rounded-xl shadow-md transition ${style.btnClass}`}
                        >
                          ¡Sí!
                        </button>
                        <motion.button
                          type="button"
                          animate={{ x: noBtnOffset.x, y: noBtnOffset.y }}
                          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                          onHoverStart={() => {
                            setNoBtnOffset({
                              x: (Math.random() - 0.5) * 200,
                              y: (Math.random() - 0.5) * 120
                            });
                          }}
                          onTouchStart={() => {
                            setNoBtnOffset({
                              x: (Math.random() - 0.5) * 200,
                              y: (Math.random() - 0.5) * 120
                            });
                          }}
                          className="px-6 py-2.5 bg-gray-200 border border-gray-300 text-gray-500 text-xs font-extrabold rounded-xl shadow-sm cursor-default"
                        >
                          No
                        </motion.button>
                      </div>
                    )}
                  </div>
                );
              }

              if (sec.type === 'secreto') {
                const secretPasscode = sec.content?.passcode || experience.config?.secretPasscode || '1234';
                const secretText = sec.content?.text || sec.content?.message || experience.config?.secretMessage || '¡Te amo con todo mi corazón!';
                return (
                  <div key={sec.id} className={`rounded-3xl p-6 shadow-md border text-center space-y-4 ${style.cardClass}`}>
                    <h3 className={`font-serif font-extrabold text-sm ${style.textColor}`}>
                      {sec.title || 'Mensaje Oculto 🔒'}
                    </h3>
                    {secretUnlocked ? (
                      <div className="p-4 bg-rose-50/20 border border-rose-100 rounded-2xl text-left animate-fade-in space-y-2">
                        <span className="text-[9px] font-bold text-[#a21232] uppercase">Mensaje Revelado</span>
                        <p className="text-xs text-gray-700 leading-relaxed font-light whitespace-pre-line">{secretText}</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-[10px] text-gray-450 font-light">Ingresa la contraseña de 4 dígitos para ver el mensaje secreto:</p>
                        <div className="flex gap-2 justify-center max-w-[180px] mx-auto">
                          <input
                            type="text"
                            maxLength={6}
                            placeholder="PIN"
                            value={secretInputPin}
                            onChange={(e) => {
                              const val = e.target.value;
                              setSecretInputPin(val);
                              if (val === secretPasscode) {
                                setSecretUnlocked(true);
                                confetti({ particleCount: 40, spread: 40, colors: ['#ff8fa3'] });
                              }
                            }}
                            className="w-full text-center px-4 py-2 border border-gray-250 rounded-xl focus:outline-none focus:border-rose-350 text-xs font-mono font-bold tracking-[8px]"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              if (sec.type === 'sorpresa') {
                const surpriseMsg = sec.content?.message || experience.config?.surpriseMessage || '¡Una sorpresa especial para ti! ❤️';
                return (
                  <div key={sec.id} className={`rounded-3xl p-6 shadow-md border text-center space-y-4 ${style.cardClass}`}>
                    <h3 className={`font-serif font-extrabold text-sm ${style.textColor}`}>
                      {sec.title || '¡Una Sorpresa Especial! 🎁'}
                    </h3>
                    {surpriseRevealed ? (
                      <div className="p-4 bg-indigo-50 border border-indigo-150 rounded-2xl text-center space-y-2 animate-scale-up">
                        <PartyPopper className="w-8 h-8 mx-auto text-indigo-500" />
                        <h4 className="font-bold text-xs text-indigo-900">¡Regalo Abierto!</h4>
                        <p className="text-xs text-indigo-950 font-light leading-relaxed">{surpriseMsg}</p>
                      </div>
                    ) : (
                      <div className="py-6 flex flex-col items-center">
                        <motion.div
                          animate={{ rotate: [0, -5, 5, -5, 5, 0] }}
                          transition={{ repeat: Infinity, duration: 1.5, repeatType: "mirror" }}
                          onClick={() => {
                            setSurpriseRevealed(true);
                            confetti({ particleCount: 80, colors: ['#4f46e5', '#a5b4fc'] });
                          }}
                          className="w-20 h-20 bg-gradient-to-tr from-indigo-500 to-indigo-400 rounded-3xl shadow-xl flex items-center justify-center cursor-pointer border border-indigo-300 relative group"
                        >
                          <Gift className="w-10 h-10 text-white group-hover:scale-110 transition-transform" />
                        </motion.div>
                        <span className="text-[9px] text-gray-450 uppercase mt-4 block">Haz clic en la caja para abrir</span>
                      </div>
                    )}
                  </div>
                );
              }

              if (sec.type === 'lugar') {
                const addressStr = sec.content?.address || experience.config?.specialAddress || '';
                return (
                  <div key={sec.id} className={`rounded-3xl p-6 shadow-md border text-left space-y-3 ${style.cardClass}`}>
                    <div className="flex items-center gap-2 border-b pb-2">
                      <MapPin className="w-5 h-5 text-rose-500 shrink-0" />
                      <h3 className={`font-serif font-extrabold text-sm ${style.textColor}`}>
                        {sec.title || 'Nuestro Lugar Especial'}
                      </h3>
                    </div>
                    <p className="text-xs text-gray-700 font-bold px-1">{addressStr || 'Lugar inolvidable'}</p>
                    
                    {addressStr && (
                      <div className="aspect-video rounded-2xl overflow-hidden shadow-inner border border-gray-100 bg-gray-50">
                        <iframe
                          src={`https://maps.google.com/maps?q=${encodeURIComponent(addressStr)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                          frameBorder="0"
                          scrolling="no"
                          marginHeight={0}
                          marginWidth={0}
                          className="w-full h-full border-0"
                          title="Lugar especial"
                        ></iframe>
                      </div>
                    )}
                  </div>
                );
              }

              if (sec.type === 'video') {
                const videoSource = sec.content?.url || experience.config?.uploadedVideoUrl || '';
                const isDirectFile = videoSource.startsWith('blob:') || 
                                     videoSource.endsWith('.mp4') || 
                                     videoSource.endsWith('.mov') || 
                                     videoSource.endsWith('.webm') || 
                                     videoSource.includes('/uploads/') || 
                                     videoSource.includes('supabase.co');

                return (
                  <div key={sec.id} className={`rounded-3xl p-6 shadow-md border text-center space-y-4 ${style.cardClass}`}>
                    <h3 className={`font-serif font-extrabold text-sm ${style.textColor}`}>
                      {sec.title || 'Un Video para ti 🎥'}
                    </h3>
                    {isDirectFile ? (
                      <div className="rounded-2xl overflow-hidden shadow-inner border border-gray-100 bg-black">
                        <video src={videoSource} controls className="w-full max-h-72 object-cover" />
                      </div>
                    ) : videoCode ? (
                      <div className="aspect-video rounded-2xl overflow-hidden shadow-inner border border-gray-100 bg-black">
                        <iframe
                          src={`https://www.youtube.com/embed/${videoCode}`}
                          title="Video dedicado"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full"
                        ></iframe>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-450 italic">No se pudo cargar el video.</p>
                    )}
                  </div>
                );
              }

              if (sec.type === 'audio') {
                const audioSource = sec.content?.url || experience.config?.uploadedVoiceNoteUrl || '';
                return (
                  <div key={sec.id} className={`rounded-3xl p-5 shadow-md border text-left space-y-3 ${style.cardClass}`}>
                    <div className="flex items-center justify-between border-b border-emerald-100 pb-1.5">
                      <span className="text-[9px] font-extrabold uppercase tracking-widest text-emerald-800 flex items-center gap-1.5">
                        <Mic className="w-3.5 h-3.5 text-emerald-600" /> Nota de Voz Secreta
                      </span>
                      <span className="text-[8px] font-mono text-emerald-600 font-bold">12:34 PM</span>
                    </div>

                    <div className="bg-[#e7fed6] rounded-2xl p-3 border border-[#c3f0a8] flex items-center gap-3 shadow-inner">
                      <button
                        type="button"
                        onClick={() => {
                          const audioEl = document.getElementById(`audio-player-${sec.id}`) as HTMLAudioElement;
                          if (audioEl) {
                            if (audioEl.paused) {
                              audioEl.play();
                              setIsVoiceNotePlaying(true);
                            } else {
                              audioEl.pause();
                              setIsVoiceNotePlaying(false);
                            }
                          }
                        }}
                        className="w-11 h-11 rounded-full bg-[#25d366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-md shrink-0 transition-transform active:scale-95 cursor-pointer"
                      >
                        {isVoiceNotePlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
                      </button>

                      <div className="flex-1 space-y-1.5">
                        <div className="flex items-center gap-1 h-5">
                          {[30, 60, 90, 50, 40, 70, 100, 60, 80, 100, 40, 70, 90, 50, 80, 60, 40, 60].map((h, bIdx) => (
                            <div
                              key={bIdx}
                              style={{ height: `${h}%` }}
                              className={`flex-1 rounded-full transition-all duration-150 ${
                                isVoiceNotePlaying ? 'bg-emerald-600 animate-pulse' : 'bg-gray-400'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="flex justify-between items-center text-[8px] text-gray-500 font-mono">
                          <span>{isVoiceNotePlaying ? 'Reproduciendo...' : '0:00'}</span>
                          <span className="text-blue-500 font-bold">✓✓ Mensaje de Voz</span>
                        </div>
                      </div>

                      <div className="w-9 h-9 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-xs shadow-xs shrink-0">
                        {experience.user_name ? experience.user_name.charAt(0).toUpperCase() : '❤️'}
                      </div>
                    </div>

                    {audioSource && (
                      <audio 
                        id={`audio-player-${sec.id}`}
                        src={audioSource} 
                        className="hidden" 
                        onEnded={() => setIsVoiceNotePlaying(false)} 
                      />
                    )}
                  </div>
                );
              }

              if (sec.type === 'galeria') {
                publicGalleryIdx++;
                const isSecondGallery = publicGalleryIdx > 1;
                const hasMultipleGalleries = (experience.sections?.filter(s => s.type === 'galeria').length || 0) > 1 || Boolean(experience.config?.enableDualPhotoStyle);
                const galleryTitle = hasMultipleGalleries
                  ? (isSecondGallery ? '📸 Segunda Galería de Fotos' : '📸 Primera Galería de Fotos')
                  : (sec.title || '📸 Galería de Fotos');

                const rawPhotos = isSecondGallery
                  ? (experience.config?.secondaryPhotos || sec.content?.secondaryPhotos || [])
                  : (sec.content?.photos || experience.photos || []);

                const galleryPhotos = rawPhotos.map((p: any, pIdx: number) => ({
                  url: p.url || p.previewUrl,
                  caption: p.caption,
                  id: p.id || `photo-${pIdx}`
                }));
                const galleryStyle = (isSecondGallery && experience.config?.enableDualPhotoStyle && experience.config?.secondaryPhotoStyle) 
                  ? experience.config.secondaryPhotoStyle 
                  : (sec.content?.photoStyle || experience.config?.photoStyle || 'polaroid');

                return (
                  <div key={sec.id} className={`rounded-3xl p-4 sm:p-6 shadow-md border text-center space-y-4 ${style.cardClass}`}>
                    <div className="flex items-center justify-between border-b border-rose-100/40 pb-2">
                      <h3 className={`font-serif font-extrabold text-sm ${style.textColor}`}>
                        {galleryTitle}
                      </h3>
                      <span className="text-[8px] font-bold px-2 py-0.5 rounded-full bg-rose-50 border border-rose-100 text-[#a21232] uppercase">
                        {galleryStyle}
                      </span>
                    </div>

                    {galleryPhotos.length > 0 ? (
                      <PhotoGallery
                        photos={galleryPhotos}
                        style={galleryStyle}
                        theme={themeId}
                        primaryColor={primaryColor}
                        fontFamily={selectedFontFamily}
                      />
                    ) : (
                      <p className="text-xs text-gray-400 italic py-4">No hay fotos en esta galería.</p>
                    )}
                  </div>
                );
              }

              if (sec.type === 'timeline') {
                const timelineMilestones = sec.content?.milestones || experience.milestones || [];
                return (
                  <div key={sec.id} className="space-y-4 max-w-lg mx-auto text-center">
                    <h3 className={`font-serif font-extrabold text-sm ${style.textColor}`}>
                      {sec.title || 'Momentos Especiales'}
                    </h3>
                    <div className="relative pl-6 border-l border-rose-200 ml-3 space-y-6 text-left">
                      {timelineMilestones.map((m: any, mIdx: number) => (
                        <div key={mIdx} className="relative space-y-2">
                          <div className={`absolute -left-[30px] top-1.5 w-4 h-4 border-4 border-white rounded-full shadow-md ${style.btnClass.split(' ')[0]}`}></div>
                          <div className={`rounded-2xl p-4 shadow border space-y-2 ${style.cardClass}`}>
                            <div className="flex justify-between items-center gap-2">
                              <h4 className="font-bold text-xs text-gray-900 leading-tight">{m.title}</h4>
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded shrink-0 ${style.badgeClass}`}>
                                {new Date(m.date).toLocaleDateString('es-CL', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                            <p className="text-xs text-gray-650 leading-relaxed font-light">{m.description}</p>
                            {m.image_url && (
                              <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden border border-gray-100">
                                <Image src={m.image_url} alt={m.title} fill sizes="(max-width: 768px) 100vw, 400px" className="object-cover" />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              if ((sec.type as string) === 'secreto') {
                const secretCode = sec.content?.passcode || experience.config?.secretPasscode || '1234';
                const secretHint = sec.content?.hint || experience.config?.secretHint;
                const secretMsg = sec.content?.message || experience.config?.secretMessage || '¡Te amo con todo mi corazón!';

                return (
                  <div key={sec.id} className={`rounded-3xl p-6 shadow-md border text-center space-y-4 ${style.cardClass}`}>
                    <div className="flex items-center justify-center gap-2">
                      <Lock className="w-4 h-4 text-amber-600" />
                      <h3 className={`font-serif font-extrabold text-sm ${style.textColor}`}>
                        {sec.title || 'Rincón Secreto 🔒'}
                      </h3>
                    </div>

                    {!secretUnlocked ? (
                      <div className="space-y-3 max-w-xs mx-auto">
                        <p className="text-xs text-gray-500 font-light">
                          Ingresa el PIN de 4 dígitos para desbloquear este mensaje oculto.
                        </p>
                        {secretHint && (
                          <div className="bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1.5 rounded-xl text-xs inline-flex items-center gap-1.5 shadow-2xs font-medium">
                            <span>💡</span>
                            <span><strong>Pista:</strong> {secretHint}</span>
                          </div>
                        )}
                        <div className="flex justify-center gap-2">
                          <input
                            type="password"
                            maxLength={6}
                            value={secretInputPin}
                            onChange={(e) => {
                              const val = e.target.value;
                              setSecretInputPin(val);
                              if (val.trim() === secretCode.trim()) {
                                setSecretUnlocked(true);
                                confetti({
                                  particleCount: 80,
                                  spread: 70,
                                  colors: ['#f59e0b', '#fbbf24', '#ffffff', '#a21232']
                                });
                              }
                            }}
                            placeholder="PIN..."
                            className="w-32 px-3 py-2 text-center text-sm font-mono tracking-widest border border-gray-300 rounded-xl bg-white shadow-2xs focus:ring-2 focus:ring-amber-400"
                          />
                        </div>
                        {secretInputPin.length >= 4 && secretInputPin.trim() !== secretCode.trim() && (
                          <p className="text-[10px] text-red-500 font-medium animate-pulse">
                            PIN incorrecto, intenta de nuevo 💡
                          </p>
                        )}
                      </div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-2 text-amber-950"
                      >
                        <span className="text-2xl">✨🔓</span>
                        <h4 className="font-bold text-xs">Mensaje Revelado:</h4>
                        <p className="font-serif italic text-sm leading-relaxed whitespace-pre-wrap font-medium">
                          &quot;{secretMsg}&quot;
                        </p>
                      </motion.div>
                    )}
                  </div>
                );
              }

              if (sec.type === 'corazones') {
                const finalDedication = sec.content?.message || sec.content?.text || experience.message || 'He preparado algo especial para ti ❤️';
                const userPrimaryColor = experience.config?.customColors?.primary || primaryColor || '#a21232';
                const userDedicationStyle = experience.config?.customColors?.dedicationStyle || 'night';
                const isNight = userDedicationStyle === 'night';
                const isClassic = userDedicationStyle === 'classic';
                const isGlass = userDedicationStyle === 'glass';
                const isVintage = userDedicationStyle === 'vintage';
                const isCosmic = userDedicationStyle === 'cosmic';
                const isVelvet = userDedicationStyle === 'velvet';

                let cardBg = '';
                let cardBorder = '';
                let titleColor = '';
                let textColor = '';
                let heartBg = '';
                let heartBorder = '';
                let heartColor = '';
                let heartShadow = '';

                if (isNight) {
                  cardBg = `linear-gradient(180deg, #0f172a 0%, #1e1b4b 60%, ${userPrimaryColor}bb 100%)`;
                  cardBorder = `1.5px solid ${userPrimaryColor}50`;
                  titleColor = '#ffffff';
                  textColor = '#f1f5f9';
                  heartBg = `${userPrimaryColor}25`;
                  heartBorder = `1.5px solid ${userPrimaryColor}`;
                  heartColor = userPrimaryColor;
                  heartShadow = `0 0 20px ${userPrimaryColor}80`;
                } else if (isClassic) {
                  cardBg = '#ffffff';
                  cardBorder = `2px solid ${userPrimaryColor}`;
                  titleColor = userPrimaryColor;
                  textColor = '#1e293b';
                  heartBg = `${userPrimaryColor}15`;
                  heartBorder = `1.5px solid ${userPrimaryColor}`;
                  heartColor = userPrimaryColor;
                  heartShadow = `0 0 15px ${userPrimaryColor}40`;
                } else if (isGlass) {
                  cardBg = 'rgba(255, 255, 255, 0.45)';
                  cardBorder = '1.5px solid rgba(255, 255, 255, 0.7)';
                  titleColor = userPrimaryColor;
                  textColor = '#0f172a';
                  heartBg = 'rgba(255, 255, 255, 0.6)';
                  heartBorder = `1.5px solid ${userPrimaryColor}`;
                  heartColor = userPrimaryColor;
                  heartShadow = `0 0 15px ${userPrimaryColor}50`;
                } else if (isVintage) {
                  cardBg = '#fcf6e8';
                  cardBorder = `2px dashed ${userPrimaryColor}80`;
                  titleColor = userPrimaryColor;
                  textColor = '#3b2210';
                  heartBg = `${userPrimaryColor}15`;
                  heartBorder = `1.5px solid ${userPrimaryColor}`;
                  heartColor = userPrimaryColor;
                  heartShadow = `0 0 16px ${userPrimaryColor}60`;
                } else if (isCosmic) {
                  cardBg = 'radial-gradient(ellipse at top, #1e1b4b 0%, #060814 80%)';
                  cardBorder = `1.5px solid ${userPrimaryColor}70`;
                  titleColor = userPrimaryColor;
                  textColor = '#ffffff';
                  heartBg = `${userPrimaryColor}30`;
                  heartBorder = `1.5px solid ${userPrimaryColor}`;
                  heartColor = userPrimaryColor;
                  heartShadow = `0 0 25px ${userPrimaryColor}90`;
                } else if (isVelvet) {
                  cardBg = 'linear-gradient(145deg, #1c0d1b 0%, #2b1022 100%)';
                  cardBorder = `2px solid ${userPrimaryColor}80`;
                  titleColor = userPrimaryColor;
                  textColor = '#fffbeb';
                  heartBg = `${userPrimaryColor}25`;
                  heartBorder = `1.5px solid ${userPrimaryColor}`;
                  heartColor = userPrimaryColor;
                  heartShadow = `0 0 20px ${userPrimaryColor}80`;
                }

                return (
                  <div
                    key={sec.id}
                    className="relative rounded-3xl p-8 text-center shadow-xl overflow-hidden max-w-lg mx-auto min-h-[200px] flex flex-col justify-center items-center space-y-4 transition-all duration-300"
                    style={{
                      background: cardBg,
                      border: cardBorder,
                      color: textColor
                    }}
                  >
                    {isCosmic && (
                      <div className="absolute inset-0 opacity-40 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:12px_12px]" />
                    )}

                    <motion.div
                      animate={{ scale: [1, 1.15, 1, 1.15, 1] }}
                      transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                      className="w-16 h-16 rounded-full flex items-center justify-center relative z-10"
                      style={{
                        backgroundColor: heartBg,
                        border: heartBorder,
                        boxShadow: heartShadow
                      }}
                    >
                      <Heart
                        className="w-10 h-10"
                        style={{
                          color: heartColor,
                          fill: heartColor
                        }}
                      />
                    </motion.div>
                    
                    <h4
                      className="text-[10px] uppercase tracking-widest font-extrabold relative z-10"
                      style={{ color: titleColor }}
                    >
                      {sec.title || 'Dedicatoria Final'}
                    </h4>

                    <p
                      className="font-serif italic text-sm leading-relaxed max-w-xs whitespace-pre-line px-2 font-medium relative z-10"
                      style={{ color: textColor }}
                    >
                      &quot;{finalDedication}&quot;
                    </p>
                  </div>
                );
              }

              return null;
            });
          })()}

            {/* Scroll instruction at bottom */}
            <div className="pt-12 pb-6 flex flex-col items-center text-gray-400 gap-1 select-none">
              <Heart className="w-6 h-6 animate-pulse" />
              <span className="text-[9px] uppercase tracking-wider font-extrabold mt-1">Con amor, {experience.user_name}</span>
            </div>

          </motion.div>
        )}

      </AnimatePresence>

      {/* 📜 MODAL DE CARTA ROMÁNTICA EXPANDIDA EN PANTALLA COMPLETA */}
      {isCartaEnvelopeOpen && (
        <div 
          onClick={() => setIsCartaEnvelopeOpen(false)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in cursor-pointer"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-[#fffdfa] rounded-[36px] p-6 sm:p-8 shadow-2xl border-2 border-[#e5d5be] text-left space-y-5 max-h-[88vh] overflow-y-auto animate-scale-up cursor-default"
            style={{ fontFamily: selectedFontFamily }}
          >
            {/* Header del Pergamino */}
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: `${primaryColor}30` }}>
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md text-lg shrink-0" style={{ backgroundColor: primaryColor }}>
                  💌
                </div>
                <div>
                  <h3 className="font-serif font-extrabold text-base sm:text-lg" style={{ color: primaryColor }}>
                    De mi corazón para ti ❤️
                  </h3>
                  <p className="text-[11px] text-gray-500 font-light">
                    Una dedicatoria especial escrita con todo el amor
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsCartaEnvelopeOpen(false)}
                className="px-3.5 py-1.5 rounded-full text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition cursor-pointer flex items-center gap-1 shrink-0"
              >
                <span>✉️</span>
                <span>Guardar</span>
              </button>
            </div>

            {/* Cuerpo de la Carta con lectura amplia, cómoda y tipografía grande */}
            <div className="space-y-4 py-2 bg-amber-50/20 p-4 sm:p-6 rounded-2xl border border-amber-100/60 shadow-inner">
              <h4 className="font-serif font-bold text-sm sm:text-base" style={{ color: primaryColor }}>
                Para {experience.partner_name || 'Mi Amor'}:
              </h4>
              <p className="text-sm sm:text-base font-serif italic leading-relaxed whitespace-pre-line text-gray-850 font-normal">
                {experience.history_text || experience.message || 'Eres lo más hermoso que me ha pasado en la vida. Cada instante a tu lado es un regalo que atesoro en mi corazón...'}
              </p>
            </div>

            {/* Pie de Firma y Fecha */}
            <div className="pt-3 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-2" style={{ borderColor: `${primaryColor}20` }}>
              <span className="text-xs font-mono text-gray-400">
                📅 Fecha Especial: <strong>{experience.special_date || 'Para Siempre'}</strong>
              </span>
              <span className="text-sm font-serif font-bold italic" style={{ color: primaryColor }}>
                Con todo mi amor, {experience.user_name || 'Alguien que te ama'} ✨
              </span>
            </div>

            {/* Botón Grande de Cerrar al pie */}
            <button
              type="button"
              onClick={() => setIsCartaEnvelopeOpen(false)}
              className="w-full py-3.5 text-white font-bold rounded-2xl text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer hover:opacity-90"
              style={{ backgroundColor: primaryColor }}
            >
              <span>✉️ Guardar carta en el sobre y continuar</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
