import { api } from "@/trpc/server";
import NewsDetail from "@/components/web-layout/news/NewsDetail";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{ slug: string }>;
}

const Page = async ({ params }: PageProps) => {
    const { slug } = await params;
    
    // Fetch post by slug ở server side
    const post = await api.posts.getPostBySlug({
        slug: slug,
    });

    if (!post) {
        notFound();
    }

    return (
        <div className="bg-gray-50">
            <NewsDetail post={post as unknown as Parameters<typeof NewsDetail>[0]['post']} />
        </div>
    );
};

export default Page;

