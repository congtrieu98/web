'use client'

import Image from "next/image"
import Container from "../container"
import { MapPin, Newspaper, PcCase, Phone, Search, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

export const TopHeader = () => {
    const isMobile = useIsMobile()
    console.log('isMobile:', isMobile);

    // if (isMobile) {
    //     return (
    //         <Container>
    //             <div className="flex py-2 px-3">
    //                 <div className="flex flex-col justify-between">
    //                     <span>
    //                         <MenuIcon />
    //                     </span>
    //                     <div className="flex gap-2">
    //                         <Link href={'/'} className="flex items-center gap-4 w-[250px] shrink-0">
    //                             <Image src="/logo.svg" alt="Logo" width={56} height={56} className="w-14 h-14" />
    //                             <span className="text-2xl font-black text-white">DoloziStore</span>
    //                         </Link>
    //                     </div>
    //                 </div>
    //             </div>
    //         </Container>
    //     )
    // }

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
                    <MapPin className="w-5 h-5 text-white" size={25} />
                    <div className="flex items-center flex-grow bg-white rounded px-2 py-3">
                        <input
                            type="text"
                            placeholder="Bạn cần tìm gì?"
                            className="w-full outline-none text-black text-sm placeholder-gray-500"
                        />
                        <button>
                            <Search className="w-5 h-5 text-gray-700" />
                        </button>
                    </div>
                </div>

                {/* Menu icons */}
                <div className={cn("flex items-center gap-1 text-xs shrink min-w-[200px] max-w-[500px] justify-end"
                )}>
                    <div className="flex flex-col items-center justify-center text-center w-[130px]">
                        <PcCase className="w-6 h-6" size={25} />
                        <span className="text-xs font-normal text-[rgba(255,255,255,1)] leading-5">Xây dựng cấu hình</span>
                    </div>
                    <div className="flex flex-col items-center justify-center text-center w-[150px]">
                        <Phone className="w-6 h-6" size={25} />
                        <span className="text-xs font-normal text-[rgba(255,255,255,1)] leading-5">Chăm sóc khách hàng</span>
                    </div>
                    <div className="flex flex-col items-center justify-center text-center w-[130px]">
                        <Newspaper className="w-6 h-6" size={25} />
                        <Link href="/tin-tuc" className="text-xs font-normal text-[rgba(255,255,255,1)] leading-5">Tin tức công nghệ</Link>
                    </div>
                    <div className="flex flex-col items-center justify-center text-center w-[100px]">
                        <ShoppingCart className="w-6 h-6" size={25} />
                        <span className="text-xs font-normal text-[rgba(255,255,255,1)] leading-5">Giỏ hàng</span>
                    </div>

                </div>
            </header>
        </Container>
    )
}