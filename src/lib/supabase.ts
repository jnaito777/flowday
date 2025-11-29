import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

/**
 * Validates that required Supabase environment variables are set.
 * Logs detailed error messages for debugging.
 */
function validateSupabaseEnv(): { valid: boolean; url: string; key: string } {
  const isValid = !!(supabaseUrl && supabaseAnonKey);

  if (!isValid) {
    const missing = [];
    if (!supabaseUrl) missing.push('VITE_SUPABASE_URL');
    if (!supabaseAnonKey) missing.push('VITE_SUPABASE_ANON_KEY');
    console.error(
      `[Supabase] Missing environment variables: ${missing.join(', ')}`,
      `Current env:`,
      { url: !!supabaseUrl, key: !!supabaseAnonKey }
    );
  }

  return { valid: isValid, url: supabaseUrl, key: supabaseAnonKey };
}

const env = validateSupabaseEnv();

export const supabase = createClient(env.url, env.key);

export const isSupabaseConfigured = env.valid;
