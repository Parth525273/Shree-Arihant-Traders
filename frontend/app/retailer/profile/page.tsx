'use client';
// ─────────────────────────────────────────────────────────
// app/retailer/profile/page.tsx — Edit Profile
// Update name, mobile, shop info + change password
// ─────────────────────────────────────────────────────────

import { useState } from 'react';
import { User, Phone, Store, MapPin, Lock, Eye, EyeOff, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';

export default function ProfilePage() {
  const { user, token, login } = useAuth();

  const [profile, setProfile] = useState({
    name:     user?.name     || '',
    mobile:   user?.mobile   || '',
    shopName: user?.shopName || '',
    address:  user?.address  || '',
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '', newPassword: '', confirmPassword: '',
  });
  const [showPass, setShowPass]       = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPass, setSavingPass]       = useState(false);

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      login(token!, data.user);
      toast.success('Profile updated!');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwords.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    setSavingPass(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/change-password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success('Password changed successfully!');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Password change failed');
    } finally {
      setSavingPass(false);
    }
  };

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.25rem' }}>My Profile</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Update your shop information and account details
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>

        {/* ── Profile Info ─────────────────────────────── */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={18} color="var(--accent)" /> Shop Information
          </h2>

          {/* Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.25rem', color: 'white', flexShrink: 0 }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 700 }}>{user?.name}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{user?.email}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', marginTop: '0.125rem' }}>
                {user?.role}
              </div>
            </div>
          </div>

          <form onSubmit={handleProfileSave}>
            <div className="form-group">
              <label className="label">Full Name</label>
              <div className="input-with-icon">
                <User size={15} className="input-icon" />
                <input className="input" type="text" value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })} required />
              </div>
            </div>

            <div className="form-group">
              <label className="label">WhatsApp / Mobile</label>
              <div className="input-with-icon">
                <Phone size={15} className="input-icon" />
                <input className="input" type="tel" value={profile.mobile} placeholder="10-digit number"
                  onChange={(e) => setProfile({ ...profile, mobile: e.target.value })} />
              </div>
            </div>

            <div className="form-group">
              <label className="label">Shop Name</label>
              <div className="input-with-icon">
                <Store size={15} className="input-icon" />
                <input className="input" type="text" value={profile.shopName} placeholder="Your shop name"
                  onChange={(e) => setProfile({ ...profile, shopName: e.target.value })} />
              </div>
            </div>

            <div className="form-group">
              <label className="label">Shop Address</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={15} style={{ position: 'absolute', left: '0.875rem', top: '0.875rem', color: 'var(--text-muted)' }} />
                <textarea className="input" rows={3} value={profile.address} placeholder="Full shop address"
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  style={{ paddingLeft: '2.75rem', resize: 'vertical' }} />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={savingProfile}>
              {savingProfile ? <><div className="spinner spinner-sm" /> Saving...</> : <><Save size={16} /> Save Profile</>}
            </button>
          </form>
        </div>

        {/* ── Change Password ──────────────────────────── */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Lock size={18} color="var(--accent)" /> Change Password
          </h2>

          <form onSubmit={handlePasswordChange}>
            <div className="form-group">
              <label className="label">Current Password</label>
              <div className="input-with-icon" style={{ position: 'relative' }}>
                <Lock size={15} className="input-icon" />
                <input className="input" type={showPass ? 'text' : 'password'}
                  value={passwords.currentPassword} placeholder="Enter current password"
                  onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                  style={{ paddingRight: '2.75rem' }} required />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0 }}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="label">New Password</label>
              <div className="input-with-icon">
                <Lock size={15} className="input-icon" />
                <input className="input" type={showPass ? 'text' : 'password'}
                  value={passwords.newPassword} placeholder="Min 6 characters"
                  onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} required />
              </div>
            </div>

            <div className="form-group">
              <label className="label">Confirm New Password</label>
              <div className="input-with-icon">
                <Lock size={15} className="input-icon" />
                <input className="input" type={showPass ? 'text' : 'password'}
                  value={passwords.confirmPassword} placeholder="Repeat new password"
                  onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })} required />
              </div>
            </div>

            <div className="alert alert-warning" style={{ fontSize: '0.8rem', marginBottom: '1rem' }}>
              ⚠️ You will need to log in again after changing your password.
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={savingPass}>
              {savingPass ? <><div className="spinner spinner-sm" /> Changing...</> : <><Lock size={16} /> Change Password</>}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
