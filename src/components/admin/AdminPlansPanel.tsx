'use client';

import React, { useState, useEffect } from 'react';
import { useAdminStore } from '@/lib/store';
import { updateProduct, Product, getPlanPromos, updatePlanPromo, PlanPromosMap, PlanPromoConfig } from '@/lib/db';
import { 
  DollarSign, 
  Save, 
  Plus, 
  Trash2, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Tag, 
  FileText,
  RefreshCw,
  Flame,
  Zap,
  Check,
  X
} from 'lucide-react';
import { toast } from 'sonner';

interface PromoCardState {
  isActive: boolean;
  promoPrice: number;
  regularPrice: number;
  totalSlots: number;
  usedSlots: number;
}

export default function AdminPlansPanel() {
  const { products, setProducts, updateProductLocal } = useAdminStore();
  const [editingPlan, setEditingPlan] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [newFeatureText, setNewFeatureText] = useState('');

  // Promos para los 3 planes
  const [promos, setPromos] = useState<Record<string, PromoCardState>>({
    basic: { isActive: false, promoPrice: 3990, regularPrice: 4990, totalSlots: 10, usedSlots: 0 },
    medium: { isActive: false, promoPrice: 5990, regularPrice: 6990, totalSlots: 10, usedSlots: 0 },
    premium: { isActive: true, promoPrice: 6990, regularPrice: 7990, totalSlots: 10, usedSlots: 0 },
  });
  const [savingPlanId, setSavingPlanId] = useState<string | null>(null);

  const loadPromos = async () => {
    try {
      const data = await getPlanPromos();
      const next: Record<string, PromoCardState> = {};
      ['basic', 'medium', 'premium'].forEach(pid => {
        const p = data[pid];
        if (p) {
          next[pid] = {
            isActive: p.isActive,
            promoPrice: p.promoPrice,
            regularPrice: p.regularPrice,
            totalSlots: p.totalSlots,
            usedSlots: p.usedSlots,
          };
        }
      });
      setPromos(prev => ({ ...prev, ...next }));
    } catch (err) {
      console.error('Error fetching plan promos:', err);
    }
  };

  useEffect(() => {
    loadPromos();
  }, []);

  const handleUpdateField = (planId: string, field: keyof PromoCardState, val: any) => {
    setPromos(prev => ({
      ...prev,
      [planId]: {
        ...prev[planId],
        [field]: val
      }
    }));
  };

  const handleTogglePromo = (planId: string) => {
    setPromos(prev => ({
      ...prev,
      [planId]: {
        ...prev[planId],
        isActive: !prev[planId].isActive
      }
    }));
  };

  const handleSavePlanPromo = async (planId: string, planName: string) => {
    const item = promos[planId];
    if (!item) return;
    setSavingPlanId(planId);
    try {
      const ok = await updatePlanPromo(planId, {
        isActive: item.isActive,
        promoPrice: item.promoPrice,
        regularPrice: item.regularPrice,
        totalSlots: item.totalSlots,
        usedSlots: item.usedSlots,
      });
      if (ok) {
        await loadPromos();
        // Sincronizar en store local si se cambió el precio normal
        const prod = products.find(p => p.id === planId);
        if (prod && item.regularPrice && prod.price !== item.regularPrice) {
          updateProductLocal({ ...prod, price: item.regularPrice });
        }
        toast.success(`¡Oferta para ${planName} guardada y activada con éxito! 🔥`);
      } else {
        toast.error(`Error al guardar la oferta para ${planName}`);
      }
    } catch {
      toast.error('Error al guardar la oferta');
    } finally {
      setSavingPlanId(null);
    }
  };

  const handleResetSlots = async (planId: string, planName: string) => {
    const item = promos[planId];
    if (!item) return;
    if (!confirm(`¿Deseas reiniciar los cupos vendidos a 0 para el ${planName}?`)) return;
    setSavingPlanId(planId);
    try {
      const ok = await updatePlanPromo(planId, {
        isActive: true,
        promoPrice: item.promoPrice,
        regularPrice: item.regularPrice,
        totalSlots: item.totalSlots,
        usedSlots: 0,
      });
      if (ok) {
        setPromos(prev => ({
          ...prev,
          [planId]: { ...prev[planId], usedSlots: 0, isActive: true }
        }));
        await loadPromos();
        toast.success(`Cupos para ${planName} reiniciados a 0`);
      }
    } finally {
      setSavingPlanId(null);
    }
  };

  const handleSelectPlan = (plan: Product) => {
    setEditingPlan(JSON.parse(JSON.stringify(plan)));
    setNewFeatureText('');
  };

  const handleFeatureChange = (index: number, val: string) => {
    if (!editingPlan) return;
    const updatedFeatures = [...editingPlan.features];
    updatedFeatures[index] = val;
    setEditingPlan({ ...editingPlan, features: updatedFeatures });
  };

  const handleRemoveFeature = (index: number) => {
    if (!editingPlan) return;
    const updatedFeatures = editingPlan.features.filter((_, i) => i !== index);
    setEditingPlan({ ...editingPlan, features: updatedFeatures });
  };

  const handleAddFeature = () => {
    if (!editingPlan || !newFeatureText.trim()) return;
    setEditingPlan({
      ...editingPlan,
      features: [...editingPlan.features, newFeatureText.trim()]
    });
    setNewFeatureText('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;

    setIsSaving(true);
    try {
      const ok = await updateProduct(editingPlan);
      if (ok) {
        updateProductLocal(editingPlan);
        toast.success(`Plan "${editingPlan.name}" guardado y actualizado con éxito`);
      } else {
        toast.error('Error al guardar el plan');
      }
    } catch (err) {
      console.error(err);
      toast.error('Ocurrió un error inesperado');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header Info */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-lg font-bold text-gray-900 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-[#a21232]" />
            <span>Gestor de Planes y Precios</span>
          </h2>
          <p className="text-xs text-gray-500 font-light mt-1">
            Modifica los precios, subtítulos, descripciones y lista de beneficios que se muestran a los clientes.
          </p>
        </div>
      </div>

      {/* SECCIÓN GESTIÓN DE OFERTAS DE LANZAMIENTO INDEPENDIENTES */}
      <div className="bg-gradient-to-br from-amber-500/10 via-rose-500/5 to-amber-500/10 rounded-3xl p-6 border-2 border-amber-400/60 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200/60 pb-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="p-1.5 bg-amber-100 rounded-xl text-amber-800">
                <Flame className="w-5 h-5 fill-amber-500 text-amber-600" />
              </span>
              <h3 className="font-serif font-bold text-lg text-gray-950">
                Ofertas de Lanzamiento por Plan (Sin Cupones)
              </h3>
            </div>
            <p className="text-xs text-gray-600 font-light max-w-2xl">
              Activa promociones de estreno independientes para cualquier plan (Básico, Medio o Máximo) o combina varios a la vez. Puedes modificar el <strong>Precio Normal (Precio de Antes)</strong> y el <strong>Precio de Oferta</strong>. Cuando los cupos lleguen a 0 o desactives la oferta, la web <strong>elimina automáticamente</strong> los textos de oferta y muestra el plan limpio.
            </p>
          </div>
        </div>

        {/* 3 Tarjetas de Oferta Independientes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {[
            { id: 'basic', name: 'Plan Básico', tag: 'Esencial' },
            { id: 'medium', name: 'Plan Medio', tag: 'Más Popular' },
            { id: 'premium', name: 'Plan Máximo', tag: 'Completo VIP' },
          ].map((item) => {
            const p = promos[item.id] || { isActive: false, promoPrice: 4990, regularPrice: 4990, totalSlots: 10, usedSlots: 0 };
            const remaining = Math.max(0, p.totalSlots - p.usedSlots);
            const isLive = p.isActive && remaining > 0;
            const isSavingThis = savingPlanId === item.id;

            return (
              <div 
                key={item.id}
                className={`bg-white rounded-2xl p-5 border-2 transition-all flex flex-col justify-between gap-4 shadow-xs ${
                  isLive 
                    ? 'border-amber-400 ring-2 ring-amber-400/20 shadow-md' 
                    : 'border-gray-200 opacity-90'
                }`}
              >
                {/* Cabecera de la Tarjeta con Switch */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                        {item.tag}
                      </span>
                      <h4 className="font-serif font-bold text-base text-gray-900 mt-1">
                        {item.name}
                      </h4>
                    </div>

                    {/* Switch ON/OFF */}
                    <button
                      type="button"
                      onClick={() => handleTogglePromo(item.id)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold transition flex items-center gap-1.5 cursor-pointer shrink-0 shadow-2xs ${
                        p.isActive
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                      }`}
                      title={p.isActive ? 'Clic para desactivar oferta' : 'Clic para activar oferta'}
                    >
                      {p.isActive ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>OFERTA ON</span>
                        </>
                      ) : (
                        <>
                          <X className="w-3.5 h-3.5" />
                          <span>OFERTA OFF</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Estado en vivo */}
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
                    <span className={isLive ? 'text-emerald-700 font-bold' : 'text-gray-500'}>
                      {isLive ? `Activa en la web (${remaining} cupos rest.)` : (p.isActive ? 'Cupos agotados (Inactiva)' : 'Desactivada')}
                    </span>
                  </div>
                </div>

                {/* Campos de Edición: Precios y Cupos */}
                <div className="space-y-3 bg-gray-50/80 p-3 rounded-xl border border-gray-100 text-xs">
                  {/* Precio Normal (Precio de Antes) */}
                  <div>
                    <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wide block mb-1">
                      Precio Normal (Precio de Antes tachado)
                    </label>
                    <div className="flex items-center gap-1 bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 focus-within:border-amber-500">
                      <span className="text-gray-400 font-bold">$</span>
                      <input
                        type="number"
                        value={p.regularPrice}
                        onChange={(e) => handleUpdateField(item.id, 'regularPrice', Number(e.target.value))}
                        className="w-full font-bold text-gray-700 outline-none"
                        placeholder="Ej: 7990"
                      />
                      <span className="text-[10px] text-gray-400 font-medium">CLP</span>
                    </div>
                  </div>

                  {/* Precio de Oferta */}
                  <div>
                    <label className="text-[10px] font-bold text-amber-900 uppercase tracking-wide block mb-1">
                      Precio de Oferta (Lo que paga el cliente)
                    </label>
                    <div className="flex items-center gap-1 bg-white border border-amber-300 rounded-lg px-2.5 py-1.5 focus-within:border-amber-500 ring-1 ring-amber-400/20">
                      <span className="text-amber-600 font-extrabold">$</span>
                      <input
                        type="number"
                        value={p.promoPrice}
                        onChange={(e) => handleUpdateField(item.id, 'promoPrice', Number(e.target.value))}
                        className="w-full font-extrabold text-amber-950 outline-none"
                        placeholder="Ej: 6990"
                      />
                      <span className="text-[10px] text-amber-700 font-bold">CLP</span>
                    </div>
                  </div>

                  {/* Límite de Cupos */}
                  <div>
                    <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wide block mb-1">
                      Cupos Totales de Lanzamiento
                    </label>
                    <div className="flex items-center gap-1 bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 focus-within:border-amber-500">
                      <input
                        type="number"
                        value={p.totalSlots}
                        onChange={(e) => handleUpdateField(item.id, 'totalSlots', Number(e.target.value))}
                        className="w-full font-bold text-gray-800 outline-none"
                        placeholder="Ej: 10"
                      />
                      <span className="text-[10px] text-gray-400 font-medium">cupos</span>
                    </div>
                  </div>
                </div>

                {/* Contador de Ventas y Barra de Progreso */}
                <div className="space-y-1.5 bg-amber-50/50 p-2.5 rounded-xl border border-amber-200/50 text-[10px]">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-gray-700">Ventas Registradas:</span>
                    <span className="text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded-full font-extrabold">
                      {p.usedSlots} / {p.totalSlots} vendidos
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-rose-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(0, (p.usedSlots / Math.max(1, p.totalSlots)) * 100))}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-gray-500 pt-0.5">
                    <span>Quedan: <strong>{remaining} cupos</strong></span>
                    <button
                      type="button"
                      onClick={() => handleResetSlots(item.id, item.name)}
                      disabled={isSavingThis}
                      className="text-rose-600 hover:text-rose-700 font-bold hover:underline cursor-pointer flex items-center gap-1 disabled:opacity-50"
                    >
                      <RefreshCw className="w-2.5 h-2.5" />
                      <span>Reiniciar a 0</span>
                    </button>
                  </div>
                </div>

                {/* Botón Guardar Oferta de este Plan */}
                <button
                  type="button"
                  onClick={() => handleSavePlanPromo(item.id, item.name)}
                  disabled={isSavingThis}
                  className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSavingThis ? 'Guardando...' : `Guardar Oferta ${item.name}`}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid of 3 Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {products.map((plan) => {
          const isSelected = editingPlan?.id === plan.id;
          return (
            <div
              key={plan.id}
              onClick={() => handleSelectPlan(plan)}
              className={`cursor-pointer rounded-2xl p-5 border transition-all relative ${
                isSelected
                  ? 'border-[#a21232] bg-rose-50/20 shadow-md ring-2 ring-[#a21232]/20'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-xs'
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-2.5 right-4 bg-[#a21232] text-white text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full shadow-xs">
                  {plan.badge}
                </span>
              )}

              <div className="flex items-center justify-between mb-2">
                <h3 className="font-serif font-bold text-base text-gray-900">{plan.name}</h3>
                <span className="font-serif text-lg font-extrabold text-[#a21232]">
                  ${Number(plan.price).toLocaleString('es-CL')} <span className="text-[10px] font-sans font-normal text-gray-500">CLP</span>
                </span>
              </div>

              {plan.subtitle && (
                <p className="text-[11px] font-medium text-rose-700 mb-2">
                  {plan.subtitle}
                </p>
              )}

              <p className="text-xs text-gray-500 font-light line-clamp-2 mb-4">
                {plan.description}
              </p>

              <div className="space-y-1.5 border-t border-gray-100 pt-3">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Beneficios ({plan.features.length})
                </span>
                {plan.features.slice(0, 3).map((feat, idx) => (
                  <div key={idx} className="text-xs text-gray-600 flex items-center gap-1.5 truncate">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                    <span className="truncate">{feat}</span>
                  </div>
                ))}
                {plan.features.length > 3 && (
                  <span className="text-[10px] text-gray-400 font-medium">
                    +{plan.features.length - 3} más...
                  </span>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                <button
                  type="button"
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl transition ${
                    isSelected
                      ? 'bg-[#a21232] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {isSelected ? 'Editando este plan' : 'Editar Plan'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Plan Edit Form Modal/Section */}
      {editingPlan && (
        <form onSubmit={handleSave} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">
                Editando Plan
              </span>
              <h3 className="font-serif text-lg font-bold text-gray-900">
                {editingPlan.name} ({editingPlan.id})
              </h3>
            </div>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-gradient-to-r from-rose-600 to-[#a21232] hover:from-rose-700 hover:to-[#880e28] text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>Guardar Cambios</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Nombre */}
            <div>
              <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                Nombre del Plan
              </label>
              <input
                type="text"
                required
                value={editingPlan.name}
                onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                className="w-full px-3.5 py-2 border border-gray-250 rounded-xl text-xs focus:outline-none focus:border-[#a21232]"
              />
            </div>

            {/* Precio en CLP */}
            <div>
              <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                Precio (CLP)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs font-bold text-gray-400">$</span>
                <input
                  type="number"
                  required
                  min="0"
                  step="10"
                  value={editingPlan.price}
                  onChange={(e) => setEditingPlan({ ...editingPlan, price: Number(e.target.value) })}
                  className="w-full pl-6 pr-3.5 py-2 border border-gray-250 rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:border-[#a21232]"
                />
              </div>
            </div>

            {/* Subtítulo */}
            <div>
              <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                Subtítulo / Resumen
              </label>
              <input
                type="text"
                value={editingPlan.subtitle || ''}
                onChange={(e) => setEditingPlan({ ...editingPlan, subtitle: e.target.value })}
                placeholder="Ej. Hasta 10 Fotos • Polaroid"
                className="w-full px-3.5 py-2 border border-gray-250 rounded-xl text-xs focus:outline-none focus:border-[#a21232]"
              />
            </div>

            {/* Badge */}
            <div>
              <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                Etiqueta / Badge (Opcional)
              </label>
              <input
                type="text"
                value={editingPlan.badge || ''}
                onChange={(e) => setEditingPlan({ ...editingPlan, badge: e.target.value })}
                placeholder="Ej. Más Recomendado"
                className="w-full px-3.5 py-2 border border-gray-250 rounded-xl text-xs focus:outline-none focus:border-[#a21232]"
              />
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
              Descripción del Plan
            </label>
            <textarea
              rows={2}
              value={editingPlan.description}
              onChange={(e) => setEditingPlan({ ...editingPlan, description: e.target.value })}
              className="w-full px-3.5 py-2 border border-gray-250 rounded-xl text-xs focus:outline-none focus:border-[#a21232] resize-none"
            />
          </div>

          {/* Lista de Beneficios (Features) */}
          <div className="space-y-3 border-t border-gray-100 pt-4">
            <label className="block text-[10px] font-bold text-gray-600 uppercase">
              Lista de Beneficios / Características (Puntos de venta)
            </label>

            <div className="space-y-2">
              {editingPlan.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 font-mono w-5 shrink-0 text-right">
                    {idx + 1}.
                  </span>
                  <input
                    type="text"
                    value={feat}
                    onChange={(e) => handleFeatureChange(idx, e.target.value)}
                    className="flex-1 px-3 py-1.5 border border-gray-250 rounded-xl text-xs focus:outline-none focus:border-[#a21232]"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(idx)}
                    className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition"
                    title="Eliminar beneficio"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Agregar nuevo beneficio */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={newFeatureText}
                onChange={(e) => setNewFeatureText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddFeature();
                  }
                }}
                placeholder="Escribe un nuevo beneficio (ej: 🎵 Canción especial de la pareja)..."
                className="flex-1 px-3.5 py-2 border border-gray-250 rounded-xl text-xs focus:outline-none focus:border-[#a21232]"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl transition flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Añadir</span>
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
