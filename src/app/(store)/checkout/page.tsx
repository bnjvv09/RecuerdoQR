'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/personalizar');
  }, [router]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center bg-white p-8 rounded-3xl border border-rose-100 shadow-xl space-y-4">
        <div className="w-10 h-10 border-4 border-rose-200 border-t-[#a21232] rounded-full animate-spin mx-auto"></div>
        <h2 className="text-base font-serif font-bold text-gray-900">Redirigiendo a Personalización...</h2>
        <p className="text-xs text-gray-500 font-light">
          El proceso de pago y envío se completa directamente en el Paso 4 del Personalizador.
        </p>
      </div>
    </div>
  );
}
