'use client';

import React, { useState } from 'react';
import { useAdminStore } from '@/lib/store';
import { updateProduct, Product } from '@/lib/db';
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
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminPlansPanel() {
  const { products, setProducts, updateProductLocal } = useAdminStore();
  const [editingPlan, setEditingPlan] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [newFeatureText, setNewFeatureText] = useState('');

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
