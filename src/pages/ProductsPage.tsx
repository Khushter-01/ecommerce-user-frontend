import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '@/api/axios';
import ProductGrid from '@/components/ProductGrid';
import FilterSidebar from '@/components/FilterSidebar';
import { Search } from 'lucide-react';

const ProductsPage = () => {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState(params.get('search') || '');

  const page = Number(params.get('page')) || 1;

  useEffect(() => {
    setLoading(true);
    const query = new URLSearchParams(params);
    if (!query.has('page')) query.set('page', '1');
    if (!query.has('limit')) query.set('limit', '12');
    api.get(`/products?${query.toString()}`)
      .then(r => {
        setProducts(r.data.products || []);
        setTotalPages(r.data.totalPages || 1);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [params]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const p = new URLSearchParams(params);
    if (searchInput.trim()) p.set('search', searchInput.trim()); else p.delete('search');
    p.delete('page');
    setParams(p);
  };

  const goToPage = (n: number) => {
    const p = new URLSearchParams(params);
    p.set('page', String(n));
    setParams(p);
    window.scrollTo(0, 0);
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground mb-6">Products</h1>

      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder="Search products..."
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </form>

      <div className="flex gap-8">
        <FilterSidebar />
        <div className="flex-1">
          <ProductGrid products={products} loading={loading} />

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToPage(i + 1)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                    page === i + 1
                      ? 'bg-primary text-primary-foreground'
                      : 'border border-border text-muted-foreground hover:bg-accent'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
