import { createBrowserClient } from '@supabase/ssr';
import { env } from 'next-runtime-env';

export const createClient = () => {
  const SUPABASE_URL =
    process.env.NODE_ENV === 'production'
      ? env('NEXT_PUBLIC_SUPABASE_URL')
      : process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_ANON_KEY =
    process.env.NODE_ENV === 'production'
      ? env('NEXT_PUBLIC_SUPABASE_ANON_KEY')
      : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return createBrowserClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
  });
};
