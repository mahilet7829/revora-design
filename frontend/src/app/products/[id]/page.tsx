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

export default function ProductDetailPage() {
return (
<Suspense
fallback={
<main className="min-h-screen bg-revora-black text-revora-white flex items-center justify-center">
<p className="text-xs uppercase tracking-[0.25em] text-revora-gray animate-pulse">
Loading Piece...
</p>
</main>
}
>
<ProductDetailContent />
</Suspense>
);
}