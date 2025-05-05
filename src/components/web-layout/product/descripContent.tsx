/* eslint-disable @next/next/no-img-element */
import { BaseModal } from "@/components/modal/baseModal";
import React, { useState } from "react";

const technicalSpecs = [
    { label: "Loại sản phẩm", value: "Màn hình Asus" },
    { label: "Hãng sản xuất", value: "HP" },
    { label: "Model", value: "2Z610A" },
    { label: "Tên sản phẩm", value: "Máy in laser đen trắng HP 4003DW" },
    { label: "Loại máy in", value: "Máy in laser đen trắng" },
    { label: "Chức năng", value: "In" },
    { label: "Khổ giấy", value: "A4/A5" },
    { label: "Bộ nhớ", value: "256 MB" },
];

const DescriptionContent = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    return (
        <div className="py-8">
            <div className="max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="bg-white col-span-2 p-4 sm:px-6 lg:px-8 rounded-lg border  shadow-md">
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
                <div className="bg-white p-4 rounded-lg shadow-md border">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">THÔNG SỐ KỸ THUẬT</h2>
                    <table className="w-full text-sm text-left text-gray-700">
                        <tbody>
                            {technicalSpecs.map((spec, index) => (
                                <tr key={index} className={`border-b ${index % 2 === 0 ? "bg-gray-50" : ""}`}>
                                    <td className="py-2 px-4 font-medium text-gray-800">{spec.label}</td>
                                    <td className="py-2 px-4">{spec.value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="text-center mt-4">
                        <button
                            onClick={openModal}
                            className="px-6 py-2 border border-blue-500 text-blue-500 rounded-full text-sm font-semibold hover:bg-blue-50"
                        >
                            Xem đầy đủ thông số kỹ thuật ▼
                        </button>
                    </div>
                </div>
            </div>
            <BaseModal
                isOpen={isModalOpen}
                onClose={closeModal}
                title="Thông số kỹ thuật"
            >
                <div className="w-full rounded-xl overflow-auto">
                    <table className="w-full text-sm text-left text-gray-700">
                        <tbody>
                            {technicalSpecs.map((spec, index) => (
                                <tr key={index} className={`border-b ${index % 2 === 0 ? "bg-gray-50" : ""}`}>
                                    <td className="py-2 px-4 font-medium text-gray-800 w-24">{spec.label}</td>
                                    <td className="py-2 px-4 w-24">{spec.value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </BaseModal>
        </div>
    );
};

export default DescriptionContent;