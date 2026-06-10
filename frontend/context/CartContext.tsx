'use client';
// ─────────────────────────────────────────────────────────
// context/CartContext.tsx — Shopping Cart State
// Persists in localStorage, supports qty update & remove
// ─────────────────────────────────────────────────────────

import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, Product } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQty: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType>({
  items: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQty: () => {},
  clearCart: () => {},
  totalItems: 0,
  totalAmount: 0,
});

// Helper: get the right price for a given quantity based on pricing tiers
export const getPriceForQty = (
  tiers: { minQty: number; price: number }[],
  qty: number
): number => {
  const sorted = [...tiers].sort((a, b) => b.minQty - a.minQty);
  const tier = sorted.find((t) => qty >= t.minQty);
  return tier ? tier.price : tiers[0]?.price || 0;
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sat_cart');
    if (saved) setItems(JSON.parse(saved));
  }, []);

  // Save to localStorage on every change
  const save = (newItems: CartItem[]) => {
    setItems(newItems);
    localStorage.setItem('sat_cart', JSON.stringify(newItems));
  };

  const addToCart = (product: Product, quantity: number) => {
    const existing = items.find((i) => i.product._id === product._id);
    if (existing) {
      save(
        items.map((i) =>
          i.product._id === product._id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        )
      );
    } else {
      save([...items, { product, quantity }]);
    }
  };

  const removeFromCart = (productId: string) => {
    save(items.filter((i) => i.product._id !== productId));
  };

  const updateQty = (productId: string, quantity: number) => {
    if (quantity <= 0) return removeFromCart(productId);
    save(items.map((i) => (i.product._id === productId ? { ...i, quantity } : i)));
  };

  const clearCart = () => save([]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalAmount = items.reduce(
    (sum, i) => sum + getPriceForQty(i.product.pricingTiers, i.quantity) * i.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQty, clearCart, totalItems, totalAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
