'use client'

import Image from "next/image"
import Container from "../container"
import { MapPin, Newspaper, PcCase, Phone, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { ProductSearchBar } from "@/components/ui/product-search-bar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export const TopHeader = () => {
    const isMobile = useIsMobile()
    return (
        <Container>
            <header className=" text-white flex items-center justify-between px-4">
                {/* Logo + Tên */}
                <Link href={'/'} className="flex items-center gap-4 w-[250px] shrink-0">
                    <Image src="/logo.svg" alt="Logo" width={56} height={56} className="w-14 h-14" />
                    <span className="text-2xl font-black text-white">DoloziStore</span>
                </Link>

                {/* Tìm kiếm + Map */}
                <div className="flex items-center w-full max-w-[420px] mx-4 gap-2">
                    <Link href="https://maps.app.goo.gl/mF6zDPcfd4Buxs3U8" target="_blank">
                        <MapPin className="w-5 h-5 text-white" size={25} />
                        </Link>
                        <ProductSearchBar 
                            inputClassName="rounded px-2 py-3"
                        />
                </div>

                {/* Menu icons */}
                <div className={cn("flex items-center gap-1 text-xs shrink min-w-[200px] max-w-[500px] justify-end"
                )}>
                    <div className="flex flex-col items-center justify-center text-center w-[130px]">
                        
                        <Popover
                        >
                            <PopoverTrigger asChild>
                            <div className="flex flex-col items-center justify-center text-center w-[130px] cursor-pointer">
                            <PcCase className="w-6 h-6" size={25} />
                            <span className="text-xs font-normal text-[rgba(255,255,255,1)] leading-5 ">Xây dựng cấu hình</span>
                            </div>
                            </PopoverTrigger>
                            <PopoverContent className="w-72 rounded-md border border-zinc-200 bg-white p-4 text-zinc-950 shadow-md outline-none">
                                <div>Vui lòng liên hệ zalo</div>
                                <Link href="https://zalo.me/0766216289" className="text-blue-500"> 0766216289</Link>
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="flex flex-col items-center justify-center text-center w-[150px]">
                        <Popover>
                            <PopoverTrigger asChild>
                                <div className="flex flex-col items-center justify-center text-center w-[150px] cursor-pointer">
                                    <Phone className="w-6 h-6" size={25} />
                                    <span className="text-xs font-normal text-[rgba(255,255,255,1)] leading-5 ">Chăm sóc khách hàng</span>
                                </div>
                            </PopoverTrigger>
                            <PopoverContent className="w-72 rounded-md border border-zinc-200 bg-white p-4 text-zinc-950 shadow-md outline-none">
                                <div>Vui lòng liên hệ zalo</div>
                                <Link href="https://zalo.me/0766216289" className="text-blue-500"> 0766216289</Link>
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="flex flex-col items-center justify-center text-center w-[130px]">
                        <Newspaper className="w-6 h-6" size={25} />
                        <Link href="/tin-tuc" className="text-xs font-normal text-[rgba(255,255,255,1)] leading-5">Tin tức công nghệ</Link>
                    </div>
                    <div className="flex flex-col items-center justify-center text-center w-[100px]">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <div className="flex flex-col items-center justify-center text-center w-[100px] cursor-pointer">
                                        <ShoppingCart className="w-6 h-6" size={25} />
                                        <span className="text-xs font-normal text-[rgba(255,255,255,1)] leading-5">Giỏ hàng</span>
                                    </div>
                                </PopoverTrigger>
                                <PopoverContent className="w-72 rounded-md border border-zinc-200 bg-white p-4 text-zinc-950 shadow-md outline-none">
                                <div>Vui lòng liên hệ zalo</div>
                                <Link href="https://zalo.me/0766216289" className="text-blue-500"> 0766216289</Link>
                            </PopoverContent>
                            </Popover>
                           
                    </div>

                </div>
            </header>
        </Container>
    )
}