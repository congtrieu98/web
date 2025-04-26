import { notFound } from 'next/navigation';
import { api } from '@/trpc/server';
import { Product } from '@/types/main';
import ProductForm from './product-form';

type TCategoryViewPageProps = {
  productId: string;
};

export default async function ProductViewPage({
  productId,
}: TCategoryViewPageProps) {
  let product = null;
  let pageTitle = 'Create New Product';

  console.log('productIs:', productId);


  if (productId !== 'create') {
    const data = await api?.products?.getProductsById({ id: productId });

    product = data as unknown as Product;
    if (!product) {
      notFound();
    }
    pageTitle = `Edit Product`;
  }

  return <ProductForm initialData={product} pageTitle={pageTitle} />;
}
