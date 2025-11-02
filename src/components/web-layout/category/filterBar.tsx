/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";



const priceRangesArray = [
    "Dưới 10 triệu",
    "10 triệu - 15 triệu",
    "15 triệu - 20 triệu",
    "20 triệu - 30 triệu",
    "30 triệu - 50 triệu",
    "50 triệu - 100 triệu",
];
const FilterBar = ({ categoryId }: { categoryId?: string }) => {
    // const [selectedBrands, setSelectedBrands] = useState(["/assets/filter/logo-msi.png", "/assets/filter/logo-samsungs.png"]);
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
    const [selectedBrandIds, setSelectedBrandIds] = useState<string[]>([]);
    const [isBrandDropdownOpen, setIsBrandDropdownOpen] = useState(false);
    const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'created_at'>('created_at');

    // Query brands từ API
    const { data: brands } = api.brands.getAllBrandsPublic.useQuery();

    // Convert price range text to min/max values
    const parsePriceRange = (rangeText: string): { min: number; max: number | null } | null => {
        // Remove text in parentheses and extra spaces
        const cleanText = rangeText.replace(/\(.*?\)/g, '').trim();
        
        if (cleanText.includes('Dưới')) {
            // "Dưới 10 triệu" -> max: 10000000 (min sẽ là 0)
            const match = cleanText.match(/Dưới\s*(\d+)/);
            if (match) {
                return { min: 0, max: parseInt(match[1]) * 1000000 };
            }
        } else if (cleanText.includes('triệu')) {
            // "10 triệu - 15 triệu" -> min: 10000000, max: 15000000
            const match = cleanText.match(/(\d+)\s*triệu\s*-\s*(\d+)\s*triệu/);
            if (match) {
                return { 
                    min: parseInt(match[1]) * 1000000, 
                    max: parseInt(match[2]) * 1000000 
                };
            }
        }
        return null;
    };

    // Convert selected price filters to price ranges
    const priceRanges = selectedFilters
        .filter(f => priceRangesArray.includes(f))
        .map(f => parsePriceRange(f))
        .filter((r): r is { min: number; max: number | null } => r !== null);

    // Query filtered products
    const { data: filteredProducts, isLoading } = api.products.filterProducts.useQuery({
        categoryId,
        brandIds: selectedBrandIds.length > 0 ? selectedBrandIds : undefined,
        priceRanges: priceRanges.length > 0 ? priceRanges : undefined,
        sortBy,
        page: 1,
        limit: 20,
    }, {
        enabled: true, // Always enabled, filters are optional
    });

    // const handleRemoveBrand = (brand: string) => {
    //     setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    // };

    // const handleClearAll = () => {
    //     setSelectedBrands([]);
    //     setSelectedFilters([]);
    // };


    const toggleFilter = (filter: string) => {
        if (selectedFilters.includes(filter)) {
            setSelectedFilters(selectedFilters.filter((f) => f !== filter));
        } else {
            setSelectedFilters([...selectedFilters, filter]);
        }
    };

    const clearAllFilters = () => {
        setSelectedFilters([]);
        setSelectedBrandIds([]);
    };


    return (
        <>
            <div className="flex flex-col gap-5">
                <div className="bg-white p-4 rounded-lg">
                    <div className="flex flex-wrap gap-6 items-center justify-center">
                        {/* Chọn theo hãng */}
                        <div className="flex flex-col items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                            <button
                                className={`w-16 h-16 rounded-full flex items-center justify-center transition ${selectedBrandIds.length > 0
                                        ? "bg-blue-500"
                                        : "bg-gray-200"
                                    }`}
                                onClick={() => {
                                    setIsBrandDropdownOpen(!isBrandDropdownOpen);
                                }}
                            >
                                <span className={`text-sm uppercase font-bold ${selectedBrandIds.length > 0
                                        ? "text-white"
                                        : "text-black"
                                    }`}>
                                    Hãng
                                </span>
                            </button>
                            <span className="text-xs text-center text-gray-800 font-medium">
                                CHỌN THEO HÃNG
                            </span>
                        </div>

                        {/* Chọn theo khoảng giá */}
                        <div className="flex flex-col items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                            <button
                                className={`w-16 h-16 rounded-full flex items-center justify-center transition ${selectedFilters.some(f => priceRangesArray.includes(f))
                                        ? "bg-blue-500"
                                        : "bg-gray-200"
                                    }`}
                                onClick={() => {
                                    // Toggle price range filter modal or dropdown
                                }}
                            >
                                    <span className={`text-sm uppercase font-bold leading-tight ${selectedFilters.some(f => priceRangesArray.includes(f))
                                        ? "text-white"
                                        : "text-black"
                                    }`}>
                                    Giá
                                </span>
                            </button>
                            <span className="text-xs text-center text-gray-800 font-medium">
                                CHỌN THEO KHOẢNG GIÁ
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg">
                    <div className="mb-4">
                        <span className="text-sm font-semibold text-gray-600 mr-4">
                            Khoảng giá
                        </span>
                        <div className="flex flex-wrap gap-2">
                            {priceRangesArray.map((range) => (
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

                    {/* Brand Multi-Select */}
                    <div className="mb-4">
                        <span className="text-sm font-semibold text-gray-600 mr-4">
                            Chọn theo thương hiệu
                        </span>
                        <Popover open={isBrandDropdownOpen} onOpenChange={setIsBrandDropdownOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                        "w-[300px] justify-between",
                                        !selectedBrandIds.length && "text-muted-foreground"
                                    )}
                                >
                                    {selectedBrandIds.length === 0
                                        ? "Chọn thương hiệu"
                                        : selectedBrandIds.length === 1
                                        ? brands?.find((b) => b.id === selectedBrandIds[0])?.name
                                        : `Đã chọn ${selectedBrandIds.length} thương hiệu`}
                                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[300px] p-0">
                                <div className="max-h-[300px] overflow-y-auto p-2">
                                    {brands?.map((brand) => {
                                        const isSelected = selectedBrandIds.includes(brand.id);
                                        return (
                                            <div
                                                key={brand.id}
                                                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-zinc-100 focus:bg-zinc-100"
                                                onClick={() => {
                                                    if (isSelected) {
                                                        setSelectedBrandIds(selectedBrandIds.filter(id => id !== brand.id));
                                                    } else {
                                                        setSelectedBrandIds([...selectedBrandIds, brand.id]);
                                                    }
                                                }}
                                            >
                                                <div className="flex items-center gap-2 w-full">
                                                    <div className={cn(
                                                        "flex h-4 w-4 items-center justify-center rounded-sm border border-zinc-300",
                                                        isSelected && "bg-blue-500 border-blue-500"
                                                    )}>
                                                        {isSelected && (
                                                            <Check className="h-3 w-3 text-white" />
                                                        )}
                                                    </div>
                                                    <span className="flex-1">{brand.name}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {selectedBrandIds.length > 0 && (
                                        <>
                                            <div className="border-t my-2"></div>
                                            <div
                                                className="px-2 py-1.5 text-sm text-blue-600 cursor-pointer hover:bg-gray-100 rounded-sm"
                                                onClick={() => {
                                                    setSelectedBrandIds([]);
                                                }}
                                            >
                                                Xóa tất cả
                                            </div>
                                        </>
                                    )}
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Selected Filters */}
                    {(selectedFilters.length > 0 || selectedBrandIds.length > 0) && (
                        <div className="mb-4">
                            <span className="text-sm font-semibold text-gray-600">
                                Lọc theo
                            </span>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {/* Hiển thị các price filters */}
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
                                {/* Hiển thị các brand đã chọn */}
                                {selectedBrandIds.map((brandId) => {
                                    const brand = brands?.find(b => b.id === brandId);
                                    if (!brand) return null;
                                    return (
                                        <div
                                            key={brandId}
                                            className="flex items-center bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold"
                                        >
                                            {brand.name}
                                            <button
                                                className="ml-2 text-blue-600 hover:text-red-500"
                                                onClick={() => {
                                                    setSelectedBrandIds(selectedBrandIds.filter(id => id !== brandId));
                                                }}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    );
                                })}
                                <button
                                    className="px-3 py-1 bg-green-500 text-white rounded-full text-sm font-semibold hover:bg-green-600"
                                    onClick={clearAllFilters}
                                >
                                    Xóa tất cả ✕
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>


            {/* Result filter */}
            <div className="bg-white rounded-lg shadow-md mt-6 p-4">
                <div className="max-w-7xl">
                    {/* Sorting Buttons */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <button 
                                className={`px-4 py-2 rounded-full border text-sm font-semibold transition ${
                                    sortBy === 'price_asc' 
                                        ? 'border-blue-500 bg-blue-500 text-white' 
                                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                                onClick={() => setSortBy('price_asc')}
                            >
                                Giá tăng dần
                            </button>
                            <button 
                                className={`px-4 py-2 rounded-full border text-sm font-semibold transition ${
                                    sortBy === 'price_desc' 
                                        ? 'border-blue-500 bg-blue-500 text-white' 
                                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                                onClick={() => setSortBy('price_desc')}
                            >
                                Giá giảm dần
                            </button>
                        </div>
                        {filteredProducts && (
                            <div className="text-sm text-gray-600">
                                Tìm thấy {filteredProducts.metadata.total} sản phẩm
                            </div>
                        )}
                    </div>

                    {/* Product Grid */}
                    {isLoading ? (
                        <div className="text-center py-10">
                            <p className="text-gray-600">Đang tải sản phẩm...</p>
                        </div>
                    ) : filteredProducts && filteredProducts.data.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {filteredProducts.data.map((product) => {
                                // @ts-ignore - media có thể là Json type
                                const media = Array.isArray(product.media) ? product.media as string[] : [];
                                const firstImage = media[0] || '#';
                                const discount = product.oldPrice && product.price 
                                    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
                                    : 0;
                                
                                return (
                                    <Link
                                        key={product.id}
                                        href={`/products/${product.slug || '#'}`}
                                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border"
                                    >
                                        <div className="relative">
                                            <img
                                                src={firstImage}
                                                alt={product.productName}
                                                className="w-full h-48 object-cover"
                                            />
                                            {discount > 0 && (
                                                <span className="absolute top-2 left-2 bg-yellow-400 text-white text-xs px-2 py-1 rounded-md">
                                                    -{discount}%
                                                </span>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <h3 className="text-sm font-semibold text-gray-800 mb-2 line-clamp-2">
                                                {product.productName}
                                            </h3>
                                            <div className="mt-2 flex flex-col gap-2 items-left justify-start">
                                                {product.oldPrice && (
                                                    <div className="flex gap-1 text-left justify-between">
                                                        <span className="text-gray-400 line-through text-sm">
                                                            {product.oldPrice.toLocaleString('vi-VN')}đ
                                                        </span>
                                                        {discount > 0 && (
                                                            <span className="text-green-500 text-sm">-{discount}%</span>
                                                        )}
                                                    </div>
                                                )}
                                                <span className="flex text-[#BF1F2C] text-xl leading-5 font-extrabold justify-start">
                                                    {typeof product.price === 'number' ? product.price.toLocaleString('vi-VN') : '0'}đ
                                                </span>
                                            </div>
                                            {product.description && (
                                                <p className="text-xs text-gray-500 mb-2 mt-2 line-clamp-2">
                                                    <span
                                                        dangerouslySetInnerHTML={{
                                                            __html: product.description || '',
                                                        }}
                                                    />
                                                </p>
                                            )}
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-gray-600">Không tìm thấy sản phẩm nào với bộ lọc hiện tại.</p>
                        </div>
                    )}

                </div>
            </div>
        </>
    );
};

export default FilterBar;