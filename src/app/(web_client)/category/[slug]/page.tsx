'use client';

import React, { use } from "react";
import { CategoryPageLayout } from "@/components/web-layout/category";

export const dynamic = 'force-dynamic';

export default function CategoryPage(props: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = use(props.params);
    return (
        <div className="w-full h-full lg:px-[150px] md:px-[80px] px-0">
            <CategoryPageLayout slugCat={slug} />
        </div>
    );
}