'use client';

import { motion } from 'framer-motion';
import { ZoomIn } from 'lucide-react';
import { PhotoGalleryProps } from '@/types/gallery';

export default function MasonryGallery({
  photos,
  fontFamily,
  onPhotoClick,
  className = ''
}: PhotoGalleryProps) {
  if (!photos || photos.length === 0) {
    return (
      <div className="py-8 text-center text-gray-400 italic text-xs">
        No hay fotografías agregadas.
      </div>
    );
  }

  // Split photos into 2 columns for a natural staggered masonry layout
  const col1 = photos.filter((_, idx) => idx % 2 === 0);
  const col2 = photos.filter((_, idx) => idx % 2 === 1);

  // Aspect ratio variations for natural masonry look
  const aspectClasses = ['aspect-[3/4]', 'aspect-[4/3]', 'aspect-[1/1]', 'aspect-[3/4]', 'aspect-[16/9]'];

  return (
    <div className={`w-full ${className}`}>
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5">
        
        {/* Column 1 */}
        <div className="flex flex-col gap-2.5 sm:gap-3.5">
          {col1.map((p, idx) => {
            const originalIndex = idx * 2;
            const aspect = aspectClasses[originalIndex % aspectClasses.length];

            return (
              <motion.div
                key={originalIndex}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                onClick={() => onPhotoClick?.(originalIndex)}
                className={`w-full ${aspect} rounded-2xl overflow-hidden bg-gray-100 shadow-md border border-gray-150 relative group cursor-pointer`}
              >
                <img
                  src={p.url}
                  alt={p.caption || `Foto ${originalIndex + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />

                {/* Hover overlay with caption & zoom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2.5 flex flex-col justify-between">
                  <div className="self-end p-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white">
                    <ZoomIn className="w-3.5 h-3.5" />
                  </div>
                  {p.caption && (
                    <p 
                      className="text-white text-[9px] font-light italic leading-tight truncate"
                      style={{ fontFamily }}
                    >
                      {p.caption}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-2.5 sm:gap-3.5">
          {col2.map((p, idx) => {
            const originalIndex = idx * 2 + 1;
            const aspect = aspectClasses[(originalIndex + 2) % aspectClasses.length];

            return (
              <motion.div
                key={originalIndex}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: (idx + 0.5) * 0.05 }}
                onClick={() => onPhotoClick?.(originalIndex)}
                className={`w-full ${aspect} rounded-2xl overflow-hidden bg-gray-100 shadow-md border border-gray-150 relative group cursor-pointer`}
              >
                <img
                  src={p.url}
                  alt={p.caption || `Foto ${originalIndex + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />

                {/* Hover overlay with caption & zoom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2.5 flex flex-col justify-between">
                  <div className="self-end p-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white">
                    <ZoomIn className="w-3.5 h-3.5" />
                  </div>
                  {p.caption && (
                    <p 
                      className="text-white text-[9px] font-light italic leading-tight truncate"
                      style={{ fontFamily }}
                    >
                      {p.caption}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
