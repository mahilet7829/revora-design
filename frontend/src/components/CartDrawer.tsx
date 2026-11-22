'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { createOrder } from '@/services/api';
import { X, Plus, Minus, Trash2, ShoppingBag, CheckCircle2, MessageCircle } from 'lucide-react';

const RAW_WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '251935686396';
const WHATSAPP_NUMBER = RAW_WHATSAPP.replace(/\D/g, '');

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, clearCart, subtotal } = useCart();
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState('');

  if (!isOpen) return null;

  const buildWhatsAppLink = () => {
    const itemLines = items
      .map(
        (item, idx) =>
          `${idx + 1}. *${item.name}* (Size: ${item.size}) x${item.quantity} — $${(
            item.price * item.quantity
          ).toFixed(2)}`
      )
      .join('\n');

    const message = [
      `*NEW RÉVORA ORDER* 🖤`,
      ``,
      `*Items:*`,
      itemLines,
      ``,
      `*Total:* $${subtotal.toFixed(2)}`,
      ``,
      `*Customer Details:*`,
      `• Name: ${customerName}`,
      `• Phone: ${customerPhone}`,
      `• Email: ${customerEmail}`,
      `• Delivery Address: ${shippingAddress}`,
    ].join('\n');

    return `https://wa.me/${251969774661}?text=${encodeURIComponent(message)}`;
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const generatedLink = buildWhatsAppLink();
    setWhatsappUrl(generatedLink);

    try {
      for (const item of items) {
        const validProductId = String(item.productId || item.id || '').trim();
        await createOrder({
          productId: validProductId,
          quantity: Number(item.quantity),
          size: item.size || 'M',
          customerName: customerName.trim(),
          customerEmail: customerEmail.trim(),
          customerPhone: customerPhone.trim(),
          shippingAddress: shippingAddress.trim(),
        });
      }
    } catch (err) {
      console.error('Background DB sync warning:', err);
    } finally {
      clearCart();
      setOrderComplete(true);
      setSubmitting(false);

      window.open(generatedLink, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-md bg-revora-black border-l border-revora-charcoal h-full flex flex-col justify-between p-6 overflow-y-auto">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-revora-charcoal">
            <div className="flex items-center gap-2">
              <ShoppingBag size={18} className="text-revora-burgundy" />
              <h2 className="font-serif text-lg font-bold tracking-wider uppercase">Your Bag</h2>
            </div>
            <button onClick={closeCart} className="text-revora-gray hover:text-revora-white">
              <X size={20} />
            </button>
          </div>

          {orderComplete ? (
            <div className="py-16 text-center space-y-5">
              <CheckCircle2 size={48} className="text-emerald-400 mx-auto" />
              <h3 className="font-serif text-2xl font-bold">Order Ready on WhatsApp</h3>
              <p className="text-revora-gray text-xs leading-relaxed max-w-xs mx-auto">
                Your order has been formatted for RÉVORA (+251 93 568 6396). If WhatsApp did not open automatically, click below.
              </p>

              <div className="flex flex-col gap-3 pt-2">
                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3.5 text-xs uppercase tracking-widest font-semibold rounded transition-colors"
                  >
                    <MessageCircle size={16} />
                    Send Order on WhatsApp
                  </a>
                )}

                <button
                  onClick={() => {
                    setOrderComplete(false);
                    closeCart();
                  }}
                  className="border border-revora-charcoal hover:border-revora-gray text-revora-gray hover:text-revora-white px-6 py-3 text-xs uppercase tracking-widest rounded transition-colors"
                >
                  Continue Exploring
                </button>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="py-20 text-center text-revora-gray text-sm">
              Your bag is currently empty.
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="divide-y divide-revora-charcoal my-4">
                {items.map((item) => (
                  <div key={`${item.productId || item.id}-${item.size}`} className="py-4 flex gap-4">
                    <div className="w-16 h-20 bg-revora-charcoal rounded overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-serif text-xs text-revora-gray/40">R</span>
                      )}
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-sm text-revora-white">{item.name}</h4>
                        <button
                          onClick={() => removeItem(item.productId || item.id, item.size)}
                          className="text-revora-gray hover:text-red-400"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <p className="text-[11px] text-revora-gray uppercase tracking-wider mt-0.5">
                        Size: {item.size}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-revora-charcoal rounded">
                          <button
                            onClick={() => updateQuantity(item.productId || item.id, item.size, -1)}
                            className="p-1.5 text-revora-gray hover:text-revora-white"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="px-2.5 text-xs font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId || item.id, item.size, 1)}
                            className="p-1.5 text-revora-gray hover:text-revora-white"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <span className="text-sm font-semibold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Form */}
              <form onSubmit={handleCheckout} className="space-y-3 pt-4 border-t border-revora-charcoal">
                <h3 className="text-xs uppercase tracking-widest text-revora-gray font-semibold">
                  Delivery Details
                </h3>
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-revora-charcoal/40 border border-revora-charcoal focus:border-revora-burgundy rounded px-3 py-2.5 text-xs text-revora-white outline-none"
                />
                <input
                  type="tel"
                  required
                  placeholder="Phone Number (e.g. +2519...)"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-revora-charcoal/40 border border-revora-charcoal focus:border-revora-burgundy rounded px-3 py-2.5 text-xs text-revora-white outline-none"
                />
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full bg-revora-charcoal/40 border border-revora-charcoal focus:border-revora-burgundy rounded px-3 py-2.5 text-xs text-revora-white outline-none"
                />
                <textarea
                  rows={2}
                  required
                  placeholder="Delivery Address / Location"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full bg-revora-charcoal/40 border border-revora-charcoal focus:border-revora-burgundy rounded px-3 py-2.5 text-xs text-revora-white outline-none"
                />

                <div className="pt-3 flex items-center justify-between text-sm font-bold">
                  <span className="uppercase tracking-wider text-revora-gray text-xs">Total</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-revora-burgundy hover:bg-revora-burgundy-dark disabled:opacity-50 text-revora-white py-3.5 rounded text-xs uppercase tracking-[0.2em] font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle size={16} />
                  {submitting ? 'Preparing Order...' : 'Order via WhatsApp'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}