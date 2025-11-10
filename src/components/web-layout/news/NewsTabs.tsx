'use client';

import { cn } from "@/lib/utils";

export type TabType = 'REVIEW' | 'TUYỂN DỤNG' | 'TIN TỨC KHUYẾN MÃI';

interface NewsTabsProps {
    activeTab?: TabType | null;
    onTabChange?: (tab: TabType) => void;
}

const NewsTabs = ({ activeTab = null, onTabChange }: NewsTabsProps) => {
    const tabs: TabType[] = ['REVIEW', 'TUYỂN DỤNG', 'TIN TỨC KHUYẾN MÃI'];

    return (
        <div className="px-4 sm:px-6 lg:px-8 p-5">
            <div className="flex gap-2 justify-between bg-white px-5 py-8 rounded-xl">
                {tabs.map((tab) => (
                    <div
                        key={tab}
                        onClick={() => onTabChange?.(tab)}
                        className={cn(
                            "p-6 w-full text-center font-semibold text-sm bg-white border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50 transition-colors",
                            activeTab === tab ? "bg-blue-600 text-white hover:bg-blue-600" : ""
                        )}
                    >
                        {tab}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NewsTabs;

