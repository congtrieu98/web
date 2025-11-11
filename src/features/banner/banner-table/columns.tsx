'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Banner } from '@/types/main';
import Image from 'next/image';

export const columns: ColumnDef<Banner>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.getValue('type') as string;
      return (
        <span className="capitalize">
          {type === 'single' ? 'Single' : 'Grid'}
        </span>
      );
    },
  },
  {
    accessorKey: 'images',
    header: 'Preview',
    cell: ({ row }) => {
      const images = row.getValue('images') as { src: string; alt?: string }[];
      if (!images || images.length === 0) return <span>No image</span>;
      
      return (
        <div className="flex gap-2">
          {images.slice(0, 2).map((img, idx) => (
            <div key={idx} className="relative w-16 h-16 rounded overflow-hidden border">
              <Image
                src={img.src}
                alt={img.alt || `Banner ${idx + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: 'order_index',
    header: 'Order',
  },
  {
    accessorKey: 'is_active',
    header: 'Status',
    cell: ({ row }) => {
      const isActive = row.getValue('is_active') as boolean;
      return (
        <span
          className={`px-2 py-1 rounded text-xs ${
            isActive
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {isActive ? 'Active' : 'Inactive'}
        </span>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

