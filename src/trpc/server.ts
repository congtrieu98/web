'use server';

import { createHydrationHelpers } from '@trpc/react-query/rsc';
import { headers } from 'next/headers';
import { cache } from 'react';

import { type AppRouter, createCaller } from '@/server/api/root';
import { createTRPCContext } from '@/server/api/trpc';
import { createQueryClient } from './query-client';

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async () => {
  return createTRPCContext({
    headers: await headers(),
  });
});

const getQueryClient = cache(createQueryClient);
const caller = createCaller(createContext);

const { trpc: api, HydrateClient } = createHydrationHelpers<AppRouter>(
  caller,
  getQueryClient,
);

export { api, HydrateClient };

