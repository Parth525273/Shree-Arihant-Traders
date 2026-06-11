'use client';
// ─────────────────────────────────────────────────────────
// app/cart/page.tsx — Shopping Cart Page
// Review items, change qty, place order with payment mode
// ─────────────────────────────────────────────────────────

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight, Package, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../../components/Navbar';
import { useCart, getPriceForQty } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { orderAPI } from '../../lib/api';

export default function CartPage() {
  const { items, removeFromCart, updateQty, clearCart, totalAmount } = useCart();
  const { isLoggedIn, user } = useAuth();
  const router = useRouter();

  const [paymentMode, setPaymentMode] = useState<'cod' | 'upi'>('cod');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async () => {
    if (!isLoggedIn) {
      toast.error('Please login to place an order');
      router.push('/auth/login');
      return;
    }
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setLoading(true);
    try {
      const res = await orderAPI.place({
        items: items.map((i) => ({ product: i.product._id, quantity: i.quantity })),
        paymentMode,
        notes,
      }) as { order: { _id: string; orderNumber: string } };

      clearCart();
      toast.success(`Order #${res.order.orderNumber} placed successfully!`);

      // WhatsApp notification to admin
      const adminNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919403153875';
      const message = encodeURIComponent(
        `🛒 *New Order - Shree Arihant Traders*\n\nOrder #${res.order.orderNumber}\nCustomer: ${user?.name}\nShop: ${user?.shopName || 'N/A'}\nAmount: ₹${totalAmount.toFixed(0)}\nPayment: ${paymentMode.toUpperCase()}\n${notes ? `\nNotes: ${notes}` : ''}`
      );
      window.open(`https://wa.me/${adminNumber}?text=${message}`, '_blank');

      router.push(`/retailer/orders/${res.order._id}`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: '2rem 1rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.25rem' }}>
          <ShoppingCart size={24} style={{ display: 'inline', marginRight: '0.5rem', color: 'var(--accent)', verticalAlign: 'middle' }} />
          Your Cart
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.9rem' }}>
          {items.length === 0 ? 'No items yet' : `${items.length} item type${items.length !== 1 ? 's' : ''} · ₹${totalAmount.toFixed(0)} total`}
        </p>

        {items.length === 0 ? (
          <div className="empty-state" style={{ padding: '5rem 2rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
            <div className="empty-state-title">Your cart is empty</div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Browse our companies and add products to get started
            </p>
            <Link href="/companies" className="btn btn-primary">
              Browse Products <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>

            {/* Cart Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {items.map((item) => {
                const unitPrice = getPriceForQty(item.product.pricingTiers, item.quantity);
                const subtotal  = unitPrice * item.quantity;
                const companyName = typeof item.product.company === 'object' ? item.product.company.name : '';

                return (
                  <div key={item.product._id} className="card" style={{ padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {/* Product image */}
                    <div style={{ width: '72px', height: '72px', borderRadius: '10px', overflow: 'hidden', background: 'var(--bg-secondary)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {item.product.image
                        ? <img src={item.product.image} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <Package size={28} color="var(--text-muted)" strokeWidth={1} />
                      }
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.125rem' }}>{companyName}</div>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.product.name}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        ₹{unitPrice} / {item.product.unit}
                        {item.product.pricingTiers.length > 1 && (
                          <span style={{ color: 'var(--accent)', marginLeft: '0.5rem', fontSize: '0.72rem' }}>bulk price applied</span>
                        )}
                      </div>
                    </div>

                    {/* Qty controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                      <button className="btn btn-secondary btn-sm" style={{ padding: '0.3rem' }}
                        onClick={() => updateQty(item.product._id, item.quantity - 1)}>
                        <Minus size={14} />
                      </button>
                      <span style={{ fontWeight: 700, minWidth: '32px', textAlign: 'center', fontSize: '0.9rem' }}>
                        {item.quantity}
                      </span>
                      <button className="btn btn-secondary btn-sm" style={{ padding: '0.3rem' }}
                        onClick={() => updateQty(item.product._id, item.quantity + 1)}>
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div style={{ fontWeight: 800, fontSize: '1rem', minWidth: '80px', textAlign: 'right', flexShrink: 0 }}>
                      ₹{subtotal.toFixed(0)}
                    </div>

                    {/* Remove */}
                    <button className="btn btn-ghost btn-sm" style={{ padding: '0.4rem', color: '#ef4444', flexShrink: 0 }}
                      onClick={() => { removeFromCart(item.product._id); toast.success('Item removed'); }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })}

              <button className="btn btn-ghost btn-sm" style={{ alignSelf: 'flex-start', color: '#ef4444' }}
                onClick={() => { clearCart(); toast.success('Cart cleared'); }}>
                <Trash2 size={14} /> Clear entire cart
              </button>
            </div>

            {/* Order Summary */}
            <div style={{ position: 'sticky', top: '1rem' }}>
              <div className="card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontWeight: 700, marginBottom: '1.25rem', fontSize: '1.05rem' }}>Order Summary</h3>

                {/* Items breakdown */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '1rem' }}>
                  {items.map((item) => {
                    const price = getPriceForQty(item.product.pricingTiers, item.quantity);
                    return (
                      <div key={item.product._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                        <span style={{ color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>
                          {item.product.name} × {item.quantity}
                        </span>
                        <span style={{ fontWeight: 500, flexShrink: 0 }}>₹{(price * item.quantity).toFixed(0)}</span>
                      </div>
                    );
                  })}
                </div>

                <hr className="divider" />

                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                  <span>Total</span>
                  <span style={{ color: 'var(--accent)' }}>₹{totalAmount.toFixed(0)}</span>
                </div>

                {/* Payment mode */}
                <div className="form-group">
                  <label className="label">Payment Mode</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {(['cod', 'upi'] as const).map((mode) => (
                      <button key={mode} onClick={() => setPaymentMode(mode)}
                        className={`btn btn-sm ${paymentMode === mode ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ flex: 1, textTransform: 'uppercase', fontSize: '0.8rem' }}>
                        {mode === 'cod' ? '💵 Cash' : '📱 UPI'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div className="form-group">
                  <label className="label">Notes (optional)</label>
                  <textarea className="input" rows={2} placeholder="Delivery instructions, special requests..."
                    value={notes} onChange={(e) => setNotes(e.target.value)}
                    style={{ resize: 'none' }} />
                </div>

                {/* Place order button */}
                {isLoggedIn ? (
                  <button className="btn btn-primary btn-full btn-lg" onClick={handlePlaceOrder} disabled={loading}>
                    {loading ? <><div className="spinner spinner-sm" /> Placing order...</> : <>Place Order <ArrowRight size={18} /></>}
                  </button>
                ) : (
                  <Link href="/auth/login" className="btn btn-primary btn-full btn-lg">
                    Login to Place Order
                  </Link>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginTop: '0.875rem', fontSize: '0.75rem', color: 'var(--text-muted)', justifyContent: 'center' }}>
                  <MessageCircle size={13} color="#22c55e" />
                  WhatsApp confirmation sent after order
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <style>{`
        @media (max-width: 768px) {
          main > div:last-child > div:last-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
