'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

export default function CategoriesPage() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '' });

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (selectedCompany) {
      fetchCategories(selectedCompany);
    } else {
      setCategories([]);
    }
  }, [selectedCompany]);

  const fetchCompanies = async () => {
    try {
      const { data } = await api.get('/companies');
      setCompanies(data);
      if (data.length > 0) setSelectedCompany(data[0]._id);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const fetchCategories = async (companyId) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/categories/${companyId}`);
      setCategories(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setLoading(false);
    }
  };

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({ name: category.name });
    } else {
      setEditingCategory(null);
      setFormData({ name: '' });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory._id}`, formData);
      } else {
        await api.post('/categories', { ...formData, companyId: selectedCompany });
      }
      setShowModal(false);
      fetchCategories(selectedCompany);
    } catch (error) {
      alert(error.response?.data?.message || 'Something went wrong');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await api.delete(`/categories/${id}`);
        fetchCategories(selectedCompany);
      } catch (error) {
        alert('Error deleting category');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Categories</h2>
        <div className="flex gap-4 items-center">
          <select 
            value={selectedCompany} 
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="px-4 py-2 bg-card border border-border rounded-lg text-sm"
          >
            <option value="">Select Company</option>
            {companies.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          <button
            onClick={() => handleOpenModal()}
            disabled={!selectedCompany}
            className="flex items-center px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </button>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category Name</th>
              <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {!selectedCompany ? (
              <tr><td colSpan="2" className="px-6 py-8 text-center text-muted-foreground">Please select a company to view categories.</td></tr>
            ) : loading ? (
              <tr><td colSpan="2" className="px-6 py-8 text-center text-muted-foreground">Loading categories...</td></tr>
            ) : categories.length === 0 ? (
              <tr><td colSpan="2" className="px-6 py-8 text-center text-muted-foreground">No categories found for this company.</td></tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat._id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{cat.name}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => handleOpenModal(cat)} className="p-2 text-muted-foreground hover:text-primary transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(cat._id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-card w-full max-w-md rounded-2xl border border-border shadow-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">{editingCategory ? 'Edit Category' : 'Add New Category'}</h3>
              <button onClick={() => setShowModal(false)}><X className="w-6 h-6 text-muted-foreground" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category Name</label>
                <input
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                  value={formData.name}
                  onChange={(e) => setFormData({ name: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="w-full py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90">
                {editingCategory ? 'Update' : 'Create'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
