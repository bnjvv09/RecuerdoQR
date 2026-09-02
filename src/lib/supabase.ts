import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Determinar si estamos usando las credenciales por defecto (mock mode)
export const isMockMode = 
  !supabaseUrl || 
  !supabaseAnonKey || 
  supabaseUrl.includes('placeholder-project') ||
  supabaseUrl === 'https://your-project-id.supabase.co';

export const supabase = createClient(
  isMockMode ? 'https://placeholder-project.supabase.co' : supabaseUrl,
  isMockMode ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2MDk0NTkyMDAsImV4cCI6MjA0OTc0MDgwMH0.placeholder-signature' : supabaseAnonKey
);
