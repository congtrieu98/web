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
import { pathName } from '@/config/dashboard';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/trpc/react';
import { Brand } from '@/types/main';
import { slugify } from '@/utils/helpers';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
  name: z.string().min(1, {
    message: 'Brand name must be at least 1 characters.',
  }),
  slug: z.string().min(1, {
    message: 'Brand slug must be at least 1 characters.',
  }),
});

export default function BrandForm({
  initialData,
  pageTitle,
}: {
  initialData: Brand | null;
  pageTitle: string;
}) {
  const defaultValues = {
    name: initialData?.name || '',
    slug: initialData?.slug || '',
  };

  const router = useRouter();

  const utils = api.useUtils();

  const { toast } = useToast();

  const createBrand = api.brands.create.useMutation({
    throwOnError: false,
    onSuccess: async () => {
      await utils.brands.getAll.invalidate();
      toast({
        title: 'Success',
        description: 'Brand created successfully!',
      });
      router.push(pathName.brands);
    },
    onError: (error) => {
      console.log('Error creating brand:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateBrand = api.brands.update.useMutation({
    throwOnError: false,
    onSuccess: async () => {
      await utils.brands.getAll.invalidate();
      toast({
        title: 'Success',
        description: 'Brand updated successfully!',
      });
      router.push(pathName.brands);
    },
    onError: (error) => {
      console.log('Error updating brand:', error);
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (initialData?.id) {
      updateBrand.mutate({
        id: initialData.id,
        name: values.name,
        slug: values.slug,
      });
    } else {
      createBrand.mutate({
        name: values.name,
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
                    <FormLabel>Brand Name <span className='text-sm text-red-500'>*</span></FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter brand name"
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
                    <FormLabel>Brand Slug <span className='text-sm text-red-500'>*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Enter brand slug" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="submit"
              disabled={updateBrand.isPending || createBrand.isPending}
            >
              {initialData?.id ? 'Update Brand' : 'Create Brand'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

