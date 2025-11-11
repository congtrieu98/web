import { notFound } from 'next/navigation';
import BannerForm from './banner-form';
import { api } from '@/trpc/server';
import { Banner } from '@/types/main';

type TBannerViewPageProps = {
  bannerId: string;
};

export default async function BannerViewPage({
  bannerId,
}: TBannerViewPageProps) {
  let banner = null;
  let pageTitle = 'Create New Banner';

  if (bannerId !== 'create') {
    const data = await api?.banners?.getBannerById({ id: bannerId });

    banner = data as unknown as Banner;
    if (!banner) {
      notFound();
    }
    pageTitle = `Edit Banner`;
  }

  return <BannerForm initialData={banner} pageTitle={pageTitle} />;
}

