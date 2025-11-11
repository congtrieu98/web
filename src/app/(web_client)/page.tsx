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
  const isMobile = useIsMobile()

  const { data: categories } = api.category.getAllCategoriesPublic.useQuery();
  const { data: productsHot } = api.products.getProductsByProductType.useQuery({
    productType: {
      'isHot': true,
    },
  });
  const { data: bannersData } = api.banners.getAllPublic.useQuery();
  
  // Transform banners data to match BannerItem format
  // For grid type: split images into slides of 2 images each
  // For single type: each image = 1 slide
  // Each image has its own linkProduct
  const banners: BannerItem[] = bannersData?.flatMap((banner) => {
    const images = banner.images as { src: string; alt?: string; linkProduct?: string | null }[] || [];
    
    if (banner.type === 'grid') {
      // Split grid images into slides of 2 images each
      const slides: BannerItem[] = [];
      for (let i = 0; i < images.length; i += 2) {
        slides.push({
          type: 'grid',
          images: images.slice(i, i + 2).map(img => ({
            src: img.src,
            alt: img.alt,
            linkProduct: img.linkProduct || null,
          })), // Take 2 images per slide, each with its own linkProduct
        });
      }
      return slides;
    } else {
      // Single type: each image = 1 slide
      return images.map((image) => ({
        type: 'single' as const,
        images: [{
          src: image.src,
          alt: image.alt,
          linkProduct: image.linkProduct || null,
        }], // Each slide has 1 image with its own linkProduct
      }));
    }
  }) as BannerItem[] || [];
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
