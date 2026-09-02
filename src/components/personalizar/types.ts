import { PhotoStyle } from '@/types/gallery';

export interface PhotoInput {
  file?: File;
  previewUrl: string;
  caption: string;
}

export interface MilestoneInput {
  title: string;
  date: string;
  description: string;
  image?: File;
  previewUrl?: string;
  image_url?: string;
}

export interface ExperienceSection {
  id: string;
  type: 'portada' | 'carta' | 'contador' | 'tematica' | 'musica' | 'galeria' | 'timeline' | 'pregunta' | 'sorpresa' | 'lugar' | 'secreto' | 'video' | 'audio' | 'corazones';
  content?: any;
}

export interface CustomColors {
  primary: string;
  bg: string;
  text: string;
  dedicationStyle?: 'night' | 'classic' | 'glass' | 'vintage' | 'cosmic' | 'velvet';
  surprisePalette?: string;
  surprisePrimary?: string;
  surpriseBg?: string;
}


