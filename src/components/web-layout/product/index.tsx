/* eslint-disable @next/next/no-img-element */
'use client';

import DescriptionContent, { Spec } from "./descripContent";
import ProductDetail from "./productDetail";
import { api } from "@/trpc/react";
import { Product } from "@/types/main";
import Link from "next/link";
import { Headline } from "@/components/ui/headline";
import Container from "../container";


export const ProductPageLayout = ({ slugProduct }: { slugProduct: string }) => {

    const { data: product, isLoading, error } = api.products.getProductBySlug.useQuery({
        slug: slugProduct,
    });
    const { data: products } = api.products.getProductsByCategory.useQuery({
        categoryId: product?.categoryId as string,
        limit: 5,
    });

    // Hiển thị loading state
    if (isLoading) {
        return (
            <Container>
                <div className="px-5">
                <div className="px-4 sm:px-6 lg:px-8 py-4">
                    <div className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                        <div className="h-8 bg-gray-200 rounded w-1/2 mb-8"></div>
                        <div className="h-64 bg-gray-200 rounded mb-8"></div>
                    </div>
                </div>
            </div>
            </Container>
        );
    }

    // Hiển thị error state hoặc product không tồn tại
    if (error || !product) {
        return (
            <Container> 
            <div className="px-5">
                <div className="px-4 sm:px-6 lg:px-8 py-4">
                    <div className="text-center py-12">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                            Sản phẩm không tồn tại
                        </h1>
                        <p className="text-gray-600 mb-6">
                            Không tìm thấy sản phẩm với slug: {slugProduct}
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                            Về trang chủ
                        </Link>
                    </div>
                </div>
            </div>
            </Container>
        );
    }

    return (
        <Container>
        <div className="px-5">
            {/* Breadcrumb */}
            <div className="px-4 sm:px-6 lg:px-8 py-4">
                <p className="text-sm text-gray-600">
                    <Link href="/" className="">Trang chủ</Link> &gt; <span className="text-blue-500">{product.productName}</span>
                </p>
            </div>

            {/* Sản phẩm nổi bật */}
            <div className="my-5">
                <ProductDetail product={product as Product} />
            </div>

            <div className="my-5">
                <DescriptionContent
                    description={product.description as string}
                    specs={product.specs as Spec[]}
                />
            </div>

            <div className="my-5">
                <div className="flex justify-between mb-6">
                    <Headline text="Sản phẩm liên quan" />
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
                                    style={{
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}
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
        </div>
        </Container>
    );
};