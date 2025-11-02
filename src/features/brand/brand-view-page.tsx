import { notFound } from 'next/navigation';
import BrandForm from './brand-form';
import { api } from '@/trpc/server';
import { Brand } from '@/types/main';

type TBrandViewPageProps = {
  brandId: string;
};

export default async function BrandViewPage({
  brandId,
}: TBrandViewPageProps) {
  let brand = null;
  let pageTitle = 'Create New Brand';

  if (brandId !== 'create') {
    const data = await api?.brands?.getBrandById({ id: brandId });

    brand = data as unknown as Brand;
    if (!brand) {
      notFound();
    }
    pageTitle = `Edit Brand`;
  }

  return <BrandForm initialData={brand} pageTitle={pageTitle} />;
}

