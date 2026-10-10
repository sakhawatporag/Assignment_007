'use client';


import { useEffect, useState } from 'react';
import Image from 'next/image';

type Product = {
  id?: string | number;
  _id?: string | number;
  image?: string;
  logo?: string;
  imageUrl?: string;
  logoUrl?: string;
  thumbnail?: string;
  thumbnailUrl?: string;
  photo?: string;
  icon?: string;
  name?: string;
  title?: string;
  nameBn?: string;
  price?: number | string;
  currentPrice?: number | string;
  today?: number | string;
  change?: number;
  priceChange?: number;
  categoryIcon?: string;
  isDrop?: boolean;
  isUp?: boolean;
};

type ApiProduct = Omit<Product, 'change'> & {
  change?: number | { pct?: number; dir?: string };
};

const getProductLogo = (product: Product) =>
  product.logoUrl ||
  product.logo ||
  product.imageUrl ||
  product.image ||
  product.thumbnailUrl ||
  product.thumbnail ||
  product.photo ||
  product.icon;

const fallbackProducts: Product[] = [
  { id: 'rice', name: 'চাল', price: 75, change: 2, isUp: true },
  { id: 'lentils', name: 'ডাল', price: 120, change: -1, isDrop: true },
  { id: 'oil', name: 'সয়াবিন তেল', price: 175, change: 0 },
  { id: 'potato', name: 'আলু', price: 35, change: -3, isDrop: true },
  { id: 'onion', name: 'পেঁয়াজ', price: 85, change: 4, isUp: true },
];

const isImageUrl = (value: string) =>
  value.startsWith('/') || value.startsWith('http://') || value.startsWith('https://');

const PriceTickerStrip = () => {
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://api.api-store.workers.dev/api/bazardor/products')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Products request failed with status ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.products || [];
        if (list.length > 0) {
          setProducts(
            list.map((item: ApiProduct) => {
              const apiChange = typeof item.change === 'object' ? item.change : undefined;
              const change = apiChange?.pct ?? item.change;

              return {
                ...item,
                name: item.name || item.nameBn,
                price: item.price ?? item.today,
                image: item.image || item.categoryIcon,
                change: typeof change === 'number' ? change : undefined,
                isDrop: item.isDrop ?? apiChange?.dir === 'down',
                isUp: item.isUp ?? apiChange?.dir === 'up',
              };
            }),
          );
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching market prices:', err);
        setLoading(false);
      });
  }, []);

  if (loading && products.length === 0) {
    return null;
  }

  // Repeat the sequence enough times to keep the strip filled on wide screens.
  const displayItems = [...products, ...products, ...products, ...products];

  return (
    <>
      <style>{`
        @keyframes ticker-scroll {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        .ticker-track {
          display: flex;
          width: max-content;
          animation: ticker-scroll 75s linear infinite;
          will-change: transform;
          backface-visibility: hidden;
        }
      `}</style>

      <div className="w-full bg-[#FFFFFF] text-black border-y border-gray-200 overflow-hidden py-3 select-none">
        <div className="ticker-track items-center">
          {displayItems.map((item, index) => {
            const isDrop = item.isDrop ?? ((item.change ?? 0) < 0 || (item.priceChange ?? 0) < 0);
            const isUp = item.isUp ?? ((item.change ?? 0) > 0 || (item.priceChange ?? 0) > 0);
            const logo = getProductLogo(item);

            return (
              <div
                key={`${item.id || item._id || index}-${index}`}
                className="flex shrink-0 items-center gap-2.5 mx-5 text-sm font-semibold whitespace-nowrap"
              >
                
                {logo && isImageUrl(logo) ? (
                  
                  <Image
                    src={logo}
                    alt={item.name || item.title || 'পণ্য'}
                    className="w-6 h-6 object-cover rounded-full border border-gray-200"
                    width={24}
                    height={24}
                    unoptimized
                  />
                ) : (
                  <span className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full text-xs">
                    {logo || '🛒'}
                  </span>
                )}

                {/* Name */}
                <span>{item.name || item.title}</span>

                {/* Price */}
                <span className="font-bold text-gray-900">
                  ৳{item.price || item.currentPrice}
                </span>

                {/* Price Drop (Green) / Up (Red) */}
                {isDrop ? (
                  <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                    <svg
                      className="w-3.5 h-3.5 mr-0.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                    {item.change ? `${Math.abs(item.change)}%` : 'Drop'}
                  </span>
                ) : isUp ? (
                  <span className="flex items-center text-xs font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                    <svg
                      className="w-3.5 h-3.5 mr-0.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                      />
                    </svg>
                    {item.change ? `+${item.change}%` : 'Up'}
                  </span>
                ) : null}

                {/* Divider bullet */}
                <span className="text-gray-300 ml-3">•</span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default PriceTickerStrip;