import { removeAccents } from '@/utils/helpers';
import { createClient } from '@/utils/supabase/server';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';

export const productsRouter = createTRPCRouter({
  getProductBySlug: publicProcedure
    .input(
      z.object({
        slug: z.string().min(1),
      }),
    )
    .query(async ({ input }) => {
      console.log('input query', input);
      
      try {
        const supabase = await createClient();
        console.log('Supabase client created successfully');
        
        const result = await supabase
          .from('product')
          .select('*')
          .eq('slug', input.slug)
          .single();

        console.log('result query', result);
        console.log('result.data:', result.data);
        console.log('result.error:', result.error);

        if (result.error) {
          console.error('Error fetching product by slug:', result.error);
          
          // Nếu không tìm thấy product, trả về null thay vì throw error
          if (result.error.code === 'PGRST116') {
            console.log('Product not found with slug:', input.slug);
            return null;
          }
          
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error.message,
          });
        }

        if (!result.data) {
          console.log('No data returned for slug:', input.slug);
          return null;
        }

        return result.data;
      } catch (error) {
        console.error('Unexpected error in getProductBySlug:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch product',
        });
      }
    }),
  create: protectedProcedure
    .input(
      z.object({
        description: z.string().nullable(),
        slug: z.string().min(1),
        productName: z.string().min(1),
        categoryId: z.string().min(1),
        brandId: z.string().nullable().optional(),
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
          brandId: input.brandId || null,
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
        brandId: z.string().nullable().optional(),
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
          brandId: input.brandId || null,
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

    getProductsByCategory: publicProcedure
    .input(
      z.object({
        categoryId: z.string().min(1),
        limit: z.number().min(1).max(100).default(4),
      }),
    )
    .query(async ({ input }) => {
      const { categoryId, limit } = input;

      const result = await (await createClient())
        .from('product')
        .select('*')
        .eq('categoryId', categoryId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (result.error) {
        console.error('Error fetching products by category:', result.error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: result.error.message,
        });
      }

      return result.data ?? [];
    }),
  getAllProductsWithoutAuth: publicProcedure
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
        .select('*, category(name)', { count: 'exact' });

      if (search) {
        query = query.ilike('productName', `%${removeAccents(search)}%`);
      }

      const result = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (result.error) {
        console.error('Error fetching products:', result.error);
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
  getProductsByProductType: publicProcedure
    .input(
      z.object({
        productType: z.record(z.string(), z.any()),
      }),
    )
    .query(async ({ input }) => {
      console.log('input.productType', input.productType);
      
      // Build query for JSONB field
      let query = (await createClient())
        .from('product')
        .select('*');

      // Add conditions for each key in productType
      Object.entries(input.productType).forEach(([key, value]) => {
        query = query.eq(`productType->${key}`, value);
      });

      const result = await query
        .order('created_at', { ascending: false })
        .limit(4);

      console.log('result.data', result.data);
      
      if (result.error) {
        console.error('Error fetching products by product type:', result.error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: result.error.message,
        });
      }

      return result.data ?? [];
    }),
  filterProducts: publicProcedure
    .input(
      z.object({
        categoryId: z.string().optional(),
        brandIds: z.array(z.string()).optional(),
        priceRanges: z.array(z.object({
          min: z.number(),
          max: z.number().nullable(),
        })).optional(),
        sortBy: z.enum(['price_asc', 'price_desc', 'created_at']).optional().default('created_at'),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(20),
      }),
    )
    .query(async ({ input }) => {
      const { categoryId, brandIds, priceRanges, sortBy = 'created_at', page = 1, limit = 20 } = input;
      const offset = (page - 1) * limit;

      let query = (await createClient())
        .from('product')
        .select('*', { count: 'exact' });

      // Filter by category
      if (categoryId) {
        query = query.eq('categoryId', categoryId);
      }

      // Filter by brands
      if (brandIds && brandIds.length > 0) {
        query = query.in('brandId', brandIds);
      }

      // Filter by price ranges
      if (priceRanges && priceRanges.length > 0) {
        // Build OR conditions for price ranges
        const priceConditions = priceRanges.map(range => {
          if (range.min === 0 && range.max !== null) {
            // "Dưới X" - price < max
            return `price.lt.${range.max}`;
          } else if (range.max !== null) {
            // "X - Y" - price >= min AND price <= max
            return `and(price.gte.${range.min},price.lte.${range.max})`;
          }
          return null;
        }).filter((condition): condition is string => condition !== null);
        
        // Use or() for multiple price ranges
        if (priceConditions.length > 0) {
          query = query.or(priceConditions.join(','));
        }
      }

      // Sorting
      if (sortBy === 'price_asc') {
        query = query.order('price', { ascending: true });
      } else if (sortBy === 'price_desc') {
        query = query.order('price', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const result = await query.range(offset, offset + limit - 1);

      if (result.error) {
        console.error('Error filtering products:', result.error);
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
});

