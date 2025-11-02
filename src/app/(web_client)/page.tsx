'use client'

import Image from "next/image";
import React from "react";
import CarouselCommon, { BannerItem } from "@/components/ui/carouselCommon";
import BestSellers from "@/components/web-layout/home/bestSaller";
import ProductList from "@/components/ui/productCommon.tsx/productList";
import NewsList from "@/components/web-layout/news";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";

export default function Home() {
  const banners = [
    // {
    //   type: 'single',
    //   images: [{ src: '/assets/banner/main.png', alt: 'Main Banner' }],
    // },
    {
      type: 'grid',
      images: [
        { src: '/assets/banner/banner1.webp', alt: 'Banner 1' },
        { src: '/assets/banner/banner1.webp', alt: 'Banner 1' },
      ],
    },
    {
      type: 'grid',
      images: [
        { src: '/assets/banner/banner2.webp', alt: 'Banner 2' },
        { src: '/assets/banner/banner2.webp', alt: 'Banner 2' },
      ],
    },
  ] as BannerItem[];
  const isMobile = useIsMobile()

  const { data: categories } = api.category.getAllCategoriesPublic.useQuery();
  const { data: productsHot } = api.products.getProductsByProductType.useQuery({
    productType: {
      'isHot': true,
    },
  });
  return (
    <div className={cn("w-full h-full px-0",
      { 'mt-32': isMobile }
    )}>
      {/* banner */}
      <div className="px-5 py-4">
        <div className="flex gap-2 flex-col w-full">
          {!isMobile && <div>
            <Image
              width={600}
              height={285}
              src="/assets/banner/main.png"
              alt="Banner"
              className="w-full object-cover rounded-lg"
            />
          </div>}
          <CarouselCommon items={banners} />
        </div>
      </div>

      {/* Best saller */}
      <div className="px-5">
        {/* @ts-ignore */}
        <BestSellers productsHot={productsHot || []} />
      </div>

      {/* Product List */}
      <div className="px-5">
        {categories?.map((category) => (  
          <ProductList key={category.id} categoryId={category.id} slug={category.slug || ''} text={category.name} />
        ))}
      </div>

      {/* Product List */}
      <div className="px-5">
        <NewsList />
      </div>
    </div>
  );
}
