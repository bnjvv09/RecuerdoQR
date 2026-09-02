import { supabase, isMockMode } from './supabase';

/**
 * Uploads a file to Supabase Storage bucket 'photos' or returns local preview URL if in mock mode.
 */
export async function uploadImage(file: File, path: string): Promise<string> {
  if (isMockMode) {
    // En modo mock, retornamos una URL de object local para conservar la visualización
    return URL.createObjectURL(file);
  }

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${path}-${Math.random().toString(36).substring(2, 10)}.${fileExt}`;
    const filePath = `experiences/${fileName}`;

    const { error: uploadError, data } = await supabase.storage
      .from('photos')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data: publicUrlData } = supabase.storage
      .from('photos')
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error uploading image to Supabase storage:', error);
    // Fallback a un placeholder si falla la subida real
    return 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&auto=format&fit=crop';
  }
}
