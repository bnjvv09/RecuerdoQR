'use client';

import React from 'react';
import { Product } from '@/lib/db';
import { ShieldCheck, Truck, Sparkles, Lock, RefreshCw } from 'lucide-react';

interface Step4CheckoutProps {
  currentProduct?: Product;
  selectedPlan: string;
  totalPrice: number;
  partnerName: string;
  userName: string;
  customerName: string;
  setCustomerName: (val: string) => void;
  customerEmail: string;
  setCustomerEmail: (val: string) => void;
  customerPhone: string;
  setCustomerPhone: (val: string) => void;
  deliveryAddress: string;
  setDeliveryAddress: (val: string) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export default function Step4Checkout({
  currentProduct,
  selectedPlan,
  totalPrice,
  partnerName,
  userName,
  customerName,
  setCustomerName,
  customerEmail,
  setCustomerEmail,
  customerPhone,
  setCustomerPhone,
  deliveryAddress,
  setDeliveryAddress,
  loading,
  onSubmit,
}: Step4CheckoutProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-8 animate-fade-in text-left">
      <div className="border-b border-rose-100 pb-3">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span>💳</span>
          <span>Finalizar Pedido y Datos de Entrega</span>
        </h2>
        <p className="text-xs text-gray-500 font-light mt-1">
          Revisa el resumen de tu compra e ingresa tus datos para generar tu código QR o coordinar el despacho.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Customer & Delivery Details */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 font-serif">
              Tus Datos de Contacto
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                  Tu Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ej. Matías Silva"
                  className="w-full px-3.5 py-2 border border-gray-250 rounded-xl text-xs focus:outline-none focus:border-[#a21232]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                  Correo Electrónico (Para enviar tu QR) *
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full px-3.5 py-2 border border-gray-250 rounded-xl text-xs focus:outline-none focus:border-[#a21232]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                  Teléfono / WhatsApp (Para enviarte el enlace) *
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+56 9 1234 5678"
                  className="w-full px-3.5 py-2 border border-gray-250 rounded-xl text-xs focus:outline-none focus:border-[#a21232]"
                />
              </div>
            </div>
          </div>

          <div className="bg-rose-50/50 rounded-2xl border border-rose-150 p-4 flex items-start gap-3 text-xs text-gray-600">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-gray-800 block mb-0.5">Garantía de Acceso Permanente 100%</span>
              <p className="font-light text-[11px] leading-relaxed">
                Tu experiencia digital y tarjeta personalizada estarán activas y protegidas para siempre en servidores de alta velocidad.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 font-serif border-b border-gray-100 pb-2">
              Resumen de Compra
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Plan Digital:</span>
                <span className="font-bold text-gray-800">{currentProduct?.name || 'Plan Digital'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Pareja:</span>
                <span className="font-semibold text-gray-700">{partnerName} & {userName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Formato:</span>
                <span className="font-semibold text-emerald-700">Tarjeta Digital Temática (Imprimible & QR)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Costo de Envío:</span>
                <span className="font-semibold text-emerald-600">$0 (Entrega Digital Instantánea)</span>
              </div>
              <div className="border-t border-gray-100 pt-2 flex justify-between items-baseline">
                <span className="font-serif font-bold text-sm text-gray-900">Total a Pagar:</span>
                <span className="font-serif text-xl font-extrabold text-[#a21232]">
                  ${Number(totalPrice).toLocaleString('es-CL')} CLP
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-rose-600 to-[#a21232] hover:from-rose-700 hover:to-[#880e28] text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Procesando pedido...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Confirmar y Pagar Pedido</span>
                </>
              )}
            </button>

            <p className="text-[9px] text-gray-400 text-center font-light">
              Pago 100% seguro y encriptado con MercadoPago y WebPay.
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
