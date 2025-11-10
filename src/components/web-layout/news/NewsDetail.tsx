'use client';

import Link from "next/link";
import { Fragment, useMemo } from "react";
import { SafeHtmlRenderer } from "@/components/ui/html-renderer";
import NewsTabs, { TabType } from "./NewsTabs";

interface PostCategory {
    name: string;
    slug: string | null;
}

interface PostItem {
    id: string;
    title: string;
    slug: string;
    thumbnail_url: string | null;
    content: string | null;
    category_id: string | null;
    created_at: string | null;
    updated_at: string | null;
    created_by: string | null;
    updated_by: string | null;
    post_category?: PostCategory | null;
}

interface NewsDetailProps {
    post: PostItem | null;
}

// Helper function để map category name với tab type
const getTabFromCategory = (categoryName: string | null | undefined): TabType | null => {
    if (!categoryName) return null;
    
    const categoryNameLower = categoryName.toLowerCase();
    
    if (categoryNameLower.includes('review') || categoryNameLower.includes('đánh giá')) {
        return 'REVIEW';
    }
    if (categoryNameLower.includes('tuyển dụng') || categoryNameLower.includes('recruitment')) {
        return 'TUYỂN DỤNG';
    }
    if (categoryNameLower.includes('khuyến mãi') || categoryNameLower.includes('promotion')) {
        return 'TIN TỨC KHUYẾN MÃI';
    }
    
    return null;
};

const NewsDetail = ({ post }: NewsDetailProps) => {
    // Xác định active tab dựa trên category của post
    const activeTab = useMemo(() => {
        if (!post?.post_category?.name) return null;
        return getTabFromCategory(post.post_category.name);
    }, [post?.post_category?.name]);

    if (!post) {
        return (
            <div className="bg-gray-50">
                <div className="px-4 sm:px-6 lg:px-8 py-4">
                    <p className="text-sm text-gray-600">
                        <Link href="/">Trang chủ</Link> &gt; <span className="text-blue-500">Tin tức - kiến thức</span>
                    </p>
                </div>
                <div className="px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center py-8 text-gray-500">
                        Không tìm thấy bài viết
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pb-10">
            {/* Breadcrumb */}
            <div className="px-4 sm:px-6 lg:px-8 py-4">
                <p className="text-sm text-gray-600">
                    <Link href="/">Trang chủ</Link> &gt; <Link href="/tin-tuc" className="text-blue-500 hover:underline">Tin tức - kiến thức</Link> &gt; <span className="text-blue-500">{post.title}</span>
                </p>
            </div>

            {/* Tiêu đề */}
            <div className="px-4 sm:px-6 lg:px-8 pb-6">
                <h1 className="text-3xl font-bold text-center text-blue-700">TIN TỨC - KIẾN THỨC</h1>
            </div>

            {/* Tabs - active dựa trên category */}
            <NewsTabs activeTab={activeTab} />

            {/* Content */}
            <div className="px-4 sm:px-6 lg:px-8 py-8">
                <div className="p-5 rounded-xl bg-white">
                    {/* Title */}
                    <h2 className="text-2xl font-bold text-blue-600 mb-6">
                        {post.title}
                    </h2>

                    {/* Image/Video Placeholder */}
                    <div className="w-full mb-6 rounded-lg overflow-hidden shadow-md bg-gray-200 min-h-[400px] flex items-center justify-center">
                        {post.thumbnail_url ? (
                            <img
                                src={post.thumbnail_url}
                                alt={post.title}
                                className="w-full h-auto object-cover"
                            />
                        ) : (
                            <div className="w-full h-[400px] bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-400">No Image</span>
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    {post.content && (
                        <div className="prose max-w-none">
                            <SafeHtmlRenderer html={post.content} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NewsDetail;

