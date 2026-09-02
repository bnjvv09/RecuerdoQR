'use client';

import { useState } from 'react';
import { PhotoGalleryProps, PhotoStyle } from '@/types/gallery';
import PolaroidGallery from './PolaroidGallery';
import DigitalAlbum from './DigitalAlbum';
import FilmStrip from './FilmStrip';
import MasonryGallery from './MasonryGallery';
import CollageGallery from './CollageGallery';
import PhotoCarousel from './PhotoCarousel';
import PhotoLightbox from './PhotoLightbox';

export default function PhotoGallery({
  photos = [],
  style = 'polaroid',
  secondaryStyle = null,
  theme = 'anniversary',
  primaryColor = '#a21232',
  fontFamily,
  className = ''
}: PhotoGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const handlePhotoClick = (index: number) => {
    setLightboxIndex(index);
  };

  const renderSingleStyle = (styleType: PhotoStyle, photoSubset: typeof photos, offsetIndex = 0) => {
    const props = {
      photos: photoSubset,
      theme,
      primaryColor,
      fontFamily,
      onPhotoClick: (idx: number) => handlePhotoClick(offsetIndex + idx),
      className
    };

    switch (styleType) {
      case 'album':
        return <DigitalAlbum {...props} />;
      case 'filmstrip':
        return <FilmStrip {...props} />;
      case 'masonry':
        return <MasonryGallery {...props} />;
      case 'collage':
        return <CollageGallery {...props} />;
      case 'carousel':
        return <PhotoCarousel {...props} />;
      case 'polaroid':
      default:
        return <PolaroidGallery {...props} />;
    }
  };

  if (secondaryStyle && photos.length >= 2) {
    const half = Math.ceil(photos.length / 2);
    const firstGroup = photos.slice(0, half);
    const secondGroup = photos.slice(half);

    return (
      <div className="w-full space-y-6">
        <div className="space-y-2">
          {renderSingleStyle(style, firstGroup, 0)}
        </div>
        <div className="space-y-2 pt-2 border-t border-gray-100">
          {renderSingleStyle(secondaryStyle, secondGroup, half)}
        </div>

        {/* Shared Lightbox */}
        <PhotoLightbox
          photos={photos}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={(newIndex) => setLightboxIndex(newIndex)}
        />
      </div>
    );
  }

  return (
    <div className="w-full">
      {renderSingleStyle(style, photos, 0)}

      {/* Shared Lightbox */}
      <PhotoLightbox
        photos={photos}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={(newIndex) => setLightboxIndex(newIndex)}
      />
    </div>
  );
}
