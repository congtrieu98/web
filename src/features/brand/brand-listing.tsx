'use client';

import { Brand } from '@/types/main';
import { DataTable as BrandTable } from '@/components/ui/table-comp/data-table';
import { columns } from './brand-table/columns';
import { api } from '@/trpc/react';
import { useSearchParams } from 'next/navigation';
import { DataTableSkeleton } from '@/components/ui/table-comp/data-table-skeleton';

export default function BrandListingPage() {
  const queryParams = useSearchParams();
  const page = queryParams?.get('page');
  const search = queryParams?.get('q');
  const pageLimit = queryParams?.get('limit');

  const { data, isLoading } = api.brands.getAll.useQuery({
    page: page ? Number(page) : 1,
    limit: pageLimit ? Number(pageLimit) : 10,
    search: search || undefined,
  });

  const brands = data?.data || [];
  const totalBrands = data?.metadata.total || 0;

  if (isLoading) return <DataTableSkeleton />;

  return (
    <BrandTable
      columns={columns}
      data={brands as unknown as Brand[]}
      totalItems={totalBrands}
    />
  );
}

