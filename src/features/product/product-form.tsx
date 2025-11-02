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
import { base64ToFile, extractImageUrlsFromHtml, replaceBase64WithUrls } from '@/lib/utils';
import { api } from '@/trpc/react';
import { Product } from '@/types/main';
import { formatNumber, sanitizeNumber, slugify } from '@/utils/helpers';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/client';

const formSchema = z.object({
  productName: z.string().min(1, {
    message: 'Tên sản phẩm không được để trống.',
  }),
  slug: z.string().min(1, {
    message: 'Slug không được để trống.',
  }),
  categoryId: z.string().min(1, {
    message: 'Danh mục không được để trống.',
  }),
  brandId: z.string().nullable().optional(),
  price: z.preprocess(
    (val) => typeof val === 'string' ? Number(val.replace(/\./g, '')) : val,
    z.number().min(1, { message: 'Giá sản phẩm không được để trống.' })
  ),
  quantity: z.preprocess(
    (val) => typeof val === 'string' ? Number(val.replace(/\./g, '')) : val,
    z.number().min(1, { message: 'Số lượng sản phẩm không được để trống.' })
  ),
  oldPrice: z.preprocess(
    (val) => typeof val === 'string' ? Number(val.replace(/\./g, '')) : val,
    z.number().optional()
  ),
  media: z.array(z.string()).refine(() => {
    // Custom validation sẽ được thêm trong useEffect
    return true;
  }, {
    message: 'Ảnh sản phẩm không được để trống.',
  }),
  productType: z.record(z.string(), z.any()),
  specs: z
    .array(
      z.object({
        name: z.string().min(1, 'Tên thông số không được để trống'),
        unit: z.string().min(1, 'Tên đơn vị không được để trống'),
        option: z.string()
      })
    )
    .min(1, 'Phải có ít nhất 1 thông số'),
  description: z.string().optional(), // Added description property
});

