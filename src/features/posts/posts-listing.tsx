'use client';

import { Post } from '@/types/main';
import { DataTable as PostTable } from '@/components/ui/table-comp/data-table';
import { columns } from './post-table/columns';
import { api } from '@/trpc/react';
import { useSearchParams } from 'next/navigation';
import { DataTableSkeleton } from '@/components/ui/table-comp/data-table-skeleton';

// type PostsListingPage = Record<string, never> & {};

export default function PostsListingPage() {
  const queryParams = useSearchParams();
  const page = queryParams?.get('page');
  const search = queryParams?.get('q');
  const pageLimit = queryParams?.get('limit');

  const { data, isLoading } = api.posts.getAll.useQuery({
    page: page ? Number(page) : 1,
    limit: pageLimit ? Number(pageLimit) : 10,
    search: search || undefined,
  });

  const posts = data?.data || [];
  const totalPosts = data?.metadata.total || 0;

  if (isLoading) return <DataTableSkeleton />;

  return (
    <PostTable
      columns={columns}
      data={posts as unknown as Post[]}
      totalItems={totalPosts}
    />
  );
}
