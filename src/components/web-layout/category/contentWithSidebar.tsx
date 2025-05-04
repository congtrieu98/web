/* eslint-disable @next/next/no-img-element */
import React from "react";

const articles = [
    {
        id: 1,
        image: "/assets/news/news.png", // Thay bằng URL ảnh thực tế
        title: "Top 100+ cấu hình PC Gaming giá tốt nhất năm 2024",
    },
    {
        id: 2,
        image: "/assets/news/news.png",
        title: "Top 100+ cấu hình PC Gaming giá tốt nhất năm 2024",
    },
    {
        id: 3,
        image: "/assets/news/news.png",
        title: "Top 100+ cấu hình PC Gaming giá tốt nhất năm 2024",
    },
    {
        id: 4,
        image: "/assets/news/news.png",
        title: "Top 100+ cấu hình PC Gaming giá tốt nhất năm 2024",
    },
];

const ContentWithSidebar = () => {
    return (
        <div className=" py-8">
            <div className="max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="bg-white col-span-2 p-4 sm:px-6 lg:px-8 rounded-lg shadow-md">
                    <p className="text-sm text-gray-700 mb-4">
                        Laptop gaming là dòng laptop được thiết kế để phục vụ cho việc chơi game. Sản phẩm được trang bị cấu hình mạnh mẽ, độ phân giải màn hình cao và hệ thống tản nhiệt hiệu quả, mang đến trải nghiệm tuyệt vời cho các game thủ.
                    </p>
                    <p className="text-sm text-gray-700 mb-4">
                        CPU được xem là tiêu chí đầu tiên cần cân nhắc khi chọn mua laptop chơi game. Tùy thuộc vào nhu cầu sử dụng, dung lượng của game và điều kiện kinh tế mà bạn có thể chọn mua một chiếc laptop gaming có CPU phù hợp.
                    </p>
                    <div className="bg-gray-300 w-full h-64 rounded-md mb-4"></div>
                    <p className="text-sm text-gray-700 mb-4">
                        CPU được xem là tiêu chí đầu tiên cần cân nhắc khi chọn mua laptop chơi game. Tùy thuộc vào nhu cầu sử dụng, dung lượng của game và điều kiện kinh tế mà bạn có thể chọn mua một chiếc laptop gaming có CPU phù hợp.
                    </p>
                    <div className="text-center pb-4">
                        <button className="px-6 py-2 border border-blue-500 text-blue-500 rounded-full text-sm font-semibold hover:bg-blue-50">
                            Xem tất cả <span className="ml-2">▼</span>
                        </button>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">TIN TỨC - KIẾN THỨC</h2>
                    <div className="flex flex-col gap-4">
                        {articles.map((article) => (
                            <div key={article.id} className="flex items-center gap-4">
                                <img
                                    src={article.image}
                                    alt={article.title}
                                    className="w-16 h-16 object-cover rounded-md"
                                />
                                <p className="text-sm text-gray-700 font-semibold">{article.title}</p>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-4">
                        <button className="px-6 py-2 border border-blue-500 text-blue-500 rounded-full text-sm font-semibold hover:bg-blue-50">
                            Xem tất cả bài viết <span className="ml-2">▼</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContentWithSidebar;