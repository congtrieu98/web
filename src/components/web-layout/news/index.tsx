'use client';

import CarouselNews from "@/components/ui/carouselCommon/carouselNews";
import { Headline } from "@/components/ui/headline";
import Link from "next/link";
import React from "react";

const NewsList = () => {
    return (
        <div className="py-8">
            <div className="max-w-7xl">
                <div className="flex justify-between">
                    <Headline text="Tin Tức Công Nghệ" />
                    <div className="flex justify-between items-center mb-6 gap-2">
                        <Link href="#" className="text-blue-500 hover:text-orange-500 font-normal leading-5">
                            Xem Tất Cả &rarr;
                        </Link>
                    </div>
                </div>

                <CarouselNews />
            </div>
        </div>
    );
};

export default NewsList;