'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Category } from '@/types/main';

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'slug',
    header: 'Slug',
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
