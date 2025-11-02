'use client';

import { ProductPageLayout } from "@/components/web-layout/product";
import React, { use } from "react";


export const dynamic = 'force-dynamic';

export default function ProductPage(props: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = use(props.params);
    return (
        <div className="px-5">
            <ProductPageLayout slugProduct={slug} />
        </div>
    );
}