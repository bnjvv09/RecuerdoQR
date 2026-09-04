'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Film, ZoomIn } from 'lucide-react';
import { PhotoGalleryProps } from '@/types/gallery';

export default function FilmStrip({
  photos,
  primaryColor = '#a21232',
  fontFamily,
  onPhotoClick,
  className = ''
}: PhotoGalleryProps) {
  const [orientation, setOrientation] = useState<'horizontal' | 'vertical'>('horizontal');

  if (!photos || photos.length === 0) {
    return (
      <div className="py-8 text-center text-gray-400 italic text-xs">
        No hay fotografías agregadas para la tira.
      </div>
    );
  }

  return (
    <div className={`w-full flex flex-col items-center select-none ${className}`}>
      
      {/* Orientation Toggle */}
      <div className="flex justify-center mb-3">
        <div className="bg-gray-100 p-0.5 rounded-full flex gap-1 text-[9px] font-bold">
          <button
            type="button"
            onClick={() => setOrientation('horizontal')}
            className={`px-3 py-1 rounded-full transition ${
              orientation === 'horizontal' ? 'bg-zinc-900 text-white shadow-xs' : 'text-gray-500'
            }`}
          >
            🎞️ Rollo de Cine
          </button>
          <button
            type="button"
            onClick={() => setOrientation('vertical')}
            className={`px-3 py-1 rounded-full transition ${
              orientation === 'vertical' ? 'bg-zinc-900 text-white shadow-xs' : 'text-gray-500'
            }`}
          >
            📸 Tira Photobooth
          </button>
        </div>
      </div>

      {orientation === 'horizontal' ? (
        /* Cinematic 35mm Film Roll */
        <div className="w-full bg-zinc-950 p-3.5 py-4 rounded-2xl shadow-2xl border-2 border-zinc-800 flex flex-col gap-2 overflow-hidden">
          
          {/* Top Sprocket Holes */}
          <div className="flex justify-between items-center gap-1.5 pb-2 overflow-hidden border-b border-zinc-800">
            <span className="text-[7px] font-mono text-zinc-500 tracking-widest font-bold">SAFETY FILM</span>
            <div className="flex gap-2 flex-1 justify-around overflow-hidden px-2">
              {Array.from({ length: 18 }).map((_, i) => (
                <div key={i} className="w-2.5 h-1.5 bg-zinc-900 border border-zinc-700/80 rounded-xs shrink-0" />
              ))}
            </div>
            <span className="text-[7px] font-mono text-amber-500/80 tracking-widest font-bold">ISO 400</span>
          </div>

          {/* Horizontal Scrolling Frames */}
          <div className="flex gap-3 overflow-x-auto py-1.5 scrollbar-thin scrollbar-thumb-zinc-700">
            {photos.map((p, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.02 }}
                onClick={() => onPhotoClick?.(idx)}
                className="w-48 sm:w-56 shrink-0 bg-zinc-900 p-2 rounded-xl border border-zinc-800 cursor-pointer group shadow-lg flex flex-col justify-between"
              >
                {/* Frame header tag */}
                <div className="flex justify-between items-center text-[7px] font-mono text-zinc-400 mb-1 px-1">
                  <span>FRAME #{(idx + 1).toString().padStart(2, '0')}</span>
                  <span className="text-amber-400/90 font-bold">▶ 24 FPS</span>
                </div>

                {/* Photo */}
                <div className="aspect-[4/3] rounded-lg overflow-hidden bg-black relative">
                  <Image
                    src={p.url}
                    alt={p.caption || `Fotograma ${idx + 1}`}
                    fill
                    sizes="(max-width: 640px) 190px, 240px"
                    loading="lazy"
                    decoding="async"
                    className="object-cover group-hover:opacity-90 transition"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center z-10">
                    <ZoomIn className="w-5 h-5 text-white drop-shadow" />
                  </div>
                </div>

                {/* Caption */}
                {p.caption && (
                  <p 
                    className="text-[9px] text-zinc-300 font-light italic truncate mt-1.5 text-center px-1"
                    style={{ fontFamily }}
                  >
                    {p.caption}
                  </p>
                )}
              </motion.div>
            ))}
          </div>

          {/* Bottom Sprocket Holes */}
          <div className="flex justify-between items-center gap-1.5 pt-2 overflow-hidden border-t border-zinc-800">
            <div className="flex gap-2 flex-1 justify-around overflow-hidden px-2">
              {Array.from({ length: 18 }).map((_, i) => (
                <div key={i} className="w-2.5 h-1.5 bg-zinc-900 border border-zinc-700/80 rounded-xs shrink-0" />
              ))}
            </div>
            <span className="text-[7px] font-mono text-zinc-500 tracking-widest font-bold">KODAK FILM</span>
          </div>

        </div>
      ) : (
        /* Vertical Classic Photobooth Strip */
        <div className="w-full max-w-[260px] bg-white p-3 pt-4 pb-5 rounded-2xl shadow-2xl border border-gray-250 flex flex-col items-center gap-2.5">
          <div className="w-full text-center border-b border-gray-150 pb-1.5">
            <span className="text-[8px] font-serif font-extrabold uppercase tracking-widest text-gray-500">
              Photobooth Moments
            </span>
          </div>

          {photos.map((p, idx) => (
            <div
              key={idx}
              onClick={() => onPhotoClick?.(idx)}
              className="w-full aspect-[4/3.2] bg-gray-100 rounded-lg overflow-hidden shadow-xs border border-gray-200 cursor-pointer hover:shadow-md transition relative group"
            >
              <Image src={p.url} alt={p.caption || `Foto ${idx + 1}`} fill sizes="240px" className="object-cover" />
              {p.caption && (
                <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[8px] p-1 text-center font-light truncate z-10">
                  {p.caption}
                </div>
              )}
            </div>
          ))}

          <span className="text-[7px] font-mono text-gray-400 mt-1 uppercase">
            ❤️ RECUERDO QR PHOTOSTRIP ❤️
          </span>
        </div>
      )}

    </div>
  );
}
