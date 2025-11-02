import { removeAccents } from '@/utils/helpers';
import { createClient } from '@/utils/supabase/server';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';

export const categoriesRouter = createTRPCRouter({
  getCategoryBySlug: publicProcedure
  .input(
    z.object({
      slug: z.string().min(1),
    }),
  )
  .query(async ({ input }) => {
    try {
      const supabase = await createClient();
      
      // Lấy category
      const categoryResult = await supabase
        .from('category')
        .select('*')
        .eq('slug', input.slug)
        .single();

      if (categoryResult.error) {
        console.error('Error fetching category by slug:', categoryResult.error);
        
        // Nếu không tìm thấy category, trả về null thay vì throw error
        if (categoryResult.error.code === 'PGRST116') {
          console.log('Category not found with slug:', input.slug);
          return null;
        }
        
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: categoryResult.error.message,
        });
      }

      if (!categoryResult.data) {
        console.log('No data returned for slug:', input.slug);
        return null;
      }

      // Lấy danh sách products theo categoryId
      const productsResult = await supabase
        .from('product')
        .select('*')
        .eq('categoryId', categoryResult.data.id)
        .order('created_at', { ascending: false });

      if (productsResult.error) {
        console.error('Error fetching products by category:', productsResult.error);
        // Không throw error, chỉ log và trả về empty array
      }

      // Trả về category kèm danh sách products
      return {
        ...categoryResult.data,
        products: productsResult.data || [],
      };
    } catch (error) {
      console.error('Unexpected error in getCategoryBySlug:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch category',
      });
    }
  }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().nullable(),
        slug: z.string().min(1),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const result = await (
        await createClient()
      )
        .from('category')
        .insert({
          created_by: ctx.user.id,
          name: input.name,
          slug: input.slug,
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
        slug: z.string().min(1),
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
          slug: input.slug,
          updated_at: new Date().toISOString(),
          updated_by: ctx.user.id,
        })
        .eq('id', input.id)
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
        .from('category')
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
    getAllCategoriesPublic: publicProcedure
    .query(async () => {
      const result = await (await createClient())
        .from('category')
        .select('*')
        .order('created_at', { ascending: false });

      if (result.error) {
        console.error('Error fetching categories:', result.error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: result.error.message,
        });
      }

      return result.data ?? [];
    }),
  getAllWithoutPagination: publicProcedure
    .query(async () => {
      const result = await (await createClient())
        .from('category')
        .select('*')
        .order('created_at', { ascending: false });

      if (result.error) {
        console.error('Error fetching categories:', result.error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: result.error.message,
        });
      }

      return result.data ?? [];
    }),
  getCategoryById: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
      }),
    )
    .query(async ({ input }) => {
      const result = await (await createClient())
        .from('category')
        .select('*')
        .eq('id', input.id)
        .single();

      if (result.error) {
        console.error('Error fetching category:', result.error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: result.error.message,
        });
      }

      if (!result.data) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Category not found',
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
        .from('category')
        .delete()
        .eq('id', input.id);

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
