'use client';

import CarouselNews from "@/components/ui/carouselCommon/carouselNews";
import { Headline } from "@/components/ui/headline";
import Link from "next/link";
import React from "react";
import { api } from "@/trpc/react";
import { Post } from "@/types/main";

const NewsList = () => {
    // Fetch all posts (with a reasonable limit, e.g., 20)
    const { data: postsData, isLoading } = api.posts.getAllPostsPublic.useQuery({
        limit: 20,
        page: 1,
    });

    const posts = postsData?.data || [];

    return (
        <div className="py-8">
            <div className="max-w-7xl">
                <div className="flex justify-between">
                    <Headline text="Tin Tức Công Nghệ" />
                    <div className="flex justify-between items-center mb-6 gap-2">
                        <Link href="/tin-tuc" className="text-blue-500 hover:text-orange-500 font-normal leading-5">
                            Xem Tất Cả &rarr;
                        </Link>
                    </div>
                </div>

                {isLoading ? (
                    <div className="text-center py-8">Đang tải...</div>
                ) : posts.length > 0 ? (
                    <CarouselNews posts={posts as unknown as Post[]} />
                ) : (
                    <div className="text-center py-8 text-gray-500">Chưa có tin tức nào</div>
                )}
            </div>
        </div>
    );
};

export default NewsList;