'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { updateOrderPayment } from '@/lib/db';
import { Heart, ShieldCheck, AlertCircle } from 'lucide-react';

function SimulatePaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const orderId = searchParams.get('orderId') || '';
  const productName = searchParams.get('productName') || 'Experiencia Romántica';
  const total = searchParams.get('total') || '0';

  const handlePayment = async (status: 'success' | 'failure') => {
    setLoading(true);
    try {
      if (status === 'success') {
        const mockPaymentId = `MOCK-PAY-${Math.floor(Math.random() * 10000000)}`;
        // Actualizar estado del pedido en la base de datos (Supabase o LocalStorage)
        await updateOrderPayment(orderId, mockPaymentId, 'paid');
        router.push(`/gracias?orderId=${orderId}&status=success`);
      } else {
        router.push(`/checkout?orderId=${orderId}&status=failure`);
      }
    } catch (error) {
      console.error('Error simulating payment:', error);
      alert('Error al simular el pago');
      setLoading(false);
    }
  };

  if (!orderId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full text-center bg-white p-8 rounded-2xl shadow-xl">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Pedido Inválido</h1>
          <p className="text-gray-600 mb-6">No se ha proporcionado un identificador de pedido válido.</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rose-50/50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-rose-100">
        {/* Header simulador */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-4 flex items-center justify-between">
          <span className="font-semibold tracking-wider text-sm">MERCADO PAGO</span>
          <span className="bg-blue-700/50 text-xs px-2.5 py-1 rounded-full border border-blue-400/30">
            Modo Sandbox
          </span>
        </div>

        <div className="p-6 md:p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">Simulador de Pago</h1>
            <p className="text-sm text-gray-500 mt-1">Estás pagando tu experiencia en RecuerdoQR</p>
          </div>

          {/* Detalles de la compra */}
          <div className="bg-gray-50 rounded-2xl p-5 mb-8 border border-gray-100">
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-600 font-medium">Producto:</span>
              <span className="text-gray-800 font-semibold">{productName}</span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-600 font-medium">ID Pedido:</span>
              <span className="text-xs text-gray-500 font-mono select-all bg-gray-200/50 px-2 py-0.5 rounded">
                {orderId}
              </span>
            </div>
            <div className="border-t border-gray-200/80 my-3"></div>
            <div className="flex justify-between items-center">
              <span className="text-gray-800 font-bold">Total a pagar:</span>
              <span className="text-xl font-extrabold text-blue-600">
                ${Number(total).toLocaleString('es-CL')} CLP
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => handlePayment('success')}
              disabled={loading}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl transition shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Procesando...' : 'Aprobar Pago (Simulado)'}
            </button>
            <button
              onClick={() => handlePayment('failure')}
              disabled={loading}
              className="w-full py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl transition shadow-lg shadow-red-500/25 disabled:opacity-50"
            >
              Rechazar Pago (Simulado)
            </button>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-400 text-center">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Esta es una pasarela de pago simulada para desarrollo local.
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SimulatePaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-rose-50/50">
        <div className="w-12 h-12 border-4 border-rose-250 border-t-rose-500 rounded-full animate-spin"></div>
      </div>
    }>
      <SimulatePaymentContent />
    </Suspense>
  );
}
