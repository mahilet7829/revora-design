'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { createProduct, fetchProducts, deleteProduct } from '@/services/api';
import { Upload, Plus, Trash2, Check, Image as ImageIcon } from 'lucide-react';

const AVAILABLE_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

export default function AdminPage() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['S', 'M', 'L', 'XL']);
  const [stock, setStock] = useState('25');

  const [products, setProducts] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadProducts = async () => {
    const data = await fetchProducts();
    setProducts(data);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  // Allows owner to pick a photo directly from their device
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMsg(null);

    try {
      await createProduct({
        name,
        price: parseFloat(price),
        description,
        imageUrl: imageUrl || undefined,
        sizes: selectedSizes,
        stock: parseInt(stock, 10) || 10,
      });

      setStatusMsg({ type: 'success', text: 'Product published to RÉVORA store!' });
      setName('');
      setPrice('');
      setDescription('');
      setImageUrl('');
      setSelectedSizes(['S', 'M', 'L', 'XL']);
      loadProducts();
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Error adding product. Check backend schema.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      loadProducts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="min-h-screen bg-revora-black text-revora-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="mb-10 border-b border-revora-charcoal pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-revora-burgundy font-semibold">
              Brand Studio
            </span>
            <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight mt-1">
              Product Management
            </h1>
          </div>
          <p className="text-revora-gray text-xs uppercase tracking-widest">
            {products.length} Active Pieces
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Add Product Form */}
          <div className="lg:col-span-7 bg-revora-charcoal/40 border border-revora-charcoal p-6 md:p-8 rounded-xl">
            <h2 className="font-serif text-xl font-bold mb-6">Add New Apparel Piece</h2>

            {statusMsg && (
              <div
                className={`mb-6 p-4 rounded text-xs tracking-wider uppercase border ${
                  statusMsg.type === 'success'
                    ? 'bg-emerald-950/50 border-emerald-700 text-emerald-300'
                    : 'bg-red-950/50 border-revora-burgundy text-red-300'
                }`}
              >
                {statusMsg.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Product Name & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs uppercase tracking-widest text-revora-gray mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Crimson Scorpion Heavyweight Hoodie"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-revora-black border border-revora-charcoal focus:border-revora-burgundy rounded px-4 py-3 text-sm text-revora-white outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-revora-gray mb-2">
                    Price (USD) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="89.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-revora-black border border-revora-charcoal focus:border-revora-burgundy rounded px-4 py-3 text-sm text-revora-white outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Photo Upload or URL */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-revora-gray mb-2">
                  Product Photo
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <label className="flex flex-col items-center justify-center h-32 border border-dashed border-revora-gray/40 hover:border-revora-burgundy rounded-lg cursor-pointer bg-revora-black/60 transition-colors p-4 text-center">
                    <Upload size={20} className="text-revora-burgundy mb-2" />
                    <span className="text-xs text-revora-white font-medium">Upload from Device</span>
                    <span className="text-[10px] text-revora-gray mt-1">PNG, JPG, WEBP</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Or paste image URL..."
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full bg-revora-black border border-revora-charcoal focus:border-revora-burgundy rounded px-3 py-2.5 text-xs text-revora-white outline-none"
                    />
                    {imageUrl ? (
                      <div className="relative h-20 w-full rounded overflow-hidden border border-revora-charcoal bg-revora-black">
                        <img
                          src={imageUrl}
                          alt="Preview"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-20 w-full rounded border border-revora-charcoal bg-revora-black/40 flex items-center justify-center text-revora-gray/40 text-xs gap-2">
                        <ImageIcon size={14} /> Preview
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Size Choices & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div className="sm:col-span-2">
                  <label className="block text-xs uppercase tracking-widest text-revora-gray mb-2">
                    Available Sizes
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {AVAILABLE_SIZES.map((size) => {
                      const active = selectedSizes.includes(size);
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => toggleSize(size)}
                          className={`px-4 py-2 rounded text-xs font-semibold tracking-wider border transition-all flex items-center gap-1.5 ${
                            active
                              ? 'bg-revora-burgundy border-revora-burgundy text-revora-white'
                              : 'bg-revora-black border-revora-charcoal text-revora-gray hover:border-revora-gray'
                          }`}
                        >
                          {active && <Check size={12} />}
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-revora-gray mb-2">
                    Initial Stock
                  </label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full bg-revora-black border border-revora-charcoal focus:border-revora-burgundy rounded px-4 py-2 text-sm text-revora-white outline-none"
                  />
                </div>
              </div>

              {/* Product Details / Description */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-revora-gray mb-2">
                  Garment Details & Fit Notes
                </label>
                <textarea
                  rows={4}
                  placeholder="480gsm French terry cotton, drop-shoulder boxy silhouette, puff-print crimson embroidery..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-revora-black border border-revora-charcoal focus:border-revora-burgundy rounded px-4 py-3 text-sm text-revora-white outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-revora-burgundy hover:bg-revora-burgundy-dark disabled:opacity-50 text-revora-white py-4 rounded text-xs uppercase tracking-[0.2em] font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                {submitting ? 'Publishing...' : 'Publish to Storefront'}
              </button>
            </form>
          </div>

          {/* Right Column: Live Inventory List */}
          <div className="lg:col-span-5 space-y-4">
            <h2 className="font-serif text-xl font-bold mb-4">Live Storefront Catalog</h2>

            {products.length === 0 ? (
              <div className="p-8 rounded-xl border border-revora-charcoal bg-revora-charcoal/20 text-center text-revora-gray text-sm">
                No products added yet. Use the studio form to publish your first piece.
              </div>
            ) : (
              <div className="space-y-3">
                {products.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 p-4 rounded-lg bg-revora-charcoal/50 border border-revora-charcoal"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-16 rounded bg-revora-black overflow-hidden flex-shrink-0 flex items-center justify-center border border-revora-charcoal">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="font-serif text-xs text-revora-gray/40">R</span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm text-revora-white">{item.name}</h3>
                        <p className="text-xs text-revora-burgundy font-medium mt-0.5">
                          ${Number(item.price).toFixed(2)}
                        </p>
                        {item.sizes && (
                          <p className="text-[10px] text-revora-gray uppercase tracking-wider mt-1">
                            Sizes: {Array.isArray(item.sizes) ? item.sizes.join(', ') : item.sizes}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
  <a
    href="/admin/orders"
    className="text-xs text-revora-burgundy font-semibold hover:underline uppercase tracking-widest"
  >
    View Customer Orders →
  </a>
  <span className="text-revora-gray text-xs uppercase tracking-widest">
    {products.length} Active Pieces
  </span>
</div>
                    </div>

                    <button
                      onClick={() => handleDelete(item.id)}
                      aria-label="Delete product"
                      className="p-2 text-revora-gray hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}