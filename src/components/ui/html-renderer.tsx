import React from 'react';

// Component để render HTML content một cách an toàn
export const SafeHtmlRenderer = ({ 
    html, 
    className = '', 
    maxLength = 100,
    showPreview = false 
}: { 
    html: string; 
    className?: string;
    maxLength?: number;
    showPreview?: boolean;
}) => {
    if (!html) return null;

    // Function để strip HTML tags và lấy text thuần
    const stripHtmlTags = (htmlString: string) => {
        return htmlString.replace(/<[^>]*>/g, '');
    };

    // Function để tạo preview text từ HTML
    const getPreviewText = (htmlString: string, maxLen: number = 100) => {
        const plainText = stripHtmlTags(htmlString);
        return plainText.length > maxLen ? plainText.slice(0, maxLen) + '...' : plainText;
    };

    if (showPreview) {
        return (
            <div className={className}>
                {getPreviewText(html, maxLength)}
            </div>
        );
    }

    return (
        <div 
            className={className}
            dangerouslySetInnerHTML={{ __html: html }} 
        />
    );
};

// Component để hiển thị description với expand/collapse dựa trên chiều cao
export const DescriptionRenderer = ({ 
    description, 
    className = 'text-sm text-gray-700 mb-4',
    maxHeight = '120px' // Chiều cao tối đa trước khi hiện nút "Xem tất cả"
}: { 
    description: string; 
    className?: string;
    maxHeight?: string;
}) => {
    const [isExpanded, setIsExpanded] = React.useState(false);
    const [shouldShowToggle, setShouldShowToggle] = React.useState(false);
    const contentRef = React.useRef<HTMLDivElement>(null);
    const collapsedRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const checkContentHeight = () => {
            if (contentRef.current) {
                // Tạo một element tạm thời để đo chiều cao thực tế
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = description;
                tempDiv.style.position = 'absolute';
                tempDiv.style.visibility = 'hidden';
                tempDiv.style.width = contentRef.current.offsetWidth + 'px';
                tempDiv.style.fontSize = window.getComputedStyle(contentRef.current).fontSize;
                tempDiv.style.lineHeight = window.getComputedStyle(contentRef.current).lineHeight;
                tempDiv.style.fontFamily = window.getComputedStyle(contentRef.current).fontFamily;
                tempDiv.style.padding = window.getComputedStyle(contentRef.current).padding;
                tempDiv.style.margin = window.getComputedStyle(contentRef.current).margin;
                
                document.body.appendChild(tempDiv);
                const actualHeight = tempDiv.offsetHeight;
                document.body.removeChild(tempDiv);
                
                const maxHeightPx = parseInt(maxHeight.replace('px', ''));
                setShouldShowToggle(actualHeight > maxHeightPx);
            }
        };

        // Delay một chút để đảm bảo DOM đã render
        const timeoutId = setTimeout(checkContentHeight, 100);
        
        // Thêm ResizeObserver để theo dõi thay đổi kích thước
        let resizeObserver: ResizeObserver | null = null;
        if (contentRef.current && window.ResizeObserver) {
            resizeObserver = new ResizeObserver(checkContentHeight);
            resizeObserver.observe(contentRef.current);
        }
        
        return () => {
            clearTimeout(timeoutId);
            if (resizeObserver) {
                resizeObserver.disconnect();
            }
        };
    }, [description, maxHeight]);

    if (!description) return (
        <div className="flex justify-center items-center h-full w-full py-6">
            <p className="text-center">Không có nội dung</p>
        </div>
    );

    return (
        <div className={className}>
            {/* Container với chiều cao cố định khi collapsed */}
             <div 
                ref={collapsedRef}
                style={{
                    maxHeight: isExpanded ? 'none' : maxHeight,
                    overflow: isExpanded ? 'visible' : 'hidden',
                    transition: 'max-height 0.3s ease-in-out'
                }}
            >
                <div 
                    ref={contentRef}
                    dangerouslySetInnerHTML={{ __html: description }} 
                />
            </div>
            
            {/* Nút toggle chỉ hiện khi cần thiết */}
            {shouldShowToggle && (
                <div className="text-center pb-4">
                    <button 
                        onClick={() => setIsExpanded(!isExpanded)} 
                        className="px-6 py-2 border border-blue-500 text-blue-500 rounded-full text-sm font-semibold hover:bg-blue-50 transition-colors"
                    >
                        {isExpanded ? "Thu gọn" : "Xem tất cả"} 
                        <span className="ml-2">{isExpanded ? "▲" : "▼"}</span>
                    </button>
                </div>
            )}
        </div>
    );
};
