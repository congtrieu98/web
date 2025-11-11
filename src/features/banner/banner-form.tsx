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
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ProductCombobox } from '@/components/ui/product-combobox';
import { pathName } from '@/config/dashboard';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/trpc/react';
import { Banner } from '@/types/main';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Trash, Plus } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

const formSchema = z.object({
  title: z.string().min(1, {
    message: 'Banner title must be at least 1 character.',
  }),
  type: z.enum(['single', 'grid'], {
    required_error: 'Please select a banner type.',
  }),
  images: z
    .array(
      z.object({
        src: z.string().url('Please provide a valid image URL.'),
        alt: z.string().optional(),
        linkProduct: z.string().optional().nullable(), // Product slug for this specific image
      }),
    )
    .min(1, 'At least one image is required.')
    .refine(
      (images) => {
        // For single type, only 1 image is allowed
        // For grid type, 2 images are required
        return true; // We'll validate this in the form
      },
      {
        message: 'Invalid number of images for selected type.',
      },
    ),
  order_index: z.number().min(0).default(0),
  is_active: z.boolean().default(true),
});

export default function BannerForm({
  initialData,
  pageTitle,
}: {
  initialData: Banner | null;
  pageTitle: string;
}) {
  const defaultValues = {
    title: initialData?.title || '',
    type: (initialData?.type as 'single' | 'grid') || 'single',
    images: initialData?.images?.map(img => ({
      src: img.src,
      alt: img.alt || '',
      linkProduct: (img as any).linkProduct || null,
    })) || [],
    order_index: initialData?.order_index ?? 0,
    is_active: initialData?.is_active ?? true,
  };

  const router = useRouter();
  const utils = api.useUtils();
  const { toast } = useToast();
  const supabase = createClient();
  const [files, setFiles] = useState<{ [key: number]: File }>({});
  const [pendingCleanup, setPendingCleanup] = useState<{
    oldBannerImages?: string[];
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
              let filePath = urlParts[1];
              
              // Loại bỏ bucket name nếu có (banner/)
              if (filePath.startsWith('banner/')) {
                filePath = filePath.substring(7); // Loại bỏ "banner/"
              }
              
              const { error } = await supabase.storage
                .from("banner")
                .remove([filePath]);
              
              if (error) {
                console.error('Error deleting old image:', error);
              }
            } else {
              console.error('Could not extract file path from URL:', url);
            }
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
      if (pendingCleanup.oldBannerImages?.length) {
        if (pendingCleanup.oldBannerImages.length > 0) {
          await deleteOldImages(pendingCleanup.oldBannerImages);
        }
        
        // Clear pending cleanup
        setPendingCleanup({});
      }
    };
    
    performCleanup();
  }, [pendingCleanup, deleteOldImages]);

  const createBanner = api.banners.create.useMutation({
    throwOnError: false,
    onSuccess: async () => {
      await utils.banners.getAll.invalidate();
      await utils.banners.getAllPublic.invalidate();
      toast({
        title: 'Success',
        description: 'Banner created successfully!',
      });
      router.push(pathName.banners);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateBanner = api.banners.update.useMutation({
    throwOnError: false,
    onSuccess: async () => {
      await utils.banners.getAll.invalidate();
      await utils.banners.getAllPublic.invalidate();
      toast({
        title: 'Success',
        description: 'Banner updated successfully!',
      });
      router.push(pathName.banners);
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
    defaultValues,
  });

  const bannerType = form.watch('type');
  const images = form.watch('images');

  // Validate image count based on type
  const validateImages = () => {
    if (bannerType === 'single' && images.length < 1) {
      form.setError('images', {
        type: 'manual',
        message: 'Single type requires at least 1 image.',
      });
      return false;
    }
    if (bannerType === 'grid' && images.length < 2) {
      form.setError('images', {
        type: 'manual',
        message: 'Grid type requires at least 2 images.',
      });
      return false;
    }
    return true;
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!validateImages()) {
      return;
    }

    try {
      let bannerImages = values.images;
      let oldBannerImages: string[] = [];

      // Upload ảnh mới nếu có
      if (Object.keys(files).length > 0) {
        // Lưu ảnh cũ để xóa sau (khi update)
        if (initialData?.images && initialData.images.length > 0) {
          oldBannerImages = initialData.images.map(img => img.src);
        }

        // Upload từng file lên Supabase Storage
        const uploadPromises = Object.entries(files).map(async ([index, file]) => {
          const idx = parseInt(index);
          const path = `${Date.now()}_${idx}_${file.name}`;
          
          const { data: url, error } = await supabase.storage
            .from("banner")
            .upload(path, file);
          
          if (error) {
            console.error('Error uploading banner image:', error);
            throw new Error(`Failed to upload image ${idx + 1}: ${error.message}`);
          }
          
          if (!url?.fullPath) {
            throw new Error(`No URL returned from image ${idx + 1} upload`);
          }
          
          const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${url.fullPath}`;
          
          return {
            index: idx,
            url: imageUrl,
          };
        });

        const uploadResults = await Promise.all(uploadPromises);
        
        // Cập nhật images với URLs mới từ Supabase
        bannerImages = values.images.map((img, idx) => {
          const uploadResult = uploadResults.find(r => r.index === idx);
          if (uploadResult) {
            // Nếu có file mới được upload, sử dụng URL mới từ Supabase
            return {
              src: uploadResult.url,
              alt: img.alt || '',
              linkProduct: img.linkProduct || null,
            };
          }
          // Nếu không có file mới, kiểm tra xem có URL từ Supabase không (không phải blob URL)
          if (img.src && !img.src.startsWith('blob:')) {
            // Giữ nguyên URL cũ từ Supabase và linkProduct
            return {
              src: img.src,
              alt: img.alt || '',
              linkProduct: img.linkProduct || null,
            };
          }
          // Nếu là blob URL (preview), lấy URL từ initialData nếu có
          if (initialData?.images && initialData.images[idx]) {
            const existingImg = initialData.images[idx];
            return {
              src: existingImg.src,
              alt: existingImg.alt || '',
              linkProduct: (existingImg as any).linkProduct || null,
            };
          }
          return {
            src: img.src,
            alt: img.alt || '',
            linkProduct: img.linkProduct || null,
          };
        });
      } else {
        // Nếu không có file mới, sử dụng ảnh từ initialData (nếu đang edit) hoặc form values
        if (initialData?.id && initialData.images) {
          // Khi edit, giữ nguyên URLs từ database, chỉ cập nhật alt text và linkProduct nếu có thay đổi
          bannerImages = values.images.map((img, idx) => {
            const originalImg = initialData.images[idx];
            if (originalImg) {
              return {
                src: originalImg.src, // Giữ nguyên URL từ database
                alt: img.alt || originalImg.alt || '', // Cập nhật alt text nếu có thay đổi
                linkProduct: img.linkProduct || (originalImg as any).linkProduct || null, // Giữ linkProduct từ form hoặc database
              };
            }
            return {
              src: img.src,
              alt: img.alt || '',
              linkProduct: img.linkProduct || null,
            };
          });
        } else {
          // Khi tạo mới, sử dụng form values (nhưng không nên có trường hợp này vì phải upload file)
          bannerImages = values.images;
        }
      }

      if (initialData?.id) {
        // Chuẩn bị cleanup data
        const cleanupData: {
          oldBannerImages?: string[];
        } = {};
        
        // Xóa ảnh cũ nếu có file mới được upload
        if (oldBannerImages.length > 0 && Object.keys(files).length > 0) {
          // So sánh ảnh cũ và mới để tìm ảnh cần xóa
          const newImageUrls = bannerImages.map(img => img.src);
          const imagesToDelete = oldBannerImages.filter(oldImg => !newImageUrls.includes(oldImg));
          
          if (imagesToDelete.length > 0) {
            cleanupData.oldBannerImages = imagesToDelete;
          }
        }
        
        // Update banner trước
        updateBanner.mutate({
          id: initialData.id,
          title: values.title,
          type: values.type,
          images: bannerImages,
          order_index: values.order_index,
          is_active: values.is_active,
        });

        // Set pending cleanup để useEffect xử lý
        if (cleanupData.oldBannerImages?.length) {
          setPendingCleanup(cleanupData);
        }
      } else {
        createBanner.mutate({
          title: values.title,
          type: values.type,
          images: bannerImages,
          order_index: values.order_index,
          is_active: values.is_active,
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

  const handleFileSelect = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Error',
          description: 'Please select an image file',
          variant: 'destructive',
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'Error',
          description: 'Image size must be less than 5MB',
          variant: 'destructive',
        });
        return;
      }

      // Lưu file vào state
      setFiles(prev => ({ ...prev, [index]: file }));

      // Tạo preview URL và cập nhật form
      const previewUrl = URL.createObjectURL(file);
      const currentImages = form.getValues('images');
      const newImages = [...currentImages];
      
      if (newImages[index]) {
        newImages[index] = { ...newImages[index], src: previewUrl };
      } else {
        newImages[index] = { src: previewUrl, alt: '' };
      }
      
      form.setValue('images', newImages);
      
      // Reset file input để có thể chọn lại file
      e.target.value = '';
    }
  };

  const handleAddImage = () => {
    const currentImages = form.getValues('images');
    // Both single and grid types can have multiple images
    // Single: each image = 1 slide in carousel
    // Grid: every 2 images = 1 slide in carousel
    form.setValue('images', [...currentImages, { src: '', alt: '' }]);
  };

  const handleRemoveImage = (index: number) => {
    // Xóa file khỏi files state nếu có
    const newFiles = { ...files };
    delete newFiles[index];
    setFiles(newFiles);

    // Xóa ảnh khỏi form
    const currentImages = form.getValues('images');
    const updatedImages = currentImages.filter((_, i) => i !== index);
    form.setValue('images', updatedImages);
  };

  // Both single and grid can have unlimited images
  // Single: each image = 1 slide
  // Grid: every 2 images = 1 slide

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
                    <FormLabel>
                      Banner Title <span className="text-sm text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter banner title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Banner Type <span className="text-sm text-red-500">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        // Reset images when type changes
                        if (value === 'single') {
                          // Single type: keep at least 1 image, remove extras if needed
                          if (images.length === 0) {
                            form.setValue('images', [{ src: '', alt: '' }]);
                          }
                          // If already has images, keep them (can have multiple for carousel)
                        } else if (value === 'grid') {
                          // Grid requires at least 2 images
                          if (images.length === 0) {
                            form.setValue('images', [{ src: '', alt: '' }, { src: '', alt: '' }]);
                          } else if (images.length === 1) {
                            form.setValue('images', [
                              ...images,
                              { src: '', alt: '' },
                            ]);
                          }
                          // If already has 2+ images, keep them
                        }
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select banner type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="single">Single (1+ images)</SelectItem>
                        <SelectItem value="grid">Grid (2+ images)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Single: 1+ images (each image = 1 slide), Grid: 2+ images (every 2 images = 1 slide)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="order_index"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order Index</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Lower numbers appear first (0 = highest priority)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value === 'true')}
                      value={field.value ? 'true' : 'false'}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="true">Active</SelectItem>
                        <SelectItem value="false">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Only active banners are shown on the homepage
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="images"
              render={() => (
                <FormItem>
                  <FormLabel>
                    Banner Images <span className="text-sm text-red-500">*</span>
                  </FormLabel>
                  <FormDescription>
                    {bannerType === 'single'
                      ? 'Upload 1 or more images for single banner (each image = 1 slide in carousel)'
                      : 'Upload at least 2 images for grid banner (every 2 images = 1 slide in carousel)'}
                  </FormDescription>
                  <div className="space-y-4">
                    {images.map((image, index) => (
                      <div
                        key={index}
                        className="flex flex-col gap-4 rounded-lg border p-4"
                      >
                        <div className="flex items-center justify-between">
                          <FormLabel>Image {index + 1}</FormLabel>
                          {images.length > 0 && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => handleRemoveImage(index)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          )}
                        </div>

                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileSelect(index, e)}
                            className="hidden"
                            id={`banner-image-${index}`}
                          />
                          {image.src ? (
                            <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                              <Image
                                src={image.src}
                                alt={image.alt || `Banner image ${index + 1}`}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute top-2 right-2 flex gap-2">
                                <Button
                                  type="button"
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => {
                                    document.getElementById(`banner-image-${index}`)?.click();
                                  }}
                                >
                                  Change Image
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                document.getElementById(`banner-image-${index}`)?.click();
                              }}
                              className="w-full h-48 flex flex-col items-center justify-center"
                            >
                              <Plus className="h-8 w-8 mb-2" />
                              Upload Image {index + 1}
                            </Button>
                          )}
                        </div>

                        

                        <FormField
                          control={form.control}
                          name={`images.${index}.alt`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Alt Text (Optional)</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter alt text for image"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`images.${index}.linkProduct`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Link to Product (Optional)</FormLabel>
                              <FormControl>
                                <ProductCombobox
                                  value={field.value || undefined}
                                  onValueChange={(value) => {
                                    field.onChange(value || null);
                                  }}
                                  placeholder="Select a product for this image..."
                                />
                              </FormControl>
                              <FormDescription>
                                Select a product. When this image is clicked, it will redirect to the product detail page.
                              </FormDescription>
                              {field.value && (
                                <div className="text-sm text-muted-foreground">
                                  Selected: <span className="font-medium">{field.value}</span>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="ml-2 h-auto p-0 text-xs"
                                    onClick={() => field.onChange(null)}
                                  >
                                    Clear
                                  </Button>
                                </div>
                              )}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddImage}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Image
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={updateBanner.isPending || createBanner.isPending}
              >
                {initialData?.id ? 'Update Banner' : 'Create Banner'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

