'use client';

import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Trash2, ArrowRight, Minus, Plus, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const { user } = useAuth();

  const getPriceAtQty = (item) => {
    let price = item.basePrice;
    if (item.priceTiers && item.priceTiers.length > 0) {
      const applicableTier = [...item.priceTiers]
        .sort((a, b) => b.minQty - a.minQty)
        .find(tier => item.quantity >= tier.minQty);
      if (applicableTier) price = applicableTier.price;
    }
    return price;
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] px-4 text-center">
        <div className="bg-muted p-8 rounded-full mb-6">
          <ShoppingBag className="w-16 h-16 text-muted-foreground" />
        </div>
        <h2 className="text-3xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-8 max-w-md">Looks like you haven't added any wholesale products to your cart yet.</p>
        <Link 
          href="/" 
          className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all"
        >
          Start Browsing
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-black mb-12">Bulk Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => {
            const currentPrice = getPriceAtQty(item);
            return (
              <div key={item._id} className="flex flex-col sm:flex-row items-center gap-6 bg-card p-6 rounded-2xl border border-border shadow-sm">
                <div className="w-24 h-24 bg-muted rounded-xl flex items-center justify-center flex-shrink-0">
                  <ShoppingBag className="w-8 h-8 text-muted-foreground" />
                </div>
                
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-lg font-bold">{item.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{item.companyId?.name || 'Wholesale Agency'}</p>
                  
                  <div className="flex items-center justify-center sm:justify-start gap-4">
                    <div className="flex items-center border border-border rounded-lg bg-background p-1">
                      <button 
                        onClick={() => updateQuantity(item._id, Math.max(item.minOrderQty || 1, item.quantity - 1))}
                        className="p-1 hover:bg-muted rounded transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-bold">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="p-1 hover:bg-muted rounded transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-xs text-muted-foreground uppercase font-bold">{item.unit}s</span>
                  </div>
                </div>

                <div className="text-center sm:text-right flex flex-col items-center sm:items-end gap-2">
                  <div className="flex flex-col">
                    <span className="text-xl font-black">₹{currentPrice * item.quantity}</span>
                    <span className="text-xs text-muted-foreground">₹{currentPrice} / {item.unit}</span>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item._id)}
                    className="p-2 text-muted-foreground hover:text-destructive flex items-center gap-1 text-xs font-bold uppercase"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card p-8 rounded-3xl border border-border sticky top-28 shadow-xl">
            <h3 className="text-xl font-bold mb-6">Order Summary</h3>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>₹{getCartTotal()}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Tax (GST)</span>
                <span>₹0</span>
              </div>
              <div className="pt-4 border-t border-border flex justify-between items-center bg-primary/5 -mx-8 px-8 py-4">
                <span className="text-lg font-bold">Total Amount</span>
                <span className="text-3xl font-black text-primary">₹{getCartTotal()}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-primary text-white font-bold text-lg hover:bg-primary/90 transition-all shadow-lg"
            >
              Checkout Order
              <ArrowRight className="w-6 h-6" />
            </Link>
            
            <p className="mt-4 text-[10px] text-center text-muted-foreground uppercase font-bold tracking-widest">
              Payment mode will be decided via WhatsApp
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
