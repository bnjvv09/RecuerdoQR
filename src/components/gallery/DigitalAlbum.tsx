'use client';

import Image from 'next/image';
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

  const totalPages = photos.length; // Page 0 is cover, 1..N are photos

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  return (
    <div className={`w-full flex flex-col items-center select-none ${className}`}>
      
      {/* Book Container with realistic spine & shadow */}
      <div className="relative w-full max-w-[340px] aspect-[4/4.8] perspective-1000 my-2">
        <div 
          className="w-full h-full rounded-2xl p-4 flex flex-col justify-between shadow-2xl border transition-all duration-300 relative overflow-hidden"
          style={{
            backgroundColor: '#ffffff',
            borderColor: `${primaryColor}30`,
            boxShadow: '0 20px 40px -15px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.05)'
          }}
        >
          {/* Book Spine Texture Gradient on Left */}
          <div className="absolute left-0 inset-y-0 w-4 bg-gradient-to-r from-black/20 via-black/5 to-transparent pointer-events-none z-20"></div>

          {/* Page Turn Content */}
          <div className="flex-1 flex flex-col justify-between relative pl-2">
            <AnimatePresence mode="wait">
              {currentPage === 0 ? (
                /* Cover Page */
                <motion.div
                  key="cover"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="w-full h-full flex flex-col items-center justify-center text-center p-4 border-2 border-dashed rounded-xl"
                  style={{ borderColor: `${primaryColor}40` }}
                >
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3 shadow-md" style={{ backgroundColor: primaryColor }}>
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-gray-900 mb-1" style={{ fontFamily }}>
                    Nuestro Álbum de Recuerdos
                  </h3>
                  <p className="text-[11px] text-gray-500 font-light max-w-[200px] mb-4">
                    {photos.length} momentos únicos que cuentan nuestra historia ❤️
                  </p>
                  <button
                    type="button"
                    onClick={nextPage}
                    className="px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-md hover:scale-105 active:scale-95 transition"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Abrir Álbum ✨
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
                    {photos[currentPage - 1]?.url && (
                      <Image
                        src={photos[currentPage - 1].url}
                        alt={photos[currentPage - 1]?.caption || `Página ${currentPage}`}
                        fill
                        sizes="300px"
                        className="object-cover group-hover:scale-105 transition duration-300"
                      />
                    )}
                    <span className="absolute bottom-1.5 right-1.5 bg-black/60 text-white text-[7px] px-1.5 py-0.5 rounded font-mono opacity-0 group-hover:opacity-100 transition z-10">
                      Ampliar 🔍
                    </span>
                  </div>

                  {/* Caption / Dedication */}
                  {photos[currentPage - 1]?.caption?.trim() && (
                    <div className="mt-2 text-center w-full px-2">
                      <p 
                        className="text-xs text-gray-800 font-serif italic leading-relaxed line-clamp-2"
                        style={{ fontFamily }}
                      >
                        &quot;{photos[currentPage - 1].caption}&quot;
                      </p>
                    </div>
                  )}
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
              {Array.from({ length: totalPages + 1 }).map((_, idx) => (
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
              disabled={currentPage === totalPages}
              onClick={nextPage}
              className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
