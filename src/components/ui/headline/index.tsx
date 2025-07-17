import { cn } from "@/lib/utils"

export const Headline = ({ text, className }: { text: string, className?: string }) => {
    return (
        <div className="flex">
            <span className={cn("md:text-2xl text-lg leading-7 font-semibold text-black dark:text-white uppercase", className)}>
                {text}
            </span>
        </div>
    );
}


export const Textbody = ({ text, className }: { text: string, className?: string }) => {
    return (
        <div className="flex">
            <span className={cn("text-sm font-semibold text-[rgba(255,255,255,1)] dark:text-white uppercase", className)}>
                {text}
            </span>
        </div>
    );
}