import { notFound } from 'next/navigation';
import React from 'react';
import PageContainer from '@/components/layout-dashboard/page-container';
import BrandViewPage from '@/features/brand/brand-view-page';

type BrandDetailPageProps = {
  params: Promise<{ brand_id: string }>;
};

export default async function BrandDetailPage(props: BrandDetailPageProps) {
  const params = await props.params;
  const brandId = params.brand_id;

  if (!brandId) {
    notFound();
  }

  return (
    <PageContainer scrollable={true}>
      <BrandViewPage brandId={brandId} />
    </PageContainer>
  );
}

