import { removeAccents } from '@/utils/helpers';
import { createClient } from '@/utils/supabase/server';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';

export const productsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        description: z.string().nullable(),
        slug: z.string().min(1),
        productName: z.string().min(1),
        categoryId: z.string().min(1),
        price: z.number(),
        quantity: z.number(),
        oldPrice: z.number().optional(),
        media: z.array(z.string()),
        productType: z.record(z.string(), z.any()),
        specs: z
          .array(
            z.object({
              name: z.string().min(1),
              unit: z.string().min(1),
              option: z.string()
            })
          )
          .min(1),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      console.log('input create:', input);

      const result = await (
        await createClient()
      )
        .from('product')
        .insert({
          productName: input.productName,
          slug: input.slug,
          categoryId: input.categoryId,
          quantity: input.quantity,
          price: input.price,
          oldPrice: input.oldPrice,
          productType: input.productType,
          description: input.description,
          specs: input.specs,
          media: input.media,
          created_by: ctx.user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (result.error) {
        console.error('Error creating Products', result.error);
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
        description: z.string().nullable(),
        slug: z.string().min(1),
        productName: z.string().min(1),
        categoryId: z.string().min(1),
        media: z.array(z.string()),
        price: z.preprocess(
          (val) => typeof val === 'string' ? Number(val.replace(/\./g, '')) : val,
          z.number().min(1)
        ),
        quantity: z.preprocess(
          (val) => typeof val === 'string' ? Number(val.replace(/\./g, '')) : val,
          z.number().min(1)
        ),
        oldPrice: z.preprocess(
          (val) => typeof val === 'string' ? Number(val.replace(/\./g, '')) : val,
          z.number().optional()
        ),
        productType: z.record(z.string(), z.any()),
        specs: z
          .array(
            z.object({
              name: z.string().min(1),
              unit: z.string().min(1),
              option: z.string()
            })
          )
          .min(1),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const result = await (
        await createClient()
      )
        .from('product')
        .update({
          productName: input.productName,
          slug: input.slug,
          categoryId: input.categoryId,
          quantity: input.quantity,
          price: input.price,
          oldPrice: input.oldPrice,
          productType: input.productType,
          description: input.description,
          specs: input.specs,
          media: input.media,
          created_by: ctx.user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          updated_by: ctx.user.id,
        })
        .eq('id', input.id)
        .select()
        .single();

      if (result.error) {
        console.error('Error updating Products', result.error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: result.error.message,
        });
      }

      return result.data;
    }),
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
        .from('product')
        .select('*', { count: 'exact' });

      if (search) {
        query = query.ilike('name', `%${removeAccents(search)}%`);
      }

      const result = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (result.error) {
        console.error('Error fetching categories:', result.error);
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
  getProductsById: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
      }),
    )
    .query(async ({ input }) => {
      const result = await (await createClient())
        .from('product')
        .select('*')
        .eq('id', input.id)
        .single();

      if (result.error) {
        console.error('Error fetching Products:', result.error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: result.error.message,
        });
      }

      if (!result.data) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Products not found',
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
        .from('product')
        .delete()
        .eq('id', input.id);

      if (result.error) {
        console.error('Error updating Products', result.error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: result.error.message,
        });
      }

      return {
        message: 'Deleting Products successfully',
      };
    }),
});
