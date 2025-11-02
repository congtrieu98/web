'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Post } from '@/types/main';
import { formatDate } from '@/utils/helpers';

export const columns: ColumnDef<Post>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'slug',
    header: 'Slug',
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
    cell: ({ row }) => formatDate(row.original.created_at!),
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
