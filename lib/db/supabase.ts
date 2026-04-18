import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = () => {
  // Return existing instance if already created
  if (supabaseInstance) return supabaseInstance;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ltxerejwklqpzprlkvlf.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0eGVyZWp3a2xxcHpwcmxrdmxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMzI3MDcsImV4cCI6MjA5MTcwODcwN30.wW5KMrLXcGpE7UxczApL5XSY6vyWNPlVcul5TMfRbWw";

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
