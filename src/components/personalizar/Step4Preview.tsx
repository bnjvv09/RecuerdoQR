'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { 
  Heart, 
  Sparkles, 
  Music, 
  MapPin, 
  Gift, 
  Lock, 
  Cake, 
  Flame, 
  Mail, 
  Gem, 
  PartyPopper, 
  Check, 
  Trophy, 
  Star, 
  Handshake, 
  Video as VideoIcon,
  Mic,
  Play,
  Pause,
  Palette,
  Type,
  Sun,
  Moon,
  Sparkle,
  Feather,
  Layers
} from 'lucide-react';
import PhotoGallery from '@/components/gallery/PhotoGallery';
import { PhotoStyle } from '@/types/gallery';
import { FONT_OPTIONS, getFontFamily } from '@/lib/fonts';
import { PhotoInput, MilestoneInput, ExperienceSection, CustomColors } from './types';
import confetti from 'canvas-confetti';

const COLOR_PRESETS = [
  { id: 'rose', name: 'Borgoña & Oro Rosa', primary: '#a21232', bg: '#fffcfd', text: '#111827', desc: 'Clásico romántico elegante' },
  { id: 'luxury-gold', name: 'Negro & Oro Real', primary: '#d97706', bg: '#0b0f19', text: '#f8fafc', desc: 'Noche estrellada VIP' },
  { id: 'soft-pink', name: 'Rosa Pastel & Crema', primary: '#e11d48', bg: '#fff1f2', text: '#3f151e', desc: 'Tierno y dulce' },
  { id: 'midnight-blue', name: 'Azul Noche & Plata', primary: '#38bdf8', bg: '#090d16', text: '#f1f5f9', desc: 'Mágico e infinito' },
  { id: 'emerald', name: 'Esmeralda & Dorado', primary: '#059669', bg: '#f0fdf4', text: '#064e3b', desc: 'Fresco y sofisticado' },
  { id: 'lavender', name: 'Lavanda & Lila', primary: '#7c3aed', bg: '#faf5ff', text: '#3b0764', desc: 'Suave y soñador' },
  { id: 'chocolate', name: 'Chocolate & Vainilla', primary: '#78350f', bg: '#fefce8', text: '#451a03', desc: 'Cálido y vintage' },
];

const SURPRISE_PRESETS = [
  { id: 'inherit', name: '🔗 Igual a la Página', primary: '', desc: 'Hereda colores generales' },
  { id: 'boy', name: '💙 Team Niño (Azul)', primary: '#0284c7', desc: 'Especial revelación' },
  { id: 'girl', name: '💖 Team Niña (Rosa)', primary: '#e11d48', desc: 'Especial revelación' },
  { id: 'gold', name: '✨ Oro VIP (Dorado)', primary: '#d97706', desc: 'Brillo y lujo' },
  { id: 'mint', name: '🌿 Menta Neutro', primary: '#059669', desc: 'Fresco y tierno' },
  { id: 'lavender', name: '💜 Lavanda Mágico', primary: '#7c3aed', desc: 'Dulce y soñador' },
  { id: 'rose', name: '🌹 Borgoña Real', primary: '#a21232', desc: 'Romance profundo' },
];

const DEDICATION_STYLES = [
  { id: 'night' as const, name: 'Noche Profunda', desc: 'Fondo oscuro con aura neón', icon: Moon },
  { id: 'classic' as const, name: 'Tarjeta Clásica', desc: 'Fondo blanco con marco fino', icon: Sun },
  { id: 'glass' as const, name: 'Cristal Glass', desc: 'Vidrio translúcido esmerilado', icon: Sparkle },
  { id: 'vintage' as const, name: 'Pergamino Vintage', desc: 'Carta antigua tono papiro', icon: Feather },
  { id: 'cosmic' as const, name: 'Cielo Estrellado', desc: 'Noche cósmica con micro-luces', icon: Star },
  { id: 'velvet' as const, name: 'Aterciopelado Velvet', desc: 'Terciopelo con costura fina', icon: Layers },
];

interface Step4PreviewProps {
  selectedTheme: string;
  selectedPlan?: string;
  secondaryPhotoStyle?: PhotoStyle | null;
  enableDualPhotoStyle?: boolean;
  partnerName: string;
  userName: string;
  specialDate: string;
  title: string;
  message: string;
  historyText: string;
  songUrl: string;
  voiceNoteUrl?: string;
  uploadedVideoUrl?: string;
  youtubeVideoUrl?: string;
  secretPasscode: string;
  secretHint?: string;
  secretMessage: string;
  // 12 Themes Props
  birthdayWishMessage?: string;
  birthdayBalloons?: [string, string, string];
  statsKisses?: string;
  statsKissesLabel?: string;
  statsCoffees?: string;
  statsCoffeesLabel?: string;
  statsSmiles?: string;
  statsSmilesLabel?: string;
  proposalQuestion: string;
  proposalYesText?: string;
  proposalCelebrationText?: string;
  ringBoxMessage?: string;
  scratchPrompt?: string;
  scratchSecretMessage?: string;
  scratchUltrasoundUrl?: string;
  pollQuestion?: string;
  pollOptionA?: string;
  pollOptionB?: string;
  surpriseMessage: string;
  ticketTitle?: string;
  ticketConditions?: string;
  waxSealSender?: string;
  crystalHeartTitle?: string;
  crystalHeartSecret?: string;
  valentineBoxTitle?: string;
  valentineCoupon?: string;
  trophyTitle?: string;
  trophyCategory?: string;
  diplomaText?: string;
  gratitudeStar1?: string;
  gratitudeStar2?: string;
  gratitudeStar3?: string;
  reconciliationQuestion?: string;
  reconciliationPromise?: string;
  customFont: string;
  setCustomFont?: (font: string) => void;
  customColors: CustomColors;
  setCustomColors?: (colors: CustomColors) => void;
  photoStyle: PhotoStyle;
  sections: ExperienceSection[];
  photos: PhotoInput[];
  secondaryPhotos?: PhotoInput[];
  milestones: MilestoneInput[];
}

