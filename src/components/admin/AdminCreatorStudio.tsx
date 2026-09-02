'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { 
  Sparkles, 
  Smartphone, 
  Trash2, 
  Plus, 
  ArrowUp, 
  ArrowDown, 
  ChevronDown, 
  ChevronUp, 
  Music, 
  Calendar, 
  Image as ImageIcon, 
  Lock,
  MapPin,
  Gift,
  Heart,
  MessageCircle,
  Copy,
  Download,
  Eye,
  RefreshCw,
  Mic,
  Video,
  Upload,
  Square,
  Award,
  Star,
  Check,
  Search,
  Layers,
  Palette,
  Type
} from 'lucide-react';
import PhotoStyleSelector from '@/components/gallery/PhotoStyleSelector';
import PhotoGallery from '@/components/gallery/PhotoGallery';
import { PhotoStyle } from '@/types/gallery';
import { FONT_OPTIONS, getFontFamily } from '@/lib/fonts';
import { uploadImage } from '@/lib/upload';
import { compressImageFile } from '@/lib/imageCompressor';
import { CHARACTERS_DATABASE, CharacterTheme } from '@/data/charactersData';
import { ROMANTIC_SONGS } from '@/components/personalizar/Step2Personalizacion';
import QRCode from 'qrcode';
import { toast } from 'sonner';

interface AdminCreatorStudioProps {
  onOpenPrintableModal: (data: { partnerName: string; userName: string; message?: string; qrDataUrl: string; date?: string; slug?: string; theme?: string }) => void;
}

export const THEMES_LIST = [
  { id: 'anniversary', name: 'Aniversario & Amor', emoji: '💑', desc: 'Contador de tiempo, estadísticas y carta' },
  { id: 'birthday', name: 'Cumpleaños Feliz', emoji: '🎂', desc: 'Torta 3D, soplar velas y globos sorpresa' },
  { id: 'proposal', name: 'Propuesta de Amor', emoji: '💍', desc: 'Pregunta interactiva y caja de anillo' },
  { id: 'valentine', name: 'San Valentín', emoji: '🍫', desc: 'Caja de bombones y cupones de amor' },
  { id: 'baby', name: 'Bebé & Revelación', emoji: '👶', desc: 'Ecografía oculta y rasca de revelación' },
  { id: 'graduation', name: 'Graduación & Logro', emoji: '🎓', desc: 'Diploma interactivo con birrete' },
  { id: 'friendship', name: 'Mejor Amiga / BFF', emoji: '🏆', desc: 'Trofeo a la mejor amiga y dedicatoria' },
  { id: 'gratitude', name: 'Gratitud & Gracias', emoji: '⭐', desc: '3 Estrellas de agradecimiento' },
  { id: 'reconciliation', name: 'Reconciliación', emoji: '🕊️', desc: 'Unir corazones y promesa de amor' },
  { id: 'scratch', name: 'Rasca y Gana', emoji: '✨', desc: 'Rasca interactivo con mensaje secreto' },
  { id: 'waxseal', name: 'Carta con Lacre', emoji: '💌', desc: 'Sobre vintage con sello de cera' },
  { id: 'crystalheart', name: 'Corazón de Cristal', emoji: '💎', desc: 'Gema 3D con dedicatoria en el núcleo' },
];

