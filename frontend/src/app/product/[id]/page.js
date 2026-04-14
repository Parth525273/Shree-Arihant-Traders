'use client';

import { useState, useEffect, use } from 'react';
import api from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ShoppingCart, ArrowLeft, Package, ShieldCheck, Truck, Minus, Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProductDetail({ params }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${productId}`);
        setProduct(data);
        setQuantity(data.minOrderQty || 1);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    addToCart(product, quantity);
    alert('Added to cart!');
  };

  const getPriceAtQty = (qty) => {
    if (!product) return 0;
    let price = product.basePrice;
    if (product.priceTiers && product.priceTiers.length > 0) {
      const applicableTier = [...product.priceTiers]
        .sort((a, b) => b.minQty - a.minQty)
        .find(tier => qty >= tier.minQty);
      if (applicableTier) price = applicableTier.price;
    }
    return price;
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const currentPrice = getPriceAtQty(quantity);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href={`/company/${product.companyId?._id}`} className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to {product.companyId?.name}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="bg-card rounded-3xl border border-border aspect-square flex items-center justify-center overflow-hidden relative">
          {product.images?.[0] && product.images[0] !== 'no-photo.jpg' ? (
            <img 
              src={product.images[0]} 
              alt={product.name} 
              className="w-full h-full object-cover" 
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className={cn(
            "flex items-center justify-center w-full h-full",
            product.images?.[0] && product.images[0] !== 'no-photo.jpg' ? "hidden" : "flex"
          )}>
            <Package className="w-40 h-40 text-muted" />
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase">
              {product.categoryId?.name}
            </span>
            <h1 className="mt-4 text-4xl font-extrabold text-foreground">{product.name}</h1>
            <p className="mt-2 text-xl text-muted-foreground">{product.companyId?.name}</p>
          </div>

          <div className="p-6 bg-muted/30 rounded-2xl border border-border">
            <div className="flex items-end gap-2 mb-4">
              <span className="text-4xl font-black text-foreground">₹{currentPrice}</span>
              <span className="text-muted-foreground mb-1">/ {product.unit}</span>
            </div>
            
            {product.priceTiers?.length > 0 && (
              <div className="space-y-3 mt-6 border-t border-border pt-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Volume Pricing</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-primary/5 p-3 rounded-lg border border-primary/10">
                    <p className="text-xs text-muted-foreground">Standard</p>
                    <p className="font-bold">₹{product.basePrice} / {product.unit}</p>
                  </div>
                  {product.priceTiers.map((tier, i) => (
                    <div key={i} className="bg-green-500/5 p-3 rounded-lg border border-green-500/10">
                      <p className="text-xs text-muted-foreground">{tier.minQty}+ {product.unit}s</p>
                      <p className="font-bold text-green-600">₹{tier.price} / {product.unit}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-bold text-muted-foreground uppercase">Quantity</label>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-border rounded-xl bg-card p-1">
                <button 
                  onClick={() => setQuantity(Math.max(product.minOrderQty || 1, quantity - 1))}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="w-16 text-center font-bold text-lg">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <span className="text-sm text-muted-foreground font-medium">
                Min. order: {product.minOrderQty || 1} {product.unit}
              </span>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-primary text-white font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
          >
            <ShoppingCart className="w-6 h-6" />
            {product.stock > 0 ? 'Add to Bulk Cart' : 'Out of Stock'}
          </button>

          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <ShieldCheck className="w-5 h-5 text-green-500" />
              Direct from Agency
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Truck className="w-5 h-5 text-blue-500" />
              Fast Wholesale Delivery
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-20 border-t border-border pt-12">
        <h2 className="text-2xl font-bold mb-6">Product Description</h2>
        <div className="text-lg leading-relaxed text-muted-foreground max-w-4xl">
          {product.description}
        </div>
      </div>
    </div>
  );
}
