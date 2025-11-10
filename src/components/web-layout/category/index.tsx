'use client';

import { api } from "@/trpc/react";
import BestSellers from "../home/bestSaller";
import ContentWithSidebar from "./contentWithSidebar";
import FilterBar from "./filterBar";
// import ProductList from "@/components/ui/productCommon.tsx/productList";
import { Fragment } from "react";
import { Category, Product } from "@/types/main";
import Link from "next/link";


export const CategoryPageLayout = ({ slugCat }: { slugCat: string }) => {
    const { data: category } = api.category.getCategoryBySlug.useQuery({ slug: slugCat });
    console.log('category:', category);

    // Cast products để phù hợp với type Product
    const productsHot = category?.products as Product[] | undefined;

    return (
        <Fragment>
            {/* Breadcrumb */}
            <div className="px-4 sm:px-6 lg:px-8 py-4">
                <p className="text-sm text-gray-600">
                    <Link href="/">Trang chủ</Link> &gt; <span className="text-blue-500">{category?.name}</span>
                </p>
            </div>

            {/* Tiêu đề */}
            <div className="px-4 sm:px-6 lg:px-8 pb-10">
                <h1 className="text-3xl font-bold text-center text-blue-700">{category?.name}</h1>
            </div>

            {/* Sản phẩm nổi bật */}
            {productsHot && productsHot.length > 0 ? (
                <div className="my-5">
                    <BestSellers isShowBanner={false} isShowReadMore={false} productsHot={productsHot} title='Sản phẩm nổi bật' />
                </div>
            ) : (
                <div className="bg-white col-span-2 p-4 sm:px-6 lg:px-8 rounded-lg shadow-md">
                <div className="flex justify-center items-center h-full w-full py-6">
                <p className="text-center">Không có sản phẩm nổi bật</p>
            </div>
                    
                </div>
                
            )}

            {/* Filter Bar */}
            <div className="my-5">
                <FilterBar categoryId={category?.id} />
            </div>

            <div className="my-5">
                <ContentWithSidebar category={category as Category} />
            </div>
        </Fragment>
    );
}