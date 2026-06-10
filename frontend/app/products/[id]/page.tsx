// ─────────────────────────────────────────────────────────
// app/products/[id]/page.tsx — Product Detail Page
// Shows full product info, pricing tiers, add to cart
// ─────────────────────────────────────────────────────────

'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ShoppingCart, Package, Plus, Minus, Info } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Navbar from '../../../components/Navbar';
import { productAPI } from '../../../lib/api';
import { useCart, getPriceForQty } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import { Product } from '../../../types';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (!id) return;
    productAPI.getById(id)
      .then((res) => {
        const p = (res as { product: Product }).product;
        setProduct(p);
        setQty(p.minOrderQty);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
          <div className="spinner" />
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="container" style={{ textAlign: 'center', padding: '5rem 1rem' }}>
          <h2>Product not found</h2>
          <Link href="/companies" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Browse Products
          </Link>
        </div>
      </>
    );
  }

  const currentPrice = getPriceForQty(product.pricingTiers, qty);
  const total = currentPrice * qty;
  const inStock = product.stock > 0;
  const companyName = typeof product.company === 'object' ? product.company.name : '';
  const companyId = typeof product.company === 'object' ? product.company._id : product.company;
  const categoryName = typeof product.category === 'object' ? product.category.name : '';

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      toast.error('Please login to add items to cart');
      router.push('/auth/login');
      return;
    }
    if (!inStock) return;
    addToCart(product, qty);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <>
      <Navbar />
      <main>
        <div className="container" style={{ padding: '1.5rem 1rem' }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <Link href="/companies" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>Companies</Link>
            <span style={{ color: 'var(--text-muted)' }}>/</span>
            <Link href={`/companies/${companyId}`} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>{companyName}</Link>
            <span style={{ color: 'var(--text-muted)' }}>/</span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{product.name}</span>
          </div>

          {/* Back button */}
          <button onClick={() => router.back()}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', marginBottom: '1.5rem', padding: 0 }}>
            <ArrowLeft size={14} /> Back
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', alignItems: 'start' }}>

            {/* Left — Product Image */}
            <div>
              <div style={{
                borderRadius: 'var(--radius-lg)', overflow: 'hidden',
                background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                aspectRatio: '1 / 1', position: 'relative',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {product.image ? (
                  <img src={product.image} alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    <Package size={64} strokeWidth={1} />
                    <div style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>No Image Available</div>
                  </div>
                )}
              </div>
            </div>

            {/* Right — Product Info */}
            <div className="fade-in">
              {/* Company + Category tags */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                <Link href={`/companies/${companyId}`}>
                  <span className="badge badge-orange" style={{ cursor: 'pointer' }}>{companyName}</span>
                </Link>
                {categoryName && <span className="badge" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>{categoryName}</span>}
              </div>

              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.2 }}>
                {product.name}
              </h1>

              {product.description && (
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.6, fontSize: '0.95rem' }}>
                  {product.description}
                </p>
              )}

              {/* Price display */}
              <div style={{
                background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius)', padding: '1.25rem', marginBottom: '1.25rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    ₹{currentPrice}
                  </span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>/ {product.unit}</span>
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Total for {qty} {product.unit}: <strong style={{ color: 'var(--accent)' }}>₹{total.toFixed(0)}</strong>
                </div>
              </div>

              {/* Bulk Pricing Tiers */}
              {product.pricingTiers.length > 1 && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <Info size={12} /> BULK PRICING
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                    {[...product.pricingTiers]
                      .sort((a, b) => a.minQty - b.minQty)
                      .map((tier, i, arr) => {
                        const isActive = qty >= tier.minQty && (i === arr.length - 1 || qty < arr[i + 1].minQty);
                        return (
                          <div key={i} style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            padding: '0.6rem 0.875rem',
                            borderRadius: 'var(--radius-sm)',
                            background: isActive ? 'var(--accent-light)' : 'var(--bg-secondary)',
                            border: `1px solid ${isActive ? 'var(--accent-border)' : 'var(--border)'}`,
                            fontSize: '0.875rem',
                          }}>
                            <span style={{ color: isActive ? 'var(--accent)' : 'var(--text-secondary)' }}>
                              {tier.minQty}+ {product.unit}
                            </span>
                            <strong style={{ color: isActive ? 'var(--accent)' : 'var(--text-primary)' }}>
                              ₹{tier.price}/{product.unit}
                              {isActive && <span style={{ fontSize: '0.7rem', marginLeft: '0.5rem' }}>← Active</span>}
                            </strong>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* Stock */}
              <div style={{ marginBottom: '1.25rem' }}>
                <span className={`badge ${inStock ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.8rem' }}>
                  {inStock ? `✓ In Stock (${product.stock} ${product.unit} available)` : '✗ Out of Stock'}
                </span>
              </div>

              {/* Quantity selector */}
              {inStock && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <label className="label">Quantity ({product.unit})</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <button className="btn btn-secondary" style={{ padding: '0.5rem' }}
                      onClick={() => setQty(Math.max(product.minOrderQty, qty - 1))}>
                      <Minus size={16} />
                    </button>
                    <input
                      type="number"
                      className="input"
                      value={qty}
                      min={product.minOrderQty}
                      max={product.stock}
                      onChange={(e) => {
                        const v = parseInt(e.target.value) || product.minOrderQty;
                        setQty(Math.max(product.minOrderQty, Math.min(product.stock, v)));
                      }}
                      style={{ textAlign: 'center', width: '100px', flexShrink: 0 }}
                    />
                    <button className="btn btn-secondary" style={{ padding: '0.5rem' }}
                      onClick={() => setQty(Math.min(product.stock, qty + 1))}>
                      <Plus size={16} />
                    </button>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      Min: {product.minOrderQty}
                    </span>
                  </div>
                </div>
              )}

              {/* Add to cart */}
              <button
                className={`btn btn-lg btn-full ${inStock ? 'btn-primary' : 'btn-secondary'}`}
                onClick={handleAddToCart}
                disabled={!inStock}
              >
                <ShoppingCart size={20} />
                {inStock ? `Add to Cart — ₹${total.toFixed(0)}` : 'Out of Stock'}
              </button>

              {!isLoggedIn && (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.75rem' }}>
                  You need to <Link href="/auth/login" style={{ color: 'var(--accent)' }}>login</Link> to place an order
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @media (max-width: 768px) {
          main > div > div:last-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
