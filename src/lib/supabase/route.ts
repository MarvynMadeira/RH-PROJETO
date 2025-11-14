import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export function createRouteSupabaseClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: async (name: string) => {
          const store = await cookies();
          const cookie = store.get(name);
          return cookie?.value;
        },
        set: async (name: string, value: string, options: any) => {
          const store = await cookies();
          store.set({ name, value, ...options });
        },
        remove: async (name: string, options: any) => {
          const store = await cookies();
          store.set({ name, value: '', ...options });
        },
      },
    },
  );
}
