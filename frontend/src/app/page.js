'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { Building2, ChevronRight, Info } from 'lucide-react';

export default function Home() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const { data } = await api.get('/companies');
        setCompanies(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching companies:', error);
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          Order Wholesale <span className="text-primary">Easily</span>
        </h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
          Choose from 40+ top food agencies and place your bulk orders in seconds.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {companies.map((company) => (
          <Link 
            key={company._id} 
            href={`/company/${company._id}`}
            className="group relative bg-card border border-border rounded-2xl p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div className="bg-primary/10 p-4 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 overflow-hidden w-16 h-16 flex items-center justify-center">
                {company.logo && company.logo !== 'no-photo.jpg' ? (
                  <img src={company.logo} alt={company.name} className="w-full h-full object-contain" />
                ) : (
                  <Building2 className="w-8 h-8" />
                )}
              </div>
              <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            
            <div className="mt-6">
              <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                {company.name}
              </h3>
              <p className="mt-2 text-muted-foreground line-clamp-2">
                {company.description || "Browse high-quality wholesale food products and snacks."}
              </p>
            </div>

            <div className="mt-6 flex items-center text-sm font-semibold text-primary">
              View Products
              <span className="ml-2 bg-primary/10 px-2 py-0.5 rounded text-[10px] items-center flex gap-1">
                <Info className="w-3 h-3" /> CLICK TO BROWSE
              </span>
            </div>
          </Link>
        ))}
      </div>

      {companies.length === 0 && (
        <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed border-border">
          <p className="text-lg text-muted-foreground font-medium">No companies available at the moment. Please check back later.</p>
        </div>
      )}
    </div>
  );
}
