import { notFound } from 'next/navigation';
import SubCategoryForm from './sub-category-form';
import { api } from '@/trpc/server';
import { Category } from '@/types/main';

type TSubCategoryViewPageProps = {
  subCategoryId: string;
};

export default async function SubCategoryViewPage({
  subCategoryId,
}: TSubCategoryViewPageProps) {
  let category = null;
  let pageTitle = 'Create New Sub Category';

  if (subCategoryId !== 'create') {
    const data = await api?.category?.getCategoryById({ id: subCategoryId });

    console.log({ data });
    category = data as unknown as Category;
    if (!category) {
      notFound();
    }
    pageTitle = `Update Sub Category`;
  }

  return <SubCategoryForm initialData={category} pageTitle={pageTitle} />;
}
