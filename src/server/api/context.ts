import { getUser } from '@/utils/supabase/queries';
import { createClient } from '@/utils/supabase/server';
import { type CreateNextContextOptions } from '@trpc/server/adapters/next';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function createContext({ req, res }: CreateNextContextOptions) {
  const supabase = await createClient();
  const user = await getUser(supabase);

  return {
    user,
    supabase,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
