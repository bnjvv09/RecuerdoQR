'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAdminStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { 
  getOrders, 
  getExperiences, 
  getThemes, 
  getProducts, 
  getSiteSettings,
  deleteExperience,
  updateProductPrice,
  Product, 
  Experience 
} from '@/lib/db';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminOrdersTable from '@/components/admin/AdminOrdersTable';
import AdminThemesPanel from '@/components/admin/AdminThemesPanel';
import AdminCreatorStudio from '@/components/admin/AdminCreatorStudio';
import AdminPlansPanel from '@/components/admin/AdminPlansPanel';
import AdminSettingsPanel from '@/components/admin/AdminSettingsPanel';
import AdminEditExperienceModal from '@/components/admin/AdminEditExperienceModal';
import PrintableGiftCardModal from '@/components/card/PrintableGiftCardModal';
import { 
  Lock, 
  Mail, 
  Heart, 
  ExternalLink, 
  Trash2, 
  DollarSign, 
  Save, 
  Sparkles,
  RefreshCw,
  Edit3
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminPage() {
  const {
    isLogged,
    setIsLogged,
    activeTab,
    orders,
    setOrders,
    experiences,
    setExperiences,
    themes,
    setThemes,
    products,
    setProducts,
    setSettings,
    deleteExperienceLocal,
    updateExperienceLocal,
    updateProductPriceLocal,
  } = useAdminStore();

  // Auth form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');

  // Experience editing modal state
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);

  // Printable card modal state
  const [printableCardData, setPrintableCardData] = useState<{
    partnerName: string;
    userName: string;
    message?: string;
    qrDataUrl: string;
    date?: string;
    slug?: string;
    theme?: string;
  } | null>(null);

  // Pricing editing states
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<number>(0);

  const loadInitialData = useCallback(async () => {
    try {
      const [orderList, expList, themeList, prodList, settingsData] = await Promise.all([
        getOrders(),
        getExperiences(),
        getThemes(),
        getProducts(),
        getSiteSettings(),
      ]);
      setOrders(orderList);
      setExperiences(expList);
      setThemes(themeList);
      setProducts(prodList);
      setSettings(settingsData);
    } catch (err: any) {
      console.error('Data loading error:', err);
      toast.error('Error al cargar los datos del panel');
    }
  }, [setOrders, setExperiences, setThemes, setProducts, setSettings]);

  // Check existing Supabase session on mount
  useEffect(() => {
    async function checkSession() {
      try {
        const { data } = await supabase.auth.getSession();
        if (data?.session) {
          setIsLogged(true);
          setUserEmail(data.session.user?.email || '');
          loadInitialData();
        }
      } catch (err) {
        console.error('Session check error:', err);
      }
    }
    checkSession();
  }, [setIsLogged, setUserEmail, loadInitialData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error('Ingresa tu correo y contraseña');
      return;
    }

    setAuthLoading(true);
    const toastId = toast.loading('Verificando credenciales...');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password: password.trim() }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Credenciales inválidas');
      }

      setIsLogged(true);
      setUserEmail(json.data.user.email);
      toast.dismiss(toastId);
      toast.success('¡Bienvenido al panel de administración!');
      loadInitialData();
    } catch (err: any) {
      toast.dismiss(toastId);
      toast.error(err?.message || 'Error de autenticación');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      await supabase.auth.signOut();
      setIsLogged(false);
      setUserEmail('');
      toast.success('Sesión cerrada correctamente');
    } catch (err) {
      setIsLogged(false);
    }
  };

  const handleDeleteExperience = async (id: string, slug: string) => {
    if (!window.confirm(`¿Estás seguro de eliminar la experiencia "/amor/${slug}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    const toastId = toast.loading('Eliminando experiencia...');
    try {
      const res = await fetch(`/api/experiences/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Error al eliminar');
      }

      deleteExperienceLocal(id);
      toast.dismiss(toastId);
      toast.success('Experiencia eliminada correctamente');
    } catch (err: any) {
      toast.dismiss(toastId);
      toast.error(err?.message || 'Error al eliminar experiencia');
    }
  };

  const handleSavePrice = async (prodId: string) => {
    try {
      const res = await fetch(`/api/products/${prodId}/price`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: Number(tempPrice) }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Error al actualizar precio');
      }

      updateProductPriceLocal(prodId, Number(tempPrice));
      setEditingPriceId(null);
      toast.success('Precio actualizado');
    } catch (err: any) {
      toast.error(err?.message || 'Error al actualizar precio');
    }
  };

  // 1. Render Login Form if not logged in
  if (!isLogged) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-10 max-w-md w-full shadow-2xl space-y-6 text-center animate-fade-in">
          
          <div className="w-14 h-14 rounded-2xl bg-[#a21232] text-white flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <h2 className="font-serif text-2xl font-bold text-gray-900">
              Panel Administrativo
            </h2>
            <p className="text-xs text-gray-500 font-light">
              Ingresa con tu cuenta de Supabase para gestionar pedidos y experiencias.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@recuerdoqr.cl"
                  className="w-full pl-9 pr-3.5 py-2.5 border border-gray-250 rounded-xl text-xs focus:outline-none focus:border-[#a21232]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 border border-gray-250 rounded-xl text-xs focus:outline-none focus:border-[#a21232]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3.5 bg-[#a21232] hover:bg-[#880e28] text-white font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {authLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Iniciando sesión...</span>
                </>
              ) : (
                <span>Acceder al Panel</span>
              )}
            </button>
          </form>

        </div>
      </div>
    );
  }

  // 2. Render Main Admin Dashboard
  return (
    <div className="min-h-screen bg-gray-50/50 pb-16">
      
      {/* Header Bar */}
      <AdminHeader onLogout={handleLogout} userEmail={userEmail} />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Tab 1: Orders & Shipments */}
        {activeTab === 'orders' && (
          <AdminOrdersTable 
            onOpenPrintableModal={setPrintableCardData} 
            onEditExperience={setEditingExperience} 
          />
        )}

        {/* Tab 2: Experiences List */}
        {activeTab === 'experiences' && (
          <div className="space-y-6 text-left animate-fade-in">
            <div className="border-b border-gray-200 pb-3 flex items-center justify-between">
              <div>
                <h2 className="font-serif text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#a21232]" />
                  <span>Experiencias QR Activas ({experiences.length})</span>
                </h2>
                <p className="text-xs text-gray-500 font-light mt-0.5">
                  Lista de todas las páginas de recuerdos románticos creadas en el sistema.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold text-gray-500 uppercase">
                  <tr>
                    <th className="p-3.5">Pareja</th>
                    <th className="p-3.5">Título</th>
                    <th className="p-3.5">Enlace Slug</th>
                    <th className="p-3.5">Fecha Creado</th>
                    <th className="p-3.5 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {experiences.map((exp) => (
                    <tr key={exp.id} className="hover:bg-rose-50/20 transition">
                      <td className="p-3.5 font-bold text-gray-900 font-serif">
                        {exp.partner_name} & {exp.user_name}
                      </td>
                      <td className="p-3.5 text-gray-600 truncate max-w-xs">{exp.title}</td>
                      <td className="p-3.5 font-mono text-[10px] text-rose-600">/amor/{exp.slug}</td>
                      <td className="p-3.5 text-gray-400 font-mono text-[10px]">
                        {new Date(exp.created_at).toLocaleDateString('es-CL')}
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex justify-end items-center gap-2">
                          <a
                            href={`/amor/${exp.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 bg-gray-100 hover:bg-rose-50 text-gray-600 hover:text-[#a21232] rounded-lg transition"
                            title="Ver online"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          <button
                            type="button"
                            onClick={() => setEditingExperience(exp)}
                            className="p-1.5 bg-gray-100 hover:bg-amber-50 text-gray-600 hover:text-amber-700 rounded-lg transition"
                            title="Editar experiencia"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteExperience(exp.id, exp.slug)}
                            className="p-1.5 bg-gray-100 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition"
                            title="Eliminar experiencia"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Planes y Precios (Gestor Completo) */}
        {(activeTab === 'plans' || (activeTab as string) === 'pricing') && (
          <AdminPlansPanel />
        )}

        {/* Tab 4: Configuración & Footer */}
        {activeTab === 'settings' && (
          <AdminSettingsPanel />
        )}

        {/* Tab 5: Themes */}
        {activeTab === 'themes' && <AdminThemesPanel />}

        {/* Tab 6: Creator Studio */}
        {activeTab === 'creator' && (
          <AdminCreatorStudio onOpenPrintableModal={setPrintableCardData} />
        )}

      </main>

      {/* Printable Gift Card Modal */}
      {printableCardData && (
        <PrintableGiftCardModal
          isOpen={!!printableCardData}
          onClose={() => setPrintableCardData(null)}
          partnerName={printableCardData.partnerName}
          userName={printableCardData.userName}
          message={printableCardData.message}
          qrDataUrl={printableCardData.qrDataUrl}
          date={printableCardData.date}
          slug={printableCardData.slug}
          theme={printableCardData.theme}
        />
      )}

      {/* Edit Experience Modal */}
      {editingExperience && (
        <AdminEditExperienceModal
          isOpen={!!editingExperience}
          experience={editingExperience}
          onClose={() => setEditingExperience(null)}
          onSaved={(updatedExp) => {
            updateExperienceLocal(updatedExp.id, updatedExp);
            setEditingExperience(null);
          }}
        />
      )}

    </div>
  );
}
