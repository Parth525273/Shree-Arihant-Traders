// ─────────────────────────────────────────────────────────
// app/companies/page.tsx — All Companies Page
// Lists all agencies/companies with search filter
// ─────────────────────────────────────────────────────────

'use client';
import { useEffect, useState } from 'react';
import { Search, Building2 } from 'lucide-react';
import Navbar from '../../components/Navbar';
import CompanyCard from '../../components/CompanyCard';
import { companyAPI } from '../../lib/api';
import { Company } from '../../types';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filtered, setFiltered] = useState<Company[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    companyAPI.getAll()
      .then((res) => {
        const list = (res as { companies: Company[] }).companies;
        setCompanies(list);
        setFiltered(list);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Filter companies by search
  useEffect(() => {
    if (!search.trim()) {
      setFiltered(companies);
    } else {
      const q = search.toLowerCase();
      setFiltered(companies.filter((c) =>
        c.name.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q)
      ));
    }
  }, [search, companies]);

  return (
    <>
      <Navbar />
      <main>
        {/* Page Header */}
        <div style={{
          background: 'linear-gradient(135deg, var(--bg-secondary), var(--bg-primary))',
          borderBottom: '1px solid var(--border)',
          padding: '2.5rem 0',
        }}>
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div style={{
                width: '36px', height: '36px', background: 'var(--accent-light)',
                border: '1px solid var(--accent-border)', borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Building2 size={18} color="var(--accent)" />
              </div>
              <h1 className="page-title">All Companies</h1>
            </div>
            <p className="page-subtitle">
              Browse products from our {companies.length} partner agencies
            </p>

            {/* Search */}
            <div className="input-with-icon" style={{ maxWidth: '400px', marginTop: '1.25rem' }}>
              <Search size={16} className="input-icon" />
              <input
                className="input"
                type="text"
                placeholder="Search companies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Companies Grid */}
        <div className="container" style={{ padding: '2rem 1rem' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
              <div className="spinner" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🏢</div>
              <div className="empty-state-title">
                {search ? 'No companies found' : 'No companies yet'}
              </div>
              <p style={{ color: 'var(--text-muted)' }}>
                {search ? `No match for "${search}"` : 'Admin will add companies soon!'}
              </p>
            </div>
          ) : (
            <>
              {search && (
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                  Showing {filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{search}"
                </p>
              )}
              <div className="grid-2">
                {filtered.map((company) => (
                  <CompanyCard key={company._id} company={company} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
