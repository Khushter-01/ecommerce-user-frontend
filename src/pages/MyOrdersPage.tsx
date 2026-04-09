import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '@/api/axios';
import OrderStatusBadge from '@/components/OrderStatusBadge';
import { Package } from 'lucide-react';

const formatPrice = (n: number) => `₹${n.toLocaleString('en-IN')}`;

const MyOrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my-orders').then(r => setOrders(r.data.orders || r.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground mb-6">My Orders</h1>

      {!orders.length ? (
        <div className="text-center py-20">
          <Package size={64} className="mx-auto text-muted mb-4" />
          <h2 className="text-lg font-medium text-foreground mb-1">No orders yet</h2>
          <p className="text-sm text-muted-foreground mb-4">Start shopping to see your orders here.</p>
          <Link to="/products" className="inline-flex h-11 px-6 items-center rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">Browse Products</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <Link key={order._id} to={`/orders/${order._id}`} className="block bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Order ID</p>
                  <p className="text-sm font-mono font-medium text-foreground">{order._id}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="text-sm text-foreground">{new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Items</p>
                  <p className="text-sm text-foreground">{order.orderItems?.length || 0}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="text-sm font-bold text-foreground">{formatPrice(order.totalPrice)}</p>
                </div>
                <OrderStatusBadge status={order.orderStatus} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
