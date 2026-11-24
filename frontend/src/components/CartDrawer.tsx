'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { createOrder } from '@/services/api';
import { X, Trash2, Plus, Minus, MessageCircle, ShoppingBag } from 'lucide-react';

const RAW_WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '251935686396';
const WHATSAPP_NUMBER = RAW_WHATSAPP.replace(/\D/g, '');

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
  } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const buildWhatsAppUrl = (savedOrderRefs?: string) => {
    const itemLines = items.map(
      (item, idx) =>
        `${idx + 1}. *${item.name}* — Size: \`${item.size}\` × ${item.quantity} ($${(
          Number(item.price) * item.quantity
        ).toFixed(2)})`
    );

    const lines = [
      `*NEW RÉVORA DESIGN ORDER* 🖤`,
      ...(savedOrderRefs ? [`*Order Ref(s):* \`#${savedOrderRefs}\``] : []),
      ``,
      `*Customer:* ${customerName.trim()}`,
      `*Phone:* ${customerPhone.trim()}`,
      ...(customerAddress.trim() ? [`*Delivery:* ${customerAddress.trim()}`] : []),
      ``,
      `*Items:*`,
      ...itemLines,
      ``,
      `*Subtotal:* $${Number(subtotal).toFixed(2)}`,
      ...(notes.trim() ? [``, `*Notes:* ${notes.trim()}`] : []),
    ];

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (items.length === 0) {
      setErrorMsg('Your shopping bag is empty.');
      return;
    }

    setSubmitting(true);
    const createdIds: string[] = [];

    try {
      for (const item of items) {
        const res = await createOrder({
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          productId: item.productId,
          size: item.size,
          quantity: item.quantity,
        });
        const id = res?.id || res?.data?.id;
        if (id) createdIds.push(id.slice(0, 8));
      }
    } catch (err) {
      console.error('Order persistence notice:', err);
    } finally {
      setSubmitting(false);
    }

    const url = buildWhatsAppUrl(createdIds.length > 0 ? createdIds.join(', ') : undefined);
    clearCart();
    closeCart();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-xs">
      <div className="w-full max-w-md bg-revora-black border-l border-revora-charcoal h-full flex flex-col justify-between text-revora-white shadow-2xl">
        {/* Header */}
        <div className="px-6 py-5 border-b border-revora-charcoal flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag size={18} className="text-revora-burgundy" />
            <h2 className="font-serif text-lg font-bold tracking-wider uppercase">
              Your Bag ({items.reduce((sum, i) => sum + i.quantity, 0)})
            </h2>
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close bag"
            className="text-revora-gray hover:text-revora-white p-1 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Items & Checkout Form */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {items.length === 0 ? (
            <div className="py-20 text-center space-y-2">
              <p className="font-serif text-xl text-revora-white">Your bag is empty</p>
              <p className="text-xs text-revora-gray">
                Explore the collection to add Révora Design pieces.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.size}`}
                    className="flex gap-4 bg-revora-charcoal/25 border border-revora-charcoal rounded-lg p-3"
                  >
                    <div className="w-16 h-20 bg-revora-charcoal/60 rounded overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="font-serif text-xs text-revora-gray/50">RV</span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-serif text-sm font-bold truncate">
                          {item.name}
                        </h3>
                        <button
                          type="button"
                          onClick={() => removeItem(item.productId, item.size)}
                          aria-label={`Remove ${item.name}`}
                          className="text-revora-gray hover:text-red-400 transition-colors cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <p className="text-[11px] uppercase tracking-wider text-revora-gray mt-0.5">
                        Size: <span className="text-revora-white font-semibold">{item.size}</span>
                      </p>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-revora-charcoal rounded">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.size, -1)}
                            className="p-1.5 text-revora-gray hover:text-revora-white cursor-pointer"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="px-2.5 text-xs font-semibold">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.size, 1)}
                            className="p-1.5 text-revora-gray hover:text-revora-white cursor-pointer"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <span className="text-xs font-semibold text-revora-white">
                          ${(Number(item.price) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <form
                id="revora-checkout-form"
                onSubmit={handleCheckout}
                className="space-y-3 pt-2 border-t border-revora-charcoal"
              >
                <p className="text-[11px] uppercase tracking-[0.2em] text-revora-burgundy font-semibold">
                  Order & Delivery Details
                </p>

                <input
                  type="text"
                  required
                  placeholder="Full Name *"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-revora-charcoal/30 border border-revora-charcoal focus:border-revora-burgundy rounded px-3 py-2.5 text-xs text-revora-white outline-none"
                />

                <input
                  type="tel"
                  required
                  placeholder="Phone / WhatsApp Number *"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-revora-charcoal/30 border border-revora-charcoal focus:border-revora-burgundy rounded px-3 py-2.5 text-xs text-revora-white outline-none"
                />

                <input
                  type="text"
                  placeholder="Delivery Area / Address (e.g., Bole, Addis Ababa)"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full bg-revora-charcoal/30 border border-revora-charcoal focus:border-revora-burgundy rounded px-3 py-2.5 text-xs text-revora-white outline-none"
                />

                <input
                  type="text"
                  placeholder="Optional fit or delivery notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-revora-charcoal/30 border border-revora-charcoal focus:border-revora-burgundy rounded px-3 py-2.5 text-xs text-revora-white outline-none"
                />

                {errorMsg && <p className="text-xs text-red-400">{errorMsg}</p>}
              </form>
            </>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-revora-charcoal bg-revora-charcoal/15 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="uppercase tracking-widest text-xs text-revora-gray">
                Subtotal
              </span>
              <span className="text-lg font-bold text-revora-white">
                ${Number(subtotal).toFixed(2)}
              </span>
            </div>

            <button
              type="submit"
              form="revora-checkout-form"
              disabled={submitting}
              className="w-full bg-revora-burgundy hover:bg-revora-burgundy-dark disabled:opacity-50 text-revora-white py-3.5 px-6 rounded text-xs uppercase tracking-[0.2em] font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle size={16} />
              {submitting ? 'Saving Order...' : 'Confirm & Order on WhatsApp'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}