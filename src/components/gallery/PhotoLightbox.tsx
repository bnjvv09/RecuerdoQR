'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { PhotoItem } from '@/types/gallery';

interface PhotoLightboxProps {
  photos: PhotoItem[];
  currentIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function PhotoLightbox({
  photos,
  currentIndex,
  onClose,
  onNavigate
}: PhotoLightboxProps) {
  useEffect(() => {
    if (currentIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') {
        onNavigate((currentIndex - 1 + photos.length) % photos.length);
      }
      if (e.key === 'ArrowRight') {
        onNavigate((currentIndex + 1) % photos.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [currentIndex, photos.length, onClose, onNavigate]);

  if (currentIndex === null || !photos[currentIndex]) return null;

  const currentPhoto = photos[currentIndex];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 select-none"
        onClick={onClose}
      >
        {/* Top bar: Counter & Close button */}
        <div className="absolute top-4 inset-x-4 flex justify-between items-center z-10 max-w-5xl mx-auto">
          <span className="text-white/80 font-mono text-xs px-3 py-1 bg-white/10 rounded-full backdrop-blur-sm">
            {currentIndex + 1} / {photos.length}
          </span>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all shadow-lg backdrop-blur-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Previous Button */}
        {photos.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate((currentIndex - 1 + photos.length) % photos.length);
            }}
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all z-10 backdrop-blur-sm"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Main Image Container */}
        <motion.div
          key={currentIndex}
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.92, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="max-w-4xl max-h-[82vh] flex flex-col items-center justify-center relative"
        >
          <img
            src={currentPhoto.url}
            alt={currentPhoto.caption || `Foto ${currentIndex + 1}`}
            className="max-w-full max-h-[72vh] object-contain rounded-2xl shadow-2xl border border-white/10"
          />

          {currentPhoto.caption && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white/90 text-center text-xs sm:text-sm mt-3 px-4 py-2 bg-black/40 rounded-full backdrop-blur-sm max-w-lg font-light"
            >
              {currentPhoto.caption}
            </motion.p>
          )}
        </motion.div>

        {/* Next Button */}
        {photos.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate((currentIndex + 1) % photos.length);
            }}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all z-10 backdrop-blur-sm"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
