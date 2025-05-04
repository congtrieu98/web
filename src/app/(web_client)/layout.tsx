import Container from '@/components/web-layout/container';
import Footer from '@/components/web-layout/footer';
import { Header } from '@/components/web-layout/header';
import React, { PropsWithChildren, Suspense } from 'react';

export default function LayoutWebClient({ children }: PropsWithChildren) {
  return (
    <div className="h-full w-full flex flex-col relative">
      <Suspense fallback={null}>
        <Header />
        <Container>{children}</Container>
        <Footer />
      </Suspense>
    </div>
  );
}
