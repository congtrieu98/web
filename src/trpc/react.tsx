'use client';

import {
  dehydrate,
  HydrationBoundary,
  isServer,
  QueryClientProvider,
  type QueryClient,
} from '@tanstack/react-query';
import { loggerLink, unstable_httpBatchStreamLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import { type inferRouterInputs, type inferRouterOutputs } from '@trpc/server';
import React, { useState } from 'react';
import SuperJSON from 'superjson';

import { type AppRouter } from '@/server/api/root';
import { createQueryClient } from './query-client';

let clientQueryClientSingleton: QueryClient | undefined = undefined;
const getQueryClient = () => {
  if (isServer) {
    // Server: always make a new query client
    return createQueryClient();
  }
  // Browser: use singleton pattern to keep the same query client
  return (clientQueryClientSingleton ??= createQueryClient());
};

export const api = createTRPCReact<AppRouter>();

/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>;

export function TRPCReactProvider(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === 'development' ||
            (op.direction === 'down' && op.result instanceof Error),
        }),
        unstable_httpBatchStreamLink({
          transformer: SuperJSON,
          url: getBaseUrl() + '/api/trpc',
        }),
      ],
    }),
  );

  const dehydratedState = dehydrate(queryClient);

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <HydrationBoundary state={dehydratedState}>
          {props.children}
        </HydrationBoundary>
      </QueryClientProvider>
    </api.Provider>
  );
}

function getBaseUrl() {
  if (typeof window !== 'undefined') return window.location.origin;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}
