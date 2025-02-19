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
import { DataTableSkeleton } from '@/components/ui/table-comp/data-table-skeleton';
import SubCategoryTableAction from '@/features/sub-category/sub-category-table/sub-category-table-action';
import SubCategoryListingPage from '@/features/sub-category/sub-category-listing';

export const metadata = {
  title: 'Dashboard: Sub Categories',
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function SubCategoryPage(props: pageProps) {
  const searchParams = await props.searchParams;
  // Allow nested RSCs to access the search params (in a type-safe way)
  searchParamsCache.parse(searchParams);

  // This key is used for invoke suspense if any of the search params changed (used for filters).
  const key = serialize({ ...searchParams });
  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Heading title="Sub Categories" description="Manage sub categories" />
          <Link
            href="/dashboard/sub-categories/create"
            className={cn(buttonVariants(), 'text-xs md:text-sm')}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>
        </div>
        <Separator />
        <SubCategoryTableAction />
        <Suspense
          key={key}
          fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
        >
          <SubCategoryListingPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
