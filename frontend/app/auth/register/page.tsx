// ─────────────────────────────────────────────────────────
// app/auth/register/page.tsx — Retailer Registration Page
// Creates a new retailer account with instant access
// ─────────────────────────────────────────────────────────

'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, User, Phone, Store, MapPin, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';
import { User as UserType } from '../../../types';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    mobile: '', shopName: '', address: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError('Name, email, and password are required');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await authAPI.register({
        name: form.name,
        email: form.email,
        password: form.password,
        mobile: form.mobile,
        shopName: form.shopName,
        address: form.address,
      }) as { token: string; user: UserType };

      login(res.token, res.user);
      toast.success('Account created! Welcome to Shree Arihant Traders!');
      router.push('/retailer/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
    }}>
      <div style={{ width: '100%', maxWidth: '480px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <div style={{
              width: '48px', height: '48px', background: 'var(--accent)',
              borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(249,115,22,0.4)',
            }}>
              <Store size={26} color="white" />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                Shree Arihant Traders
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase' }}>
                Create Retailer Account
              </div>
            </div>
          </Link>
        </div>

        {/* Card */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', padding: '2rem',
          boxShadow: 'var(--shadow)',
        }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.375rem' }}>
            Create your account
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
            Start ordering wholesale products instantly
          </p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="form-group">
              <label className="label" htmlFor="name">Full Name *</label>
              <div className="input-with-icon">
                <User size={16} className="input-icon" />
                <input id="name" name="name" type="text" className="input"
                  placeholder="Your full name" value={form.name} onChange={handleChange} required />
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="label" htmlFor="email">Email Address *</label>
              <div className="input-with-icon">
                <Mail size={16} className="input-icon" />
                <input id="email" name="email" type="email" className="input"
                  placeholder="your@email.com" value={form.email} onChange={handleChange}
                  autoComplete="email" required />
              </div>
            </div>

            {/* Password row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="label" htmlFor="password">Password *</label>
                <div className="input-with-icon" style={{ position: 'relative' }}>
                  <Lock size={16} className="input-icon" />
                  <input id="password" name="password"
                    type={showPassword ? 'text' : 'password'} className="input"
                    placeholder="Min 6 chars" value={form.password} onChange={handleChange}
                    style={{ paddingRight: '2.5rem' }} required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0 }}>
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label className="label" htmlFor="confirmPassword">Confirm *</label>
                <div className="input-with-icon">
                  <Lock size={16} className="input-icon" />
                  <input id="confirmPassword" name="confirmPassword"
                    type={showPassword ? 'text' : 'password'} className="input"
                    placeholder="Repeat password" value={form.confirmPassword} onChange={handleChange} required />
                </div>
              </div>
            </div>

            <hr className="divider" />

            {/* Optional fields */}
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Optional — but helps with order management
            </p>

            {/* Mobile */}
            <div className="form-group">
              <label className="label" htmlFor="mobile">WhatsApp / Mobile Number</label>
              <div className="input-with-icon">
                <Phone size={16} className="input-icon" />
                <input id="mobile" name="mobile" type="tel" className="input"
                  placeholder="10-digit mobile number" value={form.mobile} onChange={handleChange} />
              </div>
            </div>

            {/* Shop name */}
            <div className="form-group">
              <label className="label" htmlFor="shopName">Shop / Business Name</label>
              <div className="input-with-icon">
                <Store size={16} className="input-icon" />
                <input id="shopName" name="shopName" type="text" className="input"
                  placeholder="Your shop name" value={form.shopName} onChange={handleChange} />
              </div>
            </div>

            {/* Address */}
            <div className="form-group">
              <label className="label" htmlFor="address">Shop Address</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={16} style={{ position: 'absolute', left: '0.875rem', top: '0.875rem', color: 'var(--text-muted)' }} />
                <textarea id="address" name="address" className="input"
                  placeholder="Shop address for delivery"
                  value={form.address}
                  onChange={handleChange}
                  rows={2}
                  style={{ paddingLeft: '2.75rem', resize: 'vertical', minHeight: '72px' }}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading
                ? <><div className="spinner spinner-sm" /> Creating account...</>
                : <>Create Account <ArrowRight size={18} /></>
              }
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link href="/auth/login" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <Link href="/" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