export default function ProductForm({
  initialData,
  pageTitle,
}: {
  initialData: Product | null;
  pageTitle: string;
}) {
  const supabase = createClient();
  const [files, setFiles] = useState<any[]>([]);
  const [filesPreview, setFilesPreview] = useState<any[]>([]);
  const [pendingCleanup, setPendingCleanup] = useState<{
    oldMediaUrls?: string[];
    oldContentImages?: string[];
  }>({});

  const defaultValues = {
    productName: initialData?.productName || '',
    description: initialData?.description || '',
    slug: initialData?.slug || '',
    oldPrice: initialData?.oldPrice || 0,
    price: initialData?.price || 0,
    categoryId: initialData?.categoryId || '',
    brandId: initialData?.brandId || '',
    quantity: initialData?.quantity || 1,
    productType: initialData?.productType || {},
    media: initialData?.media || [],
    specs: initialData?.specs?.map((spec) => ({
      name: spec.name || '',
      unit: spec.unit || '',
      option: spec.option || '',
    })) || [{ name: '', unit: '', option: '' }],
  };


  const router = useRouter();

  const utils = api.useUtils();

  const { toast } = useToast();

  // Function để xóa ảnh cũ từ Supabase Storage
  const deleteOldImages = useCallback(async (oldUrls: string[]) => {
    if (oldUrls.length === 0) {
      console.log('No old images to delete');
      return;
    }
    
    console.log('Starting to delete old images:', oldUrls);
    
    try {
      await Promise.all(
        oldUrls.map(async (url) => {
          console.log('Processing URL for deletion:', url);
          
          // Extract path từ URL Supabase
          if (url.includes('/storage/v1/object/public/')) {
            const urlParts = url.split('/storage/v1/object/public/');
            if (urlParts.length > 1) {
              let filePath = urlParts[1];
              
              // Loại bỏ bucket name nếu có (products/)
              if (filePath.startsWith('products/')) {
                filePath = filePath.substring(9); // Loại bỏ "products/"
              }
              
              console.log('Extracted file path:', filePath);
              console.log('Original URL:', url);
              
              const { error } = await supabase.storage
                .from("products")
                .remove([filePath]);
              
              if (error) {
                console.error('Error deleting old image:', error);
              } else {
                console.log('Successfully deleted old image:', filePath);
              }
            } else {
              console.error('Could not extract file path from URL:', url);
            }
          } else {
            console.log('URL does not contain Supabase storage path:', url);
          }
        })
      );
    } catch (error) {
      console.error('Error in deleteOldImages:', error);
    }
  }, [supabase]);


  const { data: listCategory } = api.category.getAllWithoutPagination.useQuery();
  const { data: listBrands } = api.brands.getAllBrandsPublic.useQuery();

  const createProduct = api.products.create.useMutation({
    throwOnError: false,
    onSuccess: async () => {
      await utils.products.getAll.invalidate();
      toast({
        title: 'Success',
        description: 'Products created successfully!',
      });
      router.push(pathName.products);
    },
    onError: (error) => {
      console.log('Error creating products:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateProduct = api.products.update.useMutation({
    throwOnError: false,
    onSuccess: async () => {
      await utils.products.getAll.invalidate();
      toast({
        title: 'Success',
        description: 'Products updated successfully!',
      });
      router.push(pathName.products);
    },
    onError: (error) => {
      console.log('Error updating products:', error);
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

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'specs',
  });

  // Khởi tạo filesPreview từ initialData khi component mount
  useEffect(() => {
    if (initialData?.media && initialData.media.length > 0) {
      setFilesPreview(initialData.media);
    }
  }, [initialData]);

  // Xử lý cleanup ảnh cũ khi có pendingCleanup
  useEffect(() => {
    const performCleanup = async () => {
      if (pendingCleanup.oldMediaUrls?.length || pendingCleanup.oldContentImages?.length) {
        console.log('Performing cleanup for:', pendingCleanup);
        
        const urlsToDelete: string[] = [];
        
        if (pendingCleanup.oldMediaUrls?.length) {
          urlsToDelete.push(...pendingCleanup.oldMediaUrls);
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

  // Validate media field dựa trên filesPreview (chỉ khi có tương tác)
  useEffect(() => {
    // Chỉ validate khi form đã được touched hoặc có initialData
    const isFormTouched = form.formState.isSubmitted || form.formState.isDirty;
    const hasInitialData = !!initialData;
    
    if (isFormTouched || hasInitialData) {
      if (filesPreview.length === 0) {
        form.setError('media', {
          type: 'manual',
          message: 'Ảnh sản phẩm không được để trống.',
        });
      } else {
        form.clearErrors('media');
        // Đồng bộ filesPreview với form field
        form.setValue('media', filesPreview);
      }
    } else {
      // Khi chưa có tương tác, chỉ đồng bộ filesPreview với form field
      form.setValue('media', filesPreview);
    }
  }, [filesPreview, form, initialData]);

  // Logic xử lý file upload cho media
  const handlePreviewImages = (fileList: File[]) => {
    const filesArray = fileList.map(
      (file: File) => URL.createObjectURL(file),
    );
    setFilesPreview((prevImages) => prevImages.concat(filesArray));
    fileList.map((file: any) => URL.revokeObjectURL(file));
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
    // Xóa file khỏi files array (nếu có)
    if (files && files.length > 0) {
      setFiles(files?.filter((_, index) => index !== data?.key));
    }
    
    // Cập nhật filesPreview và form field
    const updatedFilesPreview = filesPreview.filter((e) => {
      if (e?.image) {
        return e?.image !== data?.image;
      } else {
        return e !== data?.image;
      }
    });
    setFilesPreview(updatedFilesPreview);
    
    // Đồng bộ với form field
    form.setValue('media', updatedFilesPreview);
    
    // Reset file input để có thể chọn lại file
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleValidateImageFiles = (fileList: File[]) => {
    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2Mb
    const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
    
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

    // Thêm file mới vào files array
    if (files && files?.length > 0) {
      setFiles((file) => [...file, ...fileList]);
    } else setFiles(fileList);
    handlePreviewImages(fileList);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('value submit product:', values);
    
    // Validate media field
    if (filesPreview.length === 0) {
      form.setError('media', {
        type: 'manual',
        message: 'Ảnh sản phẩm không được để trống.',
      });
      return;
    }
    
    let mediaUrls = values.media;
    let oldMediaUrls: string[] = [];
    
    // Upload media mới nếu có
    if (files?.length > 0) {
      // Lưu media cũ để xóa sau
      if (initialData?.media && initialData.media.length > 0) {
        oldMediaUrls = initialData.media;
      }
      
      const uploadPromises = await Promise.all(
        files.map(async (file) => {
          let path = `thumbnails/${Date.now()}_${file.name}`;
          const { data: url, error } = await supabase.storage
            .from("products")
            .upload(path, file);
          
          if (error) {
            console.error('Error uploading media:', error);
            throw new Error(`Failed to upload media: ${error.message}`);
          }
          
          if (!url?.fullPath) {
            throw new Error('No URL returned from media upload');
          }
          
          return process.env.NEXT_PUBLIC_SUPABASE_URL + "/storage/v1/object/public/" + url.fullPath;
        }),
      );
      
      console.log('Media upload promises result:', uploadPromises);
      mediaUrls = uploadPromises;
    } else {
      // Nếu không có file mới, sử dụng ảnh từ initialData
      mediaUrls = initialData?.media || [];
    }

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(values.description ?? '', 'text/html');
      let imgs = doc.querySelectorAll('img');

      // Lưu ảnh cũ trong content để xóa sau
      let oldContentImages: string[] = [];
      if (initialData?.description) {
        oldContentImages = extractImageUrlsFromHtml(initialData.description);
      }

      const uploadPromises = Array.from(imgs).map(async (img, index) => {
        const src = img.getAttribute('src');
        if (src?.startsWith('data:image')) {
          const ext = src.split(';')[0].split('/')[1];
          const filename = `image_${index + 1}.${ext}`;
          const file = base64ToFile(src, filename);

          let path = `content/${Date.now()}_${file.name}`;
          const { data: url, error } = await supabase.storage
            .from("products")
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
          oldMediaUrls?: string[];
          oldContentImages?: string[];
        } = {};
        
        // Xóa media cũ nếu có
        if (oldMediaUrls.length > 0) {
          cleanupData.oldMediaUrls = oldMediaUrls;
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
        
        // Update product trước
        updateProduct.mutate({
          id: initialData.id,
          productName: values.productName,
          categoryId: values.categoryId,
          brandId: values.brandId || null,
          description: descriptionFinal,
          slug: values.slug,
          quantity: values.quantity,
          price: values.price,
          oldPrice: values.oldPrice,
          productType: values.productType,
          specs: values.specs,
          media: mediaUrls
        });

        // Set pending cleanup để useEffect xử lý
        if (cleanupData.oldMediaUrls?.length || cleanupData.oldContentImages?.length) {
          setPendingCleanup(cleanupData);
        }
      } else {
        createProduct.mutate({
          productName: values.productName,
          categoryId: values.categoryId,
          brandId: values.brandId || null,
          description: descriptionFinal,
          slug: values.slug,
          quantity: values.quantity,
          price: values.price,
          oldPrice: values.oldPrice,
          productType: values.productType,
          specs: values.specs,
          media: mediaUrls
        });
      }

    } catch (error) {
      console.error('An error occurred:', error);
      toast({
        title: 'Error',
        description: 'Tạo sản phẩm thất bại. Vui lòng kiểm tra lại.',
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
                name="productName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name <span className='text-sm text-red-500'>*</span></FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập tên sản phẩm"
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
                    <FormLabel>Product Slug <span className='text-sm text-red-500'>*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Slug tự tạo theo tên sản phẩm" {...field}
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
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              className='text-gray-500 bg-black'
                              placeholder="Chọn danh mục sản phẩm" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {
                            listCategory?.map((cat) => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)
                          }
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
              <FormField
                control={form.control}
                name="brandId"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Brand</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(value === 'none' ? null : value)} 
                        defaultValue={field.value || undefined}
                        value={field.value || undefined}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              className='text-gray-500 bg-black'
                              placeholder="Chọn thương hiệu sản phẩm" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {
                            listBrands?.map((brand) => <SelectItem key={brand.id} value={brand.id}>{brand.name}</SelectItem>)
                          }
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity<span className='text-sm text-red-500'>*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập số lượng sản phẩm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price current<span className='text-sm text-red-500'>*</span></FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập giá hiện tại"
                        value={formatNumber(String(field.value ?? ''))}
                        onChange={(e) => {
                          const sanitized = sanitizeNumber(e.target.value);
                          field.onChange(sanitized);
                        }}
                      // {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="oldPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price Old</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập giá cũ"
                        value={formatNumber(String(field.value ?? ''))}
                        onChange={(e) => {
                          const sanitized = sanitizeNumber(e.target.value);
                          field.onChange(sanitized);
                        }}
                      // {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="productType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product type</FormLabel>
                    <Select onValueChange={(val) => field.onChange({ [val]: true })}
                      value={Object.keys(field.value ?? {})[0] || undefined}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            className='text-gray-500 bg-black'
                            placeholder="Select a category to display" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {/* {
                            // listCategory?.data.map((cat) => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)
                          } */}
                        <SelectItem value={'isNew'}>Sản phẩm mới</SelectItem>
                        <SelectItem value={'isHot'}>Sản phẩm hot</SelectItem>
                        <SelectItem value={'isSale'}>Sản phẩm đang sale</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* THÔNG SỐ KỸ THUẬT */}
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex gap-4 items-end"
              >

                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name={`specs.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên thông số <span className='text-red-500'>*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="Ví dụ: Độ phân giải" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name={`specs.${index}.unit`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Đơn vị <span className='text-red-500'>*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="Ví dụ: px, Hz" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name={`specs.${index}.option`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bảo hành</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nhập thời gian bảo hành"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='flex flex-col gap-3'>
                  <div className='h-5'></div>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="self-center"
                    onClick={() => remove(index)}
                  >
                    <Trash2 size={20} className='text-red-500' />
                  </Button>
                </div>
              </div>

            ))}

            <div className='flex justify-center items-center'>
              <Button
                type="button"
                variant="outline"
                onClick={() => append({ name: '', unit: '', option: '' })}
                className='flex gap-2'
              >
                <Plus size={20} className='text-primary' />
                Thêm thông số
              </Button>
            </div>
            <div>
              <FormField
                control={form.control}
                name="media"
                render={() => (
                  <FormItem>
                    <FormLabel>Product Images <span className='text-sm text-red-500'>*</span></FormLabel>
                    <FormControl>
                      <Button onClick={triggerFileInput} className='flex flex-col gap-2 bg-slate-200 text-primary' type='button' variant='ghost'>
                        <input
                          title="get-image-file"
                          id="fileInput"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          multiple
                          onChange={(e) => handleFileSelect(e)}
                        />
                        Chọn ảnh sản phẩm
                      </Button>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Show image previews */}
            <div className="h-auto rounded-[8px] bg-slate-50 p-4">
              <div className="flex flex-wrap gap-4">
                {filesPreview &&
                  filesPreview.map((item, index) => {
                    return <div key={index} className="relative w-[200px] h-[200px] flex-shrink-0">
                      <div className="absolute top-2 right-2 z-10">
                        <Button type="button"
                          onClick={() => handleDeleteImage({
                            image:
                              typeof item === "object"
                                ? item.image
                                : item,
                            key: index,
                          })}
                          size="sm" className="hover:bg-red-400 bg-black text-white">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Image
                        src={typeof item === "object" ? item.image : item}
                        alt="product"
                        className="object-cover rounded-lg"
                        fill
                      />
                    </div>
                  })}
              </div>
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
              disabled={updateProduct.isPending || createProduct.isPending}
            >
              {initialData?.id ? 'Update Product' : 'Create Product'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
