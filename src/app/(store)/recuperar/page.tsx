'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Search, Sparkles, ExternalLink, Printer, CheckCircle, ArrowLeft, Heart, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

interface RecoveredExperience {
  id: string;
  slug: string;
  partner_name: string;
  user_name: string;
  title: string;
  special_date: string;
  created_at: string;
  live_url: string;
  print_url: string;
}

export default function RecuperarPedidoPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [experiences, setExperiences] = useState<RecoveredExperience[]>([]);
  const [successMessage, setSuccessMessage] = useState('');

  const handleRecover = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      toast.error('Por favor ingresa un correo electrónico válido');
      return;
    }

    setLoading(true);
    setSearched(false);
    const toastId = toast.loading('Buscando tus recuerdos digitales...');

    try {
      const res = await fetch('/api/orders/recover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'No se encontraron pedidos con este correo');
      }

      setExperiences(data.experiences || []);
      setSuccessMessage(data.message || '¡Pedidos encontrados!');
      setSearched(true);
      toast.dismiss(toastId);
      toast.success('¡Encontramos tus recuerdos QR!');
    } catch (err: any) {
      toast.dismiss(toastId);
      toast.error(err?.message || 'Error al buscar tu pedido');
      setExperiences([]);
      setSearched(true);
      setSuccessMessage('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] py-10 sm:py-16 px-4 max-w-2xl mx-auto space-y-8 animate-fade-in text-center">
      
      {/* Header */}
      <div className="space-y-3">
        <div className="w-14 h-14 bg-rose-100 text-[#a21232] rounded-3xl flex items-center justify-center mx-auto shadow-md">
          <Heart className="w-7 h-7 fill-[#a21232]" />
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
          Recuperar mi Recuerdo QR
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto font-light leading-relaxed">
          ¿No encuentras el correo con tu enlace o necesitas volver a descargar la tarjeta para imprimir? Ingresa tu email y te los mostraremos de inmediato.
        </p>
      </div>

      {/* Search Form Card */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xl text-left space-y-4">
        <form onSubmit={handleRecover} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
              Correo Electrónico de la Compra
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@gmail.com"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-250 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-[#a21232] focus:border-transparent text-xs sm:text-sm transition shadow-2xs font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#a21232] hover:bg-[#850e28] text-white font-bold rounded-2xl text-xs sm:text-sm shadow-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Buscando en el sistema...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Buscar mis Recuerdos y Enlaces</span>
              </>
            )}
          </button>
        </form>

        <p className="text-[11px] text-gray-400 text-center pt-2">
          ?? Búsqueda protegida. Solo se muestran los recuerdos vinculados al correo exacto.
        </p>
      </div>

      {/* Results Section */}
      {searched && (
        <div className="space-y-4 text-left animate-fade-in">
          {experiences.length > 0 ? (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs flex items-center gap-2.5">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </div>

              <div className="space-y-3">
                {experiences.map((exp) => (
                  <div
                    key={exp.id}
                    className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-3 hover:border-rose-300 transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                      <div>
                        <h3 className="font-serif font-bold text-base text-gray-900 flex items-center gap-1.5">
                          <span>{exp.partner_name} & {exp.user_name}</span>
                          <Sparkles className="w-4 h-4 text-amber-500" />
                        </h3>
                        <p className="text-[11px] text-gray-500 font-mono">
                          /amor/{exp.slug}
                        </p>
                      </div>

                      {exp.special_date && (
                        <span className="text-[10px] font-mono bg-rose-50 text-rose-800 border border-rose-200 px-2.5 py-1 rounded-full self-start sm:self-auto">
                          ?? {exp.special_date}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      <a
                        href={exp.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-4 bg-[#a21232] hover:bg-[#850e28] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Abrir Experiencia Web</span>
                      </a>

                      <a
                        href={exp.print_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-4 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Descargar Tarjeta para Imprimir</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 text-center space-y-3">
              <span className="text-3xl block">????</span>
              <h3 className="font-bold text-sm text-gray-900">No encontramos compras con este correo</h3>
              <p className="text-xs text-gray-500 font-light max-w-sm mx-auto leading-relaxed">
                Verifica que el correo esté escrito sin errores ortográficos. Si compraste recientemente o pagaste con otro email, escríbenos directamente a WhatsApp y te ayudamos de inmediato.
              </p>
              <a
                href="https://wa.me/56912345678?text=Hola!%20No%20encuentro%20el%20enlace%20de%20mi%20Recuerdo%20QR.%20¿Me%20pueden%20ayudar?"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Hablar con Soporte en WhatsApp</span>
              </a>
            </div>
          )}
        </div>
      )}

      {/* Back to Home link */}
      <div className="pt-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 font-semibold transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver a la Página Principal</span>
        </Link>
      </div>

    </div>
  );
}
