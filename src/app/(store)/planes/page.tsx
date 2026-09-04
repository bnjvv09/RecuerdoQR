'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getProducts, Product, getLaunchPromo, LaunchPromoConfig } from '@/lib/db';
import { CheckCircle, ShieldCheck, Heart, Sparkles, Send, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PlanesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [launchPromo, setLaunchPromo] = useState<LaunchPromoConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getProducts(),
      getLaunchPromo()
    ]).then(([productsData, promoData]) => {
      setProducts(productsData);
      setLaunchPromo(promoData);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="py-16 md:py-24 bg-gradient-to-b from-rose-50/30 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Header */}
        <div className="max-w-3xl mx-auto mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-100 text-rose-600 text-xs font-semibold uppercase tracking-wider"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Experiencias Permanentes
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl sm:text-5xl font-bold text-gray-900"
          >
            Nuestros Planes y Precios
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 text-base sm:text-lg font-light max-w-xl mx-auto"
          >
            Elige el formato perfecto para entregar tu mensaje. Todos los planes incluyen alojamiento de por vida de la página web de amor.
          </motion.p>
        </div>

        {/* Planes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 items-stretch">
          {products.map((product, idx) => {
            const isPromoActive = product.id === 'premium' && Boolean(launchPromo?.isActive);
            const isFeatured = isPromoActive || product.badge || product.id === 'medium';
            const displayPrice = isPromoActive ? (launchPromo?.promoPrice || 6990) : product.price;

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`bg-white rounded-3xl p-8 border ${
                  isPromoActive
                    ? 'border-amber-400 shadow-2xl relative md:scale-105 z-20 ring-2 ring-amber-400/30'
                    : isFeatured
                    ? 'border-rose-400 shadow-xl relative md:scale-105 z-10'
                    : 'border-rose-100 shadow-md'
                } flex flex-col justify-between text-left`}
              >
                {isPromoActive ? (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-amber-500 via-rose-500 to-red-500 text-white text-[10px] font-extrabold tracking-widest rounded-full uppercase shadow-lg animate-pulse flex items-center gap-1.5 whitespace-nowrap">
                    <Flame className="w-3.5 h-3.5 fill-white" />
                    <span>OFERTA DE LANZAMIENTO ({launchPromo?.remainingSlots} CUPOS)</span>
                  </span>
                ) : product.badge ? (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-rose-500 to-red-500 text-white text-[10px] font-extrabold tracking-widest rounded-full uppercase shadow-md">
                    {product.badge}
                  </span>
                ) : null}

                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-serif text-2xl font-bold text-gray-900">{product.name}</h3>
                    <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500">
                      {product.id === 'basic' ? (
                        <Sparkles className="w-5 h-5" />
                      ) : product.id === 'medium' ? (
                        <Heart className="w-5 h-5 fill-rose-500" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </div>
                  </div>

                  {product.subtitle && product.subtitle !== product.description && (
                    <p className="text-xs font-semibold text-rose-600 mb-3">
                      {product.subtitle}
                    </p>
                  )}

                  <p className="text-gray-500 text-xs font-light mb-6 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Pricing Section */}
                  <div className="mb-8">
                    <div className="flex items-baseline gap-2">
                      <span className={`text-3xl sm:text-4xl font-extrabold ${isPromoActive ? 'text-[#a21232]' : 'text-gray-900'}`}>
                        ${Number(displayPrice).toLocaleString('es-CL')}
                      </span>
                      {isPromoActive && (
                        <span className="text-sm text-gray-400 line-through font-semibold">
                          ${Number(launchPromo?.regularPrice || 7990).toLocaleString('es-CL')}
                        </span>
                      )}
                      <span className="text-xs text-gray-400 font-semibold uppercase">CLP</span>
                    </div>

                    {/* Barra interactiva de cupos restantes en Oferta de Lanzamiento */}
                    {isPromoActive && launchPromo && (
                      <div className="mt-3 p-3 bg-gradient-to-r from-amber-50/80 via-rose-50/60 to-amber-50/80 rounded-2xl border border-amber-300/80 shadow-2xs space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-bold">
                          <span className="text-rose-900 flex items-center gap-1">
                            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
                            <span>¡Quedan pocos cupos de estreno!</span>
                          </span>
                          <span className="text-amber-900 bg-amber-200/70 px-2 py-0.5 rounded-full font-extrabold text-[9px]">
                            {launchPromo.remainingSlots} de {launchPromo.totalSlots} disponibles
                          </span>
                        </div>
                        <div className="w-full bg-amber-200/50 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-amber-500 to-rose-500 h-full rounded-full transition-all duration-500" 
                            style={{ width: `${Math.max(10, Math.min(100, (launchPromo.remainingSlots / launchPromo.totalSlots) * 100))}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-rose-50 pt-6 mb-8">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                      ¿Qué incluye?
                    </h4>
                    <ul className="space-y-3.5">
                      {product.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2.5 text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <Link
                  href={`/personalizar?plan=${product.id}`}
                  className={`w-full py-4 text-center font-bold rounded-2xl transition shadow-md cursor-pointer ${
                    isFeatured
                      ? 'bg-gradient-to-r from-rose-500 to-red-500 text-white hover:from-rose-600 hover:to-red-600 hover:shadow-lg'
                      : 'bg-rose-50 text-rose-600 hover:bg-rose-100/70 border border-rose-200'
                  }`}
                >
                  Comprar {product.name}
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Garantías adicionales */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 md:p-8 border border-rose-100/50 shadow-sm flex flex-col md:flex-row justify-around items-center gap-6">
          <div className="flex items-center gap-3 text-left">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 text-sm">Transacción 100% Segura</h4>
              <p className="text-xs text-gray-400 font-light">Procesado de forma segura por Mercado Pago.</p>
            </div>
          </div>

          <div className="hidden md:block h-10 w-[1px] bg-rose-100"></div>

          <div className="flex items-center gap-3 text-left">
            <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 shrink-0">
              <Heart className="w-6 h-6 fill-rose-500" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 text-sm">Garantía de Amor</h4>
              <p className="text-xs text-gray-400 font-light">Si a tu pareja no le gusta, te devolvemos tu dinero.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
