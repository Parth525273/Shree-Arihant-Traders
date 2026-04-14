'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, User, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-primary tracking-tight">SHREE ARIHANT</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
            <Link href="/" className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors">
              Browse
            </Link>
            
            <Link href="/cart" className="relative p-2 text-foreground hover:text-primary transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-primary rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                {user.role === 'admin' && (
                  <Link href="/admin" className="p-2 text-foreground hover:text-primary transition-colors">
                    <LayoutDashboard className="w-6 h-6" />
                  </Link>
                )}
                <button onClick={logout} className="p-2 text-foreground hover:text-destructive transition-colors">
                  <LogOut className="w-6 h-6" />
                </button>
              </div>
            ) : (
              <Link href="/login" className="flex items-center space-x-1 text-foreground hover:text-primary transition-colors font-medium">
                <User className="w-5 h-5" />
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <Link href="/cart" className="relative p-2 mr-2 text-foreground">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 px-1.5 py-0.5 text-[10px] font-bold text-white bg-primary rounded-full translate-x-1/2 -translate-y-1/2">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-primary"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn("sm:hidden bg-card border-b border-border", isOpen ? "block" : "hidden")}>
        <div className="pt-2 pb-3 space-y-1 px-4">
          <Link href="/" className="block px-3 py-2 text-base font-medium text-foreground hover:bg-muted rounded-md">
            Browse Companies
          </Link>
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link href="/admin" className="block px-3 py-2 text-base font-medium text-foreground hover:bg-muted rounded-md">
                  Admin Dashboard
                </Link>
              )}
              <button onClick={logout} className="w-full text-left block px-3 py-2 text-base font-medium text-destructive hover:bg-muted rounded-md">
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="block px-3 py-2 text-base font-medium text-primary hover:bg-muted rounded-md">
              Login / Signup
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
