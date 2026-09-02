'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Smartphone, Heart, Sparkles, Music, MapPin, Gift, Lock } from 'lucide-react';
import PhotoGallery from '@/components/gallery/PhotoGallery';
import { PhotoStyle } from '@/types/gallery';
import { getFontFamily } from '@/lib/fonts';
import { PhotoInput, MilestoneInput, ExperienceSection, CustomColors } from './types';

interface Step3PreviewProps {
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
  secretPasscode: string;
  secretMessage: string;
  proposalQuestion: string;
  surpriseMessage: string;
  customFont: string;
  customColors: CustomColors;
  photoStyle: PhotoStyle;
  sections: ExperienceSection[];
  photos: PhotoInput[];
  milestones: MilestoneInput[];
}

export default function Step3Preview({
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
  secretPasscode,
  secretMessage,
  proposalQuestion,
  surpriseMessage,
  customFont,
  customColors,
  photoStyle,
  sections,
  photos,
  milestones,
}: Step3PreviewProps) {
  const activeFontFamily = getFontFamily(customFont);

  const [timeElapsed, setTimeElapsed] = useState({
    years: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTime = () => {
      let start: Date;
      if (typeof specialDate === 'string' && specialDate.includes('-')) {
        const parts = specialDate.split('T')[0].split('-').map(Number);
        start = new Date(parts[0], (parts[1] || 1) - 1, parts[2] || 1);
      } else {
        start = new Date(specialDate || '2024-02-14');
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
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [specialDate]);

  return (
    <div className="space-y-6 animate-fade-in text-center">
      <div className="border-b border-rose-100 pb-3 text-left">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span>📱</span>
          <span>3. Vista Previa de tu Página Web Digital</span>
        </h2>
        <p className="text-xs text-gray-500 font-light mt-1">
          Así es exactamente como se verá la página interactiva cuando tu pareja escanee el código QR.
        </p>
      </div>

      {/* The Phone Container */}
      <div className="flex justify-center pt-2">
        <div className="relative w-full max-w-[340px] bg-black rounded-[46px] p-3.5 shadow-2xl border-4 border-gray-800 ring-1 ring-gray-900/10">
          {/* Dynamic Island / Speaker */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-4 bg-black rounded-full z-30 flex items-center justify-end pr-3">
            <div className="w-2.5 h-2.5 bg-gray-900 rounded-full border border-gray-800" />
          </div>

          {/* Screen Content */}
          <div
            className="w-full h-[580px] rounded-[36px] overflow-y-auto p-4 pt-10 text-center space-y-5 select-none relative shadow-inner"
            style={{
              backgroundColor: customColors.bg || '#fffcfd',
              fontFamily: activeFontFamily,
              color: customColors.text || '#111827'
            }}
          >
            {/* Sections rendering */}
            {sections.filter(sec => {
                if (selectedPlan === 'basic') {
                  return ['portada', 'contador', 'pregunta', 'galeria', 'corazones'].includes(sec.type);
                }
                return true;
              }).map((sec) => {
              if (sec.type === 'portada') {
                return (
                  <div key={sec.id} className="space-y-2 py-4 border-b border-gray-100">
                    <span className="text-[10px] uppercase tracking-widest text-[#a21232] font-bold block">
                      Para Ti Con Todo Mi Amor
                    </span>
                    <h1 className="text-2xl font-bold font-serif leading-tight" style={{ color: customColors.primary }}>
                      {title || 'Para el Amor de Mi Vida'}
                    </h1>
                    <p className="text-[11px] text-gray-500 italic">
                      De parte de: <strong className="text-gray-800">{userName || 'Tu Amor'}</strong>
                    </p>
                  </div>
                );
              }

              if (sec.type === 'contador') {
                return (
                  <div key={sec.id} className="rounded-2xl p-4 bg-white/80 border border-rose-100 shadow-xs space-y-2">
                    <span className="text-[9px] uppercase tracking-wider text-rose-500 font-bold block">
                      ⏱️ Tiempo Juntos
                    </span>
                    <div className="grid grid-cols-4 gap-1.5 text-center font-mono">
                      <div className="bg-rose-50/70 p-1.5 rounded-lg">
                        <span className="block text-sm font-bold text-[#a21232]">{timeElapsed.years}</span>
                        <span className="text-[7px] text-gray-500">Años</span>
                      </div>
                      <div className="bg-rose-50/70 p-1.5 rounded-lg">
                        <span className="block text-sm font-bold text-[#a21232]">{timeElapsed.days}</span>
                        <span className="text-[7px] text-gray-500">Días</span>
                      </div>
                      <div className="bg-rose-50/70 p-1.5 rounded-lg">
                        <span className="block text-sm font-bold text-[#a21232]">{timeElapsed.hours}</span>
                        <span className="text-[7px] text-gray-500">Horas</span>
                      </div>
                      <div className="bg-rose-50/70 p-1.5 rounded-lg">
                        <span className="block text-sm font-bold text-[#a21232]">{timeElapsed.minutes}</span>
                        <span className="text-[7px] text-gray-500">Min</span>
                      </div>
                    </div>
                  </div>
                );
              }

              if (sec.type === 'carta') {
                return (
                  <div key={sec.id} className="bg-amber-50/50 rounded-2xl p-4 border border-amber-100/80 text-left space-y-2 shadow-xs">
                    <h3 className="text-xs font-bold text-amber-900 font-serif">💌 Carta de Amor</h3>
                    <p className="text-[10px] text-gray-700 font-serif leading-relaxed italic whitespace-pre-wrap">
                      {historyText}
                    </p>
                  </div>
                );
              }

              if (sec.type === 'galeria') {
                return (
                  <div key={sec.id} className="space-y-2 py-2">
                    <h3 className="text-xs font-bold text-gray-800 font-serif">📸 Nuestros Recuerdos</h3>
                    <PhotoGallery
                      photos={photos.map(p => ({ url: p.previewUrl, caption: p.caption }))}
                      style={photoStyle}
                      secondaryStyle={enableDualPhotoStyle ? secondaryPhotoStyle : null}
                      primaryColor={customColors.primary}
                    />
                  </div>
                );
              }

              if (sec.type === 'timeline') {
                return (
                  <div key={sec.id} className="bg-white/90 rounded-2xl p-4 border border-rose-100 shadow-xs text-left space-y-3">
                    <h3 className="text-xs font-bold text-[#a21232] font-serif">✨ Línea de Tiempo</h3>
                    <div className="space-y-3">
                      {milestones.map((m, mIdx) => (
                        <div key={mIdx} className="border-l-2 border-[#a21232] pl-3 py-1 space-y-1">
                          <span className="text-[8px] font-bold text-gray-400 font-mono">{m.date}</span>
                          <h4 className="text-[11px] font-bold text-gray-900">{m.title}</h4>
                          <p className="text-[9px] text-gray-600 font-light">{m.description}</p>
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

              if (sec.type === 'pregunta') {
                return (
                  <div key={sec.id} className="bg-rose-50/70 rounded-2xl p-4 border border-rose-200 text-center space-y-2">
                    <p className="text-xs font-bold text-gray-900 font-serif">{proposalQuestion}</p>
                    <div className="flex justify-center gap-2 pt-1">
                      <button type="button" className="px-4 py-1.5 bg-[#a21232] text-white font-bold rounded-full text-[10px] shadow-xs">
                        ¡Sí, Acepto! ❤️
                      </button>
                    </div>
                  </div>
                );
              }

              if (sec.type === 'corazones') {
                return (
                  <div key={sec.id} className="rounded-2xl p-5 bg-gradient-to-b from-[#400d18] to-[#1a0006] text-white text-center shadow-lg border border-rose-900/40 space-y-3">
                    <div className="w-10 h-10 bg-rose-500/10 border border-rose-500/50 rounded-full flex items-center justify-center mx-auto shadow-[0_0_15px_rgba(244,63,94,0.4)]">
                      <Heart className="w-6 h-6 text-rose-500 fill-rose-500 animate-pulse" />
                    </div>
                    <span className="text-[8px] uppercase tracking-widest text-rose-300 font-bold block">
                      💖 Dedicatoria Final
                    </span>
                    <p className="font-serif italic text-[11px] leading-relaxed text-rose-100 whitespace-pre-wrap px-2">
                      &quot;{message || 'Hoy celebramos cada segundo juntos y todo lo maravilloso que está por venir.'}&quot;
                    </p>
                  </div>
                );
              }

              return null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
