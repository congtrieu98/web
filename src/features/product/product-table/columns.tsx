'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Product } from '@/types/main';
import { formatDate } from '@/utils/helpers';

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: 'productName',
    header: 'Name',
  },
  {
    accessorKey: 'slug',
    header: 'Slug',
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
    cell: ({ row }) => formatDate(row.original.created_at),
  },
  //  {
  //    accessorKey: 'created_by',
  //    header: 'Creator',
  //    cell: ({ row }) => formatDate(row.original.updated_at),
  //  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
