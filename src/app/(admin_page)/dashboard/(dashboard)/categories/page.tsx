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
import CategoryListingPage from '@/features/category/category-listing';
import { DataTableSkeleton } from '@/components/ui/table-comp/data-table-skeleton';

export const metadata = {
  title: 'Dashboard: Categories',
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function CategoryPage(props: pageProps) {
  const searchParams = await props.searchParams;
  // Allow nested RSCs to access the search params (in a type-safe way)
  searchParamsCache.parse(searchParams);

  // This key is used for invoke suspense if any of the search params changed (used for filters).
  const key = serialize({ ...searchParams });
  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Heading title="Categories" description="Manage categories" />
          <Link
            href="/dashboard/categories/new"
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
          <CategoryListingPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
