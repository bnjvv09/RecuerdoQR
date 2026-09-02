'use client';

import React, { useState } from 'react';
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
  RefreshCw
} from 'lucide-react';
import PhotoStyleSelector from '@/components/gallery/PhotoStyleSelector';
import PhotoGallery from '@/components/gallery/PhotoGallery';
import { PhotoStyle } from '@/types/gallery';
import { FONT_OPTIONS, getFontFamily } from '@/lib/fonts';
import { uploadImage } from '@/lib/upload';
import QRCode from 'qrcode';
import { toast } from 'sonner';

interface AdminCreatorStudioProps {
  onOpenPrintableModal: (data: { partnerName: string; userName: string; message?: string; qrDataUrl: string; date?: string; slug?: string; theme?: string }) => void;
}

export default function AdminCreatorStudio({ onOpenPrintableModal }: AdminCreatorStudioProps) {
  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [partnerName, setPartnerName] = useState('Sofía');
  const [userName, setUserName] = useState('Matías');
  const [specialDate, setSpecialDate] = useState('2024-02-14');
  const [title, setTitle] = useState('Para el Amor de Mi Vida ❤️');
  const [message, setMessage] = useState('Hoy celebramos cada segundo juntos y todo lo maravilloso que está por venir.');
  const [historyText, setHistoryText] = useState('Desde el primer instante en que te vi, supe que mi destino era caminar a tu lado...');
  const [songUrl, setSongUrl] = useState('https://www.youtube.com/watch?v=GxldQ9eX2wo');
  const [customSlug, setCustomSlug] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('anniversary');

  // Interactive Widgets
  const [secretPasscode, setSecretPasscode] = useState('1234');
  const [secretMessage, setSecretMessage] = useState('Este es nuestro rincón secreto. Te amo infinitamente.');
  const [proposalQuestion, setProposalQuestion] = useState('¿Quieres ser mi compañera/o de vida por siempre? ❤️');
  const [surpriseMessage, setSurpriseMessage] = useState('🎉 ¡Una cena romántica este fin de semana!');
  const [specialPlaceAddress, setSpecialPlaceAddress] = useState('Mirador San Cristóbal, Santiago');

  // Styling
  const [customFont, setCustomFont] = useState('great-vibes');
  const [customColors, setCustomColors] = useState({
    primary: '#a21232',
    bg: '#fffcfd',
    text: '#111827'
  });
  const [photoStyle, setPhotoStyle] = useState<PhotoStyle>('polaroid');

  // Sections
  const [sections, setSections] = useState<Array<{ id: string; type: any }>>([
    { id: 'sec-portada', type: 'portada' },
    { id: 'sec-carta', type: 'carta' },
    { id: 'sec-contador', type: 'contador' },
    { id: 'sec-musica', type: 'musica' },
    { id: 'sec-galeria', type: 'galeria' },
    { id: 'sec-timeline', type: 'timeline' },
    { id: 'sec-corazones', type: 'corazones' }
  ]);
  const [expandedSection, setExpandedSection] = useState<string | null>('sec-portada');

  // Media
  const [photos, setPhotos] = useState<Array<{ file?: File; previewUrl: string; caption: string }>>([
    { previewUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&auto=format&fit=crop', caption: 'Nuestra primera cita' },
    { previewUrl: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&auto=format&fit=crop', caption: 'Bajo las estrellas' },
    { previewUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop', caption: 'Tu hermosa sonrisa' }
  ]);

  const [milestones, setMilestones] = useState<Array<{ title: string; date: string; description: string; previewUrl?: string; file?: File }>>([
    { title: 'El día que nos conocimos', date: '2022-05-18', description: 'Nuestras miradas se cruzaron y todo cambió.', previewUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&auto=format&fit=crop' },
    { title: 'Nuestro primer viaje', date: '2023-01-10', description: 'Una escapada inolvidable al mar.', previewUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop' }
  ]);

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

  // Photo handlers
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const newItems = files.map(file => ({
      file,
      previewUrl: URL.createObjectURL(file),
      caption: ''
    }));
    setPhotos([...photos, ...newItems]);
    toast.success(`${files.length} foto(s) agregadas`);
  };

  // Milestone handlers
  const addMilestone = () => {
    setMilestones([...milestones, { title: '', date: new Date().toISOString().split('T')[0], description: '' }]);
  };

  const handleMilestoneImageUpload = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    const previewUrl = URL.createObjectURL(file);
    const updated = [...milestones];
    updated[idx] = { ...updated[idx], file, previewUrl };
    setMilestones(updated);
    toast.success('Foto adjuntada al hito');
  };

  // Publish
  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerName.trim() || !userName.trim()) {
      toast.error('Por favor ingresa los nombres de la pareja');
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading('Publicando experiencia directa...');

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

      // Construct Sections
      const constructedSections = sections.map((sec) => {
        if (sec.type === 'portada') return { ...sec, content: { title, message } };
        if (sec.type === 'carta') return { ...sec, content: { text: historyText } };
        if (sec.type === 'contador') return { ...sec, content: { date: specialDate } };
        if (sec.type === 'galeria') return { ...sec, content: { photos: uploadedPhotosList, photoStyle } };
        if (sec.type === 'musica') return { ...sec, content: { url: songUrl } };
        if (sec.type === 'timeline') return { ...sec, content: { milestones: formattedMilestones } };
        if (sec.type === 'pregunta') return { ...sec, content: { question: proposalQuestion } };
        if (sec.type === 'sorpresa') return { ...sec, content: { message: surpriseMessage } };
        if (sec.type === 'lugar') return { ...sec, content: { address: specialPlaceAddress } };
        if (sec.type === 'secreto') return { ...sec, content: { passcode: secretPasscode, message: secretMessage } };
        if (sec.type === 'corazones') return { ...sec, content: { message } };
        return sec;
      });

      const response = await fetch('/api/admin/create-manual-experience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerName.trim() || `Cliente WhatsApp (${userName})`,
          customerPhone: customerPhone.trim() || '+56900000000',
          customerEmail: customerEmail.trim() || `${finalSlug}@recuerdoqr.cl`,
          title,
          partnerName,
          userName,
          specialDate,
          message,
          historyText,
          songUrl,
          themeId: 'anniversary',
          customFont,
          customColors,
          photoStyle,
          slug: finalSlug,
          sections: constructedSections,
          photos: uploadedPhotosList,
          milestones: formattedMilestones,
          extraConfig: {
            secret_passcode: secretPasscode,
            secret_message: secretMessage,
            proposal_question: proposalQuestion,
            surprise_message: surpriseMessage,
            special_place_address: specialPlaceAddress,
          },
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Error al crear la experiencia');
      }

      const appOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://recuerdoqr.cl';
      const liveUrl = `${appOrigin}/amor/${finalSlug}`;
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
        partnerName,
      });

      toast.dismiss(toastId);
      toast.success('¡Experiencia creada y QR generado exitosamente!');
    } catch (err: any) {
      toast.dismiss(toastId);
      toast.error(err?.message || 'Error al crear experiencia');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 text-left animate-fade-in">
      <div className="border-b border-gray-200 pb-3">
        <h2 className="font-serif text-lg font-bold text-gray-900 flex items-center gap-2">
          <span>🛠️</span>
          <span>Creador Rápido de Experiencias (Pedidos Manuales / WhatsApp)</span>
        </h2>
        <p className="text-xs text-gray-500 font-light mt-0.5">
          Crea experiencias completas directamente para clientes que te contacten por WhatsApp sin pasar por la pasarela de pago.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Editor (7 cols) */}
        <form onSubmit={handlePublish} className="lg:col-span-7 space-y-6">
          
          {/* Customer & Basic Info */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 font-serif">
              1. Datos del Cliente & Pareja
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Nombre Pareja *</label>
                <input
                  type="text"
                  required
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-250 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Nombre Quien Regala *</label>
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-250 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Fecha Especial *</label>
                <input
                  type="date"
                  required
                  value={specialDate}
                  onChange={(e) => setSpecialDate(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-250 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">WhatsApp del Cliente</label>
                <input
                  type="tel"
                  placeholder="+56912345678"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-250 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Slug Personalizado</label>
                <input
                  type="text"
                  placeholder="ej. sofia-y-matias"
                  value={customSlug}
                  onChange={(e) => setCustomSlug(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-250 rounded-xl text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Style Selector */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 font-serif">
              2. Tipografía & Estilo
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-32 overflow-y-auto pr-1">
              {FONT_OPTIONS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setCustomFont(f.id)}
                  className={`p-2 rounded-xl border text-left text-xs truncate transition ${
                    customFont === f.id
                      ? 'border-[#a21232] bg-rose-50 text-[#a21232] font-bold'
                      : 'border-gray-200 bg-white'
                  }`}
                  style={{ fontFamily: getFontFamily(f.id) }}
                >
                  {f.name}
                </button>
              ))}
            </div>
          </div>

          {/* Sections Organizer */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 font-serif">
                3. Secciones del Recuerdo
              </h3>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => addSection('pregunta')}
                  className="px-2 py-1 bg-rose-50 text-[#a21232] rounded-lg text-[9px] font-bold"
                >
                  + Propuesta
                </button>
                <button
                  type="button"
                  onClick={() => addSection('secreto')}
                  className="px-2 py-1 bg-rose-50 text-[#a21232] rounded-lg text-[9px] font-bold"
                >
                  + PIN Secreto
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {sections.map((sec, idx) => {
                const isExp = expandedSection === sec.id;
                return (
                  <div key={sec.id} className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="p-3 bg-gray-50 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setExpandedSection(isExp ? null : sec.id)}
                        className="font-bold text-xs text-gray-800 flex items-center gap-1.5"
                      >
                        <span>{sec.type.toUpperCase()}</span>
                        {isExp ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      <div className="flex items-center gap-1">
                        {idx > 0 && (
                          <button type="button" onClick={() => moveSection(idx, 'up')} className="p-1 bg-white border border-gray-200 rounded text-gray-500">
                            <ArrowUp className="w-3 h-3" />
                          </button>
                        )}
                        {idx < sections.length - 1 && (
                          <button type="button" onClick={() => moveSection(idx, 'down')} className="p-1 bg-white border border-gray-200 rounded text-gray-500">
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>

                    {isExp && (
                      <div className="p-4 space-y-3">
                        {sec.type === 'portada' && (
                          <div>
                            <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">Título Portada</label>
                            <input
                              type="text"
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                              className="w-full px-3 py-1.5 border border-gray-250 rounded-lg text-xs"
                            />
                          </div>
                        )}

                        {sec.type === 'carta' && (
                          <div>
                            <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">Carta</label>
                            <textarea
                              rows={3}
                              value={historyText}
                              onChange={(e) => setHistoryText(e.target.value)}
                              className="w-full px-3 py-1.5 border border-gray-250 rounded-lg text-xs"
                            />
                          </div>
                        )}

                        {sec.type === 'galeria' && (
                          <div className="space-y-4">
                            <PhotoStyleSelector
                              selectedStyle={photoStyle}
                              onSelectStyle={setPhotoStyle}
                              primaryColor={customColors.primary}
                            />
                            <div className="flex items-center justify-between pt-2">
                              <span className="text-[10px] font-bold text-gray-700">Fotos ({photos.length})</span>
                              <label className="cursor-pointer px-2.5 py-1 bg-[#a21232] text-white rounded-lg text-[9px] font-bold">
                                Subir Fotos
                                <input type="file" multiple accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                              </label>
                            </div>
                          </div>
                        )}

                        {sec.type === 'timeline' && (
                          <div className="space-y-2.5">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-bold text-gray-700">Hitos</span>
                              <button type="button" onClick={addMilestone} className="px-2 py-1 bg-rose-50 text-[#a21232] rounded-lg text-[9px] font-bold">
                                + Añadir Hito
                              </button>
                            </div>

                            {milestones.map((m, mIdx) => (
                              <div key={mIdx} className="bg-gray-50 p-2.5 rounded-xl border border-gray-200 space-y-1.5">
                                <div className="grid grid-cols-2 gap-2">
                                  <input
                                    type="text"
                                    placeholder="Título"
                                    value={m.title}
                                    onChange={(e) => {
                                      const u = [...milestones];
                                      u[mIdx].title = e.target.value;
                                      setMilestones(u);
                                    }}
                                    className="px-2 py-1 border border-gray-250 rounded-lg text-[9px] bg-white"
                                  />
                                  <input
                                    type="date"
                                    value={m.date}
                                    onChange={(e) => {
                                      const u = [...milestones];
                                      u[mIdx].date = e.target.value;
                                      setMilestones(u);
                                    }}
                                    className="px-2 py-1 border border-gray-250 rounded-lg text-[9px] bg-white"
                                  />
                                </div>
                                <input
                                  type="text"
                                  placeholder="Descripción"
                                  value={m.description}
                                  onChange={(e) => {
                                    const u = [...milestones];
                                    u[mIdx].description = e.target.value;
                                    setMilestones(u);
                                  }}
                                  className="w-full px-2 py-1 border border-gray-250 rounded-lg text-[9px] bg-white"
                                />
                                {m.previewUrl ? (
                                  <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-200 justify-between">
                                    <div className="flex items-center gap-2">
                                      <img src={m.previewUrl} alt="Hito" className="w-7 h-7 object-cover rounded" />
                                      <span className="text-[8px] text-emerald-700 font-bold">✓ Foto adjunta</span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const u = [...milestones];
                                        u[mIdx].previewUrl = '';
                                        u[mIdx].file = undefined;
                                        setMilestones(u);
                                      }}
                                      className="text-[8px] text-red-500 font-bold"
                                    >
                                      Quitar
                                    </button>
                                  </div>
                                ) : (
                                  <label className="cursor-pointer px-2 py-1 bg-white border border-gray-250 rounded-lg text-[8px] font-bold text-gray-700 hover:bg-rose-50 flex items-center gap-1 w-fit">
                                    <ImageIcon className="w-3 h-3 text-[#a21232]" />
                                    Adjuntar Foto
                                    <input type="file" accept="image/*" onChange={(e) => handleMilestoneImageUpload(mIdx, e)} className="hidden" />
                                  </label>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        {sec.type === 'contador' && (
                          <div className="space-y-2">
                            <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">Fecha de Inicio de la Relación</label>
                            <input
                              type="date"
                              value={specialDate}
                              onChange={(e) => setSpecialDate(e.target.value)}
                              className="w-full px-3 py-1.5 border border-gray-250 rounded-lg text-xs"
                            />
                          </div>
                        )}

                        {sec.type === 'musica' && (
                          <div className="space-y-2">
                            <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">Enlace de Canción (YouTube)</label>
                            <input
                              type="url"
                              value={songUrl}
                              onChange={(e) => setSongUrl(e.target.value)}
                              placeholder="https://www.youtube.com/watch?v=..."
                              className="w-full px-3 py-1.5 border border-gray-250 rounded-lg text-xs"
                            />
                          </div>
                        )}

                        {sec.type === 'corazones' && (
                          <div className="space-y-2">
                            <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">Dedicatoria Final Destacada</label>
                            <textarea
                              rows={3}
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                              className="w-full px-3 py-1.5 border border-gray-250 rounded-lg text-xs"
                            />
                          </div>
                        )}

                        {sec.type === 'pregunta' && (
                          <div className="space-y-2">
                            <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">Pregunta de Propuesta</label>
                            <input
                              type="text"
                              value={proposalQuestion}
                              onChange={(e) => setProposalQuestion(e.target.value)}
                              className="w-full px-3 py-1.5 border border-gray-250 rounded-lg text-xs"
                            />
                          </div>
                        )}

                        {sec.type === 'secreto' && (
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">PIN (4 dígitos)</label>
                              <input
                                type="text"
                                maxLength={6}
                                value={secretPasscode}
                                onChange={(e) => setSecretPasscode(e.target.value)}
                                className="w-full px-2 py-1.5 border border-gray-250 rounded-lg text-xs font-mono"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">Mensaje Oculto</label>
                              <input
                                type="text"
                                value={secretMessage}
                                onChange={(e) => setSecretMessage(e.target.value)}
                                className="w-full px-2 py-1.5 border border-gray-250 rounded-lg text-xs"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-[#a21232] hover:bg-[#880e28] text-white font-bold rounded-2xl shadow-lg transition flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {submitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generando Experiencia y QR...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Publicar Experiencia Directa</span>
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

            <img src={createdResult.qrDataUrl} alt="QR" className="w-36 h-36 mx-auto rounded-xl border border-gray-200 p-1.5 shadow-inner" />

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
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Enviar Enlace por WhatsApp al Cliente</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenPrintableModal({
                  partnerName: createdResult.partnerName,
                  userName,
                  message,
                  qrDataUrl: createdResult.qrDataUrl,
                  date: specialDate,
                  slug: createdResult.slug,
                  theme: selectedTheme,
                })}
                className="w-full py-2.5 bg-rose-50 border border-rose-200 text-[#a21232] font-bold rounded-xl text-xs hover:bg-rose-100 transition flex items-center justify-center gap-2"
              >
                <span>🎁</span>
                <span>Ver / Imprimir Tarjeta Física de Regalo</span>
              </button>

              <div className="flex gap-2">
                <a
                  href={createdResult.qrDataUrl}
                  download={`qr-${createdResult.slug}.png`}
                  className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition flex items-center justify-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar QR</span>
                </a>
                <button
                  type="button"
                  onClick={() => setCreatedResult(null)}
                  className="flex-1 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl text-xs transition"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
