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
import { base64ToFile, extractImageUrlsFromHtml, extractPublicId, replaceBase64WithUrls } from '@/lib/utils';
import { api } from '@/trpc/react';
import { Product } from '@/types/main';
import { formatNumber, sanitizeNumber, slugify } from '@/utils/helpers';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';
import ImageUpload from '@/components/ui/imageUpload';

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
  media: z.array(z.string()).min(1, { message: 'Ảnh sản phẩm không được để trống.' }),
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

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;
export default function ProductForm({
  initialData,
  pageTitle,
}: {
  initialData: Product | null;
  pageTitle: string;
}) {


  const defaultValues = {
    productName: initialData?.productName || '',
    description: initialData?.description || '',
    slug: initialData?.slug || '',
    oldPrice: initialData?.oldPrice || 0,
    price: initialData?.price || 0,
    categoryId: initialData?.categoryId || '',
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

  const { data: listCategory } = api.category.getAll.useQuery({});

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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('value submit product:', values);

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(values.description ?? '', 'text/html');
      let imgs = doc.querySelectorAll('img');

      const uploadPromises = Array.from(imgs).map(async (img, index) => {
        const src = img.getAttribute('src');
        if (src?.startsWith('data:image')) {
          const ext = src.split(';')[0].split('/')[1];
          const filename = `image_${index + 1}.${ext}`;
          const file = base64ToFile(src, filename);


          const signatureRes = await fetch('/api/upload-signature', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ folder: 'product_image_desctiption' }),
          });
          const { signature, timestamp, folder } = await signatureRes.json();

          const formData = new FormData();
          formData.append('file', file);
          formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
          formData.append('timestamp', timestamp.toString());
          formData.append('signature', signature);
          formData.append('folder', folder);

          const cloudinaryRes = await fetch(CLOUDINARY_URL, {
            method: 'POST',
            body: formData,
          });

          const data = await cloudinaryRes.json();

          return data.secure_url;
        }
      });


      const urlListFromCloudinary = await Promise.all(uploadPromises);


      // Gán url nhận được từ cloudinary vào src của image
      const descriptionFinal = replaceBase64WithUrls(values.description ?? '', urlListFromCloudinary);

      if (initialData?.id) {
        updateProduct.mutate({
          id: initialData.id,
          productName: values.productName,
          categoryId: values.categoryId,
          description: descriptionFinal,
          slug: values.slug,
          quantity: values.quantity,
          price: values.price,
          oldPrice: values.oldPrice,
          productType: values.productType,
          specs: values.specs,
          media: values.media
        });

        // Xóa ảnh trên cloudinary
        const oldUrls = extractImageUrlsFromHtml(initialData.description!);
        const newUrls = extractImageUrlsFromHtml(descriptionFinal);

        const deletedUrls = oldUrls.filter(url => !newUrls.includes(url));
        console.log('deletedUrrls:', deletedUrls);


        // Xóa ảnh không còn dùng
        if (deletedUrls.length > 0) {
          await Promise.all(
            deletedUrls.map(async (url) => {
              const publicId = extractPublicId(url);
              if (publicId) {
                await fetch('/api/deleted-image-cloudinary', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ public_id: publicId }),
                });
              }
            })
          );
        }
      } else {
        createProduct.mutate({
          productName: values.productName,
          categoryId: values.categoryId,
          description: descriptionFinal,
          slug: values.slug,
          quantity: values.quantity,
          price: values.price,
          oldPrice: values.oldPrice,
          productType: values.productType,
          specs: values.specs,
          media: values.media
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
                            listCategory?.data.map((cat) => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)
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
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={field.value}
                        onChange={(urls) => field.onChange(urls)}
                        onRemove={async (url) => {
                          const publicId = extractPublicId(url);
                          if (publicId) {
                            await fetch('/api/deleted-image-cloudinary', {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({ public_id: publicId }),
                            });
                          }
                          field.onChange([
                            ...field.value.filter((image) => image !== url),
                          ])
                        }}
                      />
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
              {initialData?.id ? 'Update Category' : 'Create Category'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
