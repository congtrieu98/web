'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CustomCKEditor from '@/components/ui/CKEditor/customCKEditor';
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
import { base64ToFile, replaceBase64WithUrls, extractImageUrlsFromHtml } from '@/lib/utils';
import { api } from '@/trpc/react';
import { Category } from '@/types/main';
import { slugify } from '@/utils/helpers';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';

const formSchema = z.object({
  name: z.string().min(1, {
    message: 'Category name must be at least 1 characters.',
  }),
  slug: z.string().min(1, {
    message: 'Category slug must be at least 1 characters.',
  }),
  description: z.string().optional().nullable(),
});

export default function CategoryForm({
  initialData,
  pageTitle,
}: {
  initialData: Category | null;
  pageTitle: string;
}) {
  const supabase = createClient();
  const [pendingCleanup, setPendingCleanup] = useState<{
    oldContentImages?: string[];
  }>({});

  // Function để xóa ảnh cũ từ Supabase Storage
  const deleteOldImages = useCallback(async (oldUrls: string[]) => {
    if (oldUrls.length === 0) {
      return;
    }
    
    
    try {
      await Promise.all(
        oldUrls.map(async (url) => {
          
          // Extract path từ URL Supabase
          if (url.includes('/storage/v1/object/public/')) {
            const urlParts = url.split('/storage/v1/object/public/');
            if (urlParts.length > 1) {
              const filePath = urlParts[1];
              
              const { error } = await supabase.storage
                .from("category")
                .remove([filePath]);
              
              if (error) {
                console.error('Error deleting old image:', error);
              } else {
              }
            } else {
              console.error('Could not extract file path from URL:', url);
            }
          } else {
          }
        })
      );
    } catch (error) {
        console.error('Error in deleteOldImages:', error);
    }
  }, [supabase]);

  // Xử lý cleanup ảnh cũ khi có pendingCleanup
  useEffect(() => {
    const performCleanup = async () => {
      if (pendingCleanup.oldContentImages?.length) {
        
        if (pendingCleanup.oldContentImages.length > 0) {
          await deleteOldImages(pendingCleanup.oldContentImages);
        }
        
        // Clear pending cleanup
        setPendingCleanup({});
      }
    };
    
    performCleanup();
  }, [pendingCleanup, deleteOldImages]);

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
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(values.description ?? '', 'text/html');
      let imgs = doc.querySelectorAll('img');

      // Lưu ảnh cũ trong description để xóa sau
      let oldContentImages: string[] = [];
      if (initialData?.description) {
        oldContentImages = extractImageUrlsFromHtml(initialData.description);
      }

      const uploadPromises = Array.from(imgs).map(async (img, index) => {
        const src = img.getAttribute('src');
        if (src?.startsWith('data:image')) {
          const ext = src.split(';')[0].split('/')[1];
          const filename = `image_${Date.now()}_${index + 1}.${ext}`;
          const file = base64ToFile(src, filename);

          let path = `${Date.now()}_${file.name}`;
          const { data: url, error } = await supabase.storage
            .from("category")
            .upload(path, file);
          
          if (error) {
            console.error('Error uploading content image:', error);
            return null;
          }
          
          return url?.fullPath || null;
        }
        return null;
      });

      const urlListFromSupabase = (await Promise.all(uploadPromises)).filter(Boolean) as string[];

      // Gán url nhận được từ Supabase vào src của image
      const descriptionFinal = replaceBase64WithUrls(values.description ?? '', urlListFromSupabase);

      if (initialData?.id) {
        // Chuẩn bị cleanup data
        const cleanupData: {
          oldContentImages?: string[];
        } = {};
        
        // Xóa ảnh description cũ nếu có
        if (oldContentImages.length > 0) {
          // Lấy ảnh mới trong description để so sánh
          const newContentImages = extractImageUrlsFromHtml(descriptionFinal);
          const imagesToDelete = oldContentImages.filter(oldImg => !newContentImages.includes(oldImg));
          
          if (imagesToDelete.length > 0) {
            cleanupData.oldContentImages = imagesToDelete;
          }
        }
        
        // Update category trước
        updateCategory.mutate({
          id: initialData.id,
          name: values.name,
          description: descriptionFinal || null,
          slug: values.slug,
        });

        // Set pending cleanup để useEffect xử lý
        if (cleanupData.oldContentImages?.length) {
          setPendingCleanup(cleanupData);
        }
      } else {
        createCategory.mutate({
          name: values.name,
          description: descriptionFinal || null,
          slug: values.slug,
        });
      }
    } catch (error) {
      console.error('An error occurred:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
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
                    <CustomCKEditor
                      onChange={(data) =>
                        field.onChange(data)
                      }
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={updateCategory.isPending || createCategory.isPending}
            >
              {initialData?.id ? 'Update Category' : 'Create Category'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
