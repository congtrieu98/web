import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout-dashboard/page-container';
import PostCategoryViewPage from '@/features/postCategory/post-category-view-page';
import { Suspense } from 'react';

export const metadata = {
  title: 'Dashboard : Category View',
};

type PageProps = { params: Promise<{ post_cat_id: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <PostCategoryViewPage postCategoryId={params.post_cat_id} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
