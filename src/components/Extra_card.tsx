'use client';

import { useEffect, useMemo, useState } from 'react';

const PRODUCTS_API = 'https://openapi.programming-hero.com/api/bazardor/products';

type PriceChange = {
  dir: 'up' | 'down' | 'flat';
  pct: number;
};

type Product = {
  id: number | string;
  nameBn: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image?: string;
  today: number;
  change: PriceChange;
};

const formatNumber = (value: number) =>
  new Intl.NumberFormat('bn-BD', { maximumFractionDigits: 1 }).format(value);

function ProductCard({ product, direction }: { product: Product; direction: 'up' | 'down' }) {
  const isUp = direction === 'up';

  return (
    <article className="rounded-2xl border border-[#e6eee8] bg-white p-4 shadow-[0_4px_18px_rgba(30,83,48,0.05)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_10px_26px_rgba(30,83,48,0.11)]">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f0f7f1] text-2xl">
          {product.image || product.categoryIcon}
        </div>
        <div className="min-w-0">
          <h3 className="truncate font-bold text-[#1d271f]">{product.nameBn}</h3>
          <p className="mt-0.5 text-xs text-[#819087]">
            {product.categoryNameBn} · প্রতি {product.unit}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between gap-2">
        <div>
          <p className="text-xs text-[#87938a]">আজকের দর</p>
          <p className="mt-0.5 text-xl font-extrabold tracking-tight text-[#17241a]">
            ৳{formatNumber(product.today)}
          </p>
        </div>
        <span
          className={`rounded-full px-2 py-1 text-xs font-bold ${
            isUp ? 'bg-[#fff0f0] text-[#e34f4f]' : 'bg-[#eafaf0] text-[#16834d]'
          }`}
        >
          {isUp ? '↗' : '↘'} {isUp ? '+' : '-'}
          {formatNumber(Math.abs(product.change.pct))}%
        </span>
      </div>
    </article>
  );
}

function ProductGroup({
  title,
  products,
  direction,
}: {
  title: string;
  products: Product[];
  direction: 'up' | 'down';
}) {
  return (
    <section>
      <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-[#536158]">
        <span className={direction === 'up' ? 'text-[#d94d4d]' : 'text-[#16834d]'} aria-hidden="true">
          {direction === 'up' ? '▲' : '▼'}
        </span>
        {title}
      </h2>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} direction={direction} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-[#e6eee8] bg-white px-5 py-8 text-center text-sm text-[#69766d]">
          কোনো পণ্যের তথ্য পাওয়া যায়নি।
        </div>
      )}
    </section>
  );
}

export default function ExtraCard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }
        console.error('Error fetching extra product cards:', error);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void loadProducts();
    return () => controller.abort();
  }, []);

  const increasedProducts = useMemo(
    () => products.filter((product) => product.change?.dir === 'up'),
    [products],
  );
  const decreasedProducts = useMemo(
    () => products.filter((product) => product.change?.dir === 'down'),
    [products],
  );

  if (loading) {
    return (
      <section className="mx-auto w-full max-w-6xl space-y-6 px-4 py-4 sm:px-6 md:px-8">
        <div className="h-5 w-32 animate-pulse rounded bg-[#e4eee6]" />
        <div className="h-32 animate-pulse rounded-2xl bg-white" />
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-6xl space-y-7 px-4 py-4 pb-10 sm:px-6 md:px-8">
      <ProductGroup title="আজ দাম বেড়েছে" products={increasedProducts} direction="up" />
      <ProductGroup title="আজ দাম কমেছে" products={decreasedProducts} direction="down" />
    </section>
  );
}