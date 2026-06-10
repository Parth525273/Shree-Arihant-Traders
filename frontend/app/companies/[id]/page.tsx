// ─────────────────────────────────────────────────────────
// app/companies/[id]/page.tsx — Company Products Page
// Shows one company's products, with category tabs
// ─────────────────────────────────────────────────────────

'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Building2, Package } from 'lucide-react';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import ProductCard from '../../../components/ProductCard';
import { companyAPI, categoryAPI, productAPI } from '../../../lib/api';
import { Company, Category, Product } from '../../../types';

export default function CompanyProductsPage() {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<Company | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      companyAPI.getById(id),
      categoryAPI.getByCompany(id),
      productAPI.getAll({ company: id, limit: 100 }),
    ])
      .then(([compRes, catRes, prodRes]) => {
        setCompany((compRes as { company: Company }).company);
        setCategories((catRes as { categories: Category[] }).categories);
        setProducts((prodRes as { products: Product[] }).products);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  // Filter products by selected category
  const displayed = activeCategory === 'all'
    ? products
    : products.filter((p) =>
        typeof p.category === 'object'
          ? p.category._id === activeCategory
          : p.category === activeCategory
      );

  return (
    <>
      <Navbar />
      <main>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
            <div className="spinner" />
          </div>
        ) : !company ? (
          <div className="container" style={{ textAlign: 'center', padding: '5rem 1rem' }}>
            <h2>Company not found</h2>
            <Link href="/companies" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Back to Companies
            </Link>
          </div>
        ) : (
          <>
            {/* Company Header */}
            <div style={{
              background: 'linear-gradient(135deg, var(--bg-secondary), var(--bg-primary))',
              borderBottom: '1px solid var(--border)',
              padding: '2rem 0',
            }}>
              <div className="container">
                <Link href="/companies"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem', marginBottom: '1rem' }}>
                  <ArrowLeft size={14} /> Back to Companies
                </Link>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {/* Company logo */}
                  <div style={{
                    width: '64px', height: '64px', borderRadius: '12px',
                    overflow: 'hidden', background: 'var(--bg-primary)',
                    border: '1px solid var(--border)', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {company.logo
                      ? <img src={company.logo} alt={company.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <Building2 size={28} color="var(--text-muted)" strokeWidth={1.5} />
                    }
                  </div>
                  <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>
                      {company.name}
                    </h1>
                    {company.description && (
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        {company.description}
                      </p>
                    )}
                    <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 600 }}>
                      {products.length} products available
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="container" style={{ padding: '1.5rem 1rem' }}>
              {/* Category tabs */}
              {categories.length > 0 && (
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                  <button
                    className={`btn btn-sm ${activeCategory === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setActiveCategory('all')}
                  >
                    All ({products.length})
                  </button>
                  {categories.map((cat) => {
                    const count = products.filter((p) =>
                      typeof p.category === 'object' ? p.category._id === cat._id : p.category === cat._id
                    ).length;
                    return (
                      <button
                        key={cat._id}
                        className={`btn btn-sm ${activeCategory === cat._id ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setActiveCategory(cat._id)}
                      >
                        {cat.name} ({count})
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Products grid */}
              {displayed.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon"><Package size={48} strokeWidth={1} /></div>
                  <div className="empty-state-title">No products found</div>
                  <p style={{ color: 'var(--text-muted)' }}>
                    {activeCategory !== 'all' ? 'No products in this category.' : 'No products added yet.'}
                  </p>
                </div>
              ) : (
                <div className="grid-4">
                  {displayed.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </>
  );
}
