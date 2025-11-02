'use client'

import { Textbody } from "@/components/ui/headline"
import Container from "../container"
import { MapPin, Phone, Star } from "lucide-react"

export const LocationsFooter = () => {
    return (
        <Container className='bg-[#FFFF] w-full grid grid-cols-1 md:grid-cols-4 gap-3'>
            <div className="flex flex-col rounded-lg shadow-md w-full">
                <div className="flex w-full">
                    <span className='rounded-tl-lg p-2.5 gap-2.5 bg-[rgba(228,168,53,1)] w-10 h-10 '>
                        <div className="flex justify-center text-sm font-semibold text-[rgba(255,255,255,1)]">1</div>
                    </span>
                    <span className='rounded-tr-lg p-2.5 gap-2.5 bg-[rgba(0,80,145,1)] flex-1 h-10'>
                        <div className="flex gap-2 items-center">
                            <Star className='text-white' size={24} />
                            <Textbody text='Cửa hàng quận 9' />
                        </div>
                    </span>
                </div>
                <div className="flex flex-col gap-2 p-4">
                    <div className="flex gap-1 items-center">
                        <MapPin className='text-[rgba(50,50,50,1)]' size={16} />
                        <Textbody text='36 Đường 22, Phước Long B, Quận 9' className='text-[rgba(50,50,50,1)]' />
                    </div>
                    <div className="flex gap-1 items-center">
                        <Phone className='text-[rgba(50,50,50,1)]' size={16} />
                        <Textbody text='Mua hàng: 0909 999 999 (8:30 - 21:30)' className='text-[rgba(50,50,50,1)]' />
                    </div>
                    <div className="flex gap-1 items-center">
                        <Phone className='text-[rgba(50,50,50,1)]' size={16} />
                        <Textbody text='Bảo hành: 0909 999 999 (8:30 - 21:30)' className='text-[rgba(50,50,50,1)]' />
                    </div>
                    <div className="flex gap-1 items-center">
                        <Phone className='text-[rgba(50,50,50,1)]' size={16} />
                        <Textbody text='Thứ 2 - Chủ nhật, 07:30 - 20:30' className='text-[rgba(50,50,50,1)]' />
                    </div>
                </div>
            </div>
            <div className="flex flex-col rounded-lg shadow-md w-full">
                <div className="flex w-full">
                    <span className='rounded-tl-lg p-2.5 gap-2.5 bg-[rgba(228,168,53,1)] w-10 h-10 '>
                        <div className="flex justify-center text-sm font-semibold text-[rgba(255,255,255,1)]">1</div>
                    </span>
                    <span className='rounded-tr-lg p-2.5 gap-2.5 bg-[rgba(0,80,145,1)] flex-1 h-10'>
                        <div className="flex gap-2 items-center">
                            <Star className='text-white' size={24} />
                            <Textbody text='Cửa hàng quận 9' />
                        </div>
                    </span>
                </div>
                <div className="flex flex-col gap-2 p-4">
                    <div className="flex gap-1 items-center">
                        <MapPin className='text-[rgba(50,50,50,1)]' size={16} />
                        <Textbody text='36 Đường 22, Phước Long B, Quận 9' className='text-[rgba(50,50,50,1)]' />
                    </div>
                    <div className="flex gap-1 items-center">
                        <Phone className='text-[rgba(50,50,50,1)]' size={16} />
                        <Textbody text='Mua hàng: 0909 999 999 (8:30 - 21:30)' className='text-[rgba(50,50,50,1)]' />
                    </div>
                    <div className="flex gap-1 items-center">
                        <Phone className='text-[rgba(50,50,50,1)]' size={16} />
                        <Textbody text='Bảo hành: 0909 999 999 (8:30 - 21:30)' className='text-[rgba(50,50,50,1)]' />
                    </div>
                    <div className="flex gap-1 items-center">
                        <Phone className='text-[rgba(50,50,50,1)]' size={16} />
                        <Textbody text='Thứ 2 - Chủ nhật, 07:30 - 20:30' className='text-[rgba(50,50,50,1)]' />
                    </div>
                </div>
            </div>
            <div className="flex flex-col rounded-lg shadow-md w-full">
                <div className="flex w-full">
                    <span className='rounded-tl-lg p-2.5 gap-2.5 bg-[rgba(228,168,53,1)] w-10 h-10 '>
                        <div className="flex justify-center text-sm font-semibold text-[rgba(255,255,255,1)]">1</div>
                    </span>
                    <span className='rounded-tr-lg p-2.5 gap-2.5 bg-[rgba(0,80,145,1)] flex-1 h-10'>
                        <div className="flex gap-2 items-center">
                            <Star className='text-white' size={24} />
                            <Textbody text='Cửa hàng quận 9' />
                        </div>
                    </span>
                </div>
                <div className="flex flex-col gap-2 p-4">
                    <div className="flex gap-1 items-center">
                        <MapPin className='text-[rgba(50,50,50,1)]' size={16} />
                        <Textbody text='36 Đường 22, Phước Long B, Quận 9' className='text-[rgba(50,50,50,1)]' />
                    </div>
                    <div className="flex gap-1 items-center">
                        <Phone className='text-[rgba(50,50,50,1)]' size={16} />
                        <Textbody text='Mua hàng: 0909 999 999 (8:30 - 21:30)' className='text-[rgba(50,50,50,1)]' />
                    </div>
                    <div className="flex gap-1 items-center">
                        <Phone className='text-[rgba(50,50,50,1)]' size={16} />
                        <Textbody text='Bảo hành: 0909 999 999 (8:30 - 21:30)' className='text-[rgba(50,50,50,1)]' />
                    </div>
                    <div className="flex gap-1 items-center">
                        <Phone className='text-[rgba(50,50,50,1)]' size={16} />
                        <Textbody text='Thứ 2 - Chủ nhật, 07:30 - 20:30' className='text-[rgba(50,50,50,1)]' />
                    </div>
                </div>
            </div>
            <div className="flex flex-col rounded-lg shadow-md w-full">
                <div className="flex w-full">
                    <span className='rounded-tl-lg p-2.5 gap-2.5 bg-[rgba(228,168,53,1)] w-10 h-10 '>
                        <div className="flex justify-center text-sm font-semibold text-[rgba(255,255,255,1)]">1</div>
                    </span>
                    <span className='rounded-tr-lg p-2.5 gap-2.5 bg-[rgba(0,80,145,1)] flex-1 h-10'>
                        <div className="flex gap-2 items-center">
                            <Star className='text-white' size={24} />
                            <Textbody text='Cửa hàng quận 9' />
                        </div>
                    </span>
                </div>
                <div className="flex flex-col gap-2 p-4">
                    <div className="flex gap-1 items-center">
                        <MapPin className='text-[rgba(50,50,50,1)]' size={16} />
                        <Textbody text='36 Đường 22, Phước Long B, Quận 9' className='text-[rgba(50,50,50,1)]' />
                    </div>
                    <div className="flex gap-1 items-center">
                        <Phone className='text-[rgba(50,50,50,1)]' size={16} />
                        <Textbody text='Mua hàng: 0909 999 999 (8:30 - 21:30)' className='text-[rgba(50,50,50,1)]' />
                    </div>
                    <div className="flex gap-1 items-center">
                        <Phone className='text-[rgba(50,50,50,1)]' size={16} />
                        <Textbody text='Bảo hành: 0909 999 999 (8:30 - 21:30)' className='text-[rgba(50,50,50,1)]' />
                    </div>
                    <div className="flex gap-1 items-center">
                        <Phone className='text-[rgba(50,50,50,1)]' size={16} />
                        <Textbody text='Thứ 2 - Chủ nhật, 07:30 - 20:30' className='text-[rgba(50,50,50,1)]' />
                    </div>
                </div>
            </div>
        </Container>
    )
}
