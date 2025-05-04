/* eslint-disable @next/next/no-img-element */
'use client';

import ProductDetail from "./productDetail";



// const products = [
//     {
//         id: 1,
//         image: "https://via.placeholder.com/200",
//         title: "Màn hình Asus ProArt PA32UCX 32 inch 4K HDR",
//         oldPrice: "29.999.000đ",
//         newPrice: "27.999.000đ",
//         rating: 5,
//         description: "Màn hình chuyên dành cho Adobe Creative Cloud",
//     },
//     // Thêm các sản phẩm nổi bật khác ở đây
// ];

// const newsItems = [
//     {
//         id: 1,
//         image: "https://via.placeholder.com/300",
//         title: "Top 100+ cấu hình PC Gaming giá tốt nhất năm 2024",
//     },
//     // Thêm các tin tức khác tại đây
// ];


export const ProductPageLayout = ({ slugCat }: { slugCat: string }) => {
    console.log('slugCat:', slugCat);

    return (
        <div className="px-5">
            {/* Breadcrumb */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <p className="text-sm text-gray-600">
                    Trang chủ &gt; <span className="text-blue-500">Thiết bị lưu trữ</span>
                </p>
            </div>

            {/* Sản phẩm nổi bật */}
            <div className="my-5">
                <ProductDetail />
            </div>
        </div>
    );
}