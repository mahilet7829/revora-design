'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Check } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  imageUrl?: string | null;
  sizes?: string[];
  category?: string;
}

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  const { addItem, openCart } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();

    const defaultSize =
      Array.isArray(product.sizes) && product.sizes.length > 0 ? product.sizes[0] : 'M';

    addItem({
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      size: defaultSize,
      imageUrl: product.imageUrl || '',
    });

    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
    openCart();
  };

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-20 border border-revora-charcoal rounded-lg">
        <p className="text-revora-gray text-sm">No pieces available in this drop yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => {
        const isAdded = addedId === product.id;

        return (
          <div
            key={product.id}
            className="group relative bg-revora-charcoal/20 border border-revora-charcoal hover:border-revora-burgundy/60 rounded-lg overflow-hidden transition-all duration-300 flex flex-col"
          >
            {/* Image Container */}
            <div className="relative aspect-[4/5] bg-revora-charcoal/40 overflow-hidden flex items-center justify-center">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <span className="font-serif text-2xl tracking-widest text-revora-gray/30">
                  RÉVORA
                </span>
              )}

              {/* Quick-Add Button: z-10 keeps it clickable above the stretched card link */}
              <button
                type="button"
                onClick={(e) => handleQuickAdd(e, product)}
                className="relative z-10 opacity-0 group-hover:opacity-100 focus:opacity-100 absolute bottom-4 right-4 bg-revora-black/90 hover:bg-revora-burgundy border border-revora-charcoal hover:border-revora-burgundy text-revora-white px-4 py-2.5 rounded text-[11px] uppercase tracking-widest font-semibold transition-all flex items-center gap-2 cursor-pointer"
              >
                {isAdded ? (
                  <>
                    <Check size={14} className="text-emerald-400" />
                    Added
                  </>
                ) : (
                  <>
                    <ShoppingBag size={14} />
                    Quick Add
                  </>
                )}
              </button>
            </div>

            {/* Card Info with Stretched Link covering the whole card */}
            <div className="p-5 flex flex-col justify-between flex-grow space-y-2">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-revora-burgundy font-semibold">
                    {product.category || 'Collection'}
                  </p>
                  <h3 className="font-serif text-lg font-bold text-revora-white group-hover:text-revora-burgundy transition-colors mt-0.5">
                    <Link
                      href={`/products/${product.id}`}
                      className="after:absolute after:inset-0 focus:outline-none"
                    >
                      {product.name}
                    </Link>
                  </h3>
                </div>
                <span className="text-sm font-semibold text-revora-white">
                  ${Number(product.price).toFixed(2)}
                </span>
              </div>

              {product.description && (
                <p className="text-xs text-revora-gray line-clamp-2 leading-relaxed">
                  {product.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}