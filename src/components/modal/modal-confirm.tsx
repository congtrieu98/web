'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import Image from 'next/image';
import { ModalNonIconClose } from './modalHome';

const ModalConfirm = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const checkModalStatus = async () => {
            const hasSeenModalInSession = sessionStorage.getItem('hasSeenModal');
            if (!hasSeenModalInSession) {
                setTimeout(() => {
                    setIsOpen(true);
                    setIsVisible(true);
                }, 800);
                sessionStorage.setItem('hasSeenModal', 'true');
            }
        };
        checkModalStatus();
    }, []);

    const handleClose = async () => {
        setIsOpen(false);
    };

    return (
        <ModalNonIconClose
            isOpen={isOpen}
            title=""
        >
            <div
                className={`flex flex-col transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'
                    }`}
            >
                <div className="flex items-center bg-[rgba(24,112,184,1)] gap-4 w-full rounded-t-lg justify-center p-2">
                    <Image src="/logo.svg" alt="Logo" width={56} height={56} className="w-14 h-14" />
                    <span className="text-2xl font-black text-white ">DoloziStore</span>
                </div>
                <div className="flex gap-4 justify-center p-10 w-full">
                    <Button className='bg-[#0F5B99] hover:bg-[#0F5B99] hover:opacity-90 w-full' onClick={handleClose}>Mua hàng</Button>
                    <Button className='bg-[#0F5B99] hover:bg-[#0F5B99] hover:opacity-90 w-full'>Dịch vụ</Button>
                </div>
            </div>
        </ModalNonIconClose>
    );
};

export default ModalConfirm;