'use client';
import React, { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { cn } from '@/lib/utils';

interface BaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children?: React.ReactNode;
    className?: string;
}

export const BaseModal: React.FC<BaseModalProps> = ({
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
        <Modal
            title={title}
            isOpen={isOpen}
            onClose={onClose}
        >
            <div className={cn("p-4", className)}>{children}</div>
        </Modal>
    );
};