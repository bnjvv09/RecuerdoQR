import { supabase, isMockMode } from './supabase';

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
  'audio/webm',
  'audio/mp4',
  'audio/mpeg',
  'audio/mp3',
  'audio/x-m4a',
  'video/mp4',
  'video/webm',
  'video/quicktime'
]);

const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25MB

/**
 * Uploads a file to Supabase Storage bucket 'photos' with security validation.
 */
export async function uploadImage(file: File, path: string): Promise<string> {
  // 🔒 SEGURIDAD: Validar tamaño máximo de archivo
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error('El archivo excede el tamaño máximo permitido de 25MB');
  }

  // 🔒 SEGURIDAD: Validar MIME Type permitido
  if (file.type && !ALLOWED_MIME_TYPES.has(file.type.toLowerCase())) {
    throw new Error('Tipo de archivo no permitido. Solo se aceptan imágenes, audios y videos seguros.');
  }

  if (isMockMode) {
    return URL.createObjectURL(file);
  }

  try {
    const rawExt = file.name.split('.').pop() || 'jpg';
    const safeExt = rawExt.toLowerCase().replace(/[^a-z0-9]/g, '');
    const safePath = path.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const fileName = `${safePath}-${Math.random().toString(36).substring(2, 10)}.${safeExt}`;
    const filePath = `experiences/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('photos')
      .upload(filePath, file, {
        contentType: file.type || 'image/jpeg',
        cacheControl: '31536000',
        upsert: false
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data: publicUrlData } = supabase.storage
      .from('photos')
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error uploading file to Supabase storage:', error);
    return 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&auto=format&fit=crop';
  }
}
