'use client'

import { useIsMobile } from "@/hooks/use-mobile"
import { TopHeader } from "./topHeader"
import { SidebarDropdownMenu } from "./navigationMenuBar"
import { Menu, Folder, PcCase } from "lucide-react"
import { useEffect, useState } from "react"

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

    if (isMobile) {
        return (
            <div className="bg-[rgba(24,112,184,1)] fixed top-0 z-50">
                <div className='px-[150px] text text-3xl'>Mobile header</div>
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