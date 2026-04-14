'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import Link from 'next/link';
import { CheckCircle2, MessageSquare, ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [notes, setNotes] = useState('');

  const getPriceAtQty = (item) => {
    let price = item.basePrice;
    if (item.priceTiers?.length > 0) {
      const applicableTier = [...item.priceTiers]
        .sort((a, b) => b.minQty - a.minQty)
        .find(tier => item.quantity >= tier.minQty);
      if (applicableTier) price = applicableTier.price;
    }
    return price;
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    try {
      const orderData = {
        items: cartItems.map(item => ({
          productId: item._id,
          productName: item.name,
          qty: item.quantity,
          priceAtOrder: getPriceAtQty(item)
        })),
        totalAmount: getCartTotal(),
        notes
      };

      const { data } = await api.post('/orders', orderData);
      setOrderSuccess(data);
      clearCart();
    } catch (error) {
      alert(error.response?.data?.message || 'Error placing order');
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateWhatsAppLink = (order) => {
    const shopNumber = "919403153875"; // International format for 9403153875
    let message = `*NEW ORDER: ${order.orderNumber}*\n\n`;
    message += `Customer: ${user?.name} (${user?.shopName})\n`;
    message += `-------------------\n`;
    
    order.items.forEach(item => {
      message += `• ${item.productName} x ${item.qty} = ₹${item.priceAtOrder * item.qty}\n`;
    });
    
    message += `-------------------\n`;
    message += `*Total Amount: ₹${order.totalAmount}*\n\n`;
    message += `Please confirm the order and shared payment details.`;

    return `https://wa.me/${shopNumber}?text=${encodeURIComponent(message)}`;
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">Please login to checkout</h2>
        <Link href="/login" className="bg-primary text-white px-6 py-2 rounded-lg">Login Now</Link>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle2 className="w-20 h-20 text-green-500" />
        </div>
        <h1 className="text-4xl font-black mb-4">Order Placed Successfully!</h1>
        <p className="text-xl text-muted-foreground mb-4">Order Number: <span className="font-bold text-foreground">{orderSuccess.orderNumber}</span></p>
        <p className="text-muted-foreground mb-12">
          Your order has been recorded. To finish the process, please click the button below to send details to our WhatsApp for confirmation.
        </p>
        
        <div className="flex flex-col gap-4">
          <div className="bg-card p-6 rounded-2xl border-2 border-dashed border-primary/20 mb-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-primary mb-4">Pay via QR (Optional)</h4>
            <div className="w-48 h-48 bg-muted mx-auto rounded-lg flex items-center justify-center border border-border">
              <span className="text-xs text-muted-foreground uppercase font-black text-center px-4">Admin QR Code Placeholder</span>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">Scan to pay or pay via Cash on Delivery.</p>
          </div>

          <a
            href={generateWhatsAppLink(orderSuccess)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#128C7E] text-white py-4 rounded-2xl font-bold text-xl transition-all shadow-xl shadow-green-500/20"
          >
            <MessageSquare className="w-6 h-6" />
            Send to WhatsApp
          </a>
          <Link href="/orders" className="text-primary font-bold hover:underline">
            View My Order History
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/cart" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Cart
      </Link>
      
      <h1 className="text-4xl font-black mb-12">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
            <h3 className="text-lg font-bold mb-4">Delivery & Contact</h3>
            <div className="space-y-2 text-sm">
              <p><span className="text-muted-foreground">Shop Name:</span> {user.shopName}</p>
              <p><span className="text-muted-foreground">Name:</span> {user.name}</p>
              <p><span className="text-muted-foreground">Mobile:</span> {user.mobile}</p>
              <p><span className="text-muted-foreground">Address:</span> {user.address}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-muted-foreground uppercase mb-2">Order Notes (Optional)</label>
            <textarea
              className="w-full p-4 bg-background border border-border rounded-xl focus:ring-1 focus:ring-primary outline-none min-h-[100px]"
              placeholder="Any special instructions or delivery details..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-card p-8 rounded-3xl border border-border shadow-xl h-fit">
          <h3 className="text-xl font-bold mb-6">Final Summary</h3>
          <div className="space-y-3 mb-8">
            <div className="flex justify-between text-muted-foreground">
              <span>Items Total</span>
              <span>{cartItems.length} styles</span>
            </div>
            <div className="pt-4 border-t border-border flex justify-between items-center">
              <span className="text-lg font-bold">Total Amount</span>
              <span className="text-2xl font-black text-primary">₹{getCartTotal()}</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={isSubmitting || cartItems.length === 0}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-primary text-white font-bold text-lg hover:bg-primary/90 transition-all shadow-lg disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Confirm Order'}
          </button>
        </div>
      </div>
    </div>
  );
}
