'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Heart, 
  QrCode, 
  Mail, 
  Phone, 
  MapPin, 
  X, 
  HelpCircle, 
  Shield, 
  FileText, 
  Sparkles,
  MessageCircle
} from 'lucide-react';
import { getSiteSettings, SiteSettings, DEFAULT_SETTINGS } from '@/lib/db';

export default function Footer() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [legalModal, setLegalModal] = useState<{ title: string; content: string; icon: React.ReactNode } | null>(null);

  useEffect(() => {
    getSiteSettings().then(setSettings).catch(console.error);
  }, []);

  const openModal = (title: string, content: string | undefined, icon: React.ReactNode) => {
    if (!content) return;
    setLegalModal({ title, content, icon });
  };

  return (
    <footer className="bg-gray-950 text-gray-400 border-t border-gray-900 pt-16 pb-8 text-left">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-12">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center">
                <QrCode className="w-4 h-4 text-white" />
              </div>
              <span className="font-serif text-lg font-bold tracking-tight text-white flex items-center gap-1">
                Recuerdo<span className="text-rose-500 font-sans">QR</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 font-light leading-relaxed">
              Transformamos tus momentos más bellos en un recuerdo digital interactivo para siempre. El regalo perfecto.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-rose-500 font-medium">
              Hecho con <Heart className="w-3.5 h-3.5 fill-current animate-pulse" /> en Chile
            </div>
          </div>

          {/* Links: Explorer */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase font-serif">Explorar</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-rose-400 transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/planes" className="hover:text-rose-400 transition-colors">
                  Planes y Precios
                </Link>
              </li>
              <li>
                <Link href="/ejemplos" className="hover:text-rose-400 transition-colors">
                  Ejemplos Reales
                </Link>
              </li>
              <li>
                <Link href="/personalizar" className="hover:text-rose-400 transition-colors">
                  Personalizar QR
                </Link>
              </li>
            </ul>
          </div>

          {/* Links: Legal & FAQ */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase font-serif">Soporte y Legal</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => openModal('Preguntas Frecuentes', settings.faq_content, <HelpCircle className="w-5 h-5 text-rose-500" />)}
                  className="hover:text-rose-400 transition-colors text-left cursor-pointer"
                >
                  Preguntas Frecuentes
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openModal('Términos de Servicio', settings.terms_content, <FileText className="w-5 h-5 text-rose-500" />)}
                  className="hover:text-rose-400 transition-colors text-left cursor-pointer"
                >
                  Términos de Servicio
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openModal('Políticas de Privacidad', settings.privacy_content, <Shield className="w-5 h-5 text-rose-500" />)}
                  className="hover:text-rose-400 transition-colors text-left cursor-pointer"
                >
                  Políticas de Privacidad
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openModal('Garantía de Amor 100%', settings.guarantee_content, <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />)}
                  className="hover:text-rose-400 transition-colors text-left cursor-pointer text-rose-400 font-medium flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Garantía de Amor</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Contact info */}
          <div className="space-y-3.5">
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase font-serif">Contacto</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <a href={`mailto:${settings.support_email}`} className="hover:text-rose-400 transition-colors">
                  {settings.support_email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <a 
                  href={settings.whatsapp_url ? `${settings.whatsapp_url}?text=${encodeURIComponent(settings.whatsapp_message || '¡Hola! ❤️ Vengo de RecuerdoQR.')}` : `https://wa.me/${settings.support_phone.replace(/\D/g, '')}?text=${encodeURIComponent(settings.whatsapp_message || '¡Hola! ❤️ Vengo de RecuerdoQR.')}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-rose-400 transition-colors flex items-center gap-1.5"
                >
                  <span>{settings.support_phone}</span>
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span className="text-gray-500 font-light">{settings.support_address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 font-light">
          <p>© {new Date().getFullYear()} RecuerdoQR. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1.5">
            Página diseñada por{' '}
            <a 
              href="https://b9studio.vercel.app" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-rose-400 hover:text-rose-300 font-medium transition-colors underline decoration-rose-400/40 hover:decoration-rose-300"
            >
              @Bnjvv09
            </a>
          </p>
        </div>
      </div>

      {/* Legal / FAQ Modal Dialog */}
      {legalModal && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setLegalModal(null)}
        >
          <div 
            className="bg-white text-gray-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-rose-100 max-h-[85vh] overflow-y-auto relative animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLegalModal(null)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-4">
              <div className="p-2.5 bg-rose-50 rounded-2xl">
                {legalModal.icon}
              </div>
              <h3 className="font-serif text-lg font-bold text-gray-900">
                {legalModal.title}
              </h3>
            </div>

            <div className="text-xs sm:text-sm text-gray-600 leading-relaxed font-light whitespace-pre-line space-y-3">
              {legalModal.content}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setLegalModal(null)}
                className="px-5 py-2 bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
