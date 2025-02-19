import { notFound } from 'next/navigation';
import CategoryForm from './category-form';
import { api } from '@/trpc/server';
import { Category } from '@/types/main';

type TCategoryViewPageProps = {
  categoryId: string;
};

export default async function CategoryViewPage({
  categoryId,
}: TCategoryViewPageProps) {
  let category = null;
  let pageTitle = 'Create New Category';

  console.log({ categoryId })

  if (categoryId !== 'create') {
    const data = await api?.category?.getCategoryById({ id: categoryId });

    console.log({ data });
    category = data as unknown as Category;
    if (!category) {
      notFound();
    }
    pageTitle = `Edit Category`;
  }

  return <CategoryForm initialData={category} pageTitle={pageTitle} />;
}
