'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import SizeGuideModal from '@/components/SizeGuideModal';
import { useCart } from '@/context/CartContext';
import {
  fetchProductById,
  fetchProducts,
  fetchReviews,
  createReview,
  toggleReaction,
} from '@/services/api';
import {
  ArrowLeft,
  Heart,
  ShoppingBag,
  Star,
  Check,
  ShieldCheck,
  Truck,
  MessageCircle,
  Ruler,
  ArrowUpRight,
} from 'lucide-react';

const RAW_WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '251935686396';
const WHATSAPP_NUMBER = RAW_WHATSAPP.replace(/\D/g, '');

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  images?: string[];
  sizes?: string[];
  category?: string;
  inStock?: boolean;
  _count?: {
    reactions?: number;
    reviews?: number;
  };
}

interface Review {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  createdAt?: string;
}

const DEFAULT_SIZES = ['S', 'M', 'L', 'XL'];

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);

  const { addItem, openCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImage, setActiveImage] = useState<string>('');
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // Reactions state
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // Review form state
  const [authorName, setAuthorName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    if (!productId) return;

    async function loadProductData() {
      setLoading(true);
      const [prodData, revData, allProducts] = await Promise.all([
        fetchProductById(productId),
        fetchReviews(productId),
        fetchProducts(),
      ]);

      if (prodData) {
        setProduct(prodData);
        const availableSizes =
          Array.isArray(prodData.sizes) && prodData.sizes.length > 0
            ? prodData.sizes
            : DEFAULT_SIZES;
        setSelectedSize(availableSizes[0]);
        setActiveImage(prodData.imageUrl || prodData.images?.[0] || '');
        setLikeCount(prodData._count?.reactions || 0);

        if (Array.isArray(allProducts)) {
          const others = allProducts.filter((item: Product) => item.id !== prodData.id);
          const sameCategory = others.filter(
            (item: Product) =>
              item.category &&
              prodData.category &&
              item.category.toLowerCase() === prodData.category.toLowerCase()
          );
          const remaining = others.filter(
            (item: Product) => !sameCategory.some((sc: Product) => sc.id === item.id)
          );
          setRelatedProducts([...sameCategory, ...remaining].slice(0, 3));
        }
      }

      setReviews(revData || []);
      setLoading(false);
    }

    loadProductData();
  }, [productId]);

  const handleAddToBag = () => {
    if (!product) return;

    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      size: selectedSize,
      quantity,
      imageUrl: activeImage || product.imageUrl || '',
    });

    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1800);
    openCart();
  };

  const handleDirectWhatsAppOrder = () => {
    if (!product) return;

    const unitPrice = Number(product.price);
    const total = (unitPrice * quantity).toFixed(2);
    const productLink = typeof window !== 'undefined' ? window.location.href : '';

    const message = [
      `*NEW RÉVORA DIRECT ORDER* 🖤`,
      ``,
      `*Piece:* ${product.name}`,
      `*Size:* ${selectedSize}`,
      `*Quantity:* ${quantity}`,
      `*Unit Price:* $${unitPrice.toFixed(2)}`,
      `*Total:* $${total}`,
      ...(productLink ? [``, `*Link:* ${productLink}`] : []),
      ``,
      `Please confirm availability and delivery details.`,
    ].join('\n');

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleLike = async () => {
    if (!product) return;
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikeCount((prev) => (nextLiked ? prev + 1 : Math.max(0, prev - 1)));

    try {
      await toggleReaction(product.id, 'LIKE');
    } catch {
      // Keep optimistic UI state if backend is unreachable
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    setSubmittingReview(true);
    setReviewError('');

    try {
      const created = await createReview({
        productId: product.id,
        authorName: authorName.trim(),
        rating,
        comment: comment.trim(),
      });

      setReviews((prev) => [
        created || {
          id: Date.now().toString(),
          authorName,
          rating,
          comment,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
      setAuthorName('');
      setRating(5);
      setComment('');
    } catch (err: any) {
      setReviewError(err.message || 'Could not post review right now.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-revora-black text-revora-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-[4/5] bg-revora-charcoal/50 rounded-lg" />
          <div className="space-y-6 py-4">
            <div className="h-4 w-24 bg-revora-charcoal rounded" />
            <div className="h-10 w-3/4 bg-revora-charcoal rounded" />
            <div className="h-6 w-28 bg-revora-charcoal rounded" />
            <div className="h-24 w-full bg-revora-charcoal rounded" />
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-revora-black text-revora-white">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-32 text-center space-y-6">
          <p className="text-xs uppercase tracking-[0.25em] text-revora-burgundy font-semibold">
            404 — Piece Unavailable
          </p>
          <h1 className="font-serif text-3xl font-bold">Product Not Found</h1>
          <p className="text-sm text-revora-gray max-w-md mx-auto">
            This garment may be part of an archived drop or the database server is currently offline.
          </p>
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 bg-revora-burgundy hover:bg-revora-burgundy-dark text-revora-white px-6 py-3 rounded text-xs uppercase tracking-widest font-semibold transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} />
            Back to Collection
          </button>
        </div>
      </main>
    );
  }

  const sizes =
    Array.isArray(product.sizes) && product.sizes.length > 0 ? product.sizes : DEFAULT_SIZES;
  const gallery =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : product.imageUrl
      ? [product.imageUrl]
      : [];

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + Number(r.rating || 5), 0) / reviews.length).toFixed(1)
      : null;

  const totalPrice = (Number(product.price) * quantity).toFixed(2);

  return (
    <main className="min-h-screen bg-revora-black text-revora-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-28 pb-20">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-revora-gray hover:text-revora-white transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Collection
          </Link>
        </div>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: Product Visuals */}
          <div className="lg:col-span-7 space-y-4">
            <div className="aspect-[4/5] w-full bg-revora-charcoal/40 border border-revora-charcoal rounded-lg overflow-hidden flex items-center justify-center relative">
              {activeImage ? (
                <img
                  src={activeImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center space-y-2">
                  <span className="font-serif text-4xl tracking-widest text-revora-gray/30">
                    RÉVORA
                  </span>
                  <p className="text-[11px] uppercase tracking-widest text-revora-gray/50">
                    Atelier Archive
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={handleLike}
                aria-label="Like product"
                className="absolute top-4 right-4 bg-revora-black/80 backdrop-blur-md border border-revora-charcoal hover:border-revora-burgundy px-3.5 py-2 rounded-full flex items-center gap-1.5 text-xs transition-colors cursor-pointer"
              >
                <Heart
                  size={15}
                  className={liked ? 'fill-revora-burgundy text-revora-burgundy' : 'text-revora-white'}
                />
                <span>{likeCount}</span>
              </button>
            </div>

            {/* Thumbnail Strip */}
            {gallery.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    className={`w-20 h-24 rounded border overflow-hidden flex-shrink-0 transition-all cursor-pointer ${
                      activeImage === img
                        ? 'border-revora-burgundy ring-1 ring-revora-burgundy'
                        : 'border-revora-charcoal opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} view ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Details & Purchase Controls */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-28">
            <div className="space-y-3 border-b border-revora-charcoal pb-6">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-[0.25em] text-revora-burgundy font-semibold">
                  {product.category || 'Luxury Streetwear'}
                </span>
                {averageRating && (
                  <div className="flex items-center gap-1 text-xs text-revora-gray">
                    <Star size={13} className="fill-amber-400 text-amber-400" />
                    <span className="text-revora-white font-semibold">{averageRating}</span>
                    <span>({reviews.length})</span>
                  </div>
                )}
              </div>

              <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-wide">
                {product.name}
              </h1>

              <p className="text-2xl font-semibold text-revora-white">
                ${Number(product.price).toFixed(2)}
              </p>
            </div>

            {/* Description */}
            <p className="text-sm text-revora-gray leading-relaxed">
              {product.description ||
                'Heavyweight tailored streetwear crafted for structured drape, refined finish, and everyday durability.'}
            </p>

            {/* Size Selector + Size Guide Trigger */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs uppercase tracking-widest">
                <span className="text-revora-gray font-semibold">
                  Select Size: <span className="text-revora-white ml-1">{selectedSize}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="inline-flex items-center gap-1.5 text-[11px] text-revora-burgundy hover:text-revora-white underline underline-offset-4 transition-colors cursor-pointer"
                >
                  <Ruler size={13} />
                  Size Guide
                </button>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 text-xs font-semibold uppercase tracking-wider rounded border transition-colors cursor-pointer ${
                      selectedSize === size
                        ? 'bg-revora-burgundy border-revora-burgundy text-revora-white'
                        : 'bg-revora-charcoal/30 border-revora-charcoal text-revora-gray hover:border-revora-gray hover:text-revora-white'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity, Add to Bag & Direct WhatsApp Buy */}
            <div className="space-y-3 pt-2">
              <div className="flex gap-3">
                <div className="flex items-center border border-revora-charcoal rounded px-2">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-3 text-revora-gray hover:text-revora-white text-sm cursor-pointer"
                  >
                    −
                  </button>
                  <span className="px-3 text-xs font-semibold">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3 py-3 text-revora-gray hover:text-revora-white text-sm cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToBag}
                  className="flex-grow bg-revora-burgundy hover:bg-revora-burgundy-dark text-revora-white py-3.5 px-6 rounded text-xs uppercase tracking-[0.2em] font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  {addedFeedback ? (
                    <>
                      <Check size={16} />
                      Added to Bag
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={16} />
                      Add to Bag — ${totalPrice}
                    </>
                  )}
                </button>
              </div>

              <button
                type="button"
                onClick={handleDirectWhatsAppOrder}
                className="w-full bg-emerald-600/15 hover:bg-emerald-600 border border-emerald-600/60 hover:border-emerald-500 text-emerald-400 hover:text-white py-3.5 px-6 rounded text-xs uppercase tracking-[0.2em] font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle size={16} />
                Order Now via WhatsApp — ${totalPrice}
              </button>
            </div>

            {/* Brand Guarantees */}
            <div className="border-t border-revora-charcoal pt-6 space-y-3 text-xs text-revora-gray">
              <div className="flex items-center gap-3">
                <MessageCircle size={15} className="text-revora-burgundy flex-shrink-0" />
                <span>Direct WhatsApp concierge confirmation (+251 93 568 6396)</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck size={15} className="text-revora-burgundy flex-shrink-0" />
                <span>Authentic Révora Design garment guarantee</span>
              </div>
              <div className="flex items-center gap-3">
                <Truck size={15} className="text-revora-burgundy flex-shrink-0" />
                <span>Express local & international dispatch</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="mt-24 pt-16 border-t border-revora-charcoal grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Review Form */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <h2 className="font-serif text-2xl font-bold">Client Reviews</h2>
              <p className="text-xs text-revora-gray mt-1">
                Share your fit and fabric experience with this piece.
              </p>
            </div>

            <form
              onSubmit={handleReviewSubmit}
              className="bg-revora-charcoal/25 border border-revora-charcoal rounded-lg p-6 space-y-4"
            >
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-revora-gray mb-1.5">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter your name"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full bg-revora-black border border-revora-charcoal focus:border-revora-burgundy rounded px-3 py-2.5 text-xs text-revora-white outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-widest text-revora-gray mb-1.5">
                  Rating
                </label>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 cursor-pointer"
                    >
                      <Star
                        size={18}
                        className={
                          star <= rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-revora-charcoal'
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-widest text-revora-gray mb-1.5">
                  Comment
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="How is the sizing, weight, and finish?"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-revora-black border border-revora-charcoal focus:border-revora-burgundy rounded px-3 py-2.5 text-xs text-revora-white outline-none"
                />
              </div>

              {reviewError && <p className="text-xs text-red-400">{reviewError}</p>}

              <button
                type="submit"
                disabled={submittingReview}
                className="w-full bg-revora-burgundy hover:bg-revora-burgundy-dark disabled:opacity-50 text-revora-white py-3 rounded text-xs uppercase tracking-widest font-semibold transition-colors cursor-pointer"
              >
                {submittingReview ? 'Submitting...' : 'Post Review'}
              </button>
            </form>
          </div>

          {/* Review List */}
          <div className="lg:col-span-7 space-y-4">
            {reviews.length === 0 ? (
              <div className="border border-revora-charcoal rounded-lg p-12 text-center text-revora-gray text-sm">
                No reviews yet. Be the first to review {product.name}.
              </div>
            ) : (
              reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="border border-revora-charcoal bg-revora-charcoal/15 rounded-lg p-5 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-revora-white">
                      {rev.authorName}
                    </span>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={
                            i < rev.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-revora-charcoal'
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-revora-gray leading-relaxed">{rev.comment}</p>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Related Products ("Complete the Look") Section */}
        {relatedProducts.length > 0 && (
          <section className="mt-24 pt-16 border-t border-revora-charcoal space-y-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.25em] text-revora-burgundy font-semibold">
                  Curated Pairing
                </p>
                <h2 className="font-serif text-2xl md:text-3xl font-bold mt-1">
                  Complete the Look
                </h2>
              </div>
              <Link
                href="/"
                className="text-xs uppercase tracking-widest text-revora-gray hover:text-revora-white transition-colors"
              >
                View All Pieces
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map((item) => (
                <Link
                  key={item.id}
                  href={`/products/${item.id}`}
                  className="group bg-revora-charcoal/20 border border-revora-charcoal hover:border-revora-burgundy/60 rounded-lg overflow-hidden transition-all duration-300 flex flex-col"
                >
                  <div className="aspect-[4/5] bg-revora-charcoal/40 overflow-hidden flex items-center justify-center relative">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <span className="font-serif text-2xl tracking-widest text-revora-gray/30">
                        RÉVORA
                      </span>
                    )}
                    <span className="absolute top-3 right-3 bg-revora-black/80 backdrop-blur-sm border border-revora-charcoal p-2 rounded-full text-revora-gray group-hover:text-revora-white group-hover:border-revora-burgundy transition-colors">
                      <ArrowUpRight size={14} />
                    </span>
                  </div>

                  <div className="p-5 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-revora-burgundy font-semibold">
                        {item.category || 'Collection'}
                      </p>
                      <h3 className="font-serif text-lg font-bold text-revora-white group-hover:text-revora-burgundy transition-colors mt-0.5">
                        {item.name}
                      </h3>
                    </div>
                    <span className="text-sm font-semibold text-revora-white">
                      ${Number(item.price).toFixed(2)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Interactive Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        defaultCategory={product.category}
      />
    </main>
  );
}