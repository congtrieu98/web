'use client';

import Link from "next/link";
import { Fragment } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import NewsTabs from "./NewsTabs";

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
}

interface NewsListingProps {
    posts: PostItem[];
    sidebarPosts: PostItem[];
    totalPages: number;
    currentPage: number;
}

const NewsListing = ({ posts, sidebarPosts, totalPages, currentPage }: NewsListingProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams?.toString() || '');
        params.set('page', page.toString());
        router.push(`?${params.toString()}`);
    };

    return (
        <Fragment>
            {/* Breadcrumb */}
            <div className="px-4 sm:px-6 lg:px-8 py-4">
                <p className="text-sm text-gray-600">
                    <Link href="/">Trang chủ</Link> &gt; <span className="text-blue-500">Tin tức - kiến thức</span>
                </p>
            </div>

            {/* Tiêu đề */}
            <div className="px-4 sm:px-6 lg:px-8 pb-6">
                <h1 className="text-3xl font-bold text-center text-blue-700">TIN TỨC - KIẾN THỨC</h1>
            </div>

            {/* Tabs - không có active state */}
            <NewsTabs />

            {/* Main Content with Sidebar */}
            <div className="px-4 sm:px-6 lg:px-8 py-8">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content - 2/3 width */}
                    <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
                        {posts.length > 0 ? (
                            <>
                                <div className="space-y-8">
                                    {posts.map((post) => (
                                        <Link href={`/tin-tuc/${post.slug}`} key={post.id} className="space-y-4">
                                            {/* Title */}
                                            <h3 className="text-lg font-semibold text-gray-800">
                                                {post.title}
                                            </h3>
                                            {/* Image Placeholder */}
                                            <div className="w-full h-[200px] bg-gray-200 rounded-lg overflow-hidden">
                                                {post.thumbnail_url ? (
                                                    <img
                                                        src={post.thumbnail_url}
                                                        alt={post.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                        <span className="text-gray-400">No Image</span>
                                                    </div>
                                                )}
                                            </div>
                                            
                                        </Link>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex justify-center gap-2 mt-8">
                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            const pageNum = i + 1;
                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => handlePageChange(pageNum)}
                                                    className={`px-4 py-2 rounded-md font-semibold text-sm transition-colors ${
                                                        currentPage === pageNum
                                                            ? 'bg-blue-600 text-white'
                                                            : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                Không có bài viết nào
                            </div>
                        )}
                    </div>

                    {/* Sidebar - 1/3 width */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">TIN TỨC KHUYẾN MÃI</h2>
                        <div className="flex flex-col gap-4">
                            {sidebarPosts && sidebarPosts.length > 0 ? (
                                sidebarPosts.map((post) => (
                                    <div key={post.id} className="flex items-center gap-4">
                                        <div className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-200">
                                            {post.thumbnail_url ? (
                                                <img
                                                    src={post.thumbnail_url}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                    <span className="text-xs text-gray-400">No Image</span>
                                                </div>
                                            )}
                                        </div>
                                        <Link href={`/tin-tuc/${post.slug}`} className="text-sm text-gray-700 font-semibold line-clamp-2">
                                            {post.title}
                                        </Link>
                                    </div>
                                ))
                            ) : (
                                <div className="text-sm text-gray-500">Chưa có bài viết nào</div>
                            )}
                        </div>
                        {sidebarPosts && sidebarPosts.length > 4 && <div className="text-center mt-4">
                            <button className="px-6 py-2 border border-blue-500 text-blue-500 rounded-full text-sm font-semibold hover:bg-blue-50">
                                Xem tất cả bài viết <span className="ml-2">▼</span>
                            </button>
                        </div>}
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default NewsListing;

