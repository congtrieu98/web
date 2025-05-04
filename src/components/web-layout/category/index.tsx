/* eslint-disable @next/next/no-img-element */
'use client';

import BestSellers from "../home/bestSaller";
import ContentWithSidebar from "./contentWithSidebar";
import FilterBar from "./filterBar";


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


export const CategoryPageLayout = ({ slugCat }: { slugCat: string }) => {
    console.log('slugCat:', slugCat);

    return (
        <div className="px-5">
            {/* Breadcrumb */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <p className="text-sm text-gray-600">
                    Trang chủ &gt; <span className="text-blue-500">Màn Hình</span>
                </p>
            </div>

            {/* Tiêu đề */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
                <h1 className="text-3xl font-bold text-center text-blue-700">MÀN HÌNH</h1>
            </div>

            {/* Sản phẩm nổi bật */}
            <div className="my-5">
                <BestSellers isShowBanner={false} />
            </div>

            {/* Filter Bar */}
            <div className="my-5">
                <FilterBar />
            </div>

            {/* Tin tức */}
            {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">TIN TỨC - KIẾN THỨC</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {newsItems.map((news) => (
                        <div
                            key={news.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                        >
                            <div className="relative">
                                <img
                                    src={news.image}
                                    alt={news.title}
                                    className="w-full h-48 object-cover"
                                />
                                <span className="absolute top-2 left-2 bg-yellow-400 text-white text-xs px-2 py-1 rounded-md">
                                    SALE
                                </span>
                            </div>
                            <div className="p-4">
                                <h3 className="text-sm font-semibold text-gray-800 mb-2">
                                    {news.title}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div> */}
            <div className="my-5">
                <ContentWithSidebar />
            </div>
        </div>
    );
}