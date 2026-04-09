import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { IMAGE_BASE } from '@/api/axios';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface Product {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  images: { url: string }[];
  category?: string;
  ratings?: number;
  numReviews?: number;
  stock: number;
}

const formatPrice = (n: number) => `₹${n.toLocaleString('en-IN')}`;

const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();
  const isOnSale = product.discountPrice && product.discountPrice > 0;
  const displayPrice = isOnSale ? product.discountPrice! : product.price;
  const outOfStock = product.stock <= 0;
  const discount = isOnSale ? Math.round(((product.price - product.discountPrice!) / product.price) * 100) : 0;

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!token) { navigate('/login'); return; }
    if (outOfStock) return;
    try {
      await addToCart(product._id, 1);
      toast.success('Added to cart!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  return (
    <Link to={`/products/${product._id}`} className="group block">
      <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300">
        <div className="relative aspect-square overflow-hidden bg-surface">
          <img
            src={product.images?.[0]?.url ? `${IMAGE_BASE}${product.images[0].url}` : '/placeholder.svg'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Wishlist heart */}
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            className="absolute top-3 right-3 p-2 rounded-full bg-card/80 backdrop-blur border border-border text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
          >
            <Heart size={16} />
          </button>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {isOnSale && (
              <span className="bg-destructive text-destructive-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
                -{discount}%
              </span>
            )}
            {product.ratings && product.ratings >= 4.5 && (
              <span className="bg-warning text-warning-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
                Top Item
              </span>
            )}
          </div>

          {/* Rating overlay */}
          {product.ratings !== undefined && product.ratings > 0 && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-card/80 backdrop-blur px-2 py-1 rounded-full">
              <Star size={12} className="fill-warning text-warning" />
              <span className="text-[11px] font-semibold text-foreground">{product.ratings?.toFixed(1)}/5</span>
            </div>
          )}

          {outOfStock && (
            <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
              <span className="bg-destructive text-destructive-foreground text-xs font-bold px-3 py-1 rounded-full">Out of Stock</span>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-sm font-semibold text-foreground line-clamp-2 mb-2 min-h-[2.5rem]">{product.name}</h3>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {isOnSale && <span className="text-xs text-muted-foreground line-through">{formatPrice(product.price)}</span>}
              <span className="text-sm font-bold text-foreground flex items-center gap-1">
                <ShoppingCart size={14} className="text-primary" />
                {formatPrice(displayPrice)}
              </span>
            </div>
            {!outOfStock && (
              <button
                onClick={handleAdd}
                className="p-2 rounded-full gradient-bg text-primary-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-md"
              >
                <ShoppingCart size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
