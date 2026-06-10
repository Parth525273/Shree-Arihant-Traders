'use client';
// ─────────────────────────────────────────────────────────
// components/Navbar.tsx — Top Navigation Bar
// Shows: Logo | Search | Cart icon | Login/Profile
// ─────────────────────────────────────────────────────────

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  ShoppingCart, User, LogOut, Search, Menu, X,
  Package, LayoutDashboard, ChevronDown, Store
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const { totalItems } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/companies?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
      setMobileOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    router.push('/');
  };

  // Don't show navbar on admin pages (admin has its own layout)
  if (pathname?.startsWith('/admin')) return null;

  return (
    <nav style={{
      background: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', height: '64px', gap: '1rem' }}>

        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', flexShrink: 0 }}>
          <div style={{
            width: '36px', height: '36px',
            background: 'var(--accent)',
            borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Store size={20} color="white" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: 1.1 }}>
              Shree Arihant
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Traders
            </div>
          </div>
        </Link>

        {/* Search bar - desktop */}
        <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: '480px', display: 'flex', margin: '0 auto' }}
          className="hide-mobile">
          <div className="input-with-icon" style={{ width: '100%' }}>
            <Search size={16} className="input-icon" />
            <input
              className="input"
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingRight: '1rem', height: '40px' }}
            />
          </div>
        </form>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}>

          {/* Companies link */}
          <Link href="/companies"
            className="btn btn-ghost btn-sm hide-mobile"
            style={{ color: pathname === '/companies' ? 'var(--accent)' : 'var(--text-secondary)' }}>
            Companies
          </Link>

          {/* Cart */}
          <Link href="/cart" style={{ position: 'relative', display: 'flex', textDecoration: 'none' }}>
            <button className="btn btn-ghost btn-sm" style={{ padding: '0.5rem' }}>
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span style={{
                  position: 'absolute', top: '-4px', right: '-4px',
                  background: 'var(--accent)', color: 'white',
                  borderRadius: '99px', fontSize: '0.65rem', fontWeight: 700,
                  minWidth: '18px', height: '18px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '0 4px',
                }}>
                  {totalItems}
                </span>
              )}
            </button>
          </Link>

          {/* Auth */}
          {isLoggedIn ? (
            <div style={{ position: 'relative' }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{ gap: '0.375rem' }}
              >
                <User size={16} />
                <span className="hide-mobile">{user?.name?.split(' ')[0]}</span>
                <ChevronDown size={14} />
              </button>

              {dropdownOpen && (
                <div style={{
                  position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)', padding: '0.5rem',
                  minWidth: '180px', boxShadow: 'var(--shadow)', zIndex: 200,
                }}>
                  {isAdmin ? (
                    <>
                      <Link href="/admin" onClick={() => setDropdownOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.875rem' }}
                        className="dropdown-item">
                        <LayoutDashboard size={15} /> Admin Dashboard
                      </Link>
                      <Link href="/admin/products" onClick={() => setDropdownOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.875rem' }}
                        className="dropdown-item">
                        <Package size={15} /> Manage Products
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link href="/retailer/dashboard" onClick={() => setDropdownOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.875rem' }}
                        className="dropdown-item">
                        <LayoutDashboard size={15} /> My Dashboard
                      </Link>
                      <Link href="/retailer/orders" onClick={() => setDropdownOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.875rem' }}
                        className="dropdown-item">
                        <Package size={15} /> My Orders
                      </Link>
                    </>
                  )}
                  <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '0.375rem 0' }} />
                  <button onClick={handleLogout}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-sm)', color: '#ef4444', background: 'none', border: 'none', width: '100%', cursor: 'pointer', fontSize: '0.875rem', fontFamily: 'inherit' }}
                    className="dropdown-item">
                    <LogOut size={15} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth/login" className="btn btn-primary btn-sm">
              Login
            </Link>
          )}

          {/* Mobile menu toggle */}
          <button className="btn btn-ghost btn-sm show-mobile"
            style={{ padding: '0.5rem' }}
            onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{
          borderTop: '1px solid var(--border)',
          padding: '1rem',
          background: 'var(--bg-primary)',
        }}>
          <form onSubmit={handleSearch} style={{ marginBottom: '1rem' }}>
            <div className="input-with-icon">
              <Search size={16} className="input-icon" />
              <input className="input" type="text" placeholder="Search products..."
                value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </form>
          <Link href="/companies" onClick={() => setMobileOpen(false)}
            style={{ display: 'block', padding: '0.75rem', color: 'var(--text-primary)', textDecoration: 'none', borderRadius: 'var(--radius-sm)' }}>
            Browse Companies
          </Link>
        </div>
      )}

      <style>{`
        .hide-mobile { display: flex; }
        .show-mobile { display: none; }
        .dropdown-item:hover { background: var(--bg-card-hover); }
        @media (max-width: 640px) {
          .hide-mobile { display: none; }
          .show-mobile { display: flex; }
        }
      `}</style>
    </nav>
  );
}
