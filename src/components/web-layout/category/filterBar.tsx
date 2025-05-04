/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";



const priceRanges = [
    "Dưới 10 triệu",
    "10 triệu - 15 triệu (10)",
    "15 triệu - 20 triệu (10)",
    "20 triệu - 30 triệu (10)",
    "30 triệu - 50 triệu (10)",
    "50 triệu - 100 triệu (10)",
];

const criteria = [
    "Thương hiệu",
    "Độ phân giải (UHD 4K)",
    "Kích thước",
    "Tần số quét",
    "Tấm nền",
    "Bề mặt",
];

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
    {
        id: 5,
        img: '/assets/product/case1.png',
        title: 'Bộ PC Intel Core I7 13700K / RAM 32G / VGA RTX 4060 8G',
        price: '27.999.000đ',
        oldPrice: '29.700.000đ',
        discount: '-6%',
        description: 'Màn hình Asus VA24DQLB (23.8 inch FHD IPS 75Hz)',
        label: 'SALE',
    },
];
const FilterBar = () => {
    const [selectedBrands, setSelectedBrands] = useState(["/assets/filter/logo-msi.png", "/assets/filter/logo-samsungs.png"]);
    const [selectedFilters, setSelectedFilters] = useState([
        "10 triệu - 15 triệu",
        "3840x2160",
    ]);

    const handleRemoveBrand = (brand: string) => {
        setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    };

    const handleClearAll = () => {
        setSelectedBrands([]);
        setSelectedFilters([]);
    };


    const toggleFilter = (filter: string) => {
        if (selectedFilters.includes(filter)) {
            setSelectedFilters(selectedFilters.filter((f) => f !== filter));
        } else {
            setSelectedFilters([...selectedFilters, filter]);
        }
    };

    const clearAllFilters = () => {
        setSelectedFilters([]);
    };


    return (
        <>
            <div className="bg-white p-4 rounded-lg shadow-md">
                {/* Selected Brands */}
                <div className="flex items-center gap-2 mb-4">
                    {selectedBrands.map((brand) => (
                        <div
                            key={brand}
                            className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm font-semibold text-gray-800"
                        >
                            <img
                                src={brand} // Thay URL logo thực tế
                                alt={"Brand Logo"}
                                className="w-full h-full mr-2"
                            />
                            <button
                                className="ml-2 text-gray-500 hover:text-red-500"
                                onClick={() => handleRemoveBrand(brand)}
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                    <button
                        className="text-sm text-blue-500 font-semibold hover:underline"
                        onClick={handleClearAll}
                    >
                        Xóa tất cả
                    </button>
                </div>

                <div className="mb-4">
                    <span className="text-sm font-semibold text-gray-600 mr-4">
                        Khoảng giá
                    </span>
                    <div className="flex flex-wrap gap-2">
                        {priceRanges.map((range) => (
                            <button
                                key={range}
                                className={`px-3 py-1 rounded-full text-sm font-semibold transition ${selectedFilters.includes(range)
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                    }`}
                                onClick={() => toggleFilter(range)}
                            >
                                {range}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Criteria */}
                <div className="mb-4">
                    <span className="text-sm font-semibold text-gray-600 mr-4">
                        Chọn theo tiêu chí
                    </span>
                    <div className="flex flex-wrap gap-2">
                        {criteria.map((criterion) => (
                            <button
                                key={criterion}
                                className={`px-3 py-1 rounded-full text-sm font-semibold transition ${selectedFilters.includes(criterion)
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                    }`}
                                onClick={() => toggleFilter(criterion)}
                            >
                                {criterion}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Selected Filters */}
                <div className="mb-4">
                    <span className="text-sm font-semibold text-gray-600">
                        Lọc theo
                    </span>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {selectedFilters.map((filter) => (
                            <div
                                key={filter}
                                className="flex items-center bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold"
                            >
                                {filter}
                                <button
                                    className="ml-2 text-blue-600 hover:text-red-500"
                                    onClick={() => toggleFilter(filter)}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                        {selectedFilters.length > 0 && (
                            <button
                                className="px-3 py-1 bg-green-500 text-white rounded-full text-sm font-semibold hover:bg-green-600"
                                onClick={clearAllFilters}
                            >
                                Xóa tất cả ✕
                            </button>
                        )}
                    </div>
                </div>
            </div>


            {/* Result filter */}
            <div className="bg-white rounded-lg shadow-md mt-6 p-4">
                <div className="max-w-7xl">
                    {/* Sorting Buttons */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <button className="px-4 py-2 rounded-full border border-gray-300 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-100">
                                Giá tăng dần
                            </button>
                            <button className="px-4 py-2 rounded-full border border-gray-300 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-100">
                                Giá giảm dần
                            </button>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                            >
                                <div className="relative">
                                    <img
                                        src={product.img}
                                        alt={product.title}
                                        className="w-full h-48 object-cover"
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
                                        <span className="flex text-[#BF1F2C] text-xl leading-5 font-extrabold justify-start">{product.price}</span>

                                    </div>
                                    <p className="text-xs text-gray-500 mb-2">
                                        {product.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* View All Button */}
                    <div className="mt-6 text-center">
                        <button className="px-6 py-2 border border-blue-500 text-blue-500 rounded-full text-sm font-semibold hover:bg-blue-50">
                            Xem tất cả <span className="ml-2">▼</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FilterBar;