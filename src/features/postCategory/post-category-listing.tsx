'use client';

import { PostCategory } from '@/types/main';
import { DataTable as PostCategoryTable } from '@/components/ui/table-comp/data-table';
import { columns } from './post-category-table/columns';
import { api } from '@/trpc/react';
import { useSearchParams } from 'next/navigation';
import { DataTableSkeleton } from '@/components/ui/table-comp/data-table-skeleton';

// type CategoryListingPage = Record<string, never> & {};

export default function PostCategoryListingPage() {
  // Showcasing the use of search params cache in nested RSCs
  const queryParams = useSearchParams();
  const page = queryParams?.get('page');
  const search = queryParams?.get('q');
  const pageLimit = queryParams?.get('limit');

  const { data, isLoading } = api.postCategory.getAll.useQuery({
    page: page ? Number(page) : 1,
    limit: pageLimit ? Number(pageLimit) : 10,
    search: search || undefined,
  });

  const postCategories = data?.data || [];
  const totalPostCategories = data?.metadata.total || 0;

  if (isLoading) return <DataTableSkeleton />;

  return (
    <PostCategoryTable
      columns={columns}
      data={postCategories as unknown as PostCategory[]}
      totalItems={totalPostCategories}
    />
  );
}
