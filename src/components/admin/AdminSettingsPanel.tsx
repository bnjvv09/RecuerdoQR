'use client';

import React, { useState, useEffect } from 'react';
import { useAdminStore } from '@/lib/store';
import { updateSiteSettings, SiteSettings } from '@/lib/db';
import { 
  Settings, 
  Mail, 
  Phone, 
  MapPin, 
  Save, 
  RefreshCw, 
  HelpCircle, 
  FileText, 
  Shield, 
  Heart,
  Share2
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSettingsPanel() {
  const { settings, setSettings, updateSettingsLocal } = useAdminStore();
  const [formData, setFormData] = useState<SiteSettings>(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'contact' | 'legal'>('contact');

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updated = await updateSiteSettings(formData);
      setSettings(updated);
      updateSettingsLocal(updated);
      toast.success('Configuracion y textos guardados exitosamente');
    } catch (err) {
      console.error(err);
      toast.error('Error al guardar la configuracion');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header Info */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-lg font-bold text-gray-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#a21232]" />
            <span>Configuracion de Tienda, Contacto y Textos Legales</span>
          </h2>
          <p className="text-xs text-gray-500 font-light mt-1">
            Modifica la informacion de contacto del Footer, redes sociales y el contenido de preguntas frecuentes y garantias.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="px-5 py-2.5 bg-gradient-to-r from-rose-600 to-[#a21232] hover:from-rose-700 hover:to-[#880e28] text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Guardar Todo</span>
        </button>
      </div>

      {/* Sub Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveSubTab('contact')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            activeSubTab === 'contact'
              ? 'bg-[#a21232] text-white shadow-xs'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Contacto y Redes Sociales</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('legal')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            activeSubTab === 'legal'
              ? 'bg-[#a21232] text-white shadow-xs'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Soporte, FAQ y Textos Legales</span>
        </button>
      </div>

      {/* Tab: Contact & Social */}
      {activeSubTab === 'contact' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          {/* Card: Datos de Contacto */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-sm text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2.5">
              <Mail className="w-4 h-4 text-[#a21232]" />
              <span>Datos de Contacto (Visibles en el Footer)</span>
            </h3>

            <div>
              <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                Correo Electronico de Soporte
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={formData.support_email}
                  onChange={(e) => setFormData({ ...formData, support_email: e.target.value })}
                  placeholder="soporte@recuerdoqr.cl"
                  className="w-full pl-9 pr-3.5 py-2 border border-gray-250 rounded-xl text-xs focus:outline-none focus:border-[#a21232]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                Telefono / WhatsApp de Atencion
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={formData.support_phone}
                  onChange={(e) => setFormData({ ...formData, support_phone: e.target.value })}
                  placeholder="+56 9 1234 5678"
                  className="w-full pl-9 pr-3.5 py-2 border border-gray-250 rounded-xl text-xs focus:outline-none focus:border-[#a21232]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                Ubicacion / Ciudad
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={formData.support_address}
                  onChange={(e) => setFormData({ ...formData, support_address: e.target.value })}
                  placeholder="Santiago, Region Metropolitana, Chile"
                  className="w-full pl-9 pr-3.5 py-2 border border-gray-250 rounded-xl text-xs focus:outline-none focus:border-[#a21232]"
                />
              </div>
            </div>
          </div>

          {/* Card: Enlaces y Redes */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-sm text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2.5">
              <Share2 className="w-4 h-4 text-[#a21232]" />
              <span>Redes Sociales y WhatsApp Directo</span>
            </h3>

            <div>
              <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                Enlace Directo a WhatsApp (wa.me)
              </label>
              <input
                type="text"
                value={formData.whatsapp_url || ''}
                onChange={(e) => setFormData({ ...formData, whatsapp_url: e.target.value })}
                placeholder="https://wa.me/56912345678"
                className="w-full px-3.5 py-2 border border-gray-250 rounded-xl text-xs focus:outline-none focus:border-[#a21232]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                Enlace a Instagram
              </label>
              <input
                type="text"
                value={formData.instagram_url || ''}
                onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                placeholder="https://instagram.com/recuerdoqr"
                className="w-full px-3.5 py-2 border border-gray-250 rounded-xl text-xs focus:outline-none focus:border-[#a21232]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                Enlace a TikTok
              </label>
              <input
                type="text"
                value={formData.tiktok_url || ''}
                onChange={(e) => setFormData({ ...formData, tiktok_url: e.target.value })}
                placeholder="https://tiktok.com/@recuerdoqr"
                className="w-full px-3.5 py-2 border border-gray-250 rounded-xl text-xs focus:outline-none focus:border-[#a21232]"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab: Legal, FAQ & Modals */}
      {activeSubTab === 'legal' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          {/* FAQ */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-2">
            <h3 className="font-serif font-bold text-sm text-gray-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-rose-600" />
              <span>Preguntas Frecuentes (FAQ)</span>
            </h3>
            <p className="text-[10px] text-gray-400">Texto que aparece al hacer clic en Preguntas Frecuentes.</p>
            <textarea
              rows={6}
              value={formData.faq_content || ''}
              onChange={(e) => setFormData({ ...formData, faq_content: e.target.value })}
              className="w-full p-3 border border-gray-250 rounded-xl text-xs focus:outline-none focus:border-[#a21232] font-mono"
            />
          </div>

          {/* Garantia de Amor */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-2">
            <h3 className="font-serif font-bold text-sm text-gray-900 flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-600" />
              <span>Garantia de Amor</span>
            </h3>
            <p className="text-[10px] text-gray-400">Texto que aparece al hacer clic en Garantia de Amor.</p>
            <textarea
              rows={6}
              value={formData.guarantee_content || ''}
              onChange={(e) => setFormData({ ...formData, guarantee_content: e.target.value })}
              className="w-full p-3 border border-gray-250 rounded-xl text-xs focus:outline-none focus:border-[#a21232] font-mono"
            />
          </div>

          {/* Terminos de Servicio */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-2">
            <h3 className="font-serif font-bold text-sm text-gray-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-rose-600" />
              <span>Terminos de Servicio</span>
            </h3>
            <p className="text-[10px] text-gray-400">Texto legal de terminos y condiciones.</p>
            <textarea
              rows={6}
              value={formData.terms_content || ''}
              onChange={(e) => setFormData({ ...formData, terms_content: e.target.value })}
              className="w-full p-3 border border-gray-250 rounded-xl text-xs focus:outline-none focus:border-[#a21232] font-mono"
            />
          </div>

          {/* Politicas de Privacidad */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-2">
            <h3 className="font-serif font-bold text-sm text-gray-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-rose-600" />
              <span>Politicas de Privacidad</span>
            </h3>
            <p className="text-[10px] text-gray-400">Texto de tratamiento de datos y privacidad.</p>
            <textarea
              rows={6}
              value={formData.privacy_content || ''}
              onChange={(e) => setFormData({ ...formData, privacy_content: e.target.value })}
              className="w-full p-3 border border-gray-250 rounded-xl text-xs focus:outline-none focus:border-[#a21232] font-mono"
            />
          </div>
        </div>
      )}
    </form>
  );
}
