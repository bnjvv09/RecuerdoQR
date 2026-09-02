'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { usePersonalizarForm } from '@/components/personalizar/usePersonalizarForm';
import Step1Tematica from '@/components/personalizar/Step1Tematica';
import Step2Plan from '@/components/personalizar/Step2Plan';
import Step2Personalizacion from '@/components/personalizar/Step2Personalizacion';
import Step4Preview from '@/components/personalizar/Step4Preview';
import Step4TarjetaRegalo from '@/components/personalizar/Step4TarjetaRegalo';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  MessageCircle, 
  Printer, 
  Gift, 
  Check, 
  Copy, 
  RefreshCw,
  User,
  Phone,
  Mail,
  Globe
} from 'lucide-react';
import { uploadImage } from '@/lib/upload';
import QRCode from 'qrcode';
import { toast } from 'sonner';

interface AdminCreatorStudioProps {
  onOpenPrintableModal: (data: {
    partnerName: string;
    userName: string;
    message?: string;
    qrDataUrl: string;
    date?: string;
    slug?: string;
    theme?: string;
    selectedCharacter?: any;
    cardPalette?: string;
    cardOrientation?: 'vertical' | 'horizontal';
    cardFont?: string;
    cardTitle?: string;
    cardFrom?: string;
  }) => void;
}

