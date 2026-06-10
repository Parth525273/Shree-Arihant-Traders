// ─────────────────────────────────────────────────────────
// components/CompanyCard.tsx — Company/Agency card
// ─────────────────────────────────────────────────────────

import Link from 'next/link';
import { Building2, ArrowRight } from 'lucide-react';
import { Company } from '../types';

interface Props {
  company: Company;
  productCount?: number;
}

export default function CompanyCard({ company, productCount }: Props) {
  return (
    <Link href={`/companies/${company._id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div className="card" style={{ padding: '1.5rem', height: '100%', cursor: 'pointer' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>

          {/* Logo or placeholder */}
          <div style={{
            width: '56px', height: '56px',
            borderRadius: '10px',
            overflow: 'hidden',
            flexShrink: 0,
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {company.logo ? (
              <img src={company.logo} alt={company.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <Building2 size={24} color="var(--text-muted)" strokeWidth={1.5} />
            )}
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              {company.name}
            </h3>
            {company.description && (
              <p style={{
                fontSize: '0.8rem', color: 'var(--text-secondary)',
                overflow: 'hidden', textOverflow: 'ellipsis',
                display: '-webkit-box', WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical', lineHeight: 1.5,
              }}>
                {company.description}
              </p>
            )}
            {productCount !== undefined && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600 }}>
                {productCount} products
              </div>
            )}
          </div>

          {/* Arrow */}
          <ArrowRight size={18} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: '4px' }} />
        </div>
      </div>
    </Link>
  );
}
