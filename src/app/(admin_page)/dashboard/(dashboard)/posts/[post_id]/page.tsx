import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout-dashboard/page-container';
import PostViewPage from '@/features/posts/post-view-page';
import { Suspense } from 'react';

export const metadata = {
  title: 'Dashboard : Post View',
};

type PageProps = { params: Promise<{ post_id: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  console.log('param:', params);

  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <PostViewPage postId={params.post_id} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
