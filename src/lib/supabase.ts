import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

console.log('=== SUPABASE CONFIG CHECK ===');
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key exists:', supabaseAnonKey ? 'YES' : 'NO');
console.log('============================');

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL and Anon Key must be set in environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);



