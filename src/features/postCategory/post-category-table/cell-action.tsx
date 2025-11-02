'use client';
import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { pathName } from '@/config/dashboard';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/trpc/react';
import { Category } from '@/types/main';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

interface CellActionProps {
  data: Category;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const utils = api.useUtils();
  const { toast } = useToast();
  const deleteCategory = api.postCategory.delete.useMutation({
    onSuccess: async () => {
      await utils.postCategory.getAll.invalidate();
      toast({
        title: 'Success',
        description: 'Post category deleted successfully!',
      });
      setOpen(false);
    },
    onError: (error) => {
      console.error('Error deleting post category:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const onConfirm = async () => {
    deleteCategory.mutate({ id: data.id });
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={deleteCategory.isPending}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" side="left">
          <DropdownMenuItem
            onClick={() => router.push(`${pathName.postCategories}/${data.id}`)}
          >
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setOpen(true)}
            className="group text-red-500 hover:text-red-500 focus:text-red-500"
          >
            <Trash className="mr-2 h-4 w-4 text-current" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
