import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api, { IMAGE_BASE } from '@/api/axios';
import OrderStatusBadge from '@/components/OrderStatusBadge';

const formatPrice = (n: number) => `₹${n.toLocaleString('en-IN')}`;

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`).then(r => setOrder(r.data.order || r.data)).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!order) return <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">Order not found</div>;

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Order Details</h1>
        <OrderStatusBadge status={order.orderStatus} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-card border border-border rounded-xl p-5">
            <h2 className="text-sm font-semibold text-foreground mb-3">Items</h2>
            {order.orderItems?.map((item: any, i: number) => (
              <div key={i} className="flex gap-3 py-3 border-b border-border last:border-0">
                <img src={item.image ? `${IMAGE_BASE}${item.image}` : '/placeholder.svg'} alt="" className="w-14 h-14 rounded-lg object-cover bg-surface" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                </div>
                <span className="text-sm font-medium text-foreground">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="bg-card border border-border rounded-xl p-5">
            <h2 className="text-sm font-semibold text-foreground mb-2">Shipping Address</h2>
            {order.shippingAddress && (
              <p className="text-sm text-muted-foreground">
                {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}, {order.shippingAddress.country}
              </p>
            )}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 h-fit space-y-2">
          <h2 className="text-sm font-semibold text-foreground mb-2">Price Breakdown</h2>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Items</span><span>{formatPrice(order.itemsPrice)}</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Shipping</span><span>{order.shippingPrice === 0 ? 'Free' : formatPrice(order.shippingPrice)}</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Tax</span><span>{formatPrice(order.taxPrice)}</span></div>
          <div className="border-t border-border pt-2 flex justify-between font-bold text-foreground"><span>Total</span><span>{formatPrice(order.totalPrice)}</span></div>

          <div className="pt-3 space-y-1">
            <p className="text-xs text-muted-foreground">Payment: <span className="font-medium text-foreground capitalize">{order.paymentInfo?.status || 'N/A'}</span></p>
            {order.paymentInfo?.paidAt && <p className="text-xs text-muted-foreground">Paid: {new Date(order.paymentInfo.paidAt).toLocaleString('en-IN')}</p>}
            <p className="text-xs text-muted-foreground">Ordered: {new Date(order.createdAt).toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
