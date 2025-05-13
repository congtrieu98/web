'use client';
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { ModalNotShowClose } from '../ui/modalNotShowClose';

interface ModalNonIconCloseProps {
    isOpen: boolean;
    onClose?: () => void;
    title: string;
    children?: React.ReactNode;
    className?: string;
}

export const ModalNonIconClose: React.FC<ModalNonIconCloseProps> = ({
    isOpen,
    onClose,
    title,
    children,
    className
}) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <ModalNotShowClose
            title={title}
            isOpen={isOpen}
            onClose={onClose}
        >
            <div className={cn("", className)}>{children}</div>
        </ModalNotShowClose>
    );
};