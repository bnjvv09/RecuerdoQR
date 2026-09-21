'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#fffafb] flex flex-col items-center justify-center p-4 text-center select-none">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-rose-100 flex flex-col items-center space-y-5 relative overflow-hidden">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-[#a21232] shadow-inner">
          <AlertCircle className="w-8 h-8 text-[#a21232]" />
        </div>

        <div className="space-y-2">
          <h1 className="font-serif text-xl sm:text-2xl font-bold text-gray-900">
            Algo inesperado ocurrió
          </h1>
          <p className="text-xs text-gray-500 font-light leading-relaxed">
            No te preocupes, tus datos e información están seguros. Hubo un pequeño inconveniente al cargar esta vista.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full pt-2">
          <button
            onClick={() => reset()}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-[#a21232] hover:bg-[#850e28] text-white text-xs font-bold rounded-xl shadow-md transition active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reintentar</span>
          </button>
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-rose-50 hover:bg-rose-100 text-[#a21232] text-xs font-bold rounded-xl border border-rose-200 transition active:scale-95"
          >
            <Home className="w-4 h-4" />
            <span>Ir al Inicio</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
