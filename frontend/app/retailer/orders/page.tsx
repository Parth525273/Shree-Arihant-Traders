'use client';
// ─────────────────────────────────────────────────────────
// app/retailer/orders/page.tsx — Order History
// Lists all orders with status filter + search
// ─────────────────────────────────────────────────────────

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, Search } from 'lucide-react';
import { orderAPI } from '../../../lib/api';
import { Order } from '../../../types';

const STATUS_FILTERS = ['all', 'pending', 'packed', 'dispatched', 'delivered'];

const statusConfig: Record<string, { label: string; class: string }> = {
  pending:    { label: 'Pending',    class: 'badge-pending' },
  packed:     { label: 'Packed',     class: 'badge-packed' },
  dispatched: { label: 'Dispatched', class: 'badge-dispatched' },
  delivered:  { label: 'Delivered',  class: 'badge-delivered' },
};

const paymentConfig: Record<string, { label: string; class: string }> = {
  pending:  { label: 'Unpaid',   class: 'badge-pending' },
  received: { label: 'Paid ✓',  class: 'badge-success' },
};

export default function OrdersPage() {
  const [orders, setOrders]       = useState<Order[]>([]);
  const [loading, setLoading]     = useState(true);
  const [activeFilter, setFilter] = useState('all');
  const [search, setSearch]       = useState('');

  useEffect(() => {
    orderAPI.myOrders()
      .then((res) => setOrders((res as { orders: Order[] }).orders))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = orders.filter((o) => {
    const matchStatus = activeFilter === 'all' || o.status === activeFilter;
    const matchSearch = !search || o.orderNumber?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.25rem' }}>My Orders</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          {orders.length} total order{orders.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Filters + Search */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
          {STATUS_FILTERS.map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`btn btn-sm ${activeFilter === f ? 'btn-primary' : 'btn-secondary'}`}
              style={{ textTransform: 'capitalize' }}>
              {f === 'all' ? 'All Orders' : f}
            </button>
          ))}
        </div>
        <div className="input-with-icon" style={{ maxWidth: '240px', marginLeft: 'auto' }}>
          <Search size={14} className="input-icon" />
          <input className="input" placeholder="Search order #..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ height: '36px', fontSize: '0.85rem' }} />
        </div>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <div className="spinner" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <Package size={48} strokeWidth={1} style={{ opacity: 0.4, marginBottom: '1rem' }} />
          <div className="empty-state-title">
            {search || activeFilter !== 'all' ? 'No matching orders' : 'No orders yet'}
          </div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
            {!(search || activeFilter !== 'all') && 'Start by browsing products and placing your first order'}
          </p>
          {!(search || activeFilter !== 'all') && (
            <Link href="/companies" className="btn btn-primary btn-sm">Browse Products</Link>
          )}
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Order #</th>
                <th>Date</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Payment</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order._id}>
                  <td style={{ fontWeight: 700, color: 'var(--accent)', fontSize: '0.875rem' }}>
                    #{order.orderNumber}
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </td>
                  <td style={{ fontWeight: 600 }}>
                    ₹{order.totalAmount.toLocaleString('en-IN')}
                  </td>
                  <td>
                    <span className={`badge ${statusConfig[order.status]?.class || 'badge-pending'}`}>
                      {statusConfig[order.status]?.label || order.status}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${paymentConfig[order.paymentStatus]?.class || 'badge-pending'}`}>
                      {paymentConfig[order.paymentStatus]?.label || order.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <Link href={`/retailer/orders/${order._id}`} className="btn btn-ghost btn-sm" style={{ fontSize: '0.8rem' }}>
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
