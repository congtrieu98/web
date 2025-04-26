'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { pathName } from '@/config/dashboard';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/trpc/react';
import { Category } from '@/types/main';
import { slugify } from '@/utils/helpers';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
  name: z.string().min(1, {
    message: 'Category name must be at least 1 characters.',
  }),
  slug: z.string().min(1, {
    message: 'Category slug must be at least 1 characters.',
  }),
  description: z.string().max(264, {
    message: 'Description must be at most 264 characters.',
  }),
});

export default function CategoryForm({
  initialData,
  pageTitle,
}: {
  initialData: Category | null;
  pageTitle: string;
}) {
  const defaultValues = {
    name: initialData?.name || '',
    description: initialData?.description || '',
    slug: initialData?.slug || '',
  };

  const router = useRouter();

  const utils = api.useUtils();

  const { toast } = useToast();

  const createCategory = api.category.create.useMutation({
    throwOnError: false,
    onSuccess: async () => {
      await utils.category.getAll.invalidate();
      toast({
        title: 'Success',
        description: 'Category created successfully!',
      });
      router.push(pathName.categories);
    },
    onError: (error) => {
      console.log('Error creating category:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateCategory = api.category.update.useMutation({
    throwOnError: false,
    onSuccess: async () => {
      await utils.category.getAll.invalidate();
      toast({
        title: 'Success',
        description: 'Category updated successfully!',
      });
      router.push(pathName.categories);
    },
    onError: (error) => {
      console.log('Error updating category:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: defaultValues,
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (initialData?.id) {
      updateCategory.mutate({
        id: initialData.id,
        name: values.name,
        description: values.description,
        slug: values.slug,
      });
    } else {
      createCategory.mutate({
        name: values.name,
        description: values.description,
        slug: values.slug,
      });
    }
  }

  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle className="text-left text-2xl font-bold">
          {pageTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name <span className='text-sm text-red-500'>*</span></FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter category name"
                        {...field}
                        onBlur={(e) => {
                          field.onBlur();
                          const currentSlug = form.getValues('slug');
                          if (!currentSlug) {
                            form.setValue('slug', slugify(e.target.value));
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Slug <span className='text-sm text-red-500'>*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Enter category slug" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter category description"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              loading={updateCategory.isPending || createCategory.isPending}
            >
              {initialData?.id ? 'Update Category' : 'Create Category'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
