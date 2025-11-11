import { createCallerFactory, createTRPCRouter } from '@/server/api/trpc';
import { categoriesRouter } from './routers/categories';
import { subCategoriesRouter } from './routers/subCategory';
import { productsRouter } from './routers/products';
import { postCategoriesRouter } from './routers/postCategories';
import { postsRouter } from './routers/posts';
import { brandsRouter } from './routers/brands';
import { bannersRouter } from './routers/banners';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  category: categoriesRouter,
  subCategory: subCategoriesRouter,
  products: productsRouter,
  postCategory: postCategoriesRouter,
  posts: postsRouter,
  brands: brandsRouter,
  banners: bannersRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
