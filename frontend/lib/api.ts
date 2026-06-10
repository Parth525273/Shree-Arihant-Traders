// ─────────────────────────────────────────────────────────
// lib/api.ts — All API Call Functions
// Centralises every backend request in one place
// ─────────────────────────────────────────────────────────

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper: get token from localStorage
const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('sat_token');
};

// Helper: build headers (with auth if token exists)
const headers = (withAuth = false): HeadersInit => {
  const h: HeadersInit = { 'Content-Type': 'application/json' };
  if (withAuth) {
    const token = getToken();
    if (token) h['Authorization'] = `Bearer ${token}`;
  }
  return h;
};

// Generic fetch wrapper
async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data as T;
}

// ─── AUTH ─────────────────────────────────────────────────

export const authAPI = {
  register: (body: {
    name: string; email: string; password: string;
    mobile?: string; shopName?: string; address?: string;
  }) =>
    apiFetch('/auth/register', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(body),
    }),

  login: (email: string, password: string) =>
    apiFetch('/auth/login', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ email, password }),
    }),

  me: () =>
    apiFetch('/auth/me', {
      headers: headers(true),
    }),

  forgotPassword: (email: string) =>
    apiFetch('/auth/forgot-password', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ email }),
    }),

  resetPassword: (token: string, password: string, confirmPassword: string) =>
    apiFetch(`/auth/reset-password/${token}`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ password, confirmPassword }),
    }),
};

// ─── COMPANIES ────────────────────────────────────────────

export const companyAPI = {
  getAll: () =>
    apiFetch<{ companies: import('../types').Company[] }>('/companies'),

  getById: (id: string) =>
    apiFetch<{ company: import('../types').Company }>(`/companies/${id}`),
};

// ─── CATEGORIES ───────────────────────────────────────────

export const categoryAPI = {
  getByCompany: (companyId: string) =>
    apiFetch<{ categories: import('../types').Category[] }>(
      `/categories?company=${companyId}`
    ),
};

// ─── PRODUCTS ─────────────────────────────────────────────

export const productAPI = {
  getAll: (params?: {
    company?: string; category?: string; search?: string;
    page?: number; limit?: number;
  }) => {
    const query = new URLSearchParams(
      Object.entries(params || {})
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)])
    ).toString();
    return apiFetch<{
      products: import('../types').Product[];
      total: number;
      page: number;
      totalPages: number;
    }>(`/products${query ? `?${query}` : ''}`);
  },

  getById: (id: string) =>
    apiFetch<{ product: import('../types').Product }>(`/products/${id}`),
};

// ─── ORDERS ───────────────────────────────────────────────

export const orderAPI = {
  place: (body: {
    items: { product: string; quantity: number }[];
    paymentMode?: 'cod' | 'upi';
    notes?: string;
  }) =>
    apiFetch('/orders', {
      method: 'POST',
      headers: headers(true),
      body: JSON.stringify(body),
    }),

  myOrders: () =>
    apiFetch<{ orders: import('../types').Order[] }>('/orders/my', {
      headers: headers(true),
    }),

  getById: (id: string) =>
    apiFetch<{ order: import('../types').Order }>(`/orders/${id}`, {
      headers: headers(true),
    }),
};

// ─── ADMIN ────────────────────────────────────────────────

export const adminAPI = {
  getDashboard: () =>
    apiFetch('/admin/dashboard', { headers: headers(true) }),

  getAllOrders: (params?: { status?: string; paymentStatus?: string; page?: number }) => {
    const query = new URLSearchParams(
      Object.entries(params || {})
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)])
    ).toString();
    return apiFetch(`/admin/orders${query ? `?${query}` : ''}`, {
      headers: headers(true),
    });
  },

  updateOrderStatus: (id: string, status: string) =>
    apiFetch(`/admin/orders/${id}/status`, {
      method: 'PATCH',
      headers: headers(true),
      body: JSON.stringify({ status }),
    }),

  updatePaymentStatus: (id: string, paymentStatus: string) =>
    apiFetch(`/admin/orders/${id}/payment`, {
      method: 'PATCH',
      headers: headers(true),
      body: JSON.stringify({ paymentStatus }),
    }),

  getCustomers: () =>
    apiFetch('/admin/customers', { headers: headers(true) }),

  // Products CRUD
  createProduct: (formData: FormData) =>
    fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${getToken()}` },
      body: formData,
    }).then(async (r) => {
      const d = await r.json();
      if (!r.ok) throw new Error(d.message);
      return d;
    }),

  updateProduct: (id: string, formData: FormData) =>
    fetch(`${BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${getToken()}` },
      body: formData,
    }).then(async (r) => {
      const d = await r.json();
      if (!r.ok) throw new Error(d.message);
      return d;
    }),

  deleteProduct: (id: string) =>
    apiFetch(`/products/${id}`, {
      method: 'DELETE',
      headers: headers(true),
    }),

  // Companies CRUD
  createCompany: (formData: FormData) =>
    fetch(`${BASE_URL}/companies`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${getToken()}` },
      body: formData,
    }).then(async (r) => {
      const d = await r.json();
      if (!r.ok) throw new Error(d.message);
      return d;
    }),

  updateCompany: (id: string, formData: FormData) =>
    fetch(`${BASE_URL}/companies/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${getToken()}` },
      body: formData,
    }).then(async (r) => {
      const d = await r.json();
      if (!r.ok) throw new Error(d.message);
      return d;
    }),

  deleteCompany: (id: string) =>
    apiFetch(`/companies/${id}`, {
      method: 'DELETE',
      headers: headers(true),
    }),

  // Categories CRUD
  createCategory: (body: { name: string; company: string; description?: string }) =>
    apiFetch('/categories', {
      method: 'POST',
      headers: headers(true),
      body: JSON.stringify(body),
    }),

  updateCategory: (id: string, body: { name?: string; description?: string }) =>
    apiFetch(`/categories/${id}`, {
      method: 'PUT',
      headers: headers(true),
      body: JSON.stringify(body),
    }),

  deleteCategory: (id: string) =>
    apiFetch(`/categories/${id}`, {
      method: 'DELETE',
      headers: headers(true),
    }),

  updateStock: (id: string, stock: number) =>
    apiFetch(`/products/${id}/stock`, {
      method: 'PATCH',
      headers: headers(true),
      body: JSON.stringify({ stock }),
    }),
};
