'use client';

import React, { useState, useEffect } from 'react';
import { useAdminStore } from '@/lib/store';
import { updateSiteSettings, SiteSettings, Coupon, getCoupons, createCoupon, deleteCoupon, toggleCoupon } from '@/lib/db';
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
  Share2,
  MessageCircle,
  Ticket,
  Percent,
  Trash2,
  Plus
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSettingsPanel() {
  const { settings, setSettings, updateSettingsLocal } = useAdminStore();
  const [formData, setFormData] = useState<SiteSettings>(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'contact' | 'coupons' | 'legal'>('contact');
  const [couponsList, setCouponsList] = useState<Coupon[]>([]);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState<'percent' | 'fixed'>('percent');
  const [newCouponDiscount, setNewCouponDiscount] = useState(15);
  const [newCouponMaxUses, setNewCouponMaxUses] = useState<number | ''>('');

  useEffect(() => {
    setFormData(settings);
    getCoupons().then(setCouponsList).catch(console.error);
  }, [settings]);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) {
      toast.error('Ingresa un código de cupón');
      return;
    }
    const maxUsesVal = newCouponMaxUses !== '' && Number(newCouponMaxUses) > 0 ? Number(newCouponMaxUses) : null;
    const created = await createCoupon(newCouponCode, newCouponType, newCouponDiscount, maxUsesVal);
    setCouponsList(prev => [created, ...prev.filter(c => c.code !== created.code)]);
    setNewCouponCode('');
    setNewCouponMaxUses('');
    const label = created.discount_type === 'percent' ? `-${created.discount_value}%` : `-$${created.discount_value.toLocaleString('es-CL')} CLP`;
    const cuposInfo = created.max_uses ? ` • Límite de ${created.max_uses} cupos` : ' • Usos ilimitados';
    toast.success(`¡Cupón ${created.code} (${label}${cuposInfo}) creado con éxito!`);
  };

  const handleToggleCoupon = async (id: string) => {
    await toggleCoupon(id);
    setCouponsList(prev => prev.map(c => c.id === id ? { ...c, is_active: !c.is_active } : c));
    toast.success('Estado del cupón actualizado');
  };

  const handleDeleteCoupon = async (id: string) => {
    await deleteCoupon(id);
    setCouponsList(prev => prev.filter(c => c.id !== id));
    toast.success('Cupón eliminado');
  };

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
          <span>Contacto y Redes</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('coupons')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            activeSubTab === 'coupons'
              ? 'bg-[#a21232] text-white shadow-xs'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Ticket className="w-3.5 h-3.5" />
          <span>Cupones de Descuento (%)</span>
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
          {/* Card: WhatsApp de Atención y Ventas ("¿Dudas? Escríbenos") */}
          <div className="bg-white rounded-2xl p-6 border-2 border-emerald-100 shadow-sm space-y-4 md:col-span-2 bg-gradient-to-br from-emerald-50/20 to-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-100 pb-3">
              <h3 className="font-serif font-bold text-sm text-gray-900 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                <span>WhatsApp de Atención y Ventas («¿Dudas? Escríbenos»)</span>
              </h3>
              <span className="text-[10px] text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full font-bold self-start sm:self-auto">
                🟢 Conectado al Botón Flotante y Footer
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">
                  Número de Teléfono / WhatsApp (con código de país) *
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={formData.support_phone}
                    onChange={(e) => {
                      const newPhone = e.target.value;
                      const cleanDigits = newPhone.replace(/\D/g, '');
                      setFormData({ 
                        ...formData, 
                        support_phone: newPhone,
                        whatsapp_url: cleanDigits ? `https://wa.me/${cleanDigits}` : ''
                      });
                    }}
                    placeholder="+56 9 4430 2556"
                    className="w-full pl-9 pr-3.5 py-2.5 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-emerald-600 font-medium"
                  />
                </div>
                <p className="text-[9px] text-gray-500 mt-1">Ej: +56 9 4430 2556 o +56 9 1234 5678</p>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">
                  Mensaje Predeterminado cuando el Cliente Hace Clic *
                </label>
                <textarea
                  rows={2}
                  value={formData.whatsapp_message || ''}
                  onChange={(e) => setFormData({ ...formData, whatsapp_message: e.target.value })}
                  placeholder="¡Hola! ❤️ Vengo de RecuerdoQR y tengo una consulta sobre cómo crear mi recuerdo."
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-emerald-600 resize-none text-gray-800"
                />
              </div>
            </div>

            {/* Live Preview Button */}
            {formData.support_phone && (
              <div className="pt-2 border-t border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-[11px] text-gray-600 font-mono truncate max-w-md">
                  <strong>Enlace generado:</strong> https://wa.me/{formData.support_phone.replace(/\D/g, '')}?text=...
                </div>
                <a
                  href={`https://wa.me/${formData.support_phone.replace(/\D/g, '')}?text=${encodeURIComponent(formData.whatsapp_message || '¡Hola! ❤️ Vengo de RecuerdoQR.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs shrink-0 self-start sm:self-auto"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-white" />
                  <span>Probar Enlace de WhatsApp</span>
                </a>
              </div>
            )}
          </div>

          {/* Card: Datos de Contacto */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-sm text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2.5">
              <Mail className="w-4 h-4 text-[#a21232]" />
              <span>Correo y Ubicación (Visibles en el Footer)</span>
            </h3>

            <div>
              <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                Correo Electrónico de Soporte
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
                Ubicación / Ciudad
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={formData.support_address}
                  onChange={(e) => setFormData({ ...formData, support_address: e.target.value })}
                  placeholder="Viña del Mar, Chile"
                  className="w-full pl-9 pr-3.5 py-2 border border-gray-250 rounded-xl text-xs focus:outline-none focus:border-[#a21232]"
                />
              </div>
            </div>
          </div>

          {/* Card: Enlaces y Redes */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-sm text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2.5">
              <Share2 className="w-4 h-4 text-[#a21232]" />
              <span>Redes Sociales</span>
            </h3>

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

      {/* Tab: Cupones de Descuento */}
      {activeSubTab === 'coupons' && (
        <div className="space-y-6 animate-fade-in">
          {/* Form: Crear Nuevo Cupón */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-sm text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2.5">
              <Ticket className="w-4 h-4 text-[#a21232]" />
              <span>Crear Nuevo Cupón de Descuento</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              {/* Código */}
              <div className="sm:col-span-3">
                <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">
                  Código del Cupón *
                </label>
                <div className="relative">
                  <Ticket className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value.toUpperCase().replace(/\s+/g, ''))}
                    placeholder="Ej: PROMO30"
                    className="w-full pl-9 pr-3.5 py-2.5 border border-gray-300 rounded-xl text-xs font-mono uppercase font-bold text-gray-900 focus:outline-none focus:border-[#a21232]"
                  />
                </div>
              </div>

              {/* Tipo de Descuento: Porcentaje vs Monto Fijo */}
              <div className="sm:col-span-3">
                <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">
                  Tipo de Descuento *
                </label>
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-gray-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setNewCouponType('percent');
                      setNewCouponDiscount(15);
                    }}
                    className={`py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                      newCouponType === 'percent'
                        ? 'bg-[#a21232] text-white shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <span>% Porc.</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNewCouponType('fixed');
                      setNewCouponDiscount(2000);
                    }}
                    className={`py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                      newCouponType === 'fixed'
                        ? 'bg-[#a21232] text-white shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <span>$ Fijo</span>
                  </button>
                </div>
              </div>

              {/* Valor del Descuento */}
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">
                  {newCouponType === 'percent' ? 'Valor (% Descuento)' : 'Monto ($ CLP)'} *
                </label>
                <div className="relative">
                  {newCouponType === 'percent' ? (
                    <Percent className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-3" />
                  ) : (
                    <span className="text-gray-400 absolute left-2.5 top-2.5 text-xs font-bold">$</span>
                  )}
                  <input
                    type="number"
                    min={1}
                    max={newCouponType === 'percent' ? 100 : 50000}
                    step={newCouponType === 'percent' ? 1 : 100}
                    value={newCouponDiscount}
                    onChange={(e) => setNewCouponDiscount(Number(e.target.value))}
                    className="w-full pl-7 pr-2 py-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-[#a21232]"
                  />
                </div>
              </div>

              {/* Cupos Máximos */}
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1" title="Vacío = ilimitado">
                  Cupos (Opcional)
                </label>
                <input
                  type="number"
                  min={1}
                  max={10000}
                  placeholder="Ilimitado"
                  value={newCouponMaxUses}
                  onChange={(e) => setNewCouponMaxUses(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-[#a21232]"
                />
              </div>

              {/* Botón Crear */}
              <div className="sm:col-span-2">
                <button
                  type="button"
                  onClick={handleCreateCoupon}
                  className="w-full py-2.5 bg-[#a21232] hover:bg-[#880e28] text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                >
                  <Plus className="w-4 h-4" />
                  <span>Crear Cupón</span>
                </button>
              </div>
            </div>
          </div>

          {/* List: Cupones Activos */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
              <h3 className="font-serif font-bold text-sm text-gray-900 flex items-center gap-2">
                <span>Cupones Registrados en la Tienda</span>
              </h3>
              <span className="text-[10px] bg-rose-50 text-[#a21232] border border-rose-200 px-2.5 py-0.5 rounded-full font-bold">
                {couponsList.length} cupones
              </span>
            </div>

            {couponsList.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-6">No hay cupones creados aún. ¡Crea el primero arriba!</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {couponsList.map((c) => {
                  const used = c.used_count || 0;
                  const isExhausted = c.max_uses !== null && c.max_uses !== undefined && c.max_uses > 0 && used >= c.max_uses;

                  return (
                    <div 
                      key={c.id} 
                      className={`p-4 rounded-2xl border transition flex items-start justify-between gap-3 ${
                        isExhausted
                          ? 'bg-gray-50 border-gray-300 opacity-75'
                          : c.is_active 
                          ? 'bg-rose-50/30 border-rose-200 shadow-2xs' 
                          : 'bg-amber-50/30 border-amber-200 opacity-85'
                      }`}
                    >
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-black text-sm text-gray-900 tracking-wider">
                            {c.code}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-[#a21232] text-white rounded-md whitespace-nowrap">
                            {c.discount_type === 'percent' ? `-${c.discount_value}% OFF` : `-$${c.discount_value.toLocaleString('es-CL')} CLP`}
                          </span>
                        </div>

                        {/* Cupos badge */}
                        <div className="flex items-center gap-1 text-[10px]">
                          {c.max_uses && c.max_uses > 0 ? (
                            isExhausted ? (
                              <span className="font-bold text-red-700 bg-red-100 border border-red-200 px-2 py-0.5 rounded-md">
                                🔴 Agotado ({used}/{c.max_uses} canjeados)
                              </span>
                            ) : (
                              <span className="font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                                🎯 Quedan {c.max_uses - used} de {c.max_uses} cupos ({used} usados)
                              </span>
                            )
                          ) : (
                            <span className="text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md font-medium">
                              ♾️ Usos ilimitados ({used} canjeados)
                            </span>
                          )}
                        </div>

                        <p className="text-[10px] font-light">
                          {isExhausted ? (
                            <span className="text-red-600 font-bold">🔴 Desactivado automáticamente (Sin cupos)</span>
                          ) : c.is_active ? (
                            <span className="text-emerald-600 font-bold">🟢 Activo en el checkout</span>
                          ) : (
                            <span className="text-amber-700 font-bold">🟡 Pausado manualmente</span>
                          )}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleToggleCoupon(c.id)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                            c.is_active
                              ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                              : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          }`}
                        >
                          {c.is_active ? 'Pausar' : 'Activar'}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteCoupon(c.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition cursor-pointer"
                          title="Eliminar cupón"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
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
