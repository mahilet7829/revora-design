const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ||
  'http://localhost:5000/api';

export interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  imageUrl?: string | null;
  sizes: string[];
  stock: number;
  createdAt?: string;
  updatedAt?: string;
  reactions?: {
    id: string;
    type: 'LOVE' | 'FIRE' | 'WOW' | 'MEH';
    count: number;
  }[];
  reviews?: {
    id: string;
    name: string;
    comment: string;
    rating: number;
    createdAt: string;
  }[];
}

export interface CreateOrderPayload {
  customerName: string;
  customerPhone: string;
  productId: string;
  size: string;
  quantity: number;
}

async function handleResponse(res: Response) {
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json.message || `API request failed (${res.status})`);
  }
  return json.data !== undefined ? json.data : json;
}

// --- PRODUCTS ---

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${API_URL}/products`, {
    cache: 'no-store',
  });
  return handleResponse(res);
}

export async function fetchProductById(id: string): Promise<Product> {
  const res = await fetch(`${API_URL}/products/${id}`, {
    cache: 'no-store',
  });
  return handleResponse(res);
}

export async function createProduct(data: {
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
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function updateProduct(
  id: string,
  data: Partial<{
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    sizes: string[];
    stock: number;
  }>
) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteProduct(id: string) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(res);
}

// --- REVIEWS & REACTIONS ---

export async function createReview(
  productId: string,
  data: { name: string; comment: string; rating: number }
) {
  const res = await fetch(`${API_URL}/products/${productId}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function toggleReaction(
  productId: string,
  type: 'LOVE' | 'FIRE' | 'WOW' | 'MEH'
) {
  const res = await fetch(`${API_URL}/products/${productId}/reactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type }),
  });
  return handleResponse(res);
}

// --- ORDERS ---

export async function createOrder(payload: CreateOrderPayload) {
  const res = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function fetchOrders() {
  const res = await fetch(`${API_URL}/orders`, {
    cache: 'no-store',
  });
  return handleResponse(res);
}

export async function updateOrderStatus(
  id: string,
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED'
) {
  const res = await fetch(`${API_URL}/orders/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  return handleResponse(res);
}