export interface FontOption {
  id: string;
  name: string;
  category: 'Cursiva' | 'Elegante' | 'Moderna';
  family: string;
  sample: string;
  tag: string;
}

export const FONT_OPTIONS: FontOption[] = [
  // Cursivas y Caligráficas
  { id: 'great-vibes', name: 'Great Vibes', category: 'Cursiva', family: "'Great Vibes', cursive", sample: 'Te amo para siempre', tag: 'Boda & Amor' },
  { id: 'dancing-script', name: 'Dancing Script', category: 'Cursiva', family: "'Dancing Script', cursive", sample: 'Nuestra linda historia', tag: 'Espontánea' },
  { id: 'caveat', name: 'Caveat', category: 'Cursiva', family: "'Caveat', cursive", sample: 'Carta escrita a mano', tag: 'Manuscrita' },
  { id: 'sacramento', name: 'Sacramento', category: 'Cursiva', family: "'Sacramento', cursive", sample: 'Siempre a tu lado', tag: 'Fina & Romántica' },
  { id: 'parisienne', name: 'Parisienne', category: 'Cursiva', family: "'Parisienne', cursive", sample: 'Un recuerdo eterno', tag: 'Estilo Francés' },
  { id: 'pacifico', name: 'Pacifico', category: 'Cursiva', family: "'Pacifico', cursive", sample: 'Momentos felices', tag: 'Divertida & Dulce' },

  // Elegantes y Clásicas (Serif)
  { id: 'playfair', name: 'Playfair Display', category: 'Elegante', family: "'Playfair Display', serif", sample: 'Nuestra Historia', tag: 'Editorial & Lujo' },
  { id: 'cinzel', name: 'Cinzel', category: 'Elegante', family: "'Cinzel', serif", sample: 'AMOR ETERNO', tag: 'Solemne & Dorada' },
  { id: 'lora', name: 'Lora', category: 'Elegante', family: "'Lora', serif", sample: 'Cada segundo contigo', tag: 'Literaria & Cálida' },
  { id: 'cormorant', name: 'Cormorant Garamond', category: 'Elegante', family: "'Cormorant Garamond', serif", sample: 'Promesa de vida', tag: 'Poética & Noble' },
  { id: 'prata', name: 'Prata', category: 'Elegante', family: "'Prata', serif", sample: 'Para el amor de mi vida', tag: 'Refinada & Moderna' },

  // Modernas y Minimalistas (Sans-Serif)
  { id: 'montserrat', name: 'Montserrat', category: 'Moderna', family: "'Montserrat', sans-serif", sample: 'Juntos en cada paso', tag: 'Minimalista & Fuerte' },
  { id: 'poppins', name: 'Poppins', category: 'Moderna', family: "'Poppins', sans-serif", sample: 'Recuerdos inolvidables', tag: 'Limpia & Amigable' },
  { id: 'quicksand', name: 'Quicksand', category: 'Moderna', family: "'Quicksand', sans-serif", sample: 'Eres mi persona favorita', tag: 'Suave & Dulce' },
  { id: 'jakarta', name: 'Plus Jakarta', category: 'Moderna', family: "'Plus Jakarta Sans', sans-serif", sample: 'Experiencia Digital', tag: 'Tecnológica & Premium' },
];

export function getFontFamily(fontId?: string): string {
  if (!fontId) return "'Playfair Display', serif";

  // Backward compatibility
  if (fontId === 'serif') return "'Playfair Display', serif";
  if (fontId === 'sans') return "'Plus Jakarta Sans', sans-serif";
  if (fontId === 'cursive') return "'Great Vibes', cursive";

  const found = FONT_OPTIONS.find(f => f.id === fontId);
  return found ? found.family : "'Playfair Display', serif";
}
