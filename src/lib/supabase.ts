import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== '' && supabaseAnonKey !== '');
};

// Storage helper functions

/**
 * Check if a storage bucket exists
 * @param bucketName - Name of the bucket to check
 * @returns Promise<boolean> - true if bucket exists, false otherwise
 */
export const checkBucketExists = async (bucketName: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.storage.getBucket(bucketName);
    return !error && !!data;
  } catch (error) {
    console.error(`Error checking bucket ${bucketName}:`, error);
    return false;
  }
};

/**
 * Upload a file to Supabase Storage
 * @param bucketName - Name of the bucket
 * @param filePath - Path where the file should be stored
 * @param file - The file to upload
 * @param options - Upload options
 * @returns Promise with upload result
 */
export const uploadFile = async (
  bucketName: string,
  filePath: string,
  file: File,
  options?: { cacheControl?: string; upsert?: boolean }
) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: options?.cacheControl || '3600',
        upsert: options?.upsert || false,
      });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error(`Error uploading file to ${bucketName}:`, error);
    return { data: null, error };
  }
};

/**
 * Delete a file from Supabase Storage
 * @param bucketName - Name of the bucket
 * @param filePath - Path of the file to delete
 * @returns Promise with deletion result
 */
export const deleteFile = async (bucketName: string, filePath: string) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error(`Error deleting file from ${bucketName}:`, error);
    return { data: null, error };
  }
};

/**
 * Get public URL for a file
 * @param bucketName - Name of the bucket
 * @param filePath - Path of the file
 * @returns Public URL string
 */
export const getPublicUrl = (bucketName: string, filePath: string): string => {
  const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
  return data.publicUrl;
};
