'use client';

import { Product } from '@/types/main';
import { DataTable as ProductTable } from '@/components/ui/table-comp/data-table';
import { columns } from './product-table/columns';
import { api } from '@/trpc/react';
import { useSearchParams } from 'next/navigation';
import { DataTableSkeleton } from '@/components/ui/table-comp/data-table-skeleton';

// type CategoryListingPage = Record<string, never> & {};

export default function ProductListingPage() {
  // Showcasing the use of search params cache in nested RSCs
  const queryParams = useSearchParams();
  const page = queryParams?.get('page');
  const search = queryParams?.get('q');
  const pageLimit = queryParams?.get('limit');

  const { data, isLoading } = api.products.getAll.useQuery({
    page: page ? Number(page) : 1,
    limit: pageLimit ? Number(pageLimit) : 10,
    search: search || undefined,
  });

  const products = data?.data || [];
  const totalProducts = data?.metadata.total || 0;

  if (isLoading) return <DataTableSkeleton />;

  return (
    <ProductTable
      columns={columns}
      data={products as unknown as Product[]}
      totalItems={totalProducts}
    />
  );
}
