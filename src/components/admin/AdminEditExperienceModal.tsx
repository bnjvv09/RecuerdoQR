'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Experience } from '@/lib/db';
import { 
  X, 
  Save, 
  Trash2, 
  Sparkles, 
  Image as ImageIcon, 
  Music, 
  Calendar, 
  Lock, 
  Video, 
  Mic, 
  Plus, 
  ExternalLink,
  Heart
} from 'lucide-react';
import { toast } from 'sonner';

interface AdminEditExperienceModalProps {
  experience: Experience | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: (updatedExp: Experience) => void;
}

export default function AdminEditExperienceModal({
  experience,
  isOpen,
  onClose,
  onSaved,
}: AdminEditExperienceModalProps) {
  const [saving, setSaving] = useState(false);

  // Form State
  const [partnerName, setPartnerName] = useState('');
  const [userName, setUserName] = useState('');
  const [title, setTitle] = useState('');
  const [specialDate, setSpecialDate] = useState('');
  const [theme, setTheme] = useState('anniversary');
  const [songUrl, setSongUrl] = useState('');
  const [message, setMessage] = useState('');
  const [historyText, setHistoryText] = useState('');

  // Photos State
  const [photos, setPhotos] = useState<Array<{ url: string; caption?: string; id?: string }>>([]);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');

  // Config fields
  const [birthdayWishMessage, setBirthdayWishMessage] = useState('');
  const [birthdayBalloons, setBirthdayBalloons] = useState<[string, string, string]>([
    '¡Mucho Éxito y Alegría!',
    '¡Salud y Risas Siempre!',
    '¡Te Queremos Infinito!'
  ]);
  const [scratchSecretMessage, setScratchSecretMessage] = useState('');
  const [scratchUltrasoundUrl, setScratchUltrasoundUrl] = useState('');
  const [pollQuestion, setPollQuestion] = useState('¿Qué crees que será? 🍼');
  const [pollOptionA, setPollOptionA] = useState('Team Niño 💙');
  const [pollOptionB, setPollOptionB] = useState('Team Niña 💖');
  const [proposalQuestion, setProposalQuestion] = useState('');
  const [proposalYesText, setProposalYesText] = useState('¡Sí, Acepto! ❤️');
  const [proposalCelebrationText, setProposalCelebrationText] = useState('');
  const [ringBoxMessage, setRingBoxMessage] = useState('');
  const [surpriseMessage, setSurpriseMessage] = useState('');
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketConditions, setTicketConditions] = useState('');
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState('');
  const [uploadedVoiceNoteUrl, setUploadedVoiceNoteUrl] = useState('');
  const [secretPasscode, setSecretPasscode] = useState('1234');
  const [secretMessage, setSecretMessage] = useState('');

  useEffect(() => {
    if (experience) {
      setPartnerName(experience.partner_name || '');
      setUserName(experience.user_name || '');
      setTitle(experience.title || '');
      setSpecialDate(experience.special_date ? experience.special_date.split('T')[0] : '');
      setTheme(experience.theme || 'anniversary');
      setSongUrl(experience.song_url || '');
      setMessage(experience.message || '');
      setHistoryText(experience.history_text || '');
      setPhotos(
        (experience.photos || experience.config?.photos || []).map((p: any) => ({
          url: p.url || p.previewUrl,
          caption: p.caption || '',
          id: p.id || Math.random().toString(36).substring(2, 9)
        }))
      );
      const conf = experience.config || {};
      setBirthdayWishMessage(conf.birthdayWishMessage || '');
      setBirthdayBalloons(
        Array.isArray(conf.birthdayBalloons) && conf.birthdayBalloons.length >= 3
          ? [String(conf.birthdayBalloons[0]), String(conf.birthdayBalloons[1]), String(conf.birthdayBalloons[2])]
          : ['¡Mucho Éxito y Alegría!', '¡Salud y Risas Siempre!', '¡Te Queremos Infinito!']
      );
      setScratchSecretMessage(conf.scratchSecretMessage || '');
      setScratchUltrasoundUrl(conf.scratchUltrasoundUrl || '');
      setPollQuestion(conf.pollQuestion || '¿Qué crees que será? 🍼');
      setPollOptionA(conf.pollOptionA || 'Team Niño 💙');
      setPollOptionB(conf.pollOptionB || 'Team Niña 💖');
      setProposalQuestion(conf.proposalQuestion || '');
      setProposalYesText(conf.proposalYesText || '¡Sí, Acepto! ❤️');
      setProposalCelebrationText(conf.proposalCelebrationText || '');
      setRingBoxMessage(conf.ringBoxMessage || '');
      setSurpriseMessage(conf.surpriseMessage || '');
      setTicketTitle(conf.ticketTitle || '');
      setTicketConditions(conf.ticketConditions || '');
      setUploadedVideoUrl(conf.uploadedVideoUrl || '');
      setUploadedVoiceNoteUrl(conf.uploadedVoiceNoteUrl || '');
      setSecretPasscode(conf.secretPasscode || '1234');
      setSecretMessage(conf.secretMessage || '');
    }
  }, [experience]);

  if (!isOpen || !experience) return null;
  const config = experience.config || {};

  const handleAddPhoto = () => {
    if (!newPhotoUrl.trim()) {
      toast.error('Ingresa la URL de la imagen');
      return;
    }
    setPhotos([...photos, { url: newPhotoUrl.trim(), caption: newPhotoCaption.trim(), id: Math.random().toString(36).substring(2, 9) }]);
    setNewPhotoUrl('');
    setNewPhotoCaption('');
    toast.success('Foto agregada');
  };

  const handleRemovePhoto = (idx: number) => {
    setPhotos(photos.filter((_, i) => i !== idx));
  };

  const handleUpdateCaption = (idx: number, caption: string) => {
    const updated = [...photos];
    updated[idx].caption = caption;
    setPhotos(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const toastId = toast.loading('Guardando cambios en la experiencia...');

    try {
      const updatedConfig = {
        ...config,
        birthdayWishMessage,
        birthdayBalloons,
        scratchSecretMessage,
        scratchUltrasoundUrl,
        pollQuestion,
        pollOptionA,
        pollOptionB,
        proposalQuestion,
        proposalYesText,
        proposalCelebrationText,
        ringBoxMessage,
        surpriseMessage,
        ticketTitle,
        ticketConditions,
        uploadedVideoUrl,
        uploadedVoiceNoteUrl,
        secretPasscode,
        secretMessage,
        photos: photos.map(p => ({ url: p.url, caption: p.caption })),
      };

      const payload = {
        partner_name: partnerName.trim(),
        user_name: userName.trim(),
        title: title.trim(),
        special_date: specialDate,
        theme,
        song_url: songUrl.trim(),
        message: message.trim(),
        history_text: historyText.trim(),
        config: updatedConfig,
        photosList: photos.map(p => ({ url: p.url, caption: p.caption })),
      };

      const res = await fetch(`/api/experiences/${experience.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Error al actualizar experiencia');
      }

      const updatedExp: Experience = {
        ...experience,
        partner_name: partnerName.trim(),
        user_name: userName.trim(),
        title: title.trim(),
        special_date: specialDate,
        theme,
        song_url: songUrl.trim(),
        message: message.trim(),
        history_text: historyText.trim(),
        config: updatedConfig,
        photos: photos.map((p, idx) => ({
          id: p.id || `photo-${idx}`,
          experience_id: experience.id,
          url: p.url,
          caption: p.caption,
          order_index: idx
        }))
      };

      onSaved(updatedExp);
      toast.dismiss(toastId);
      toast.success('¡Experiencia actualizada con éxito!');
      onClose();
    } catch (err: any) {
      toast.dismiss(toastId);
      toast.error(err?.message || 'Error al guardar los cambios');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fade-in text-left">
      <div className="bg-white rounded-3xl border border-gray-200 max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-rose-50/50 to-pink-50/30">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">✏️</span>
              <h3 className="font-serif font-bold text-lg text-gray-900">
                Editar Experiencia: /amor/{experience.slug}
              </h3>
            </div>
            <p className="text-xs text-gray-500 font-light mt-0.5">
              Modifica cualquier dato, fecha, dedicatoria o foto de la experiencia en vivo.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`/amor/${experience.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white hover:bg-rose-50 text-gray-600 hover:text-[#a21232] rounded-xl border border-gray-200 transition flex items-center gap-1 text-xs font-bold"
              title="Ver en vivo"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ver Online</span>
            </a>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* Section 1: Core Details */}
          <div className="bg-gray-50/70 p-4 rounded-2xl border border-gray-200 space-y-3">
            <h4 className="font-bold text-gray-900 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#a21232]" />
              <span>1. Datos Principales</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Nombre Destinatario / Pareja</label>
                <input
                  type="text"
                  required
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs focus:border-[#a21232]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Nombre Remitente / Quien Regala</label>
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs focus:border-[#a21232]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Título de la Portada</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs focus:border-[#a21232]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Fecha Especial (Nacimiento/Aniversario)</label>
                <input
                  type="date"
                  required
                  value={specialDate}
                  onChange={(e) => setSpecialDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs focus:border-[#a21232]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Temática Asignada</label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs focus:border-[#a21232]"
                >
                  <option value="anniversary">❤️ Aniversario</option>
                  <option value="birthday">🎂 Cumpleaños</option>
                  <option value="dating-proposal">💌 Pedir Noviazgo</option>
                  <option value="marriage-proposal">💍 Pedir Matrimonio</option>
                  <option value="pregnancy">👶 Anunciar Embarazo</option>
                  <option value="surprise">🎁 Regalo Sorpresa</option>
                  <option value="love-letter">📜 Carta de Amor</option>
                  <option value="love-confession">💖 Declaración de Amor</option>
                  <option value="valentines">🌹 San Valentín</option>
                  <option value="special">⭐ Felicitación / Logro</option>
                  <option value="gratitude">🙏 Agradecimiento</option>
                  <option value="reconciliation">🕊️ Reconciliación</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Enlace Música de YouTube</label>
                <input
                  type="url"
                  value={songUrl}
                  onChange={(e) => setSongUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs focus:border-[#a21232]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Texts & Dedication */}
          <div className="bg-gray-50/70 p-4 rounded-2xl border border-gray-200 space-y-3">
            <h4 className="font-bold text-gray-900 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-[#a21232]" />
              <span>2. Carta y Dedicatoria</span>
            </h4>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Carta o Historia Extensa</label>
                <textarea
                  rows={3}
                  value={historyText}
                  onChange={(e) => setHistoryText(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Dedicatoria Final (Corazón palpitante)</label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Photo Gallery Manager */}
          <div className="bg-gray-50/70 p-4 rounded-2xl border border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-gray-900 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-[#a21232]" />
                <span>3. Galería de Fotos ({photos.length})</span>
              </h4>
            </div>

            {/* Photos List */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-56 overflow-y-auto p-1">
              {photos.map((p, idx) => (
                <div key={idx} className="bg-white p-2 rounded-xl border border-gray-250 relative space-y-1 group">
                  <div className="relative w-full h-20 rounded-lg overflow-hidden">
                    <Image src={p.url} alt="Foto" fill sizes="120px" className="object-cover" />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(idx)}
                    className="absolute top-3 right-3 p-1 bg-red-600 text-white rounded-full opacity-90 hover:opacity-100 transition cursor-pointer"
                    title="Eliminar foto"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                  <input
                    type="text"
                    placeholder="Pie de foto..."
                    value={p.caption || ''}
                    onChange={(e) => handleUpdateCaption(idx, e.target.value)}
                    className="w-full px-1.5 py-0.5 text-[9px] border border-gray-200 rounded bg-gray-50"
                  />
                </div>
              ))}
            </div>

            {/* Add photo by URL */}
            <div className="pt-2 border-t border-gray-200 flex flex-col sm:flex-row gap-2">
              <input
                type="url"
                placeholder="URL de la nueva foto (https://...)"
                value={newPhotoUrl}
                onChange={(e) => setNewPhotoUrl(e.target.value)}
                className="flex-1 px-3 py-1.5 bg-white border border-gray-300 rounded-xl text-xs"
              />
              <input
                type="text"
                placeholder="Pie de foto (opcional)"
                value={newPhotoCaption}
                onChange={(e) => setNewPhotoCaption(e.target.value)}
                className="w-full sm:w-48 px-3 py-1.5 bg-white border border-gray-300 rounded-xl text-xs"
              />
              <button
                type="button"
                onClick={handleAddPhoto}
                className="px-3 py-1.5 bg-[#a21232] text-white rounded-xl text-xs font-bold hover:bg-[#880e28] transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Agregar</span>
              </button>
            </div>
          </div>

          {/* Section 4: Advanced Theme Config */}
          <div className="bg-gray-50/70 p-4 rounded-2xl border border-gray-200 space-y-3">
            <h4 className="font-bold text-gray-900 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#a21232]" />
              <span>4. Parámetros Especiales de Temática</span>
            </h4>

            {theme === 'birthday' && (
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-gray-500 uppercase">Mensaje al Soplar Velas</label>
                <input
                  type="text"
                  value={birthdayWishMessage}
                  onChange={(e) => setBirthdayWishMessage(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs"
                />
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {[0, 1, 2].map(idx => (
                    <input
                      key={idx}
                      type="text"
                      placeholder={`Globo ${idx + 1}`}
                      value={birthdayBalloons[idx] || ''}
                      onChange={(e) => {
                        const updated: [string, string, string] = [...birthdayBalloons];
                        updated[idx] = e.target.value;
                        setBirthdayBalloons(updated);
                      }}
                      className="px-2 py-1.5 bg-white border border-gray-300 rounded-lg text-[10px]"
                    />
                  ))}
                </div>
              </div>
            )}

            {theme === 'pregnancy' && (
              <div className="space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase">Mensaje del Rasca y Gana</label>
                    <input
                      type="text"
                      value={scratchSecretMessage}
                      onChange={(e) => setScratchSecretMessage(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase">URL de Foto de Ecografía</label>
                    <input
                      type="url"
                      value={scratchUltrasoundUrl}
                      onChange={(e) => setScratchUltrasoundUrl(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Pregunta encuesta"
                    value={pollQuestion}
                    onChange={(e) => setPollQuestion(e.target.value)}
                    className="px-2 py-1.5 bg-white border border-gray-300 rounded-lg text-[10px]"
                  />
                  <input
                    type="text"
                    placeholder="Opción A"
                    value={pollOptionA}
                    onChange={(e) => setPollOptionA(e.target.value)}
                    className="px-2 py-1.5 bg-white border border-gray-300 rounded-lg text-[10px]"
                  />
                  <input
                    type="text"
                    placeholder="Opción B"
                    value={pollOptionB}
                    onChange={(e) => setPollOptionB(e.target.value)}
                    className="px-2 py-1.5 bg-white border border-gray-300 rounded-lg text-[10px]"
                  />
                </div>
              </div>
            )}

            {(theme === 'dating-proposal' || theme === 'marriage-proposal') && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Pregunta de Propuesta</label>
                  <input
                    type="text"
                    value={proposalQuestion}
                    onChange={(e) => setProposalQuestion(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Texto Botón Sí</label>
                  <input
                    type="text"
                    value={proposalYesText}
                    onChange={(e) => setProposalYesText(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs"
                  />
                </div>
              </div>
            )}

            {theme === 'surprise' && (
              <div className="space-y-2">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Premio / Mensaje Sorpresa</label>
                  <input
                    type="text"
                    value={surpriseMessage}
                    onChange={(e) => setSurpriseMessage(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Título del Ticket"
                    value={ticketTitle}
                    onChange={(e) => setTicketTitle(e.target.value)}
                    className="px-2 py-1.5 bg-white border border-gray-300 rounded-lg text-[10px]"
                  />
                  <input
                    type="text"
                    placeholder="Condiciones"
                    value={ticketConditions}
                    onChange={(e) => setTicketConditions(e.target.value)}
                    className="px-2 py-1.5 bg-white border border-gray-300 rounded-lg text-[10px]"
                  />
                </div>
              </div>
            )}

            {/* Video & Audio URLs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-gray-200">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">URL de Video Dedicado</label>
                <input
                  type="text"
                  value={uploadedVideoUrl}
                  onChange={(e) => setUploadedVideoUrl(e.target.value)}
                  placeholder="URL del video o YouTube..."
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">URL de Nota de Voz</label>
                <input
                  type="text"
                  value={uploadedVoiceNoteUrl}
                  onChange={(e) => setUploadedVoiceNoteUrl(e.target.value)}
                  placeholder="URL del audio..."
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs"
                />
              </div>
            </div>
          </div>

          {/* Modal Footer Buttons */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3 sticky bottom-0 bg-white py-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-[#a21232] hover:bg-[#880e28] text-white text-xs font-bold shadow-md transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Guardando...' : 'Guardar Cambios'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
