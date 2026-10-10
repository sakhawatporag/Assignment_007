 'use client';

import { useCallback, useEffect, useState } from 'react';

const PRODUCTS_API = 'https://api.api-store.workers.dev/api/bazardor/products';

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
  yesterday: number;
  change: PriceChange;
};

type ProductCardProps = {
  product: Product;
};

const formatNumber = (value: number) =>
  new Intl.NumberFormat('bn-BD', { maximumFractionDigits: 1 }).format(value);

function ProductCard({ product }: ProductCardProps) {
  const changeIsUp = product.change.dir === 'up';
  const changeIsDown = product.change.dir === 'down';
  const changeLabel =
    product.change.dir === 'flat'
      ? 'অপরিবর্তিত'
      : `${changeIsUp ? '+' : ''}${formatNumber(product.change.pct)}%`;

  return (
    <article className="group flex min-h-35.5 flex-col justify-between rounded-2xl border border-[#e6eee8] bg-white p-4 shadow-[0_4px_18px_rgba(30,83,48,0.05)] transition duration-200 hover:-translate-y-1 hover:border-[#b9dcc4] hover:shadow-[0_10px_26px_rgba(30,83,48,0.11)] sm:min-h-39 sm:p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f0f7f1] text-2xl transition-colors group-hover:bg-[#e1f2e5]">
          {product.image || product.categoryIcon}
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-[17px] font-bold leading-6 text-[#1d271f]">
            {product.nameBn}
          </h3>
          <p className="mt-0.5 text-sm text-[#819087]">
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
          className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold ${
            changeIsUp
              ? 'bg-[#fff0f0] text-[#e34f4f]'
              : changeIsDown
                ? 'bg-[#eafaf0] text-[#16834d]'
                : 'bg-[#f1f4f2] text-[#7a877e]'
          }`}
        >
          {changeIsUp ? '↗' : changeIsDown ? '↘' : '—'} {changeLabel}
        </span>
      </div>
    </article>
  );
}

function ProductSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 9 }).map((_, index) => (
        <div
          key={index}
          className="h-35.5 animate-pulse rounded-2xl border border-[#e6eee8] bg-white p-5 sm:h-39"
        >
          <div className="flex gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#e9f0eb]" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/5 rounded bg-[#e9f0eb]" />
              <div className="h-3 w-2/5 rounded bg-[#eef3ef]" />
            </div>
          </div>
          <div className="mt-7 h-5 w-1/3 rounded bg-[#e9f0eb]" />
        </div>
      ))}
    </div>
  );
}

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(PRODUCTS_API);
      if (!response.ok) {
        throw new Error(`Products request failed with status ${response.status}`);
      }

      const data: unknown = await response.json();
      const list = Array.isArray(data)
        ? data
        : data && typeof data === 'object' && 'products' in data && Array.isArray(data.products)
          ? data.products
          : [];

      setProducts(list as Product[]);
    } catch (fetchError) {
      console.error('Error fetching products:', fetchError);
      setError('পণ্যের তালিকা লোড করা যায়নি। আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadProducts();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadProducts]);

  return (
    <section id="products" className="mx-auto w-full max-w-6xl px-4 pb-16 pt-2 sm:px-6 md:px-8">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-sm font-semibold text-[#008744]">আজকের আপডেট</p>
          <h2 className="text-2xl font-extrabold tracking-tight text-[#1d271f] sm:text-3xl">
            পণ্যের বর্তমান দর
          </h2>
        </div>
        {!loading && !error && (
          <span className="hidden rounded-full bg-[#e8f5eb] px-3 py-1.5 text-sm font-semibold text-[#16834d] sm:inline-flex">
            {formatNumber(products.length)}টি পণ্য
          </span>
        )}
      </div>

      {loading ? (
        <ProductSkeleton />
      ) : error ? (
        <div className="rounded-2xl border border-[#f3d6d6] bg-white px-5 py-10 text-center shadow-sm">
          <p className="font-semibold text-[#b44242]">{error}</p>
          <button
            type="button"
            onClick={() => void loadProducts()}
            className="mt-4 rounded-xl bg-[#008744] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#00733a]"
          >
            আবার চেষ্টা করুন
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-2xl border border-[#e6eee8] bg-white px-5 py-10 text-center text-[#69766d]">
          কোনো পণ্যের তথ্য পাওয়া যায়নি।
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}