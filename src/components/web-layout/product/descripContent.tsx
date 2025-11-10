import { BaseModal } from "@/components/modal/baseModal";
import { DescriptionRenderer } from "@/components/ui/html-renderer";
import React, { useState } from "react";

// Type definition cho specs
export type Spec = {
    name: string;
    unit: string;
    option: string;
};

const DescriptionContent = ({ 
    description, 
    specs 
}: { 
    description: string;
    specs?: Spec[] | null;
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // Function để format specs thành array cho hiển thị
    const formatSpecs = (specsData: Spec[] | null | undefined) => {
        if (!specsData || !Array.isArray(specsData)) {
            return [];
        }
        
        return specsData.map(spec => ({
            label: spec.name,
            unit: spec.unit,
            option: spec.option,
        }));
    };

    const technicalSpecs = formatSpecs(specs);
    return (
        <div className="py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* Main Content */}
                <div className="bg-white col-span-2 p-4 sm:px-6 lg:px-8 rounded-lg border shadow-md">
                    <DescriptionRenderer 
                        description={description || ''} 
                        maxHeight="120px"
                    />
                </div>

                {/* Sidebar */}
                <div className="bg-white p-4 rounded-lg shadow-md border self-start">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">THÔNG SỐ KỸ THUẬT</h2>
                    
                    {technicalSpecs.length > 0 ? (
                        <>
                            <table className="w-full text-sm text-left text-gray-700">
                                <tbody>
                                    {technicalSpecs.slice(0, 4).map((spec, index) => (
                                        <tr key={index} className={`border-b ${index % 2 === 0 ? "bg-gray-50" : ""}`}>
                                            <td className="py-2 px-4 font-medium text-gray-800">{spec.label}</td>
                                                <td className="py-2 px-4">{spec.unit}</td>
                                            {spec.option && (
                                                <td className="py-2 px-4">{spec.option}</td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            
                            {technicalSpecs.length > 4 && (
                                <div className="text-center mt-4">
                                    <button
                                        onClick={openModal}
                                        className="px-6 py-2 border border-blue-500 text-blue-500 rounded-full text-sm font-semibold hover:bg-blue-50"
                                    >
                                        Xem đầy đủ thông số kỹ thuật ▼
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <p>Chưa có thông số kỹ thuật</p>
                        </div>
                    )}
                </div>
            </div>
            <BaseModal
                isOpen={isModalOpen}
                onClose={closeModal}
                title="Thông số kỹ thuật"
            >
                <div className="w-full rounded-xl overflow-auto max-h-96">
                    {technicalSpecs.length > 0 ? (
                        <table className="w-full text-sm text-left text-gray-700">
                            <tbody>
                                {technicalSpecs.map((spec, index) => (
                                    <tr key={index} className={`border-b ${index % 2 === 0 ? "bg-gray-50" : ""}`}>
                                        <td className="py-2 px-4 font-medium text-gray-800">{spec.label}</td>
                                        <td className="py-2 px-4">{spec.unit}</td>
                                        <td className="py-2 px-4">{spec.option}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <p>Chưa có thông số kỹ thuật</p>
                        </div>
                    )}
                </div>
            </BaseModal>
        </div>
    );
};

export default DescriptionContent;