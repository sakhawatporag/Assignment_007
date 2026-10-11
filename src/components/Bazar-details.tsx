'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Nav from '@/components/Nav';
import NavMini from '@/components/Nav_mini';

const PRODUCTS_API = 'https://openapi.programming-hero.com/api/bazardor/products';

type PriceChange = {
  dir: 'up' | 'down' | 'flat';
  pct: number;
};

type Market = {
  market: string;
  division: string;
  min: number;
  max: number;
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
  lastWeek: number;
  lastMonth: number;
  change: PriceChange;
  markets: Market[];
};

type BazarDetailsProps = {
  slug: string;
};

const formatNumber = (value: number) =>
  new Intl.NumberFormat('bn-BD', { maximumFractionDigits: 1 }).format(value);

function ProductDetailsSkeleton() {
  return (
    <main className="min-h-screen bg-[#f3f8f4] px-4 py-5 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <div className="h-5 w-32 animate-pulse rounded bg-[#e3ece5]" />
        <div className="mt-4 h-28 animate-pulse rounded-xl bg-white" />
        <div className="mt-4 h-72 animate-pulse rounded-xl bg-white" />
      </div>
    </main>
  );
}

export default function BazarDetails({ slug }: BazarDetailsProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const loadProduct = async () => {
      try {
        const response = await fetch(PRODUCTS_API, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Products request failed with status ${response.status}`);
        }

        const data: unknown = await response.json();
        const products =
          Array.isArray(data)
            ? data
            : data &&
                typeof data === 'object' &&
                'products' in data &&
                Array.isArray(data.products)
              ? data.products
              : [];
        const matchingProduct = products.find(
          (item): item is Product =>
            typeof item === 'object' &&
            item !== null &&
            'slug' in item &&
            item.slug === slug,
        );

        if (!matchingProduct) {
          throw new Error('Product not found');
        }
        setProduct(matchingProduct);
      } catch (fetchError) {
        if (fetchError instanceof DOMException && fetchError.name === 'AbortError') {
          return;
        }
        console.error('Error fetching product details:', fetchError);
        setError('পণ্যের বিস্তারিত তথ্য লোড করা যায়নি। আবার চেষ্টা করুন।');
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void loadProduct();
    return () => controller.abort();
  }, [slug]);

  if (loading) {
    return (
      <>
        <Nav />
        <NavMini />
        <ProductDetailsSkeleton />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Nav />
        <NavMini />
        <main className="min-h-screen bg-[#f3f8f4] px-4 py-8">
          <div className="mx-auto max-w-6xl rounded-xl border border-[#f0d6d6] bg-white p-10 text-center text-[#b44242]">
            <p>{error || 'পণ্যটি খুঁজে পাওয়া যায়নি।'}</p>
            <Link href="/" className="mt-4 inline-block font-bold text-[#008744]">
              সব পণ্যে ফিরে যান
            </Link>
          </div>
        </main>
      </>
    );
  }

  const isUp = product.change.dir === 'up';
  const isDown = product.change.dir === 'down';
  const trendLabel =
    product.change.dir === 'flat'
      ? 'অপরিবর্তিত'
      : `${isUp ? '+' : ''}${formatNumber(product.change.pct)}%`;

  return (
    <>
      <Nav />
      <NavMini />
      <main className="min-h-screen bg-[#f3f8f4] px-4 py-5 text-[#1d271f] sm:py-8">
        <div className="mx-auto max-w-6xl">
          <Link
            href={`/category/${product.category}`}
            className="mb-4 inline-flex items-center text-sm font-semibold text-[#65736a] transition hover:text-[#008744]"
          >
            ← {product.categoryNameBn} বিভাগে ফিরে যান
          </Link>

          <header className="flex items-center justify-between gap-4 rounded-xl border border-[#e3ece5] bg-white px-4 py-4 shadow-[0_3px_14px_rgba(30,83,48,0.04)] sm:px-5">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f0f7f1] text-2xl">
                {product.image || product.categoryIcon}
              </span>
              <div className="min-w-0">
                <h1 className="truncate text-xl font-extrabold sm:text-2xl">{product.nameBn}</h1>
                <p className="text-xs text-[#819087]">
                  {product.categoryNameBn} · প্রতি {product.unit}
                </p>
              </div>
            </div>
            <span
              className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-bold ${
                isUp
                  ? 'bg-[#fff0f0] text-[#e34f4f]'
                  : isDown
                    ? 'bg-[#eafaf0] text-[#16834d]'
                    : 'bg-[#f1f4f2] text-[#7a877e]'
              }`}
            >
              {isUp ? '↗' : isDown ? '↘' : '—'} {trendLabel}
            </span>
          </header>

          <section className="mt-4 rounded-xl border border-[#e3ece5] bg-white p-4 shadow-[0_3px_14px_rgba(30,83,48,0.04)] sm:p-5">
            <h2 className="mb-3 text-base font-bold">দামের সারসংক্ষেপ</h2>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {([
                ['আজ', product.today],
                ['গতকাল', product.yesterday],
                ['গত সপ্তাহ', product.lastWeek],
                ['গত মাস', product.lastMonth],
              ] as [string, number][]).map(([label, price]) => (
                <div key={label} className="rounded-lg border border-[#edf2ee] bg-[#fbfdfb] p-3">
                  <p className="text-xs text-[#819087]">{label}</p>
                  <p className="mt-1 text-lg font-extrabold">৳{formatNumber(price)}</p>
                  <p className="text-xs text-[#9aa69e]">প্রতি {product.unit}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-4 rounded-xl border border-[#e3ece5] bg-white p-4 shadow-[0_3px_14px_rgba(30,83,48,0.04)] sm:p-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-base font-bold">বাজারভেদে আজকের দর</h2>
              <span className="text-xs text-[#819087]">{formatNumber(product.markets.length)}টি বাজার</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-140 border-collapse text-sm">
                <thead>
                  <tr className="border-b border-[#dfe9e1] text-left text-xs text-[#819087]">
                    <th className="px-3 py-2 font-semibold">বাজার</th>
                    <th className="px-3 py-2 font-semibold">বিভাগ</th>
                    <th className="px-3 py-2 text-right font-semibold">সর্বনিম্ন</th>
                    <th className="px-3 py-2 text-right font-semibold">সর্বোচ্চ</th>
                  </tr>
                </thead>
                <tbody>
                  {product.markets.map((market) => (
                    <tr key={`${market.market}-${market.division}`} className="border-b border-[#edf2ee] last:border-0">
                      <td className="px-3 py-2.5 font-semibold">{market.market}</td>
                      <td className="px-3 py-2.5 text-[#69766d]">{market.division}</td>
                      <td className="px-3 py-2.5 text-right">৳{formatNumber(market.min)}</td>
                      <td className="px-3 py-2.5 text-right font-semibold text-[#16834d]">৳{formatNumber(market.max)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}