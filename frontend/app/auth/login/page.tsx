// ─────────────────────────────────────────────────────────
// app/auth/login/page.tsx — Login Page
// Email + Password login for retailers and admin
// ─────────────────────────────────────────────────────────

'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, Store, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';
import { User } from '../../../types';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please enter email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await authAPI.login(form.email, form.password) as { token: string; user: User };
      login(res.token, res.user);
      toast.success(`Welcome back, ${res.user.name}!`);

      // Redirect based on role
      if (res.user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/retailer/dashboard');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
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
      {/* Background glow */}
      <div style={{
        position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)',
        width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: '440px', position: 'relative' }}>

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
                B2B Wholesale Portal
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
            Welcome back
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
            Sign in to your account to continue
          </p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="form-group">
              <label className="label" htmlFor="email">Email Address</label>
              <div className="input-with-icon">
                <Mail size={16} className="input-icon" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="input"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
                <label className="label" htmlFor="password" style={{ margin: 0 }}>Password</label>
                <Link href="/auth/forgot-password"
                  style={{ fontSize: '0.8rem', color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}
                >
                  Forgot password?
                </Link>
              </div>
              <div className="input-with-icon" style={{ position: 'relative' }}>
                <Lock size={16} className="input-icon" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  className="input"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  style={{ paddingRight: '3rem' }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0,
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full btn-lg"
              disabled={loading}
              style={{ marginTop: '0.5rem' }}
            >
              {loading ? <><div className="spinner spinner-sm" /> Signing in...</> : <>Sign In <ArrowRight size={18} /></>}
            </button>
          </form>

          <div className="divider" style={{ margin: '1.5rem 0', textAlign: 'center', position: 'relative' }}>
            <span style={{
              background: 'var(--bg-card)', padding: '0 0.75rem',
              color: 'var(--text-muted)', fontSize: '0.8rem',
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
            }}>
              New here?
            </span>
          </div>

          <Link href="/auth/register" className="btn btn-secondary btn-full">
            Create Retailer Account
          </Link>
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
