/* eslint-disable @next/next/no-img-element */
'use client';

import React from "react";
import { Category } from "@/types/main";
import { DescriptionRenderer } from "@/components/ui/html-renderer";
import { api } from "@/trpc/react";

const ContentWithSidebar = ({ category }: { category: Category }) => {
    const { data: posts, isLoading } = api.posts.getAllPostsPublic.useQuery({ limit: 4 });

    return (
        <div className=" py-8">
            <div className="max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="bg-white col-span-2 p-4 sm:px-6 lg:px-8 rounded-lg shadow-md">
                <DescriptionRenderer
                        description={category?.description || ''} 
                        maxHeight="120px"
                    />
                    
                </div>

                {/* Sidebar */}
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">TIN TỨC - KIẾN THỨC</h2>
                    <div className="flex flex-col gap-4">
                        {isLoading ? (
                            <div className="text-sm text-gray-500">Đang tải...</div>
                        ) : posts && posts.data && posts.data.length > 0 ? (
                            posts.data.map((post) => (
                                <div key={post.id} className="flex items-center gap-4">
                                    <img
                                        src={post.thumbnail_url || "/assets/news/news.png"}
                                        alt={post.title}
                                        className="w-16 h-16 object-cover rounded-md"
                                    />
                                    <p className="text-sm text-gray-700 font-semibold">{post.title}</p>
                                </div>
                            ))
                        ) : (
                            <div className="text-sm text-gray-500">Chưa có bài viết nào</div>
                        )}
                    </div>
                    {posts && posts.data && posts.data.length > 4 && (
                        <div className="text-center mt-4">
                        <button className="px-6 py-2 border border-blue-500 text-blue-500 rounded-full text-sm font-semibold hover:bg-blue-50">
                                Xem tất cả bài viết <span className="ml-2">▼</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContentWithSidebar;