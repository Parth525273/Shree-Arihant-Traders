'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Package, Clock, CheckCircle2, Truck, Box } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/myorders');
        setOrders(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };
    if (user) fetchOrders();
  }, [user]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-5 h-5 text-orange-500" />;
      case 'packed': return <Box className="w-5 h-5 text-blue-500" />;
      case 'dispatched': return <Truck className="w-5 h-5 text-purple-500" />;
      case 'delivered': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      default: return null;
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
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-black mb-4">My Dashboard</h1>
        
        {/* Retailer Info Card */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xl">
              {user?.shopName?.[0]}
            </div>
            <div>
              <h2 className="text-xl font-bold">{user?.shopName}</h2>
              <p className="text-sm text-muted-foreground">{user?.name} · Retailer</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="font-bold text-foreground">Mobile:</span> {user?.mobile}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="font-bold text-foreground">Email:</span> {user?.email}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground sm:col-span-2">
              <span className="font-bold text-foreground">Address:</span> {user?.address}
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Package className="w-6 h-6 text-primary" />
        Order History
      </h2>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-border bg-muted/20 flex flex-wrap justify-between items-center gap-4">
              <div>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Order Number</p>
                <p className="text-lg font-black">{order.orderNumber}</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-background rounded-xl border border-border">
                {getStatusIcon(order.status)}
                <span className="font-bold capitalize">{order.status}</span>
              </div>
              <div>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Total Amount</p>
                <p className="text-lg font-black text-primary">₹{order.totalAmount}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Payment</p>
                <span className={cn(
                  "px-3 py-1 rounded-full text-xs font-bold uppercase",
                  order.paymentStatus === 'received' ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                )}>
                  {order.paymentStatus === 'received' ? 'PAID' : 'PENDING'}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                        <Package className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <span className="font-semibold">{item.productName} <span className="text-muted-foreground ml-1">x {item.qty}</span></span>
                    </div>
                    <span className="font-bold">₹{item.priceAtOrder * item.qty}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-border flex justify-between items-center">
                <p className="text-xs text-muted-foreground italic">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                {order.paymentStatus === 'pending' && (
                  <button className="text-xs font-bold text-primary hover:underline">Download Proforma Invoice</button>
                )}
              </div>
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed border-border">
            <p className="text-lg text-muted-foreground font-medium">You haven't placed any orders yet.</p>
            <Link href="/" className="mt-4 inline-block text-primary font-bold">Browse Products Now</Link>
          </div>
        )}
      </div>
    </div>
  );
}
