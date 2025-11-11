'use client';

import { Banner } from '@/types/main';
import { DataTable as BannerTable } from '@/components/ui/table-comp/data-table';
import { columns } from './banner-table/columns';
import { api } from '@/trpc/react';
import { useSearchParams } from 'next/navigation';
import { DataTableSkeleton } from '@/components/ui/table-comp/data-table-skeleton';

export default function BannerListingPage() {
  const queryParams = useSearchParams();
  const page = queryParams?.get('page');
  const search = queryParams?.get('q');
  const pageLimit = queryParams?.get('limit');

  const { data, isLoading } = api.banners.getAll.useQuery({
    page: page ? Number(page) : 1,
    limit: pageLimit ? Number(pageLimit) : 10,
    search: search || undefined,
  });

  const banners = data?.data || [];
  const totalBanners = data?.metadata.total || 0;

  if (isLoading) return <DataTableSkeleton />;

  return (
    <BannerTable
      columns={columns}
      data={banners as unknown as Banner[]}
      totalItems={totalBanners}
    />
  );
}

