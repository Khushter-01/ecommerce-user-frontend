import ProductCard from './ProductCard';

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

const SkeletonCard = () => (
  <div className="bg-card rounded-xl border border-border overflow-hidden animate-pulse">
    <div className="aspect-square bg-muted" />
    <div className="p-4 space-y-2">
      <div className="h-4 bg-muted rounded w-3/4" />
      <div className="h-3 bg-muted rounded w-1/2" />
      <div className="h-5 bg-muted rounded w-1/3" />
    </div>
  </div>
);

const ProductGrid = ({ products, loading }: { products: Product[]; loading: boolean }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-lg font-medium text-foreground mb-1">No products found</p>
        <p className="text-sm text-muted-foreground">Try adjusting your filters or search.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map(p => <ProductCard key={p._id} product={p} />)}
    </div>
  );
};

export default ProductGrid;
