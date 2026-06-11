'use client';
// Temporary admin landing page — Full dashboard coming in Phase 5
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Store, Settings, Package, Users, ShoppingBag, ArrowRight, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const { user, isAdmin, isLoggedIn, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) router.push('/auth/login');
  }, [isLoggedIn, router]);

  if (!isLoggedIn || !isAdmin) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div className="spinner" />
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg-primary)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem',
    }}>
      <div style={{ maxWidth: '600px', width: '100%', textAlign: 'center' }}>

        {/* Icon */}
        <div style={{
          width: '80px', height: '80px', background: 'var(--accent)',
          borderRadius: '20px', display: 'flex', alignItems: 'center',
          justifyContent: 'center', margin: '0 auto 1.5rem',
          boxShadow: '0 8px 32px rgba(249,115,22,0.4)',
        }}>
          <Store size={40} color="white" />
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Welcome, {user?.name?.split(' ')[0]}! 👑
        </h1>
        <p style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
          Admin Portal — Shree Arihant Traders
        </p>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '2.5rem' }}>
          The full admin dashboard is being built in <strong style={{ color: 'var(--text-primary)' }}>Phase 5</strong>. 
          It will include order management, inventory, and customer tracking.
        </p>

        {/* Phase 5 Preview Cards */}
        <div className="grid-2" style={{ marginBottom: '2rem', textAlign: 'left' }}>
          {[
            { icon: <Package size={20} />, title: 'Order Management', desc: 'View, update status & payment', soon: true },
            { icon: <ShoppingBag size={20} />, title: 'Product & Inventory', desc: 'Add/edit products, manage stock', soon: true },
            { icon: <Users size={20} />, title: 'Customer Management', desc: 'View all retailer accounts', soon: true },
            { icon: <Settings size={20} />, title: 'Company & Categories', desc: 'Manage companies & categories', soon: true },
          ].map((item, i) => (
            <div key={i} className="card" style={{ padding: '1.25rem', opacity: 0.7 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <div style={{ color: 'var(--accent)' }}>{item.icon}</div>
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.title}</span>
                {item.soon && (
                  <span className="badge badge-orange" style={{ marginLeft: 'auto', fontSize: '0.6rem' }}>SOON</span>
                )}
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/companies" className="btn btn-primary">
            Browse Products <ArrowRight size={16} />
          </Link>
          <button className="btn btn-secondary"
            onClick={() => { logout(); router.push('/'); }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>
    </div>
  );
}
