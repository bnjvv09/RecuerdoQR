'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { CHARACTERS_DATABASE, CharacterTheme } from '@/data/charactersData';
import { Search, Check } from 'lucide-react';

interface CharacterThemeSelectorProps {
  selectedCharacterId?: number | null;
  onSelectCharacter: (character: CharacterTheme) => void;
}

export default function CharacterThemeSelector({
  selectedCharacterId,
  onSelectCharacter
}: CharacterThemeSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: 'Todos (145)' },
    { id: 'Disney', label: '✨ Disney (25)' },
    { id: 'Anime', label: '🔥 Anime (40)' },
    { id: 'Marvel', label: '🦸 Marvel (28)' },
    { id: 'DC', label: '🦇 DC (10)' },
    { id: 'Gaming', label: '🎮 Videojuegos (19)' },
    { id: 'Pixar/Animation', label: '🚀 Pixar (14)' },
    { id: 'Sanrio/Anime', label: '🎀 Sanrio (4)' },
    { id: 'Classic', label: '🐶 Clásicos (5)' },
  ];

  const filteredCharacters = CHARACTERS_DATABASE.filter((char) => {
    const matchesCategory = activeCategory === 'all' || char.franchise === activeCategory;
    const matchesSearch =
      char.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      char.theme.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar personaje o anime (ej: Goku, Stitch, Spiderman)..."
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#a21232]/20"
          />
        </div>

        {/* Category Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#a21232] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Characters */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5 max-h-[360px] overflow-y-auto p-1 pr-2 scrollbar-thin">
        {filteredCharacters.map((char) => {
          const isSelected = selectedCharacterId === char.id;

          return (
            <div
              key={char.id}
              onClick={() => onSelectCharacter(char)}
              className={`group relative p-2 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col items-center text-center justify-between ${
                isSelected
                  ? 'border-[#a21232] bg-rose-50/50 shadow-md ring-2 ring-[#a21232]/20 scale-102'
                  : 'border-gray-200/80 bg-white hover:border-rose-200 hover:shadow-xs'
              }`}
            >
              {/* Selected Checkmark Badge */}
              {isSelected && (
                <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#a21232] text-white flex items-center justify-center shadow-xs z-20">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              )}

              {/* Character Transparent Image Container */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 aspect-square relative flex items-center justify-center my-0.5">
                <div
                  className="absolute w-12 h-12 rounded-full filter blur-md opacity-25"
                  style={{ backgroundColor: char.primary }}
                />
                <Image
                  src={`/personajes/${char.file}`}
                  alt={char.name}
                  width={80}
                  height={80}
                  className="relative z-10 w-full h-full object-contain p-1 drop-shadow-xs group-hover:scale-110 transition-transform duration-200"
                />
              </div>

              {/* Character Label */}
              <div className="w-full">
                <h4 className="font-bold text-[10px] sm:text-[11px] text-gray-900 line-clamp-1">
                  {char.name}
                </h4>
                <p className="text-[8px] sm:text-[9px] font-medium line-clamp-1" style={{ color: char.primary }}>
                  {char.theme}
                </p>
              </div>
            </div>
          );
        })}

        {filteredCharacters.length === 0 && (
          <div className="col-span-full py-10 text-center text-xs text-gray-400 font-light">
            No se encontraron personajes para &quot;{searchQuery}&quot;.
          </div>
        )}
      </div>
    </div>
  );
}
