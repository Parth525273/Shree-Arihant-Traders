'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { 
  Users, 
  Mail, 
  Phone, 
  MapPin, 
  Store, 
  Search,
  MessageSquare
} from 'lucide-react';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const { data } = await api.get('/admin/customers');
      setCustomers(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.mobile.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground font-black">Retailer Directory</h2>
        <p className="text-muted-foreground font-medium">Manage and contact all registered shopkeepers.</p>
      </div>

      <div className="bg-card p-4 rounded-xl border border-border">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm outline-none focus:ring-1 focus:ring-primary"
            placeholder="Search by name, shop or mobile..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center text-muted-foreground uppercase font-bold tracking-widest animate-pulse">Loading directory...</div>
        ) : filteredCustomers.length === 0 ? (
          <div className="col-span-full py-20 text-center text-muted-foreground italic">No retailers found matching your search.</div>
        ) : (
          filteredCustomers.map((customer) => (
            <div key={customer._id} className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-primary/10 p-3 rounded-xl text-primary">
                    <Store className="w-6 h-6" />
                  </div>
                  <a 
                    href={`https://wa.me/91${customer.mobile}`} 
                    target="_blank" 
                    className="p-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500 hover:text-white transition-all"
                  >
                    <MessageSquare className="w-5 h-5" />
                  </a>
                </div>
                
                <h3 className="text-xl font-black text-foreground">{customer.shopName}</h3>
                <p className="text-sm font-bold text-primary mb-6 uppercase tracking-tight">{customer.name}</p>

                <div className="space-y-3 pt-4 border-t border-border">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    <Phone className="w-4 h-4" />
                    <span>{customer.mobile}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                    <span className="line-clamp-2 italic">{customer.address}</span>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 bg-muted/20 border-t border-border flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                <span>Joined {new Date(customer.createdAt).toLocaleDateString()}</span>
                <span>Active</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
