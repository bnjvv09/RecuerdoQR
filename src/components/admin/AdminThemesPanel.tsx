'use client';

import React, { useState } from 'react';
import { useAdminStore } from '@/lib/store';
import { Theme, updateTheme } from '@/lib/db';
import { Palette, Check, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminThemesPanel() {
  const { themes, setThemes } = useAdminStore();
  const [editingThemeId, setEditingThemeId] = useState<string | null>(null);
  const [themeName, setThemeName] = useState('');
  const [themeDesc, setThemeDesc] = useState('');

  const handleStartEdit = (t: Theme) => {
    setEditingThemeId(t.id);
    setThemeName(t.name);
    setThemeDesc(t.description);
  };

  const handleSaveTheme = async (id: string) => {
    const t = themes.find(item => item.id === id);
    try {
      await updateTheme(id, t?.is_active ?? true, themeName, themeDesc);
      setThemes(themes.map(item => item.id === id ? { ...item, name: themeName, description: themeDesc } : item));
      setEditingThemeId(null);
      toast.success('Temática actualizada exitosamente');
    } catch (err: any) {
      toast.error(err?.message || 'Error al guardar temática');
    }
  };

  const handleToggleTheme = async (t: Theme) => {
    const nextActive = !t.is_active;
    try {
      await updateTheme(t.id, nextActive);
      setThemes(themes.map(item => item.id === t.id ? { ...item, is_active: nextActive } : item));
      toast.success(`Temática ${nextActive ? 'activada' : 'desactivada'}`);
    } catch (err: any) {
      toast.error('Error al cambiar estado de la temática');
    }
  };

  return (
    <div className="space-y-6 text-left animate-fade-in">
      <div className="border-b border-gray-200 pb-3">
        <h2 className="font-serif text-lg font-bold text-gray-900 flex items-center gap-2">
          <Palette className="w-4 h-4 text-[#a21232]" />
          <span>Gestión de Temáticas de la Tienda</span>
        </h2>
        <p className="text-xs text-gray-500 font-light mt-0.5">
          Activa, desactiva o personaliza los textos y descripciones de las temáticas disponibles en la tienda.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {themes.map((t) => {
          const isEditing = editingThemeId === t.id;
          const emoji = (t as any).emoji || (t.config as any)?.emoji || '✨';
          return (
            <div
              key={t.id}
              className={`bg-white rounded-2xl border p-5 shadow-xs space-y-3 transition ${
                t.is_active ? 'border-gray-200' : 'border-gray-200 opacity-60 bg-gray-50/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="text-3xl">{emoji}</div>
                <button
                  type="button"
                  onClick={() => handleToggleTheme(t)}
                  className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase transition ${
                    t.is_active
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  {t.is_active ? 'Activo' : 'Inactivo'}
                </button>
              </div>

              {isEditing ? (
                <div className="space-y-2 pt-1">
                  <input
                    type="text"
                    value={themeName}
                    onChange={(e) => setThemeName(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs font-bold"
                  />
                  <textarea
                    rows={2}
                    value={themeDesc}
                    onChange={(e) => setThemeDesc(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-[11px]"
                  />
                  <div className="flex justify-end gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => setEditingThemeId(null)}
                      className="px-2.5 py-1 text-gray-500 hover:bg-gray-100 rounded-lg text-[10px]"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveTheme(t.id)}
                      className="px-3 py-1 bg-[#a21232] text-white rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-xs"
                    >
                      <Save className="w-3 h-3" /> Guardar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <h3 className="font-bold text-xs text-gray-900">{t.name}</h3>
                  <p className="text-[11px] text-gray-500 font-light leading-relaxed">{t.description}</p>
                  <button
                    type="button"
                    onClick={() => handleStartEdit(t)}
                    className="text-[10px] text-[#a21232] font-bold hover:underline pt-2 block"
                  >
                    Editar textos
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
