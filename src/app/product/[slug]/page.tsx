'use client';

import BazarDetails from '@/components/Bazar-details';
import { useParams } from 'next/navigation';
import { Suspense } from 'react';

function ProductContent() {
  const params = useParams<{ slug: string }>();
  return <BazarDetails slug={params.slug} />;
}

export default function ProductPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#f3f8f4] px-4 py-8">
          <div className="mx-auto h-24 max-w-6xl animate-pulse rounded-xl bg-white" />
        </main>
      }
    >
      <ProductContent />
    </Suspense>
  );
}
