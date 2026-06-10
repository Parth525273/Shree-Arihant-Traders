// ─────────────────────────────────────────────────────────
// app/page.tsx — Homepage / Landing Page
// Shows: Hero, Browse by Company, Featured Products
// ─────────────────────────────────────────────────────────

'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Building2, Package, ShieldCheck, Zap, TrendingUp } from 'lucide-react';
import Navbar from '../components/Navbar';
import CompanyCard from '../components/CompanyCard';
import ProductCard from '../components/ProductCard';
import { companyAPI, productAPI } from '../lib/api';
import { Company, Product } from '../types';

export default function HomePage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      companyAPI.getAll(),
      productAPI.getAll({ limit: 8 }),
    ])
      .then(([compRes, prodRes]) => {
        setCompanies((compRes as { companies: Company[] }).companies.slice(0, 6));
        setProducts((prodRes as { products: Product[] }).products);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <main>
        {/* ─── Hero Section ──────────────────────────────── */}
        <section style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1a2744 50%, #0f172a 100%)',
          padding: '5rem 0 4rem',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Background decoration */}
          <div style={{
            position: 'absolute', top: '-50%', right: '-10%',
            width: '600px', height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div className="container" style={{ textAlign: 'center', position: 'relative' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.3)',
              borderRadius: '99px', padding: '0.375rem 1rem',
              fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 600,
              marginBottom: '1.5rem',
            }}>
              <Zap size={14} /> B2B Wholesale Food Ordering
            </div>

            <h1 style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: '1.25rem',
              background: 'linear-gradient(135deg, #f1f5f9, #94a3b8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Shree Arihant Traders
            </h1>
            <p style={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              color: 'var(--text-secondary)',
              maxWidth: '520px', margin: '0 auto 2.5rem',
              lineHeight: 1.7,
            }}>
              Order wholesale food products from <strong style={{ color: 'var(--accent)' }}>40+ top companies</strong>.
              Bulk pricing, fast delivery, easy ordering.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/companies" className="btn btn-primary btn-lg">
                Browse Companies <ArrowRight size={18} />
              </Link>
              <Link href="/auth/register" className="btn btn-secondary btn-lg">
                Create Account
              </Link>
            </div>

            {/* Quick stats */}
            <div style={{
              display: 'flex', gap: '2rem', justifyContent: 'center',
              marginTop: '3rem', flexWrap: 'wrap',
            }}>
              {[
                { icon: <Building2 size={18} />, label: '40+ Companies' },
                { icon: <Package size={18} />, label: '500+ Products' },
                { icon: <ShieldCheck size={18} />, label: 'Trusted by Retailers' },
              ].map((item) => (
                <div key={item.label} style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  color: 'var(--text-secondary)', fontSize: '0.9rem',
                }}>
                  <span style={{ color: 'var(--accent)' }}>{item.icon}</span>
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Browse by Company ──────────────────────────── */}
        <section className="section">
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 className="section-title">Browse by Company</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                  Explore products from our partner agencies
                </p>
              </div>
              <Link href="/companies" className="btn btn-ghost btn-sm" style={{ gap: '0.25rem' }}>
                View all <ArrowRight size={14} />
              </Link>
            </div>

            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                <div className="spinner" />
              </div>
            ) : companies.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🏢</div>
                <div className="empty-state-title">No companies yet</div>
                <p>Admin will add companies soon. Check back later!</p>
              </div>
            ) : (
              <div className="grid-3">
                {companies.map((company) => (
                  <CompanyCard key={company._id} company={company} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ─── Featured Products ──────────────────────────── */}
        {products.length > 0 && (
          <section className="section" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
            <div className="container">
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 className="section-title">
                    <TrendingUp size={22} style={{ display: 'inline', marginRight: '0.5rem', color: 'var(--accent)' }} />
                    Featured Products
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    Popular products across all companies
                  </p>
                </div>
              </div>
              <div className="grid-4">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─── How It Works ───────────────────────────────── */}
        <section className="section">
          <div className="container" style={{ textAlign: 'center' }}>
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle" style={{ marginBottom: '3rem' }}>
              Order wholesale in 3 simple steps
            </p>
            <div className="grid-3">
              {[
                { step: '01', icon: '🔍', title: 'Browse Products', desc: 'Explore products from 40+ food companies and agencies. Filter by company or category.' },
                { step: '02', icon: '🛒', title: 'Add to Cart', desc: 'Add products in bulk quantities. Bulk pricing tiers apply automatically as you add more.' },
                { step: '03', icon: '📦', title: 'Place & Track', desc: 'Place your order and get a WhatsApp confirmation. Track delivery status in your dashboard.' },
              ].map((item) => (
                <div key={item.step} className="card" style={{ padding: '2rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--accent)', letterSpacing: '0.1em', marginBottom: '1rem' }}>
                    STEP {item.step}
                  </div>
                  <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{item.icon}</div>
                  <h3 style={{ fontWeight: 700, marginBottom: '0.75rem', fontSize: '1.05rem' }}>{item.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '3rem' }}>
              <Link href="/auth/register" className="btn btn-primary btn-lg">
                Start Ordering Today <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', padding: '2rem 0' }}>
        <div className="container" style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          <div style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            Shree Arihant Traders
          </div>
          <div>B2B Wholesale Food Ordering Platform © {new Date().getFullYear()}</div>
        </div>
      </footer>
    </>
  );
}
