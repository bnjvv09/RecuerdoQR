'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { PhotoGalleryProps } from '@/types/gallery';

export default function PolaroidGallery({
  photos,
  primaryColor = '#a21232',
  fontFamily,
  onPhotoClick,
  className = ''
}: PhotoGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'stack' | 'grid'>('stack');

  if (!photos || photos.length === 0) {
    return (
      <div className="py-8 text-center text-gray-400 italic text-xs">
        No hay fotografías agregadas.
      </div>
    );
  }

  const rotations = [-2.5, 1.8, -1.2, 2.2, -1.8, 1.5, -2.0, 2.0];

  return (
    <div className={`w-full flex flex-col items-center select-none ${className}`}>
      
      {/* Mode toggle if multiple photos */}
      {photos.length > 2 && (
        <div className="flex justify-center mb-3">
          <div className="bg-black/5 p-0.5 rounded-full flex gap-1 text-[9px] font-bold">
            <button
              type="button"
              onClick={() => setViewMode('stack')}
              className={`px-2.5 py-1 rounded-full transition ${
                viewMode === 'stack' ? 'bg-white shadow-xs text-gray-900' : 'text-gray-500'
              }`}
            >
              Destacada
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`px-2.5 py-1 rounded-full transition ${
                viewMode === 'grid' ? 'bg-white shadow-xs text-gray-900' : 'text-gray-500'
              }`}
            >
              Mosaico ({photos.length})
            </button>
          </div>
        </div>
      )}

      {viewMode === 'stack' ? (
        <div className="relative w-full max-w-[290px] sm:max-w-[320px] flex flex-col items-center">
          {/* Main Polaroid card */}
          <div className="relative w-full aspect-[4/5] perspective-1000 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, scale: 0.9, rotate: rotations[activeIndex % rotations.length] * 2 }}
                animate={{ opacity: 1, scale: 1, rotate: rotations[activeIndex % rotations.length] }}
                exit={{ opacity: 0, scale: 0.9, rotate: -rotations[activeIndex % rotations.length] }}
                transition={{ type: 'spring', damping: 20, stiffness: 260 }}
                onClick={() => onPhotoClick?.(activeIndex)}
                className="w-full bg-white p-3.5 pb-6 rounded-2xl shadow-xl border border-gray-150/80 cursor-pointer flex flex-col justify-between hover:shadow-2xl hover:scale-[1.02] transition-transform"
                style={{
                  boxShadow: '0 15px 35px -10px rgba(0,0,0,0.15), 0 5px 15px -5px rgba(0,0,0,0.06)'
                }}
              >
                {/* Photo area */}
                <div className="w-full aspect-square rounded-xl overflow-hidden bg-gray-100 relative shadow-inner">
                  <img
                    src={photos[activeIndex]?.url}
                    alt={photos[activeIndex]?.caption || `Recuerdo ${activeIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {/* Gloss shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 pointer-events-none"></div>
                </div>

                {/* Polaroid chin for caption */}
                <div className="pt-3 text-center min-h-[36px] flex items-center justify-center">
                  <p 
                    className="text-xs sm:text-sm text-gray-800 font-serif italic tracking-wide truncate px-1"
                    style={{ fontFamily }}
                  >
                    {photos[activeIndex]?.caption || 'Nuestro momento especial ❤️'}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          {photos.length > 1 && (
            <div className="flex items-center justify-between w-full mt-4 px-2">
              <button
                type="button"
                onClick={() => setActiveIndex((activeIndex - 1 + photos.length) % photos.length)}
                className="p-2 rounded-full bg-white/90 shadow-md border border-gray-150 hover:bg-white text-gray-700 active:scale-95 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="text-[10px] font-bold text-gray-500 font-mono">
                {activeIndex + 1} / {photos.length}
              </span>

              <button
                type="button"
                onClick={() => setActiveIndex((activeIndex + 1) % photos.length)}
                className="p-2 rounded-full bg-white/90 shadow-md border border-gray-150 hover:bg-white text-gray-700 active:scale-95 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Grid mode */
        <div className="grid grid-cols-2 gap-3.5 w-full">
          {photos.map((p, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => onPhotoClick?.(idx)}
              style={{
                transform: `rotate(${rotations[idx % rotations.length]}deg)`
              }}
              className="bg-white p-2.5 pb-4 rounded-xl shadow-md border border-gray-150 cursor-pointer hover:shadow-xl hover:scale-105 hover:z-10 transition-all flex flex-col justify-between"
            >
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 relative shadow-inner">
                <img src={p.url} alt={p.caption || `Foto ${idx + 1}`} className="w-full h-full object-cover" />
              </div>
              <p 
                className="text-[9px] text-gray-800 font-serif italic text-center truncate mt-2 px-0.5"
                style={{ fontFamily }}
              >
                {p.caption || 'Recuerdo ❤️'}
              </p>
            </motion.div>
          ))}
        </div>
      )}

    </div>
  );
}
