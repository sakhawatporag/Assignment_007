 'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const CATEGORIES_API = 'https://openapi.programming-hero.com/api/bazardor/categories';

type Category = {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
};

export default function NavMini() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    const loadCategories = async () => {
      try {
        const response = await fetch(CATEGORIES_API, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Categories request failed with status ${response.status}`);
        }

        const data: unknown = await response.json();
        const list = Array.isArray(data)
          ? data
          : data &&
              typeof data === 'object' &&
              'categories' in data &&
              Array.isArray(data.categories)
            ? data.categories
            : [];

        setCategories(list as Category[]);
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }
        console.error('Error fetching categories:', error);
      }
    };

    void loadCategories();

    return () => controller.abort();
  }, []);

  if (categories.length === 0) {
    return (
      <div className=" h-10 border-b border-[#edf2ee] bg-white" aria-hidden="true" />
    );
  }

  return (
    <nav
      aria-label="পণ্যের বিভাগ"
      className="border-b border-[#edf2ee] bg-white"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-start gap-5 overflow-x-auto scrollbar-none px-4 py-2 text-xs font-semibold text-[#5f6d64] sm:gap-8 sm:px-6 md:px-8 [&::-webkit-scrollbar]:hidden">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/category/${category.slug}`}
            className="group flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-1.5 py-1 transition-colors hover:bg-[#f0f8f2] hover:text-[#008744]"
          >
            <span className="text-sm leading-none" aria-hidden="true">
              {category.icon}
            </span>
            <span>{category.nameBn}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}