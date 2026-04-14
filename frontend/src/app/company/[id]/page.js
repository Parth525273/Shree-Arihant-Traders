'use client';

import { useState, useEffect, use } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { ShoppingCart, ArrowLeft, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CompanyProducts({ params }) {
  const resolvedParams = use(params);
  const companyId = resolvedParams.id;

  const [company, setCompany] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [companyId]);

  useEffect(() => {
    fetchProducts();
  }, [companyId, activeCategory]);

  const fetchData = async () => {
    try {
      const [companyRes, categoriesRes] = await Promise.all([
        api.get(`/companies/${companyId}`),
        api.get(`/categories/${companyId}`)
      ]);
      setCompany(companyRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Error fetching company data:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      let url = `/products?companyId=${companyId}`;
      if (activeCategory) url += `&categoryId=${activeCategory}`;
      const { data } = await api.get(url);
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Agencies
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">{company?.name}</h1>
          <p className="mt-2 text-lg text-muted-foreground">{company?.description || "Browse available wholesale products."}</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Filters */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="sticky top-28 space-y-6">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setActiveCategory('')}
                  className={cn(
                    "w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    activeCategory === '' ? "bg-primary text-white" : "hover:bg-muted"
                  )}
                >
                  All Products
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => setActiveCategory(cat._id)}
                    className={cn(
                      "w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                      activeCategory === cat._id ? "bg-primary text-white" : "hover:bg-muted"
                    )}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {products.map((product) => (
              <Link
                key={product._id}
                href={`/product/${product._id}`}
                className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter">
                      {product.categoryId?.name}
                    </span>
                    <span className={cn(
                      "text-[10px] font-bold",
                      product.stock > 0 ? "text-green-500" : "text-red-500"
                    )}>
                      {product.stock > 0 ? 'STOCK AVAILABLE' : 'OUT OF STOCK'}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  
                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <span className="text-2xl font-bold text-foreground">₹{product.basePrice}</span>
                      <span className="text-xs text-muted-foreground ml-1">/{product.unit}</span>
                    </div>
                    {product.priceTiers?.length > 0 && (
                      <div className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded">
                         BULK DISCOUNTS
                      </div>
                    )}
                  </div>
                  
                  <button className="mt-6 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-muted text-foreground font-semibold text-sm group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <Tag className="w-4 h-4" />
                    View Details
                  </button>
                </div>
              </Link>
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No products found for this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
