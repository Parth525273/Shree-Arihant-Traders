// ─────────────────────────────────────────────────────────
// components/ProductCard.tsx — Product display card
// Shows image, name, company, pricing, stock, add-to-cart
// ─────────────────────────────────────────────────────────

'use client';
import Link from 'next/link';
import { ShoppingCart, Package, TrendingDown } from 'lucide-react';
import { Product } from '../types';
import { useCart, getPriceForQty } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  const basePrice = getPriceForQty(product.pricingTiers, product.minOrderQty);
  const hasBulkDiscount = product.pricingTiers.length > 1;
  const inStock = product.stock > 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Don't navigate to product page
    if (!isLoggedIn) {
      toast.error('Please login to add items to cart');
      router.push('/auth/login');
      return;
    }
    if (!inStock) {
      toast.error('Product is out of stock');
      return;
    }
    addToCart(product, product.minOrderQty);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <Link href={`/products/${product._id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div className="card" style={{ overflow: 'hidden', height: '100%', cursor: 'pointer' }}>

        {/* Product Image */}
        <div style={{ position: 'relative', paddingTop: '60%', background: 'var(--bg-secondary)' }}>
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-muted)',
            }}>
              <Package size={36} strokeWidth={1} />
              <span style={{ fontSize: '0.7rem', marginTop: '0.25rem' }}>No Image</span>
            </div>
          )}

          {/* Stock badge */}
          <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}>
            <span className={`badge ${inStock ? 'badge-success' : 'badge-danger'}`}>
              {inStock ? `${product.stock} left` : 'Out of Stock'}
            </span>
          </div>

          {/* Bulk discount indicator */}
          {hasBulkDiscount && (
            <div style={{ position: 'absolute', top: '0.5rem', left: '0.5rem' }}>
              <span className="badge badge-orange" style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                <TrendingDown size={10} /> Bulk Deal
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: '1rem' }}>
          {/* Company name */}
          <div style={{ fontSize: '0.72rem', color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
            {typeof product.company === 'object' ? product.company.name : ''}
          </div>

          {/* Product name */}
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem', lineHeight: 1.3 }}>
            {product.name}
          </h3>

          {/* Price + Unit */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              ₹{basePrice}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              / {product.unit}
            </span>
            {hasBulkDiscount && (
              <span style={{ fontSize: '0.72rem', color: 'var(--accent)', marginLeft: 'auto', flexShrink: 0 }}>
                Bulk discount ↓
              </span>
            )}
          </div>

          {/* Min order */}
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.875rem' }}>
            Min. order: {product.minOrderQty} {product.unit}
          </div>

          {/* Add to cart button */}
          <button
            className={`btn ${inStock ? 'btn-primary' : 'btn-secondary'} btn-sm btn-full`}
            onClick={handleAddToCart}
            disabled={!inStock}
            style={{ gap: '0.375rem' }}
          >
            <ShoppingCart size={14} />
            {inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </Link>
  );
}
