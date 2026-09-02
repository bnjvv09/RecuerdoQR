import Link from 'next/link';
import { Heart, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col items-center justify-center p-4 text-center select-none">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-rose-100 flex flex-col items-center space-y-4 relative overflow-hidden">
        <div className="w-20 h-20 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-[#a21232] animate-pulse shadow-inner">
          <Heart className="w-10 h-10 fill-[#a21232]" />
        </div>

        <div className="space-y-1.5">
          <span className="text-4xl font-extrabold text-[#a21232] tracking-wider">404</span>
          <h1 className="font-serif text-xl sm:text-2xl font-bold text-gray-900">
            Página o Recuerdo no encontrado
          </h1>
          <p className="text-xs text-gray-500 font-light leading-relaxed">
            El enlace que buscas no existe o quizás el código QR pertenece a otra experiencia personalizada.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 w-full pt-2">
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-[#a21232] hover:bg-[#850e28] text-white text-xs font-bold rounded-xl shadow-md transition active:scale-95"
          >
            <Home className="w-4 h-4" />
            <span>Ir al Inicio</span>
          </Link>
          <Link
            href="/personalizar"
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-rose-50 hover:bg-rose-100 text-[#a21232] text-xs font-bold rounded-xl border border-rose-200 transition active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Crear Experiencia</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
