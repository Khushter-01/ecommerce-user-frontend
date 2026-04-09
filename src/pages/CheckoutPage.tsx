import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { IMAGE_BASE } from '@/api/axios';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

declare global {
  interface Window { Razorpay: any; }
}

const formatPrice = (n: number) => `₹${n.toLocaleString('en-IN')}`;

const CheckoutPage = () => {
  const { items, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  const defaultAddr = user?.addresses?.[0];
  const [address, setAddress] = useState({
    street: defaultAddr?.street || '',
    city: defaultAddr?.city || '',
    state: defaultAddr?.state || '',
    pincode: defaultAddr?.pincode || '',
    country: defaultAddr?.country || 'India',
  });

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 99;
  const tax = Math.round(subtotal * 0.09);
  const total = subtotal + shipping + tax;

  const handlePlaceOrder = async () => {
    if (!address.street || !address.city || !address.state || !address.pincode) {
      toast.error('Please fill in all address fields');
      return;
    }
    if (!items.length) { toast.error('Cart is empty'); return; }

    setProcessing(true);
    try {
      const orderItems = items.map(i => ({
        product: i.product._id,
        name: i.product.name,
        image: i.product.images?.[0]?.url || '',
        price: i.price,
        quantity: i.quantity,
      }));

      const { data } = await api.post('/orders/create-razorpay-order', {
        orderItems,
        shippingAddress: address,
        itemsPrice: subtotal,
        shippingPrice: shipping,
        taxPrice: tax,
        totalPrice: total,
      });

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: 'INR',
        name: 'ShopVibe',
        description: 'Order Payment',
        order_id: data.razorpayOrderId,
        handler: async (response: any) => {
          try {
            const orderId = data.order?._id || data.orderId;
            await api.post('/orders/verify-payment', {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              orderId,
            });
            await clearCart();
            navigate(`/order-success/${orderId}`);
          } catch (err: any) {
            toast.error(err.response?.data?.message || 'Payment verification failed');
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || '',
        },
        theme: { color: '#4F46E5' },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create order');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground mb-6">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Shipping */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Shipping Address</h2>
          <div className="space-y-3">
            {(['street', 'city', 'state', 'pincode', 'country'] as const).map(field => (
              <div key={field}>
                <label className="text-xs font-medium text-muted-foreground uppercase">{field}</label>
                <input
                  value={address[field]}
                  onChange={e => setAddress(p => ({ ...p, [field]: e.target.value }))}
                  className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring mt-1"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div>
          <div className="bg-card border border-border rounded-xl p-6 space-y-3">
            <h2 className="text-lg font-semibold text-foreground mb-2">Order Summary</h2>
            {items.map(item => (
              <div key={item.product._id} className="flex gap-3 py-2 border-b border-border last:border-0">
                <img src={item.product.images?.[0]?.url ? `${IMAGE_BASE}${item.product.images[0].url}` : '/placeholder.svg'} alt="" className="w-12 h-12 rounded-lg object-cover bg-surface" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{item.product.name}</p>
                  <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <span className="text-sm font-medium text-foreground">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
            <div className="pt-2 space-y-1.5">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Tax (9%)</span><span>{formatPrice(tax)}</span></div>
              <div className="border-t border-border pt-2 flex justify-between font-bold text-foreground"><span>Total</span><span>{formatPrice(total)}</span></div>
            </div>
            <button
              onClick={handlePlaceOrder}
              disabled={processing}
              className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 mt-3"
            >
              {processing ? 'Processing...' : 'Place Order & Pay'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
