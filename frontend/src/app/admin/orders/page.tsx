'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { fetchOrders, updateOrderStatus } from '@/services/api';
import { Package, MessageCircle, Clock, CheckCircle2, Truck, Check } from 'lucide-react';

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '251911234567';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      const data = await fetchOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      loadOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const openCustomerWhatsApp = (order: any) => {
    const text = `Hi ${order.customerName}, regarding your RÉVORA order (${order.id.slice(0, 6)})...`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
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
              Customer Orders & Fulfillment
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/admin"
              className="text-xs text-revora-gray hover:text-revora-white uppercase tracking-widest transition-colors"
            >
              ← Product Inventory
            </a>
            <span className="text-revora-gray text-xs uppercase tracking-widest bg-revora-charcoal px-3 py-1.5 rounded border border-revora-charcoal">
              {orders.length} Total Orders
            </span>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-revora-gray py-20 tracking-widest text-xs">
            LOADING ORDERS...
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-revora-charcoal/30 rounded-xl border border-revora-charcoal space-y-3">
            <Package size={36} className="text-revora-gray mx-auto opacity-50" />
            <p className="text-sm text-revora-white">No customer orders recorded yet.</p>
            <p className="text-xs text-revora-gray max-w-sm mx-auto">
              Orders placed through the store checkout drawer automatically sync here while routing to WhatsApp.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const status = order.status || 'PENDING';
              return (
                <div
                  key={order.id}
                  className="bg-revora-charcoal/40 border border-revora-charcoal rounded-xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  {/* Customer & Item Info */}
                  <div className="space-y-2 flex-grow">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-revora-gray">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                      <span
                        className={`text-[10px] px-2.5 py-0.5 rounded uppercase tracking-wider font-semibold border ${
                          status === 'DELIVERED'
                            ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300'
                            : status === 'SHIPPED'
                            ? 'bg-sky-950/60 border-sky-700 text-sky-300'
                            : status === 'PROCESSING'
                            ? 'bg-amber-950/60 border-amber-700 text-amber-300'
                            : 'bg-revora-black border-revora-charcoal text-revora-gray'
                        }`}
                      >
                        {status}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-serif text-lg font-bold text-revora-white">
                        {order.customerName}
                      </h3>
                      <p className="text-xs text-revora-gray">{order.customerEmail}</p>
                      <p className="text-xs text-revora-gray/80 mt-1">
                        📍 <span className="text-revora-white">{order.shippingAddress}</span>
                      </p>
                    </div>

                    <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-revora-gray border-t border-revora-charcoal/60">
                      <span>
                        Item: <strong className="text-revora-white">{order.product?.name || 'Custom Hoodie'}</strong>
                      </span>
                      <span>
                        Size: <strong className="text-revora-white">{order.size || 'M'}</strong>
                      </span>
                      <span>
                        Qty: <strong className="text-revora-white">{order.quantity || 1}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Actions: Status Dropdown & WhatsApp Chat */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-revora-charcoal">
                    <button
                      onClick={() => openCustomerWhatsApp(order)}
                      className="inline-flex items-center justify-center gap-2 bg-emerald-950/50 hover:bg-emerald-900/50 border border-emerald-800 text-emerald-300 px-4 py-2.5 rounded text-xs uppercase tracking-wider transition-colors"
                    >
                      <MessageCircle size={14} />
                      WhatsApp Client
                    </button>

                    <div className="flex items-center gap-2">
                      <select
                        value={status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="bg-revora-black border border-revora-charcoal text-revora-white text-xs rounded px-3 py-2.5 outline-none focus:border-revora-burgundy"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                      </select>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}