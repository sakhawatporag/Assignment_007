'use client';

import MiniNavDetails from '@/components/Mini_nav_details';
import { useParams } from 'next/navigation';
import { Suspense } from 'react';

function CategoryContent() {
  const params = useParams<{ slug: string }>();
  return <MiniNavDetails slug={params.slug} />;
}

export default function CategoryPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#f3f8f4] px-4 py-8">
          <div className="mx-auto h-24 max-w-6xl animate-pulse rounded-xl bg-white" />
        </main>
      }
    >
      <CategoryContent />
    </Suspense>
  );
}
