'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, BookOpen, Sparkles } from 'lucide-react';
import { PhotoGalleryProps } from '@/types/gallery';

export default function DigitalAlbum({
  photos,
  primaryColor = '#a21232',
  fontFamily,
  onPhotoClick,
  className = ''
}: PhotoGalleryProps) {
  const [currentPage, setCurrentPage] = useState(0);

  if (!photos || photos.length === 0) {
    return (
      <div className="py-8 text-center text-gray-400 italic text-xs">
        No hay fotografías agregadas al álbum.
      </div>
    );
  }

  // Page 0 can be the Album Cover, pages 1..N are photo pages
  const totalPages = photos.length + 1;

  const nextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  return (
    <div className={`w-full flex flex-col items-center select-none ${className}`}>
      
      {/* Book Container with 3D binding shadow */}
      <div className="relative w-full max-w-[310px] sm:max-w-[340px] aspect-[4/5.2] bg-[#fcfaf7] rounded-2xl shadow-2xl border border-amber-900/10 overflow-hidden flex flex-col justify-between p-4 sm:p-5">
        
        {/* Book Spine Left Shadow */}
        <div className="absolute left-0 inset-y-0 w-4 bg-gradient-to-r from-black/15 via-black/5 to-transparent pointer-events-none z-10"></div>
        {/* Top Paper Header Bar */}
        <div className="flex justify-between items-center text-[8px] font-mono text-gray-400 border-b border-amber-900/10 pb-2">
          <span className="flex items-center gap-1 font-serif uppercase tracking-widest text-amber-900/60 font-bold">
            <BookOpen className="w-3 h-3" />
            Álbum de Recuerdos
          </span>
          <span>
            {currentPage === 0 ? 'Portada' : `Pág. ${currentPage} / ${photos.length}`}
          </span>
        </div>

        {/* Page Content Animation */}
        <div className="flex-1 flex flex-col items-center justify-center my-3 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {currentPage === 0 ? (
              /* Cover Page */
              <motion.div
                key="cover"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full rounded-xl bg-gradient-to-br from-amber-50/80 to-rose-50/50 border border-amber-200/60 p-5 flex flex-col items-center justify-center text-center shadow-inner relative"
              >
                <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-amber-100 flex items-center justify-center mb-3">
                  <Sparkles className="w-6 h-6 text-amber-600" />
                </div>
                <h3 
                  className="font-serif text-lg font-bold text-gray-900 leading-tight mb-1"
                  style={{ fontFamily }}
                >
                  Nuestra Historia en Fotos
                </h3>
                <p className="text-[10px] text-gray-500 font-light mt-1 max-w-[200px]">
                  Un pequeño libro digital con los momentos más felices juntos.
                </p>

                <button
                  type="button"
                  onClick={nextPage}
                  className="mt-5 px-4 py-1.5 rounded-full text-white text-[10px] font-bold shadow-md transition hover:scale-105 active:scale-95 flex items-center gap-1.5"
                  style={{ backgroundColor: primaryColor }}
                >
                  Abrir Álbum
                  <ChevronRight className="w-3 h-3" />
                </button>
              </motion.div>
            ) : (
              /* Photo Page */
              <motion.div
                key={`page-${currentPage}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="w-full h-full flex flex-col items-center justify-between"
              >
                {/* Photo frame */}
                <div 
                  onClick={() => onPhotoClick?.(currentPage - 1)}
                  className="w-full aspect-[4/3.8] rounded-xl overflow-hidden bg-gray-100 shadow-md border-4 border-white cursor-pointer hover:shadow-lg transition relative group"
                >
                  <img
                    src={photos[currentPage - 1]?.url}
                    alt={photos[currentPage - 1]?.caption || `Página ${currentPage}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <span className="absolute bottom-1.5 right-1.5 bg-black/60 text-white text-[7px] px-1.5 py-0.5 rounded font-mono opacity-0 group-hover:opacity-100 transition">
                    Ampliar 🔍
                  </span>
                </div>

                {/* Caption / Dedication */}
                <div className="mt-2 text-center w-full px-2">
                  <p 
                    className="text-xs text-gray-800 font-serif italic leading-relaxed line-clamp-2"
                    style={{ fontFamily }}
                  >
                    &quot;{photos[currentPage - 1]?.caption || 'Un recuerdo que guardamos en el corazón'} &quot;
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Pagination Controls */}
        <div className="flex justify-between items-center pt-2 border-t border-amber-900/10">
          <button
            type="button"
            disabled={currentPage === 0}
            onClick={prevPage}
            className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {/* Dots page indicator */}
          <div className="flex gap-1">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentPage(idx)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  currentPage === idx 
                    ? 'w-4 bg-amber-800' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            disabled={currentPage === totalPages - 1}
            onClick={nextPage}
            className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
}
