/* eslint-disable @next/next/no-img-element */
'use client';

import React from "react";
import { Headline } from "../headline";
import Link from "next/link";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const products = [
    {
        id: 1,
        image: "/assets/product/case1.png", // Thay bằng URL ảnh thực tế
        title: "Bộ PC Intel Core I7 13700K / RAM 32G / VGA RTX 4060 8G",
        description: "Màn hình Asus VA24DQLB (23.8 inch FHD IPS 75Hz)",
        oldPrice: "29.700.000đ",
        newPrice: "27.999.000đ",
        discount: "-6%",
    },
    {
        id: 2,
        image: "/assets/product/case1.png", // Thay bằng URL ảnh thực tế
        title: "Bộ PC Intel Core I7 13700K / RAM 32G / VGA RTX 4060 8G",
        description: "Màn hình Asus VA24DQLB (23.8 inch FHD IPS 75Hz)",
        oldPrice: "29.700.000đ",
        newPrice: "27.999.000đ",
        discount: "-6%",
    },
    {
        id: 3,
        image: "/assets/product/case1.png", // Thay bằng URL ảnh thực tế
        title: "Bộ PC Intel Core I7 13700K / RAM 32G / VGA RTX 4060 8G",
        description: "Màn hình Asus VA24DQLB (23.8 inch FHD IPS 75Hz)",
        oldPrice: "29.700.000đ",
        newPrice: "27.999.000đ",
        discount: "-6%",
    },
    {
        id: 4,
        image: "/assets/product/case1.png", // Thay bằng URL ảnh thực tế
        title: "Bộ PC Intel Core I7 13700K / RAM 32G / VGA RTX 4060 8G",
        description: "Màn hình Asus VA24DQLB (23.8 inch FHD IPS 75Hz)",
        oldPrice: "29.700.000đ",
        newPrice: "27.999.000đ",
        discount: "-6%",
    },
    {
        id: 5,
        image: "/assets/product/case1.png", // Thay bằng URL ảnh thực tế
        title: "Bộ PC Intel Core I7 13700K / RAM 32G / VGA RTX 4060 8G",
        description: "Màn hình Asus VA24DQLB (23.8 inch FHD IPS 75Hz)",
        oldPrice: "29.700.000đ",
        newPrice: "27.999.000đ",
        discount: "-6%",
    },
    // Thêm các sản phẩm khác ở đây
];
const ProductList = ({ text = 'LINH KIỆN MÁY TÍNH' }: { text?: string }) => {
    const isMobile = useIsMobile()
    return (
        <div className="py-8">
            <div className="max-w-7xl">
                <div className="flex justify-between mb-6">
                    <Headline text={text} />
                    <div className="flex justify-between items-center gap-2">
                        <span className={cn("text-base font-normal leading-5 text-[#323232]",
                            { 'hidden': isMobile }
                        )}>CHỌN THEO THƯƠNG HIỆU | </span>
                        <span className={cn("text-base font-normal leading-5 text-[#323232]",
                            { 'hidden': isMobile }
                        )}>CHỌN THEO THƯƠNG HIỆU</span>
                        <Link href="#" className="text-blue-500 hover:text-orange-500 font-normal leading-5">
                            Xem Tất Cả &rarr;
                        </Link>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {products.map((product) => (
                        <Link href={'/products/o-cung-hdd-asus-a561'}
                            key={product.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border"
                        >
                            <div className="relative">
                                <img
                                    src={product.image}
                                    alt={product.title}
                                    className="w-full h-full object-cover"

                                />
                                <span className="absolute top-2 left-2 bg-yellow-400 text-white text-xs px-2 py-1 rounded-md">
                                    SALE
                                </span>
                            </div>
                            <div className="p-4">
                                <h3 className="text-sm font-semibold text-gray-800 mb-2">
                                    {product.title}
                                </h3>
                                <div className="mt-2 flex flex-col gap-2 items-left justify-start">
                                    <div className="flex gap-1 text-left justify-between">
                                        <span className="text-gray-400 line-through text-sm ">{product.oldPrice}</span>
                                        <span className="text-green-500 text-sm">{product.discount}</span>
                                    </div>
                                    <span className="flex text-[#BF1F2C] text-xl leading-5 font-extrabold justify-start">{product.newPrice}</span>

                                </div>
                                <p className="text-xs text-gray-500 mb-2">
                                    {product.description}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductList;