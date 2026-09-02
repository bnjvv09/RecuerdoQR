export type PhotoStyle = 
  | 'polaroid' 
  | 'album' 
  | 'filmstrip' 
  | 'masonry' 
  | 'collage' 
  | 'carousel';

export interface PhotoItem {
  url: string;
  caption?: string;
  id?: string;
}

export interface PhotoGalleryProps {
  photos: PhotoItem[];
  style?: PhotoStyle;
  secondaryStyle?: PhotoStyle | null;
  theme?: string;
  primaryColor?: string;
  fontFamily?: string;
  onPhotoClick?: (index: number) => void;
  className?: string;
}
