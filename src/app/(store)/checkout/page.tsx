'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function CheckoutRedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const orderId = searchParams.get('orderId');
    const status = searchParams.get('status');
    let target = '/personalizar?step=6';
    if (orderId) target += `&orderId=${encodeURIComponent(orderId)}`;
    if (status) target += `&status=${encodeURIComponent(status)}`;
    router.replace(target);
  }, [router, searchParams]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center bg-white p-8 rounded-3xl border border-rose-100 shadow-xl space-y-4">
        <div className="w-10 h-10 border-4 border-rose-200 border-t-[#a21232] rounded-full animate-spin mx-auto"></div>
        <h2 className="text-base font-serif font-bold text-gray-900">Volviendo al Resumen de Pago...</h2>
        <p className="text-xs text-gray-500 font-light">
          Te estamos llevando directamente al Paso 6 para que continúes con tu pedido.
        </p>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="w-10 h-10 border-4 border-rose-200 border-t-[#a21232] rounded-full animate-spin"></div>
      </div>
    }>
      <CheckoutRedirectContent />
    </Suspense>
  );
}
