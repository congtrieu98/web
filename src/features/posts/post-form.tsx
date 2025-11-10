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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { pathName } from '@/config/dashboard';
import { useToast } from '@/hooks/use-toast';
import { base64ToFile, replaceBase64WithUrls, extractImageUrlsFromHtml } from '@/lib/utils';
import { api } from '@/trpc/react';
import { Post } from '@/types/main';
import { slugify } from '@/utils/helpers';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/client';

const formSchema = z.object({
  title: z.string().min(1, {
    message: 'Tên bài viết không được để trống.',
  }),
  slug: z.string().min(1, {
    message: 'Slug không được để trống.',
  }),
  categoryId: z.string().min(1, {
    message: 'Danh mục không được để trống.',
  }),
  thumbnailUrl: z.string(),
  content: z.string().optional(), // Added description property
});

export default function PostForm({
  initialData,
  pageTitle,
}: {
  initialData: Post | null;
  pageTitle: string;
}) {
  const supabase = createClient();
  const [files, setFiles] = useState<any[]>([]);
  const [filesPreview, setFilesPreview] = useState<any[]>([]);
  const [pendingCleanup, setPendingCleanup] = useState<{
    oldThumbnailUrl?: string;
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
                .from("posts")
                .remove([filePath]);
              
              if (error) {
                console.error('Error deleting old image:', error);
              }
            }
          }
        })
      );
    } catch (error) {}
  }, [supabase]);

  // Khởi tạo filesPreview từ initialData khi component mount
  useEffect(() => {
    if (initialData?.thumbnail_url) {
      setFilesPreview([initialData.thumbnail_url]);
    }
  }, [initialData]);

  // Xử lý cleanup ảnh cũ khi có pendingCleanup
  useEffect(() => {
    const performCleanup = async () => {
      if (pendingCleanup.oldThumbnailUrl || pendingCleanup.oldContentImages?.length) {
        
        const urlsToDelete: string[] = [];
        
        if (pendingCleanup.oldThumbnailUrl) {
          urlsToDelete.push(pendingCleanup.oldThumbnailUrl);
        }
        
        if (pendingCleanup.oldContentImages?.length) {
          urlsToDelete.push(...pendingCleanup.oldContentImages);
        }
        
        if (urlsToDelete.length > 0) {
          await deleteOldImages(urlsToDelete);
        }
        
        // Clear pending cleanup
        setPendingCleanup({});
      }
    };
    
    performCleanup();
  }, [pendingCleanup, deleteOldImages]);


  const defaultValues = {
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    content: initialData?.content || '',
    thumbnailUrl: initialData?.thumbnail_url || '',
    categoryId: initialData?.category_id || '',
  };


  const router = useRouter();

  const utils = api.useUtils();

  const { toast } = useToast();

  const { data: listCategory } = api.postCategory.getAll.useQuery({});

  const createPost = api.posts.create.useMutation({
    throwOnError: false,
    onSuccess: async () => {
      await utils.posts.getAll.invalidate();
      toast({
        title: 'Success',
        description: 'Posts created successfully!',
      });
      router.push(pathName.posts);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updatePost = api.posts.update.useMutation({
    throwOnError: false,
    onSuccess: async () => {
      await utils.posts.getAll.invalidate();
      toast({
        title: 'Success',
        description: 'Posts updated successfully!',
      });
      router.push(pathName.posts);
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

  const handlePreviewImages = (fileList: File[]) => {
    const filesArray = fileList.map(
      (file: File) => URL.createObjectURL(file), // Transfer every file image into a url.
    );
    // Thay thế ảnh cũ bằng ảnh mới (chỉ cho phép 1 thumbnail)
    setFilesPreview(filesArray);
    fileList.map((file: any) => URL.revokeObjectURL(file)); // Frees memory after the URL has been generated (to avoid memory leaks)
  };

  const triggerFileInput = () => {
    document.getElementById("fileInput")?.click();
  };

  const handleFileSelect = (e: any) => {
    let selectedFiles: File[] = Array.from(e.target.files);
    if (selectedFiles) {
      handleValidateImageFiles(selectedFiles);
    }
    // Reset file input để có thể chọn lại cùng file
    e.target.value = '';
  };

  const handleDeleteImage = (data: { image: string; key: number }) => {
    // Xóa ảnh khỏi preview
    setFilesPreview(
      filesPreview.filter((e) => {
        if (e?.image) {
          return e?.image !== data?.image;
        } else {
          return e !== data?.image;
        }
      }),
    );
    
    // Xóa file khỏi files array (nếu có)
    if (files && files.length > 0) {
      setFiles(files?.filter((_, index) => index !== data?.key));
    }
    
    // Nếu xóa ảnh từ initialData, clear thumbnailUrl trong form
    if (initialData?.thumbnail_url === data?.image) {
      form.setValue('thumbnailUrl', '');
    }
    
    // Reset file input để có thể chọn lại file
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleValidateImageFiles = (fileList: File[]) => {
    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2Mb
    const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
    
    // Chỉ cho phép 1 file thumbnail
    if (fileList.length > 1) {
      toast({
        title: 'Error',
        description: 'Chỉ được chọn 1 ảnh thumbnail.',
        variant: 'destructive',
      });
      return;
    }
    
    for (const file of fileList) {
      //@ts-ignore
      if (!allowedExtensions.exec(file.name)) {
        toast({
          title: 'Error',
          description: 'Invalid file type. Only JPG, JPEG, PNG, and GIF files are allowed.',
          variant: 'destructive',
        });
        return;
      }
      //@ts-ignore
      if (file.size > MAX_FILE_SIZE) {
        //@ts-ignore
        toast({
          title: 'Error',
          description: `File ${file.name} is too large and has been excluded.`,
          variant: 'destructive',
        });
        return false;
      }
    }

    // Clear ảnh cũ trước khi thêm ảnh mới
    setFilesPreview([]);
    setFiles([]);
    
    // Thay thế file cũ bằng file mới (chỉ cho phép 1 thumbnail)
    setFiles(fileList);
    handlePreviewImages(fileList);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let thumbnailUrl = values.thumbnailUrl;
    let oldThumbnailUrl = '';
    
    // Nếu có file mới được chọn, upload lên Supabase
    if (files?.length > 0) {
      // Lưu thumbnail cũ để xóa sau
      if (initialData?.thumbnail_url) {
        oldThumbnailUrl = initialData.thumbnail_url;
      }
      
      const uploadPromises = await Promise.all(
        files.map(async (file) => {
          let path = `thumbnails/${Date.now()}_${file.name}`;
          const { data: url, error } = await supabase.storage
            .from("posts")
            .upload(path, file);
          
          if (error) {
            console.error('Error uploading thumbnail:', error);
            throw new Error(`Failed to upload thumbnail: ${error.message}`);
          }
          
          if (!url?.fullPath) {
            throw new Error('No URL returned from upload');
          }
          
          return url.fullPath;
        }),
      );
      
      if (uploadPromises.length > 0 && uploadPromises[0]) {
        thumbnailUrl = process.env.NEXT_PUBLIC_SUPABASE_URL +
          "/storage/v1/object/public/" + uploadPromises[0];
      } else {
        throw new Error('Failed to upload thumbnail');
      }
    }
    // Nếu không có file mới và đang update, giữ nguyên thumbnailUrl từ initialData
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(values.content ?? '', 'text/html');
      let imgs = doc.querySelectorAll('img');

      // Lưu ảnh cũ trong content để xóa sau
      let oldContentImages: string[] = [];
      if (initialData?.content) {
        oldContentImages = extractImageUrlsFromHtml(initialData.content);
      }

      const uploadPromises = Array.from(imgs).map(async (img, index) => {
        const src = img.getAttribute('src');
        if (src?.startsWith('data:image')) {
          const ext = src.split(';')[0].split('/')[1];
          const filename = `image_${index + 1}.${ext}`;
          const file = base64ToFile(src, filename);

          let path = `content/${Date.now()}_${file.name}`;
          const { data: url, error } = await supabase.storage
            .from("posts")
            .upload(path, file);
          
          if (error) {
            return null;
          }
          
          return url?.fullPath || null;
        }
        return null;
      });

      const urlListFromSupabase = (await Promise.all(uploadPromises)).filter(Boolean) as string[];

      // Gán url nhận được từ Supabase vào src của image
      const descriptionFinal = replaceBase64WithUrls(values.content ?? '', urlListFromSupabase);

      if (initialData?.id) {
        // Chuẩn bị cleanup data
        const cleanupData: {
          oldThumbnailUrl?: string;
          oldContentImages?: string[];
        } = {};
        
        // Xóa thumbnail cũ nếu có
        if (oldThumbnailUrl) {
          cleanupData.oldThumbnailUrl = oldThumbnailUrl;
        }
        
        // Xóa ảnh content cũ nếu có
        if (oldContentImages.length > 0) {
          // Lấy ảnh mới trong content để so sánh
          const newContentImages = extractImageUrlsFromHtml(descriptionFinal);
          const imagesToDelete = oldContentImages.filter(oldImg => !newContentImages.includes(oldImg));
          
          if (imagesToDelete.length > 0) {
            cleanupData.oldContentImages = imagesToDelete;
          }
        }
        
        // Update post trước
        updatePost.mutate({
          id: initialData.id,
          categoryId: values?.categoryId,
          content: descriptionFinal,
          slug: values.slug,
          thumbnailUrl,
          title: values.title
        });

        // Set pending cleanup để useEffect xử lý
        if (cleanupData.oldThumbnailUrl || cleanupData.oldContentImages?.length) {
          setPendingCleanup(cleanupData);
        }

      } else {
        createPost.mutate({
          categoryId: values.categoryId,
          content: descriptionFinal,
          slug: values.slug,
          title: values.title,
          thumbnailUrl
        });
      }

    } catch (error) {
      toast({
        title: 'Error',
        description: 'Tạo bài viết thất bại. Vui lòng kiểm tra lại.',
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
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Post Name <span className='text-sm text-red-500'>*</span></FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập tiêu đề bài viết"
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
                    <FormLabel>Post Slug <span className='text-sm text-red-500'>*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Slug tự tạo theo tên bài viết" {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Post Category <span className='text-sm text-red-500'>*</span></FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              className='text-gray-500 bg-black'
                              placeholder="Chọn danh mục bài viết" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {
                            listCategory?.data.map((cat) => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)
                          }
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
            </div>

            <div>
              <FormField
                control={form.control}
                name="thumbnailUrl"
                render={() => (
                  <FormItem>
                    <FormLabel>Thumbnail <span className='text-sm text-red-500'>*</span></FormLabel>
                    <FormControl>
                      {/*  Xử lý upload file lên supabase Storage */}
                      <Button onClick={triggerFileInput} className='flex flex-col gap-2 bg-slate-200 text-primary' type='button' variant='ghost'>
                        <input
                          title="get-image-file"
                          id="fileInput"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          // multiple
                          onChange={(e) => handleFileSelect(e)}
                        />
                        Chọn ảnh
                      </Button>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>
            {/* show image thumbnail */}
            <div className="h-auto rounded-[8px] bg-slate-50">
              {filesPreview &&
                filesPreview.map((item, index) => {
                  return <div key={index} className="relative w-[200px] h-[200px]">
                    <div className="absolute top-0 right-0 z-10">
                      <Button type="button"
                        onClick={() => handleDeleteImage({
                          image:
                            typeof item === "object"
                              ? item.image
                              : item,
                          key: index,
                        })}
                        size="sm" className="hover:bg-red-400 bg-black text-white">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                    <Image
                      src={typeof item === "object" ? item.image : item}
                      alt="collection"
                      className="object-cover rounded-lg"
                      fill
                    />
                  </div>
                })}
            </div>

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <CustomCKEditor
                      onChange={(data) =>
                        field.onChange(data)
                      } //  Đồng bộ với form
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={updatePost.isPending || createPost.isPending}
            >
              {initialData?.id ? 'Update Post' : 'Create Post'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
