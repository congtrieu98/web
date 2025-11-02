/* eslint-disable @next/next/no-img-element */
'use client';

import React from "react";
import { Headline } from "../headline";
import Link from "next/link";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";


const ProductList = ({ text = 'LINH KIỆN MÁY TÍNH', categoryId, slug }: { text?: string, categoryId: string, slug: string }) => {
    const isMobile = useIsMobile()
    const { data: products } = api.products.getProductsByCategory.useQuery({
        categoryId,
        limit: 10,
      });
    return (
        <div className="py-8">
            <div className="flex justify-between mb-6">
                <Headline text={text} />
                <div className="flex justify-between items-center gap-2">
                    <span className={cn("text-base font-normal leading-5 text-[#323232]",
                        { 'hidden': isMobile }
                    )}>CHỌN THEO THƯƠNG HIỆU | </span>
                    <span className={cn("text-base font-normal leading-5 text-[#323232]",
                        { 'hidden': isMobile }
                    )}>CHỌN THEO THƯƠNG HIỆU</span>
                    <Link href={`/category/${slug}`} className="text-blue-500 hover:text-orange-500 font-normal leading-5">
                        Xem Tất Cả &rarr;
                    </Link>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {products?.map((product) => (
                    <Link href={`/products/${product.slug}`}
                        key={product.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border"
                    >
                        <div className="relative">
                            <img
                                src={ 
                                    // @ts-ignore
                                    product?.media && product?.media[0] as string || '#'}
                                alt={product.productName}
                                className="w-full h-full object-cover"

                            />
                            <span className="absolute top-2 left-2 bg-yellow-400 text-white text-xs px-2 py-1 rounded-md">
                                SALE
                            </span>
                        </div>
                        <div className="p-4">
                            <h3 className="text-sm font-semibold text-gray-800 mb-2">
                                {product.productName}
                            </h3>
                            <div className="mt-2 flex flex-col gap-2 items-left justify-start">
                                <div className="flex gap-1 text-left justify-between">
                                    <span className="text-gray-400 line-through text-sm ">{product.oldPrice}</span>
                                    <span className="text-green-500 text-sm">6%</span>
                                </div>
                                <span className="flex text-[#BF1F2C] text-xl leading-5 font-extrabold justify-start">{product.price}</span>

                            </div>
                            <p className="text-xs text-gray-500 mb-2">
                                    {/* {product.description} */}
                                <span
                                    className="line-clamp-2 overflow-hidden text-ellipsis"
                                    dangerouslySetInnerHTML={{
                                        __html:
                                            (product.description && product.description?.length && product.description?.length > 0
                                                ? product.description
                                                : ""),
                                    }}
                                />
                                </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default ProductList;