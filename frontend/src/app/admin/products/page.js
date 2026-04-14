'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Plus, Pencil, Trash2, X, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ companyId: '', categoryId: '', search: '' });
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddingQuickCategory, setIsAddingQuickCategory] = useState(false);
  const [quickCategoryName, setQuickCategoryName] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    companyId: '',
    categoryId: '',
    basePrice: '',
    unit: 'Box',
    stock: 0,
    imageUrl: '',
    priceTiers: []
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  useEffect(() => {
    if (formData.companyId) {
      fetchCategories(formData.companyId);
    }
  }, [formData.companyId]);

  const fetchInitialData = async () => {
    try {
      const { data } = await api.get('/companies');
      setCompanies(data);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const fetchCategories = async (companyId) => {
    try {
      const { data } = await api.get(`/categories/${companyId}`);
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(filters);
      const { data } = await api.get(`/products?${params}`);
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        companyId: product.companyId?._id || product.companyId,
        categoryId: product.categoryId?._id || product.categoryId,
        basePrice: product.basePrice,
        unit: product.unit,
        stock: product.stock,
        imageUrl: product.images?.[0] || '',
        priceTiers: product.priceTiers || []
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        companyId: companies[0]?._id || '',
        categoryId: '',
        basePrice: '',
        unit: 'Box',
        stock: 0,
        imageUrl: '',
        priceTiers: []
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, { ...formData, images: [formData.imageUrl] });
      } else {
        await api.post('/products', { ...formData, images: [formData.imageUrl] });
      }
      setShowModal(false);
      fetchProducts();
    } catch (error) {
      alert(error.response?.data?.message || 'Something went wrong');
    }
  };

  const addTier = () => {
    setFormData({
      ...formData,
      priceTiers: [...formData.priceTiers, { minQty: '', price: '' }]
    });
  };

  const removeTier = (index) => {
    const newTiers = formData.priceTiers.filter((_, i) => i !== index);
    setFormData({ ...formData, priceTiers: newTiers });
  };

  const handleTierChange = (index, field, value) => {
    const newTiers = [...formData.priceTiers];
    newTiers[index][field] = value;
    setFormData({ ...formData, priceTiers: newTiers });
  };

  const handleQuickCategoryAdd = async () => {
    if (!quickCategoryName.trim() || !formData.companyId) return;
    try {
      const { data } = await api.post('/categories', { 
        name: quickCategoryName, 
        companyId: formData.companyId 
      });
      setCategories([...categories, data]);
      setFormData({ ...formData, categoryId: data._id });
      setQuickCategoryName('');
      setIsAddingQuickCategory(false);
    } catch (error) {
      alert('Error adding category');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Products</h2>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center bg-card p-4 rounded-xl border border-border">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm"
            placeholder="Search products..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
        <select 
          className="px-4 py-2 bg-background border border-border rounded-lg text-sm"
          value={filters.companyId}
          onChange={(e) => setFilters({ ...filters, companyId: e.target.value, categoryId: '' })}
        >
          <option value="">All Companies</option>
          {companies.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        {filters.companyId && (
          <select 
            className="px-4 py-2 bg-background border border-border rounded-lg text-sm"
            value={filters.categoryId}
            onChange={(e) => setFilters({ ...filters, categoryId: e.target.value })}
          >
            <option value="">All Categories</option>
            {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        )}
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase">Product</th>
              <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase">Company</th>
              <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase">Base Price</th>
              <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase">Stock</th>
              <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr><td colSpan="5" className="px-6 py-8 text-center text-muted-foreground">Loading products...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan="5" className="px-6 py-8 text-center text-muted-foreground">No products found.</td></tr>
            ) : (
              products.map((p) => (
                <tr key={p._id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.categoryId?.name}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{p.companyId?.name}</td>
                  <td className="px-6 py-4 font-medium">₹{p.basePrice} <span className="text-xs text-muted-foreground">/ {p.unit}</span></td>
                  <td className="px-6 py-4 text-sm">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      p.stock > 10 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    )}>
                      {p.stock} {p.unit}s
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => handleOpenModal(p)} className="p-2 text-muted-foreground hover:text-primary"><Pencil className="w-4 h-4" /></button>
                    <button className="p-2 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
          <div className="bg-card w-full max-w-2xl rounded-2xl border border-border shadow-2xl p-6 my-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={() => setShowModal(false)}><X className="w-6 h-6 text-muted-foreground" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Product Name</label>
                  <input className="w-full px-3 py-2 bg-background border border-border rounded-lg" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Company</label>
                  <select className="w-full px-3 py-2 bg-background border border-border rounded-lg" value={formData.companyId} onChange={(e) => setFormData({...formData, companyId: e.target.value, categoryId: ''})} required>
                    <option value="">Select Company</option>
                    {companies.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 flex justify-between">
                    Category
                    {!isAddingQuickCategory && (
                      <button 
                        type="button" 
                        onClick={() => setIsAddingQuickCategory(true)}
                        className="text-xs text-primary font-bold hover:underline"
                      >
                        + Quick Add
                      </button>
                    )}
                  </label>
                  {isAddingQuickCategory ? (
                    <div className="flex gap-2">
                      <input 
                        className="flex-1 px-3 py-1.5 bg-background border border-primary rounded-lg text-sm"
                        placeholder="New category..."
                        value={quickCategoryName}
                        onChange={(e) => setQuickCategoryName(e.target.value)}
                        autoFocus
                      />
                      <button 
                        type="button" 
                        onClick={handleQuickCategoryAdd}
                        className="px-3 bg-primary text-white rounded-lg text-xs font-bold"
                      >
                        Save
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setIsAddingQuickCategory(false)}
                        className="text-muted-foreground"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <select 
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg" 
                        value={formData.categoryId} 
                        onChange={(e) => setFormData({...formData, categoryId: e.target.value})} 
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                  )}
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Unit (Box/Kg/etc)</label>
                    <input className="w-full px-3 py-2 bg-background border border-border rounded-lg" value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Base Price (₹)</label>
                  <input type="number" className="w-full px-3 py-2 bg-background border border-border rounded-lg" value={formData.basePrice} onChange={(e) => setFormData({...formData, basePrice: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Initial Stock</label>
                  <input type="number" className="w-full px-3 py-2 bg-background border border-border rounded-lg" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} required />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Product Image URL</label>
                  <input className="w-full px-3 py-2 bg-background border border-border rounded-lg" placeholder="https://example.com/photo.jpg" value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea className="w-full px-3 py-2 bg-background border border-border rounded-lg" rows={2} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required />
              </div>

              {/* Price Tiers */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Bulk Pricing Tiers (Optional)</label>
                  <button type="button" onClick={addTier} className="text-xs text-primary font-bold">+ Add Tier</button>
                </div>
                {formData.priceTiers.map((tier, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <input type="number" placeholder="Min Qty" className="w-1/2 px-2 py-1 bg-background border border-border rounded" value={tier.minQty} onChange={(e) => handleTierChange(index, 'minQty', e.target.value)} />
                    <input type="number" placeholder="Price" className="w-1/2 px-2 py-1 bg-background border border-border rounded" value={tier.price} onChange={(e) => handleTierChange(index, 'price', e.target.value)} />
                    <button type="button" onClick={() => removeTier(index)} className="text-destructive">×</button>
                  </div>
                ))}
              </div>

              <button type="submit" className="w-full py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90">
                {editingProduct ? 'Update Product' : 'Create Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
