'use client'

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { JSX } from "react"

export interface MenuItem {
    label: string
    icon?: JSX.Element
    onClick?: () => void
}

interface SidebarDropdownMenuProps {
    title: string
    menuItems: MenuItem[]
    menuIcon?: JSX.Element
    variant?: "default" | "ghost";
}


export function SidebarDropdownMenu({
    title,
    menuItems,
    menuIcon,
    variant = "default",
}: SidebarDropdownMenuProps) {
    const triggerClass = cn(
        "px-4 py-2 rounded text-sm font-semibold flex items-center gap-2",
        variant === "default" && "bg-white hover:bg-white focus:bg-white active:bg-white",
        variant === "ghost" && "bg-transparent hover:bg-transparent! focus:bg-transparent! active:bg-transparent!"
    );
    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger className={triggerClass}>
                        {menuIcon}
                        {title}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="bg-white shadow-md">
                        <div className="flex flex-col space-y-1 w-56">
                            {menuItems.map((item, idx) => (
                                <NavigationMenuLink
                                    key={idx}
                                    onClick={item.onClick}
                                    className={cn(
                                        "flex items-center cursor-pointer hover:bg-[#0079FE]"
                                    )}
                                >
                                    <div className={cn(
                                        "flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:text-white"
                                    )}>
                                        {item.icon}
                                        {item.label}
                                    </div>
                                </NavigationMenuLink>
                            ))}
                        </div>
                    </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}
