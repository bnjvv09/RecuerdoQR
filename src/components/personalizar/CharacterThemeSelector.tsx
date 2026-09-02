'use client';

import React, { useState } from 'react';
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
    { id: 'Classic', label: '🐶 Clásicos (5)' }
  ];

  const filteredCharacters = CHARACTERS_DATABASE.filter((char) => {
    const matchesCategory = activeCategory === 'all' || char.franchise === activeCategory;
    const matchesSearch =
      searchQuery === '' ||
      char.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      char.theme.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const selectedChar = CHARACTERS_DATABASE.find((c) => c.id === selectedCharacterId);

  return (
    <div className="space-y-4 animate-fade-in text-left">
      {/* Category Pills */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold transition-all cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-[#a21232] text-white shadow-xs'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-2.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar personaje (ej: Goku, Stitch, Elsa, Mario, Pikachu)..."
          className="w-full bg-white border border-gray-250 rounded-full py-1.5 pl-10 pr-4 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#a21232] focus:ring-1 focus:ring-[#a21232] transition"
        />
      </div>

      {/* Uniform Grid: Every single character has identical dimensions (w-full aspect-square) */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2.5 max-h-[380px] overflow-y-auto pr-1 p-1">
        {filteredCharacters.map((char) => {
          const isSelected = selectedCharacterId === char.id;
          return (
            <div
              key={char.id}
              onClick={() => onSelectCharacter(char)}
              className={`group relative rounded-2xl p-2 cursor-pointer transition-all flex flex-col items-center justify-between text-center border bg-white ${
                isSelected
                  ? 'border-2 border-[#a21232] bg-rose-50/50 shadow-md ring-2 ring-[#a21232]/20 scale-[1.03]'
                  : 'border-gray-200 hover:border-rose-300 hover:shadow-xs'
              }`}
            >
              {/* Selected Checkmark Badge */}
              {isSelected && (
                <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#a21232] text-white flex items-center justify-center shadow-xs z-20">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              )}

              {/* Character Transparent Image Container - STRICT UNIFORM SIZE FOR ALL */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 aspect-square relative flex items-center justify-center my-0.5">
                <div
                  className="absolute w-12 h-12 rounded-full filter blur-md opacity-25"
                  style={{ backgroundColor: char.primary }}
                />
                <img
                  src={`/personajes/${char.file}`}
                  alt={char.name}
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
