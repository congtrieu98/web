import { createClient } from '@/utils/supabase/server';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';

export const bannersRouter = createTRPCRouter({
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
        .from('banner')
        .select('*', { count: 'exact' });

      if (search) {
        query = query.ilike('title', `%${search}%`);
      }

      const result = await query
        .order('order_index', { ascending: true })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (result.error) {
        console.error('Error fetching banners:', result.error);
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

  getAllPublic: publicProcedure.query(async () => {
    const result = await (await createClient())
      .from('banner')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: false });

    if (result.error) {
      console.error('Error fetching banners:', result.error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: result.error.message,
      });
    }

    return result.data ?? [];
  }),

  getBannerById: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
      }),
    )
    .query(async ({ input }) => {
      const result = await (await createClient())
        .from('banner')
        .select('*')
        .eq('id', input.id)
        .single();

      if (result.error) {
        console.error('Error fetching banner:', result.error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: result.error.message,
        });
      }

      if (!result.data) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Banner not found',
        });
      }

      return result.data;
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        type: z.enum(['single', 'grid']),
        images: z.array(
          z.object({
            src: z.string().url(),
            alt: z.string().optional(),
            linkProduct: z.string().optional().nullable(), // Product slug for this specific image
          }),
        ),
        order_index: z.number().default(0),
        is_active: z.boolean().default(true),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const result = await (await createClient())
        .from('banner')
        .insert({
          created_by: ctx.user.id,
          title: input.title,
          type: input.type,
          images: input.images,
          order_index: input.order_index,
          is_active: input.is_active,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (result.error) {
        console.error('Error creating banner', result.error);
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
        title: z.string().min(1),
        type: z.enum(['single', 'grid']),
        images: z.array(
          z.object({
            src: z.string().url(),
            alt: z.string().optional(),
            linkProduct: z.string().optional().nullable(), // Product slug for this specific image
          }),
        ),
        order_index: z.number().default(0),
        is_active: z.boolean().default(true),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const result = await (await createClient())
        .from('banner')
        .update({
          title: input.title,
          type: input.type,
          images: input.images,
          order_index: input.order_index,
          is_active: input.is_active,
          updated_at: new Date().toISOString(),
          updated_by: ctx.user.id,
        })
        .eq('id', input.id)
        .select()
        .single();

      if (result.error) {
        console.error('Error updating banner', result.error);
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
        .from('banner')
        .delete()
        .eq('id', input.id);

      if (result.error) {
        console.error('Error deleting banner', result.error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: result.error.message,
        });
      }

      return {
        message: 'Deleting banner successfully',
      };
    }),
});

