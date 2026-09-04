'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Layers, Grid } from 'lucide-react';
import { PhotoGalleryProps } from '@/types/gallery';

export default function PolaroidGallery({
  photos,
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

  // Pre-calculated slight rotations for organic polaroid feel
  const rotations = [-2.5, 3, -1.5, 2, -3, 1.5, -2, 2.5];

  return (
    <div className={`w-full flex flex-col items-center ${className}`}>
      
      {/* View Toggle */}
      {photos.length > 1 && (
        <div className="flex items-center gap-1 mb-4 bg-gray-100 p-1 rounded-full text-xs self-end">
          <button
            type="button"
            onClick={() => setViewMode('stack')}
            className={`p-1.5 rounded-full transition ${
              viewMode === 'stack' ? 'bg-white shadow-xs text-gray-900 font-bold' : 'text-gray-500 hover:text-gray-900'
            }`}
            title="Pila Interactiva"
          >
            <Layers className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-full transition ${
              viewMode === 'grid' ? 'bg-white shadow-xs text-gray-900 font-bold' : 'text-gray-500 hover:text-gray-900'
            }`}
            title="Mosaico Cuadrícula"
          >
            <Grid className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Stack / Single Carousel Mode */}
      {viewMode === 'stack' ? (
        <div className="w-full max-w-[290px] flex flex-col items-center select-none">
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
                  {photos[activeIndex]?.url && (
                    <Image
                      src={photos[activeIndex].url}
                      alt={photos[activeIndex]?.caption || `Recuerdo ${activeIndex + 1}`}
                      fill
                      sizes="280px"
                      priority
                      className="object-cover"
                    />
                  )}
                  {/* Gloss shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 pointer-events-none z-10"></div>
                </div>

                {/* Polaroid chin for caption */}
                {photos[activeIndex]?.caption?.trim() ? (
                  <div className="pt-3 text-center min-h-[36px] flex items-center justify-center">
                    <p 
                      className="text-xs sm:text-sm text-gray-800 font-serif italic tracking-wide truncate px-1"
                      style={{ fontFamily }}
                    >
                      {photos[activeIndex].caption}
                    </p>
                  </div>
                ) : (
                  <div className="pt-2 min-h-[16px]" />
                )}
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
                {p.url && (
                  <Image 
                    src={p.url} 
                    alt={p.caption || `Foto ${idx + 1}`} 
                    fill 
                    sizes="(max-width: 640px) 140px, 180px"
                    loading="lazy"
                    decoding="async"
                    className="object-cover" 
                  />
                )}
              </div>
              {p.caption?.trim() && (
                <p 
                  className="text-[9px] text-gray-800 font-serif italic text-center truncate mt-2 px-0.5"
                  style={{ fontFamily }}
                >
                  {p.caption}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      )}

    </div>
  );
}
