'use client';

import { motion } from 'framer-motion';
import { Check, Sparkles, Lock } from 'lucide-react';
import { PhotoStyle } from '@/types/gallery';
import { toast } from 'sonner';

interface StyleOption {
  id: PhotoStyle;
  name: string;
  icon: string;
  desc: string;
  preview: React.ReactNode;
}

interface PhotoStyleSelectorProps {
  selectedPlan?: string;
  selectedStyle: PhotoStyle;
  onSelectStyle: (style: PhotoStyle) => void;
  secondaryStyle?: PhotoStyle | null;
  onSelectSecondaryStyle?: (style: PhotoStyle | null) => void;
  enableDualStyle?: boolean;
  onToggleDualStyle?: (enable: boolean) => void;
  primaryColor?: string;
  className?: string;
}

export default function PhotoStyleSelector({
  selectedPlan = 'medium',
  selectedStyle,
  onSelectStyle,
  secondaryStyle,
  onSelectSecondaryStyle,
  enableDualStyle = false,
  onToggleDualStyle,
  primaryColor = '#a21232',
  className = ''
}: PhotoStyleSelectorProps) {

  const STYLE_OPTIONS: StyleOption[] = [
    {
      id: 'polaroid',
      name: 'Polaroid Clásico',
      icon: '📸',
      desc: 'Fotos con marco blanco y dedicatoria manuscrita.',
      preview: (
        <div className="w-full h-full flex items-center justify-center p-2 bg-gradient-to-br from-rose-50/40 to-amber-50/40 relative overflow-hidden">
          <div className="w-16 aspect-[4/5] bg-white p-1 pb-3 rounded-md shadow-md border border-gray-200 -rotate-8 absolute left-4 transform">
            <div className="w-full aspect-square bg-gradient-to-tr from-rose-400 to-pink-300 rounded-xs"></div>
          </div>
          <div className="w-18 aspect-[4/5] bg-white p-1 pb-3.5 rounded-md shadow-lg border border-gray-200 rotate-6 z-10 relative">
            <div className="w-full aspect-square bg-gradient-to-tr from-rose-500 to-amber-400 rounded-xs"></div>
            <div className="h-1 w-8 bg-gray-200 rounded mx-auto mt-1"></div>
          </div>
        </div>
      )
    },
    {
      id: 'collage',
      name: 'Collage / Cuadrícula',
      icon: '📐',
      desc: 'Mosaico visual ordenado con efecto zoom.',
      preview: (
        <div className="w-full h-full p-2.5 grid grid-cols-2 gap-1.5 bg-gradient-to-br from-rose-50/30 to-purple-50/30">
          <div className="bg-gradient-to-tr from-rose-400 to-pink-500 rounded-md shadow-xs"></div>
          <div className="bg-gradient-to-tr from-amber-400 to-rose-400 rounded-md shadow-xs"></div>
          <div className="bg-gradient-to-tr from-purple-400 to-indigo-400 rounded-md shadow-xs"></div>
          <div className="bg-gradient-to-tr from-pink-400 to-rose-400 rounded-md shadow-xs"></div>
        </div>
      )
    },
    {
      id: 'album',
      name: 'Álbum Digital',
      icon: '📖',
      desc: 'Álbum interactivo para pasar página a página.',
      preview: (
        <div className="w-full h-full flex items-center justify-center p-2 bg-gradient-to-br from-amber-50/60 to-stone-100/60 relative">
          <div className="w-36 h-20 bg-[#fdfbf7] rounded-lg shadow-md border border-amber-900/15 flex overflow-hidden relative">
            <div className="w-1/2 p-1.5 border-r border-amber-900/10 flex flex-col justify-between">
              <div className="w-full aspect-[4/3] bg-gradient-to-tr from-amber-500 to-rose-400 rounded-xs shadow-inner"></div>
              <div className="h-1 w-6 bg-amber-900/20 rounded"></div>
            </div>
            <div className="w-1/2 p-1.5 flex flex-col justify-between">
              <div className="w-full aspect-[4/3] bg-gradient-to-tr from-rose-400 to-pink-400 rounded-xs shadow-inner"></div>
              <div className="h-1 w-10 bg-amber-900/20 rounded"></div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'filmstrip',
      name: 'Tira de Fotos / Carrete',
      icon: '🎞️',
      desc: 'Tira clásica de película cinematográfica.',
      preview: (
        <div className="w-full h-full flex items-center justify-center p-2 bg-zinc-900 rounded-lg">
          <div className="flex gap-1.5">
            <div className="w-12 h-16 bg-gradient-to-tr from-rose-500 to-pink-500 rounded-xs"></div>
            <div className="w-12 h-16 bg-gradient-to-tr from-amber-500 to-rose-400 rounded-xs"></div>
          </div>
        </div>
      )
    },
    {
      id: 'carousel',
      name: 'Carrusel Deslizante',
      icon: '🎠',
      desc: 'Fotos grandes en pantalla con deslizamiento suave.',
      preview: (
        <div className="w-full h-full flex items-center justify-center p-2 bg-gradient-to-br from-sky-50/50 to-indigo-50/50">
          <div className="w-32 h-20 bg-white rounded-xl shadow-md p-1 border border-indigo-100 flex items-center justify-center">
            <div className="w-full h-full bg-gradient-to-tr from-sky-400 to-indigo-500 rounded-lg"></div>
          </div>
        </div>
      )
    },
    {
      id: 'masonry',
      name: 'Muro Pinterest (Masonry)',
      icon: '🧱',
      desc: 'Distribución asimétrica moderna y elegante.',
      preview: (
        <div className="w-full h-full p-2 flex gap-1.5 bg-gradient-to-br from-emerald-50/30 to-teal-50/30">
          <div className="w-1/2 space-y-1.5">
            <div className="h-12 bg-gradient-to-tr from-teal-400 to-emerald-500 rounded-md"></div>
            <div className="h-8 bg-gradient-to-tr from-emerald-500 to-teal-600 rounded-md"></div>
          </div>
          <div className="w-1/2 space-y-1.5">
            <div className="h-8 bg-gradient-to-tr from-teal-500 to-cyan-500 rounded-md"></div>
            <div className="h-12 bg-gradient-to-tr from-cyan-400 to-teal-500 rounded-md"></div>
          </div>
        </div>
      )
    }
  ];

  const isBasic = selectedPlan === 'basic';
  const isPremium = selectedPlan === 'premium';

  return (
    <div className={`space-y-4 ${className}`}>
      
      {/* Premium Combined Mode Toggle */}
      {isPremium && onToggleDualStyle && (
        <div className="bg-gradient-to-r from-amber-50 to-rose-50 border border-amber-200/80 rounded-2xl p-4 flex items-center justify-between shadow-xs">
          <div className="space-y-0.5">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-900">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>✨ Exclusivo Plan Máximo: Combinar 2 Estilos de Fotos</span>
            </span>
            <p className="text-[10px] text-amber-700 font-light">
              Muestra unas fotos en Polaroid y otras en Collage / Carrete para una experiencia más variada.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={enableDualStyle}
              onChange={(e) => onToggleDualStyle(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#a21232]"></div>
          </label>
        </div>
      )}

      {/* Style Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        {STYLE_OPTIONS.map((style) => {
          const isAllowedInBasic = style.id === 'polaroid' || style.id === 'collage';
          const isLocked = isBasic && !isAllowedInBasic;
          const isPrimary = selectedStyle === style.id;
          const isSecondary = enableDualStyle && secondaryStyle === style.id;
          const isSelected = isPrimary || isSecondary;

          return (
            <motion.div
              key={style.id}
              whileHover={isLocked ? {} : { scale: 1.02 }}
              whileTap={isLocked ? {} : { scale: 0.98 }}
              onClick={() => {
                if (isLocked) {
                  toast.error('Este estilo de galería requiere Plan Medio o Plan Máximo.');
                  return;
                }
                if (enableDualStyle && onSelectSecondaryStyle) {
                  if (isPrimary) return;
                  onSelectSecondaryStyle(secondaryStyle === style.id ? null : style.id);
                } else {
                  onSelectStyle(style.id);
                }
              }}
              className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 border text-left flex flex-col ${
                isLocked
                  ? 'opacity-40 border-gray-200 bg-gray-50 cursor-not-allowed'
                  : isSelected
                  ? 'border-2 border-[#a21232] bg-white shadow-md ring-2 ring-[#a21232]/15'
                  : 'border-gray-200 bg-white hover:border-rose-300 hover:shadow-xs'
              }`}
            >
              {/* Lock Badge for Basic */}
              {isLocked && (
                <div className="absolute top-2 right-2 z-20 bg-gray-800 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                  <Lock className="w-2.5 h-2.5" />
                  <span>Plan Medio+</span>
                </div>
              )}

              {/* Selection Badges */}
              {isPrimary && (
                <div className="absolute top-2 right-2 z-20 bg-[#a21232] text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                  <span>{enableDualStyle ? 'Estilo 1' : 'Seleccionado'}</span>
                </div>
              )}

              {isSecondary && (
                <div className="absolute top-2 right-2 z-20 bg-amber-600 text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                  <span>Estilo 2</span>
                </div>
              )}

              {/* Visual Preview */}
              <div className="h-28 w-full border-b border-gray-100 bg-gray-50/50 relative">
                {style.preview}
              </div>

              {/* Description */}
              <div className="p-3.5 space-y-1">
                <h4 className="font-serif font-bold text-xs text-gray-900 flex items-center gap-1.5">
                  <span>{style.icon}</span>
                  <span>{style.name}</span>
                </h4>
                <p className="text-[10px] text-gray-500 font-light leading-relaxed">
                  {style.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
