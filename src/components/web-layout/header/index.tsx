'use client'

import { useIsMobile } from "@/hooks/use-mobile"
import { TopHeader } from "./topHeader"
import { SidebarDropdownMenu } from "./navigationMenuBar"
import { Menu, Folder, PcCase } from "lucide-react"
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"

const items = [
    { label: "Linh kiện máy tính", icon: <Folder className="w-4 h-4" /> },
    { label: "Màn hình", icon: <Folder className="w-4 h-4" /> },
    { label: "Laptop", icon: <Folder className="w-4 h-4" /> },
    { label: "Thiết bị lưu trữ", icon: <Folder className="w-4 h-4" /> },
    { label: "Phím - Chuột Gaming", icon: <Folder className="w-4 h-4" /> },
]

export const Header = () => {
    const isMobile = useIsMobile()
    const [isSticky, setIsSticky] = useState(false);

    const [search, setSearch] = useState('')

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    console.log('isMobile:', isMobile);

    if (isMobile) {
        return (
            <div className="bg-[rgba(24,112,184,1)] fixed top-0 z-50 w-full">
                <header className="text-white px-4 pt-3 pb-2">
                    {/* Top row: Menu + Search + Logo */}
                    <div className="flex items-center justify-between mb-2">
                        {/* Menu icon */}
                        <button className="text-white">
                            <Menu size={24} />
                        </button>

                        {/* Logo */}

                        <div className="flex items-center gap-2">
                            <Link href={'/'} className="flex items-center gap-4  shrink-0">
                                <Image src="/logo.svg" alt="Logo" width={32} height={32} className="w-8 h-8" />
                                <span className="text-2xl font-black text-white">DoloziStore</span>
                            </Link>
                        </div>
                    </div>

                    {/* Search box */}
                    <div className="mb-2">
                        <div className="flex items-center bg-white rounded-md px-3 py-2">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="flex-1 text-black placeholder-gray-400 outline-none"
                                placeholder="Bạn cần tìm gì?"
                            />
                            <svg
                                className="w-5 h-5 text-gray-600"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Category navigation */}
                    <nav className="flex justify-between text-sm font-medium">
                        <span>PC DOLOZI</span>
                        <span>Linh kiện máy tính</span>
                        <span>Màn hình</span>
                        <span>Laptop</span>
                    </nav>
                </header>
            </div>
        )
    }
    return (
        <>
            {/* Top Header */}
            <div
                className={`bg-[rgba(24,112,184,1)] ${isSticky ? 'fixed top-0 left-0 w-full z-50 shadow-md transition-opacity duration-300' : ''
                    }`}
            >
                <div className='px-[150px] text text-3xl py-2'>
                    <TopHeader />
                </div>
            </div>

            {/* Bottom header */}
            <div className="bg-[rgba(228,168,53,1)]">
                <div className='px-[150px]'>
                    <div className="flex gap-2 px-5 py-2">
                        <SidebarDropdownMenu
                            title="DANH MỤC SẢN PHẨM"
                            menuIcon={<Menu className="w-4 h-4" />}
                            menuItems={items}
                        />
                        <SidebarDropdownMenu
                            title="PC Dolozi"
                            menuIcon={<PcCase className="w-4 h-4 text-gray-900" />}
                            menuItems={items}
                            variant="ghost"
                        />
                        <SidebarDropdownMenu
                            title="Linh kiện máy tính"
                            menuIcon={<PcCase className="w-4 h-4 text-gray-900" />}
                            menuItems={items}
                            variant="ghost"
                        />
                        <SidebarDropdownMenu
                            title="Màn hình"
                            menuIcon={<PcCase className="w-4 h-4 text-gray-900" />}
                            menuItems={items}
                            variant="ghost"
                        />
                        <SidebarDropdownMenu
                            title="Laptop"
                            menuIcon={<PcCase className="w-4 h-4 text-gray-900" />}
                            menuItems={items}
                            variant="ghost"
                        />
                        <SidebarDropdownMenu
                            title="Thiết bị lưu trữ"
                            menuIcon={<PcCase className="w-4 h-4 text-gray-900" />}
                            menuItems={items}
                            variant="ghost"
                        />
                        <SidebarDropdownMenu
                            title="Phím - Chuột Gaming"
                            menuIcon={<PcCase className="w-4 h-4 text-gray-900" />}
                            menuItems={items}
                            variant="ghost"
                        />
                    </div>
                </div>
            </div>
        </>

    )
}