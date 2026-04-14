import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = () => {
  // Return existing instance if already created
  if (supabaseInstance) return supabaseInstance;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Validate URL format (Must start with http or https)
  const isValidUrl = supabaseUrl && /^https?:\/\//i.test(supabaseUrl);

  if (isValidUrl && supabaseAnonKey) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
    return supabaseInstance;
  }

  // Return null if not configured (API routes will handle the fallback)
  return null;
};

// Also export a dummy for backward compatibility if needed, 
// but getSupabase() is the preferred way now.
export const supabase = getSupabase();
