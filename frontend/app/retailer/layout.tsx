'use client';
// ─────────────────────────────────────────────────────────
// app/retailer/layout.tsx — Shared Retailer Portal Layout
// Sidebar navigation + top header for all /retailer/* pages
// ─────────────────────────────────────────────────────────

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Package, ShoppingCart, User,
  LogOut, Store, Menu, X, ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useState } from 'react';

const navLinks = [
  { href: '/retailer/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { href: '/retailer/orders',    icon: <Package size={18} />,          label: 'My Orders' },
  { href: '/cart',               icon: <ShoppingCart size={18} />,     label: 'Cart' },
  { href: '/retailer/profile',   icon: <User size={18} />,             label: 'Profile' },
];

export default function RetailerLayout({ children }: { children: React.ReactNode }) {
  const pathname  = usePathname();
  const router    = useRouter();
  const { user, logout } = useAuth();
  const { totalItems }   = useCart();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const Sidebar = () => (
    <div style={{
      width: '240px', flexShrink: 0,
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      height: '100vh', position: 'sticky', top: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '1.25rem 1rem', borderBottom: '1px solid var(--border)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <div style={{ width: '32px', height: '32px', background: 'var(--accent)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Store size={18} color="white" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.1 }}>Shree Arihant</div>
            <div style={{ fontSize: '0.6rem', color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase' }}>Retailer Portal</div>
          </div>
        </Link>
      </div>

      {/* User info */}
      <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Logged in as</div>
        <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{user?.name}</div>
        {user?.shopName && <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.125rem' }}>{user.shopName}</div>}
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, padding: '0.75rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {navLinks.map((link) => {
          const isActive = pathname === link.href || (link.href !== '/retailer/dashboard' && pathname?.startsWith(link.href));
          return (
            <Link key={link.href} href={link.href} onClick={() => setSidebarOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.65rem 0.875rem', borderRadius: 'var(--radius-sm)',
                textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500,
                background: isActive ? 'var(--accent-light)' : 'transparent',
                color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                border: `1px solid ${isActive ? 'var(--accent-border)' : 'transparent'}`,
                transition: 'all 0.15s ease',
                position: 'relative',
              }}>
              {link.icon}
              {link.label}
              {link.href === '/cart' && totalItems > 0 && (
                <span style={{ marginLeft: 'auto', background: 'var(--accent)', color: 'white', borderRadius: '99px', fontSize: '0.65rem', fontWeight: 700, minWidth: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px' }}>
                  {totalItems}
                </span>
              )}
            </Link>
          );
        })}

        {/* Browse Products link */}
        <Link href="/companies"
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 0.875rem', borderRadius: 'var(--radius-sm)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          <Store size={18} />
          Browse Products
          <ChevronRight size={14} style={{ marginLeft: 'auto' }} />
        </Link>
      </nav>

      {/* Logout */}
      <div style={{ padding: '0.75rem 0.5rem', borderTop: '1px solid var(--border)' }}>
        <button onClick={handleLogout}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 0.875rem', borderRadius: 'var(--radius-sm)', width: '100%', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500, color: '#ef4444', fontFamily: 'inherit' }}>
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <ProtectedRoute>
      <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
        {/* Desktop Sidebar */}
        <div className="desktop-sidebar"><Sidebar /></div>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }} onClick={() => setSidebarOpen(false)} />
            <div style={{ position: 'relative', zIndex: 1 }}><Sidebar /></div>
          </div>
        )}

        {/* Main content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {/* Mobile top bar */}
          <div className="mobile-topbar" style={{ display: 'none', alignItems: 'center', gap: '0.75rem', padding: '1rem', borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)', position: 'sticky', top: 0, zIndex: 100 }}>
            <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', padding: 0 }}>
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Retailer Portal</span>
          </div>

          <main style={{ flex: 1, padding: '2rem', maxWidth: '1100px', width: '100%' }}>
            {children}
          </main>
        </div>
      </div>

      <style>{`
        .desktop-sidebar { display: block; }
        .mobile-topbar   { display: none !important; }
        @media (max-width: 768px) {
          .desktop-sidebar { display: none; }
          .mobile-topbar   { display: flex !important; }
          main { padding: 1rem !important; }
        }
      `}</style>
    </ProtectedRoute>
  );
}
