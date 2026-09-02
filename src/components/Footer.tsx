import Link from 'next/link';
import { Heart, QrCode, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 border-t border-gray-900 pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-12">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center">
                <QrCode className="w-4 h-4 text-white" />
              </div>
              <span className="font-serif text-lg font-bold tracking-tight text-white flex items-center gap-1">
                Recuerdo<span className="text-rose-500 font-sans">QR</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 font-light leading-relaxed">
              Transformamos tus momentos más bellos en un recuerdo digital interactivo para siempre. El regalo perfecto.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-rose-500 font-medium">
              Hecho con <Heart className="w-3.5 h-3.5 fill-current animate-pulse" /> en Chile
            </div>
          </div>

          {/* Links: Explorer */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">Explorar</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-rose-400 transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/planes" className="hover:text-rose-400 transition-colors">
                  Planes y Precios
                </Link>
              </li>
              <li>
                <Link href="/ejemplos" className="hover:text-rose-400 transition-colors">
                  Ejemplos Reales
                </Link>
              </li>
              <li>
                <Link href="/personalizar" className="hover:text-rose-400 transition-colors">
                  Personalizar QR
                </Link>
              </li>
            </ul>
          </div>

          {/* Links: Legal */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">Soporte y Legal</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <span className="hover:text-rose-400 transition-colors cursor-pointer">
                  Preguntas Frecuentes
                </span>
              </li>
              <li>
                <span className="hover:text-rose-400 transition-colors cursor-pointer">
                  Términos de Servicio
                </span>
              </li>
              <li>
                <span className="hover:text-rose-400 transition-colors cursor-pointer">
                  Políticas de Privacidad
                </span>
              </li>
              <li>
                <span className="hover:text-rose-400 transition-colors cursor-pointer">
                  Garantía de Amor
                </span>
              </li>
            </ul>
          </div>

          {/* Contact info */}
          <div className="space-y-3.5">
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">Contacto</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span className="hover:text-rose-400 transition-colors">soporte@recuerdoqr.cl</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span className="hover:text-rose-400 transition-colors">+56 9 1234 5678</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span className="text-gray-500 font-light">Santiago, Región Metropolitana, Chile</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600 font-light">
          <p>© {new Date().getFullYear()} RecuerdoQR. Todos los derechos reservados.</p>
          <p>Desarrollado con pasión para enamorar.</p>
        </div>
      </div>
    </footer>
  );
}
