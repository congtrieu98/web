// components/CustomCKEditor.tsx
'use client';

import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import dynamic from 'next/dynamic';
import { FileLoader, UploadAdapter, UploadResponse } from '@ckeditor/ckeditor5-upload'; // nếu có


const CKEditor = dynamic(
  () => import('@ckeditor/ckeditor5-react').then((mod) => mod.CKEditor),
  { ssr: false }
);

type CKEditor5Build = {
  create: (...args: any[]) => Promise<any>;
  EditorWatchdog: any;
  ContextWatchdog: any;
};


export default function CustomCKEditor({ onChange, value }: { onChange: (data: string) => void, value: string }) {

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
