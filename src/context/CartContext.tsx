import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '@/api/axios';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface CartProduct {
  _id: string;
  name: string;
  images: { url: string }[];
  price: number;
  stock: number;
}

export interface CartItem {
  product: CartProduct;
  quantity: number;
  price: number;
}

interface CartContextType {
  items: CartItem[];
  totalPrice: number;
  cartCount: number;
  loading: boolean;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQty: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!token) { setItems([]); setTotalPrice(0); return; }
    setLoading(true);
    try {
      const { data } = await api.get('/cart');
      const cart = data.cart || data;
      setItems(cart.items || []);
      setTotalPrice(cart.totalPrice || 0);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { refreshCart(); }, [refreshCart]);

  const addToCart = async (productId: string, quantity: number) => {
    await api.post('/cart', { productId, quantity });
    await refreshCart();
    toast.success('Added to cart!');
  };

  const removeFromCart = async (productId: string) => {
    await api.delete(`/cart/${productId}`);
    await refreshCart();
    toast.success('Removed from cart');
  };

  const updateQty = async (productId: string, quantity: number) => {
    await api.put(`/cart/${productId}`, { quantity });
    await refreshCart();
  };

  const clearCart = async () => {
    try { await api.delete('/cart/clear'); } catch { /* ignore */ }
    setItems([]);
    setTotalPrice(0);
  };

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, totalPrice, cartCount, loading, addToCart, removeFromCart, updateQty, clearCart, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
};
