'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { 
  Heart, 
  Trash2, 
  Plus, 
  ArrowUp, 
  ArrowDown, 
  ChevronDown, 
  ChevronUp, 
  Music, 
  Calendar, 
  Image as ImageIcon, 
  Sparkles,
  Lock,
  MapPin,
  Gift,
  Mail,
  Video,
  Mic,
  Square,
  Upload,
  Check,
  Layers,
  Clock,
  KeyRound,
  Trophy,
  Star,
  Handshake,
  Gem,
  Pin
} from 'lucide-react';
import PhotoStyleSelector from '@/components/gallery/PhotoStyleSelector';
import { PhotoStyle } from '@/types/gallery';
import { PhotoInput, MilestoneInput, ExperienceSection, CustomColors } from './types';
import { toast } from 'sonner';

interface Step2PersonalizacionProps {
  selectedPlan?: string;
  selectedTheme?: string;
  partnerName: string;
  setPartnerName: (val: string) => void;
  userName: string;
  setUserName: (val: string) => void;
  specialDate: string;
  setSpecialDate: (val: string) => void;
  title: string;
  setTitle: (val: string) => void;
  message: string;
  setMessage: (val: string) => void;
  historyText: string;
  setHistoryText: (val: string) => void;
  songUrl: string;
  setSongUrl: (val: string) => void;
  voiceNoteFile?: File | null;
  voiceNoteUrl?: string;
  handleVoiceNoteUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setVoiceNoteBlob?: (blob: Blob) => void;
  uploadedVideoFile?: File | null;
  uploadedVideoUrl?: string;
  youtubeVideoUrl?: string;
  setYoutubeVideoUrl?: (val: string) => void;
  handleVideoUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  secretPasscode: string;
  setSecretPasscode: (val: string) => void;
  secretHint?: string;
  setSecretHint?: (val: string) => void;
  secretMessage: string;
  setSecretMessage: (val: string) => void;
  // 12 Themes State Props
  birthdayWishMessage?: string;
  setBirthdayWishMessage?: (val: string) => void;
  birthdayBalloons?: [string, string, string];
  updateBirthdayBalloon?: (idx: number, val: string) => void;
  statsKisses?: string;
  setStatsKisses?: (val: string) => void;
  statsKissesLabel?: string;
  setStatsKissesLabel?: (val: string) => void;
  statsCoffees?: string;
  setStatsCoffees?: (val: string) => void;
  statsCoffeesLabel?: string;
  setStatsCoffeesLabel?: (val: string) => void;
  statsSmiles?: string;
  setStatsSmiles?: (val: string) => void;
  statsSmilesLabel?: string;
  setStatsSmilesLabel?: (val: string) => void;
  proposalQuestion: string;
  setProposalQuestion: (val: string) => void;
  proposalYesText?: string;
  setProposalYesText?: (val: string) => void;
  proposalCelebrationText?: string;
  setProposalCelebrationText?: (val: string) => void;
  ringBoxMessage?: string;
  setRingBoxMessage?: (val: string) => void;
  scratchPrompt?: string;
  setScratchPrompt?: (val: string) => void;
  scratchSecretMessage?: string;
  setScratchSecretMessage?: (val: string) => void;
  scratchUltrasoundUrl?: string;
  setScratchUltrasoundUrl?: (val: string) => void;
  pollQuestion?: string;
  pollOptionA?: string;
  pollOptionB?: string;
  setPollOptionA?: (val: string) => void;
  setPollOptionB?: (val: string) => void;
  setPollQuestion?: (val: string) => void;
  surpriseMessage: string;
  setSurpriseMessage: (val: string) => void;
  ticketTitle?: string;
  setTicketTitle?: (val: string) => void;
  ticketConditions?: string;
  setTicketConditions?: (val: string) => void;
  waxSealSender?: string;
  setWaxSealSender?: (val: string) => void;
  crystalHeartTitle?: string;
  crystalHeartSecret?: string;
  setCrystalHeartTitle?: (val: string) => void;
  setCrystalHeartSecret?: (val: string) => void;
  valentineBoxTitle?: string;
  setValentineBoxTitle?: (val: string) => void;
  valentineCoupon?: string;
  setValentineCoupon?: (val: string) => void;
  trophyTitle?: string;
  setTrophyTitle?: (val: string) => void;
  trophyCategory?: string;
  setTrophyCategory?: (val: string) => void;
  diplomaText?: string;
  setDiplomaText?: (val: string) => void;
  gratitudeStar1?: string;
  gratitudeStar2?: string;
  gratitudeStar3?: string;
  setGratitudeStar3?: (val: string) => void;
  setGratitudeStar1?: (val: string) => void;
  setGratitudeStar2?: (val: string) => void;
  reconciliationQuestion?: string;
  setReconciliationQuestion?: (val: string) => void;
  reconciliationPromise?: string;
  setReconciliationPromise?: (val: string) => void;
  specialPlaceAddress: string;
  setSpecialPlaceAddress: (val: string) => void;
  customFont?: string;
  setCustomFont?: (val: string) => void;
  customColors?: CustomColors;
  setCustomColors?: (val: CustomColors) => void;
  photoStyle: PhotoStyle;
  setPhotoStyle: (val: PhotoStyle) => void;
  secondaryPhotoStyle?: PhotoStyle | null;
  setSecondaryPhotoStyle?: (val: PhotoStyle | null) => void;
  enableDualPhotoStyle?: boolean;
  setEnableDualPhotoStyle?: (val: boolean) => void;
  sections: ExperienceSection[];
  expandedSection: string | null;
  setExpandedSection: (val: string | null) => void;
  photos: PhotoInput[];
  secondaryPhotos?: PhotoInput[];
  handleSecondaryPhotoUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeSecondaryPhoto?: (idx: number) => void;
  updateSecondaryPhotoCaption?: (idx: number, cap: string) => void;
  maxPrimaryPhotos?: number;
  maxSecondaryPhotos?: number;
  milestones: MilestoneInput[];
  addSection: (type: ExperienceSection['type']) => void;
  removeSection: (id: string) => void;
  moveSection: (idx: number, dir: 'up' | 'down') => void;
  handlePhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removePhoto: (idx: number) => void;
  updatePhotoCaption: (idx: number, cap: string) => void;
  addMilestone: () => void;
  removeMilestone: (idx: number) => void;
  updateMilestone: (idx: number, field: keyof MilestoneInput, val: any) => void;
  handleMilestoneImage: (idx: number, e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Step2Personalizacion({
  selectedPlan = 'medium',
  selectedTheme = 'anniversary',
  partnerName,
  setPartnerName,
  userName,
  setUserName,
  specialDate,
  setSpecialDate,
  title,
  setTitle,
  message,
  setMessage,
  historyText,
  setHistoryText,
  songUrl,
  setSongUrl,
  voiceNoteFile = null,
  voiceNoteUrl = '',
  handleVoiceNoteUpload,
  setVoiceNoteBlob,
  uploadedVideoFile = null,
  uploadedVideoUrl = '',
  youtubeVideoUrl = '',
  setYoutubeVideoUrl,
  handleVideoUpload,
  secretPasscode,
  setSecretPasscode,
  secretHint = '',
  setSecretHint,
  secretMessage,
  setSecretMessage,
  birthdayWishMessage = '¡Que todos tus deseos se hagan realidad en este nuevo año de vida! ✨',
  setBirthdayWishMessage,
  birthdayBalloons = ['¡Mucho Éxito y Alegría!', '¡Salud y Risas Siempre!', '¡Te Queremos Infinito!'],
  updateBirthdayBalloon,
  statsKisses = '2.500+',
  setStatsKisses,
  statsKissesLabel = '💋 Cantidad de Besos',
  setStatsKissesLabel,
  statsCoffees = '800+',
  setStatsCoffees,
  statsCoffeesLabel = '☕ Citas & Salidas',
  setStatsCoffeesLabel,
  statsSmiles = '1.000.000+',
  setStatsSmiles,
  statsSmilesLabel = '😊 Sonrisas Compartidas',
  setStatsSmilesLabel,
  proposalQuestion,
  setProposalQuestion,
  proposalYesText = '¡Sí, Acepto! ❤️',
  setProposalYesText,
  proposalCelebrationText = '¡Dijiste que Sí! Nuestra historia oficial comienza hoy ✨',
  setProposalCelebrationText,
  ringBoxMessage = 'Prometo amarte, cuidarte y hacerte sonreír cada día de mi vida 💍',
  setRingBoxMessage,
  scratchPrompt = 'Toca aquí para raspar y descubrir la noticia',
  setScratchPrompt,
  scratchSecretMessage = '¡Sorpresa! ¡Viene un Bebé en Camino! 🍼',
  setScratchSecretMessage,
  scratchUltrasoundUrl = '',
  setScratchUltrasoundUrl,
  pollQuestion = '¿Qué crees que será? 🍼',
  setPollQuestion,
  pollOptionA = 'Team Niño 💙',
  setPollOptionA,
  pollOptionB = 'Team Niña 💖',
  setPollOptionB,
  surpriseMessage,
  setSurpriseMessage,
  ticketTitle = 'Pase VIP / Cupón de Regalo',
  setTicketTitle,
  ticketConditions = 'Válido para canjear cuando tú quieras ❤️',
  setTicketConditions,
  waxSealSender = 'Con Todo Mi Amor',
  setWaxSealSender,
  crystalHeartTitle = 'Toca y Mantén Presionado el Corazón de Cristal',
  crystalHeartSecret = 'Me enamoré de ti desde el primer segundo en que te vi...',
  setCrystalHeartTitle,
  setCrystalHeartSecret,
  valentineBoxTitle = 'Caja de Bombones de San Valentín 🍫',
  setValentineBoxTitle,
  valentineCoupon = 'Vale por nuestra cita soñada de San Valentín ❤️',
  setValentineCoupon,
  trophyTitle = 'Trofeo al Mayor Logro y Esfuerzo 🏆',
  setTrophyTitle,
  trophyCategory = '¡Orgullo Total por tu Gran Meta Cumplida!',
  setTrophyCategory,
  diplomaText = 'Reconocimiento oficial a la persona más talentosa y perseverante.',
  setDiplomaText,
  gratitudeStar1 = 'Gracias por tu apoyo incondicional en cada momento ✨',
  setGratitudeStar1,
  gratitudeStar2 = 'Gracias por tus consejos y por creer siempre en mí 🌟',
  setGratitudeStar2,
  gratitudeStar3 = 'Gracias por iluminar mi vida con tu presencia 💛',
  setGratitudeStar3,
  reconciliationQuestion = 'Nuestro amor es más fuerte que cualquier error. ¿Hacemos las paces? 🤝❤️',
  setReconciliationQuestion,
  reconciliationPromise = 'Prometo aprender, escucharte y valorar cada instante a tu lado.',
  setReconciliationPromise,
  specialPlaceAddress,
  setSpecialPlaceAddress,
  photoStyle,
  setPhotoStyle,
  secondaryPhotoStyle = null,
  setSecondaryPhotoStyle,
  enableDualPhotoStyle = false,
  setEnableDualPhotoStyle,
  sections,
  expandedSection,
  setExpandedSection,
  photos,
  secondaryPhotos = [],
  handleSecondaryPhotoUpload,
  removeSecondaryPhoto,
  updateSecondaryPhotoCaption,
  maxPrimaryPhotos,
  maxSecondaryPhotos = 20,
  milestones,
  addSection,
  removeSection,
  moveSection,
  handlePhotoUpload,
  removePhoto,
  updatePhotoCaption,
  addMilestone,
  removeMilestone,
  updateMilestone,
  handleMilestoneImage,
}: Step2PersonalizacionProps) {
  // Audio Recorder State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        if (setVoiceNoteBlob) setVoiceNoteBlob(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
      toast.info('🎙️ Grabando audio... habla cerca de tu micrófono');
    } catch (err) {
      console.error(err);
      toast.error('No se pudo acceder al micrófono. Por favor permite el acceso.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const isBasic = selectedPlan === 'basic';
  const isMedium = selectedPlan === 'medium' || selectedPlan === 'card';
  const isPremium = selectedPlan === 'premium';

  // Dynamic gallery limits calculation
  const galleryCount = sections.filter(s => s.type === 'galeria').length;
  const isDualGallery = isPremium && galleryCount > 1;
  const computedMaxPrimary = maxPrimaryPhotos ?? (isPremium ? (isDualGallery ? 20 : 40) : isMedium ? 20 : 10);
  const isPrimaryFull = photos.length >= computedMaxPrimary;
  const isSecondaryFull = secondaryPhotos.length >= maxSecondaryPhotos;
  const planLabel = isPremium ? 'Plan Máximo (+40 Fotos)' : isBasic ? 'Plan Básico (10 Fotos)' : 'Plan Medio (20 Fotos)';

  // Minimum movable index: 0 is portada, 1 is musica (if in medium/premium)
  const hasFixedMusic = isMedium || isPremium;
  const minMovableIndex = hasFixedMusic ? 2 : 1;

  // 12 THEME FLAGS
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

  // Section icons and labels helper
  const getSectionMetadata = (type: ExperienceSection['type'], index?: number) => {
    switch (type) {
      case 'portada':
        return { 
          label: 'Portada Principal & Nombres', 
          icon: Sparkles, 
          color: 'text-rose-600', 
          deletable: false,
          isPinned: true,
          pinBadge: '📌 Bloque Fijo #1'
        };
      case 'musica':
        return { 
          label: 'Música de Fondo (YouTube)', 
          icon: Music, 
          color: 'text-pink-600', 
          deletable: false,
          isPinned: hasFixedMusic,
          pinBadge: '📌 Bloque Fijo #2'
        };
      case 'tematica':
        return { label: 'Sorpresa Temática Interactiva', icon: Gift, color: 'text-amber-600', deletable: true };
      case 'contador':
        return { label: isPregnancy ? 'Cuenta Regresiva de Llegada' : 'Contador de Tiempo Juntos', icon: Clock, color: 'text-blue-600', deletable: true };
      case 'carta':
        return { label: 'Carta de Dedicatoria', icon: Mail, color: 'text-purple-600', deletable: true };
      case 'galeria':
        if (isPremium) {
          return { 
            label: index && index > 1 ? 'Segunda Galería de Fotos' : 'Primera Galería de Fotos', 
            icon: ImageIcon, 
            color: index && index > 1 ? 'text-teal-600' : 'text-emerald-600', 
            deletable: true 
          };
        }
        return { label: 'Galería de Fotos', icon: ImageIcon, color: 'text-emerald-600', deletable: true };
      case 'audio':
        return { label: 'Nota de Voz Secreta (WhatsApp)', icon: Mic, color: 'text-emerald-700', deletable: true };
      case 'timeline':
        return { label: 'Línea de Tiempo con Fotos', icon: Calendar, color: 'text-indigo-600', deletable: true };
      case 'video':
        return { label: 'Video Dedicado', icon: Video, color: 'text-red-600', deletable: true };
      case 'secreto':
        return { label: 'Rincón Secreto con PIN', icon: KeyRound, color: 'text-amber-700', deletable: true };
      case 'corazones':
        return { label: 'Dedicatoria Final', icon: Heart, color: 'text-rose-600', deletable: true };
      default:
        return { label: 'Sección Personalizada', icon: Layers, color: 'text-gray-600', deletable: true };
    }
  };

  // DYNAMIC DISAPPEARING AVAILABLE SECTIONS POOL
  const activeTypes = sections.map(s => s.type);

  const ALL_POSSIBLE_SECTIONS = [
    { type: 'carta' as const, label: '💌 Carta de Dedicatoria', planRequired: 'basic', desc: 'Espacio para escribir tus sentimientos' },
    { type: 'contador' as const, label: '⏱️ Contador de Tiempo', planRequired: 'basic', desc: 'Años, días y segundos juntos' },
    { type: 'tematica' as const, label: '🎁 Sorpresa Temática', planRequired: 'basic', desc: 'Rasca y gana, torta o ticket' },
    { type: 'audio' as const, label: '🎙️ Nota de Voz Secreta', planRequired: 'premium', desc: 'Audio real estilo nota de WhatsApp' },
    { type: 'timeline' as const, label: '✨ Línea de Tiempo', planRequired: 'premium', desc: 'Hitos con fechas y fotos históricas' },
    { type: 'video' as const, label: '🎬 Video Dedicado', planRequired: 'premium', desc: 'Video en alta definición o YouTube' },
    { type: 'secreto' as const, label: '🔒 Rincón Secreto PIN', planRequired: 'premium', desc: 'Mensaje oculto protegido con contraseña' },
    { type: 'corazones' as const, label: '💖 Dedicatoria Final', planRequired: 'basic', desc: 'Tarjeta de cierre de la experiencia' },
  ];

  // Filter available sections (only show if NOT already in active sections!)
  const availableSections = ALL_POSSIBLE_SECTIONS.filter(item => !activeTypes.includes(item.type));

  // Secondary gallery for Premium plan
  const canAddSecondGallery = isPremium && galleryCount === 1;

  const handleAddSectionWithCheck = (type: ExperienceSection['type'], planRequired: string) => {
    if (planRequired === 'medium' && isBasic) {
      toast.error('🔒 Esta sección requiere Plan Medio o Plan Máximo.');
      return;
    }
    if (planRequired === 'premium' && (isBasic || isMedium)) {
      toast.error('🔒 Esta sección es exclusiva del Plan Máximo.');
      return;
    }
    addSection(type);
  };

  return (
    <div className="space-y-6 animate-fade-in text-left">
      {/* Header */}
      <div className="border-b border-rose-100 pb-3">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span>📝</span>
          <span>3. Contenido y Secciones de tu Experiencia</span>
        </h2>
        <p className="text-xs text-gray-500 font-light mt-1">
          La <strong>Portada</strong> y la <strong>Música</strong> están fijadas arriba como encabezado. Todos los demás bloques se pueden reordenar con ⬆️ / ⬇️.
        </p>
      </div>

      {/* Main Modular Builder Accordions */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-gray-150 pb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-700 font-serif flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-[#a21232]" />
            <span>Bloques de tu Página ({sections.length})</span>
          </span>
          <span className="text-[10px] text-gray-500 font-light">
            📌 Fijos en cabecera + bloques móviles
          </span>
        </div>

        {/* ACTIVE SECTIONS LIST */}
        <div className="space-y-3">
          {(() => {
            let galleryOrder = 0;
            return sections.map((sec, idx) => {
              if (sec.type === 'galeria') galleryOrder++;
              const isSecondGallery = sec.type === 'galeria' && galleryOrder > 1;
              const meta = getSectionMetadata(sec.type, sec.type === 'galeria' ? galleryOrder : undefined);
              const SectionIcon = meta.icon;
              const isExpanded = expandedSection === sec.id;
              const isPinned = Boolean(meta.isPinned);

              return (
                <div
                  key={sec.id}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isExpanded ? 'border-rose-300 ring-2 ring-rose-100 shadow-xs bg-white' : 'border-gray-200 bg-gray-50/50 hover:border-gray-300'
                  }`}
                >
                  {/* Header bar */}
                  <div className="p-3.5 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {/* Move Up / Down controls (only for non-pinned sections!) */}
                      {!isPinned ? (
                        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-0.5 shadow-2xs">
                          <button
                            type="button"
                            disabled={idx <= minMovableIndex}
                            onClick={() => moveSection(idx, 'up')}
                            className={`p-1 rounded transition cursor-pointer ${idx <= minMovableIndex ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-rose-50 hover:text-[#a21232]'}`}
                            title="Subir bloque"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === sections.length - 1}
                            onClick={() => moveSection(idx, 'down')}
                            className={`p-1 rounded transition cursor-pointer ${idx === sections.length - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-rose-50 hover:text-[#a21232]'}`}
                            title="Bajar bloque"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 px-2 py-1 bg-rose-50 border border-rose-200 rounded-lg text-[9px] font-bold text-[#a21232]">
                          <Pin className="w-3 h-3 text-[#a21232]" />
                          <span>{meta.pinBadge}</span>
                        </div>
                      )}

                      <div 
                        onClick={() => setExpandedSection(isExpanded ? null : sec.id)}
                        className="flex items-center gap-2 cursor-pointer select-none"
                      >
                        <SectionIcon className={`w-4 h-4 ${meta.color}`} />
                        <span className="text-xs font-bold text-gray-900 font-serif">{meta.label}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Delete button (returns to available blocks pool, not available for pinned) */}
                      {meta.deletable && (
                        <button
                          type="button"
                          onClick={() => removeSection(sec.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                          title="Eliminar de la página (quedará disponible abajo)"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setExpandedSection(isExpanded ? null : sec.id)}
                        className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition cursor-pointer"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* EXPANDED CONTENT FOR EACH SECTION TYPE */}
                  {isExpanded && (
                    <div className="p-4 pt-2 border-t border-gray-100 space-y-4 bg-white animate-fade-in">
                      
                      {/* 1. PORTADA */}
                      {sec.type === 'portada' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">
                              👤 ¿Para quién es el regalo? (Nombre)
                            </label>
                            <input
                              type="text"
                              value={partnerName}
                              onChange={(e) => setPartnerName(e.target.value)}
                              placeholder="Ej: Camila / Mi Amor"
                              className="w-full px-3 py-2 border border-gray-250 rounded-xl text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">
                              ✍️ ¿De parte de quién? (Tu Nombre)
                            </label>
                            <input
                              type="text"
                              value={userName}
                              onChange={(e) => setUserName(e.target.value)}
                              placeholder="Ej: Matías / Tu Novio"
                              className="w-full px-3 py-2 border border-gray-250 rounded-xl text-xs"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">
                              ✨ Título Principal de la Portada
                            </label>
                            <input
                              type="text"
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                              placeholder="Ej: Para el Amor de Mi Vida ❤️"
                              className="w-full px-3 py-2 border border-gray-250 rounded-xl text-xs font-serif"
                            />
                          </div>
                        </div>
                      )}

                      {/* 2. MUSICA DE FONDO (YouTube) - BLOQUE FIJO #2 */}
                      {sec.type === 'musica' && (
                        <div className="space-y-3 bg-pink-50/40 p-4 rounded-2xl border border-pink-200">
                          <div className="flex items-center justify-between">
                            <label className="block text-[9px] font-bold text-pink-900 uppercase">
                              🎵 Enlace de Canción de Fondo (YouTube)
                            </label>
                            <span className="text-[8px] bg-pink-100 text-pink-800 px-2 py-0.5 rounded-full font-bold">
                              📌 Fijo en la Cabecera
                            </span>
                          </div>
                          <input
                            type="url"
                            value={songUrl}
                            onChange={(e) => setSongUrl(e.target.value)}
                            placeholder="https://www.youtube.com/watch?v=..."
                            className="w-full px-3 py-2 border border-pink-250 rounded-xl text-xs bg-white font-mono"
                          />
                          <p className="text-[9px] text-pink-700 font-light">
                            ✨ Sonará automáticamente de fondo para acompañar la lectura de la experiencia.
                          </p>
                        </div>
                      )}

                      {/* 3. TEMATICA SORPRESA INTERACTIVA */}
                      {sec.type === 'tematica' && (
                        <div className="space-y-4">
                          
                          {/* 1. Cumpleaños */}
                          {isBirthday && (
                            <div className="space-y-3 bg-amber-50/60 p-4 rounded-2xl border border-amber-200">
                              <span className="text-[10px] font-bold text-amber-950 uppercase flex items-center gap-1.5">
                                <span>🎂</span>
                                <span>Configuración de Torta & Velas de Cumpleaños</span>
                              </span>
                              <div>
                                <label className="block text-[9px] font-bold text-amber-900 uppercase mb-1">
                                  ✨ Mensaje Secreto Revelado al Soplar las Velas
                                </label>
                                <textarea
                                  rows={2}
                                  value={birthdayWishMessage}
                                  onChange={(e) => setBirthdayWishMessage && setBirthdayWishMessage(e.target.value)}
                                  placeholder="¡Que todos tus sueños se cumplan en este nuevo año! ✨"
                                  className="w-full px-3 py-2 border border-amber-250 rounded-xl text-xs bg-white"
                                />
                              </div>
                              {!isBasic && (
                                <div className="pt-2 border-t border-amber-200 space-y-2">
                                  <span className="text-[9px] font-bold text-amber-900 uppercase block">
                                    🎈 3 Mensajes Ocultos en los Globos (Al Reventarlos)
                                  </span>
                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                    {[0, 1, 2].map((bIdx) => (
                                      <input
                                        key={bIdx}
                                        type="text"
                                        value={birthdayBalloons[bIdx]}
                                        onChange={(e) => updateBirthdayBalloon && updateBirthdayBalloon(bIdx, e.target.value)}
                                        placeholder={`Sorpresa Globo ${bIdx + 1}`}
                                        className="w-full px-2.5 py-1.5 border border-amber-250 rounded-lg text-xs bg-white"
                                      />
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* 2. Aniversario */}
                          {isAnniversary && (
                            <div className="space-y-4 bg-rose-50/60 p-4 sm:p-5 rounded-2xl border border-rose-200">
                              <div>
                                <span className="text-xs font-bold text-rose-950 uppercase flex items-center gap-1.5">
                                  <Heart className="w-4 h-4 text-rose-600 fill-rose-600" />
                                  <span>📊 Estadísticas de Nuestro Amor (100% Editables)</span>
                                </span>
                                <p className="text-[10px] text-gray-500 font-light mt-0.5">
                                  Personaliza el nombre, emoji y la cantidad de cada estadística de su historia juntos:
                                </p>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                                {/* Stat 1 */}
                                <div className="bg-white p-3 rounded-xl border border-rose-100 shadow-2xs space-y-2">
                                  <div>
                                    <label className="block text-[9px] font-bold text-gray-700 uppercase mb-0.5">
                                      Título Estadística #1
                                    </label>
                                    <input
                                      type="text"
                                      value={statsKissesLabel}
                                      onChange={(e) => setStatsKissesLabel && setStatsKissesLabel(e.target.value)}
                                      placeholder="Ej: 💋 Cantidad de Besos"
                                      className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs bg-gray-50/50 focus:bg-white font-medium"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[9px] font-bold text-[#a21232] uppercase mb-0.5">
                                      Número / Cantidad
                                    </label>
                                    <input
                                      type="text"
                                      value={statsKisses}
                                      onChange={(e) => setStatsKisses && setStatsKisses(e.target.value)}
                                      placeholder="Ej: 2.500+"
                                      className="w-full px-2.5 py-1.5 border border-rose-200 rounded-lg text-xs bg-white font-bold text-gray-900"
                                    />
                                  </div>
                                </div>

                                {/* Stat 2 */}
                                <div className="bg-white p-3 rounded-xl border border-rose-100 shadow-2xs space-y-2">
                                  <div>
                                    <label className="block text-[9px] font-bold text-gray-700 uppercase mb-0.5">
                                      Título Estadística #2
                                    </label>
                                    <input
                                      type="text"
                                      value={statsCoffeesLabel}
                                      onChange={(e) => setStatsCoffeesLabel && setStatsCoffeesLabel(e.target.value)}
                                      placeholder="Ej: ☕ Citas & Salidas"
                                      className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs bg-gray-50/50 focus:bg-white font-medium"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[9px] font-bold text-[#a21232] uppercase mb-0.5">
                                      Número / Cantidad
                                    </label>
                                    <input
                                      type="text"
                                      value={statsCoffees}
                                      onChange={(e) => setStatsCoffees && setStatsCoffees(e.target.value)}
                                      placeholder="Ej: 800+"
                                      className="w-full px-2.5 py-1.5 border border-rose-200 rounded-lg text-xs bg-white font-bold text-gray-900"
                                    />
                                  </div>
                                </div>

                                {/* Stat 3 */}
                                <div className="bg-white p-3 rounded-xl border border-rose-100 shadow-2xs space-y-2">
                                  <div>
                                    <label className="block text-[9px] font-bold text-gray-700 uppercase mb-0.5">
                                      Título Estadística #3
                                    </label>
                                    <input
                                      type="text"
                                      value={statsSmilesLabel}
                                      onChange={(e) => setStatsSmilesLabel && setStatsSmilesLabel(e.target.value)}
                                      placeholder="Ej: 😊 Sonrisas Compartidas"
                                      className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs bg-gray-50/50 focus:bg-white font-medium"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[9px] font-bold text-[#a21232] uppercase mb-0.5">
                                      Número / Cantidad
                                    </label>
                                    <input
                                      type="text"
                                      value={statsSmiles}
                                      onChange={(e) => setStatsSmiles && setStatsSmiles(e.target.value)}
                                      placeholder="Ej: 1.000.000+"
                                      className="w-full px-2.5 py-1.5 border border-rose-200 rounded-lg text-xs bg-white font-bold text-gray-900"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* 3 & 4. Propuestas (Noviazgo / Matrimonio) */}
                          {(isDatingProposal || isMarriageProposal) && (
                            <div className="space-y-3 bg-rose-50/60 p-4 rounded-2xl border border-rose-200">
                              <span className="text-[10px] font-bold text-rose-950 uppercase flex items-center gap-1.5">
                                <span>{isMarriageProposal ? '💍' : '💌'}</span>
                                <span>Configuración de la Propuesta {isMarriageProposal ? 'de Matrimonio' : 'de Noviazgo'}</span>
                              </span>
                              <div>
                                <label className="block text-[9px] font-bold text-rose-900 uppercase mb-1">
                                  💖 Pregunta de la Propuesta
                                </label>
                                <input
                                  type="text"
                                  value={proposalQuestion}
                                  onChange={(e) => setProposalQuestion(e.target.value)}
                                  className="w-full px-3 py-2 border border-rose-250 rounded-xl text-xs bg-white font-serif font-bold"
                                />
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-[9px] font-bold text-rose-900 uppercase mb-1">
                                    ❤️ Texto del Botón de Aceptación
                                  </label>
                                  <input
                                    type="text"
                                    value={proposalYesText}
                                    onChange={(e) => setProposalYesText && setProposalYesText(e.target.value)}
                                    className="w-full px-3 py-2 border border-rose-250 rounded-xl text-xs bg-white"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[9px] font-bold text-rose-900 uppercase mb-1">
                                    🎉 Mensaje de Celebración
                                  </label>
                                  <input
                                    type="text"
                                    value={proposalCelebrationText}
                                    onChange={(e) => setProposalCelebrationText && setProposalCelebrationText(e.target.value)}
                                    className="w-full px-3 py-2 border border-rose-250 rounded-xl text-xs bg-white"
                                  />
                                </div>
                              </div>
                              {isMarriageProposal && (
                                <div className="pt-2 border-t border-rose-200">
                                  <label className="block text-[9px] font-bold text-rose-900 uppercase mb-1">
                                    💎 Mensaje al abrir la Cajita del Anillo
                                  </label>
                                  <input
                                    type="text"
                                    value={ringBoxMessage}
                                    onChange={(e) => setRingBoxMessage && setRingBoxMessage(e.target.value)}
                                    className="w-full px-3 py-2 border border-rose-250 rounded-xl text-xs bg-white"
                                  />
                                </div>
                              )}
                            </div>
                          )}

                          {/* 5. Embarazo */}
                          {isPregnancy && (
                            <div className="space-y-3 bg-cyan-50/60 p-4 rounded-2xl border border-cyan-200">
                              <span className="text-[10px] font-bold text-cyan-950 uppercase flex items-center gap-1.5">
                                <span>🍼</span>
                                <span>Configuración de la Noticia de Embarazo</span>
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-[9px] font-bold text-cyan-900 uppercase mb-1">
                                    🪙 Texto que invita a raspar
                                  </label>
                                  <input
                                    type="text"
                                    value={scratchPrompt}
                                    onChange={(e) => setScratchPrompt && setScratchPrompt(e.target.value)}
                                    className="w-full px-3 py-2 border border-cyan-250 rounded-xl text-xs bg-white"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[9px] font-bold text-cyan-900 uppercase mb-1">
                                    👶 Mensaje Secreto al Raspar
                                  </label>
                                  <input
                                    type="text"
                                    value={scratchSecretMessage}
                                    onChange={(e) => setScratchSecretMessage && setScratchSecretMessage(e.target.value)}
                                    className="w-full px-3 py-2 border border-cyan-250 rounded-xl text-xs bg-white font-bold"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-[9px] font-bold text-cyan-900 uppercase mb-1">
                                  🖼️ URL o Foto de la Ecografía (Opcional)
                                </label>
                                <input
                                  type="url"
                                  value={scratchUltrasoundUrl}
                                  onChange={(e) => setScratchUltrasoundUrl && setScratchUltrasoundUrl(e.target.value)}
                                  placeholder="https://..."
                                  className="w-full px-3 py-2 border border-cyan-250 rounded-xl text-xs bg-white"
                                />
                              </div>

                              {!isBasic && (
                                <div className="pt-2 border-t border-cyan-200 grid grid-cols-1 sm:grid-cols-3 gap-2">
                                  <div>
                                    <label className="block text-[8px] font-bold text-cyan-900 uppercase mb-1">Pregunta Encuesta</label>
                                    <input
                                      type="text"
                                      value={pollQuestion}
                                      onChange={(e) => setPollQuestion && setPollQuestion(e.target.value)}
                                      className="w-full px-2.5 py-1.5 border border-cyan-250 rounded-lg text-xs bg-white"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[8px] font-bold text-cyan-900 uppercase mb-1">Opción A</label>
                                    <input
                                      type="text"
                                      value={pollOptionA}
                                      onChange={(e) => setPollOptionA && setPollOptionA(e.target.value)}
                                      className="w-full px-2.5 py-1.5 border border-cyan-250 rounded-lg text-xs bg-white"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[8px] font-bold text-cyan-900 uppercase mb-1">Opción B</label>
                                    <input
                                      type="text"
                                      value={pollOptionB}
                                      onChange={(e) => setPollOptionB && setPollOptionB(e.target.value)}
                                      className="w-full px-2.5 py-1.5 border border-cyan-250 rounded-lg text-xs bg-white"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* 6. Regalo Sorpresa */}
                          {isSurprise && (
                            <div className="space-y-3 bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200">
                              <span className="text-[10px] font-bold text-emerald-950 uppercase flex items-center gap-1.5">
                                <Gift className="w-3.5 h-3.5 text-emerald-600" />
                                <span>🎟️ Configuración de Pase VIP / Cupón de Regalo</span>
                              </span>
                              <div>
                                <label className="block text-[9px] font-bold text-emerald-900 uppercase mb-1">
                                  Título del Ticket / Cupón
                                </label>
                                <input
                                  type="text"
                                  value={ticketTitle}
                                  onChange={(e) => setTicketTitle && setTicketTitle(e.target.value)}
                                  className="w-full px-3 py-2 border border-emerald-250 rounded-xl text-xs bg-white"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] font-bold text-emerald-900 uppercase mb-1">
                                  🎁 Regalo Revelado al Abrir la Caja
                                </label>
                                <input
                                  type="text"
                                  value={surpriseMessage}
                                  onChange={(e) => setSurpriseMessage(e.target.value)}
                                  className="w-full px-3 py-2 border border-emerald-250 rounded-xl text-xs bg-white font-serif font-bold"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] font-bold text-emerald-900 uppercase mb-1">
                                  📜 Condiciones de Canje
                                </label>
                                <input
                                  type="text"
                                  value={ticketConditions}
                                  onChange={(e) => setTicketConditions && setTicketConditions(e.target.value)}
                                  className="w-full px-3 py-2 border border-emerald-250 rounded-xl text-xs bg-white"
                                />
                              </div>
                            </div>
                          )}

                          {/* 7. Carta Sellada con Lacre */}
                          {isLoveLetter && (
                            <div className="space-y-3 bg-amber-50/60 p-4 rounded-2xl border border-amber-200">
                              <span className="text-[10px] font-bold text-amber-950 uppercase flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5 text-amber-600" />
                                <span>💌 Carta con Sello de Lacre Real</span>
                              </span>
                              <div>
                                <label className="block text-[9px] font-bold text-amber-900 uppercase mb-1">
                                  Firma del Remitente en el Sello
                                </label>
                                <input
                                  type="text"
                                  value={waxSealSender}
                                  onChange={(e) => setWaxSealSender && setWaxSealSender(e.target.value)}
                                  placeholder="Con Todo Mi Amor..."
                                  className="w-full px-3 py-2 border border-amber-250 rounded-xl text-xs bg-white"
                                />
                              </div>
                            </div>
                          )}

                          {/* 8. Confesión / Corazón de Cristal */}
                          {isLoveConfession && (
                            <div className="space-y-3 bg-indigo-50/60 p-4 rounded-2xl border border-indigo-200">
                              <span className="text-[10px] font-bold text-indigo-950 uppercase flex items-center gap-1.5">
                                <Gem className="w-3.5 h-3.5 text-indigo-600" />
                                <span>💎 Corazón de Cristal Encantado</span>
                              </span>
                              <div>
                                <label className="block text-[9px] font-bold text-indigo-900 uppercase mb-1">
                                  Título del Corazón de Cristal
                                </label>
                                <input
                                  type="text"
                                  value={crystalHeartTitle}
                                  onChange={(e) => setCrystalHeartTitle && setCrystalHeartTitle(e.target.value)}
                                  className="w-full px-3 py-2 border border-indigo-250 rounded-xl text-xs bg-white"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] font-bold text-indigo-900 uppercase mb-1">
                                  💖 Confesión Íntima Revelada al Derretir el Cristal
                                </label>
                                <textarea
                                  rows={3}
                                  value={crystalHeartSecret}
                                  onChange={(e) => setCrystalHeartSecret && setCrystalHeartSecret(e.target.value)}
                                  className="w-full px-3 py-2 border border-indigo-250 rounded-xl text-xs bg-white font-serif"
                                />
                              </div>
                            </div>
                          )}

                          {/* 9. San Valentín */}
                          {isValentines && (
                            <div className="space-y-3 bg-pink-50/60 p-4 rounded-2xl border border-pink-200">
                              <span className="text-[10px] font-bold text-pink-950 uppercase flex items-center gap-1.5">
                                <span>🍫</span>
                                <span>Caja de Bombones de San Valentín</span>
                              </span>
                              <div>
                                <label className="block text-[9px] font-bold text-pink-900 uppercase mb-1">
                                  Título de la Caja
                                </label>
                                <input
                                  type="text"
                                  value={valentineBoxTitle}
                                  onChange={(e) => setValentineBoxTitle && setValentineBoxTitle(e.target.value)}
                                  className="w-full px-3 py-2 border border-pink-250 rounded-xl text-xs bg-white"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] font-bold text-pink-900 uppercase mb-1">
                                  🌹 Cupón Romántico Oculto
                                </label>
                                <input
                                  type="text"
                                  value={valentineCoupon}
                                  onChange={(e) => setValentineCoupon && setValentineCoupon(e.target.value)}
                                  className="w-full px-3 py-2 border border-pink-250 rounded-xl text-xs bg-white font-serif"
                                />
                              </div>
                            </div>
                          )}

                          {/* 10. Felicitación / Mayor Logro */}
                          {isSpecial && (
                            <div className="space-y-3 bg-amber-50/60 p-4 rounded-2xl border border-amber-200">
                              <span className="text-[10px] font-bold text-amber-950 uppercase flex items-center gap-1.5">
                                <Trophy className="w-3.5 h-3.5 text-amber-600" />
                                <span>🏆 Trofeo & Reconocimiento al Mayor Logro</span>
                              </span>
                              <div>
                                <label className="block text-[9px] font-bold text-amber-900 uppercase mb-1">
                                  Título del Trofeo
                                </label>
                                <input
                                  type="text"
                                  value={trophyTitle}
                                  onChange={(e) => setTrophyTitle && setTrophyTitle(e.target.value)}
                                  className="w-full px-3 py-2 border border-amber-250 rounded-xl text-xs bg-white"
                                />
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-[9px] font-bold text-amber-900 uppercase mb-1">Categoría / Motivo</label>
                                  <input
                                    type="text"
                                    value={trophyCategory}
                                    onChange={(e) => setTrophyCategory && setTrophyCategory(e.target.value)}
                                    className="w-full px-3 py-2 border border-amber-250 rounded-xl text-xs bg-white"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[9px] font-bold text-amber-900 uppercase mb-1">Texto del Diploma</label>
                                  <input
                                    type="text"
                                    value={diplomaText}
                                    onChange={(e) => setDiplomaText && setDiplomaText(e.target.value)}
                                    className="w-full px-3 py-2 border border-amber-250 rounded-xl text-xs bg-white"
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {/* 11. Frasco de Gratitud */}
                          {isGratitude && (
                            <div className="space-y-3 bg-amber-50/60 p-4 rounded-2xl border border-amber-200">
                              <span className="text-[10px] font-bold text-amber-950 uppercase flex items-center gap-1.5">
                                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                <span>⭐ 3 Motivos de Gratitud Infinita</span>
                              </span>
                              <div className="space-y-2">
                                <div>
                                  <label className="block text-[8px] font-bold text-amber-900 uppercase mb-0.5">Estrella 1</label>
                                  <input
                                    type="text"
                                    value={gratitudeStar1}
                                    onChange={(e) => setGratitudeStar1 && setGratitudeStar1(e.target.value)}
                                    className="w-full px-3 py-1.5 border border-amber-250 rounded-xl text-xs bg-white"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[8px] font-bold text-amber-900 uppercase mb-0.5">Estrella 2</label>
                                  <input
                                    type="text"
                                    value={gratitudeStar2}
                                    onChange={(e) => setGratitudeStar2 && setGratitudeStar2(e.target.value)}
                                    className="w-full px-3 py-1.5 border border-amber-250 rounded-xl text-xs bg-white"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[8px] font-bold text-amber-900 uppercase mb-0.5">Estrella 3</label>
                                  <input
                                    type="text"
                                    value={gratitudeStar3}
                                    onChange={(e) => setGratitudeStar3 && setGratitudeStar3(e.target.value)}
                                    className="w-full px-3 py-1.5 border border-amber-250 rounded-xl text-xs bg-white"
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {/* 12. Reconciliación */}
                          {isReconciliation && (
                            <div className="space-y-3 bg-rose-50/60 p-4 rounded-2xl border border-rose-200 animate-fade-in">
                              <span className="text-[10px] font-bold text-rose-950 uppercase flex items-center gap-1.5">
                                <Handshake className="w-3.5 h-3.5 text-rose-600" />
                                <span>🕊️ Unir Nuestros Caminos & Promesa de Amor</span>
                              </span>
                              <div>
                                <label className="block text-[9px] font-bold text-rose-900 uppercase mb-1">
                                  💖 Pregunta de Reconciliación
                                </label>
                                <input
                                  type="text"
                                  value={reconciliationQuestion}
                                  onChange={(e) => setReconciliationQuestion && setReconciliationQuestion(e.target.value)}
                                  placeholder="Nuestro amor es más fuerte que cualquier error. ¿Hacemos las paces? 🤝❤️"
                                  className="w-full px-3 py-2 border border-rose-250 rounded-xl text-xs bg-white font-serif font-bold"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] font-bold text-rose-900 uppercase mb-1">
                                  ✨ Promesa Revelada al Unir los Corazones
                                </label>
                                <textarea
                                  rows={3}
                                  value={reconciliationPromise}
                                  onChange={(e) => setReconciliationPromise && setReconciliationPromise(e.target.value)}
                                  placeholder="Prometo aprender, escucharte y valorar cada instante a tu lado..."
                                  className="w-full px-3 py-2 border border-rose-250 rounded-xl text-xs bg-white font-serif"
                                />
                              </div>
                            </div>
                          )}

                        </div>
                      )}

                      {/* 4. CONTADOR DE TIEMPO */}
                      {sec.type === 'contador' && (
                        <div className="space-y-3">
                          <label className="block text-[9px] font-bold text-gray-500 uppercase">
                            📅 {isPregnancy ? 'Fecha Estimada de Nacimiento del Bebé' : 'Fecha Especial / Inicio de la Relación'}
                          </label>
                          <input
                            type="date"
                            value={specialDate}
                            onChange={(e) => setSpecialDate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-250 rounded-xl text-xs bg-white"
                          />
                        </div>
                      )}

                      {/* 5. CARTA DE AMOR (Disponible para TODOS los planes) */}
                      {sec.type === 'carta' && (
                        <div className="space-y-3">
                          <label className="block text-[9px] font-bold text-gray-500 uppercase">
                            💌 Carta Escrita con el Corazón
                          </label>
                          <textarea
                            rows={4}
                            value={historyText}
                            onChange={(e) => setHistoryText(e.target.value)}
                            placeholder="Escribe aquí tu carta de amor, dedicatoria o mensaje emotivo..."
                            className="w-full px-3 py-2 border border-gray-250 rounded-xl text-xs bg-white font-serif leading-relaxed"
                          />
                        </div>
                      )}

                      {/* 6. GALERIA DE FOTOS (PRIMERA GALERIA) */}
                      {sec.type === 'galeria' && !isSecondGallery && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between border-b pb-2">
                            <span className="text-[10px] font-bold text-gray-700 uppercase">
                              📸 {isPremium ? 'Primera Galería de Fotos' : 'Fotos Cargadas'} ({photos.length}/{computedMaxPrimary})
                            </span>
                            <span className="text-[9px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                              {planLabel}
                            </span>
                          </div>

                          {/* Upload button */}
                          {!isPrimaryFull ? (
                            <label className="w-full py-4 border-2 border-dashed border-rose-200 rounded-2xl flex flex-col items-center justify-center gap-1.5 cursor-pointer bg-rose-50/30 hover:bg-rose-50 transition">
                              <Upload className="w-5 h-5 text-[#a21232]" />
                              <span className="text-xs font-bold text-[#a21232]">Seleccionar Fotos de tu Dispositivo</span>
                              <span className="text-[9px] text-gray-400">Hasta {computedMaxPrimary - photos.length} fotos más disponibles</span>
                              <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handlePhotoUpload}
                                className="hidden"
                              />
                            </label>
                          ) : (
                            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-center text-xs font-bold text-amber-800">
                              ✓ Límite de {computedMaxPrimary} fotos alcanzado para esta galería.
                            </div>
                          )}

                          {/* Photo Grid */}
                          {photos.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-56 overflow-y-auto pr-1">
                              {photos.map((p, pIdx) => (
                                <div key={pIdx} className="relative group rounded-xl overflow-hidden border border-gray-200 shadow-2xs h-24">
                                  <Image src={p.previewUrl} alt={`Foto ${pIdx + 1}`} fill sizes="120px" className="object-cover" />
                                  <button
                                    type="button"
                                    onClick={() => removePhoto(pIdx)}
                                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md opacity-90 hover:opacity-100 cursor-pointer z-10"
                                  >
                                    ×
                                  </button>
                                  <input
                                    type="text"
                                    value={p.caption}
                                    onChange={(e) => updatePhotoCaption(pIdx, e.target.value)}
                                    placeholder="Pie de foto..."
                                    className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] px-1.5 py-0.5 outline-none placeholder-gray-300 font-light z-10"
                                  />
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Style Selector */}
                          <div className="pt-2 border-t">
                            <label className="block text-[9px] font-bold text-gray-500 uppercase mb-2">
                              🎨 Estilo de Diseño de {isPremium ? 'la Primera Galería' : 'la Galería'}
                            </label>
                            <PhotoStyleSelector
                              selectedPlan={selectedPlan}
                              selectedStyle={photoStyle}
                              onSelectStyle={setPhotoStyle}
                              secondaryStyle={secondaryPhotoStyle}
                              onSelectSecondaryStyle={setSecondaryPhotoStyle}
                              enableDualStyle={enableDualPhotoStyle}
                              onToggleDualStyle={setEnableDualPhotoStyle}
                            />
                          </div>
                        </div>
                      )}

                      {/* 6B. SEGUNDA GALERIA DE FOTOS (EXCLUSIVA PLAN PREMIUM) */}
                      {sec.type === 'galeria' && isSecondGallery && (
                        <div className="space-y-4 bg-teal-50/30 p-4 rounded-2xl border border-teal-200 animate-fade-in">
                          <div className="flex items-center justify-between border-b border-teal-200 pb-2">
                            <span className="text-[10px] font-bold text-teal-950 uppercase">
                              📸 Segunda Galería de Fotos ({secondaryPhotos.length}/{maxSecondaryPhotos})
                            </span>
                            <span className="text-[9px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full font-bold">
                              👑 Plan Máximo (Hasta 20 Fotos)
                            </span>
                          </div>

                          {/* Upload button for secondary gallery */}
                          {!isSecondaryFull ? (
                            <label className="w-full py-4 border-2 border-dashed border-teal-300 rounded-2xl flex flex-col items-center justify-center gap-1.5 cursor-pointer bg-white hover:bg-teal-50/50 transition">
                              <Upload className="w-5 h-5 text-teal-700" />
                              <span className="text-xs font-bold text-teal-800">Seleccionar Fotos para la 2da Galería</span>
                              <span className="text-[9px] text-gray-400">Hasta {maxSecondaryPhotos - secondaryPhotos.length} fotos más disponibles</span>
                              <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleSecondaryPhotoUpload}
                                className="hidden"
                              />
                            </label>
                          ) : (
                            <div className="p-3 bg-teal-100 border border-teal-300 rounded-xl text-center text-xs font-bold text-teal-900">
                              ✓ Límite de {maxSecondaryPhotos} fotos alcanzado para la Segunda Galería.
                            </div>
                          )}

                          {/* Secondary Photo Grid */}
                          {secondaryPhotos.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-56 overflow-y-auto pr-1">
                              {secondaryPhotos.map((p, pIdx) => (
                                <div key={pIdx} className="relative group rounded-xl overflow-hidden border border-teal-200 shadow-2xs h-24">
                                  <Image src={p.previewUrl} alt={`Foto 2da Galería ${pIdx + 1}`} fill sizes="120px" className="object-cover" />
                                  <button
                                    type="button"
                                    onClick={() => removeSecondaryPhoto && removeSecondaryPhoto(pIdx)}
                                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md opacity-90 hover:opacity-100 cursor-pointer z-10"
                                  >
                                    ×
                                  </button>
                                  <input
                                    type="text"
                                    value={p.caption}
                                    onChange={(e) => updateSecondaryPhotoCaption && updateSecondaryPhotoCaption(pIdx, e.target.value)}
                                    placeholder="Pie de foto..."
                                    className="w-full text-[9px] px-1.5 py-1 bg-white/95 border-t border-gray-200"
                                  />
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Secondary Style Selector */}
                          <div className="pt-2 border-t border-teal-200">
                            <label className="block text-[9px] font-bold text-teal-900 uppercase mb-2">
                              🎨 Estilo de Diseño de la Segunda Galería
                            </label>
                            <PhotoStyleSelector
                              selectedPlan={selectedPlan}
                              selectedStyle={secondaryPhotoStyle || 'collage'}
                              onSelectStyle={(st) => setSecondaryPhotoStyle && setSecondaryPhotoStyle(st)}
                            />
                          </div>
                        </div>
                      )}

                      {/* 7. NOTA DE VOZ (WhatsApp) */}
                      {sec.type === 'audio' && (
                        <div className="space-y-4 bg-gradient-to-r from-emerald-50/70 to-teal-50/60 p-4 rounded-2xl border border-emerald-200">
                          <span className="text-[10px] font-bold text-emerald-950 uppercase flex items-center gap-1.5">
                            <Mic className="w-3.5 h-3.5 text-emerald-600" />
                            <span>🎙️ Grabador de Nota de Voz Real de WhatsApp</span>
                          </span>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                            <div className="bg-white p-3 rounded-xl border border-emerald-200 text-center space-y-2">
                              {!isRecording ? (
                                <button
                                  type="button"
                                  onClick={startRecording}
                                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer"
                                >
                                  <Mic className="w-3.5 h-3.5" />
                                  <span>Grabar con Micrófono</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={stopRecording}
                                  className="w-full py-2 bg-red-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer animate-pulse"
                                >
                                  <Square className="w-3 h-3 fill-white" />
                                  <span>Detener ({recordingSeconds}s)</span>
                                </button>
                              )}
                            </div>

                            <div className="bg-white p-3 rounded-xl border border-emerald-200 text-center space-y-2">
                              <label className="w-full py-2 bg-gray-100 hover:bg-emerald-50 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 transition flex items-center justify-center gap-1.5 cursor-pointer">
                                <Upload className="w-3.5 h-3.5 text-emerald-600" />
                                <span>{voiceNoteFile ? `✓ Audio cargado` : 'Subir Archivo de Audio'}</span>
                                <input
                                  type="file"
                                  accept="audio/*"
                                  onChange={handleVoiceNoteUpload}
                                  className="hidden"
                                />
                              </label>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 8. TIMELINE (Hitos con subida de fotos real) */}
                      {sec.type === 'timeline' && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="block text-[9px] font-bold text-gray-500 uppercase">
                              ✨ Hitos y Momentos Clave
                            </label>
                            <button
                              type="button"
                              onClick={addMilestone}
                              className="px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg text-[10px] font-bold transition hover:bg-indigo-100 cursor-pointer flex items-center gap-1"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Agregar Hito</span>
                            </button>
                          </div>

                          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                            {milestones.map((m, mIdx) => (
                              <div key={mIdx} className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2 relative">
                                <button
                                  type="button"
                                  onClick={() => removeMilestone(mIdx)}
                                  className="absolute top-2 right-2 text-gray-400 hover:text-red-600 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  <input
                                    type="text"
                                    value={m.title}
                                    onChange={(e) => updateMilestone(mIdx, 'title', e.target.value)}
                                    placeholder="Título del momento..."
                                    className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs bg-white font-bold"
                                  />
                                  <input
                                    type="text"
                                    value={m.date}
                                    onChange={(e) => updateMilestone(mIdx, 'date', e.target.value)}
                                    placeholder="Fecha (ej: 14 Feb 2023)"
                                    className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs bg-white font-mono"
                                  />
                                </div>
                                
                                <textarea
                                  rows={2}
                                  value={m.description}
                                  onChange={(e) => updateMilestone(mIdx, 'description', e.target.value)}
                                  placeholder="Descripción del recuerdo..."
                                  className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs bg-white"
                                />

                                {/* Milestone Photo Uploader */}
                                <div className="pt-1 flex items-center gap-3">
                                  {m.previewUrl ? (
                                    <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-indigo-200 shadow-2xs group">
                                      <Image src={m.previewUrl} alt={m.title || 'Foto hito'} fill sizes="64px" className="object-cover" />
                                      <button
                                        type="button"
                                        onClick={() => updateMilestone(mIdx, 'previewUrl', '')}
                                        className="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-[10px] cursor-pointer shadow-md z-10"
                                      >
                                        ×
                                      </button>
                                    </div>
                                  ) : (
                                    <label className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-dashed border-indigo-300 hover:border-indigo-500 rounded-xl text-[10px] font-bold text-indigo-700 hover:bg-indigo-50 cursor-pointer transition shadow-2xs">
                                      <Upload className="w-3.5 h-3.5 text-indigo-600" />
                                      <span>📷 Subir Foto de este Momento</span>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleMilestoneImage(mIdx, e)}
                                        className="hidden"
                                      />
                                    </label>
                                  )}
                                  {m.previewUrl && (
                                    <span className="text-[9px] text-emerald-600 font-bold">✓ Foto adjunta</span>
                                  )}
                                </div>

                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 9. VIDEO */}
                      {sec.type === 'video' && (
                        <div className="space-y-3 bg-white p-4 rounded-xl border border-gray-200">
                          <div>
                            <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">
                              🎬 Subir Archivo de Video Directo
                            </label>
                            <input
                              type="file"
                              accept="video/*"
                              onChange={handleVideoUpload}
                              className="w-full text-xs"
                            />
                          </div>
                          <div className="pt-2 border-t">
                            <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">
                              O Enlace de Video de YouTube
                            </label>
                            <input
                              type="url"
                              value={youtubeVideoUrl}
                              onChange={(e) => setYoutubeVideoUrl && setYoutubeVideoUrl(e.target.value)}
                              placeholder="https://www.youtube.com/watch?v=..."
                              className="w-full px-3 py-2 border border-gray-250 rounded-xl text-xs bg-white font-mono"
                            />
                          </div>
                        </div>
                      )}

                      {/* 10. RINCON SECRETO CON PIN & PISTA */}
                      {sec.type === 'secreto' && (
                        <div className="space-y-3 bg-amber-50/50 p-4 rounded-2xl border border-amber-200">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[9px] font-bold text-amber-900 uppercase mb-1">
                                🔑 PIN Secreto de Desbloqueo (4 Dígitos)
                              </label>
                              <input
                                type="password"
                                maxLength={6}
                                value={secretPasscode}
                                onChange={(e) => setSecretPasscode(e.target.value)}
                                placeholder="Ej: 1234"
                                className="w-full px-3 py-2 border border-amber-250 rounded-xl text-xs bg-white font-mono font-bold tracking-widest text-center"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold text-amber-900 uppercase mb-1">
                                💡 Pista para Adivinar el PIN (Visible para tu pareja)
                              </label>
                              <input
                                type="text"
                                value={secretHint}
                                onChange={(e) => setSecretHint && setSecretHint(e.target.value)}
                                placeholder="Ej: El día de nuestro primer beso..."
                                className="w-full px-3 py-2 border border-amber-250 rounded-xl text-xs bg-white"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-[9px] font-bold text-amber-900 uppercase mb-1">
                                🔒 Mensaje Secreto Oculto (Se revela con el PIN)
                              </label>
                              <input
                                type="text"
                                value={secretMessage}
                                onChange={(e) => setSecretMessage(e.target.value)}
                                placeholder="Solo visible al ingresar el PIN correcto..."
                                className="w-full px-3 py-2 border border-amber-250 rounded-xl text-xs bg-white"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 11. DEDICATORIA FINAL */}
                      {sec.type === 'corazones' && (
                        <div className="space-y-3">
                          <label className="block text-[9px] font-bold text-gray-500 uppercase">
                            💖 Mensaje de Dedicatoria Final
                          </label>
                          <textarea
                            rows={3}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Hoy celebramos cada segundo juntos y todo lo maravilloso que está por venir..."
                            className="w-full px-3 py-2 border border-gray-250 rounded-xl text-xs bg-white font-serif leading-relaxed"
                          />
                        </div>
                      )}

                    </div>
                  )}
                </div>
              );
            });
          })()}
        </div>

        {/* DYNAMIC DISAPPEARING AVAILABLE SECTIONS POOL */}
        <div className="pt-4 border-t border-gray-150 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-gray-800 font-serif flex items-center gap-1.5">
              <span>➕</span>
              <span>Bloques Disponibles para Agregar a tu Página</span>
            </h4>
            <span className="text-[9px] text-gray-400 font-light">
              {availableSections.length === 0 && !canAddSecondGallery && galleryCount > 0 ? '¡Todos los bloques están en uso!' : 'Toca para activar'}
            </span>
          </div>

          {availableSections.length > 0 || galleryCount === 0 || canAddSecondGallery ? (
            <div className="flex flex-wrap gap-2">
              {/* Primary Gallery (if deleted and 0 active) */}
              {galleryCount === 0 && (
                <button
                  type="button"
                  onClick={() => addSection('galeria')}
                  className="px-3 py-2 rounded-xl text-[10px] font-bold transition flex items-center gap-1.5 cursor-pointer bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs"
                >
                  <Plus className="w-3 h-3 text-emerald-600" />
                  <span>{isPremium ? '📸 Primera Galería de Fotos' : '📸 Galería de Fotos'}</span>
                </button>
              )}

              {/* Secondary Gallery (Only for Premium if 1 already active) */}
              {canAddSecondGallery && (
                <button
                  type="button"
                  onClick={() => addSection('galeria')}
                  className="px-3 py-2 rounded-xl text-[10px] font-bold transition flex items-center gap-1.5 cursor-pointer bg-white hover:bg-teal-50 text-teal-800 border border-teal-200 shadow-2xs"
                >
                  <Plus className="w-3 h-3 text-teal-600" />
                  <span>📸 Segunda Galería de Fotos</span>
                  <span className="text-[8px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-mono">👑 Máximo (+20 Fotos)</span>
                </button>
              )}

              {availableSections.map((item) => {
                const isLocked = (item.planRequired === 'medium' && isBasic) || 
                                 (item.planRequired === 'premium' && (isBasic || isMedium));
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => handleAddSectionWithCheck(item.type, item.planRequired)}
                    className={`px-3 py-2 rounded-xl text-[10px] font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      isLocked
                        ? 'bg-gray-100 text-gray-400 border border-gray-200 hover:bg-gray-150'
                        : 'bg-white hover:bg-rose-50 text-[#a21232] border border-rose-200 shadow-2xs'
                    }`}
                  >
                    {!isLocked ? <Plus className="w-3 h-3 text-[#a21232]" /> : <Lock className="w-3 h-3 text-gray-400" />}
                    <span>{item.label}</span>
                    {isLocked && (
                      <span className="text-[8px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-md font-mono">
                        {item.planRequired === 'medium' ? 'Medio+' : 'Máximo'}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-[10px] text-gray-400 italic">
              ✨ Ya tienes todos los bloques disponibles activos en tu diseño.
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
