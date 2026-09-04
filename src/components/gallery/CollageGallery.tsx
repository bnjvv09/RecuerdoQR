'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Cake, PartyPopper, Flame, Smile, Baby } from 'lucide-react';
import { PhotoGalleryProps } from '@/types/gallery';

export default function CollageGallery({
  photos,
  theme = 'anniversary',
  primaryColor = '#a21232',
  fontFamily,
  onPhotoClick,
  className = ''
}: PhotoGalleryProps) {
  if (!photos || photos.length === 0) {
    return (
      <div className="py-8 text-center text-gray-400 italic text-xs">
        No hay fotografías agregadas para el collage.
      </div>
    );
  }

  // Preset rotations for collage scrap-book feeling
  const rotations = [-3, 2, -1.5, 3.5, -2, 1.5, -3.5, 2.5];

  const getThemeStickers = () => {
    switch (theme) {
      case 'birthday':
        return ['🎈', '🎂', '🎉', '🎁', '✨'];
      case 'pregnancy':
        return ['👶', '🍼', '⭐', '☁️', '💛'];
      case 'special':
      case 'gratitude':
        return ['✨', '🌸', '💐', '💫', '💖'];
      default: // Romantic / Anniversary
        return ['❤️', '🌹', '💌', '✨', '💍'];
    }
  };

  const stickers = getThemeStickers();

  return (
    <div className={`w-full relative py-2 ${className}`}>
      
      {/* Background thematic decorative stickers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <span className="absolute top-2 left-1 text-base opacity-40 animate-pulse">{stickers[0]}</span>
        <span className="absolute top-8 right-2 text-lg opacity-50">{stickers[1]}</span>
        <span className="absolute bottom-4 left-3 text-base opacity-45">{stickers[2]}</span>
        <span className="absolute bottom-8 right-4 text-base opacity-40 animate-pulse">{stickers[3]}</span>
      </div>

      {/* Scrapboard Collage Layout */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 relative z-10">
        {photos.map((p, idx) => {
          const rot = rotations[idx % rotations.length];
          const isWide = idx % 5 === 0 && idx !== 0;

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.06 }}
              whileHover={{ scale: 1.04, rotate: 0, zIndex: 20 }}
              onClick={() => onPhotoClick?.(idx)}
              style={{ transform: `rotate(${rot}deg)` }}
              className={`bg-white p-2.5 rounded-2xl shadow-lg border border-gray-150 cursor-pointer relative group transition-shadow ${
                isWide ? 'col-span-2' : 'col-span-1'
              }`}
            >
              {/* Washi Tape / Pin Decorator */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-3 bg-amber-100/80 border border-amber-200/60 rounded-xs -rotate-2 shadow-xs z-10 pointer-events-none opacity-85"></div>

              {/* Photo */}
              <div className={`w-full ${isWide ? 'aspect-[16/9]' : 'aspect-square'} rounded-xl overflow-hidden bg-gray-100 relative shadow-inner`}>
                <Image
                  src={p.url}
                  alt={p.caption || `Recuerdo ${idx + 1}`}
                  fill
                  sizes={isWide ? "(max-width: 768px) 100vw, 400px" : "(max-width: 768px) 50vw, 200px"}
                  loading="lazy"
                  decoding="async"
                  className="object-cover group-hover:scale-105 transition duration-300"
                />
              </div>

              {/* Caption or Mini Stamp */}
              <div className="mt-2 flex items-center justify-between px-1">
                {p.caption?.trim() ? (
                  <p 
                    className="text-[9px] text-gray-700 font-serif italic truncate flex-1"
                    style={{ fontFamily }}
                  >
                    {p.caption}
                  </p>
                ) : (
                  <div className="flex-1" />
                )}
                <span className="text-[10px] ml-1 shrink-0 opacity-70">
                  {stickers[idx % stickers.length]}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

    </div>
  );
}
