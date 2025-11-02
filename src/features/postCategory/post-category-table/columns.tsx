'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { PostCategory } from '@/types/main';

export const columns: ColumnDef<PostCategory>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'slug',
    header: 'Slug',
  },
  {
    accessorKey: 'description',
    header: 'Description',
    // cell: ({ row }) => {
    //   console.log('row post cat:', row);
    // }
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
