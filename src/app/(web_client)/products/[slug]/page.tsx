'use client';

import { ProductPageLayout } from "@/components/web-layout/product";
import React, { use } from "react";


export const dynamic = 'force-dynamic';

export default function ProductPage(props: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = use(props.params);
    return (
        <div className="w-full h-full lg:px-[150px] md:px-[80px] px-0">
            <ProductPageLayout slugCat={slug} />
        </div>
    );
}