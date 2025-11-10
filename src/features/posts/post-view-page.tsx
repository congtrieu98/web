import { notFound } from 'next/navigation';
import { api } from '@/trpc/server';
import { Post } from '@/types/main';
import PostForm from './post-form';
// import ProductForm from './product-form';

type TPostViewPageProps = {
  postId: string;
};

export default async function PostViewPage({
  postId,
}: TPostViewPageProps) {
  let post = null;
  let pageTitle = 'Create New Post';

  if (postId !== 'create') {
    const data = await api?.posts?.getPostById({ id: postId });

    post = data as unknown as Post;
    if (!post) {
      notFound();
    }
    pageTitle = `Edit Post`;
  }

  return <PostForm initialData={post} pageTitle={pageTitle} />;
}
