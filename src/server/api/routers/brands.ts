import { removeAccents } from '@/utils/helpers';
import { createClient } from '@/utils/supabase/server';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';

export const brandsRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(
      z.object({
        search: z.string().optional(),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(10),
      }),
    )
    .query(async ({ input }) => {
      const { search, page, limit } = input;
      const offset = (page - 1) * limit;

      let query = (await createClient())
        .from('brand')
        .select('*', { count: 'exact' });

      if (search) {
        query = query.ilike('name', `%${removeAccents(search)}%`);
      }

      const result = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (result.error) {
        console.error('Error fetching brands:', result.error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: result.error.message,
        });
      }

      return {
        data: result.data ?? [],
        metadata: {
          total: result.count ?? 0,
          page,
          limit,
          totalPages: Math.ceil((result.count ?? 0) / limit),
        },
      };
    }),

  getBrandById: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
      }),
    )
    .query(async ({ input }) => {
      const result = await (await createClient())
        .from('brand')
        .select('*')
        .eq('id', input.id)
        .single();

      if (result.error) {
        console.error('Error fetching brand:', result.error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: result.error.message,
        });
      }

      if (!result.data) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Brand not found',
        });
      }

      return result.data;
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        slug: z.string().min(1),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const result = await (
        await createClient()
      )
        .from('brand')
        .insert({
          created_by: ctx.user.id,
          name: input.name,
          slug: input.slug,
          logo: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (result.error) {
        console.error('Error creating brand', result.error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: result.error.message,
        });
      }

      return result.data;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        name: z.string().min(1),
        slug: z.string().min(1),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const result = await (
        await createClient()
      )
        .from('brand')
        .update({
          name: input.name,
          slug: input.slug,
          logo: null,
          updated_at: new Date().toISOString(),
          updated_by: ctx.user.id,
        })
        .eq('id', input.id)
        .select()
        .single();

      if (result.error) {
        console.error('Error updating brand', result.error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: result.error.message,
        });
      }

      return result.data;
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
      }),
    )
    .mutation(async ({ input }) => {
      const result = await (await createClient())
        .from('brand')
        .delete()
        .eq('id', input.id);

      if (result.error) {
        console.error('Error deleting brand', result.error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: result.error.message,
        });
      }

      return {
        message: 'Deleting brand successfully',
      };
    }),

  getAllBrandsPublic: publicProcedure
    .query(async () => {
      const result = await (await createClient())
        .from('brand')
        .select('*')
        .order('created_at', { ascending: false });

      if (result.error) {
        console.error('Error fetching brands:', result.error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: result.error.message,
        });
      }

      return result.data ?? [];
    }),
});

