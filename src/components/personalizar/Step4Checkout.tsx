'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Product, validateCoupon } from '@/lib/db';
import { ShieldCheck, Lock, RefreshCw, CheckCircle2, AlertCircle, Sparkles, Ticket } from 'lucide-react';
import { validateChileanPhone, validateEmailSyntaxAndDomain } from '@/lib/validationHelpers';
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
  onSubmit: (e: React.FormEvent, finalDiscountPrice?: number, couponCode?: string) => void;
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
  // Extraer los 9 dígitos tras el "+56" (ej: 9XXXXXXXX)
  const extractRawDigits = (phoneStr: string) => {
    let onlyDigits = phoneStr.replace(/\D/g, '');
    if (onlyDigits.startsWith('56') && onlyDigits.length >= 11) {
      onlyDigits = onlyDigits.slice(2);
    }
    return onlyDigits.slice(0, 9);
  };

  const [phoneDigits, setPhoneDigits] = useState(() => extractRawDigits(customerPhone));
  const [touched, setTouched] = useState({ name: false, email: false, phone: false });
  const [serverEmailStatus, setServerEmailStatus] = useState<{
    loading: boolean;
    valid?: boolean;
    error?: string;
    suggestion?: string;
  }>({ loading: false });

  // 🎟️ Estados de Cupones de Descuento
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ 
    code: string; 
    type: 'percent' | 'fixed'; 
    value: number 
  } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [showCouponInput, setShowCouponInput] = useState(false);

  const discountAmount = appliedCoupon 
    ? appliedCoupon.type === 'percent'
      ? Math.round((totalPrice * appliedCoupon.value) / 100)
      : Math.min(totalPrice, appliedCoupon.value)
    : 0;
  const finalPrice = Math.max(0, totalPrice - discountAmount);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    try {
      const result = await validateCoupon(couponInput);
      if (result.valid && result.discount_value) {
        const type = result.discount_type || 'percent';
        setAppliedCoupon({ 
          code: couponInput.trim().toUpperCase(), 
          type, 
          value: result.discount_value 
        });
        const label = type === 'percent' ? `-${result.discount_value}%` : `-$${result.discount_value.toLocaleString('es-CL')} CLP`;
        const cuposInfo = result.remaining_uses !== null && result.remaining_uses !== undefined
          ? ` • ¡Quedan ${result.remaining_uses} cupos disponibles!`
          : '';
        toast.success(`¡Cupón ${couponInput.trim().toUpperCase()} aplicado! (${label} de descuento${cuposInfo})`);
      } else {
        toast.error(result.error || 'El cupón ingresado no es válido');
      }
    } catch {
      toast.error('Error al verificar el cupón');
    } finally {
      setCouponLoading(false);
    }
  };

  // Validaciones instantáneas del lado del cliente
  const phoneValidation = useMemo(() => {
    if (!phoneDigits) return { valid: false, error: 'Ingresa los 9 dígitos de tu celular (ej. 9 4452 6132)' };
    return validateChileanPhone(phoneDigits);
  }, [phoneDigits]);

  const clientEmailValidation = useMemo(() => {
    if (!customerEmail.trim()) return { valid: false, error: 'Ingresa tu correo electrónico' };
    return validateEmailSyntaxAndDomain(customerEmail);
  }, [customerEmail]);

  const nameValidation = useMemo(() => {
    const trimmed = customerName.trim();
    if (!trimmed) return { valid: false, error: 'Ingresa tu nombre y apellido' };
    if (trimmed.length < 3) return { valid: false, error: 'El nombre debe tener al menos 3 caracteres' };
    if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑüÜ\s'-]+$/.test(trimmed)) {
      return { valid: false, error: 'El nombre solo puede contener letras' };
    }
    const words = trimmed.split(/\s+/).filter(Boolean);
    if (words.length < 2) {
      return { valid: false, error: 'Por favor ingresa al menos Nombre y Apellido' };
    }
    return { valid: true };
  }, [customerName]);

  // Manejador del cambio de teléfono (9 dígitos)
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 9);
    setPhoneDigits(raw);

    if (raw.length === 0) {
      setCustomerPhone('');
    } else if (raw.length <= 1) {
      setCustomerPhone(`+56 ${raw}`);
    } else if (raw.length <= 5) {
      setCustomerPhone(`+56 ${raw.slice(0, 1)} ${raw.slice(1)}`);
    } else {
      setCustomerPhone(`+56 ${raw.slice(0, 1)} ${raw.slice(1, 5)} ${raw.slice(5, 9)}`);
    }
  };

  // Bloqueo directo de teclas no numéricas en teléfono
  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      !/^\d$/.test(e.key) &&
      !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'].includes(e.key)
    ) {
      e.preventDefault();
    }
  };

  // Bloqueo de números en nombre
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Filtrar caracteres que no sean letras o espacios
    const cleaned = val.replace(/[^A-Za-zÁÉÍÓÚáéíóúñÑüÜ\s'-]/g, '');
    setCustomerName(cleaned);
  };

  // Validar email en el servidor con registros MX y typos
  const validateEmailServer = useCallback(async (emailToTest: string) => {
    const trimmed = emailToTest.trim();
    const localCheck = validateEmailSyntaxAndDomain(trimmed);
    if (!localCheck.valid) {
      setServerEmailStatus({ loading: false, valid: false, error: localCheck.error });
      return;
    }

    setServerEmailStatus({ loading: true });
    try {
      const res = await fetch('/api/validate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      });

      const data = await res.json();
      if (!res.ok || data.valid === false) {
        setServerEmailStatus({
          loading: false,
          valid: false,
          error: data.error || 'Correo no válido',
          suggestion: data.suggestion,
        });
      } else {
        setServerEmailStatus({
          loading: false,
          valid: true,
          suggestion: data.suggestion,
        });
      }
    } catch {
      setServerEmailStatus({ loading: false, valid: true });
    }
  }, []);

  // Debounce para validación de email
  useEffect(() => {
    const timer = setTimeout(() => {
      if (customerEmail.trim().length > 3 && customerEmail.includes('@')) {
        validateEmailServer(customerEmail);
      } else {
        setServerEmailStatus({ loading: false });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [customerEmail, validateEmailServer]);

  const handleApplySuggestion = (sugg: string) => {
    setCustomerEmail(sugg);
    validateEmailServer(sugg);
    toast.success('Correo corregido automáticamente');
  };

  // Estado final de email (combina cliente + servidor)
  const isEmailValid = clientEmailValidation.valid && serverEmailStatus.valid !== false;
  const emailErrorMessage = !clientEmailValidation.valid 
    ? clientEmailValidation.error 
    : serverEmailStatus.valid === false 
    ? serverEmailStatus.error 
    : undefined;

  const isFormValid = nameValidation.valid && isEmailValid && phoneValidation.valid;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, phone: true });

    if (!nameValidation.valid) {
      toast.error(nameValidation.error);
      return;
    }

    if (!phoneValidation.valid) {
      toast.error(phoneValidation.error);
      return;
    }

    if (!isEmailValid) {
      toast.error(emailErrorMessage || 'Ingresa un correo electrónico real');
      return;
    }

    // 🎟️ Pasar el precio rebajado y el código si hay un cupón aplicado
    onSubmit(e, appliedCoupon ? finalPrice : undefined, appliedCoupon?.code);
  };

  return (
    <form onSubmit={handleFormSubmit} noValidate className="space-y-8 animate-fade-in text-left">
      <div className="border-b border-rose-100 pb-3">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span>💳</span>
          <span>Finalizar Pedido y Datos de Entrega</span>
        </h2>
        <p className="text-xs text-gray-500 font-light mt-1">
          Ingresa tus datos reales de contacto para enviarte el código QR, la tarjeta de regalo y el enlace de acceso permanente.
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
                🔒 Validación Estricta
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Nombre Completo */}
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[10px] font-bold text-gray-600 uppercase">
                    Tu Nombre y Apellido *
                  </label>
                  {customerName.length > 0 && nameValidation.valid && (
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Válido
                    </span>
                  )}
                  {customerName.length > 0 && !nameValidation.valid && (
                    <span className="text-[10px] text-red-600 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {nameValidation.error}
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  required
                  value={customerName}
                  onBlur={() => setTouched(prev => ({ ...prev, name: true }))}
                  onChange={handleNameChange}
                  placeholder="Ej. Matías Silva"
                  className={`w-full px-3.5 py-2.5 border rounded-xl text-xs focus:outline-none transition ${
                    customerName.length > 0 && !nameValidation.valid
                      ? 'border-red-400 bg-red-50/20 text-red-900 focus:border-red-500'
                      : customerName.length > 0 && nameValidation.valid
                      ? 'border-emerald-400 bg-emerald-50/10 focus:border-emerald-500'
                      : 'border-gray-250 focus:border-[#a21232]'
                  }`}
                />
              </div>

              {/* Correo Electrónico */}
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[10px] font-bold text-gray-600 uppercase">
                    Correo Electrónico (Donde recibirás tu QR) *
                  </label>
                  {serverEmailStatus.loading && (
                    <span className="text-[10px] text-gray-400 flex items-center gap-1">
                      <RefreshCw className="w-2.5 h-2.5 animate-spin" /> Verificando dominio...
                    </span>
                  )}
                  {!serverEmailStatus.loading && customerEmail.length > 0 && isEmailValid && (
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Correo verificado
                    </span>
                  )}
                  {!serverEmailStatus.loading && customerEmail.length > 0 && !isEmailValid && (
                    <span className="text-[10px] text-red-600 font-bold flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {emailErrorMessage}
                    </span>
                  )}
                </div>

                <input
                  type="text"
                  inputMode="email"
                  autoComplete="email"
                  required
                  value={customerEmail}
                  onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
                  onChange={(e) => setCustomerEmail(e.target.value.toLowerCase().trim())}
                  placeholder="ejemplo@gmail.com"
                  className={`w-full px-3.5 py-2.5 border rounded-xl text-xs focus:outline-none transition ${
                    customerEmail.length > 0 && !isEmailValid
                      ? 'border-red-400 bg-red-50/20 text-red-900 focus:border-red-500'
                      : customerEmail.length > 0 && isEmailValid
                      ? 'border-emerald-400 bg-emerald-50/10 focus:border-emerald-500'
                      : 'border-gray-250 focus:border-[#a21232]'
                  }`}
                />

                {/* 📧 Sugerencias Rápidas de Dominio de Correo */}
                {customerEmail.length > 0 && !customerEmail.includes('.com') && !customerEmail.includes('.cl') && !customerEmail.includes('.net') && (
                  <div className="flex flex-wrap gap-1.5 mt-2 animate-fade-in items-center">
                    <span className="text-[10px] text-gray-500 font-medium">Completar con 1 clic:</span>
                    {['@gmail.com', '@hotmail.com', '@outlook.com', '@icloud.com'].map((dom) => (
                      <button
                        key={dom}
                        type="button"
                        onClick={() => {
                          const username = customerEmail.includes('@') ? customerEmail.split('@')[0] : customerEmail;
                          if (username.trim()) {
                            setCustomerEmail(`${username.trim()}${dom}`);
                          }
                        }}
                        className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-[#a21232] border border-rose-200 rounded-lg text-[10px] font-bold transition active:scale-95 cursor-pointer shadow-2xs"
                      >
                        {dom}
                      </button>
                    ))}
                  </div>
                )}

                {/* Sugerencia de Typo */}
                {serverEmailStatus.suggestion && (
                  <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-900">
                    <span className="flex items-center gap-1.5 text-[11px]">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      ¿Quisiste escribir <strong>{serverEmailStatus.suggestion}</strong>?
                    </span>
                    <button
                      type="button"
                      onClick={() => handleApplySuggestion(serverEmailStatus.suggestion!)}
                      className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-bold rounded-lg transition cursor-pointer"
                    >
                      Corregir
                    </button>
                  </div>
                )}
              </div>

              {/* Teléfono Móvil con Máscara Chilena (+56) */}
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[10px] font-bold text-gray-600 uppercase">
                    Teléfono Móvil / WhatsApp (Chile 🇨🇱) *
                  </label>
                  {phoneDigits.length > 0 && phoneValidation.valid ? (
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Número válido (+56)
                    </span>
                  ) : phoneDigits.length > 0 ? (
                    <span className="text-[10px] text-red-600 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {phoneValidation.error}
                    </span>
                  ) : null}
                </div>

                <div className={`flex items-center rounded-xl border overflow-hidden transition bg-white ${
                  phoneDigits.length > 0 && !phoneValidation.valid
                    ? 'border-red-400 focus-within:border-red-500'
                    : phoneDigits.length > 0 && phoneValidation.valid
                    ? 'border-emerald-400 focus-within:border-emerald-500'
                    : 'border-gray-250 focus-within:border-[#a21232]'
                }`}>
                  {/* Prefijo Fijo (+56) */}
                  <div className="bg-gray-50 px-3 py-2.5 border-r border-gray-200 flex items-center gap-1.5 text-gray-700 select-none">
                    <span className="text-base leading-none">🇨🇱</span>
                    <span className="font-mono text-xs font-bold text-gray-800">+56</span>
                  </div>

                  {/* Input de 9 dígitos con bloqueo de teclado */}
                  <input
                    type="tel"
                    required
                    inputMode="numeric"
                    value={
                      phoneDigits.length > 5
                        ? `${phoneDigits.slice(0, 1)} ${phoneDigits.slice(1, 5)} ${phoneDigits.slice(5, 9)}`
                        : phoneDigits.length > 1
                        ? `${phoneDigits.slice(0, 1)} ${phoneDigits.slice(1)}`
                        : phoneDigits
                    }
                    onChange={handlePhoneChange}
                    onKeyDown={handlePhoneKeyDown}
                    onBlur={() => setTouched(prev => ({ ...prev, phone: true }))}
                    placeholder="9 4452 6132"
                    maxLength={11}
                    className="w-full px-3.5 py-2.5 text-xs font-mono tracking-wider focus:outline-none bg-transparent"
                  />
                </div>
                <p className="text-[10px] text-gray-400 font-light mt-1">
                  Escribe los 9 dígitos de tu celular comenzando con 9 (ej. 9 4452 6132).
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

              {/* 🎟️ Cupón de Descuento */}
              <div className="pt-2 border-t border-gray-100">
                {!appliedCoupon ? (
                  !showCouponInput ? (
                    <button
                      type="button"
                      onClick={() => setShowCouponInput(true)}
                      className="text-[11px] font-bold text-[#a21232] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Ticket className="w-3.5 h-3.5" />
                      <span>¿Tienes un cupón de descuento?</span>
                    </button>
                  ) : (
                    <div className="space-y-1.5 animate-fade-in">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value.toUpperCase().replace(/\s+/g, ''))}
                          placeholder="CÓDIGO (EJ. AMOR10)"
                          className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs font-mono uppercase font-bold text-gray-900 focus:outline-none focus:border-[#a21232]"
                        />
                        <button
                          type="button"
                          onClick={handleApplyCoupon}
                          disabled={couponLoading || !couponInput.trim()}
                          className="px-3 py-1.5 bg-[#a21232] hover:bg-[#880e28] text-white text-xs font-bold rounded-lg transition shrink-0 cursor-pointer disabled:opacity-50"
                        >
                          {couponLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Aplicar'}
                        </button>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between animate-fade-in">
                    <div className="space-y-0.5">
                      <span className="text-[11px] font-bold text-emerald-900 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        Cupón {appliedCoupon.code} ({appliedCoupon.type === 'percent' ? `-${appliedCoupon.value}%` : `-$${appliedCoupon.value.toLocaleString('es-CL')} CLP`})
                      </span>
                      <p className="text-[10px] text-emerald-700">Descuento: -${discountAmount.toLocaleString('es-CL')} CLP</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setAppliedCoupon(null);
                        setCouponInput('');
                        toast.info('Cupón removido');
                      }}
                      className="text-[10px] text-red-600 font-bold hover:underline cursor-pointer"
                    >
                      Quitar
                    </button>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 pt-2 flex justify-between items-baseline">
                <div>
                  <span className="font-serif font-bold text-sm text-gray-900 block">Total a Pagar:</span>
                  {selectedPlan === 'premium' && totalPrice < 7990 && (
                    <span className="text-[9px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200 font-bold inline-block mt-0.5">
                      🔥 Oferta Lanzamiento Aplicada
                    </span>
                  )}
                </div>
                <div className="text-right">
                  {appliedCoupon && (
                    <span className="text-xs text-gray-400 line-through mr-2 font-mono">
                      ${Number(totalPrice).toLocaleString('es-CL')}
                    </span>
                  )}
                  <span className="font-serif text-xl font-extrabold text-[#a21232]">
                    ${Number(finalPrice).toLocaleString('es-CL')} CLP
                  </span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !isFormValid}
              className={`w-full py-4 font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-sm ${
                !isFormValid || loading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60 shadow-none'
                  : 'bg-gradient-to-r from-rose-600 to-[#a21232] hover:from-rose-700 hover:to-[#880e28] text-white shadow-rose-900/20 cursor-pointer'
              }`}
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

            {!isFormValid && (
              <p className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 p-2 rounded-xl text-center font-medium">
                ⚠️ Completa tus datos reales (Nombre, Correo verificado y Teléfono móvil válido) para activar el pago.
              </p>
            )}

            <p className="text-[9px] text-gray-400 text-center font-light">
              Pago 100% seguro y encriptado con MercadoPago y WebPay.
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
