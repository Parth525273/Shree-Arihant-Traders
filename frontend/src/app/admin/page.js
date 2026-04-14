'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { ShoppingBag, Users, Building2, IndianRupee, TrendingUp, Box } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/analytics/stats');
      setStats(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading stats...</div>;

  const cardStats = [
    { name: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { name: 'Total Revenue', value: `₹${stats.totalRevenue}`, icon: IndianRupee, color: 'text-green-500', bg: 'bg-green-500/10' },
    { name: 'Active Retailers', value: stats.totalCustomerCount, icon: Users, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { name: 'Active Agencies', value: stats.totalCompanyCount, icon: Building2, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Dashboard Overview</h2>
        <p className="text-muted-foreground">Real-time performance of your wholesale shop.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cardStats.map((item) => (
          <div key={item.name} className="bg-card p-6 rounded-2xl border border-border shadow-sm">
            <div className="flex items-center justify-between">
              <div className={item.bg + " p-3 rounded-xl " + item.color}>
                <item.icon className="w-6 h-6" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-sm font-medium text-muted-foreground mt-4">{item.name}</p>
            <p className="text-3xl font-black mt-1 text-foreground">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card p-8 rounded-2xl border border-border shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            Weekly Revenue Trend
            <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded">Last 7 Days</span>
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.dailyStats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                <XAxis dataKey="_id" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#121212', border: '1px solid #333', borderRadius: '8px' }}
                  itemStyle={{ color: '#f97316' }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={3} dot={{ r: 4, fill: '#f97316' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card p-8 rounded-2xl border border-border shadow-sm">
          <h3 className="text-lg font-bold mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a href="/admin/products" className="flex flex-col items-center justify-center p-6 rounded-xl border border-border hover:bg-muted transition-colors text-center">
              <div className="bg-primary/10 p-4 rounded-full text-primary mb-3">
                <Box className="w-8 h-8" />
              </div>
              <span className="font-bold">Add Product</span>
              <span className="text-xs text-muted-foreground">Update inventory</span>
            </a>
            <a href="/admin/orders" className="flex flex-col items-center justify-center p-6 rounded-xl border border-border hover:bg-muted transition-colors text-center">
              <div className="bg-blue-500/10 p-4 rounded-full text-blue-500 mb-3">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <span className="font-bold">Manage Orders</span>
              <span className="text-xs text-muted-foreground">Update statuses</span>
            </a>
          </div>
          
          <div className="mt-8 p-6 bg-primary/5 border border-primary/20 rounded-xl">
             <h4 className="font-bold text-primary mb-2">Shop Tip</h4>
             <p className="text-sm text-muted-foreground italic">
               "Keep your product stock updated to avoid order cancellations from retailers."
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
