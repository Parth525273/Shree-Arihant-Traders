'use client';
// ─────────────────────────────────────────────────────────
// app/retailer/dashboard/page.tsx — Retailer Dashboard
// Shows: quick stats, recent orders, quick actions
// ─────────────────────────────────────────────────────────

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, ShoppingCart, IndianRupee, ArrowRight, Clock, CheckCircle, Truck } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { orderAPI } from '../../../lib/api';
import { Order } from '../../../types';

export default function RetailerDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.myOrders()
      .then((res) => setOrders((res as { orders: Order[] }).orders))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Stats
  const totalOrders   = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const totalSpent    = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const recentOrders  = orders.slice(0, 5);

  const statusConfig: Record<string, { label: string; class: string }> = {
    pending:    { label: 'Pending',    class: 'badge-pending' },
    packed:     { label: 'Packed',     class: 'badge-packed' },
    dispatched: { label: 'Dispatched', class: 'badge-dispatched' },
    delivered:  { label: 'Delivered',  class: 'badge-delivered' },
  };

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.25rem' }}>
          Welcome back, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          {user?.shopName ? `${user.shopName} · ` : ''}Here's your order summary
        </p>
      </div>

      {/* Stats */}
      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(59,130,246,0.1)' }}>
            <Package size={20} color="#3b82f6" />
          </div>
          <div className="stat-value">{loading ? '—' : totalOrders}</div>
          <div className="stat-label">Total Orders</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.1)' }}>
            <Clock size={20} color="#f59e0b" />
          </div>
          <div className="stat-value">{loading ? '—' : pendingOrders}</div>
          <div className="stat-label">Pending Orders</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(34,197,94,0.1)' }}>
            <IndianRupee size={20} color="#22c55e" />
          </div>
          <div className="stat-value">{loading ? '—' : `₹${totalSpent.toLocaleString('en-IN')}`}</div>
          <div className="stat-label">Total Spent</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Quick Actions</h2>
        <div className="grid-2">
          <Link href="/companies" style={{ textDecoration: 'none' }}>
            <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
              <div style={{ width: '44px', height: '44px', background: 'var(--accent-light)', border: '1px solid var(--accent-border)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ShoppingCart size={20} color="var(--accent)" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Browse & Order</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Shop from 40+ companies</div>
              </div>
              <ArrowRight size={16} color="var(--text-muted)" />
            </div>
          </Link>

          <Link href="/retailer/orders" style={{ textDecoration: 'none' }}>
            <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
              <div style={{ width: '44px', height: '44px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Package size={20} color="#3b82f6" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>View All Orders</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Track & reorder</div>
              </div>
              <ArrowRight size={16} color="var(--text-muted)" />
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Orders */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Recent Orders</h2>
          <Link href="/retailer/orders" className="btn btn-ghost btn-sm" style={{ fontSize: '0.8rem' }}>
            View all <ArrowRight size={13} />
          </Link>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
            <div className="spinner" />
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="card" style={{ padding: '2.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📦</div>
            <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>No orders yet</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Start by browsing products from our companies
            </p>
            <Link href="/companies" className="btn btn-primary btn-sm">
              Browse Products
            </Link>
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
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id}>
                    <td style={{ fontWeight: 600, color: 'var(--accent)', fontSize: '0.85rem' }}>
                      #{order.orderNumber}
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</td>
                    <td style={{ fontWeight: 600 }}>₹{order.totalAmount.toLocaleString('en-IN')}</td>
                    <td>
                      <span className={`badge ${statusConfig[order.status]?.class || 'badge-pending'}`}>
                        {statusConfig[order.status]?.label || order.status}
                      </span>
                    </td>
                    <td>
                      <Link href={`/retailer/orders/${order._id}`} className="btn btn-ghost btn-sm" style={{ fontSize: '0.75rem' }}>
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
