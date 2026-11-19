const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// --- PRODUCTS ---

export async function fetchProducts() {
  try {
    const res = await fetch(`${API_URL}/products`, { cache: 'no-store' });
    const json = await res.json().catch(() => null);
    if (!res.ok) {
      console.error(`Backend returned ${res.status}:`, json);
      return [];
    }
    return Array.isArray(json) ? json : json?.data || [];
  } catch (error) {
    console.error('Network error fetching products:', error);
    return [];
  }
}

export async function createProduct(productData: {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  sizes?: string[];
  stock?: number;
}) {
  const res = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json.message || 'Failed to create product');
  }
  return json.data || json;
}

export async function deleteProduct(productId: string) {
  const res = await fetch(`${API_URL}/products/${productId}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error('Failed to delete product');
  }
  return true;
}

// --- ORDERS ---

export async function createOrder(orderData: {
  productId: string;
  quantity: number;
  size: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
}) {
  const res = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json.message || 'Failed to place order');
  }
  return json.data || json;
}

export async function fetchOrders() {
  try {
    const res = await fetch(`${API_URL}/orders`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch orders');
    const json = await res.json();
    return Array.isArray(json) ? json : json?.data || [];
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  const res = await fetch(`${API_URL}/orders/${orderId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update order status');
  return true;
}