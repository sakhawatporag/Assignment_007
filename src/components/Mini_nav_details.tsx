 'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

const PRODUCTS_API = 'https://openapi.programming-hero.com/api/bazardor/products';

type PriceChange = {
  dir: 'up' | 'down' | 'flat';
  pct: number;
};

type Product = {
  id: number | string;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image?: string;
  today: number;
  yesterday: number;
  change: PriceChange;
};

type MiniNavDetailsProps = {
  slug: string;
};

const formatNumber = (value: number) =>
  new Intl.NumberFormat('bn-BD', { maximumFractionDigits: 1 }).format(value);

export default function MiniNavDetails({ slug }: MiniNavDetailsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [sortOrder, setSortOrder] = useState<'default' | 'price-low' | 'price-high'>('default');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const loadProducts = async () => {
      try {
        const response = await fetch(PRODUCTS_API, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Products request failed with status ${response.status}`);
        }

        const data: unknown = await response.json();
        const list =
          Array.isArray(data)
            ? data
            : data &&
                typeof data === 'object' &&
                'products' in data &&
                Array.isArray(data.products)
              ? data.products
              : [];

        setProducts(list as Product[]);
      } catch (fetchError) {
        if (fetchError instanceof DOMException && fetchError.name === 'AbortError') {
          return;
        }
        console.error('Error fetching category products:', fetchError);
        setError('পণ্যের তথ্য লোড করা যায়নি। আবার চেষ্টা করুন।');
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void loadProducts();
    return () => controller.abort();
  }, []);

  const categoryProducts = useMemo(
    () => products.filter((product) => product.category === slug),
    [products, slug],
  );

  const sortedProducts = useMemo(() => {
    if (sortOrder === 'price-low') {
      return [...categoryProducts].sort((a, b) => a.today - b.today);
    }
    if (sortOrder === 'price-high') {
      return [...categoryProducts].sort((a, b) => b.today - a.today);
    }
    return categoryProducts;
  }, [categoryProducts, sortOrder]);

  const category = categoryProducts[0];

  return (
    <main className="min-h-screen bg-[#f3f8f4] px-4 py-5 text-[#1d271f] sm:py-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="mb-4 inline-flex text-sm font-semibold text-[#65736a] transition hover:text-[#008744]"
        >
          ← সব পণ্যে ফিরে যান
        </Link>

        {loading ? (
          <div className="h-24 animate-pulse rounded-xl border border-[#e3ece5] bg-white" />
        ) : error ? (
          <div className="rounded-xl border border-[#f0d6d6] bg-white p-8 text-center text-[#b44242]">
            {error}
          </div>
        ) : category ? (
          <>
            <header className="flex items-center gap-3 rounded-xl border border-[#e3ece5] bg-white px-5 py-4 shadow-[0_3px_14px_rgba(30,83,48,0.04)]">
              <span className="text-3xl" aria-hidden="true">
                {category.categoryIcon}
              </span>
              <div>
                <h1 className="text-2xl font-extrabold">{category.categoryNameBn}</h1>
                <p className="text-xs text-[#819087]">
                  {categoryProducts.length}টি পণ্যের আজকের বাজারদর ও পরিবর্তন
                </p>
              </div>
            </header>

            <div className="mt-4 flex items-center justify-between gap-3">
              <p className="text-sm text-[#819087]">মোট {formatNumber(categoryProducts.length)}টি পণ্য পাওয়া গেছে</p>
              <label className="flex items-center gap-2 text-sm text-[#69766d]">
                সাজান
                <select
                  value={sortOrder}
                  onChange={(event) =>
                    setSortOrder(event.target.value as 'default' | 'price-low' | 'price-high')
                  }
                  className="rounded-lg border border-[#dce7df] bg-white px-2 py-1.5 text-sm outline-none focus:border-[#008744]"
                >
                  <option value="default">নির্বাচন</option>
                  <option value="price-low">কম দাম</option>
                  <option value="price-high">বেশি দাম</option>
                </select>
              </label>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {sortedProducts.map((product) => {
                const isUp = product.change.dir === 'up';
                const isDown = product.change.dir === 'down';
                const changeLabel =
                  product.change.dir === 'flat'
                    ? 'অপরিবর্তিত'
                    : `${isUp ? '+' : ''}${formatNumber(product.change.pct)}%`;

                return (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    className="rounded-xl border border-[#e3ece5] bg-white p-4 shadow-[0_3px_14px_rgba(30,83,48,0.04)] transition hover:-translate-y-0.5 hover:border-[#b9dcc4] hover:shadow-[0_8px_20px_rgba(30,83,48,0.08)] focus:outline-none focus:ring-2 focus:ring-[#008744]/40"
                    aria-label={`${product.nameBn} এর বিস্তারিত দেখুন`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f0f7f1] text-2xl">
                        {product.image || product.categoryIcon}
                      </span>
                      <div className="min-w-0">
                        <h2 className="truncate font-bold">{product.nameBn}</h2>
                        <p className="text-xs text-[#819087]">প্রতি {product.unit}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-end justify-between">
                      <div>
                        <p className="text-xs text-[#87938a]">আজকের দর</p>
                        <p className="text-xl font-extrabold">৳{formatNumber(product.today)}</p>
                      </div>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-bold ${
                          isUp
                            ? 'bg-[#fff0f0] text-[#e34f4f]'
                            : isDown
                              ? 'bg-[#eafaf0] text-[#16834d]'
                              : 'bg-[#f1f4f2] text-[#7a877e]'
                        }`}
                      >
                        {isUp ? '↗' : isDown ? '↘' : '—'} {changeLabel}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        ) : (
          <div className="rounded-xl border border-[#e3ece5] bg-white p-10 text-center text-[#69766d]">
            এই বিভাগে কোনো পণ্য পাওয়া যায়নি।
          </div>
        )}
      </div>
    </main>
  );
}