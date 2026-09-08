'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { getSiteSettings, DEFAULT_SETTINGS } from '@/lib/db';

export default function WhatsAppFloatingButton() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    getSiteSettings().then(setSettings).catch(console.error);
  }, []);

  const rawPhone = settings.support_phone ? settings.support_phone.replace(/\D/g, '') : '56912345678';
  const customMessage = settings.whatsapp_message || '¡Hola! ❤️ Vengo de RecuerdoQR y tengo una consulta sobre cómo crear mi experiencia.';
  const whatsappUrl = `https://wa.me/${rawPhone}?text=${encodeURIComponent(customMessage)}`;

  return (
    <aside aria-label="Contacto de soporte" className="fixed bottom-5 left-4 sm:left-6 z-40">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        className="flex items-center gap-2 px-3.5 py-2.5 bg-[#25d366] hover:bg-[#20bd5a] text-white rounded-full shadow-xl shadow-emerald-950/20 hover:scale-105 active:scale-95 transition-all duration-200 font-bold text-xs group border-2 border-white/80 cursor-pointer"
      >
        <MessageCircle className="w-4 h-4 fill-white" />
        <span className="inline font-bold tracking-tight">¿Dudas? WhatsApp</span>
      </a>
    </aside>
  );
}
