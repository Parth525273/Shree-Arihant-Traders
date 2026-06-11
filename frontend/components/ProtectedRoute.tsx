'use client';
// ─────────────────────────────────────────────────────────
// components/ProtectedRoute.tsx
// Redirects to login if user is not authenticated
// Redirects to home if user role doesn't match required role
// ─────────────────────────────────────────────────────────

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

interface Props {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: Props) {
  const { isLoggedIn, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/auth/login');
      return;
    }
    if (requireAdmin && !isAdmin) {
      router.push('/retailer/dashboard');
    }
    if (!requireAdmin && isAdmin) {
      router.push('/admin');
    }
  }, [isLoggedIn, isAdmin, requireAdmin, router]);

  if (!isLoggedIn) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (requireAdmin && !isAdmin) return null;
  if (!requireAdmin && isAdmin) return null;

  return <>{children}</>;
}
