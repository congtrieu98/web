import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout-dashboard/page-container';
import BannerViewPage from '@/features/banner/banner-view-page';
import { Suspense } from 'react';

export const metadata = {
  title: 'Dashboard : Banner View',
};

type PageProps = { params: Promise<{ banner_id: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <BannerViewPage bannerId={params.banner_id} />
        </Suspense>
      </div>
    </PageContainer>
  );
}

