import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '@/api/axios';
import { SlidersHorizontal, X } from 'lucide-react';

const FilterSidebar = () => {
  const [params, setParams] = useSearchParams();
  const [categories, setCategories] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    api.get('/products/categories').then(r => setCategories(r.data.categories || [])).catch(() => {});
  }, []);

  const selectedCats = params.getAll('category');
  const sort = params.get('sort') || '';
  const minPrice = params.get('minPrice') || '';
  const maxPrice = params.get('maxPrice') || '';
  const brand = params.get('brand') || '';

  const update = (key: string, value: string) => {
    const p = new URLSearchParams(params);
    if (value) p.set(key, value); else p.delete(key);
    p.delete('page');
    setParams(p);
  };

  const toggleCategory = (cat: string) => {
    const p = new URLSearchParams(params);
    const cats = p.getAll('category');
    p.delete('category');
    if (cats.includes(cat)) {
      cats.filter(c => c !== cat).forEach(c => p.append('category', c));
    } else {
      [...cats, cat].forEach(c => p.append('category', c));
    }
    p.delete('page');
    setParams(p);
  };

  const clearAll = () => setParams({});

  const content = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Filters</h3>
        <button onClick={clearAll} className="text-xs text-primary hover:underline">Clear all</button>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Sort By</h4>
        <select
          value={sort}
          onChange={e => update('sort', e.target.value)}
          className="w-full h-9 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Default</option>
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {categories.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Category</h4>
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {categories.map(cat => (
              <label key={cat} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedCats.includes(cat)}
                  onChange={() => toggleCategory(cat)}
                  className="rounded border-input text-primary focus:ring-primary"
                />
                <span className="text-sm text-foreground">{cat}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Price Range</h4>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={e => update('minPrice', e.target.value)}
            className="w-full h-9 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={e => update('maxPrice', e.target.value)}
            className="w-full h-9 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Brand</h4>
        <input
          type="text"
          placeholder="Enter brand"
          value={brand}
          onChange={e => update('brand', e.target.value)}
          className="w-full h-9 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
    </div>
  );

  return (
    <>
      <button onClick={() => setOpen(true)} className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-accent transition-colors mb-4">
        <SlidersHorizontal size={16} /> Filters
      </button>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/20" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-80 bg-card border-r border-border p-6 overflow-y-auto animate-fade-in">
            <button onClick={() => setOpen(false)} className="absolute top-4 right-4 text-muted-foreground"><X size={20} /></button>
            {content}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-20 bg-card border border-border rounded-xl p-5">
          {content}
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;
