// components/CustomCKEditor.tsx
'use client';

import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import dynamic from 'next/dynamic';
import { FileLoader, UploadAdapter, UploadResponse } from '@ckeditor/ckeditor5-upload'; // nếu có


// const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;

const CKEditor = dynamic(
  () => import('@ckeditor/ckeditor5-react').then((mod) => mod.CKEditor),
  { ssr: false }
);

type CKEditor5Build = {
  create: (...args: any[]) => Promise<any>;
  EditorWatchdog: any;
  ContextWatchdog: any;
};


export default function CustomCKEditor({ onChange, value, isSubmitting }: { onChange: (data: string) => void, value: string, isSubmitting: boolean }) {

  console.log('isSubmitting:', isSubmitting);

  // const customUploadAdapter = (loader: any) => {
  //   return {
  //     upload: async () => {
  //       const file = await loader.file;

  //       // Step 1: Get Signature
  //       const signatureRes = await fetch('/api/upload-signature', {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify({ folder: 'product_image_desctiption' }),
  //       });
  //       const { signature, timestamp, folder } = await signatureRes.json();
  //       console.log({ signature, timestamp, folder });


  //       // Step 2: Upload Image to Cloudinary
  //       const formData = new FormData();
  //       formData.append('file', file);
  //       formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
  //       formData.append('timestamp', timestamp.toString());
  //       formData.append('signature', signature);
  //       formData.append('folder', folder);

  //       const cloudinaryRes = await fetch(CLOUDINARY_URL, {
  //         method: 'POST',
  //         body: formData,
  //       });

  //       const data = await cloudinaryRes.json();

  //       return { default: data.secure_url }; // return URL for CKEditor to insert
  //     },
  //   };
  // };

  // function uploadPlugin(editor: any) {
  //   editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
  //     return customUploadAdapter(loader);
  //   };
  // }


  class MyDummyUploadAdapter implements UploadAdapter {
    loader: FileLoader;

    constructor(loader: FileLoader) {
      this.loader = loader;
    }

    async upload(): Promise<UploadResponse> {
      const file = await this.loader.file;

      return new Promise<UploadResponse>((resolve, reject) => {
        if (!file) {
          reject(new Error('No file to upload'));
          return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => {
          if (typeof reader.result === 'string') {
            resolve({ default: reader.result });
          } else {
            reject(new Error('File reading error: result is not a string'));
          }
        };

        reader.onerror = (error) => {
          reject(error);
        };
      });
    }

    abort(): void {
      // Không cần làm gì khi cancel upload
    }
  }


  return (
    <div className="rounded border p-2">
      <CKEditor
        editor={ClassicEditor as unknown as CKEditor5Build}
        // config={{
        //   extraPlugins: [uploadPlugin],
        // }}
        data={value}
        onChange={(event, editor) => {
          const data = editor.getData();
          onChange(data);
        }}
        onReady={(editor) => {
          // Tùy chỉnh lại upload adapter
          editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
            return new MyDummyUploadAdapter(loader);
          };
        }}
      />
    </div>
  );
}
