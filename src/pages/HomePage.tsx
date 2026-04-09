import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, RotateCcw, ShieldCheck, Sparkles } from 'lucide-react';
import api from '@/api/axios';
import ProductCard from '@/components/ProductCard';
import HeroCarousel from '@/components/HeroCarousel';
import Marquee from '@/components/Marquee';

const categoryEmojis: Record<string, string> = {
  Phones: '📱', Laptops: '💻', Electronics: '🔌', Fashion: '👕',
  Books: '📚', Home: '🏠', Sports: '⚽', Beauty: '💄',
  Toys: '🧸', Accessories: '⌚', Cameras: '📷', Audio: '🎧',
};

const HomePage = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [newArrivals, setNewArrivals] = useState<any[]>([]);
  const [bestRated, setBestRated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/products/categories').then(r => setCategories(r.data.categories || [])),
      api.get('/products?sort=newest&limit=8').then(r => setNewArrivals(r.data.products || [])),
      api.get('/products?sort=rating&limit=8').then(r => setBestRated(r.data.products || [])),
    ]).finally(() => setLoading(false));
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Marquee */}
      <Marquee />

      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Trust Bar */}
      <section className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Truck, title: 'Free Shipping', desc: 'On orders above ₹500' },
              { icon: RotateCcw, title: 'Easy Returns', desc: '30-day hassle-free returns' },
              { icon: ShieldCheck, title: 'Secure Payment', desc: '100% secure checkout' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3 justify-center md:justify-start">
                <div className="w-11 h-11 rounded-2xl gradient-bg flex items-center justify-center shadow-md">
                  <Icon size={20} className="text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{title}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="container mx-auto px-4 py-14">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Shop by Category</h2>
            <p className="text-sm text-muted-foreground mt-1">Browse our popular categories</p>
          </div>
          <Link to="/products" className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
            View All <ArrowRight size={14} />
          </Link>
        </div>
        {categories.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {categories.map(cat => (
              <Link
                key={cat}
                to={`/products?category=${encodeURIComponent(cat)}`}
                className="bg-card border border-border rounded-2xl p-5 flex flex-col items-center gap-2.5 hover:shadow-lg hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 group"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform">{categoryEmojis[cat] || '🛍️'}</span>
                <span className="text-xs font-semibold text-foreground">{cat}</span>
              </Link>
            ))}
          </div>
        ) : loading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-5 h-24 animate-pulse" />
            ))}
          </div>
        ) : null}
      </section>

      {/* New Arrivals */}
      {(newArrivals.length > 0 || loading) && (
        <section className="bg-card/50 py-14">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <Sparkles size={20} className="text-primary" />
                <h2 className="text-2xl font-bold text-foreground">New Arrivals</h2>
              </div>
              <Link to="/products?sort=newest" className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
                View All <ArrowRight size={14} />
              </Link>
            </div>
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-card rounded-2xl border border-border overflow-hidden animate-pulse">
                    <div className="aspect-square bg-muted" />
                    <div className="p-4 space-y-2"><div className="h-4 bg-muted rounded w-3/4" /><div className="h-5 bg-muted rounded w-1/3" /></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {newArrivals.map(p => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Best Rated */}
      {(bestRated.length > 0 || loading) && (
        <section className="container mx-auto px-4 py-14">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <span className="text-xl">🏆</span>
              <h2 className="text-2xl font-bold text-foreground">Best Rated</h2>
            </div>
            <Link to="/products?sort=rating" className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-card rounded-2xl border border-border overflow-hidden animate-pulse">
                  <div className="aspect-square bg-muted" />
                  <div className="p-4 space-y-2"><div className="h-4 bg-muted rounded w-3/4" /><div className="h-5 bg-muted rounded w-1/3" /></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {bestRated.map(p => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* CTA Banner */}
      <section className="container mx-auto px-4 pb-14">
        <div className="gradient-bg rounded-3xl p-8 md:p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
          <h2 className="text-2xl md:text-4xl font-black text-primary-foreground mb-3 relative">
            Ready to Start Shopping?
          </h2>
          <p className="text-primary-foreground/80 mb-6 max-w-md mx-auto relative">
            Join thousands of happy customers. Discover deals you won't find anywhere else.
          </p>
          <Link
            to="/products"
            className="inline-flex h-12 px-8 items-center justify-center rounded-full bg-card text-foreground font-semibold hover:bg-card/90 transition-colors gap-2 shadow-lg relative"
          >
            Explore Products <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