export default function AdminCreatorStudio({ onOpenPrintableModal }: AdminCreatorStudioProps) {
  const form = usePersonalizarForm();

  // Custom slug for admin
  const [customSlug, setCustomSlug] = useState('');

  // Result state
  const [createdResult, setCreatedResult] = useState<{
    slug: string;
    url: string;
    qrDataUrl: string;
    customerPhone: string;
    customerName: string;
    partnerName: string;
  } | null>(null);

  const steps = [
    { num: 1, label: '1. Temática' },
    { num: 2, label: '2. Plan' },
    { num: 3, label: '3. Contenido Web' },
    { num: 4, label: '4. Estilo y Vista Previa' },
    { num: 5, label: '5. Tarjeta de Regalo' },
    { num: 6, label: '6. Crear Experiencia' },
  ];

  const handleNextStep = () => {
    if (form.step === 1) {
      form.setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (form.step === 2) {
      form.setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (form.step === 3) {
      if (!form.validateStep2()) return;
      form.setStep(4);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (form.step === 4) {
      form.setStep(5);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (form.step === 5) {
      form.setStep(6);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    if (form.step > 1) {
      form.setStep(form.step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAdminPublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.partnerName.trim() || !form.userName.trim()) {
      toast.error('Por favor ingresa los nombres de la pareja');
      return;
    }

    form.setLoading(true);
    const toastId = toast.loading('Creando experiencia manual directa...');

    try {
      let finalSlug = (customSlug || `${form.partnerName}-${form.userName}`)
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      if (!finalSlug) {
        finalSlug = `amor-${Math.floor(1000 + Math.random() * 9000)}`;
      }

      // Upload photos
      const uploadedPhotosList: Array<{ url: string; caption?: string }> = [];
      for (const p of form.photos) {
        if (p.file) {
          const publicUrl = await uploadImage(p.file, finalSlug);
          uploadedPhotosList.push({ url: publicUrl, caption: p.caption });
        } else {
          uploadedPhotosList.push({ url: p.previewUrl, caption: p.caption });
        }
      }

      // Upload milestones
      const formattedMilestones: Array<{ title: string; date: string; description: string; image_url: string }> = [];
      for (const m of form.milestones) {
        let imgUrl = m.previewUrl || '';
        if (m.image) {
          imgUrl = await uploadImage(m.image, finalSlug);
        }
        formattedMilestones.push({
          title: m.title,
          date: m.date,
          description: m.description,
          image_url: imgUrl,
        });
      }

      // Upload voice note
      let uploadedVoiceNoteUrl = '';
      if (form.voiceNoteFile) {
        uploadedVoiceNoteUrl = await uploadImage(form.voiceNoteFile, finalSlug);
      }

      const extraConfig = {
        birthdayWishMessage: form.birthdayWishMessage,
        birthdayBalloons: form.birthdayBalloons,
        statsKisses: form.statsKisses,
        statsKissesLabel: form.statsKissesLabel,
        statsCoffees: form.statsCoffees,
        statsCoffeesLabel: form.statsCoffeesLabel,
        statsSmiles: form.statsSmiles,
        statsSmilesLabel: form.statsSmilesLabel,
        proposalQuestion: form.proposalQuestion,
        proposalYesText: form.proposalYesText,
        proposalCelebrationText: form.proposalCelebrationText,
        ringBoxMessage: form.ringBoxMessage,
        secretPasscode: form.secretPasscode,
        secretHint: form.secretHint,
        secretMessage: form.secretMessage,
        scratchPrompt: form.scratchPrompt,
        scratchSecretMessage: form.scratchSecretMessage,
        reconciliationQuestion: form.reconciliationQuestion,
        reconciliationPromise: form.reconciliationPromise,
        voiceNoteUrl: uploadedVoiceNoteUrl || form.voiceNoteUrl,
        youtubeVideoUrl: form.youtubeVideoUrl,
        secondaryPhotos: form.secondaryPhotos.map(p => ({ url: p.previewUrl, caption: p.caption })),
        secondaryPhotoStyle: form.secondaryPhotoStyle,
        cardOrientation: form.cardOrientation,
        cardPalette: form.cardPalette,
        cardTitle: form.cardTitle,
        cardFrom: form.cardFrom,
        cardMessage: form.cardMessage,
        selectedCharacterId: form.selectedCharacter?.id
      };

      const res = await fetch('/api/admin/create-manual-experience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: form.customerName.trim() || form.userName,
          customerPhone: form.customerPhone.trim(),
          customerEmail: form.customerEmail.trim(),
          productId: form.selectedPlan,
          title: form.title.trim(),
          partnerName: form.partnerName.trim(),
          userName: form.userName.trim(),
          specialDate: form.specialDate,
          message: form.message.trim(),
          historyText: form.historyText.trim(),
          songUrl: form.songUrl.trim(),
          themeId: form.selectedTheme,
          customFont: form.customFont,
          customColors: form.customColors,
          photoStyle: form.photoStyle,
          slug: finalSlug,
          sections: form.sections,
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
        customerPhone: form.customerPhone.trim(),
        customerName: form.customerName.trim() || form.userName,
        partnerName: form.partnerName.trim(),
      });

      toast.dismiss(toastId);
      toast.success('¡Experiencia creada con éxito!');
    } catch (err: any) {
      toast.dismiss(toastId);
      toast.error(err?.message || 'Error al generar experiencia');
    } finally {
      form.setLoading(false);
    }
  };

  return (
    <div className="py-4 max-w-5xl mx-auto space-y-6 text-left animate-fade-in pb-12">
      
      {/* Draft Recovery Banner */}
      {form.hasDraft && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs animate-fade-in text-left">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">✨</span>
            <div>
              <h4 className="text-xs font-bold text-rose-950">
                Tienes un recuerdo en progreso guardado
              </h4>
              <p className="text-[11px] text-rose-800 font-light">
                Puedes restaurar tus textos, dedicatorias y fotos anteriores con un solo clic.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={form.clearDraft}
              className="px-3 py-1.5 text-rose-700 hover:bg-rose-100 rounded-xl text-xs font-medium transition cursor-pointer"
            >
              Descartar
            </button>
            <button
              type="button"
              onClick={form.restoreDraft}
              className="px-4 py-1.5 bg-[#a21232] hover:bg-[#850e28] text-white rounded-xl text-xs font-bold shadow-xs transition active:scale-95 cursor-pointer"
            >
              Restaurar Borrador
            </button>
          </div>
        </div>
      )}

      {/* Stepper Navigation (6 Steps Identical to Customer) */}
      <div className="bg-white rounded-3xl border border-gray-200 p-3 sm:p-4 shadow-xs">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 sm:gap-2">
          {steps.map((s) => {
            const isActive = form.step === s.num;
            const isCompleted = form.step > s.num;
            return (
              <button
                key={s.num}
                type="button"
                onClick={() => {
                  if (s.num <= 2 || (s.num >= 3 && form.step >= 3 && form.validateStep2())) {
                    form.setStep(s.num);
                  }
                }}
                className={`py-2 px-1.5 rounded-2xl text-[9px] sm:text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                  isActive
                    ? 'bg-[#a21232] text-white shadow-md'
                    : isCompleted
                    ? 'bg-rose-50 text-[#a21232] hover:bg-rose-100'
                    : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                }`}
              >
                <span className="truncate">{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step View Container */}
      <div className="bg-white rounded-3xl border border-gray-200/80 p-5 sm:p-8 shadow-xs">
        
        {/* Step 1: Theme Selection */}
        {form.step === 1 && (
          <Step1Tematica
            themes={form.themes}
            selectedTheme={form.selectedTheme}
            setSelectedTheme={form.setSelectedTheme}
          />
        )}

        {/* Step 2: Plan Selection */}
        {form.step === 2 && (
          <Step2Plan
            products={form.products}
            selectedPlan={form.selectedPlan}
            setSelectedPlan={form.setSelectedPlan}
            selectedTheme={form.selectedTheme}
          />
        )}

        {/* Step 3: Web Content & Sections */}
        {form.step === 3 && (
          <Step2Personalizacion
            selectedPlan={form.selectedPlan}
            selectedTheme={form.selectedTheme}
            voiceNoteFile={form.voiceNoteFile}
            voiceNoteUrl={form.voiceNoteUrl}
            handleVoiceNoteUpload={form.handleVoiceNoteUpload}
            setVoiceNoteBlob={form.setVoiceNoteBlob}
            uploadedVideoFile={form.uploadedVideoFile}
            uploadedVideoUrl={form.uploadedVideoUrl}
            youtubeVideoUrl={form.youtubeVideoUrl}
            setYoutubeVideoUrl={form.setYoutubeVideoUrl}
            handleVideoUpload={form.handleVideoUpload}
            partnerName={form.partnerName}
            setPartnerName={form.setPartnerName}
            userName={form.userName}
            setUserName={form.setUserName}
            specialDate={form.specialDate}
            setSpecialDate={form.setSpecialDate}
            title={form.title}
            setTitle={form.setTitle}
            message={form.message}
            setMessage={form.setMessage}
            historyText={form.historyText}
            setHistoryText={form.setHistoryText}
            songUrl={form.songUrl}
            setSongUrl={form.setSongUrl}
            secretPasscode={form.secretPasscode}
            setSecretPasscode={form.setSecretPasscode}
            secretHint={form.secretHint}
            setSecretHint={form.setSecretHint}
            secretMessage={form.secretMessage}
            setSecretMessage={form.setSecretMessage}
            birthdayWishMessage={form.birthdayWishMessage}
            setBirthdayWishMessage={form.setBirthdayWishMessage}
            birthdayBalloons={form.birthdayBalloons}
            updateBirthdayBalloon={form.updateBirthdayBalloon}
            statsKisses={form.statsKisses}
            setStatsKisses={form.setStatsKisses}
            statsKissesLabel={form.statsKissesLabel}
            setStatsKissesLabel={form.setStatsKissesLabel}
            statsCoffees={form.statsCoffees}
            setStatsCoffees={form.setStatsCoffees}
            statsCoffeesLabel={form.statsCoffeesLabel}
            setStatsCoffeesLabel={form.setStatsCoffeesLabel}
            statsSmiles={form.statsSmiles}
            setStatsSmiles={form.setStatsSmiles}
            statsSmilesLabel={form.statsSmilesLabel}
            setStatsSmilesLabel={form.setStatsSmilesLabel}
            proposalQuestion={form.proposalQuestion}
            setProposalQuestion={form.setProposalQuestion}
            proposalYesText={form.proposalYesText}
            setProposalYesText={form.setProposalYesText}
            proposalCelebrationText={form.proposalCelebrationText}
            setProposalCelebrationText={form.setProposalCelebrationText}
            ringBoxMessage={form.ringBoxMessage}
            setRingBoxMessage={form.setRingBoxMessage}
            scratchPrompt={form.scratchPrompt}
            setScratchPrompt={form.setScratchPrompt}
            scratchSecretMessage={form.scratchSecretMessage}
            setScratchSecretMessage={form.setScratchSecretMessage}
            scratchUltrasoundUrl={form.scratchUltrasoundUrl}
            setScratchUltrasoundUrl={form.setScratchUltrasoundUrl}
            pollQuestion={form.pollQuestion}
            setPollQuestion={form.setPollQuestion}
            pollOptionA={form.pollOptionA}
            setPollOptionA={form.setPollOptionA}
            pollOptionB={form.pollOptionB}
            setPollOptionB={form.setPollOptionB}
            surpriseMessage={form.surpriseMessage}
            setSurpriseMessage={form.setSurpriseMessage}
            ticketTitle={form.ticketTitle}
            setTicketTitle={form.setTicketTitle}
            ticketConditions={form.ticketConditions}
            setTicketConditions={form.setTicketConditions}
            waxSealSender={form.waxSealSender}
            setWaxSealSender={form.setWaxSealSender}
            crystalHeartTitle={form.crystalHeartTitle}
            setCrystalHeartTitle={form.setCrystalHeartTitle}
            crystalHeartSecret={form.crystalHeartSecret}
            setCrystalHeartSecret={form.setCrystalHeartSecret}
            valentineBoxTitle={form.valentineBoxTitle}
            setValentineBoxTitle={form.setValentineBoxTitle}
            valentineCoupon={form.valentineCoupon}
            setValentineCoupon={form.setValentineCoupon}
            trophyTitle={form.trophyTitle}
            setTrophyTitle={form.setTrophyTitle}
            trophyCategory={form.trophyCategory}
            setTrophyCategory={form.setTrophyCategory}
            diplomaText={form.diplomaText}
            setDiplomaText={form.setDiplomaText}
            gratitudeStar1={form.gratitudeStar1}
            setGratitudeStar1={form.setGratitudeStar1}
            gratitudeStar2={form.gratitudeStar2}
            setGratitudeStar2={form.setGratitudeStar2}
            gratitudeStar3={form.gratitudeStar3}
            setGratitudeStar3={form.setGratitudeStar3}
            reconciliationQuestion={form.reconciliationQuestion}
            setReconciliationQuestion={form.setReconciliationQuestion}
            reconciliationPromise={form.reconciliationPromise}
            setReconciliationPromise={form.setReconciliationPromise}
            specialPlaceAddress={form.specialPlaceAddress}
            setSpecialPlaceAddress={form.setSpecialPlaceAddress}
            customFont={form.customFont}
            setCustomFont={form.setCustomFont}
            customColors={form.customColors}
            setCustomColors={form.setCustomColors}
            photoStyle={form.photoStyle}
            setPhotoStyle={form.setPhotoStyle}
            secondaryPhotoStyle={form.secondaryPhotoStyle}
            setSecondaryPhotoStyle={form.setSecondaryPhotoStyle}
            enableDualPhotoStyle={form.enableDualPhotoStyle}
            setEnableDualPhotoStyle={form.setEnableDualPhotoStyle}
            sections={form.sections}
            expandedSection={form.expandedSection}
            setExpandedSection={form.setExpandedSection}
            photos={form.photos}
            secondaryPhotos={form.secondaryPhotos}
            handleSecondaryPhotoUpload={form.handleSecondaryPhotoUpload}
            removeSecondaryPhoto={form.removeSecondaryPhoto}
            updateSecondaryPhotoCaption={form.updateSecondaryPhotoCaption}
            maxPrimaryPhotos={form.maxPrimaryPhotos}
            maxSecondaryPhotos={form.maxSecondaryPhotos}
            milestones={form.milestones}
            addSection={form.addSection}
            removeSection={form.removeSection}
            moveSection={form.moveSection}
            handlePhotoUpload={form.handlePhotoUpload}
            removePhoto={form.removePhoto}
            updatePhotoCaption={form.updatePhotoCaption}
            addMilestone={form.addMilestone}
            removeMilestone={form.removeMilestone}
            updateMilestone={form.updateMilestone}
            handleMilestoneImage={form.handleMilestoneImage}
          />
        )}

        {/* Step 4: Preview & Style */}
        {form.step === 4 && (
          <Step4Preview
            selectedTheme={form.selectedTheme}
            selectedPlan={form.selectedPlan}
            secondaryPhotoStyle={form.secondaryPhotoStyle}
            enableDualPhotoStyle={form.enableDualPhotoStyle}
            partnerName={form.partnerName}
            userName={form.userName}
            specialDate={form.specialDate}
            title={form.title}
            message={form.message}
            historyText={form.historyText}
            songUrl={form.songUrl}
            voiceNoteUrl={form.voiceNoteUrl}
            uploadedVideoUrl={form.uploadedVideoUrl}
            youtubeVideoUrl={form.youtubeVideoUrl}
            secretPasscode={form.secretPasscode}
            secretMessage={form.secretMessage}
            birthdayWishMessage={form.birthdayWishMessage}
            birthdayBalloons={form.birthdayBalloons}
            statsKisses={form.statsKisses}
            statsKissesLabel={form.statsKissesLabel}
            statsCoffees={form.statsCoffees}
            statsCoffeesLabel={form.statsCoffeesLabel}
            statsSmiles={form.statsSmiles}
            statsSmilesLabel={form.statsSmilesLabel}
            proposalQuestion={form.proposalQuestion}
            proposalYesText={form.proposalYesText}
            proposalCelebrationText={form.proposalCelebrationText}
            ringBoxMessage={form.ringBoxMessage}
            scratchPrompt={form.scratchPrompt}
            scratchSecretMessage={form.scratchSecretMessage}
            scratchUltrasoundUrl={form.scratchUltrasoundUrl}
            pollQuestion={form.pollQuestion}
            pollOptionA={form.pollOptionA}
            pollOptionB={form.pollOptionB}
            surpriseMessage={form.surpriseMessage}
            ticketTitle={form.ticketTitle}
            ticketConditions={form.ticketConditions}
            waxSealSender={form.waxSealSender}
            crystalHeartTitle={form.crystalHeartTitle}
            crystalHeartSecret={form.crystalHeartSecret}
            valentineBoxTitle={form.valentineBoxTitle}
            valentineCoupon={form.valentineCoupon}
            trophyTitle={form.trophyTitle}
            trophyCategory={form.trophyCategory}
            diplomaText={form.diplomaText}
            gratitudeStar1={form.gratitudeStar1}
            gratitudeStar2={form.gratitudeStar2}
            gratitudeStar3={form.gratitudeStar3}
            reconciliationQuestion={form.reconciliationQuestion}
            reconciliationPromise={form.reconciliationPromise}
            customFont={form.customFont}
            setCustomFont={form.setCustomFont}
            customColors={form.customColors}
            setCustomColors={form.setCustomColors}
            photoStyle={form.photoStyle}
            sections={form.sections}
            photos={form.photos}
            milestones={form.milestones}
          />
        )}

        {/* Step 5: Gift Card & Characters */}
        {form.step === 5 && (
          <Step4TarjetaRegalo
            selectedPlan={form.selectedPlan}
            selectedCharacter={form.selectedCharacter}
            setSelectedCharacter={form.setSelectedCharacter}
            cardPalette={form.cardPalette}
            setCardPalette={form.setCardPalette}
            cardOrientation={form.cardOrientation}
            setCardOrientation={form.setCardOrientation}
            cardFont={form.cardFont}
            setCardFont={form.setCardFont}
            partnerName={form.partnerName}
            userName={form.userName}
            cardTitle={form.cardTitle}
            setCardTitle={form.setCardTitle}
            cardFrom={form.cardFrom}
            setCardFrom={form.setCardFrom}
            cardMessage={form.cardMessage}
            setCardMessage={form.setCardMessage}
            specialDate={form.specialDate}
          />
        )}

        {/* Step 6: Direct Creation (En vez de Pago) */}
        {form.step === 6 && (
          <form onSubmit={handleAdminPublish} className="space-y-6 animate-fade-in max-w-2xl mx-auto">
            <div className="text-center space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest bg-rose-50 text-[#a21232] px-3 py-1 rounded-full border border-rose-200">
                👑 Publicación Directa de Administrador
              </span>
              <h2 className="font-serif text-2xl font-bold text-gray-900">
                Finalizar y Crear Experiencia Manual
              </h2>
              <p className="text-xs text-gray-500 font-light max-w-md mx-auto">
                Ingresa los datos del cliente para asociar el pedido ($0 Sin Pasarela). Se generará la experiencia permanente y el código QR de inmediato.
              </p>
            </div>

            {/* Client Form Fields */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1 flex items-center gap-1">
                    <User className="w-3 h-3 text-[#a21232]" />
                    <span>Nombre del Cliente / Comprador</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.customerName || form.userName}
                    onChange={(e) => form.setCustomerName(e.target.value)}
                    placeholder="Ej: Matías González"
                    className="w-full px-3.5 py-2.5 border border-gray-250 rounded-xl text-xs bg-white focus:outline-none focus:border-[#a21232]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-[#a21232]" />
                    <span>WhatsApp del Cliente</span>
                  </label>
                  <input
                    type="tel"
                    value={form.customerPhone}
                    onChange={(e) => form.setCustomerPhone(e.target.value)}
                    placeholder="+56912345678"
                    className="w-full px-3.5 py-2.5 border border-gray-250 rounded-xl text-xs bg-white focus:outline-none focus:border-[#a21232]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1 flex items-center gap-1">
                    <Mail className="w-3 h-3 text-[#a21232]" />
                    <span>Correo Electrónico (Opcional)</span>
                  </label>
                  <input
                    type="email"
                    value={form.customerEmail}
                    onChange={(e) => form.setCustomerEmail(e.target.value)}
                    placeholder="cliente@gmail.com"
                    className="w-full px-3.5 py-2.5 border border-gray-250 rounded-xl text-xs bg-white focus:outline-none focus:border-[#a21232]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1 flex items-center gap-1">
                    <Globe className="w-3 h-3 text-[#a21232]" />
                    <span>Slug Personalizado (URL)</span>
                  </label>
                  <input
                    type="text"
                    value={customSlug}
                    onChange={(e) => setCustomSlug(e.target.value)}
                    placeholder={`ej: ${form.partnerName.toLowerCase()}-${form.userName.toLowerCase()}`}
                    className="w-full px-3.5 py-2.5 border border-gray-250 rounded-xl text-xs bg-white focus:outline-none focus:border-[#a21232] font-mono"
                  />
                </div>
              </div>

              {/* Summary Pill */}
              <div className="pt-3 border-t border-gray-200 flex items-center justify-between text-xs">
                <span className="text-gray-600 font-medium">
                  Plan Seleccionado: <strong>{form.currentProduct?.name || 'Plan Medio'}</strong>
                </span>
                <span className="text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  $0 CLP (Admin Bypass)
                </span>
              </div>
            </div>

            {/* Direct Create Button */}
            <button
              type="submit"
              disabled={form.loading}
              className="w-full py-4 bg-[#a21232] hover:bg-[#880e28] text-white font-bold rounded-2xl shadow-lg transition flex items-center justify-center gap-2 text-sm disabled:opacity-50 cursor-pointer"
            >
              {form.loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generando Experiencia y Código QR...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Publicar Experiencia Directa</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Step Navigation Controls (Back / Next) */}
        {form.step < 6 && (
          <div className="pt-8 border-t border-gray-150 flex items-center justify-between">
            {form.step > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-5 py-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition flex items-center gap-1.5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Paso Anterior</span>
              </button>
            ) : <div />}

            <button
              type="button"
              onClick={handleNextStep}
              className="px-6 py-2.5 bg-[#a21232] hover:bg-[#850e28] text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>{form.step === 5 ? 'Ir a Crear Experiencia' : `Continuar al Paso ${form.step + 1}`}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

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
                    message: form.cardMessage || form.message,
                    qrDataUrl: createdResult.qrDataUrl,
                    date: form.specialDate,
                    slug: createdResult.slug,
                    theme: form.selectedTheme,
                    selectedCharacter: form.selectedCharacter,
                    cardPalette: form.cardPalette,
                    cardOrientation: form.cardOrientation,
                    cardFont: form.cardFont,
                    cardTitle: form.cardTitle,
                    cardFrom: form.cardFrom,
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
