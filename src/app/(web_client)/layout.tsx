import Container from '@/components/layout/container';
import Footer from '@/components/layout/footer';
import React, { PropsWithChildren, Suspense } from 'react';

export default function LayoutWebClient({ children }: PropsWithChildren) {
  return (
    <div className="h-full w-full flex flex-col relative">
      <Suspense fallback={null}>
        <Container>{children}</Container>
        <Footer />
      </Suspense>
    </div>
  );
}
