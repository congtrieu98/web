import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function base64ToFile(base64: string, filename: string): File {
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  const bstr = atob(arr[1]);
  const u8arr = new Uint8Array(bstr.length);

  for (let i = 0; i < bstr.length; i++) {
    u8arr[i] = bstr.charCodeAt(i);
  }

  return new File([u8arr], filename, { type: mime });
}



export function replaceBase64WithUrls(htmlContent: string, urlList: string[]): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  const imgs = doc.querySelectorAll('img');

  // let imgIndex = 0;
  imgs.forEach((img, idx) => {
    const src = img.getAttribute('src');
    if (src?.startsWith('data:image')) {
      const cloudUrl = urlList[idx];
      if (cloudUrl) {
        img.setAttribute('src', cloudUrl);
        // imgIndex++;
      }
    }
  });

  return doc.body.innerHTML;
}

//Get danh urls cũ
export function extractImageUrlsFromHtml(html: string): string[] {
  const urls: string[] = [];
  const regex = /<img[^>]+src="([^">]+)"/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    if (match[1].startsWith('https://res.cloudinary.com')) {
      urls.push(match[1]);
    }
  }
  return urls;
}

export function extractPublicId(url: string): string | null {
  const matches = url.match(/upload\/(?:v\d+\/)?(.+)\.(jpg|png|jpeg|webp)/);
  return matches ? matches[1] : null;
}


