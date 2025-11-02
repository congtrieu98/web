'use client';

import { cn } from '@/utils/tailwind';
import React, { PropsWithChildren } from 'react';

export default function Container({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={cn('w-full h-full max-w-7xl mx-auto', className)}>{children}</div>
  );
}
