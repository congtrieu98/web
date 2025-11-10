import { api } from "@/trpc/server";
import NewsListing from "@/components/web-layout/news/NewsListing";

export const dynamic = 'force-dynamic';

interface PageProps {
    searchParams: Promise<{ page?: string }>;
}

const Page = async ({ searchParams }: PageProps) => {
    const params = await searchParams;
    const currentPage = Number(params?.page) || 1;
    const limit = 3; // Số bài viết mỗi trang
    
    // Fetch data ở server side
    const postsData = await api.posts.getAllPostsPublic({
        page: currentPage,
        limit: limit,
    });
    
    const sidebarPostsData = await api.posts.getAllPostsPublic({
        page: 1,
        limit: 4,
    });

    const posts = (postsData?.data || []) as unknown as Parameters<typeof NewsListing>[0]['posts'];
    const sidebarPosts = (sidebarPostsData?.data || []) as unknown as Parameters<typeof NewsListing>[0]['sidebarPosts'];
    const totalPages = postsData?.metadata?.totalPages || 1;

    return (
        <div className="bg-gray-50">
            <NewsListing
            posts={posts}
            sidebarPosts={sidebarPosts}
            totalPages={totalPages}
            currentPage={currentPage}
        />
        </div>
    );
};

export default Page;