'use client';

import React from 'react';
import { useAdminStore, AdminTab } from '@/lib/store';
import { 
  ShoppingBag, 
  Sparkles, 
  Plus, 
  Palette, 
  DollarSign, 
  Settings,
  LogOut, 
  Heart,
  UserCheck
} from 'lucide-react';
import { toast } from 'sonner';

interface AdminHeaderProps {
  onLogout: () => void;
  userEmail?: string;
}

export default function AdminHeader({ onLogout, userEmail }: AdminHeaderProps) {
  const { activeTab, setActiveTab } = useAdminStore();

  const tabs: Array<{ id: AdminTab; label: string; icon: React.ReactNode }> = [
    { id: 'orders', label: 'Pedidos & Clientes', icon: <ShoppingBag className="w-3.5 h-3.5" /> },
    { id: 'experiences', label: 'Experiencias QR', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'plans', label: 'Planes y Precios', icon: <DollarSign className="w-3.5 h-3.5" /> },
    { id: 'settings', label: 'Configuración & Footer', icon: <Settings className="w-3.5 h-3.5" /> },
    { id: 'themes', label: 'Temáticas', icon: <Palette className="w-3.5 h-3.5" /> },
    { id: 'creator', label: 'Crear Manual', icon: <Plus className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        
        {/* Brand & Badge */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#a21232] text-white flex items-center justify-center shadow-xs">
            <Heart className="w-4 h-4 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif font-extrabold text-sm sm:text-base text-gray-900 leading-none">
                RecuerdoQR
              </h1>
              <span className="bg-emerald-50 text-emerald-700 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Admin Real
              </span>
            </div>
            {userEmail && (
              <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1 mt-0.5">
                <UserCheck className="w-3 h-3 text-gray-400" />
                {userEmail}
              </span>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-gray-100/80 p-1 rounded-2xl border border-gray-200">
          {tabs.map((t) => {
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-white text-[#a21232] shadow-xs'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
                }`}
              >
                {t.icon}
                <span>{t.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <button
          type="button"
          onClick={onLogout}
          className="px-3 py-1.5 bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-600 font-bold rounded-xl text-xs transition flex items-center gap-1.5 border border-gray-250"
          title="Cerrar sesión"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Cerrar Sesión</span>
        </button>

      </div>

      {/* Mobile Tab Navigation */}
      <div className="md:hidden flex overflow-x-auto gap-1 p-2 bg-gray-50 border-t border-gray-150">
        {tabs.map((t) => {
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition flex items-center gap-1 ${
                isActive
                  ? 'bg-[#a21232] text-white'
                  : 'bg-white text-gray-700 border border-gray-200'
              }`}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
