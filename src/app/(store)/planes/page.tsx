'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getProducts, Product } from '@/lib/db';
import { CheckCircle, ShieldCheck, Heart, Sparkles, Send } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PlanesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts().then((data) => {
      setProducts(data);
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
            const isFeatured = product.badge || product.id === 'medium';
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`bg-white rounded-3xl p-8 border ${
                  isFeatured
                    ? 'border-rose-400 shadow-xl relative md:scale-105 z-10'
                    : 'border-rose-100 shadow-md'
                } flex flex-col justify-between text-left`}
              >
                {product.badge && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-rose-500 to-red-500 text-white text-[10px] font-extrabold tracking-widest rounded-full uppercase shadow-md">
                    {product.badge}
                  </span>
                )}

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

                  <div className="flex items-baseline gap-1.5 mb-8">
                    <span className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                      ${Number(product.price).toLocaleString('es-CL')}
                    </span>
                    <span className="text-xs text-gray-400 font-semibold uppercase">CLP</span>
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
