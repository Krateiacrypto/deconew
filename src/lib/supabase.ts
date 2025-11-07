import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Make Supabase optional - backend MySQL auth is primary
let supabase: SupabaseClient<Database> | null = null;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  });
  console.log('✅ Supabase client initialized (optional features enabled)');
} else {
  console.warn('⚠️  Supabase credentials not found - using backend MySQL auth only');
  console.warn('   Some optional features may be disabled');
}

export { supabase };

// Helper to check if Supabase is available
export const isSupabaseAvailable = (): boolean => {
  return supabase !== null;
};

// Export types for use in other files
export type { Database };