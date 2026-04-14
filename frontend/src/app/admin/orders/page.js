'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Box, 
  MoreHorizontal,
  CreditCard,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders');
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      fetchOrders();
    } catch (error) {
      alert('Error updating status');
    }
  };

  const markPaymentReceived = async (orderId) => {
    try {
      await api.put(`/orders/${orderId}/payment`, { paymentStatus: 'received' });
      fetchOrders();
    } catch (error) {
      alert('Error updating payment');
    }
  };

  const filteredOrders = orders.filter(o => 
    o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.retailerId?.shopName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Manage Orders</h2>
      </div>

      <div className="flex flex-wrap gap-4 items-center bg-card p-4 rounded-xl border border-border">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm"
            placeholder="Search by Order # or Shop Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase">Order Details</th>
              <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase">Customer</th>
              <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase">Amount</th>
              <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase">Payment</th>
              <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-sm">
            {loading ? (
              <tr><td colSpan="6" className="px-6 py-8 text-center text-muted-foreground">Loading orders...</td></tr>
            ) : filteredOrders.length === 0 ? (
              <tr><td colSpan="6" className="px-6 py-8 text-center text-muted-foreground">No orders found.</td></tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order._id} className="hover:bg-muted/30">
                  <td className="px-6 py-4 font-bold">{order.orderNumber}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">{order.retailerId?.shopName}</div>
                    <div className="text-xs text-muted-foreground">{order.retailerId?.name}</div>
                  </td>
                  <td className="px-6 py-4 font-black text-primary">₹{order.totalAmount}</td>
                  <td className="px-6 py-4">
                    <select 
                      value={order.status}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      className={cn(
                        "px-2 py-1 rounded text-xs font-bold uppercase bg-background border border-border outline-none",
                        order.status === 'delivered' ? "text-green-600 border-green-200" : "text-orange-600 border-orange-200"
                      )}
                    >
                      <option value="pending">Pending</option>
                      <option value="packed">Packed</option>
                      <option value="dispatched">Dispatched</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "px-2 py-0.5 rounded text-[10px] font-black uppercase",
                        order.paymentStatus === 'received' ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                      )}>
                        {order.paymentStatus === 'received' ? 'Received' : 'Pending'}
                      </span>
                      {order.paymentStatus !== 'received' && (
                        <button 
                          onClick={() => markPaymentReceived(order._id)}
                          className="text-primary hover:text-primary/80" 
                          title="Mark as Received"
                        >
                          <CreditCard className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <a 
                        href={`https://wa.me/91${order.retailerId?.mobile}`} 
                        target="_blank" 
                        className="p-2 text-muted-foreground hover:text-green-500"
                        title="Chat with Customer"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
