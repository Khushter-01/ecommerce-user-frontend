import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import api from '@/api/axios';

const formatPrice = (n: number) => `₹${n.toLocaleString('en-IN')}`;

const OrderSuccessPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    api.get(`/orders/${id}`).then(r => setOrder(r.data.order || r.data)).catch(() => {});
  }, [id]);

  return (
    <div className="container mx-auto px-4 py-20 text-center animate-fade-in">
      <div className="max-w-md mx-auto">
        <CheckCircle size={72} className="mx-auto text-success mb-4 animate-scale-in" />
        <h1 className="text-2xl font-bold text-foreground mb-2">Order Confirmed!</h1>
        <p className="text-sm text-muted-foreground mb-1">Order ID: <span className="font-mono font-medium text-foreground">{id}</span></p>
        {order && <p className="text-sm text-muted-foreground mb-6">Total: {formatPrice(order.totalPrice)}</p>}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/my-orders" className="h-11 px-6 inline-flex items-center justify-center rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
            Track My Orders
          </Link>
          <Link to="/products" className="h-11 px-6 inline-flex items-center justify-center rounded-xl border-2 border-border text-foreground font-semibold hover:bg-accent transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
