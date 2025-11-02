import { notFound } from 'next/navigation';
import PostCategoryForm from './post-category-form';
import { api } from '@/trpc/server';
import { PostCategory } from '@/types/main';

type TPostCategoryViewPageProps = {
  postCategoryId: string;
};

export default async function PostCategoryViewPage({
  postCategoryId,
}: TPostCategoryViewPageProps) {
  let postCategory = null;
  let pageTitle = 'Create New Post Category';

  if (postCategoryId !== 'create') {
    const data = await api?.postCategory?.getCategoryById({ id: postCategoryId });

    postCategory = data as unknown as PostCategory;
    if (!postCategory) {
      notFound();
    }
    pageTitle = `Edit Post Category`;
  }

  return <PostCategoryForm initialData={postCategory} pageTitle={pageTitle} />;
}
