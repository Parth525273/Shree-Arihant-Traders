'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    shopName: '',
    mobile: '',
    address: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = await signup(formData);
    if (!result.success) {
      setError(result.error);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-background">
      <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-2xl shadow-xl border border-border">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">
            Register as a Retailer
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary hover:text-primary/90">
              Sign in here
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/20 text-center">
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Full Name</label>
              <input
                name="name"
                type="text"
                required
                className="block w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                placeholder="John Doe"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Email Address</label>
              <input
                name="email"
                type="email"
                required
                className="block w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                placeholder="email@example.com"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Password</label>
              <input
                name="password"
                type="password"
                required
                className="block w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                placeholder="••••••••"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Shop Name</label>
              <input
                name="shopName"
                type="text"
                required
                className="block w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                placeholder="My Store"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Mobile Number</label>
              <input
                name="mobile"
                type="text"
                required
                className="block w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                placeholder="10-digit number"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Full Address</label>
              <textarea
                name="address"
                required
                rows={2}
                className="block w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                placeholder="Shop address..."
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative flex w-full justify-center rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating account...' : 'Register Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
