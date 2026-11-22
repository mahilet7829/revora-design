const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function fetchProducts() {
  try {
    const res = await fetch(`${API_URL}/products`, { cache: 'no-store' });
    const json = await res.json().catch(() => null);
    if (!res.ok) {
      console.error(`Backend returned ${res.status}:`, json);
      return [];
    }
    return Array.isArray(json) ? json : json?.data || [];
  } catch (err) {
    console.error('Failed to fetch products:', err);
    return [];
  }
}

export async function createProduct(payload: any) {
  const res = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json.message || 'Failed to create product');
  }
  return json.data || json;
}

export async function deleteProduct(id: string) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE',
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json.message || 'Failed to delete product');
  }
  return json.data || json;
}

export async function createOrder(payload: {
  productId: string;
  quantity: number;
  size: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  customerPhone?: string;
  totalAmount?: number;
  items?: any[];
}) {
  const res = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error('Order validation details:', json);
    throw new Error(json.message || 'Failed to place order');
  }
  return json.data || json;
}
