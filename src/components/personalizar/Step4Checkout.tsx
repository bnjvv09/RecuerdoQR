'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Product } from '@/lib/db';
import { ShieldCheck, Lock, RefreshCw, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

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
  // Extraer los 8 dígitos tras el "+56 9"
  const extractRawDigits = (phoneStr: string) => {
    const onlyDigits = phoneStr.replace(/\D/g, '');
    if (onlyDigits.startsWith('569')) {
      return onlyDigits.slice(3, 11);
    }
    if (onlyDigits.startsWith('9')) {
      return onlyDigits.slice(1, 9);
    }
    return onlyDigits.slice(0, 8);
  };

  const [phoneDigits, setPhoneDigits] = useState(() => extractRawDigits(customerPhone));
  const [emailStatus, setEmailStatus] = useState<{
    loading: boolean;
    valid?: boolean;
    error?: string;
    suggestion?: string;
  }>({ loading: false });

  // Sincronizar el teléfono formateado hacia el estado principal
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 8);
    setPhoneDigits(raw);

    if (raw.length === 0) {
      setCustomerPhone('');
    } else if (raw.length <= 4) {
      setCustomerPhone(`+56 9 ${raw}`);
    } else {
      setCustomerPhone(`+56 9 ${raw.slice(0, 4)} ${raw.slice(4, 8)}`);
    }
  };

  // Validar email en el servidor con registros MX y typos
  const validateEmailServer = useCallback(async (emailToTest: string) => {
    const trimmed = emailToTest.trim();
    if (!trimmed || !trimmed.includes('@') || !trimmed.includes('.')) {
      setEmailStatus({ loading: false, valid: undefined });
      return;
    }

    setEmailStatus({ loading: true });
    try {
      const res = await fetch('/api/validate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      });

      const data = await res.json();
      if (!res.ok || data.valid === false) {
        setEmailStatus({
          loading: false,
          valid: false,
          error: data.error || 'Correo no válido',
          suggestion: data.suggestion,
        });
      } else {
        setEmailStatus({
          loading: false,
          valid: true,
          suggestion: data.suggestion,
        });
      }
    } catch {
      setEmailStatus({ loading: false, valid: true });
    }
  }, []);

  // Debounce para validación de email
  useEffect(() => {
    const timer = setTimeout(() => {
      if (customerEmail.trim().length > 4 && customerEmail.includes('@')) {
        validateEmailServer(customerEmail);
      } else {
        setEmailStatus({ loading: false });
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [customerEmail, validateEmailServer]);

  const handleApplySuggestion = (sugg: string) => {
    setCustomerEmail(sugg);
    validateEmailServer(sugg);
    toast.success('Correo corregido automáticamente');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || customerName.trim().length < 2) {
      toast.error('Por favor ingresa tu nombre completo');
      return;
    }

    if (phoneDigits.length !== 8) {
      toast.error('El número de teléfono chileno debe tener exactamente 8 dígitos tras el +56 9');
      return;
    }

    if (emailStatus.valid === false && emailStatus.error) {
      toast.error(emailStatus.error);
      return;
    }

    onSubmit(e);
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-8 animate-fade-in text-left">
      <div className="border-b border-rose-100 pb-3">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span>💳</span>
          <span>Finalizar Pedido y Datos de Entrega</span>
        </h2>
        <p className="text-xs text-gray-500 font-light mt-1">
          Ingresa tus datos de contacto para enviarte el código QR, la tarjeta de regalo y el enlace de acceso permanente.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Customer & Delivery Details */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 font-serif">
                Tus Datos de Contacto y Entrega
              </h3>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold border border-emerald-200">
                🔒 Datos Protegidos
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Nombre Completo */}
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                  Tu Nombre y Apellido *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ej. Matías Silva"
                  className="w-full px-3.5 py-2.5 border border-gray-250 rounded-xl text-xs focus:outline-none focus:border-[#a21232] transition"
                />
              </div>

              {/* Correo Electrónico */}
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[10px] font-bold text-gray-600 uppercase">
                    Correo Electrónico (Donde recibirás tu QR) *
                  </label>
                  {emailStatus.loading && (
                    <span className="text-[10px] text-gray-400 flex items-center gap-1">
                      <RefreshCw className="w-2.5 h-2.5 animate-spin" /> Verificando dominio...
                    </span>
                  )}
                  {!emailStatus.loading && emailStatus.valid === true && (
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Correo verificado
                    </span>
                  )}
                  {!emailStatus.loading && emailStatus.valid === false && (
                    <span className="text-[10px] text-red-600 font-bold flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {emailStatus.error}
                    </span>
                  )}
                </div>

                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="ejemplo@gmail.com"
                  className={`w-full px-3.5 py-2.5 border rounded-xl text-xs focus:outline-none transition ${
                    emailStatus.valid === false
                      ? 'border-red-400 bg-red-50/20 text-red-900 focus:border-red-500'
                      : emailStatus.valid === true
                      ? 'border-emerald-400 bg-emerald-50/10 focus:border-emerald-500'
                      : 'border-gray-250 focus:border-[#a21232]'
                  }`}
                />

                {/* Sugerencia de Typo */}
                {emailStatus.suggestion && (
                  <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-900">
                    <span className="flex items-center gap-1.5 text-[11px]">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      ¿Quisiste escribir <strong>{emailStatus.suggestion}</strong>?
                    </span>
                    <button
                      type="button"
                      onClick={() => handleApplySuggestion(emailStatus.suggestion!)}
                      className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-bold rounded-lg transition"
                    >
                      Corregir
                    </button>
                  </div>
                )}
              </div>

              {/* Teléfono Móvil con Máscara Chilena */}
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[10px] font-bold text-gray-600 uppercase">
                    Teléfono Móvil / WhatsApp (Chile 🇨🇱) *
                  </label>
                  {phoneDigits.length === 8 ? (
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Número válido (+56 9)
                    </span>
                  ) : phoneDigits.length > 0 ? (
                    <span className="text-[10px] text-amber-600 font-medium">
                      Faltan {8 - phoneDigits.length} dígitos
                    </span>
                  ) : null}
                </div>

                <div className="flex items-center rounded-xl border border-gray-250 focus-within:border-[#a21232] overflow-hidden transition bg-white">
                  {/* Prefijo Fijo */}
                  <div className="bg-gray-50 px-3 py-2.5 border-r border-gray-200 flex items-center gap-1.5 text-gray-700 select-none">
                    <span className="text-base leading-none">🇨🇱</span>
                    <span className="font-mono text-xs font-bold text-gray-800">+56 9</span>
                  </div>

                  {/* Input de 8 dígitos */}
                  <input
                    type="tel"
                    required
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={phoneDigits.length > 4 ? `${phoneDigits.slice(0, 4)} ${phoneDigits.slice(4, 8)}` : phoneDigits}
                    onChange={handlePhoneChange}
                    placeholder="1234 5678"
                    maxLength={9}
                    className="w-full px-3.5 py-2.5 text-xs font-mono tracking-wider focus:outline-none bg-transparent"
                  />
                </div>
                <p className="text-[10px] text-gray-400 font-light mt-1">
                  Formato de 8 dígitos para tu número celular en Chile (ej. 8765 4321).
                </p>
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
              disabled={loading || phoneDigits.length !== 8 || emailStatus.valid === false}
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
