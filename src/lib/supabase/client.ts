/**
 * Supabase Client for Client Components
 * 
 * Use this in Client Components to interact with Supabase
 */

import { createBrowserClient } from '@supabase/ssr';
import { supabase } from '../env';

export function createClient() {
  return createBrowserClient(
    supabase.url || process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabase.anonKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

