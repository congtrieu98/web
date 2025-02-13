import { createClient } from '@/utils/supabase/server';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';

export const categoriesRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().nullable(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const result = await (
        await createClient()
      )
        .from('category')
        .insert({
          user_id: ctx.user.id,
          name: input.name,
          description: input.description,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (result.error) {
        console.error('Error creating category', result.error);
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
        description: z.string().nullable(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const result = await (
        await createClient()
      )
        .from('category')
        .update({
          name: input.name,
          description: input.description,
          updated_at: new Date().toISOString(),
        })
        .eq('id', input.id)
        .eq('user_id', ctx.user.id)
        .select()
        .single();

      if (result.error) {
        console.error('Error updating category', result.error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: result.error.message,
        });
      }

      return result.data;
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const result = await (await createClient())
      .from('category')
      .select('*')
      .eq('user_id', ctx.user.id)
      .order('created_at', { ascending: false });

    if (result.error) {
      console.error('Error fetching category:', result.error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: result.error.message,
      });
    }

    return result.data ?? [];
  }),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const result = await (await createClient())
        .from('category')
        .delete()
        .eq('id', input.id)
        .eq('user_id', ctx.user.id);

      if (result.error) {
        console.error('Error updating category', result.error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: result.error.message,
        });
      }

      return {
        message: 'Deleting category successfully',
      };
    }),
});
