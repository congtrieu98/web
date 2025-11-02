/* eslint-disable @next/next/no-img-element */
import { Textbody } from '@/components/ui/headline';
import { ProductCommon } from '@/components/ui/productCommon.tsx';
import { Product } from '@/types/main';
import Link from 'next/link';
import React from 'react';

const BestSellers = ({ isShowBanner = true, isShowReadMore = true, productsHot, title = 'SẢN PHẨM BÁN CHẠY' }: { isShowBanner?: boolean, isShowReadMore?: boolean, productsHot: Product[], title?: string }) => {
    return (
        <div className="bg-gradient-to-b from-[#0F5B99] to-[#E4A835] p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <Textbody text={title} className='md:text-[32px] text-lg' />
                {isShowReadMore && <Link href="/products" className="text-blue-100 hover:text-white text-sm font-normal">Xem Tất Cả &rarr;</Link>}
            </div>
            <div className="flex flex-wrap gap-4">
                {isShowBanner && <div className="w-full lg:w-1/4 bg-white rounded-lg shadow hidden md:block">
                    <img
                        src="/assets/banner/banchay-banner.webp"
                        alt="Banner"
                        className="h-full w-full object-cover rounded-lg"
                    />
                </div>}
                <div className={`flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 ${isShowBanner ? 'lg:grid-cols-4' : 'lg:grid-cols-5'} gap-4`}>
                    <ProductCommon products={productsHot || []} />
                </div>
            </div>
        </div>
    );
};

export default BestSellers;