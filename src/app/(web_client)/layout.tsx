import Container from '@/components/layout/Container';
import Footer from '@/components/layout/Footer';
import React, { PropsWithChildren, Suspense } from 'react';

export default function LayoutWebClient({ children }: PropsWithChildren) {
  return (
    <div className="h-full w-full flex flex-col relative dark:bg-white dark:text-gray-700">
      <Suspense fallback={null}>
        <Container>{children}</Container>
        <Footer />
      </Suspense>
    </div>
  );
}
