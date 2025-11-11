// components/CarouselCommon.tsx

'use client'

import useEmblaCarousel from 'embla-carousel-react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { useIsMobile } from '@/hooks/use-mobile'

export type BannerItem = {
    type: 'single' | 'grid'
    images: {
        src: string
        alt?: string
        linkProduct?: string | null // Product slug for this specific image
    }[]
}

type CarouselCommonProps = {
    items: BannerItem[]
}

export default function CarouselCommon({ items }: CarouselCommonProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
    const isMobile = useIsMobile()

    const scrollPrev = () => emblaApi?.scrollPrev()
    const scrollNext = () => {
        if (emblaApi) {
            emblaApi.scrollNext()
        } else {
            console.error('Embla API is not initialized')
        }
    }

    return (
        <div className="relative w-full overflow-hidden">
            <div className="overflow-hidden rounded-lg" ref={emblaRef}>
                <div className="flex h-[172px]">
                    {items.map((item, index) => {
                        // Render single image with its own link
                        const renderImageWithLink = (img: { src: string; alt?: string; linkProduct?: string | null }, idx: number) => {
                            const link = img.linkProduct ? `/products/${img.linkProduct}` : null;
                            const imageElement = (
                                <Image
                                    key={idx}
                                    src={img.src}
                                    alt={img.alt || `Banner ${idx + 1}`}
                                    width={item.type === 'single' ? 1200 : 600}
                                    height={item.type === 'single' ? 400 : 300}
                                    className="w-full h-auto object-cover rounded-lg cursor-pointer"
                                />
                            );

                            if (link) {
                                return (
                                    <Link key={idx} href={link}>
                                        {imageElement}
                                    </Link>
                                );
                            }
                            return imageElement;
                        };

                        return (
                            <div
                                key={index}
                                className="flex-[0_0_100%] p-1" // slide full width
                            >
                                {isMobile ? (
                                    renderImageWithLink(item.images[0], 0)
                                ) : item.type === 'single' ? (
                                    renderImageWithLink(item.images[0], 0)
                                ) : (
                                    <div className="grid lg:grid-cols-2 gap-2">
                                        {item.images.map((img, idx) => renderImageWithLink(img, idx))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Prev/Next buttons */}
            <Button
                size="icon"
                variant="ghost"
                className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/60 hover:bg-white/80"
                onClick={scrollPrev}
            >
                <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
                size="icon"
                variant="ghost"
                className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/60 hover:bg-white/80"
                onClick={scrollNext}
            >
                <ChevronRight className="w-5 h-5" />
            </Button>
        </div>
    )
}
