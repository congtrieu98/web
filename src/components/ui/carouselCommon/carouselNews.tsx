/* eslint-disable @next/next/no-img-element */
'use client'

import Link from "next/link";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Post } from "@/types/main";
import { extractImageUrlsFromHtml } from "@/lib/utils";
import Image from "next/image";

interface CarouselNewsProps {
    posts: Post[];
}

// Helper function to get image URL from post
const getPostImageUrl = (post: Post): string => {
    // First try thumbnail_url
    if (post.thumbnail_url) {
        // If it's a full URL, return as is
        if (post.thumbnail_url.startsWith('http')) {
            return post.thumbnail_url;
        }
        // If it contains storage path, it might already be a full URL from extractImageUrlsFromHtml
        if (post.thumbnail_url.includes('/storage/v1/object/public/')) {
            // Check if it already has the base URL
            if (post.thumbnail_url.startsWith('http')) {
                return post.thumbnail_url;
            }
            // Otherwise prepend Supabase URL
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
            return `${supabaseUrl}${post.thumbnail_url.startsWith('/') ? '' : '/'}${post.thumbnail_url}`;
        }
        // Otherwise, assume it's a storage path
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
        return `${supabaseUrl}/storage/v1/object/public/${post.thumbnail_url}`;
    }
    
    // If no thumbnail, try to extract from content
    if (post.content) {
        const imageUrls = extractImageUrlsFromHtml(post.content);
        if (imageUrls.length > 0) {
            const firstImage = imageUrls[0];
            // extractImageUrlsFromHtml returns full URLs if they contain '/storage/v1/object/public/'
            if (firstImage.startsWith('http')) {
                return firstImage;
            }
            // If not full URL, prepend Supabase URL
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
            return `${supabaseUrl}${firstImage.startsWith('/') ? '' : '/'}${firstImage}`;
        }
    }
    
    // Fallback to default image
    return "/assets/news/news.png";
};

// Helper function to extract excerpt from HTML content
const getPostExcerpt = (post: Post, maxLength: number = 150): string => {
    if (!post.content) return "";
    
    // Remove HTML tags
    const text = post.content.replace(/<[^>]*>/g, '');
    // Remove extra whitespace
    const cleanText = text.replace(/\s+/g, ' ').trim();
    
    if (cleanText.length <= maxLength) {
        return cleanText;
    }
    
    return cleanText.substring(0, maxLength) + '...';
};

const CarouselNews = ({ posts }: CarouselNewsProps) => {
    const responsive = {
        superLargeDesktop: {
            // the naming can be any, depends on you.
            breakpoint: { max: 8000, min: 3000 },
            items: 5,

        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 4,

        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2,

        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 2,

        }
    };
    if (!posts || posts.length === 0) {
        return <div className="text-center py-8 text-gray-500">Chưa có tin tức nào</div>;
    }

    return (
        <Carousel
            responsive={responsive}
            // autoPlay={true}
            rewind={true}
            rewindWithAnimation={true}
            className="flex gap-3"
        >
            {posts.map((post) => {
                const imageUrl = getPostImageUrl(post);
                const excerpt = getPostExcerpt(post);
                
                return (
                    <div className="flex flex-col border rounded-2xl hover:shadow-lg mr-4" key={post.id}>
                        <Link href={`/tin-tuc/${post.slug}`}>
                            <div className="relative w-full h-48 rounded-t-2xl overflow-hidden">
                                <Image
                                    src={imageUrl}
                                    alt={post.title}
                                    fill
                                    className="object-cover cursor-pointer"
                                />
                            </div>
                        </Link>

                        <div className="px-2">
                            <div className="text-center text-xl uppercase font-medium pt-2 mb-2 leading-7 seafood_truncate-2">
                                {post.title}
                            </div>
                            {excerpt && (
                                <div className="text-center seafood_truncate-3 text-gray-600">
                                    {excerpt}
                                </div>
                            )}
                            <Link href={`/tin-tuc/${post.slug}`} className="flex justify-center py-5">
                                <div className="text-center bg-blue-500 text-white py-1.5 px-4 rounded-full transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 duration-300 cursor-pointer">
                                    Chi tiết
                                </div>
                            </Link>
                        </div>
                    </div>
                );
            })}
        </Carousel>
    )
}

export default CarouselNews