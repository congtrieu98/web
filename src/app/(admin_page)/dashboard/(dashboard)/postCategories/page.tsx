import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import React, { Suspense } from 'react';
import { SearchParams } from 'nuqs/server';
import { searchParamsCache, serialize } from '@/lib/searchparams';
import PageContainer from '@/components/layout-dashboard/page-container';
import CategoryTableAction from '@/features/category/category-table/category-table-action';
import { DataTableSkeleton } from '@/components/ui/table-comp/data-table-skeleton';
import PostCategoryListingPage from '@/features/postCategory/post-category-listing';

export const metadata = {
  title: 'Dashboard: Post Categories',
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function PostCategoryPage(props: pageProps) {
  const searchParams = await props.searchParams;
  // Allow nested RSCs to access the search params (in a type-safe way)
  searchParamsCache.parse(searchParams);

  // This key is used for invoke suspense if any of the search params changed (used for filters).
  const key = serialize({ ...searchParams });
  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Heading title="Post Categories" description="Manage post categories" />
          <Link
            href="/dashboard/postCategories/create"
            className={cn(buttonVariants(), 'text-xs md:text-sm')}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>
        </div>
        <Separator />
        <CategoryTableAction />
        <Suspense
          key={key}
          fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
        >
          <PostCategoryListingPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
