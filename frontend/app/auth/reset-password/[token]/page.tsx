// ─────────────────────────────────────────────────────────
// app/auth/reset-password/[token]/page.tsx
// User clicks email link → enters new password here
// ─────────────────────────────────────────────────────────

'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Lock, Store, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '../../../../lib/api';
import { useAuth } from '../../../../context/AuthContext';
import { User } from '../../../../types';

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const router    = useRouter();
  const { login } = useAuth();

  const [form, setForm]             = useState({ password: '', confirmPassword: '' });
  const [showPassword, setShowPass] = useState(false);
  const [loading, setLoading]       = useState(false);
  const [done, setDone]             = useState(false);
  const [error, setError]           = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return; }

    setLoading(true);
    setError('');
    try {
      const res = await authAPI.resetPassword(token, form.password, form.confirmPassword) as { token: string; user: User };
      login(res.token, res.user);
      setDone(true);
      toast.success('Password reset! You are now logged in.');
      setTimeout(() => router.push('/retailer/dashboard'), 2500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Reset failed. The link may have expired.');
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
              <div style={{ fontSize: '0.7rem', color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase' }}>Set New Password</div>
            </div>
          </Link>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '2rem', boxShadow: 'var(--shadow)' }}>

          {done ? (
            /* ── Success ──────────────────────────────── */
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <CheckCircle size={32} color="#22c55e" />
              </div>
              <h2 style={{ fontWeight: 700, fontSize: '1.3rem', marginBottom: '0.75rem' }}>Password Reset!</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Your password has been updated. Redirecting you to your dashboard...
              </p>
              <div className="spinner" style={{ margin: '0 auto' }} />
            </div>
          ) : (
            /* ── Form ─────────────────────────────────── */
            <>
              <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                <div style={{ width: '56px', height: '56px', background: 'var(--accent-light)', border: '1px solid var(--accent-border)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  <Lock size={24} color="var(--accent)" />
                </div>
                <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>Set New Password</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Choose a strong password for your account.
                </p>
              </div>

              {error && (
                <div className="alert alert-error" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* New password */}
                <div className="form-group">
                  <label className="label" htmlFor="password">New Password</label>
                  <div className="input-with-icon" style={{ position: 'relative' }}>
                    <Lock size={16} className="input-icon" />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      className="input"
                      placeholder="Min 6 characters"
                      value={form.password}
                      onChange={(e) => { setForm({ ...form, password: e.target.value }); setError(''); }}
                      style={{ paddingRight: '3rem' }}
                      autoFocus
                      required
                    />
                    <button type="button" onClick={() => setShowPass(!showPassword)}
                      style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0 }}>
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  {/* Password strength indicator */}
                  {form.password && (
                    <div style={{ marginTop: '0.5rem', display: 'flex', gap: '4px' }}>
                      {[1,2,3,4].map((i) => {
                        const strength = form.password.length >= 12 ? 4 : form.password.length >= 8 ? 3 : form.password.length >= 6 ? 2 : 1;
                        return (
                          <div key={i} style={{ height: '3px', flex: 1, borderRadius: '99px', background: i <= strength ? (strength >= 4 ? '#22c55e' : strength >= 3 ? '#f59e0b' : '#ef4444') : 'var(--border)', transition: 'background 0.2s' }} />
                        );
                      })}
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginLeft: '4px' }}>
                        {form.password.length >= 12 ? 'Strong' : form.password.length >= 8 ? 'Good' : form.password.length >= 6 ? 'Weak' : 'Too short'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <div className="form-group">
                  <label className="label" htmlFor="confirmPassword">Confirm Password</label>
                  <div className="input-with-icon" style={{ position: 'relative' }}>
                    <Lock size={16} className="input-icon" />
                    <input
                      id="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      className="input"
                      placeholder="Repeat your password"
                      value={form.confirmPassword}
                      onChange={(e) => { setForm({ ...form, confirmPassword: e.target.value }); setError(''); }}
                      required
                    />
                    {form.confirmPassword && form.password === form.confirmPassword && (
                      <CheckCircle size={16} color="#22c55e" style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)' }} />
                    )}
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
                  {loading ? <><div className="spinner spinner-sm" /> Updating password...</> : '🔐 Reset Password'}
                </button>
              </form>

              <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Link expired?{' '}
                <Link href="/auth/forgot-password" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
                  Request a new one
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
