// ─────────────────────────────────────────────────────────
// types/index.ts — Shared TypeScript Interfaces
// ─────────────────────────────────────────────────────────

export interface PricingTier {
  minQty: number;
  price: number;
}

export interface Company {
  _id: string;
  name: string;
  logo: string;
  description: string;
  isActive: boolean;
  createdAt: string;
}

export interface Category {
  _id: string;
  name: string;
  company: string | Company;
  description: string;
}

export interface Product {
  _id: string;
  name: string;
  company: Company;
  category: Category;
  description: string;
  image: string;
  unit: string;
  minOrderQty: number;
  pricingTiers: PricingTier[];
  stock: number;
  isActive: boolean;
  createdAt: string;
}

export interface OrderItem {
  product: string;
  productName: string;
  companyName: string;
  quantity: number;
  priceAtOrder: number;
  unit: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customer: User;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'packed' | 'dispatched' | 'delivered';
  paymentStatus: 'pending' | 'received';
  paymentMode: 'cod' | 'upi';
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  role: 'retailer' | 'admin';
  shopName: string;
  address: string;
  isActive: boolean;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
}
