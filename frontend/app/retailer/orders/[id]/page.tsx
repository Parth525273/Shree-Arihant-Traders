'use client';
// ─────────────────────────────────────────────────────────
// app/retailer/orders/[id]/page.tsx — Order Detail + Invoice
// Shows full order info + printable invoice
// ─────────────────────────────────────────────────────────

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Printer, MessageCircle, RotateCcw, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { orderAPI } from '../../../../lib/api';
import { useCart } from '../../../../context/CartContext';
import { Order } from '../../../../types';

const statusConfig: Record<string, { label: string; class: string; icon: string }> = {
  pending:    { label: 'Order Pending',    class: 'badge-pending',    icon: '⏳' },
  packed:     { label: 'Packed',           class: 'badge-packed',     icon: '📦' },
  dispatched: { label: 'Dispatched',       class: 'badge-dispatched', icon: '🚚' },
  delivered:  { label: 'Delivered',        class: 'badge-delivered',  icon: '✅' },
};

export default function OrderDetailPage() {
  const { id }    = useParams<{ id: string }>();
  const router    = useRouter();
  const { addToCart } = useCart();

  const [order, setOrder]   = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    orderAPI.getById(id)
      .then((res) => setOrder((res as { order: Order }).order))
      .catch(() => toast.error('Order not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handlePrint = () => window.print();

  const handleReorder = () => {
    if (!order) return;
    // Add all items back to cart
    order.items.forEach((item) => {
      // We need the product object — for reorder we'll just show a message
      // since we only have productName in order items
      toast.success(`Items from order #${order.orderNumber} added concept — browse to re-add`);
    });
    router.push('/companies');
  };

  const handleWhatsApp = () => {
    if (!order) return;
    const adminNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919403153875';
    const message = encodeURIComponent(
      `Hello! I'm inquiring about my order #${order.orderNumber}.\nStatus: ${order.status}\nAmount: ₹${order.totalAmount}`
    );
    window.open(`https://wa.me/${adminNumber}?text=${message}`, '_blank');
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
      <div className="spinner" />
    </div>
  );

  if (!order) return (
    <div className="empty-state">
      <Package size={48} strokeWidth={1} style={{ opacity: 0.4 }} />
      <div className="empty-state-title">Order not found</div>
      <Link href="/retailer/orders" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
        Back to Orders
      </Link>
    </div>
  );

  const status = statusConfig[order.status] || statusConfig.pending;

  return (
    <>
      <div className="fade-in no-print">
        {/* Back */}
        <button onClick={() => router.back()}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem', padding: 0, fontFamily: 'inherit' }}>
          <ArrowLeft size={14} /> Back to orders
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.25rem' }}>
              Order #{order.orderNumber}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button className="btn btn-secondary btn-sm" onClick={handleWhatsApp}>
              <MessageCircle size={15} color="#22c55e" /> WhatsApp
            </button>
            <button className="btn btn-secondary btn-sm" onClick={handlePrint}>
              <Printer size={15} /> Print Invoice
            </button>
            <button className="btn btn-primary btn-sm" onClick={handleReorder}>
              <RotateCcw size={15} /> Reorder
            </button>
          </div>
        </div>

        {/* Status + Payment badges */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <span className={`badge ${status.class}`} style={{ fontSize: '0.85rem', padding: '0.35rem 0.875rem' }}>
            {status.icon} {status.label}
          </span>
          <span className={`badge ${order.paymentStatus === 'received' ? 'badge-success' : 'badge-pending'}`} style={{ fontSize: '0.85rem', padding: '0.35rem 0.875rem' }}>
            💳 Payment: {order.paymentStatus === 'received' ? 'Received ✓' : 'Pending'}
          </span>
          <span className="badge" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border)', fontSize: '0.85rem', padding: '0.35rem 0.875rem', textTransform: 'uppercase' }}>
            {order.paymentMode}
          </span>
        </div>
      </div>

      {/* ── INVOICE (printable) ─────────────────────────────── */}
      <div id="invoice" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '2rem' }}>

        {/* Invoice header — shown in both screen + print */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent)', marginBottom: '0.25rem' }}>
              🛒 Shree Arihant Traders
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>B2B Wholesale Food Ordering</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.125rem' }}>INVOICE</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>#{order.orderNumber}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              {new Date(order.createdAt).toLocaleDateString('en-IN')}
            </div>
          </div>
        </div>

        {/* Customer info */}
        {typeof order.customer === 'object' && order.customer && (
          <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Bill To</div>
            <div style={{ fontWeight: 600 }}>{order.customer.name}</div>
            {order.customer.shopName && <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{order.customer.shopName}</div>}
            {order.customer.mobile && <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>📱 {order.customer.mobile}</div>}
            {order.customer.address && <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>📍 {order.customer.address}</div>}
          </div>
        )}

        {/* Items table */}
        <div className="table-wrapper" style={{ marginBottom: '1.25rem' }}>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>Company</th>
                <th style={{ textAlign: 'right' }}>Qty</th>
                <th style={{ textAlign: 'right' }}>Price</th>
                <th style={{ textAlign: 'right' }}>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, i) => (
                <tr key={i}>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{i + 1}</td>
                  <td style={{ fontWeight: 500 }}>{item.productName}</td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{item.companyName}</td>
                  <td style={{ textAlign: 'right', fontSize: '0.85rem' }}>{item.quantity} {item.unit}</td>
                  <td style={{ textAlign: 'right', fontSize: '0.85rem' }}>₹{item.priceAtOrder}</td>
                  <td style={{ textAlign: 'right', fontWeight: 600 }}>₹{(item.priceAtOrder * item.quantity).toFixed(0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ minWidth: '220px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderTop: '2px solid var(--border)', fontWeight: 800, fontSize: '1.1rem' }}>
              <span>Total Amount</span>
              <span style={{ color: 'var(--accent)' }}>₹{order.totalAmount.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.375rem 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <span>Payment Mode</span>
              <span style={{ textTransform: 'uppercase', fontWeight: 600 }}>{order.paymentMode}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.375rem 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <span>Payment Status</span>
              <span style={{ color: order.paymentStatus === 'received' ? '#22c55e' : '#f59e0b', fontWeight: 600 }}>
                {order.paymentStatus === 'received' ? 'Received ✓' : 'Pending'}
              </span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {order.notes && (
          <div style={{ marginTop: '1.25rem', padding: '0.875rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <strong>Notes:</strong> {order.notes}
          </div>
        )}

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
          Thank you for your order! • Shree Arihant Traders • WhatsApp: +{process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919403153875'}
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; color: black !important; }
          #invoice { border: 1px solid #ccc !important; background: white !important; color: black !important; }
          #invoice * { color: black !important; border-color: #ccc !important; background: white !important; }
          #invoice .badge { border: 1px solid #ccc !important; }
        }
      `}</style>
    </>
  );
}
