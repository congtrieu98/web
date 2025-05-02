import { CldUploadWidget } from "next-cloudinary";
import { Plus, Trash } from "lucide-react";


import Image from "next/image";
import { Button } from "../button";
import React, { useEffect, useState } from "react";

interface ImageUploadProps {
    value: string[];
    onChange: (value: string | string[]) => void;
    onRemove: (value: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    onChange,
    onRemove,
    value,
}) => {

    const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

    const handleSuccess = (result: any) => {
        const url = result?.info?.secure_url;
        if (url) {
            setUploadedUrls((prev) => [...prev, url]);
        }
    };

    // Mỗi khi uploadedUrls thay đổi, cập nhật form qua props.onChange
    useEffect(() => {
        if (uploadedUrls.length > 0) {
            // Gộp lại giữa ảnh đã có và ảnh vừa upload, tránh trùng
            const merged = Array.from(new Set([...value, ...uploadedUrls]));
            onChange(merged);
        }
    }, [uploadedUrls]);

    return (
        <div>
            <div className="mb-4 flex flex-wrap items-center gap-4">
                {value.map((url, index) => (
                    <div key={index} className="relative w-[200px] h-[200px]">
                        <div className="absolute top-0 right-0 z-10">
                            <Button type="button" onClick={() => onRemove(url)} size="sm" className="hover:bg-red-400 bg-black text-white">
                                <Trash className="h-4 w-4" />
                            </Button>
                        </div>
                        <Image
                            src={url}
                            alt="collection"
                            className="object-cover rounded-lg"
                            fill
                        />
                    </div>
                ))}
            </div>

            <CldUploadWidget
                onSuccess={handleSuccess}
                options={{
                    multiple: true,
                    maxFiles: 5, // số tối đa muốn chọn
                }}
                signatureEndpoint="/api/sign-cloudinary-params">
                {({ open }) => {
                    return (
                        <Button type="button" variant='ghost' onClick={() => open()} className="bg-slate-200 text-primary">
                            <Plus className="h-5 w-5 mr-2" size={20} />
                            Chọn ảnh
                        </Button>
                    );
                }}
            </CldUploadWidget>
        </div>
    );
};

export default ImageUpload;