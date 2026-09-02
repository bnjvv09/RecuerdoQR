'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Product, Theme, getProducts, getThemes } from '@/lib/db';
import { CHARACTERS_DATABASE, CharacterTheme } from '@/data/charactersData';
import { PhotoStyle } from '@/types/gallery';
import { PhotoInput, MilestoneInput, ExperienceSection, CustomColors } from './types';
import { validateChileanPhone, validateEmailSyntaxAndDomain } from '@/lib/validationHelpers';
import { toast } from 'sonner';

function getDefaultSectionsForPlan(plan: string): ExperienceSection[] {
  if (plan === 'basic') {
    return [
      { id: 'sec-portada', type: 'portada' },
      { id: 'sec-tematica', type: 'tematica' },
      { id: 'sec-contador', type: 'contador' },
      { id: 'sec-carta', type: 'carta' },
      { id: 'sec-galeria', type: 'galeria' },
      { id: 'sec-corazones', type: 'corazones' }
    ];
  }
  if (plan === 'medium' || plan === 'card') {
    return [
      { id: 'sec-portada', type: 'portada' },
      { id: 'sec-musica', type: 'musica' },
      { id: 'sec-tematica', type: 'tematica' },
      { id: 'sec-contador', type: 'contador' },
      { id: 'sec-carta', type: 'carta' },
      { id: 'sec-galeria', type: 'galeria' },
      { id: 'sec-corazones', type: 'corazones' }
    ];
  }
  return [
    { id: 'sec-portada', type: 'portada' },
    { id: 'sec-musica', type: 'musica' },
    { id: 'sec-tematica', type: 'tematica' },
    { id: 'sec-contador', type: 'contador' },
    { id: 'sec-carta', type: 'carta' },
    { id: 'sec-audio', type: 'audio' },
    { id: 'sec-galeria', type: 'galeria' },
    { id: 'sec-timeline', type: 'timeline' },
    { id: 'sec-video', type: 'video' },
    { id: 'sec-secreto', type: 'secreto' },
    { id: 'sec-corazones', type: 'corazones' }
  ];
}

