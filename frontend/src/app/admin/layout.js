'use client';

import Sidebar from '@/components/admin/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'admin') {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="pl-64">
        <header className="h-16 border-b border-border bg-card flex items-center px-8 sticky top-0 z-10">
          <h1 className="text-lg font-semibold text-foreground">
            Welcome back, {user.name}
          </h1>
        </header>
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
