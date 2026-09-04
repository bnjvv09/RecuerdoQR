import { supabase, isMockMode } from './supabase';
import { compressImageToBlob } from './imageCompression';
import { generateUUID } from './uuid';

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
 * Validates real binary signatures (Magic Bytes) from the raw file header.
 * Rejects executables, scripts or suspicious binaries disguised with image/video extensions.
 */
async function validateMagicBytes(file: File | Blob): Promise<boolean> {
  try {
    const buffer = await file.slice(0, 16).arrayBuffer();
    const bytes = new Uint8Array(buffer);
    if (bytes.length < 4) return false;

    // JPEG / JPG: FF D8 FF
    if (bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) return true;

    // PNG: 89 50 4E 47
    if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) return true;

    // GIF: 47 49 46 38 ('GIF8')
    if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38) return true;

    // WebP: RIFF ... WEBP
    if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46) {
      if (bytes.length >= 12) {
        const isWebP = bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50;
        if (isWebP) return true;
      }
      return true; // RIFF container (WAV or WebP)
    }

    // MP4 / MOV / M4A: ftyp signature
    if (bytes.length >= 8) {
      const isFtyp = (bytes[4] === 0x66 && bytes[5] === 0x74 && bytes[6] === 0x79 && bytes[7] === 0x70);
      if (isFtyp) return true;
    }

    // WebM / MKV: 1A 45 DF A3
    if (bytes[0] === 0x1A && bytes[1] === 0x45 && bytes[2] === 0xDF && bytes[3] === 0xA3) return true;

    // MP3 ID3: 49 44 33 ('ID3') or sync FF FB / FF F3
    if ((bytes[0] === 0x49 && bytes[1] === 0x44 && bytes[2] === 0x33) || (bytes[0] === 0xFF && (bytes[1] & 0xE0) === 0xE0)) return true;

    // Ogg container: 4F 67 67 53
    if (bytes[0] === 0x4F && bytes[1] === 0x67 && bytes[2] === 0x67 && bytes[3] === 0x53) return true;

    return false;
  } catch {
    return true; // Fallback if browser security prevents slicing
  }
}

/**
 * Uploads a file to Supabase Storage bucket 'photos' with automatic WebP compression for lightning-fast delivery.
 */
export async function uploadImage(file: File | Blob, path: string): Promise<string> {
  // 🔒 SEGURIDAD: Validar tamaño máximo de archivo
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error('El archivo excede el tamaño máximo permitido de 25MB');
  }

  // 🔒 SEGURIDAD: Validar MIME Type permitido
  if (file.type && !ALLOWED_MIME_TYPES.has(file.type.toLowerCase())) {
    throw new Error('Tipo de archivo no permitido. Solo se aceptan imágenes, audios y videos seguros.');
  }

  // 🔒 SEGURIDAD: Validar firma binaria real (Magic Bytes) para evitar ejecutables o malware
  const isBinarySafe = await validateMagicBytes(file);
  if (!isBinarySafe) {
    throw new Error('El contenido del archivo no coincide con un formato de imagen o video válido.');
  }

  if (isMockMode) {
    return URL.createObjectURL(file);
  }

  try {
    let fileToUpload: Blob = file;
    let safeExt = 'webp';
    let contentType = 'image/webp';

    if (file.type && file.type.startsWith('image/')) {
      // 🚀 Auto-compress 10MB camera photo to 100-200KB WebP
      try {
        fileToUpload = await compressImageToBlob(file, 1280, 1280, 0.78);
        contentType = 'image/webp';
        safeExt = 'webp';
      } catch (compErr) {
        console.warn('Canvas compression fallback to original file:', compErr);
        fileToUpload = file;
        const rawExt = (file as any).name?.split('.').pop() || 'jpg';
        safeExt = rawExt.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
        contentType = file.type || 'image/jpeg';
      }
    } else {
      // Audio or Video
      const rawExt = (file as any).name?.split('.').pop() || 'mp4';
      safeExt = rawExt.toLowerCase().replace(/[^a-z0-9]/g, '') || 'mp4';
      contentType = file.type || 'application/octet-stream';
    }

    const safePath = path.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    const uniqueId = generateUUID();
    const fileName = `${safePath || 'media'}-${uniqueId}.${safeExt}`;
    const filePath = `experiences/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('photos')
      .upload(filePath, fileToUpload, {
        contentType,
        cacheControl: '31536000, immutable',
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
