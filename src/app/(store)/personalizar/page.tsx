'use client';

import React, { Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { usePersonalizarForm } from '@/components/personalizar/usePersonalizarForm';
import Step1Tematica from '@/components/personalizar/Step1Tematica';
import Step2Plan from '@/components/personalizar/Step2Plan';
import Step2Personalizacion from '@/components/personalizar/Step2Personalizacion';
import Step4Preview from '@/components/personalizar/Step4Preview';
import Step4TarjetaRegalo from '@/components/personalizar/Step4TarjetaRegalo';
import Step4Checkout from '@/components/personalizar/Step4Checkout';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { uploadImage } from '@/lib/upload';
import { createOrder, createExperience } from '@/lib/db';
import { sanitizeText, sanitizeObject } from '@/lib/sanitize';
import { toast } from 'sonner';

function PersonalizarContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const form = usePersonalizarForm(
    searchParams.get('plan') || undefined,
    searchParams.get('theme') || undefined
  );

  const stepParam = searchParams.get('step');
  const statusParam = searchParams.get('status');

  useEffect(() => {
    if (stepParam) {
      const numStep = Number(stepParam);
      if (numStep >= 1 && numStep <= 6) {
        form.setStep(numStep);
      }
    }
    if (statusParam === 'failure' || statusParam === 'pending') {
      toast.info('Regresaste al resumen de pago. Puedes modificar lo que desees o volver a pagar cuando estés listo.');
    }
  }, [stepParam, statusParam]);

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

  const handleFinalSubmit = async (e: React.FormEvent, finalDiscountPrice?: number) => {
    e.preventDefault();
    if (!form.validateStep4()) return;

    form.setLoading(true);
    const toastId = toast.loading('Guardando y configurando tu experiencia...');

    try {
      // Sanitizar datos del cliente
      const cleanCustomerName = sanitizeText(form.customerName);
      const cleanCustomerEmail = sanitizeText(form.customerEmail).toLowerCase();
      const cleanCustomerPhone = sanitizeText(form.customerPhone);
      const cleanDeliveryAddress = sanitizeText(form.deliveryAddress);

      // Sanitizar textos de personalización
      const cleanPartner = sanitizeText(form.partnerName).toLowerCase().replace(/[^a-z0-9]/g, '') || 'amor';
      const cleanUser = sanitizeText(form.userName).toLowerCase().replace(/[^a-z0-9]/g, '') || 'pareja';
      const slug = `${cleanPartner}-${cleanUser}-${Math.floor(100 + Math.random() * 900)}`;

      // Upload photos
      const uploadedPhotosList: Array<{ url: string; caption?: string }> = [];
      for (const p of form.photos) {
        if (p.file) {
          const publicUrl = await uploadImage(p.file, slug);
          uploadedPhotosList.push({ url: publicUrl, caption: sanitizeText(p.caption) });
        } else {
          uploadedPhotosList.push({ url: p.previewUrl, caption: sanitizeText(p.caption) });
        }
      }

      // Upload milestones
      const formattedMilestones: Array<{ title: string; date: string; description: string; image_url: string }> = [];
      for (const m of form.milestones) {
        let imgUrl = m.previewUrl || '';
        if (m.image) {
          imgUrl = await uploadImage(m.image, slug);
        }
        formattedMilestones.push({
          title: sanitizeText(m.title),
          date: m.date,
          description: sanitizeText(m.description),
          image_url: imgUrl,
        });
      }

      // Upload Voice Note (Audio) if present in Premium
      let uploadedVoiceNoteUrl = '';
      if (form.voiceNoteFile) {
        uploadedVoiceNoteUrl = await uploadImage(form.voiceNoteFile, slug);
      }

      // Upload video if provided in Premium plan
      let uploadedVideoUrl = form.youtubeVideoUrl || '';
      if (form.uploadedVideoFile) {
        uploadedVideoUrl = await uploadImage(form.uploadedVideoFile, slug);
      }

      // Create Order
      const finalAmount = finalDiscountPrice !== undefined ? finalDiscountPrice : form.totalPrice;
      const newOrder = await createOrder({
        product_id: form.selectedPlan,
        customer_name: cleanCustomerName,
        customer_email: cleanCustomerEmail,
        customer_phone: cleanCustomerPhone,
        delivery_address: cleanDeliveryAddress,
        total: finalAmount,
      });

      // Construct Sections
      const constructedSections = form.sections.map((sec) => {
        if (sec.type === 'portada') return { ...sec, content: { title: form.title, message: form.message } };
        if (sec.type === 'tematica') return { ...sec, content: { theme: form.selectedTheme } };
        if (sec.type === 'carta') return { ...sec, content: { text: form.historyText } };
        if (sec.type === 'contador') return { ...sec, content: { date: form.specialDate } };
        if (sec.type === 'galeria') return { ...sec, content: { photos: uploadedPhotosList, photoStyle: form.photoStyle } };
        if (sec.type === 'musica') return { ...sec, content: { url: form.songUrl } };
        if (sec.type === 'audio') return { ...sec, content: { url: uploadedVoiceNoteUrl } };
        if (sec.type === 'video') return { ...sec, content: { url: uploadedVideoUrl } };
        if (sec.type === 'timeline') return { ...sec, content: { milestones: formattedMilestones } };
        if (sec.type === 'pregunta') return { ...sec, content: { question: form.proposalQuestion } };
        if (sec.type === 'sorpresa') return { ...sec, content: { message: form.surpriseMessage } };
        if (sec.type === 'lugar') return { ...sec, content: { address: form.specialPlaceAddress } };
        if (sec.type === 'secreto') return { ...sec, content: { passcode: form.secretPasscode, message: form.secretMessage } };
        if (sec.type === 'corazones') return { ...sec, content: { message: form.message } };
        return sec;
      });

      // Create Experience in DB
      await createExperience(
        {
          order_id: newOrder.id,
          slug,
          title: form.title,
          message: form.message,
          history_text: form.historyText,
          partner_name: form.partnerName,
          user_name: form.userName,
          special_date: form.specialDate,
          song_url: form.songUrl,
          theme: form.selectedTheme,
          config: {
            customFont: form.customFont,
            customColors: form.customColors,
            sections: constructedSections,
            photoStyle: form.photoStyle,
            secondaryPhotoStyle: form.secondaryPhotoStyle,
            enableDualPhotoStyle: form.enableDualPhotoStyle,
            selectedCharacter: form.selectedCharacter,
            cardPalette: form.cardPalette,
            cardOrientation: form.cardOrientation,
            cardFont: form.cardFont,
            cardTitle: form.cardTitle,
            cardFrom: form.cardFrom,
            cardMessage: form.cardMessage,
            uploadedVoiceNoteUrl: uploadedVoiceNoteUrl,
            uploadedVideoUrl: uploadedVideoUrl,
            // 12 Themes State
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
            scratchPrompt: form.scratchPrompt,
            scratchSecretMessage: form.scratchSecretMessage,
            scratchUltrasoundUrl: form.scratchUltrasoundUrl,
            pollQuestion: form.pollQuestion,
            pollOptionA: form.pollOptionA,
            pollOptionB: form.pollOptionB,
            surpriseMessage: form.surpriseMessage,
            ticketTitle: form.ticketTitle,
            ticketConditions: form.ticketConditions,
            waxSealSender: form.waxSealSender,
            crystalHeartTitle: form.crystalHeartTitle,
            crystalHeartSecret: form.crystalHeartSecret,
            valentineBoxTitle: form.valentineBoxTitle,
            valentineCoupon: form.valentineCoupon,
            trophyTitle: form.trophyTitle,
            trophyCategory: form.trophyCategory,
            diplomaText: form.diplomaText,
            gratitudeStar1: form.gratitudeStar1,
            gratitudeStar2: form.gratitudeStar2,
            gratitudeStar3: form.gratitudeStar3,
            reconciliationQuestion: form.reconciliationQuestion,
            reconciliationPromise: form.reconciliationPromise,
          },
        },
        uploadedPhotosList,
        formattedMilestones
      );

      toast.dismiss(toastId);
      toast.success('¡Experiencia creada exitosamente!');

      // Payment Gateway Redirect or Thank You
      const payResponse = await fetch('/api/checkout/mercadopago', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: newOrder.id,
          productName: form.currentProduct?.name || 'Experiencia Digital RecuerdoQR',
          total: finalAmount,
          customerEmail: form.customerEmail,
        }),
      });

      if (!payResponse.ok) {
        throw new Error('Error al conectar con la pasarela de pago');
      }

      const payData = await payResponse.json();

      if (payData.init_point) {
        window.location.href = payData.init_point;
      } else {
        router.push(`/gracias?orderId=${newOrder.id}`);
      }
    } catch (err: any) {
      toast.dismiss(toastId);
      toast.error(err?.message || 'Error al procesar el pedido. Intenta nuevamente.');
      console.error('Submit error:', err);
    } finally {
      form.setLoading(false);
    }
  };

  const steps = [
    { num: 1, label: '1. Temática' },
    { num: 2, label: '2. Plan' },
    { num: 3, label: '3. Contenido Web' },
    { num: 4, label: '4. Estilo y Vista Previa' },
    { num: 5, label: '5. Tarjeta de Regalo' },
    { num: 6, label: '6. Pago' },
  ];

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      
      {/* Draft Recovery Banner */}
      {form.hasDraft && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm animate-fade-in text-left">
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
              className="px-4 py-1.5 bg-[#a21232] hover:bg-[#850e28] text-white rounded-xl text-xs font-bold shadow-sm transition active:scale-95 cursor-pointer"
            >
              Restaurar Borrador
            </button>
          </div>
        </div>
      )}

      {/* Stepper Navigation */}
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
      <div className="bg-white/70 backdrop-blur-xs rounded-3xl border border-gray-200/80 p-5 sm:p-8 shadow-xs">
        
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
            reconciliationPromise={form.reconciliationPromise}
            setReconciliationPromise={form.setReconciliationPromise}
            secondaryPhotoStyle={form.secondaryPhotoStyle}
            setSecondaryPhotoStyle={form.setSecondaryPhotoStyle}
            enableDualPhotoStyle={form.enableDualPhotoStyle}
            setEnableDualPhotoStyle={form.setEnableDualPhotoStyle}
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
            uploadedVideoFile={form.uploadedVideoFile}
            uploadedVideoUrl={form.uploadedVideoUrl}
            youtubeVideoUrl={form.youtubeVideoUrl}
            setYoutubeVideoUrl={form.setYoutubeVideoUrl}
            handleVideoUpload={form.handleVideoUpload}
            secretPasscode={form.secretPasscode}
            setSecretPasscode={form.setSecretPasscode}
            secretMessage={form.secretMessage}
            setSecretMessage={form.setSecretMessage}
            specialPlaceAddress={form.specialPlaceAddress}
            setSpecialPlaceAddress={form.setSpecialPlaceAddress}
            photoStyle={form.photoStyle}
            setPhotoStyle={form.setPhotoStyle}
            sections={form.sections}
            expandedSection={form.expandedSection}
            setExpandedSection={form.setExpandedSection}
            photos={form.photos}
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

        {/* Step 4: Live Web Preview & Visual Styling (Colors & Fonts) */}
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

        {/* Step 5: Gift Card Customization */}
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

        {/* Step 6: Checkout and Payment */}
        {form.step === 6 && (
          <Step4Checkout
            currentProduct={form.currentProduct}
            selectedPlan={form.selectedPlan}
            totalPrice={form.totalPrice}
            partnerName={form.partnerName}
            userName={form.userName}
            customerName={form.customerName}
            setCustomerName={form.setCustomerName}
            customerEmail={form.customerEmail}
            setCustomerEmail={form.setCustomerEmail}
            customerPhone={form.customerPhone}
            setCustomerPhone={form.setCustomerPhone}
            deliveryAddress={form.deliveryAddress}
            setDeliveryAddress={form.setDeliveryAddress}
            loading={form.loading}
            onSubmit={handleFinalSubmit}
          />
        )}

        {/* Navigation Buttons */}
        {form.step < 6 && (
          <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
            {form.step > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-5 py-2.5 rounded-full border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 transition flex items-center gap-1.5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Paso Anterior</span>
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={handleNextStep}
              className="px-6 py-2.5 rounded-full bg-[#a21232] hover:bg-[#880e28] text-white text-xs font-bold shadow-md hover:shadow-lg transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>
                {form.step === 1 ? 'Elegir Plan' : 
                 form.step === 2 ? 'Personalizar Contenido' : 
                 form.step === 3 ? 'Estilo y Vista Previa' : 
                 form.step === 4 ? 'Personalizar Tarjeta' : 
                 'Continuar al Pago'}
              </span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>

    </div>
  );
}

export default function PersonalizarPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-gray-400 font-serif">Cargando personalizador...</div>}>
      <PersonalizarContent />
    </Suspense>
  );
}
