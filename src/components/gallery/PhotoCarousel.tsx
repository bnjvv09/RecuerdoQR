'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { PhotoGalleryProps } from '@/types/gallery';

export default function PhotoCarousel({
  photos,
  primaryColor = '#a21232',
  fontFamily,
  onPhotoClick,
  className = ''
}: PhotoGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!photos || photos.length === 0) {
    return (
      <div className="py-8 text-center text-gray-400 italic text-xs">
        No hay fotografías agregadas.
      </div>
    );
  }

  const prevPhoto = () => {
    setCurrentIndex((currentIndex - 1 + photos.length) % photos.length);
  };

  const nextPhoto = () => {
    setCurrentIndex((currentIndex + 1) % photos.length);
  };

  const prevIndex = (currentIndex - 1 + photos.length) % photos.length;
  const nextIndex = (currentIndex + 1) % photos.length;

  return (
    <div className={`w-full flex flex-col items-center select-none overflow-hidden ${className}`}>
      
      {/* 3D Peek Carousel Track */}
      <div className="relative w-full max-w-[340px] aspect-[4/4.8] flex items-center justify-center my-2">
        
        {/* Left Peek Photo (if > 1 photo) */}
        {photos.length > 1 && (
          <div
            onClick={prevPhoto}
            className="absolute -left-12 sm:-left-8 w-44 aspect-[3/4] rounded-2xl overflow-hidden opacity-40 scale-85 blur-[0.5px] cursor-pointer shadow-md border border-gray-200 transition-all z-0"
          >
            <img src={photos[prevIndex]?.url} alt="Anterior" className="w-full h-full object-cover" />
          </div>
        )}

        {/* Center Active Main Photo */}
        <div className="relative w-[78%] aspect-[4/4.6] z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              onClick={() => onPhotoClick?.(currentIndex)}
              className="w-full h-full bg-white p-3 rounded-2xl shadow-2xl border border-gray-200 cursor-pointer flex flex-col justify-between group hover:shadow-3xl transition"
            >
              {/* Photo Area */}
              <div className="w-full aspect-square rounded-xl overflow-hidden bg-gray-100 relative shadow-inner">
                <img
                  src={photos[currentIndex]?.url}
                  alt={photos[currentIndex]?.caption || `Foto ${currentIndex + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <div className="p-2 rounded-full bg-white/80 backdrop-blur-sm text-gray-800 shadow">
                    <ZoomIn className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Caption */}
              <div className="pt-2 text-center">
                <p 
                  className="text-xs text-gray-800 font-serif italic truncate"
                  style={{ fontFamily }}
                >
                  {photos[currentIndex]?.caption || `Recuerdo ${currentIndex + 1}`}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Peek Photo (if > 1 photo) */}
        {photos.length > 1 && (
          <div
            onClick={nextPhoto}
            className="absolute -right-12 sm:-right-8 w-44 aspect-[3/4] rounded-2xl overflow-hidden opacity-40 scale-85 blur-[0.5px] cursor-pointer shadow-md border border-gray-200 transition-all z-0"
          >
            <img src={photos[nextIndex]?.url} alt="Siguiente" className="w-full h-full object-cover" />
          </div>
        )}

      </div>

      {/* Controls & Dots */}
      {photos.length > 1 && (
        <div className="flex items-center justify-between w-full max-w-[260px] mt-3 px-2">
          <button
            type="button"
            onClick={prevPhoto}
            className="p-2 rounded-full bg-white shadow-sm border border-gray-200 text-gray-700 hover:bg-gray-50 active:scale-95 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Indicator dots */}
          <div className="flex gap-1.5 overflow-x-auto py-1 max-w-[120px]">
            {photos.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`w-1.5 h-1.5 rounded-full transition-all shrink-0 ${
                  currentIndex === idx 
                    ? 'w-4 bg-[#a21232]' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                style={{ backgroundColor: currentIndex === idx ? primaryColor : undefined }}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={nextPhoto}
            className="p-2 rounded-full bg-white shadow-sm border border-gray-200 text-gray-700 hover:bg-gray-50 active:scale-95 transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
}
