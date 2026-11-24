'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import SizeGuideModal from '@/components/SizeGuideModal';
import { useCart } from '@/context/CartContext';
import {
  Product,
  fetchProductById,
  fetchProducts,
  createReview,
  toggleReaction,
} from '@/services/api';
import {
  ArrowLeft,
  Ruler,
  ShoppingBag,
  Star,
  Flame,
  Heart,
  Sparkles,
  Meh,
} from 'lucide-react';

const REACTION_OPTIONS: {
  type: 'LOVE' | 'FIRE' | 'WOW' | 'MEH';
  label: string;
  Icon: typeof Heart;
}[] = [
  { type: 'LOVE', label: 'Love', Icon: Heart },
  { type: 'FIRE', label: 'Fire', Icon: Flame },
  { type: 'WOW', label: 'Iconic', Icon: Sparkles },
  { type: 'MEH', label: 'Subtle', Icon: Meh },
];

export default function ProductDetailPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : String(params?.id || '');

  const { addItem, openCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Review form state
  const [reviewerName, setReviewerName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reactingType, setReactingType] = useState<string | null>(null);

  const loadProductData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError('');
      const [current, all] = await Promise.all([
        fetchProductById(id),
        fetchProducts().catch(() => [] as Product[]),
      ]);
      setProduct(current);
      if (current?.sizes?.length && !selectedSize) {
        setSelectedSize(current.sizes[0]);
      }
      setRelatedProducts(all.filter((p) => p.id !== id).slice(0, 4));
    } catch (err: any) {
      setError(err?.message || 'Unable to load product.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProductData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleAddToBag = () => {
    if (!product) return;
    const chosenSize = selectedSize || product.sizes?.[0] || 'M';
    const count = Math.max(1, quantity);
    for (let i = 0; i < count; i++) {
      addItem({
        productId: product.id,
        name: product.name,
        price: Number(product.price),
        imageUrl: product.imageUrl || undefined,
        size: chosenSize,
      });
    }
    openCart();
  };

  const handleReaction = async (type: 'LOVE' | 'FIRE' | 'WOW' | 'MEH') => {
    if (!product || reactingType) return;
    try {
      setReactingType(type);
      await toggleReaction(product.id, type);
      const refreshed = await fetchProductById(product.id);
      setProduct(refreshed);
    } catch (err) {
      console.error('Reaction error:', err);
    } finally {
      setReactingType(null);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !reviewerName.trim() || !comment.trim()) return;
    try {
      setSubmittingReview(true);
      await createReview(product.id, {
        name: reviewerName.trim(),
        comment: comment.trim(),
        rating,
      });
      setReviewerName('');
      setComment('');
      setRating(5);
      const refreshed = await fetchProductById(product.id);
      setProduct(refreshed);
    } catch (err) {
      console.error('Review submit error:', err);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-revora-black text-revora-white flex items-center justify-center">
        <p className="text-xs uppercase tracking-[0.25em] text-revora-gray animate-pulse">
          Loading Piece...
        </p>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-revora-black text-revora-white flex flex-col items-center justify-center gap-4 px-6">
        <p className="font-serif text-2xl">Piece Not Found</p>
        <p className="text-xs text-revora-gray">{error || 'This item may no longer be available.'}</p>
        <Link
          href="/"
          className="mt-2 inline-flex items-center gap-2 border border-revora-charcoal px-5 py-2.5 text-xs uppercase tracking-widest hover:border-revora-burgundy transition-colors"
        >
          <ArrowLeft size={14} /> Back to Collection
        </Link>
      </main>
    );
  }

  const availableSizes = product.sizes?.length ? product.sizes : ['S', 'M', 'L', 'XL'];
  const reviews = product.reviews || [];
  const reactions = product.reactions || [];

  return (
    <main className="min-h-screen bg-revora-black text-revora-white pt-24 pb-20 px-6 md:px-12">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Back Link */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-revora-gray hover:text-revora-white transition-colors"
          >
            <ArrowLeft size={14} /> Collection
          </Link>
        </div>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Image */}
          <div className="aspect-[4/5] w-full bg-revora-charcoal/30 border border-revora-charcoal rounded-lg overflow-hidden flex items-center justify-center">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="font-serif text-3xl tracking-widest text-revora-gray/40">
                RÉVORA
              </span>
            )}
          </div>

          {/* Details & Purchase */}
          <div className="space-y-8">
            <div className="space-y-3 border-b border-revora-charcoal pb-6">
              <p className="text-[11px] uppercase tracking-[0.25em] text-revora-burgundy font-semibold">
                Révora Design Studio
              </p>
              <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-wide">
                {product.name}
              </h1>
              <p className="text-xl font-semibold text-revora-white">
                ${Number(product.price).toFixed(2)}
              </p>
            </div>

            {product.description && (
              <p className="text-sm leading-relaxed text-revora-gray">
                {product.description}
              </p>
            )}

            {/* Size Selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.2em] text-revora-gray">
                  Select Size
                </span>
                <button
                  type="button"
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-revora-burgundy hover:underline cursor-pointer"
                >
                  <Ruler size={14} /> Size Guide
                </button>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {availableSizes.map((sz) => {
                  const active = (selectedSize || availableSizes[0]) === sz;
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`min-w-[48px] px-4 py-2.5 text-xs font-semibold uppercase tracking-wider rounded border transition-colors cursor-pointer ${
                        active
                          ? 'bg-revora-burgundy border-revora-burgundy text-revora-white'
                          : 'bg-transparent border-revora-charcoal text-revora-gray hover:border-revora-white hover:text-revora-white'
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity & Add to Bag */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <div className="flex items-center justify-between border border-revora-charcoal rounded px-4 py-3 sm:w-32">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="text-revora-gray hover:text-revora-white text-sm font-bold cursor-pointer"
                >
                  −
                </button>
                <span className="text-xs font-semibold">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="text-revora-gray hover:text-revora-white text-sm font-bold cursor-pointer"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToBag}
                className="flex-1 bg-revora-burgundy hover:bg-revora-burgundy-dark text-revora-white py-3.5 px-6 rounded text-xs uppercase tracking-[0.2em] font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag size={16} />
                Add to Bag
              </button>
            </div>

            {/* Reactions */}
            <div className="pt-6 border-t border-revora-charcoal space-y-3">
              <p className="text-[11px] uppercase tracking-[0.2em] text-revora-gray">
                Community Pulse
              </p>
              <div className="flex flex-wrap gap-2.5">
                {REACTION_OPTIONS.map(({ type, label, Icon }) => {
                  const found = reactions.find((r) => r.type === type);
                  const count = found?.count ?? 0;
                  return (
                    <button
                      key={type}
                      type="button"
                      disabled={reactingType === type}
                      onClick={() => handleReaction(type)}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded border border-revora-charcoal bg-revora-charcoal/20 hover:border-revora-burgundy text-xs transition-colors cursor-pointer"
                    >
                      <Icon size={14} className="text-revora-burgundy" />
                      <span>{label}</span>
                      <span className="text-revora-gray font-semibold">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="pt-12 border-t border-revora-charcoal grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h2 className="font-serif text-2xl font-bold tracking-wide">
              Client Reviews ({reviews.length})
            </h2>

            {reviews.length === 0 ? (
              <p className="text-xs text-revora-gray">
                No reviews yet. Be the first to share your fit &amp; fabric impression.
              </p>
            ) : (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-lg border border-revora-charcoal bg-revora-charcoal/20 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider">
                        {rev.name}
                      </span>
                      <div className="flex items-center gap-1 text-revora-burgundy">
                        {Array.from({ length: rev.rating }).map((_, idx) => (
                          <Star key={idx} size={12} fill="currentColor" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-revora-gray leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={handleReviewSubmit}
            className="space-y-4 p-6 rounded-lg border border-revora-charcoal bg-revora-charcoal/15 h-fit"
          >
            <h3 className="font-serif text-lg font-bold">Leave a Review</h3>

            <input
              type="text"
              required
              placeholder="Your Name"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              className="w-full bg-revora-black border border-revora-charcoal focus:border-revora-burgundy rounded px-3.5 py-2.5 text-xs text-revora-white outline-none"
            />

            <div className="flex items-center gap-2">
              <span className="text-xs text-revora-gray">Rating:</span>
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setRating(num)}
                  className={`p-1 cursor-pointer ${
                    num <= rating ? 'text-revora-burgundy' : 'text-revora-gray/40'
                  }`}
                >
                  <Star size={16} fill="currentColor" />
                </button>
              ))}
            </div>

            <textarea
              required
              rows={3}
              placeholder="Share thoughts on silhouette, weight, or sizing..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-revora-black border border-revora-charcoal focus:border-revora-burgundy rounded px-3.5 py-2.5 text-xs text-revora-white outline-none"
            />

            <button
              type="submit"
              disabled={submittingReview}
              className="bg-revora-burgundy hover:bg-revora-burgundy-dark disabled:opacity-50 text-revora-white px-6 py-2.5 rounded text-xs uppercase tracking-[0.2em] font-semibold transition-colors cursor-pointer"
            >
              {submittingReview ? 'Submitting...' : 'Post Review'}
            </button>
          </form>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="pt-12 border-t border-revora-charcoal space-y-6">
            <h2 className="font-serif text-2xl font-bold tracking-wide">
              Complete the Look
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((item) => (
                <Link
                  key={item.id}
                  href={`/products/${item.id}`}
                  className="group space-y-2.5"
                >
                  <div className="aspect-[4/5] bg-revora-charcoal/30 border border-revora-charcoal group-hover:border-revora-burgundy rounded overflow-hidden flex items-center justify-center transition-colors">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <span className="font-serif text-sm text-revora-gray/40">RÉVORA</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-serif text-sm font-bold truncate group-hover:text-revora-burgundy transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs text-revora-gray">
                      ${Number(item.price).toFixed(2)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />
    </main>
  );
}