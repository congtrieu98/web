// components/CarouselCommon.tsx

'use client'

import useEmblaCarousel from 'embla-carousel-react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

export type BannerItem = {
    type: 'single' | 'grid'
    images: {
        src: string
        alt?: string
    }[]
}

type CarouselCommonProps = {
    items: BannerItem[]
}

export default function CarouselCommon({ items }: CarouselCommonProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })

    const scrollPrev = () => emblaApi?.scrollPrev()
    const scrollNext = () => {
        if (emblaApi) {
            console.log('vào next');

            emblaApi.scrollNext()
        } else {
            console.error('Embla API is not initialized')
        }
    }

    return (
        <div className="relative w-full overflow-hidden">
            <div className="overflow-hidden rounded-lg" ref={emblaRef}>
                <div className="flex">
                    {items.map((item, index) => (
                        <div
                            key={index}
                            className="flex-[0_0_100%] p-1" // slide full width
                        >
                            {item.type === 'single' ? (
                                <Image
                                    src={item.images[0].src}
                                    alt={item.images[0].alt || 'Banner'}
                                    width={1200}
                                    height={400}
                                    className="w-full h-auto object-cover rounded-lg"
                                />
                            ) : (
                                <div className="grid lg:grid-cols-2 gap-2">
                                    {item.images.map((img, idx) => (
                                        <Image
                                            key={idx}
                                            src={img.src}
                                            alt={img.alt || `Banner ${idx + 1}`}
                                            width={600}
                                            height={300}
                                            className="w-full h-auto object-cover rounded-lg"
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
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
