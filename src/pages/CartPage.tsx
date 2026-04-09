import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import CartItemComponent from '@/components/CartItem';

const formatPrice = (n: number) => `₹${n.toLocaleString('en-IN')}`;

const CartPage = () => {
  const { items, loading } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 99;
  const tax = Math.round(subtotal * 0.09);
  const total = subtotal + shipping + tax;

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!items.length) return (
    <div className="container mx-auto px-4 py-20 text-center animate-fade-in">
      <ShoppingBag size={64} className="mx-auto text-muted mb-4" />
      <h2 className="text-xl font-bold text-foreground mb-2">Your cart is empty</h2>
      <p className="text-sm text-muted-foreground mb-6">Looks like you haven't added anything yet.</p>
      <Link to="/products" className="inline-flex h-11 px-6 items-center rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
        Continue Shopping
      </Link>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground mb-6">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
          {items.map(item => <CartItemComponent key={item.product._id} item={item} />)}
        </div>
        <div className="lg:col-span-1">
          <div className="sticky top-20 bg-card border border-border rounded-xl p-5 space-y-3">
            <h3 className="text-lg font-semibold text-foreground">Order Summary</h3>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span className="text-foreground">{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Shipping</span><span className="text-foreground">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Tax (9%)</span><span className="text-foreground">{formatPrice(tax)}</span></div>
            <div className="border-t border-border pt-3 flex justify-between font-bold text-foreground"><span>Total</span><span>{formatPrice(total)}</span></div>
            <button
              onClick={() => navigate(token ? '/checkout' : `/login?redirect=/checkout`)}
              className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
