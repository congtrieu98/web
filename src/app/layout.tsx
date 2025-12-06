import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { siteConfig } from '@/config/site';
import { ThemeProvider } from '@/components/theme-provider';
import { TRPCReactProvider } from '@/trpc/react';
import React, { Suspense } from 'react';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import NextTopLoader from 'nextjs-toploader';
import './globals.css';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Toaster } from '@/components/ui/toaster';
import ModalConfirm from '@/components/modal/modal-confirm';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'Dolozi Store',
    'Máy tính PC đồ họa',
    'Máy tính PC gaming',
    'Máy tính PC văn phòng',
    'Máy tính PC AI',
    'Build PC',
    'CPU',
    'VGA',
    'Màn hình máy tính',
    'Chính hãng',
    'Giá rẻ',
    'Giảm giá',
    'phụ kiện máy tính',
  ],
  creator: 'Dolozi Store',
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: `${siteConfig.url}/assets/banner/banner-thumb.jpg`,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url}/assets/banner/banner-thumb.jpg`],
    creator: 'Dolozi Store',
  },
  icons: {
    icon: '/logo.svg',

  },
  manifest: `${siteConfig.url}/site.webmanifest`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={inter.className}>
        <Suspense fallback={null}>
          <NextTopLoader color="#3B82F6" showSpinner={false} />
          <NuqsAdapter>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
              <TRPCReactProvider>
                {children}
                <Toaster />
                <ModalConfirm />
              </TRPCReactProvider>
            </ThemeProvider>
          </NuqsAdapter>
        </Suspense>
      </body>
    </html>
  );
}
