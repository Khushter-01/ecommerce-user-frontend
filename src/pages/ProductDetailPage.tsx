import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Minus, Plus, ShoppingCart, Zap } from 'lucide-react';
import api, { IMAGE_BASE } from '@/api/axios';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import ReviewCard from '@/components/ReviewCard';
import AddReviewForm from '@/components/AddReviewForm';
import { toast } from 'sonner';

const formatPrice = (n: number) => `₹${n.toLocaleString('en-IN')}`;

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user, token } = useAuth();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);

  const fetchProduct = () => {
    setLoading(true);
    api.get(`/products/${id}`).then(r => {
      setProduct(r.data.product || r.data);
      setSelectedImage(0);
    }).catch(() => toast.error('Product not found')).finally(() => setLoading(false));
  };

  useEffect(() => { fetchProduct(); }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!product) return (
    <div className="container mx-auto px-4 py-20 text-center">
      <p className="text-lg text-muted-foreground">Product not found</p>
    </div>
  );

  const isOnSale = product.discountPrice && product.discountPrice > 0;
  const displayPrice = isOnSale ? product.discountPrice : product.price;
  const outOfStock = product.stock <= 0;
  const userHasReviewed = user && product.reviews?.some((r: any) => r.user === user._id);

  const handleAdd = async () => {
    if (!token) { navigate('/login'); return; }
    setAdding(true);
    try { await addToCart(product._id, qty); } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setAdding(false); }
  };

  const handleBuyNow = async () => {
    if (!token) { navigate('/login'); return; }
    setAdding(true);
    try { await addToCart(product._id, qty); navigate('/cart'); } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setAdding(false); }
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Images */}
        <div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-surface border border-border mb-3">
            <img
              src={product.images?.[selectedImage]?.url ? `${IMAGE_BASE}${product.images[selectedImage].url}` : '/placeholder.svg'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((img: any, i: number) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors flex-shrink-0 ${
                    i === selectedImage ? 'border-primary' : 'border-border'
                  }`}
                >
                  <img src={`${IMAGE_BASE}${img.url}`} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{product.name}</h1>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16} className={i < Math.round(product.ratings || 0) ? 'fill-warning text-warning' : 'text-muted'} />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">({product.numReviews} reviews)</span>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl font-bold text-foreground">{formatPrice(displayPrice)}</span>
            {isOnSale && <span className="text-lg text-muted-foreground line-through">{formatPrice(product.price)}</span>}
          </div>

          <div className="flex items-center gap-2 mb-4">
            {outOfStock ? (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-destructive/10 text-destructive">Out of Stock</span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-success/10 text-success">In Stock ({product.stock})</span>
            )}
          </div>

          {product.brand && <p className="text-sm text-muted-foreground mb-1"><span className="font-medium text-foreground">Brand:</span> {product.brand}</p>}
          {product.category && <p className="text-sm text-muted-foreground mb-4"><span className="font-medium text-foreground">Category:</span> {product.category}</p>}

          <p className="text-sm text-muted-foreground leading-relaxed mb-6">{product.description}</p>

          {!outOfStock && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-sm font-medium text-foreground">Qty:</span>
                <div className="flex items-center border border-border rounded-lg">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-9 h-9 flex items-center justify-center text-muted-foreground hover:bg-accent transition-colors rounded-l-lg">
                    <Minus size={16} />
                  </button>
                  <span className="w-10 text-center text-sm font-medium">{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="w-9 h-9 flex items-center justify-center text-muted-foreground hover:bg-accent transition-colors rounded-r-lg">
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button onClick={handleAdd} disabled={adding} className="h-12 px-8 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2">
                  <ShoppingCart size={18} /> Add to Cart
                </button>
                <button onClick={handleBuyNow} disabled={adding} className="h-12 px-8 rounded-xl border-2 border-primary text-primary font-semibold hover:bg-primary/5 transition-colors disabled:opacity-50 flex items-center gap-2">
                  <Zap size={18} /> Buy Now
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-16">
        <h2 className="text-xl font-bold text-foreground mb-2">Customer Reviews</h2>
        {product.ratings > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-3xl font-bold text-foreground">{product.ratings.toFixed(1)}</span>
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16} className={i < Math.round(product.ratings) ? 'fill-warning text-warning' : 'text-muted'} />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">based on {product.numReviews} reviews</span>
          </div>
        )}

        {product.reviews?.length > 0 ? (
          <div className="max-w-2xl">
            {product.reviews.map((r: any, i: number) => <ReviewCard key={i} review={r} />)}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No reviews yet. Be the first!</p>
        )}

        {token && !userHasReviewed && (
          <div className="max-w-2xl">
            <AddReviewForm productId={product._id} onSubmitted={fetchProduct} />
          </div>
        )}
      </section>
    </div>
  );
};

export default ProductDetailPage;
