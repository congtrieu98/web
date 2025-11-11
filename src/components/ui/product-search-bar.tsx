'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { api } from '@/trpc/react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface ProductSearchBarProps {
    className?: string;
    inputClassName?: string;
}

export function ProductSearchBar({ className, inputClassName }: ProductSearchBarProps = {}) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Debounce search query
    const [debouncedQuery, setDebouncedQuery] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Fetch products when debounced query changes
    const { data: searchResults, isLoading } = api.products.getAllProductsWithoutAuth.useQuery(
        {
            search: debouncedQuery || undefined,
            limit: 10,
            page: 1,
        },
        {
            enabled: debouncedQuery.length > 0,
        }
    );

    const products = searchResults?.data || [];

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        setIsOpen(value.length > 0);
    };

    const handleClear = () => {
        setSearchQuery('');
        setDebouncedQuery('');
        setIsOpen(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
            setIsOpen(false);
        }
    };

    const handleProductClick = () => {
        setIsOpen(false);
        setSearchQuery('');
    };

    // Get first image from media array
    const getProductImage = (product: any): string => {
        const media = Array.isArray(product.media) ? product.media as string[] : [];
        if (media.length > 0 && media[0]) {
            return media[0];
        }
        return '/assets/placeholder-product.png';
    };

    // Format price
    const formatPrice = (price: number): string => {
        return price.toLocaleString('vi-VN');
    };

    return (
        <div className={`relative ${className || 'flex-grow'}`} ref={searchRef}>
            <form onSubmit={handleSubmit} className={`flex items-center flex-grow bg-white ${inputClassName || 'rounded-md px-3 py-2'}`}>
                <input
                    type="text"
                    placeholder="Bạn cần tìm gì?"
                    value={searchQuery}
                    onChange={handleInputChange}
                    onFocus={() => {
                        if (searchQuery.length > 0) {
                            setIsOpen(true);
                        }
                    }}
                    className="flex-1 outline-none text-black text-sm placeholder-gray-400"
                />
                {searchQuery && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="mr-2 text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
                <button type="submit">
                    <Search className="w-5 h-5 text-gray-700" />
                </button>
            </form>

            {/* Dropdown Results */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-[500px] overflow-y-auto">
                    {isLoading ? (
                        <div className="p-4 text-center text-gray-500">Đang tìm kiếm...</div>
                    ) : products.length > 0 ? (
                        <div className="py-2">
                            {products.map((product: any) => {
                                const imageUrl = getProductImage(product);
                                const price = typeof product.price === 'number' ? product.price : 0;

                                return (
                                    <Link
                                        key={product.id}
                                        href={`/products/${product.slug || '#'}`}
                                        onClick={handleProductClick}
                                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="relative w-16 h-16 flex-shrink-0 rounded overflow-hidden border">
                                            <Image
                                                src={imageUrl}
                                                alt={product.productName || ''}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-medium text-gray-800 line-clamp-2">
                                                {product.productName}
                                            </h3>
                                            <p className="text-[#BF1F2C] text-base font-bold mt-1">
                                                {formatPrice(price)}₫
                                            </p>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    ) : debouncedQuery.length > 0 ? (
                        <div className="p-4 text-center text-gray-500">
                            Không tìm thấy sản phẩm nào
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
}

