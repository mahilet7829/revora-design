'use client';

import { useEffect, useState } from 'react';
import { fetchProducts } from '@/services/api';
import { useCart } from '@/context/CartContext';
import { Heart, ShoppingBag } from 'lucide-react';

export default function ProductGrid() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const { addItem } = useCart();

  useEffect(() => {
    fetchProducts().then((data) => {
      setProducts(data);

      // Default each product to its first available size
      const initialSizes: Record<string, string> = {};
      data.forEach((product: any) => {
        if (Array.isArray(product.sizes) && product.sizes.length > 0) {
          initialSizes[product.id] = product.sizes[0];
        } else {
          initialSizes[product.id] = 'M';
        }
      });
      setSelectedSizes(initialSizes);
      setLoading(false);
    });
  }, []);

  const handleSelectSize = (productId: string, size: string) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [productId]: size,
    }));
  };

  const handleAddToCart = (product: any) => {
    const chosenSize =
      selectedSizes[product.id] ||
      (Array.isArray(product.sizes) && product.sizes[0]) ||
      'M';

    addItem({
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      size: chosenSize,
      imageUrl: product.imageUrl,
    });
  };

  return (
    <section id="shop" className="py-20 px-6 lg:px-12 bg-revora-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl lg:text-4xl font-bold text-revora-white tracking-tight mb-3">
            Signature Hoodies
          </h2>
          <p className="text-revora-gray text-xs tracking-[0.25em] uppercase">
            Exclusive designs crafted for your unique style.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-revora-gray py-12 tracking-widest text-xs">
            LOADING COLLECTION...
          </div>
        ) : products.length === 0 ? (
          <div className="text-center text-revora-gray py-12 bg-revora-charcoal/40 rounded-lg border border-revora-charcoal">
            <p className="mb-2 text-sm">No products published yet.</p>
            <p className="text-xs text-revora-gray/70">
              Visit <span className="text-revora-white underline">/admin</span> to add your first RÉVORA piece.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product) => {
              const availableSizes: string[] =
                Array.isArray(product.sizes) && product.sizes.length > 0
                  ? product.sizes
                  : ['S', 'M', 'L', 'XL'];

              const activeSize = selectedSizes[product.id] || availableSizes[0];

              return (
                <div
                  key={product.id}
                  className="group bg-revora-charcoal rounded-lg overflow-hidden border border-revora-charcoal hover:border-revora-burgundy transition-all duration-300 flex flex-col"
                >
                  {/* Product Image */}
                  <div className="relative h-96 w-full bg-revora-black/50 overflow-hidden flex items-center justify-center">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <span className="font-serif text-revora-gray/30 text-5xl font-bold tracking-widest">
                        RÉVORA
                      </span>
                    )}
                    <button
                      aria-label="Favorite piece"
                      className="absolute top-4 right-4 p-2 bg-revora-black/60 rounded-full text-revora-white hover:text-revora-burgundy transition-colors"
                    >
                      <Heart size={18} />
                    </button>
                  </div>

                  {/* Product Details */}
                  <div className="p-6 flex flex-col flex-grow justify-between">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-revora-white mb-1 group-hover:text-revora-burgundy transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-revora-gray text-xs mb-4 line-clamp-2">
                        {product.description ||
                          'Premium heavyweight luxury hoodie with custom print embroidery.'}
                      </p>

                      {/* Interactive Size Selector */}
                      <div className="mb-5">
                        <span className="block text-[10px] uppercase tracking-widest text-revora-gray mb-2">
                          Select Size
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {availableSizes.map((size) => {
                            const isSelected = activeSize === size;
                            return (
                              <button
                                key={size}
                                type="button"
                                onClick={() => handleSelectSize(product.id, size)}
                                className={`text-[11px] font-semibold px-2.5 py-1 rounded border transition-colors ${
                                  isSelected
                                    ? 'bg-revora-burgundy border-revora-burgundy text-revora-white'
                                    : 'bg-revora-black/60 text-revora-gray border-revora-black hover:border-revora-gray'
                                }`}
                              >
                                {size}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Price & Add to Cart */}
                    <div className="flex items-center justify-between pt-4 border-t border-revora-black/40">
                      <span className="text-revora-white font-semibold tracking-wider">
                        ${Number(product.price).toFixed(2)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAddToCart(product)}
                        className="flex items-center space-x-2 bg-revora-burgundy hover:bg-revora-burgundy-dark text-revora-white px-4 py-2 text-xs uppercase tracking-widest rounded transition-colors cursor-pointer"
                      >
                        <ShoppingBag size={14} />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}