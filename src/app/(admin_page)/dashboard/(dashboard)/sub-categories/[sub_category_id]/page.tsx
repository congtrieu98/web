import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout-dashboard/page-container';
import SubCategoryViewPage from '@/features/sub-category/sub-category-view-page';
import { Suspense } from 'react';

export const metadata = {
  title: 'Dashboard : Sub Category View',
};

type PageProps = { params: Promise<{ sub_category_id: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <SubCategoryViewPage subCategoryId={params.sub_category_id} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
