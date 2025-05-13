'use client';
import {
  Dialog,
  DialogContentNoIconClose,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import React from 'react';

interface ModalProps {
  title: string;
  description?: string;
  isOpen: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
}

export const ModalNotShowClose: React.FC<ModalProps> = ({
  title,
  description,
  isOpen,
  onClose,
  children,
}) => {
  const onChange = (open: boolean) => {
    if (!open) {
      onClose?.();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContentNoIconClose className='p-0 border-none'>
        <DialogTitle className='hidden'>{title}</DialogTitle>
        <DialogDescription className='hidden'>{description}</DialogDescription>
        <div className='max-w-[600px] max-h-[500px]'>{children}</div>
      </DialogContentNoIconClose>
    </Dialog>
  );
};
