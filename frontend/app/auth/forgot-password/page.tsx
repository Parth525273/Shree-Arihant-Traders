// ─────────────────────────────────────────────────────────
// app/auth/forgot-password/page.tsx
// User enters email → automatic reset email is sent
// ─────────────────────────────────────────────────────────

'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, Store, CheckCircle } from 'lucide-react';
import { authAPI } from '../../../lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [sent, setSent]         = useState(false);
  const [error, setError]       = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { setError('Please enter your email address.'); return; }
    setLoading(true);
    setError('');
    try {
      await authAPI.forgotPassword(email.trim());
      setSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg-primary)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem',
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <div style={{ width: '48px', height: '48px', background: 'var(--accent)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(249,115,22,0.4)' }}>
              <Store size={26} color="white" />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Shree Arihant Traders</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase' }}>Password Recovery</div>
            </div>
          </Link>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '2rem', boxShadow: 'var(--shadow)' }}>

          {sent ? (
            /* ── Success State ─────────────────────────── */
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <CheckCircle size={32} color="#22c55e" />
              </div>
              <h2 style={{ fontWeight: 700, fontSize: '1.3rem', marginBottom: '0.75rem' }}>Email Sent!</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '0.5rem' }}>
                We've sent a password reset link to:
              </p>
              <p style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '0.95rem', marginBottom: '1.25rem' }}>
                {email}
              </p>
              <div className="alert" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', color: '#fcd34d', textAlign: 'left', fontSize: '0.85rem' }}>
                <strong>⚠️ Check your spam folder</strong> if you don't see it in your inbox within 2 minutes. The link expires in <strong>1 hour</strong>.
              </div>
              <Link href="/auth/login" className="btn btn-primary btn-full" style={{ marginTop: '1.25rem' }}>
                Back to Login
              </Link>
              <button
                onClick={() => { setSent(false); setEmail(''); }}
                className="btn btn-ghost btn-full btn-sm"
                style={{ marginTop: '0.5rem' }}
              >
                Send to different email
              </button>
            </div>
          ) : (
            /* ── Form State ────────────────────────────── */
            <>
              <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                <div style={{ width: '56px', height: '56px', background: 'var(--accent-light)', border: '1px solid var(--accent-border)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  <Mail size={24} color="var(--accent)" />
                </div>
                <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>Forgot Password?</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  Enter your registered email and we'll send you a reset link instantly.
                </p>
              </div>

              {error && <div className="alert alert-error">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="label" htmlFor="email">Email Address</label>
                  <div className="input-with-icon">
                    <Mail size={16} className="input-icon" />
                    <input
                      id="email"
                      type="email"
                      className="input"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(''); }}
                      autoFocus
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
                  {loading
                    ? <><div className="spinner spinner-sm" /> Sending email...</>
                    : '📧 Send Reset Link'}
                </button>
              </form>
            </>
          )}
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem' }}>
          <Link href="/auth/login"
            style={{ color: 'var(--accent)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
            <ArrowLeft size={14} /> Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