export default function Step4Preview({
  selectedTheme,
  selectedPlan = 'medium',
  secondaryPhotoStyle = null,
  enableDualPhotoStyle = false,
  partnerName,
  userName,
  specialDate,
  title,
  message,
  historyText,
  songUrl,
  voiceNoteUrl = '',
  uploadedVideoUrl = '',
  youtubeVideoUrl = '',
  secretPasscode,
  secretHint = '',
  secretMessage,
  birthdayWishMessage = '¡Que todos tus deseos se hagan realidad en este nuevo año de vida! ✨',
  birthdayBalloons = ['¡Mucho Éxito y Alegría!', '¡Salud y Risas Siempre!', '¡Te Queremos Infinito!'],
  statsKisses = '2.500+',
  statsKissesLabel = '💋 Cantidad de Besos',
  statsCoffees = '800+',
  statsCoffeesLabel = '☕ Citas & Salidas',
  statsSmiles = '1.000.000+',
  statsSmilesLabel = '😊 Sonrisas Compartidas',
  proposalQuestion,
  proposalYesText = '¡Sí, Acepto! ❤️',
  proposalCelebrationText = '¡Dijiste que Sí! Nuestra historia oficial comienza hoy ✨',
  ringBoxMessage = 'Prometo amarte, cuidarte y hacerte sonreír cada día de mi vida 💍',
  scratchPrompt = 'Toca aquí para raspar y descubrir la noticia',
  scratchSecretMessage = '¡Sorpresa! ¡Viene un Bebé en Camino! 🍼',
  scratchUltrasoundUrl = '',
  pollQuestion = '¿Qué crees que será? 🍼',
  pollOptionA = 'Team Niño 💙',
  pollOptionB = 'Team Niña 💖',
  surpriseMessage,
  ticketTitle = 'Pase VIP / Cupón de Regalo',
  ticketConditions = 'Válido para canjear cuando tú quieras ❤️',
  waxSealSender = 'Con Todo Mi Amor',
  crystalHeartTitle = 'Toca y Mantén Presionado el Corazón de Cristal',
  crystalHeartSecret = 'Me enamoré de ti desde el primer segundo en que te vi...',
  valentineBoxTitle = 'Caja de Bombones de San Valentín 🍫',
  valentineCoupon = 'Vale por nuestra cita soñada de San Valentín ❤️',
  trophyTitle = 'Trofeo al Mayor Logro y Esfuerzo 🏆',
  trophyCategory = '¡Orgullo Total por tu Gran Meta Cumplida!',
  diplomaText = 'Reconocimiento oficial a la persona más talentosa y perseverante.',
  gratitudeStar1 = 'Gracias por tu apoyo incondicional en cada momento ✨',
  gratitudeStar2 = 'Gracias por tus consejos y por creer siempre en mí 🌟',
  gratitudeStar3 = 'Gracias por iluminar mi vida con tu presencia 💛',
  reconciliationQuestion = 'Nuestro amor es más fuerte que cualquier error. ¿Hacemos las paces? 🤝❤️',
  reconciliationPromise = 'Prometo aprender, escucharte y valorar cada instante a tu lado.',
  customFont,
  setCustomFont,
  customColors,
  setCustomColors,
  photoStyle,
  sections,
  photos,
  secondaryPhotos = [],
  milestones,
}: Step4PreviewProps) {
  const activeFontFamily = getFontFamily(customFont);
  const [fontCategory, setFontCategory] = useState<'all' | 'Cursiva' | 'Elegante' | 'Moderna'>('all');

  // Progressive Sequential States for Themes
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [balloonsPopped, setBalloonsPopped] = useState<number[]>([]);
  const [isScratched, setIsScratched] = useState(false);
  const [isBoxOpened, setIsBoxOpened] = useState(false);
  const [isRingBoxOpened, setIsRingBoxOpened] = useState(false);
  const [isWaxSealBroken, setIsWaxSealBroken] = useState(false);
  const [proposalAccepted, setProposalAccepted] = useState(false);
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [selectedPollVote, setSelectedPollVote] = useState<'A' | 'B' | null>(null);
  const [crystalUnlocked, setCrystalUnlocked] = useState(false);
  const [starsRevealed, setStarsRevealed] = useState<number[]>([]);
  const [heartUnited, setHeartUnited] = useState(false);
  const [isVoiceNotePlaying, setIsVoiceNotePlaying] = useState(false);
  const [isPreviewLetterOpen, setIsPreviewLetterOpen] = useState(false);

  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const toggleVoiceNotePlay = () => {
    if (audioPlayerRef.current) {
      if (isVoiceNotePlaying) {
        audioPlayerRef.current.pause();
        setIsVoiceNotePlaying(false);
      } else {
        audioPlayerRef.current.play();
        setIsVoiceNotePlaying(true);
      }
    } else {
      setIsVoiceNotePlaying(!isVoiceNotePlaying);
    }
  };

  const isBasic = selectedPlan === 'basic';
  const isBirthday = selectedTheme === 'birthday';
  const isPregnancy = selectedTheme === 'pregnancy';
  const isSurprise = selectedTheme === 'surprise';
  const isDatingProposal = selectedTheme === 'dating-proposal';
  const isMarriageProposal = selectedTheme === 'marriage-proposal';
  const isLoveLetter = selectedTheme === 'love-letter';
  const isLoveConfession = selectedTheme === 'love-confession';
  const isAnniversary = selectedTheme === 'anniversary';
  const isValentines = selectedTheme === 'valentines';
  const isSpecial = selectedTheme === 'special';
  const isGratitude = selectedTheme === 'gratitude';
  const isReconciliation = selectedTheme === 'reconciliation';

  // INDEPENDENT SURPRISE COLOR (Does not alter global page colors)
  const themeColor = customColors.surprisePrimary || customColors.primary;
  const dedicationStyle = customColors.dedicationStyle || 'night';

  // Birthday age & days calculation
  const calculateBirthdayStats = () => {
    if (!specialDate) return { age: 0, days: 0 };
    const birth = new Date(specialDate);
    if (isNaN(birth.getTime())) return { age: 0, days: 0 };
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
      age--;
    }
    const diffTime = Math.abs(now.getTime() - birth.getTime());
    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return { age: Math.max(0, age), days };
  };

  const bdayStats = calculateBirthdayStats();

  const handleBlowCandles = () => {
    setCandlesBlown(true);
    confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } });
  };

  const handlePopBalloon = (idx: number) => {
    if (!balloonsPopped.includes(idx)) {
      setBalloonsPopped([...balloonsPopped, idx]);
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.7 } });
    }
  };

  const handleProposalYes = () => {
    setProposalAccepted(true);
    confetti({ particleCount: 110, spread: 85, origin: { y: 0.5 } });
  };

  const handleFireworks = () => {
    confetti({ particleCount: 75, spread: 90, origin: { y: 0.5 } });
  };

  const handleStarReveal = (idx: number) => {
    if (!starsRevealed.includes(idx)) {
      setStarsRevealed([...starsRevealed, idx]);
      confetti({ particleCount: 25, spread: 40, origin: { y: 0.7 } });
    }
  };

  // Live Timer State
  const [timeElapsed, setTimeElapsed] = useState({ years: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [pregnancyCountdown, setPregnancyCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTime = () => {
      let target: Date;
      if (typeof specialDate === 'string' && specialDate.includes('-')) {
        const parts = specialDate.split('T')[0].split('-').map(Number);
        target = new Date(parts[0], (parts[1] || 1) - 1, parts[2] || 1);
      } else {
        target = new Date(specialDate || '2024-02-14');
      }

      if (isNaN(target.getTime())) target = new Date();

      const now = new Date();

      // Pregnancy countdown
      if (isPregnancy) {
        let diffFuture = target.getTime() - now.getTime();
        if (diffFuture < 0) diffFuture = 0;

        const msInSecond = 1000;
        const msInMinute = 60 * 1000;
        const msInHour = 60 * 60 * 1000;
        const msInDay = 24 * 60 * 60 * 1000;

        const days = Math.floor(diffFuture / msInDay);
        const hours = Math.floor((diffFuture % msInDay) / msInHour);
        const minutes = Math.floor((diffFuture % msInHour) / msInMinute);
        const seconds = Math.floor((diffFuture % msInMinute) / msInSecond);

        setPregnancyCountdown({ days, hours, minutes, seconds });
        return;
      }

      // Elapsed time
      let diff = now.getTime() - target.getTime();
      if (diff < 0) diff = 0;

      const msInSecond = 1000;
      const msInMinute = 60 * 1000;
      const msInHour = 60 * 60 * 1000;
      const msInDay = 24 * 60 * 60 * 1000;

      let years = now.getFullYear() - target.getFullYear();
      let anniversary = new Date(target);
      anniversary.setFullYear(target.getFullYear() + years);
      if (anniversary > now) {
        years--;
        anniversary = new Date(target);
        anniversary.setFullYear(target.getFullYear() + years);
      }

      const diffAnniversary = now.getTime() - anniversary.getTime();
      const days = Math.max(0, Math.floor(diffAnniversary / msInDay));
      const hours = Math.max(0, Math.floor((diffAnniversary % msInDay) / msInHour));
      const minutes = Math.max(0, Math.floor((diffAnniversary % msInHour) / msInMinute));
      const seconds = Math.max(0, Math.floor((diffAnniversary % msInMinute) / msInSecond));

      setTimeElapsed({ years, days, hours, minutes, seconds });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [specialDate, isPregnancy]);

  // Render the interactive theme widget (100% PROGRESSIVE NARRATIVE REVEAL + FULL FONT INHERITANCE)
  const renderThemeInteractiveWidget = () => {
    return (
      <div className="space-y-3" style={{ fontFamily: activeFontFamily }}>
        {/* 1. BIRTHDAY */}
        {isBirthday && (
          <div
            className="rounded-3xl p-4 border shadow-xs space-y-3 transition-colors duration-300"
            style={{
              backgroundColor: `${themeColor}12`,
              borderColor: `${themeColor}35`,
              fontFamily: activeFontFamily
            }}
          >
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest block" style={{ color: themeColor }}>
                🎉 ¡Feliz Cumpleaños {partnerName || 'Especial'}!
              </span>
              <p className="text-[9px] opacity-75 font-light" style={{ color: customColors.text }}>
                Tienes una torta esperando por tu gran deseo...
              </p>
            </div>

            <div className="py-2 flex flex-col items-center">
              <div className="relative flex justify-center items-end">
                {!candlesBlown ? (
                  <div className="flex gap-4 mb-1">
                    <div className="w-2 h-4 bg-amber-400 rounded-full animate-bounce shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                    <div className="w-2 h-4 bg-amber-400 rounded-full animate-bounce delay-75 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                    <div className="w-2 h-4 bg-amber-400 rounded-full animate-bounce delay-150 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                  </div>
                ) : (
                  <div className="text-[10px] opacity-60 italic animate-pulse mb-1">
                    💨 ~ velas apagadas y deseo enviado ~
                  </div>
                )}
              </div>
              <div className="text-5xl select-none">🎂</div>
            </div>

            {!candlesBlown ? (
              <button
                type="button"
                onClick={handleBlowCandles}
                style={{ backgroundColor: themeColor, fontFamily: activeFontFamily }}
                className="w-full py-2.5 text-white font-bold rounded-2xl text-[11px] shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer animate-pulse hover:opacity-90"
              >
                <span>🎂 Toca para Soplar las Velas</span>
              </button>
            ) : (
              <div className="space-y-3 animate-fade-in">
                <div className="bg-white/95 p-3 rounded-2xl border space-y-1" style={{ borderColor: `${themeColor}40` }}>
                  <p className="text-[11px] font-bold" style={{ color: themeColor }}>✨ ¡Deseo enviado al universo! ✨</p>
                  <p className="text-[9px] font-light leading-relaxed italic" style={{ color: customColors.text }}>
                    &quot;{birthdayWishMessage}&quot;
                  </p>
                </div>

                <div className="inline-block bg-white/95 border px-3 py-1.5 rounded-full shadow-2xs" style={{ borderColor: `${themeColor}30` }}>
                  <span className="text-xs font-bold block" style={{ color: themeColor }}>
                    ¡Hoy celebramos tus {bdayStats.age} Años! 🎂
                  </span>
                  <span className="text-[8px] opacity-75 font-light" style={{ color: customColors.text }}>
                    {bdayStats.days.toLocaleString('es-CL')} días llenando el mundo de alegría
                  </span>
                </div>

                {!isBasic && (
                  <div className="pt-2 border-t space-y-1.5" style={{ borderColor: `${themeColor}25` }}>
                    <span className="text-[8px] font-bold uppercase tracking-wider block opacity-70" style={{ color: customColors.text }}>
                      🎈 Toca los globos para reventar sorpresas
                    </span>
                    <div className="flex justify-center gap-3">
                      {[0, 1, 2].map((idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handlePopBalloon(idx)}
                          className="cursor-pointer transition-transform hover:scale-110"
                        >
                          {!balloonsPopped.includes(idx) ? (
                            <span className="text-2xl">🎈</span>
                          ) : (
                            <span
                              className="text-[8px] font-bold px-1.5 py-0.5 rounded-md border block shadow-2xs animate-scale-up"
                              style={{
                                backgroundColor: `${themeColor}20`,
                                color: themeColor,
                                borderColor: `${themeColor}40`,
                                fontFamily: activeFontFamily
                              }}
                            >
                              {birthdayBalloons[idx] || '¡Felicidades!'}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 2. ANNIVERSARY */}
        {isAnniversary && (
          <div
            className="rounded-3xl p-4 border shadow-xs space-y-3 transition-colors duration-300"
            style={{
              backgroundColor: `${themeColor}12`,
              borderColor: `${themeColor}35`,
              fontFamily: activeFontFamily
            }}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: themeColor }}>
              ❤️ Nuestro Aniversario de Amor
            </span>
            
            {!isBasic && (
              <div className="bg-white/95 rounded-2xl p-3 border space-y-1.5" style={{ borderColor: `${themeColor}30` }}>
                <span className="text-[8px] font-bold uppercase block" style={{ color: themeColor }}>📊 Nuestras Estadísticas</span>
                <div className="grid grid-cols-3 gap-1.5 text-center">
                  <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${themeColor}10` }}>
                    <span className="text-xs font-bold block" style={{ color: themeColor }}>{statsKisses}</span>
                    <span className="text-[7.5px] font-medium opacity-80 block truncate">{statsKissesLabel || 'Besos'}</span>
                  </div>
                  <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${themeColor}10` }}>
                    <span className="text-xs font-bold block" style={{ color: themeColor }}>{statsCoffees}</span>
                    <span className="text-[7.5px] font-medium opacity-80 block truncate">{statsCoffeesLabel || 'Citas'}</span>
                  </div>
                  <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${themeColor}10` }}>
                    <span className="text-xs font-bold block" style={{ color: themeColor }}>{statsSmiles}</span>
                    <span className="text-[7.5px] font-medium opacity-80 block truncate">{statsSmilesLabel || 'Sonrisas'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3 & 4. DATING & MARRIAGE PROPOSALS */}
        {(isDatingProposal || isMarriageProposal) && (
          <div
            className="rounded-3xl p-4 border shadow-xs space-y-3 transition-colors duration-300"
            style={{
              backgroundColor: `${themeColor}12`,
              borderColor: `${themeColor}35`,
              fontFamily: activeFontFamily
            }}
          >
            <span className="text-3xl select-none">{isMarriageProposal ? '💍' : '💌'}</span>
            <h3 className="font-bold text-sm" style={{ color: customColors.text, fontFamily: activeFontFamily }}>
              {proposalQuestion || (isMarriageProposal ? '¿Te quieres casar conmigo? 💍' : '¿Quieres ser mi novia/o? ❤️')}
            </h3>

            {!proposalAccepted ? (
              <div className="flex justify-center gap-3 pt-1 relative">
                <button
                  type="button"
                  onClick={handleProposalYes}
                  style={{ backgroundColor: themeColor, fontFamily: activeFontFamily }}
                  className="px-5 py-2 text-white font-bold rounded-full text-xs shadow-md transition hover:scale-105 cursor-pointer"
                >
                  {proposalYesText}
                </button>

                {!isBasic && (
                  <button
                    type="button"
                    onMouseEnter={() => setNoButtonPosition({ x: (Math.random() - 0.5) * 60, y: (Math.random() - 0.5) * 40 })}
                    style={{ transform: `translate(${noButtonPosition.x}px, ${noButtonPosition.y}px)`, fontFamily: activeFontFamily }}
                    className="px-4 py-2 bg-gray-200 text-gray-600 font-bold rounded-full text-xs transition-all duration-150"
                  >
                    No
                  </button>
                )}
              </div>
            ) : (
              <div className="bg-white/95 p-3 rounded-2xl border space-y-2 animate-fade-in" style={{ borderColor: `${themeColor}40` }}>
                <p className="text-xs font-bold" style={{ color: themeColor }}>💖 ¡Dijiste que Sí! 💖</p>
                <p className="text-[9px] font-light" style={{ color: customColors.text }}>{proposalCelebrationText}</p>
                
                {isMarriageProposal && !isBasic && (
                  <div
                    onClick={() => setIsRingBoxOpened(!isRingBoxOpened)}
                    className="mt-2 p-3 bg-zinc-900 text-amber-200 rounded-xl cursor-pointer border border-amber-400/40 space-y-1 transition-transform active:scale-95"
                  >
                    <span className="text-2xl block">{isRingBoxOpened ? '💎💍✨' : '📦'}</span>
                    <p className="text-[9px] font-bold" style={{ fontFamily: activeFontFamily }}>
                      {isRingBoxOpened ? ringBoxMessage : 'Toca la cajita de terciopelo para abrir el anillo'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 5. PREGNANCY */}
        {isPregnancy && (
          <div
            className="rounded-3xl p-4 border shadow-xs space-y-3 transition-colors duration-300"
            style={{
              backgroundColor: `${themeColor}12`,
              borderColor: `${themeColor}35`,
              fontFamily: activeFontFamily
            }}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: themeColor }}>
              🍼 Una Noticia que Cambiará Nuestras Vidas
            </span>

            {/* Scratch Card */}
            <div
              onClick={() => {
                if (!isScratched) {
                  setIsScratched(true);
                  confetti({ particleCount: 80, spread: 70, colors: [themeColor, '#ffffff', '#fbbf24'] });
                }
              }}
              className="bg-white rounded-2xl p-4 border-2 border-dashed text-center cursor-pointer transition-all duration-300 shadow-inner min-h-[110px] flex flex-col items-center justify-center"
              style={{ borderColor: `${themeColor}60` }}
            >
              {!isScratched ? (
                <div className="space-y-1">
                  <div
                    className="w-10 h-10 text-white rounded-full flex items-center justify-center mx-auto text-lg shadow-sm animate-pulse"
                    style={{ backgroundColor: themeColor }}
                  >
                    🪙
                  </div>
                  <p className="text-[11px] font-bold text-gray-800">{scratchPrompt}</p>
                  <p className="text-[8px] font-light" style={{ color: themeColor }}>Toca aquí con tu dedo para raspar la tarjeta</p>
                </div>
              ) : (
                <div className="space-y-2 animate-fade-in w-full">
                  <span className="text-3xl">👶🍼✨</span>
                  <h4 className="font-bold text-xs" style={{ color: themeColor, fontFamily: activeFontFamily }}>
                    {scratchSecretMessage}
                  </h4>
                  {scratchUltrasoundUrl && (
                    <div className="relative w-full h-28 rounded-xl overflow-hidden mt-1 shadow-xs border" style={{ borderColor: `${themeColor}40` }}>
                      <Image src={scratchUltrasoundUrl} alt="Ecografía" fill sizes="260px" className="object-cover" />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sequential Reveal after Scratch */}
            {isScratched && (
              <div className="space-y-3 animate-fade-in">
                
                {/* FAMILY POLL */}
                {!isBasic && (
                  <div className="bg-white/95 rounded-2xl p-3 border space-y-2" style={{ borderColor: `${themeColor}30` }}>
                    <span className="text-[9px] font-bold block" style={{ color: themeColor }}>{pollQuestion}</span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedPollVote('A')}
                        style={{ fontFamily: activeFontFamily }}
                        className={`py-1.5 px-2 rounded-xl text-[9px] font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                          selectedPollVote === 'A' ? 'bg-blue-600 text-white shadow-xs' : 'bg-blue-50 text-blue-800 border border-blue-200'
                        }`}
                      >
                        {selectedPollVote === 'A' && <Check className="w-3 h-3" />}
                        <span>{pollOptionA}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedPollVote('B')}
                        style={{ fontFamily: activeFontFamily }}
                        className={`py-1.5 px-2 rounded-xl text-[9px] font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                          selectedPollVote === 'B' ? 'bg-pink-600 text-white shadow-xs' : 'bg-pink-50 text-pink-800 border border-pink-200'
                        }`}
                      >
                        {selectedPollVote === 'B' && <Check className="w-3 h-3" />}
                        <span>{pollOptionB}</span>
                      </button>
                    </div>
                    {selectedPollVote && (
                      <p className="text-[8px] font-bold text-emerald-700 animate-fade-in">✓ ¡Voto familiar registrado!</p>
                    )}
                  </div>
                )}

                {/* COUNTDOWN */}
                <div className="bg-white/95 rounded-2xl p-3 border text-center space-y-1.5 shadow-2xs" style={{ borderColor: `${themeColor}35` }}>
                  <span className="text-[8px] uppercase tracking-wider font-bold block" style={{ color: themeColor }}>
                    🍼 Cuenta Regresiva de Llegada del Bebé
                  </span>
                  <div className="grid grid-cols-4 gap-1 text-center font-mono">
                    <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${themeColor}12` }}>
                      <span className="block text-xs font-bold" style={{ color: themeColor }}>{pregnancyCountdown.days}</span>
                      <span className="text-[6px] opacity-70 uppercase">Días</span>
                    </div>
                    <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${themeColor}12` }}>
                      <span className="block text-xs font-bold" style={{ color: themeColor }}>{pregnancyCountdown.hours}</span>
                      <span className="text-[6px] opacity-70 uppercase">Horas</span>
                    </div>
                    <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${themeColor}12` }}>
                      <span className="block text-xs font-bold" style={{ color: themeColor }}>{pregnancyCountdown.minutes}</span>
                      <span className="text-[6px] opacity-70 uppercase">Min</span>
                    </div>
                    <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${themeColor}12` }}>
                      <span className="block text-xs font-bold" style={{ color: themeColor }}>{pregnancyCountdown.seconds}</span>
                      <span className="text-[6px] opacity-70 uppercase">Seg</span>
                    </div>
                  </div>
                  <p className="text-[7px] opacity-80 font-light" style={{ color: themeColor }}>
                    Fecha estimada de nacimiento: {specialDate || 'Próximamente'}
                  </p>
                </div>

              </div>
            )}
          </div>
        )}

        {/* 6. SURPRISE GIFT */}
        {isSurprise && (
          <div
            className="rounded-3xl p-4 border shadow-xs space-y-3 transition-colors duration-300"
            style={{
              backgroundColor: `${themeColor}12`,
              borderColor: `${themeColor}35`,
              fontFamily: activeFontFamily
            }}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: themeColor }}>
              🎁 Tienes un Regalo Especial
            </span>

            <div
              onClick={() => {
                if (!isBoxOpened) {
                  setIsBoxOpened(true);
                  confetti({ particleCount: 70, spread: 60 });
                }
              }}
              className="cursor-pointer py-3 transition-transform hover:scale-105 flex flex-col items-center"
            >
              {!isBoxOpened ? (
                <div className="space-y-1">
                  <span className="text-5xl select-none inline-block animate-bounce">🎁</span>
                  <p className="text-[10px] font-bold" style={{ color: themeColor }}>Toca la caja para abrir tu regalo</p>
                </div>
              ) : (
                <div
                  className="rounded-2xl p-4 border-2 border-dashed shadow-md space-y-2 animate-fade-in w-full text-left bg-white/95"
                  style={{ borderColor: themeColor }}
                >
                  <div className="flex items-center justify-between border-b pb-1.5" style={{ borderColor: `${themeColor}30` }}>
                    <span className="text-[9px] font-extrabold uppercase tracking-widest" style={{ color: themeColor }}>
                      🎟️ {ticketTitle}
                    </span>
                    <span className="text-[8px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: `${themeColor}20`, color: themeColor }}>
                      VIP-2026
                    </span>
                  </div>
                  
                  <p className="text-xs font-bold italic leading-relaxed" style={{ color: customColors.text, fontFamily: activeFontFamily }}>
                    &quot;{surpriseMessage || 'Una cena romántica este fin de semana'}&quot;
                  </p>

                  <p className="text-[8px] opacity-70 font-light border-t pt-1" style={{ borderColor: `${themeColor}20` }}>
                    {ticketConditions}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 7. LOVE LETTER */}
        {isLoveLetter && (
          <div
            className="rounded-3xl p-4 border shadow-xs space-y-3 transition-colors duration-300"
            style={{
              backgroundColor: `${themeColor}12`,
              borderColor: `${themeColor}35`,
              fontFamily: activeFontFamily
            }}
          >
            <div onClick={() => setIsWaxSealBroken(!isWaxSealBroken)} className="cursor-pointer space-y-2">
              {!isWaxSealBroken ? (
                <div className="space-y-1">
                  <span className="text-4xl select-none">💌</span>
                  <p className="text-[10px] font-bold" style={{ color: themeColor }}>Toca el sello para abrir la carta</p>
                </div>
              ) : (
                <div
                  className="p-3.5 rounded-2xl border text-left space-y-1 shadow-inner animate-fade-in bg-white/95"
                  style={{ borderColor: `${themeColor}40` }}
                >
                  <h4 className="font-bold text-xs" style={{ color: themeColor, fontFamily: activeFontFamily }}>De mi corazón para ti:</h4>
                  <p className="text-[10px] leading-relaxed italic whitespace-pre-wrap" style={{ color: customColors.text, fontFamily: activeFontFamily }}>
                    {historyText}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 8. LOVE CONFESSION */}
        {isLoveConfession && (
          <div
            className="text-white rounded-3xl p-4 border shadow-xs space-y-3 transition-colors duration-300"
            style={{
              backgroundColor: '#0f172a',
              borderColor: `${themeColor}60`,
              fontFamily: activeFontFamily
            }}
          >
            <span className="text-[9px] font-bold uppercase tracking-widest block" style={{ color: themeColor }}>
              💖 Confesión Abierta
            </span>
            
            <div
              onClick={() => setCrystalUnlocked(!crystalUnlocked)}
              className="cursor-pointer p-3 rounded-2xl border transition space-y-2"
              style={{
                backgroundColor: `${themeColor}15`,
                borderColor: `${themeColor}40`
              }}
            >
              <span className="text-4xl block animate-pulse">💎✨</span>
              {!crystalUnlocked ? (
                <p className="text-[10px] font-bold" style={{ color: themeColor }}>{crystalHeartTitle}</p>
              ) : (
                <div className="space-y-1 animate-fade-in">
                  <p className="text-xs italic text-white font-bold leading-relaxed" style={{ fontFamily: activeFontFamily }}>
                    &quot;{crystalHeartSecret}&quot;
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 9. VALENTINES */}
        {isValentines && (
          <div
            className="rounded-3xl p-4 border shadow-xs space-y-3 transition-colors duration-300"
            style={{
              backgroundColor: `${themeColor}12`,
              borderColor: `${themeColor}35`,
              fontFamily: activeFontFamily
            }}
          >
            <span className="text-3xl select-none">🌹🍫</span>
            <h3 className="font-bold text-xs" style={{ color: themeColor, fontFamily: activeFontFamily }}>{valentineBoxTitle}</h3>
            <div className="p-3 bg-white/95 rounded-2xl border text-xs italic shadow-2xs" style={{ borderColor: `${themeColor}30`, color: themeColor, fontFamily: activeFontFamily }}>
              &quot;{valentineCoupon}&quot;
            </div>
          </div>
        )}

        {/* 10. SPECIAL CONGRATULATIONS */}
        {isSpecial && (
          <div
            className="rounded-3xl p-4 border shadow-xs space-y-3 transition-colors duration-300"
            style={{
              backgroundColor: `${themeColor}12`,
              borderColor: `${themeColor}35`,
              fontFamily: activeFontFamily
            }}
          >
            <button
              type="button"
              onClick={handleFireworks}
              style={{ backgroundColor: themeColor, fontFamily: activeFontFamily }}
              className="w-full py-2 text-white font-bold rounded-2xl text-[10px] shadow-sm flex items-center justify-center gap-1.5 cursor-pointer animate-pulse"
            >
              <PartyPopper className="w-3.5 h-3.5" />
              <span>🎆 Toca para Llenar de Fuegos Artificiales</span>
            </button>

            {!isBasic && (
              <div className="bg-white/95 rounded-2xl p-3 border shadow-sm space-y-1 text-center" style={{ borderColor: `${themeColor}35` }}>
                <span className="text-3xl block">🏆</span>
                <h4 className="font-bold text-xs" style={{ color: themeColor, fontFamily: activeFontFamily }}>{trophyTitle}</h4>
                <p className="text-[9px] font-light" style={{ color: customColors.text }}>{trophyCategory}</p>
                <p className="text-[8px] opacity-70 border-t pt-1 mt-1" style={{ borderColor: `${themeColor}20` }}>{diplomaText}</p>
              </div>
            )}
          </div>
        )}

        {/* 11. GRATITUDE */}
        {isGratitude && (
          <div
            className="rounded-3xl p-4 border shadow-xs space-y-3 transition-colors duration-300"
            style={{
              backgroundColor: `${themeColor}12`,
              borderColor: `${themeColor}35`,
              fontFamily: activeFontFamily
            }}
          >
            <span className="text-[10px] font-bold uppercase tracking-widest block" style={{ color: themeColor }}>
              🙏 Frasco de Gratitud Infinita
            </span>
            <p className="text-[8px] opacity-70">Toca cada estrella para revelar un agradecimiento especial:</p>

            <div className="flex justify-center gap-3">
              {[0, 1, 2].map((idx) => {
                const phrase = [gratitudeStar1, gratitudeStar2, gratitudeStar3][idx];
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleStarReveal(idx)}
                    className="cursor-pointer transition-transform hover:scale-110"
                  >
                    {!starsRevealed.includes(idx) ? (
                      <span className="text-3xl">⭐</span>
                    ) : (
                      <span
                        className="text-[8px] font-bold p-2 rounded-xl border block shadow-sm max-w-[90px] leading-tight"
                        style={{
                          backgroundColor: `${themeColor}15`,
                          borderColor: `${themeColor}40`,
                          color: themeColor,
                          fontFamily: activeFontFamily
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

        {/* 12. RECONCILIATION */}
        {isReconciliation && (
          <div
            className="rounded-3xl p-4 border shadow-xs space-y-3 transition-colors duration-300"
            style={{
              backgroundColor: `${themeColor}12`,
              borderColor: `${themeColor}35`,
              fontFamily: activeFontFamily
            }}
          >
            <span className="text-[10px] font-bold uppercase tracking-widest block" style={{ color: themeColor }}>
              🕊️ Unir Nuestros Caminos
            </span>

            {!heartUnited ? (
              <button
                type="button"
                onClick={() => {
                  setHeartUnited(true);
                  confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
                }}
                className="w-full p-3 bg-white rounded-2xl border hover:bg-gray-50 transition cursor-pointer space-y-1"
                style={{ borderColor: `${themeColor}35` }}
              >
                <span className="text-3xl block">💔 ➔ 💖</span>
                <p className="text-[10px] font-bold" style={{ color: themeColor }}>Toca para unir las dos mitades</p>
              </button>
            ) : (
              <div className="bg-white/95 p-3 rounded-2xl border shadow-sm space-y-2 animate-fade-in text-center" style={{ borderColor: `${themeColor}40` }}>
                <span className="text-3xl block">💖✨</span>
                <p className="text-xs font-bold" style={{ color: themeColor, fontFamily: activeFontFamily }}>{reconciliationQuestion}</p>
                <p className="text-[9px] italic leading-relaxed" style={{ color: customColors.text, fontFamily: activeFontFamily }}>&quot;{reconciliationPromise}&quot;</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in text-left">
      {/* Header */}
      <div className="border-b border-rose-100 pb-3">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span>🎨</span>
          <span>4. Estilo Visual y Vista Previa en Vivo</span>
        </h2>
        <p className="text-xs text-gray-500 font-light mt-1">
          Cambia los colores de la página, el tono de la sorpresa, el estilo de dedicatoria y las letras en vivo.
        </p>
      </div>

      {/* Main Split Grid: Left = Visual Controls, Right = Live Phone Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Controls (7 cols): Palettes, Surprise Tone, Dedication Style & Fonts */}
        <div className="lg:col-span-7 space-y-6">

          {/* 1. Global Page Palettes */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-[#a21232]" />
                <span>1. Paleta de la Página Web (Global)</span>
              </label>
              <span className="text-[9px] bg-rose-50 text-[#a21232] font-bold px-2 py-0.5 rounded-full border border-rose-100">
                Afecta Títulos, Fotos y Fondo
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {COLOR_PRESETS.map((p) => {
                const isSelected = customColors.primary === p.primary && customColors.bg === p.bg;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setCustomColors && setCustomColors({ ...customColors, primary: p.primary, bg: p.bg, text: p.text })}
                    className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col gap-2 ${
                      isSelected
                        ? 'border-[#a21232] ring-2 ring-rose-200 bg-rose-50/40 shadow-xs'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full border border-gray-200 shadow-2xs" style={{ backgroundColor: p.primary }} />
                      <span className="w-5 h-5 rounded-full border border-gray-200 shadow-2xs" style={{ backgroundColor: p.bg }} />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-gray-900 block leading-tight">{p.name}</span>
                      <span className="text-[9px] text-gray-400 font-light block">{p.desc}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Free Hex Color Pickers for Page */}
            <div className="pt-3 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-xl border border-gray-200">
                <input
                  type="color"
                  value={customColors.primary}
                  onChange={(e) => setCustomColors && setCustomColors({ ...customColors, primary: e.target.value })}
                  className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0 bg-transparent shrink-0"
                />
                <div>
                  <span className="text-[9px] font-bold text-gray-800 block">Color Primario</span>
                  <span className="text-[8px] font-mono text-gray-500 uppercase">{customColors.primary}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-xl border border-gray-200">
                <input
                  type="color"
                  value={customColors.bg}
                  onChange={(e) => setCustomColors && setCustomColors({ ...customColors, bg: e.target.value })}
                  className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0 bg-transparent shrink-0"
                />
                <div>
                  <span className="text-[9px] font-bold text-gray-800 block">Color de Fondo</span>
                  <span className="text-[8px] font-mono text-gray-500 uppercase">{customColors.bg}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-xl border border-gray-200">
                <input
                  type="color"
                  value={customColors.text}
                  onChange={(e) => setCustomColors && setCustomColors({ ...customColors, text: e.target.value })}
                  className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0 bg-transparent shrink-0"
                />
                <div>
                  <span className="text-[9px] font-bold text-gray-800 block">Color de Texto</span>
                  <span className="text-[8px] font-mono text-gray-500 uppercase">{customColors.text}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Independent Surprise Widget Tone (Does NOT change global page colors) */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                <Gift className="w-4 h-4 text-[#a21232]" />
                <span>2. Tono Exclusivo del Bloque de la Sorpresa</span>
              </label>
              <span className="text-[9px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                Independiente de la Página
              </span>
            </div>
            <p className="text-[10px] text-gray-500 font-light">
              Cambia únicamente el color del Rasca y Gana, Torta, Propuesta o Ticket sin alterar el resto de tu web.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SURPRISE_PRESETS.map((s) => {
                const isSelected = s.id === 'inherit' 
                  ? !customColors.surprisePrimary || customColors.surprisePrimary === customColors.primary
                  : customColors.surprisePrimary === s.primary;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      if (setCustomColors) {
                        setCustomColors({
                          ...customColors,
                          surprisePalette: s.id,
                          surprisePrimary: s.id === 'inherit' ? '' : s.primary
                        });
                      }
                    }}
                    className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col gap-1 ${
                      isSelected
                        ? 'border-[#a21232] bg-rose-50/50 ring-2 ring-[#a21232]/20 shadow-xs'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      {s.primary ? (
                        <span className="w-3.5 h-3.5 rounded-full border border-gray-300 shadow-2xs shrink-0" style={{ backgroundColor: s.primary }} />
                      ) : (
                        <span className="text-xs">🔗</span>
                      )}
                      <span className="text-[10px] font-bold text-gray-900 truncate">{s.name}</span>
                    </div>
                    <span className="text-[8px] text-gray-400 font-light truncate">{s.desc}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Color for surprise */}
            <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
              <span className="text-[9px] font-bold text-gray-600">Color a medida para la sorpresa:</span>
              <input
                type="color"
                value={customColors.surprisePrimary || customColors.primary}
                onChange={(e) => {
                  if (setCustomColors) {
                    setCustomColors({
                      ...customColors,
                      surprisePalette: 'custom',
                      surprisePrimary: e.target.value
                    });
                  }
                }}
                className="w-7 h-7 rounded-lg cursor-pointer border-0 p-0 bg-transparent"
              />
            </div>
          </div>

          {/* 3. 6 Dedication Final Styles (All Hearts Adapt to Page Colors) */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-[#a21232]" />
                <span>3. Estilo de la Dedicatoria Final (6 Diseños)</span>
              </label>
              <span className="text-[9px] text-gray-400 font-light">Corazón Integrado</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {DEDICATION_STYLES.map((style) => {
                const isSelected = (customColors.dedicationStyle || 'night') === style.id;
                const StyleIcon = style.icon;
                return (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => setCustomColors && setCustomColors({ ...customColors, dedicationStyle: style.id })}
                    className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col gap-1 ${
                      isSelected
                        ? 'border-[#a21232] bg-rose-50/50 shadow-xs ring-2 ring-[#a21232]/20'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs text-gray-900">
                      <StyleIcon className="w-3.5 h-3.5 text-[#a21232]" />
                      <span>{style.name}</span>
                    </div>
                    <span className="text-[9px] text-gray-400 font-light leading-tight">{style.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Typography Selector with Live Font Previews */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                <Type className="w-4 h-4 text-[#a21232]" />
                <span>4. Tipografía de la Página Web (15 Fuentes)</span>
              </label>

              <div className="flex gap-1 overflow-x-auto pb-1">
                {[
                  { id: 'all', label: 'Todas' },
                  { id: 'Cursiva', label: 'Cursivas' },
                  { id: 'Elegante', label: 'Elegantes' },
                  { id: 'Moderna', label: 'Modernas' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFontCategory(cat.id as any)}
                    className={`px-2.5 py-1 rounded-lg text-[9px] font-bold transition cursor-pointer ${
                      fontCategory === cat.id ? 'bg-[#a21232] text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-60 overflow-y-auto pr-1">
              {FONT_OPTIONS.filter(f => fontCategory === 'all' || f.category === fontCategory).map((font) => {
                const isSelected = customFont === font.id;
                return (
                  <button
                    key={font.id}
                    type="button"
                    onClick={() => setCustomFont && setCustomFont(font.id)}
                    className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between min-h-[70px] ${
                      isSelected
                        ? 'border-[#a21232] bg-rose-50/60 text-[#a21232] ring-2 ring-[#a21232]/30 shadow-xs'
                        : 'border-gray-200 bg-white hover:border-rose-200 text-gray-800'
                    }`}
                  >
                    <div>
                      <span className="text-base block truncate leading-tight" style={{ fontFamily: font.family }}>
                        {font.name}
                      </span>
                      <span className="text-[8px] text-gray-400 font-light block mt-0.5">{font.tag}</span>
                    </div>
                    <span className="text-[8px] font-bold uppercase opacity-60 mt-1 block">
                      {font.category}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Phone Simulator (5 cols) (Sticky) */}
        <div className="lg:col-span-5 sticky top-6 text-center space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block">
            📱 Previsualización en Vivo del Celular
          </span>

          <div className="flex justify-center">
            <div className="relative w-full max-w-[340px] bg-black rounded-[46px] p-3.5 shadow-2xl border-4 border-gray-800 ring-1 ring-gray-900/10">
              <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-4 bg-black rounded-full z-30 flex items-center justify-end pr-3">
                <div className="w-2.5 h-2.5 bg-gray-900 rounded-full border border-gray-800" />
              </div>

              <div
                className="w-full h-[560px] rounded-[36px] overflow-y-auto p-4 pt-10 text-center space-y-5 select-none relative shadow-inner transition-all duration-300"
                style={{
                  backgroundColor: customColors.bg || '#fffcfd',
                  fontFamily: activeFontFamily,
                  color: customColors.text || '#111827'
                }}
              >
                {/* SECTIONS RENDERING DYNAMICALLY IN ORDER (100% INHERITING CUSTOM FONT) */}
                {(() => {
                  let renderedGalleryCount = 0;
                  return sections.filter(sec => {
                    if (isBasic) {
                      return ['portada', 'tematica', 'contador', 'galeria', 'carta', 'corazones'].includes(sec.type);
                    }
                    return true;
                  }).map((sec) => {
                  if (sec.type === 'portada') {
                    return (
                      <div key={sec.id} className="space-y-2 py-4 border-b border-gray-100/50" style={{ fontFamily: activeFontFamily }}>
                        <span className="text-[10px] uppercase tracking-widest font-bold block" style={{ color: customColors.primary }}>
                          {isBirthday ? '¡Feliz Cumpleaños!' : isPregnancy ? '¡Una Nueva Vida Comienza!' : 'Para Ti Con Todo Mi Amor'}
                        </span>
                        <h1 className="text-2xl font-bold leading-tight" style={{ color: customColors.primary, fontFamily: activeFontFamily }}>
                          {title || (isBirthday ? `Para ${partnerName}` : 'Para el Amor de Mi Vida')}
                        </h1>
                        <p className="text-[11px] opacity-75 italic" style={{ fontFamily: activeFontFamily }}>
                          De parte de: <strong style={{ color: customColors.text }}>{userName || 'Tu Familia'}</strong>
                        </p>
                      </div>
                    );
                  }

                  {/* DYNAMIC MOVEABLE THEME INTERACTION */}
                  if (sec.type === 'tematica') {
                    return (
                      <div key={sec.id} style={{ fontFamily: activeFontFamily }}>
                        {renderThemeInteractiveWidget()}
                      </div>
                    );
                  }

                  if (sec.type === 'contador' && !isBirthday && !isPregnancy) {
                    return (
                      <div key={sec.id} className="rounded-2xl p-4 bg-white/80 border border-gray-200/60 shadow-xs space-y-2" style={{ fontFamily: activeFontFamily }}>
                        <span className="text-[9px] uppercase tracking-wider font-bold block" style={{ color: customColors.primary }}>
                          ⏱️ Tiempo Juntos
                        </span>
                        <div className="grid grid-cols-4 gap-1.5 text-center font-mono">
                          <div className="bg-gray-50/70 p-1.5 rounded-lg border border-gray-100">
                            <span className="block text-sm font-bold" style={{ color: customColors.primary }}>{timeElapsed.years}</span>
                            <span className="text-[7px] text-gray-500">Años</span>
                          </div>
                          <div className="bg-gray-50/70 p-1.5 rounded-lg border border-gray-100">
                            <span className="block text-sm font-bold" style={{ color: customColors.primary }}>{timeElapsed.days}</span>
                            <span className="text-[7px] text-gray-500">Días</span>
                          </div>
                          <div className="bg-gray-50/70 p-1.5 rounded-lg border border-gray-100">
                            <span className="block text-sm font-bold" style={{ color: customColors.primary }}>{timeElapsed.hours}</span>
                            <span className="text-[7px] text-gray-500">Horas</span>
                          </div>
                          <div className="bg-gray-50/70 p-1.5 rounded-lg border border-gray-100">
                            <span className="block text-sm font-bold" style={{ color: customColors.primary }}>{timeElapsed.minutes}</span>
                            <span className="text-[7px] text-gray-500">Min</span>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  {/* 💌 CARTA INTERACTIVA CON SOBRE Y CHAPITA */}
                  if (sec.type === 'carta') {
                    const letterText = historyText || message || 'Eres lo más hermoso que me ha pasado en la vida. Cada instante a tu lado es un regalo que atesoro en mi corazón...';
                    return (
                      <div key={sec.id} className="py-2 space-y-3" style={{ fontFamily: activeFontFamily }}>
                        <div 
                          className="relative overflow-hidden rounded-3xl border transition-all duration-300 shadow-md"
                          style={{
                            borderColor: `${customColors.primary}40`,
                            backgroundColor: isPreviewLetterOpen ? '#fffefc' : `${customColors.primary}08`
                          }}
                        >
                          {!isPreviewLetterOpen ? (
                            /* SOBRE CERRADO CON LA CHAPITA PULSANTE */
                            <div 
                              onClick={() => {
                                setIsPreviewLetterOpen(true);
                                confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 }, colors: [customColors.primary, '#f43f5e', '#ffffff'] });
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
                                  style={{ backgroundColor: customColors.primary }}
                                >
                                  <span className="text-xs">✨</span>
                                  <span>¡Aprieta aquí!</span>
                                </div>
                              </div>

                              <div className="space-y-0.5">
                                <h4 className="font-serif font-bold text-xs" style={{ color: customColors.primary, fontFamily: activeFontFamily }}>
                                  💌 Tienes una Carta de Dedicatoria
                                </h4>
                                <p className="text-[9px] text-gray-500 font-light">
                                  Toca la chapita del sobre para abrirla
                                </p>
                              </div>
                            </div>
                          ) : (
                            /* CARTA ABIERTA EN PERGAMINO */
                            <div className="p-5 text-left space-y-3 bg-gradient-to-b from-amber-50/40 via-white to-rose-50/30 animate-fade-in">
                              <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: `${customColors.primary}25` }}>
                                <span className="text-[9px] font-extrabold uppercase tracking-wider flex items-center gap-1.5" style={{ color: customColors.primary }}>
                                  <Mail className="w-3.5 h-3.5" /> Carta de Dedicatoria
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setIsPreviewLetterOpen(false)}
                                  className="text-[8px] font-bold px-2 py-0.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition cursor-pointer"
                                >
                                  ✉️ Guardar en sobre
                                </button>
                              </div>

                              <div className="space-y-2 py-1">
                                <h3 className="font-serif font-extrabold text-sm" style={{ color: customColors.primary, fontFamily: activeFontFamily }}>
                                  De mi corazón para ti ❤️
                                </h3>
                                <p className="text-xs font-serif italic leading-relaxed whitespace-pre-line text-gray-800 font-light" style={{ fontFamily: activeFontFamily }}>
                                  {letterText}
                                </p>
                              </div>

                              <div className="pt-2 border-t flex items-center justify-between" style={{ borderColor: `${customColors.primary}15` }}>
                                <span className="text-[8px] font-mono text-gray-400">
                                  📅 {specialDate || 'Para Siempre'}
                                </span>
                                <span className="text-[9px] font-serif font-bold italic" style={{ color: customColors.primary }}>
                                  De: {userName || 'Alguien que te ama'}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }

                  {/* VOICE NOTE WHATSAPP PLAYER */}
                  if (sec.type === 'audio') {
                    return (
                      <div key={sec.id} className="bg-white/95 rounded-3xl p-4 border shadow-md text-left space-y-2" style={{ borderColor: `${customColors.primary}40`, fontFamily: activeFontFamily }}>
                        <div className="flex items-center justify-between border-b pb-1" style={{ borderColor: `${customColors.primary}20` }}>
                          <span className="text-[8px] font-extrabold uppercase tracking-widest flex items-center gap-1" style={{ color: customColors.primary }}>
                            <Mic className="w-3 h-3" /> Nota de Voz Secreta
                          </span>
                          <span className="text-[7px] font-mono font-bold" style={{ color: customColors.primary }}>12:34 PM</span>
                        </div>

                        <div className="bg-[#e7fed6] rounded-2xl p-2.5 border border-[#c3f0a8] flex items-center gap-2.5 shadow-inner">
                          <button
                            type="button"
                            onClick={toggleVoiceNotePlay}
                            className="w-9 h-9 rounded-full bg-[#25d366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-xs shrink-0 transition-transform active:scale-95 cursor-pointer"
                          >
                            {isVoiceNotePlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
                          </button>

                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-0.5 h-4">
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
                            <div className="flex justify-between items-center text-[7px] text-gray-500 font-mono">
                              <span>{isVoiceNotePlaying ? '0:15' : '0:00'}</span>
                              <span className="text-blue-500 font-bold">✓✓ 0:35</span>
                            </div>
                          </div>

                          <div
                            className="w-8 h-8 rounded-full text-white font-bold flex items-center justify-center text-[10px] shadow-2xs shrink-0"
                            style={{ backgroundColor: customColors.primary }}
                          >
                            {userName ? userName.charAt(0).toUpperCase() : '❤️'}
                          </div>
                        </div>

                        {voiceNoteUrl && (
                          <audio ref={audioPlayerRef} src={voiceNoteUrl} className="hidden" onEnded={() => setIsVoiceNotePlaying(false)} />
                        )}
                      </div>
                    );
                  }

                  if (sec.type === 'galeria') {
                    renderedGalleryCount++;
                    const isSecondGallery = renderedGalleryCount > 1;
                    const isPlanPremium = selectedPlan === 'premium';
                    const galleryTitle = isPlanPremium 
                      ? (isSecondGallery ? '📸 Segunda Galería de Fotos' : '📸 Primera Galería de Fotos') 
                      : '📸 Galería de Fotos';

                    const currentGalleryPhotos = isSecondGallery && secondaryPhotos.length > 0 
                      ? secondaryPhotos 
                      : photos;

                    return (
                      <div key={sec.id} className="space-y-2 py-2" style={{ fontFamily: activeFontFamily }}>
                        <h3 className="text-xs font-bold" style={{ color: customColors.text, fontFamily: activeFontFamily }}>
                          {galleryTitle}
                        </h3>
                        <PhotoGallery
                          photos={currentGalleryPhotos.map(p => ({ url: p.previewUrl, caption: p.caption }))}
                          style={isSecondGallery && secondaryPhotoStyle ? secondaryPhotoStyle : photoStyle}
                          secondaryStyle={null}
                          primaryColor={customColors.primary}
                        />
                      </div>
                    );
                  }

                  if (sec.type === 'timeline') {
                    return (
                      <div key={sec.id} className="bg-white/90 rounded-2xl p-4 border border-gray-200/60 shadow-xs text-left space-y-3" style={{ fontFamily: activeFontFamily }}>
                        <h3 className="text-xs font-bold" style={{ color: customColors.primary, fontFamily: activeFontFamily }}>✨ Línea de Tiempo</h3>
                        <div className="space-y-3">
                          {milestones.map((m, mIdx) => (
                            <div key={mIdx} className="border-l-2 pl-3 py-1 space-y-1" style={{ borderColor: customColors.primary }}>
                              <span className="text-[8px] font-bold text-gray-400 font-mono">{m.date}</span>
                              <h4 className="text-[11px] font-bold text-gray-900" style={{ fontFamily: activeFontFamily }}>{m.title}</h4>
                              <p className="text-[9px] text-gray-600 font-light" style={{ fontFamily: activeFontFamily }}>{m.description}</p>
                              {m.previewUrl && (
                                <div className="relative w-full h-20 rounded-lg overflow-hidden mt-1">
                                  <Image src={m.previewUrl} alt={m.title} fill sizes="260px" className="object-cover" />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  if (sec.type === 'video') {
                    return (
                      <div key={sec.id} className="bg-white/90 rounded-2xl p-4 border border-gray-200/60 shadow-xs text-center space-y-2" style={{ fontFamily: activeFontFamily }}>
                        <h3 className="text-xs font-bold flex items-center justify-center gap-1" style={{ color: customColors.primary, fontFamily: activeFontFamily }}>
                          <VideoIcon className="w-3.5 h-3.5" /> Video Dedicado
                        </h3>
                        {uploadedVideoUrl ? (
                          <video src={uploadedVideoUrl} controls className="w-full rounded-xl max-h-48 object-cover shadow-xs" />
                        ) : youtubeVideoUrl ? (
                          <div className="aspect-video bg-gray-900 rounded-xl flex items-center justify-center text-white text-[10px]">
                            ▶️ Reproductor de Video de YouTube
                          </div>
                        ) : (
                          <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-[9px] text-gray-400">
                            📹 Video configurado para el momento especial
                          </div>
                        )}
                      </div>
                    );
                  }

                  if (sec.type === 'secreto') {
                    return (
                      <div key={sec.id} className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200/80 shadow-xs text-center space-y-2.5" style={{ fontFamily: activeFontFamily }}>
                        <span className="text-xl block">🔒</span>
                        <h3 className="text-xs font-bold text-amber-950 font-serif">Rincón Secreto Protegido</h3>
                        {secretHint && (
                          <div className="bg-white/90 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-xl text-[10px] font-medium inline-flex items-center gap-1 shadow-2xs">
                            <span>💡</span>
                            <span><strong>Pista:</strong> {secretHint}</span>
                          </div>
                        )}
                        <p className="text-[10px] text-amber-800 italic">
                          &quot;{secretMessage || 'Ingresa el PIN de 4 dígitos para revelar este mensaje secreto...'}&quot;
                        </p>
                      </div>
                    );
                  }

                  {/* 6 DEDICATION STYLES (100% ADAPTING TO PAGE PRIMARY COLOR AND CUSTOM FONT) */}
                  if (sec.type === 'corazones') {
                    const isNight = dedicationStyle === 'night';
                    const isClassic = dedicationStyle === 'classic';
                    const isGlass = dedicationStyle === 'glass';
                    const isVintage = dedicationStyle === 'vintage';
                    const isCosmic = dedicationStyle === 'cosmic';
                    const isVelvet = dedicationStyle === 'velvet';

                    let cardBg = '';
                    let cardBorder = '';
                    let titleColor = '';
                    let textColor = '';
                    let heartBg = `${customColors.primary}25`;
                    let heartBorder = `1.5px solid ${customColors.primary}`;
                    let heartColor = customColors.primary;
                    let heartShadow = `0 0 20px ${customColors.primary}80`;

                    if (isNight) {
                      cardBg = `linear-gradient(180deg, #0f172a 0%, #1e1b4b 60%, ${customColors.primary}bb 100%)`;
                      cardBorder = `1.5px solid ${customColors.primary}50`;
                      titleColor = '#ffffff';
                      textColor = '#f1f5f9';
                    } else if (isClassic) {
                      cardBg = '#ffffff';
                      cardBorder = `2px solid ${customColors.primary}`;
                      titleColor = customColors.primary;
                      textColor = '#1e293b';
                      heartBg = `${customColors.primary}15`;
                      heartShadow = `0 0 15px ${customColors.primary}40`;
                    } else if (isGlass) {
                      cardBg = 'rgba(255, 255, 255, 0.45)';
                      cardBorder = '1.5px solid rgba(255, 255, 255, 0.7)';
                      titleColor = customColors.primary;
                      textColor = '#0f172a';
                      heartBg = 'rgba(255, 255, 255, 0.6)';
                      heartShadow = `0 0 15px ${customColors.primary}50`;
                    } else if (isVintage) {
                      cardBg = '#fcf6e8';
                      cardBorder = `2px dashed ${customColors.primary}80`;
                      titleColor = customColors.primary;
                      textColor = '#3b2210';
                      heartBg = `${customColors.primary}15`;
                      heartShadow = `0 0 16px ${customColors.primary}60`;
                    } else if (isCosmic) {
                      cardBg = 'radial-gradient(ellipse at top, #1e1b4b 0%, #060814 80%)';
                      cardBorder = `1.5px solid ${customColors.primary}70`;
                      titleColor = customColors.primary;
                      textColor = '#ffffff';
                      heartBg = `${customColors.primary}30`;
                      heartShadow = `0 0 25px ${customColors.primary}90`;
                    } else if (isVelvet) {
                      cardBg = 'linear-gradient(145deg, #1c0d1b 0%, #2b1022 100%)';
                      cardBorder = `2px solid ${customColors.primary}80`;
                      titleColor = customColors.primary;
                      textColor = '#fffbeb';
                      heartBg = `${customColors.primary}25`;
                      heartShadow = `0 0 20px ${customColors.primary}80`;
                    }

                    return (
                      <div
                        key={sec.id}
                        className="rounded-2xl p-5 text-center shadow-lg transition-all duration-300 space-y-3 relative overflow-hidden"
                        style={{
                          background: cardBg,
                          border: cardBorder,
                          color: textColor,
                          fontFamily: activeFontFamily
                        }}
                      >
                        {/* Cosmic stars background effect */}
                        {isCosmic && (
                          <div className="absolute inset-0 opacity-40 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:12px_12px]" />
                        )}

                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center mx-auto transition-transform hover:scale-110 relative z-10"
                          style={{
                            backgroundColor: heartBg,
                            border: heartBorder,
                            boxShadow: heartShadow
                          }}
                        >
                          <Heart
                            className="w-7 h-7 animate-pulse"
                            style={{
                              color: heartColor,
                              fill: heartColor
                            }}
                          />
                        </div>

                        <span
                          className="text-[8px] uppercase tracking-widest font-bold block relative z-10"
                          style={{ color: titleColor, fontFamily: activeFontFamily }}
                        >
                          💖 Dedicatoria Especial
                        </span>

                        <p
                          className="italic text-[12px] leading-relaxed whitespace-pre-wrap px-2 relative z-10 font-medium"
                          style={{ color: textColor, fontFamily: activeFontFamily }}
                        >
                          &quot;{message || 'Hoy celebramos cada segundo juntos y todo lo maravilloso que está por venir.'}&quot;
                        </p>
                      </div>
                    );
                  }

                  return null;
                });
              })()}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
