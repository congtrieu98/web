'use client';

import React, { use } from "react";
import { CategoryPageLayout } from "@/components/web-layout/category";
import Container from "@/components/web-layout/container";

export const dynamic = 'force-dynamic';

export default function CategoryPage(props: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = use(props.params);
    return (
        <Container className="bg-gray-50">
            <div className="px-5">
                <CategoryPageLayout slugCat={slug} />
            </div>
        </Container>
    );
}