'use client';

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText } from "lucide-react";

interface MenuItem {
    id: string;
    label: string;
    slug?: string | null;
    href?: string;
    icon?: React.ReactNode;
}

interface MobileSidebarProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    menuItems: MenuItem[];
}

const MobileSidebar = ({ open, onOpenChange, menuItems }: MobileSidebarProps) => {
    const pathname = usePathname();

    // Thêm menu item "Tin tức - Kiến thức" vào cuối danh sách
    const allMenuItems: MenuItem[] = [
        ...menuItems,
        {
            id: 'news',
            label: 'Tin tức - Kiến thức',
            href: '/tin-tuc',
            icon: <FileText className="w-5 h-5" />
        }
    ];

    const isActive = (item: MenuItem) => {
        if (item.href) {
            return pathname === item.href || pathname.startsWith(item.href + '/');
        }
        if (item.slug) {
            return pathname === `/category/${item.slug}` || pathname.startsWith(`/category/${item.slug}/`);
        }
        return false;
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent 
                side="left" 
                className="w-[80%] max-w-sm p-0 bg-white rounded-r-xl [&>button]:hidden"
            >
                {/* Header với background xanh */}
                <div className="bg-[rgba(24,112,184,1)] px-4 py-4 flex items-center justify-between">
                    {/* Close icon */}
                    <button
                        onClick={() => onOpenChange(false)}
                        className="text-white hover:opacity-80 transition-opacity"
                    >
                        <X size={24} />
                    </button>
                    
                    {/* Logo */}
                    <Link 
                        href="/" 
                        className="flex items-center gap-2"
                        onClick={() => onOpenChange(false)}
                    >
                        <Image 
                            src="/logo.svg" 
                            alt="Logo" 
                            width={32} 
                            height={32} 
                            className="w-8 h-8" 
                        />
                        <span className="text-xl font-black text-white">DoloziStore</span>
                    </Link>
                </div>

                {/* Menu Items */}
                <div className="overflow-y-auto h-[calc(100vh-80px)]">
                    {allMenuItems.map((item, index) => {
                        const active = isActive(item);
                        const href = item.href || (item.slug ? `/category/${item.slug}` : '#');
                        
                        return (
                            <Link
                                key={item.id}
                                href={href}
                                onClick={() => onOpenChange(false)}
                                className={`
                                    flex items-center gap-3 px-4 py-4 border-b border-gray-100
                                    transition-colors
                                    ${active 
                                        ? 'bg-[rgba(24,112,184,1)] text-white' 
                                        : 'bg-white text-gray-800 hover:bg-gray-50'
                                    }
                                `}
                            >
                                {/* Icon */}
                                <div className={active ? 'text-white' : 'text-gray-600'}>
                                    {item.icon || <FileText className="w-5 h-5" />}
                                </div>
                                
                                {/* Label */}
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default MobileSidebar;

