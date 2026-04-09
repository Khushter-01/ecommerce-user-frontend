import { Minus, Plus, Trash2 } from 'lucide-react';
import { IMAGE_BASE } from '@/api/axios';
import { useCart, CartItem as CartItemType } from '@/context/CartContext';
import { toast } from 'sonner';

const formatPrice = (n: number) => `₹${n.toLocaleString('en-IN')}`;

const CartItem = ({ item }: { item: CartItemType }) => {
  const { updateQty, removeFromCart } = useCart();

  const handleQty = async (newQty: number) => {
    if (newQty < 1 || newQty > item.product.stock) return;
    try { await updateQty(item.product._id, newQty); } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update');
    }
  };

  const handleRemove = async () => {
    try { await removeFromCart(item.product._id); } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to remove');
    }
  };

  return (
    <div className="flex gap-4 py-4 border-b border-border last:border-0">
      <img
        src={item.product.images?.[0]?.url ? `${IMAGE_BASE}${item.product.images[0].url}` : '/placeholder.svg'}
        alt={item.product.name}
        className="w-20 h-20 rounded-lg object-cover bg-surface"
      />
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-foreground truncate">{item.product.name}</h4>
        <p className="text-sm font-bold text-foreground mt-1">{formatPrice(item.price)}</p>
        <div className="flex items-center gap-2 mt-2">
          <button onClick={() => handleQty(item.quantity - 1)} className="w-7 h-7 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:bg-accent transition-colors">
            <Minus size={14} />
          </button>
          <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
          <button onClick={() => handleQty(item.quantity + 1)} className="w-7 h-7 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:bg-accent transition-colors">
            <Plus size={14} />
          </button>
        </div>
      </div>
      <button onClick={handleRemove} className="self-start p-2 text-muted-foreground hover:text-destructive transition-colors">
        <Trash2 size={16} />
      </button>
    </div>
  );
};

export default CartItem;