export default function AdminCreatorStudio({ onOpenPrintableModal }: AdminCreatorStudioProps) {
  // Navigation subtabs in Admin Creator
  const [activeStudioTab, setActiveStudioTab] = useState<'client' | 'theme' | 'content' | 'media' | 'widgets' | 'card'>('client');

  // 1. Client & Partner Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<'basico' | 'medio' | 'premium'>('premium');
  const [partnerName, setPartnerName] = useState('Sofía');
  const [userName, setUserName] = useState('Matías');
  const [specialDate, setSpecialDate] = useState('2024-02-14');
  const [customSlug, setCustomSlug] = useState('');

  // 2. Theme & Styling
  const [selectedTheme, setSelectedTheme] = useState('anniversary');
  const [customFont, setCustomFont] = useState('great-vibes');
  const [customColors, setCustomColors] = useState({
    primary: '#a21232',
    bg: '#fffcfd',
    text: '#111827'
  });

  // 3. Content
  const [title, setTitle] = useState('Para el Amor de Mi Vida ❤️');
  const [message, setMessage] = useState('Hoy celebramos cada segundo juntos y todo lo maravilloso que está por venir.');
  const [historyText, setHistoryText] = useState('Desde el primer instante en que te vi, supe que mi destino era caminar a tu lado...');
  const [songUrl, setSongUrl] = useState('https://www.youtube.com/watch?v=2Vv-BfVoq4g');
  const [youtubeVideoUrl, setYoutubeVideoUrl] = useState('');

  // 4. Voice Note Audio
  const [voiceNoteFile, setVoiceNoteFile] = useState<File | null>(null);
  const [voiceNoteUrl, setVoiceNoteUrl] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);

  // 5. Photos & Styles
  const [photoStyle, setPhotoStyle] = useState<PhotoStyle>('polaroid');
  const [photos, setPhotos] = useState<Array<{ file?: File; previewUrl: string; caption: string }>>([
    { previewUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&auto=format&fit=crop', caption: 'Nuestra primera cita' },
    { previewUrl: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&auto=format&fit=crop', caption: 'Bajo las estrellas' },
    { previewUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop', caption: 'Tu hermosa sonrisa' }
  ]);

  const [secondaryPhotos, setSecondaryPhotos] = useState<Array<{ file?: File; previewUrl: string; caption: string }>>([]);
  const [secondaryPhotoStyle, setSecondaryPhotoStyle] = useState<PhotoStyle>('collage');

  // 6. Milestones
  const [milestones, setMilestones] = useState<Array<{ title: string; date: string; description: string; previewUrl?: string; file?: File }>>([
    { title: 'El día que nos conocimos', date: '2022-05-18', description: 'Nuestras miradas se cruzaron y todo cambió.', previewUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&auto=format&fit=crop' },
    { title: 'Nuestro primer viaje', date: '2023-01-10', description: 'Una escapada inolvidable al mar.', previewUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop' }
  ]);

  // 7. Interactive Theme Widgets State
  // Cumpleaños
  const [birthdayWishMessage, setBirthdayWishMessage] = useState('¡Que todos tus sueños se hagan realidad en este nuevo año! ✨🎂');
  const [birthdayBalloons, setBirthdayBalloons] = useState<[string, string, string]>([
    '🎈 Vale por una cena juntos',
    '🎈 Vale por un masaje relajante',
    '🎈 Te amo hasta el infinito'
  ]);
  // Aniversario stats
  const [statsKisses, setStatsKisses] = useState('2.500+');
  const [statsKissesLabel, setStatsKissesLabel] = useState('💋 Cantidad de Besos');
  const [statsCoffees, setStatsCoffees] = useState('180+');
  const [statsCoffeesLabel, setStatsCoffeesLabel] = useState('☕ Citas y Salidas');
  const [statsSmiles, setStatsSmiles] = useState('10.000+');
  const [statsSmilesLabel, setStatsSmilesLabel] = useState('✨ Sonrisas Compartidas');
  // Propuesta
  const [proposalQuestion, setProposalQuestion] = useState('¿Quieres ser mi compañera/o de vida por siempre? ❤️');
  const [proposalYesText, setProposalYesText] = useState('¡SÍ, ACEPTO! 💍');
  const [proposalCelebrationText, setProposalCelebrationText] = useState('¡Dijo que SÍ! Comenzamos el viaje más hermoso de nuestras vidas 🥂✨');
  const [ringBoxMessage, setRingBoxMessage] = useState('Un símbolo eterno de mi amor por ti 💍');
  // PIN secreto
  const [secretPasscode, setSecretPasscode] = useState('1234');
  const [secretHint, setSecretHint] = useState('La fecha de nuestro primer beso...');
  const [secretMessage, setSecretMessage] = useState('Este es nuestro rincón secreto. Te amo infinitamente.');
  // San Valentín
  const [valentineMessage, setValentineMessage] = useState('Elige un bombón para descubrir tu sorpresa de amor 🍫');
  // Bebé / Ecografía
  const [babyGenderSecret, setBabyGenderSecret] = useState('¡Es una hermosa Niña! 🎀');
  // Rasca y Gana
  const [scratchPrompt, setScratchPrompt] = useState('Rasca aquí con tu dedo para descubrir el secreto ✨');
  const [scratchSecretMessage, setScratchSecretMessage] = useState('🎉 ¡Nos vamos de viaje a la playa este fin de semana!');
  // Reconciliación
  const [reconciliationQuestion, setReconciliationQuestion] = useState('Nuestro amor es más fuerte que cualquier error. ¿Hacemos las paces? 🤝❤️');
  const [reconciliationPromise, setReconciliationPromise] = useState('Prometo aprender, escucharte y valorar cada instante a tu lado...');

  // 8. Gift Card & Characters
  const [selectedCharacterId, setSelectedCharacterId] = useState<number>(1);
  const [characterSearch, setCharacterSearch] = useState('');
  const [cardOrientation, setCardOrientation] = useState<'vertical' | 'horizontal'>('vertical');
  const [cardTitle, setCardTitle] = useState('Para el Amor de Mi Vida');
  const [cardFrom, setCardFrom] = useState('Con todo mi amor');
  const [cardMessage, setCardMessage] = useState('Escanea este código con tu celular para abrir una sorpresa inolvidable que preparé para ti.');

  // Sections Pool
  const [sections, setSections] = useState<Array<{ id: string; type: any }>>([
    { id: 'sec-portada', type: 'portada' },
    { id: 'sec-tematica', type: 'tematica' },
    { id: 'sec-carta', type: 'carta' },
    { id: 'sec-contador', type: 'contador' },
    { id: 'sec-musica', type: 'musica' },
    { id: 'sec-galeria', type: 'galeria' },
    { id: 'sec-timeline', type: 'timeline' },
    { id: 'sec-corazones', type: 'corazones' }
  ]);
  const [expandedSection, setExpandedSection] = useState<string | null>('sec-portada');

  // Submission result
  const [submitting, setSubmitting] = useState(false);
  const [createdResult, setCreatedResult] = useState<{
    slug: string;
    url: string;
    qrDataUrl: string;
    customerPhone: string;
    customerName: string;
    partnerName: string;
  } | null>(null);

  // Audio Recording Handlers
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
        const file = new File([audioBlob], 'nota-de-voz.webm', { type: 'audio/webm' });
        setVoiceNoteFile(file);
        setVoiceNoteUrl(URL.createObjectURL(audioBlob));
        toast.success('¡Nota de voz grabada con éxito! 🎙️');
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch {
      toast.error('No se pudo acceder al micrófono');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const handleVoiceNoteUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setVoiceNoteFile(f);
      setVoiceNoteUrl(URL.createObjectURL(f));
      toast.success('Audio cargado correctamente');
    }
  };

  // Photo handlers
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const toastId = toast.loading('Optimizando fotos...');
    try {
      const compressedList = await Promise.all(
        files.map(async (f) => {
          const res = await compressImageFile(f);
          return { file: res.file, previewUrl: res.previewUrl, caption: '' };
        })
      );
      setPhotos([...photos, ...compressedList]);
      toast.dismiss(toastId);
      toast.success(`${compressedList.length} foto(s) agregadas`);
    } catch {
      toast.dismiss(toastId);
      const fallbackList = files.map(f => ({ file: f, previewUrl: URL.createObjectURL(f), caption: '' }));
      setPhotos([...photos, ...fallbackList]);
    }
  };

  const handleMilestoneImageUpload = async (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    const res = await compressImageFile(file);
    const updated = [...milestones];
    updated[idx] = { ...updated[idx], file: res.file, previewUrl: res.previewUrl };
    setMilestones(updated);
    toast.success('Foto adjuntada al hito');
  };

  // Section handlers
  const addSection = (type: string) => {
    const newId = `sec-${type}-${Date.now()}`;
    setSections([...sections, { id: newId, type }]);
    setExpandedSection(newId);
  };

  const removeSection = (id: string) => {
    if (sections.length <= 1) return;
    setSections(sections.filter(s => s.id !== id));
  };

  const moveSection = (idx: number, dir: 'up' | 'down') => {
    const newSec = [...sections];
    const target = dir === 'up' ? idx - 1 : idx + 1;
    if (target < 0 || target >= newSec.length) return;
    const temp = newSec[idx];
    newSec[idx] = newSec[target];
    newSec[target] = temp;
    setSections(newSec);
  };

  // Filter characters catalog
  const filteredCharacters = CHARACTERS_DATABASE.filter(c => 
    c.name.toLowerCase().includes(characterSearch.toLowerCase()) ||
    c.franchise.toLowerCase().includes(characterSearch.toLowerCase()) ||
    c.theme.toLowerCase().includes(characterSearch.toLowerCase())
  ).slice(0, 36);

  const selectedCharObj = CHARACTERS_DATABASE.find(c => c.id === selectedCharacterId) || CHARACTERS_DATABASE[0];

  // Publish Manual Experience
  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerName.trim() || !userName.trim()) {
      toast.error('Por favor ingresa los nombres de la pareja');
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading('Publicando experiencia directa con permisos de Administrador...');

    try {
      let finalSlug = customSlug.trim().toLowerCase()
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      if (!finalSlug) {
        finalSlug = `${partnerName.toLowerCase().replace(/[^a-z0-9]/g, '')}-${userName.toLowerCase().replace(/[^a-z0-9]/g, '')}-${Math.floor(100 + Math.random() * 900)}`;
      }

      // Upload photos
      const uploadedPhotosList: Array<{ url: string; caption?: string }> = [];
      for (const p of photos) {
        if (p.file) {
          const publicUrl = await uploadImage(p.file, finalSlug);
          uploadedPhotosList.push({ url: publicUrl, caption: p.caption });
        } else {
          uploadedPhotosList.push({ url: p.previewUrl, caption: p.caption });
        }
      }

      // Upload milestones
      const formattedMilestones: Array<{ title: string; date: string; description: string; image_url: string }> = [];
      for (const m of milestones) {
        let imgUrl = m.previewUrl || '';
        if (m.file) {
          imgUrl = await uploadImage(m.file, finalSlug);
        }
        formattedMilestones.push({
          title: m.title,
          date: m.date,
          description: m.description,
          image_url: imgUrl,
        });
      }

      // Upload voice note if any
      let finalVoiceNoteUrl = voiceNoteUrl;
      if (voiceNoteFile) {
        finalVoiceNoteUrl = await uploadImage(voiceNoteFile, finalSlug);
      }

      const extraConfig = {
        birthdayWishMessage,
        birthdayBalloons,
        statsKisses,
        statsKissesLabel,
        statsCoffees,
        statsCoffeesLabel,
        statsSmiles,
        statsSmilesLabel,
        proposalQuestion,
        proposalYesText,
        proposalCelebrationText,
        ringBoxMessage,
        secretPasscode,
        secretHint,
        secretMessage,
        valentineMessage,
        babyGenderSecret,
        scratchPrompt,
        scratchSecretMessage,
        reconciliationQuestion,
        reconciliationPromise,
        voiceNoteUrl: finalVoiceNoteUrl,
        youtubeVideoUrl,
        secondaryPhotoStyle,
        cardOrientation,
        cardTitle,
        cardFrom,
        cardMessage,
        selectedCharacterId
      };

      const res = await fetch('/api/admin/create-manual-experience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerName.trim() || userName,
          customerPhone: customerPhone.trim(),
          customerEmail: customerEmail.trim(),
          productId: selectedPlan === 'premium' ? 'premium' : selectedPlan === 'basico' ? 'basico' : 'medio',
          title: title.trim(),
          partnerName: partnerName.trim(),
          userName: userName.trim(),
          specialDate,
          message: message.trim(),
          historyText: historyText.trim(),
          songUrl: songUrl.trim(),
          themeId: selectedTheme,
          customFont,
          customColors,
          photoStyle,
          slug: finalSlug,
          sections,
          photos: uploadedPhotosList,
          milestones: formattedMilestones,
          extraConfig,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Error al crear la experiencia');
      }

      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://recuerdoqr.cl';
      const liveUrl = `${origin}/amor/${finalSlug}`;

      const qrDataUrl = await QRCode.toDataURL(liveUrl, {
        width: 600,
        margin: 2,
        color: { dark: '#a21232', light: '#ffffff' },
      });

      setCreatedResult({
        slug: finalSlug,
        url: liveUrl,
        qrDataUrl,
        customerPhone: customerPhone.trim(),
        customerName: customerName.trim() || userName,
        partnerName: partnerName.trim(),
      });

      toast.dismiss(toastId);
      toast.success('¡Experiencia y Tarjeta creadas con éxito!');
    } catch (err: any) {
      toast.dismiss(toastId);
      toast.error(err?.message || 'Error al generar experiencia');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 text-left animate-fade-in pb-12">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#a21232] to-[#880e28] rounded-3xl p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 px-3 py-0.5 rounded-full inline-block mb-1">
            👑 Creador Pro de Administrador
          </span>
          <h2 className="font-serif text-2xl font-black">
            Creador Rápido de Experiencias (WhatsApp / Transferencias)
          </h2>
          <p className="text-xs text-rose-100 font-light mt-0.5 max-w-xl">
            Crea experiencias completas con acceso total a las 12 temáticas, 145 personajes, grabador de voz, video y widgets interactivos sin pasar por pasarelas de pago.
          </p>
        </div>
      </div>

      {/* Studio Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-gray-200">
        {[
          { id: 'client', label: '1. Cliente & Pareja', icon: Sparkles },
          { id: 'theme', label: '2. Temática & Estilo', icon: Palette },
          { id: 'content', label: '3. Contenido & Música', icon: Music },
          { id: 'media', label: '4. Fotos & Hitos', icon: ImageIcon },
          { id: 'widgets', label: '5. Widgets Interactivos', icon: Gift },
          { id: 'card', label: '6. Tarjeta & Personaje', icon: Award },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeStudioTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveStudioTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#a21232] text-white shadow-sm'
                  : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Grid: Form Builder (7 cols) + Live Mobile Simulator (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Configuration Form */}
        <form onSubmit={handlePublish} className="lg:col-span-7 space-y-6">
          
          {/* SUBTAB 1: CLIENT & PARTNER */}
          {activeStudioTab === 'client' && (
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-4 animate-fade-in">
              <h3 className="font-serif text-sm font-bold text-gray-900 flex items-center gap-2">
                <span>👤</span>
                <span>Datos del Cliente, Pareja y Plan</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Nombre Pareja (Homenajeada/o) *</label>
                  <input
                    type="text"
                    required
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    placeholder="Ej: Sofía"
                    className="w-full px-3.5 py-2.5 border border-gray-250 rounded-xl text-xs focus:outline-none focus:border-[#a21232] font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Nombre de Quien Regala *</label>
                  <input
                    type="text"
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Ej: Matías"
                    className="w-full px-3.5 py-2.5 border border-gray-250 rounded-xl text-xs focus:outline-none focus:border-[#a21232] font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Fecha Especial *</label>
                  <input
                    type="date"
                    required
                    value={specialDate}
                    onChange={(e) => setSpecialDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-250 rounded-xl text-xs focus:outline-none focus:border-[#a21232]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">WhatsApp del Cliente (Opcional)</label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+56912345678"
                    className="w-full px-3.5 py-2.5 border border-gray-250 rounded-xl text-xs focus:outline-none focus:border-[#a21232]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Enlace Personalizado (Slug URL)</label>
                  <div className="flex items-center">
                    <span className="bg-gray-100 border border-r-0 border-gray-250 px-3 py-2.5 rounded-l-xl text-xs text-gray-500">
                      recuerdoqr.cl/amor/
                    </span>
                    <input
                      type="text"
                      value={customSlug}
                      onChange={(e) => setCustomSlug(e.target.value)}
                      placeholder="sofia-y-matias"
                      className="w-full px-3 py-2.5 border border-gray-250 rounded-r-xl text-xs focus:outline-none focus:border-[#a21232] font-mono"
                    />
                  </div>
                </div>

                {/* Plan Selector */}
                <div className="sm:col-span-2 pt-2 border-t">
                  <label className="block text-[10px] font-bold text-gray-700 uppercase mb-2">Plan Asignado</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'basico', label: 'Básico', tag: '8 Fotos' },
                      { id: 'medio', label: 'Medio', tag: '12 Fotos + Música' },
                      { id: 'premium', label: 'Máximo', tag: '20 Fotos + Audio + Todo' },
                    ].map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelectedPlan(p.id as any)}
                        className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                          selectedPlan === p.id
                            ? 'bg-rose-50 border-[#a21232] text-[#a21232] font-bold ring-2 ring-rose-200'
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <p className="text-xs">{p.label}</p>
                        <span className="text-[9px] text-gray-500 block mt-0.5">{p.tag}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB 2: THEME & STYLING */}
          {activeStudioTab === 'theme' && (
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-5 animate-fade-in">
              <h3 className="font-serif text-sm font-bold text-gray-900 flex items-center gap-2">
                <span>🎨</span>
                <span>Seleccionar Temática de la Experiencia (12 Disponibles)</span>
              </h3>

              {/* 12 Themes Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {THEMES_LIST.map((th) => {
                  const isSel = selectedTheme === th.id;
                  return (
                    <button
                      key={th.id}
                      type="button"
                      onClick={() => setSelectedTheme(th.id)}
                      className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                        isSel
                          ? 'bg-[#a21232] text-white border-[#a21232] shadow-sm ring-2 ring-rose-300'
                          : 'bg-white hover:bg-rose-50/50 text-gray-800 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-xl">{th.emoji}</span>
                        {isSel && <span className="text-[9px] font-bold">✓ Activa</span>}
                      </div>
                      <div>
                        <p className={`text-xs font-bold ${isSel ? 'text-white' : 'text-gray-900'}`}>{th.name}</p>
                        <p className={`text-[9px] leading-tight mt-0.5 line-clamp-2 ${isSel ? 'text-rose-100' : 'text-gray-500'}`}>{th.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Typography Selector */}
              <div className="pt-4 border-t space-y-2">
                <label className="block text-[10px] font-bold text-gray-700 uppercase">
                  Tipografía Romántica
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-1">
                  {FONT_OPTIONS.map((f) => {
                    const isSel = customFont === f.id;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setCustomFont(f.id)}
                        className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                          isSel
                            ? 'bg-[#a21232] text-white border-[#a21232]'
                            : 'bg-white hover:bg-gray-50 text-gray-800 border-gray-200'
                        }`}
                      >
                        <p className="text-xs" style={{ fontFamily: getFontFamily(f.id) }}>
                          {f.name}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB 3: CONTENT & MUSIC */}
          {activeStudioTab === 'content' && (
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-5 animate-fade-in">
              <h3 className="font-serif text-sm font-bold text-gray-900 flex items-center gap-2">
                <span>📝</span>
                <span>Portada, Carta, Música y Dedicatoria</span>
              </h3>

              <div className="space-y-3.5">
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Título de Portada</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-250 rounded-xl text-xs focus:outline-none focus:border-[#a21232]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">💌 Carta Escrita con el Corazón</label>
                  <textarea
                    rows={4}
                    value={historyText}
                    onChange={(e) => setHistoryText(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-250 rounded-xl text-xs focus:outline-none focus:border-[#a21232] font-serif"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">💖 Dedicatoria Final</label>
                  <textarea
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-250 rounded-xl text-xs focus:outline-none focus:border-[#a21232] font-serif"
                  />
                </div>

                {/* 🎵 ROMANTIC SONGS QUICK PICKER */}
                <div className="pt-3 border-t space-y-2">
                  <label className="block text-[10px] font-bold text-gray-700 uppercase">
                    ⚡ Música de Fondo (Elige en 1 Clic o Pega YouTube)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {ROMANTIC_SONGS.map((song, sIdx) => {
                      const isSel = songUrl === song.url;
                      return (
                        <button
                          key={sIdx}
                          type="button"
                          onClick={() => setSongUrl(song.url)}
                          className={`p-2 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                            isSel
                              ? 'bg-[#a21232] text-white border-[#a21232] shadow-xs'
                              : 'bg-white hover:bg-rose-50/70 text-gray-800 border-gray-200'
                          }`}
                        >
                          <p className={`text-xs font-bold truncate ${isSel ? 'text-white' : 'text-gray-900'}`}>{song.title}</p>
                          <p className={`text-[9px] truncate ${isSel ? 'text-rose-100' : 'text-gray-500'}`}>{song.artist}</p>
                        </button>
                      );
                    })}
                  </div>
                  <input
                    type="url"
                    value={songUrl}
                    onChange={(e) => setSongUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-3.5 py-2 border border-gray-250 rounded-xl text-xs font-mono mt-1"
                  />
                </div>

                {/* 🎙️ GRABADOR DE NOTA DE VOZ */}
                <div className="pt-3 border-t space-y-2">
                  <label className="block text-[10px] font-bold text-gray-700 uppercase">
                    🎙️ Nota de Voz Real de WhatsApp
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {!isRecording ? (
                      <button
                        type="button"
                        onClick={startRecording}
                        className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Mic className="w-3.5 h-3.5" />
                        <span>Grabar con Micrófono</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={stopRecording}
                        className="py-2.5 bg-red-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer animate-pulse"
                      >
                        <Square className="w-3.5 h-3.5 fill-white" />
                        <span>Detener ({recordingSeconds}s)</span>
                      </button>
                    )}

                    <label className="py-2.5 bg-gray-100 hover:bg-emerald-50 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 transition flex items-center justify-center gap-1.5 cursor-pointer">
                      <Upload className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{voiceNoteFile ? '✓ Audio cargado' : 'Subir Archivo de Audio'}</span>
                      <input type="file" accept="audio/*" onChange={handleVoiceNoteUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                {/* 🎬 VIDEO DE YOUTUBE */}
                <div className="pt-3 border-t space-y-2">
                  <label className="block text-[10px] font-bold text-gray-700 uppercase">
                    🎬 Video de YouTube (Opcional)
                  </label>
                  <input
                    type="url"
                    value={youtubeVideoUrl}
                    onChange={(e) => setYoutubeVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-3.5 py-2 border border-gray-250 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB 4: PHOTOS & MILESTONES */}
          {activeStudioTab === 'media' && (
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-5 animate-fade-in">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-serif text-sm font-bold text-gray-900 flex items-center gap-2">
                  <span>📸</span>
                  <span>Galería de Fotos ({photos.length}) & Estilo</span>
                </h3>
                <label className="px-3 py-1.5 bg-[#a21232] text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-[#880e28] transition flex items-center gap-1">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Subir Fotos</span>
                  <input type="file" multiple accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
              </div>

              {/* Photo Style */}
              <div>
                <label className="block text-[10px] font-bold text-gray-700 uppercase mb-2">Estilo de Galería</label>
                <PhotoStyleSelector
                  selectedPlan={selectedPlan}
                  selectedStyle={photoStyle}
                  onSelectStyle={setPhotoStyle}
                />
              </div>

              {/* Photos Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-60 overflow-y-auto pr-1">
                {photos.map((p, pIdx) => (
                  <div key={pIdx} className="relative group rounded-xl overflow-hidden border border-gray-200 shadow-2xs h-28">
                    <Image src={p.previewUrl} alt={`Foto ${pIdx + 1}`} fill sizes="120px" className="object-cover" />
                    <button
                      type="button"
                      onClick={() => setPhotos(photos.filter((_, i) => i !== pIdx))}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md cursor-pointer z-10"
                    >
                      ×
                    </button>
                    <input
                      type="text"
                      value={p.caption}
                      onChange={(e) => {
                        const copy = [...photos];
                        copy[pIdx].caption = e.target.value;
                        setPhotos(copy);
                      }}
                      placeholder="Pie de foto..."
                      className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] px-1.5 py-0.5 outline-none placeholder-gray-300 z-10"
                    />
                  </div>
                ))}
              </div>

              {/* Milestones */}
              <div className="pt-4 border-t space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-[10px] font-bold text-gray-700 uppercase">
                    ✨ Hitos y Momentos Clave ({milestones.length})
                  </label>
                  <button
                    type="button"
                    onClick={() => setMilestones([...milestones, { title: '', date: new Date().toISOString().split('T')[0], description: '' }])}
                    className="px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg text-[10px] font-bold cursor-pointer hover:bg-indigo-100 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Agregar Hito</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {milestones.map((m, mIdx) => (
                    <div key={mIdx} className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2 relative">
                      <button
                        type="button"
                        onClick={() => setMilestones(milestones.filter((_, i) => i !== mIdx))}
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-600 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="grid grid-cols-2 gap-2 pr-6">
                        <input
                          type="text"
                          placeholder="Título del hito..."
                          value={m.title}
                          onChange={(e) => {
                            const u = [...milestones];
                            u[mIdx].title = e.target.value;
                            setMilestones(u);
                          }}
                          className="px-2.5 py-1.5 border border-gray-250 rounded-lg text-xs bg-white"
                        />
                        <input
                          type="date"
                          value={m.date}
                          onChange={(e) => {
                            const u = [...milestones];
                            u[mIdx].date = e.target.value;
                            setMilestones(u);
                          }}
                          className="px-2.5 py-1.5 border border-gray-250 rounded-lg text-xs bg-white"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Descripción emotiva..."
                        value={m.description}
                        onChange={(e) => {
                          const u = [...milestones];
                          u[mIdx].description = e.target.value;
                          setMilestones(u);
                        }}
                        className="w-full px-2.5 py-1.5 border border-gray-250 rounded-lg text-xs bg-white"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB 5: INTERACTIVE WIDGETS */}
          {activeStudioTab === 'widgets' && (
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-5 animate-fade-in">
              <h3 className="font-serif text-sm font-bold text-gray-900 flex items-center gap-2">
                <span>✨</span>
                <span>Configuración de Widgets Interactivos</span>
              </h3>

              {/* 1. Cumpleaños */}
              {selectedTheme === 'birthday' && (
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-3">
                  <span className="text-xs font-bold text-amber-950 uppercase flex items-center gap-1.5">
                    <span>🎂</span>
                    <span>Configuración de Torta & Velas</span>
                  </span>
                  <div>
                    <label className="block text-[9px] font-bold text-amber-900 uppercase mb-1">Mensaje al Soplar Velas</label>
                    <input
                      type="text"
                      value={birthdayWishMessage}
                      onChange={(e) => setBirthdayWishMessage(e.target.value)}
                      className="w-full px-3 py-2 border border-amber-250 rounded-xl text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-amber-900 uppercase mb-1">3 Mensajes Ocultos en los Globos</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {[0, 1, 2].map((idx) => (
                        <input
                          key={idx}
                          type="text"
                          value={birthdayBalloons[idx]}
                          onChange={(e) => {
                            const copy = [...birthdayBalloons] as [string, string, string];
                            copy[idx] = e.target.value;
                            setBirthdayBalloons(copy);
                          }}
                          className="px-2.5 py-1.5 border border-amber-250 rounded-lg text-xs bg-white"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 2. Propuesta */}
              {selectedTheme === 'proposal' && (
                <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 space-y-3">
                  <span className="text-xs font-bold text-rose-950 uppercase flex items-center gap-1.5">
                    <span>💍</span>
                    <span>Pregunta de Propuesta & Caja de Anillo 3D</span>
                  </span>
                  <div>
                    <label className="block text-[9px] font-bold text-rose-900 uppercase mb-1">Pregunta Principal</label>
                    <input
                      type="text"
                      value={proposalQuestion}
                      onChange={(e) => setProposalQuestion(e.target.value)}
                      className="w-full px-3 py-2 border border-rose-250 rounded-xl text-xs bg-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-rose-900 uppercase mb-1">Texto del Botón Sí</label>
                    <input
                      type="text"
                      value={proposalYesText}
                      onChange={(e) => setProposalYesText(e.target.value)}
                      className="w-full px-3 py-2 border border-rose-250 rounded-xl text-xs bg-white"
                    />
                  </div>
                </div>
              )}

              {/* 3. PIN Secreto */}
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
                <span className="text-xs font-bold text-gray-900 uppercase flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-600" />
                  <span>🔑 Rincón Secreto Protegido con PIN</span>
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-bold text-gray-600 uppercase mb-1">PIN de 4 Dígitos</label>
                    <input
                      type="password"
                      maxLength={6}
                      value={secretPasscode}
                      onChange={(e) => setSecretPasscode(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-250 rounded-xl text-xs bg-white font-mono text-center font-bold tracking-widest"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-gray-600 uppercase mb-1">Pista para Adivinar el PIN</label>
                    <input
                      type="text"
                      value={secretHint}
                      onChange={(e) => setSecretHint(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-250 rounded-xl text-xs bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-gray-600 uppercase mb-1">Mensaje Secreto Revelado</label>
                  <input
                    type="text"
                    value={secretMessage}
                    onChange={(e) => setSecretMessage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-250 rounded-xl text-xs bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB 6: GIFT CARD & 145 CHARACTERS */}
          {activeStudioTab === 'card' && (
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-5 animate-fade-in">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-serif text-sm font-bold text-gray-900 flex items-center gap-2">
                  <span>🎁</span>
                  <span>Catálogo de Personajes (145 Diseños) & Tarjeta</span>
                </h3>
                <span className="text-[10px] bg-rose-100 text-[#a21232] px-2.5 py-0.5 rounded-full font-bold">
                  {selectedCharObj.name} ({selectedCharObj.franchise})
                </span>
              </div>

              {/* Character Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Buscar personaje (Stitch, Snoopy, Kitty, Spiderman, Anime, Disney)..."
                  value={characterSearch}
                  onChange={(e) => setCharacterSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-250 rounded-xl text-xs focus:outline-none focus:border-[#a21232]"
                />
              </div>

              {/* Characters Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 max-h-56 overflow-y-auto pr-1">
                {filteredCharacters.map((c) => {
                  const isSel = selectedCharacterId === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedCharacterId(c.id)}
                      className={`p-2 rounded-xl border text-center transition flex flex-col items-center justify-between cursor-pointer ${
                        isSel
                          ? 'bg-[#a21232] text-white border-[#a21232] ring-2 ring-rose-200'
                          : 'bg-white hover:bg-gray-50 text-gray-800 border-gray-200'
                      }`}
                    >
                      <span className="text-xl">{c.emoji}</span>
                      <p className={`text-[10px] font-bold truncate w-full ${isSel ? 'text-white' : 'text-gray-900'}`}>{c.name}</p>
                    </button>
                  );
                })}
              </div>

              {/* Card Texts */}
              <div className="space-y-3 pt-3 border-t">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-bold text-gray-600 uppercase mb-1">Título de la Tarjeta</label>
                    <input
                      type="text"
                      value={cardTitle}
                      onChange={(e) => setCardTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-250 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-gray-600 uppercase mb-1">De parte de</label>
                    <input
                      type="text"
                      value={cardFrom}
                      onChange={(e) => setCardFrom(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-250 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-gray-600 uppercase mb-1">Dedicatoria en la Tarjeta</label>
                  <textarea
                    rows={2}
                    value={cardMessage}
                    onChange={(e) => setCardMessage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-250 rounded-xl text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-[#a21232] hover:bg-[#880e28] text-white font-bold rounded-2xl shadow-lg transition flex items-center justify-center gap-2 text-sm disabled:opacity-50 cursor-pointer"
          >
            {submitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generando Experiencia Directa y QR HD...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Publicar Experiencia Directa ($0 Sin Pasarela)</span>
              </>
            )}
          </button>
        </form>

        {/* Right: Smartphone Simulator (5 cols) */}
        <div className="lg:col-span-5 flex justify-center sticky top-20">
          <div className="relative w-[320px] h-[600px] bg-black rounded-[44px] p-2.5 shadow-2xl border-4 border-gray-800">
            <div className="w-full h-full rounded-[36px] overflow-y-auto p-4 pt-6 text-center scrollbar-none space-y-4" style={{ backgroundColor: customColors.bg, color: customColors.text, fontFamily: getFontFamily(customFont) }}>
              
              <div className="space-y-2 py-2">
                <Heart className="w-7 h-7 text-[#a21232] fill-[#a21232] mx-auto animate-pulse" />
                <h1 className="text-lg font-bold leading-tight" style={{ color: customColors.primary }}>
                  {title}
                </h1>
                <h2 className="text-sm font-serif italic text-gray-800">
                  {partnerName} & {userName}
                </h2>
              </div>

              {/* Live Counter in Simulator */}
              <div className="bg-white/90 rounded-2xl p-3 border border-rose-100 shadow-xs space-y-1">
                <span className="text-[8px] uppercase tracking-widest text-[#a21232] font-bold block">
                  ⏳ Juntos desde {specialDate}
                </span>
                <p className="text-[10px] text-gray-600 font-light">Contador de tiempo en vivo</p>
              </div>

              {/* Gallery in Simulator */}
              <div className="py-2">
                <PhotoGallery
                  photos={photos.map(p => ({ url: p.previewUrl, caption: p.caption }))}
                  style={photoStyle}
                  primaryColor={customColors.primary}
                />
              </div>

              {/* Dedication in Simulator */}
              <div className="rounded-2xl p-4 bg-gradient-to-b from-[#400d18] to-[#1a0006] text-white text-center shadow-md border border-rose-900/40 space-y-2">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500 mx-auto animate-pulse" />
                <span className="text-[8px] uppercase tracking-widest text-rose-300 font-bold block">
                  💖 Dedicatoria Final
                </span>
                <p className="font-serif italic text-[10px] leading-relaxed text-rose-100">
                  &quot;{message}&quot;
                </p>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* Success Modal */}
      {createdResult && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-4 shadow-2xl border border-gray-150 animate-scale-up">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>

            <h3 className="font-serif text-xl font-bold text-gray-900">
              ¡Experiencia Creada con Éxito!
            </h3>

            <Image 
              src={createdResult.qrDataUrl} 
              alt="QR" 
              width={144} 
              height={144} 
              unoptimized
              priority
              className="w-36 h-36 mx-auto rounded-xl border border-gray-200 p-1.5 shadow-inner" 
            />

            <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-200 text-xs font-mono truncate">
              {createdResult.url}
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  const msg = encodeURIComponent(`¡Hola ${createdResult.customerName}! ❤️ Aquí tienes tu experiencia personalizada para ${createdResult.partnerName}: ${createdResult.url}`);
                  const phoneClean = createdResult.customerPhone.replace(/[^0-9]/g, '');
                  window.open(`https://wa.me/${phoneClean}?text=${msg}`, '_blank');
                }}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Enviar Enlace por WhatsApp al Cliente</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onOpenPrintableModal({
                    partnerName: createdResult.partnerName,
                    userName: createdResult.customerName,
                    message,
                    qrDataUrl: createdResult.qrDataUrl,
                    date: specialDate,
                    slug: createdResult.slug,
                    theme: selectedTheme
                  });
                }}
                className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-[#a21232] font-bold rounded-xl text-xs flex items-center justify-center gap-2 border border-rose-200 transition cursor-pointer"
              >
                <Gift className="w-4 h-4" />
                <span>Ver / Imprimir Tarjeta Postal PDF</span>
              </button>

              <button
                type="button"
                onClick={() => setCreatedResult(null)}
                className="w-full py-2 text-gray-500 hover:text-gray-700 text-xs font-semibold cursor-pointer"
              >
                Cerrar y Crear Otra
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
