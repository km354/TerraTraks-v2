/**
 * Supabase Client for Server Components and API Routes
 * 
 * Use this in Server Components and API Routes to interact with Supabase
 */

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { supabase } from '../env';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    supabase.url || process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabase.anonKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