export function usePersonalizarForm(initialPlan?: string, initialTheme?: string) {
  const router = useRouter();

  // Step state
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Products and themes
  const [products, setProducts] = useState<Product[]>([]);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [selectedPlan, setSelectedPlanState] = useState<string>(initialPlan || 'basic');
  const [selectedTheme, setSelectedTheme] = useState<string>(initialTheme || 'anniversary');
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterTheme | null>(CHARACTERS_DATABASE[0] || null);
  const [cardPalette, setCardPalette] = useState<string>('#a21232');

  // Customer Contact Fields for Checkout
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  // Personalization fields
  const [partnerName, setPartnerName] = useState('');
  const [userName, setUserName] = useState('');
  const [specialDate, setSpecialDate] = useState('2024-02-14');
  const [specialPlaceAddress, setSpecialPlaceAddress] = useState('Plaza Mayor, Madrid');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [historyText, setHistoryText] = useState('');
  const [songUrl, setSongUrl] = useState('https://www.youtube.com/watch?v=kJQP7kiw5Fk');
  const [secretPasscode, setSecretPasscode] = useState('');
  const [secretHint, setSecretHint] = useState('');
  const [secretMessage, setSecretMessage] = useState('');

  // Audio & Video Files
  const [voiceNoteFile, setVoiceNoteFile] = useState<File | null>(null);
  const [voiceNoteBlob, setVoiceNoteBlob] = useState<Blob | null>(null);
  const [voiceNoteUrl, setVoiceNoteUrl] = useState<string>('');

  const [uploadedVideoFile, setUploadedVideoFile] = useState<File | null>(null);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string>('');
  const [youtubeVideoUrl, setYoutubeVideoUrl] = useState<string>('');

  const handleVoiceNoteUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVoiceNoteFile(file);
      setVoiceNoteUrl(URL.createObjectURL(file));
      toast.success('Nota de voz cargada correctamente');
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedVideoFile(file);
      setUploadedVideoUrl(URL.createObjectURL(file));
      toast.success('Video cargado correctamente');
    }
  };

  // Gift Card System
  const [cardOrientation, setCardOrientation] = useState<'horizontal' | 'vertical'>('horizontal');
  const [cardFont, setCardFont] = useState('great-vibes');
  const [cardTitle, setCardTitle] = useState('Un Regalo Especial Para Ti');
  const [cardFrom, setCardFrom] = useState('');
  const [cardMessage, setCardMessage] = useState('Escanea este código QR con tu celular para descubrir una sorpresa inolvidable...');
  const [giftCardRecipient, setGiftCardRecipient] = useState('');
  const [giftCardSender, setGiftCardSender] = useState('');
  const [giftCardMessage, setGiftCardMessage] = useState('');
  const [giftCardPasscode, setGiftCardPasscode] = useState('');
  const [giftCardShowPin, setGiftCardShowPin] = useState(true);
  const [giftCardOrientation, setGiftCardOrientation] = useState<'horizontal' | 'vertical'>('horizontal');

  // 12 HYPER-PERSONALIZED THEMES DATA
  // 1. Birthday
  const [birthdayWishMessage, setBirthdayWishMessage] = useState('¡Que todos tus deseos se hagan realidad en este nuevo año de vida! ✨');
  const [birthdayBalloons, setBirthdayBalloons] = useState<[string, string, string]>([
    '¡Mucho Éxito y Alegría!',
    '¡Salud y Risas Siempre!',
    '¡Te Queremos Infinito!'
  ]);
  const updateBirthdayBalloon = (index: number, val: string) => {
    const updated: [string, string, string] = [...birthdayBalloons];
    updated[index] = val;
    setBirthdayBalloons(updated);
  };

  // 2. Anniversary
  const [statsKisses, setStatsKisses] = useState('2.500+');
  const [statsCoffees, setStatsCoffees] = useState('800+');
  const [statsSmiles, setStatsSmiles] = useState('1.000.000+');

  // 3 & 4. Proposals
  const [proposalQuestion, setProposalQuestion] = useState('¿Quieres ser mi compañera/o de vida por siempre? ❤️');
  const [proposalYesText, setProposalYesText] = useState('¡Sí, Acepto! ❤️');
  const [proposalCelebrationText, setProposalCelebrationText] = useState('¡Dijiste que Sí! Nuestra historia oficial comienza hoy ✨');
  const [ringBoxMessage, setRingBoxMessage] = useState('Prometo amarte, cuidarte y hacerte sonreír cada día de mi vida 💍');

  // 5. Pregnancy
  const [scratchPrompt, setScratchPrompt] = useState('Toca aquí para raspar y descubrir la noticia');
  const [scratchSecretMessage, setScratchSecretMessage] = useState('¡Sorpresa! ¡Viene un Bebé en Camino! 🍼');
  const [scratchUltrasoundUrl, setScratchUltrasoundUrl] = useState('');
  const [pollQuestion, setPollQuestion] = useState('¿Qué crees que será? 🍼');
  const [pollOptionA, setPollOptionA] = useState('Team Niño 💙');
  const [pollOptionB, setPollOptionB] = useState('Team Niña 💖');

  // 6. Surprise Gift
  const [surpriseMessage, setSurpriseMessage] = useState('🎉 ¡Una cena romántica bajo las estrellas este fin de semana!');
  const [ticketTitle, setTicketTitle] = useState('Pase VIP / Cupón de Regalo');
  const [ticketConditions, setTicketConditions] = useState('Válido para canjear cuando tú quieras ❤️');

  // 7 & 8. Love Letter & Confession
  const [waxSealSender, setWaxSealSender] = useState('Con Todo Mi Amor');
  const [crystalHeartTitle, setCrystalHeartTitle] = useState('Toca y Mantén Presionado el Corazón de Cristal');
  const [crystalHeartSecret, setCrystalHeartSecret] = useState('Me enamoré de ti desde el primer segundo en que te vi...');

  // 9. Valentines
  const [valentineBoxTitle, setValentineBoxTitle] = useState('Caja de Bombones de San Valentín 🍫');
  const [valentineCoupon, setValentineCoupon] = useState('Vale por nuestra cita soñada de San Valentín ❤️');

  // 10. Special Congratulations
  const [trophyTitle, setTrophyTitle] = useState('Trofeo al Mayor Logro y Esfuerzo 🏆');
  const [trophyCategory, setTrophyCategory] = useState('¡Orgullo Total por tu Gran Meta Cumplida!');
  const [diplomaText, setDiplomaText] = useState('Reconocimiento oficial a la persona más talentosa y perseverante.');

  // 11. Gratitude
  const [gratitudeStar1, setGratitudeStar1] = useState('Gracias por tu apoyo incondicional en cada momento ✨');
  const [gratitudeStar2, setGratitudeStar2] = useState('Gracias por tus consejos y por creer siempre en mí 🌟');
  const [gratitudeStar3, setGratitudeStar3] = useState('Gracias por iluminar mi vida con tu presencia 💛');

  // 12. Reconciliation
  const [reconciliationQuestion, setReconciliationQuestion] = useState('Nuestro amor es más fuerte que cualquier error. ¿Hacemos las paces? 🤝❤️');
  const [reconciliationPromise, setReconciliationPromise] = useState('Prometo aprender, escucharte y valorar cada instante a tu lado.');

  // Visual Styling (100% Free Custom Colors + Independent Surprise & Dedication)
  const [customFont, setCustomFont] = useState('great-vibes');
  const [colorPreset, setColorPreset] = useState('rose');
  const [customColors, setCustomColors] = useState<CustomColors>({
    primary: '#a21232',
    bg: '#fffcfd',
    text: '#111827',
    dedicationStyle: 'night',
    surprisePalette: 'inherit',
    surprisePrimary: '',
    surpriseBg: ''
  });
  const [photoStyle, setPhotoStyle] = useState<PhotoStyle>('polaroid');
  const [secondaryPhotoStyle, setSecondaryPhotoStyle] = useState<PhotoStyle | null>(null);
  const [enableDualPhotoStyle, setEnableDualPhotoStyle] = useState(false);

  // Modular Sections Builder (with movable tematica section)
  const [sections, setSections] = useState<ExperienceSection[]>(getDefaultSectionsForPlan(initialPlan || 'basic'));
  const [expandedSection, setExpandedSection] = useState<string | null>('sec-tematica');

  // Media (Primary and Secondary Gallery)
  const [photos, setPhotos] = useState<PhotoInput[]>([
    { previewUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&auto=format&fit=crop', caption: 'Nuestra primera cita' },
    { previewUrl: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&auto=format&fit=crop', caption: 'Bajo las estrellas' },
    { previewUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop', caption: 'Tu hermosa sonrisa' }
  ]);

  const [secondaryPhotos, setSecondaryPhotos] = useState<PhotoInput[]>([
    { previewUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop', caption: 'Momentos inolvidables' },
    { previewUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop', caption: 'Riendo juntos' }
  ]);

  const [milestones, setMilestones] = useState<MilestoneInput[]>([
    { title: 'El día que nos conocimos', date: '2022-05-18', description: 'Nuestras miradas se cruzaron y todo cambió.', previewUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&auto=format&fit=crop' },
    { title: 'Nuestro primer viaje', date: '2023-01-10', description: 'Una escapada inolvidable al mar.', previewUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop' }
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load products & themes
  useEffect(() => {
    async function loadData() {
      try {
        const [prodList, themeList] = await Promise.all([getProducts(), getThemes()]);
        setProducts(prodList);
        setThemes(themeList);
      } catch (err) {
        console.error('Error loading initial data in form:', err);
      }
    }
    loadData();
  }, []);

  // Gallery limits calculation
  const galleryCount = sections.filter(s => s.type === 'galeria').length;
  const isDualGallery = galleryCount > 1;
  const maxPrimaryPhotos = selectedPlan === 'premium' ? (isDualGallery ? 20 : 40) : (selectedPlan === 'medium' || selectedPlan === 'card') ? 20 : 10;
  const maxSecondaryPhotos = 20;

  // Section Handlers (Unique Blocks & Strict Plan Enforcement)
  const addSection = (type: ExperienceSection['type']) => {
    // 1. Check if already added (only galeria can have 2 in premium)
    const activeCount = sections.filter(s => s.type === type).length;
    if (type !== 'galeria' && activeCount >= 1) {
      toast.warning('Este bloque ya está agregado en tu página.');
      return;
    }
    if (type === 'galeria' && (activeCount >= 2 || (activeCount >= 1 && selectedPlan !== 'premium'))) {
      toast.warning('Has alcanzado el límite de galerías para tu plan.');
      return;
    }

    // 2. Plan authorization check (Carta is allowed in ALL plans!)
    if (selectedPlan === 'basic') {
      const allowedInBasic = ['portada', 'tematica', 'contador', 'galeria', 'carta', 'corazones'];
      if (!allowedInBasic.includes(type)) {
        toast.error('🔒 Esta sección requiere Plan Medio o Plan Máximo.');
        return;
      }
    } else if (selectedPlan === 'medium' || selectedPlan === 'card') {
      const forbiddenInMedium = ['timeline', 'video', 'audio', 'secreto', 'sorpresa', 'lugar'];
      if (forbiddenInMedium.includes(type)) {
        toast.error('🔒 Esta sección es exclusiva del Plan Máximo.');
        return;
      }
    }

    const newId = `sec-${type}-${Date.now()}`;
    setSections([...sections, { id: newId, type }]);
    setExpandedSection(newId);
    toast.success('Sección agregada al diseño');
  };

  const removeSection = (id: string) => {
    const target = sections.find(s => s.id === id);
    if (target?.type === 'portada') {
      toast.warning('La portada principal es la cabecera de la página y no se puede eliminar.');
      return;
    }
    if (target?.type === 'musica') {
      toast.warning('La música de fondo es un bloque fijo del encabezado y no se puede eliminar.');
      return;
    }
    setSections(sections.filter((s) => s.id !== id));
    toast.info('Sección eliminada (quedó disponible abajo para volver a agregarla)');
  };

  const moveSection = (idx: number, dir: 'up' | 'down') => {
    const hasFixedMusic = (selectedPlan === 'medium' || selectedPlan === 'card' || selectedPlan === 'premium');
    const minMovableIndex = hasFixedMusic ? 2 : 1;

    if (idx < minMovableIndex) {
      toast.info('Este bloque es fijo en la parte superior y no se puede mover.');
      return;
    }

    const targetIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < minMovableIndex || targetIdx >= sections.length) return;

    const nextSections = [...sections];
    const [moved] = nextSections.splice(idx, 1);
    nextSections.splice(targetIdx, 0, moved);
    setSections(nextSections);
  };

  // Primary Photo Handlers
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentCount = photos.length;
    const availableSlots = maxPrimaryPhotos - currentCount;

    if (availableSlots <= 0) {
      toast.error(`Has alcanzado el límite de ${maxPrimaryPhotos} fotos para esta galería.`);
      return;
    }

    const files = e.target.files;
    if (!files) return;

    const fileList = Array.from(files);
    if (fileList.length > availableSlots) {
      toast.warning(`Solo se agregaron ${availableSlots} fotos para no superar el límite de ${maxPrimaryPhotos}.`);
    }

    const toProcess = fileList.slice(0, availableSlots);
    const newItems: PhotoInput[] = toProcess.map((f) => ({
      file: f,
      previewUrl: URL.createObjectURL(f),
      caption: '',
    }));

    setPhotos([...photos, ...newItems]);
    toast.success(`Se agregaron ${newItems.length} foto(s).`);
  };

  const removePhoto = (idx: number) => {
    setPhotos(photos.filter((_, i) => i !== idx));
  };

  const updatePhotoCaption = (idx: number, caption: string) => {
    const next = [...photos];
    next[idx].caption = caption;
    setPhotos(next);
  };

  // Secondary Photo Handlers (for Premium 2nd Gallery)
  const handleSecondaryPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentCount = secondaryPhotos.length;
    const availableSlots = maxSecondaryPhotos - currentCount;

    if (availableSlots <= 0) {
      toast.error(`Has alcanzado el límite de ${maxSecondaryPhotos} fotos para la Segunda Galería.`);
      return;
    }

    const files = e.target.files;
    if (!files) return;

    const fileList = Array.from(files);
    if (fileList.length > availableSlots) {
      toast.warning(`Solo se agregaron ${availableSlots} fotos para no superar el límite de ${maxSecondaryPhotos}.`);
    }

    const toProcess = fileList.slice(0, availableSlots);
    const newItems: PhotoInput[] = toProcess.map((f) => ({
      file: f,
      previewUrl: URL.createObjectURL(f),
      caption: '',
    }));

    setSecondaryPhotos([...secondaryPhotos, ...newItems]);
    toast.success(`Se agregaron ${newItems.length} foto(s) a la Segunda Galería.`);
  };

  const removeSecondaryPhoto = (idx: number) => {
    setSecondaryPhotos(secondaryPhotos.filter((_, i) => i !== idx));
  };

  const updateSecondaryPhotoCaption = (idx: number, caption: string) => {
    const next = [...secondaryPhotos];
    next[idx].caption = caption;
    setSecondaryPhotos(next);
  };

  // Milestone Handlers (Timeline)
  const addMilestone = () => {
    setMilestones([
      ...milestones,
      {
        title: '',
        date: '',
        description: '',
        previewUrl: '',
      },
    ]);
  };

  const removeMilestone = (idx: number) => {
    setMilestones(milestones.filter((_, i) => i !== idx));
  };

  const updateMilestone = (idx: number, field: keyof MilestoneInput, value: any) => {
    const next = [...milestones];
    next[idx] = { ...next[idx], [field]: value };
    setMilestones(next);
  };

  const handleMilestoneImage = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const next = [...milestones];
      next[idx].image = file;
      next[idx].previewUrl = URL.createObjectURL(file);
      setMilestones(next);
      toast.success('Foto del momento cargada con éxito');
    }
  };

  const setSelectedPlan = (planSlug: string) => {
    setSelectedPlanState(planSlug);
    setSections(getDefaultSectionsForPlan(planSlug));
  };

  const currentProduct = products.find((p) => p.id === selectedPlan);
  const totalPrice = currentProduct?.price || (selectedPlan === 'premium' ? 39900 : selectedPlan === 'medium' ? 29900 : 19900);

  const validateStep2 = (): boolean => {
    if (!partnerName.trim()) {
      toast.error('Por favor escribe el nombre de la persona especial');
      return false;
    }
    if (!userName.trim()) {
      toast.error('Por favor escribe tu nombre');
      return false;
    }
    if (!specialDate) {
      toast.error('Por favor selecciona la fecha especial');
      return false;
    }
    return true;
  };

  const validateStep4 = (): boolean => {
    if (!customerName.trim() || customerName.trim().length < 3) {
      toast.error('Por favor ingresa tu nombre y apellido');
      return false;
    }
    const emailCheck = validateEmailSyntaxAndDomain(customerEmail);
    if (!emailCheck.valid) {
      toast.error(emailCheck.error || 'Por favor ingresa un correo electrónico real');
      return false;
    }
    const cleanDigits = customerPhone.replace(/\D/g, '');
    const phoneCheck = validateChileanPhone(cleanDigits);
    if (!phoneCheck.valid) {
      toast.error(phoneCheck.error || 'Por favor ingresa un número móvil chileno válido de 9 dígitos (+56 9 XXXX XXXX)');
      return false;
    }
    return true;
  };

  return {
    step,
    setStep,
    loading,
    setLoading,
    products,
    themes,
    selectedPlan,
    setSelectedPlan,
    selectedTheme,
    setSelectedTheme,
    selectedCharacter,
    setSelectedCharacter,
    cardPalette,
    setCardPalette,
    customerName,
    setCustomerName,
    customerEmail,
    setCustomerEmail,
    customerPhone,
    setCustomerPhone,
    deliveryAddress,
    setDeliveryAddress,
    cardOrientation,
    setCardOrientation,
    cardFont,
    setCardFont,
    cardTitle,
    setCardTitle,
    cardFrom,
    setCardFrom,
    cardMessage,
    setCardMessage,
    giftCardRecipient,
    setGiftCardRecipient,
    giftCardSender,
    setGiftCardSender,
    giftCardMessage,
    setGiftCardMessage,
    giftCardPasscode,
    setGiftCardPasscode,
    giftCardShowPin,
    setGiftCardShowPin,
    giftCardOrientation,
    setGiftCardOrientation,
    partnerName,
    setPartnerName,
    userName,
    setUserName,
    specialDate,
    setSpecialDate,
    specialPlaceAddress,
    setSpecialPlaceAddress,
    title,
    setTitle,
    message,
    setMessage,
    historyText,
    setHistoryText,
    songUrl,
    setSongUrl,
    voiceNoteFile,
    setVoiceNoteFile,
    voiceNoteBlob,
    setVoiceNoteBlob,
    voiceNoteUrl,
    setVoiceNoteUrl,
    handleVoiceNoteUpload,
    uploadedVideoFile,
    setUploadedVideoFile,
    uploadedVideoUrl,
    setUploadedVideoUrl,
    youtubeVideoUrl,
    setYoutubeVideoUrl,
    handleVideoUpload,
    secretPasscode,
    setSecretPasscode,
    secretHint,
    setSecretHint,
    secretMessage,
    setSecretMessage,
    birthdayWishMessage,
    setBirthdayWishMessage,
    birthdayBalloons,
    updateBirthdayBalloon,
    statsKisses,
    setStatsKisses,
    statsCoffees,
    setStatsCoffees,
    statsSmiles,
    setStatsSmiles,
    proposalQuestion,
    setProposalQuestion,
    proposalYesText,
    setProposalYesText,
    proposalCelebrationText,
    setProposalCelebrationText,
    ringBoxMessage,
    setRingBoxMessage,
    scratchPrompt,
    setScratchPrompt,
    scratchSecretMessage,
    setScratchSecretMessage,
    scratchUltrasoundUrl,
    setScratchUltrasoundUrl,
    pollQuestion,
    setPollQuestion,
    pollOptionA,
    setPollOptionA,
    pollOptionB,
    setPollOptionB,
    surpriseMessage,
    setSurpriseMessage,
    ticketTitle,
    setTicketTitle,
    ticketConditions,
    setTicketConditions,
    waxSealSender,
    setWaxSealSender,
    crystalHeartTitle,
    setCrystalHeartTitle,
    crystalHeartSecret,
    setCrystalHeartSecret,
    valentineBoxTitle,
    setValentineBoxTitle,
    valentineCoupon,
    setValentineCoupon,
    trophyTitle,
    setTrophyTitle,
    trophyCategory,
    setTrophyCategory,
    diplomaText,
    setDiplomaText,
    gratitudeStar1,
    setGratitudeStar1,
    gratitudeStar2,
    setGratitudeStar2,
    gratitudeStar3,
    setGratitudeStar3,
    reconciliationQuestion,
    setReconciliationQuestion,
    reconciliationPromise,
    setReconciliationPromise,
    customFont,
    setCustomFont,
    colorPreset,
    setColorPreset,
    customColors,
    setCustomColors,
    photoStyle,
    setPhotoStyle,
    secondaryPhotoStyle,
    setSecondaryPhotoStyle,
    enableDualPhotoStyle,
    setEnableDualPhotoStyle,
    sections,
    setSections,
    expandedSection,
    setExpandedSection,
    photos,
    setPhotos,
    secondaryPhotos,
    setSecondaryPhotos,
    handleSecondaryPhotoUpload,
    removeSecondaryPhoto,
    updateSecondaryPhotoCaption,
    maxPrimaryPhotos,
    maxSecondaryPhotos,
    milestones,
    fileInputRef,
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
    currentProduct,
    totalPrice,
    validateStep2,
    validateStep4,
  };
}
