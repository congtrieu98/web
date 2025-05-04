/* eslint-disable @next/next/no-img-element */
import { Textbody } from '@/components/ui/headline';
import { ProductCommon } from '@/components/ui/productCommon.tsx';
import Link from 'next/link';
import React from 'react';

const BestSellers = () => {
    const products = [
        {
            id: 1,
            img: '/assets/product/case1.png', // Thay bằng đường dẫn hình ảnh
            title: 'Bộ PC Intel Core I7 13700K / RAM 32G / VGA RTX 4060 8G',
            price: '27.999.000đ',
            oldPrice: '29.700.000đ',
            discount: '-6%',
            description: 'Màn hình Asus VA24DQLB (23.8 inch FHD IPS 75Hz)',
            label: 'NEW',
        },
        {
            id: 2,
            img: '/assets/product/case1.png',
            title: 'Bộ PC Intel Core I7 13700K / RAM 32G / VGA RTX 4060 8G',
            price: '27.999.000đ',
            oldPrice: '29.700.000đ',
            discount: '-6%',
            description: 'Màn hình Asus VA24DQLB (23.8 inch FHD IPS 75Hz)',
            label: '2nd',
        },
        {
            id: 3,
            img: '/assets/product/case1.png',
            title: 'Bộ PC Intel Core I7 13700K / RAM 32G / VGA RTX 4060 8G',
            price: '27.999.000đ',
            oldPrice: '29.700.000đ',
            discount: '-6%',
            description: 'Màn hình Asus VA24DQLB (23.8 inch FHD IPS 75Hz)',
            label: 'SALE',
        },
        {
            id: 4,
            img: '/assets/product/case1.png',
            title: 'Bộ PC Intel Core I7 13700K / RAM 32G / VGA RTX 4060 8G',
            price: '27.999.000đ',
            oldPrice: '29.700.000đ',
            discount: '-6%',
            description: 'Màn hình Asus VA24DQLB (23.8 inch FHD IPS 75Hz)',
            label: 'SALE',
        },
    ];

    return (
        <div className="bg-gradient-to-b from-[#0F5B99] to-[#E4A835] p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <Textbody text='SẢN PHẨM BÁN CHẠY' className='text-[32px]' />
                <Link href="/products" className="text-blue-100 hover:text-white text-sm font-normal">Xem Tất Cả &rarr;</Link>
            </div>
            <div className="flex flex-wrap gap-4">
                <div className="w-full lg:w-1/4 bg-white rounded-lg shadow hidden md:block">
                    <img
                        src="/assets/banner/banchay-banner.webp"
                        alt="Banner"
                        className="h-full w-full object-cover rounded-lg"
                    />
                </div>
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <ProductCommon products={products} />
                </div>
            </div>
        </div>
    );
};

export default BestSellers;