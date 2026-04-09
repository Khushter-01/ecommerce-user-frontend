import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Search, LogOut, Package, UserCircle, Heart } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';

const categories = [
  'All Categories', 'Electronics', 'Fashion', 'Phones', 'Laptops',
  'Home', 'Sports', 'Beauty', 'Books', 'Accessories',
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
      {/* Main bar */}
      <div className="container mx-auto px-4 h-16 flex items-center gap-4">
        <Link to="/" className="text-xl font-black gradient-text tracking-tight shrink-0">
          ShopVibe
        </Link>

        {/* Search bar - desktop */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full h-10 pl-10 pr-4 rounded-full border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
            />
          </div>
        </form>

        <div className="flex items-center gap-1 ml-auto">
          <ThemeToggle />

          {user && (
            <Link to="/my-orders" className="hidden md:flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Package size={18} />
              <span>Orders</span>
            </Link>
          )}

          <Link to="/cart" className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 gradient-bg text-primary-foreground text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative">
              <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-primary-foreground text-sm font-bold">
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              </button>
              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-52 bg-card border border-border rounded-2xl shadow-xl z-50 py-1 animate-scale-in overflow-hidden">
                    <div className="px-4 py-3 border-b border-border bg-accent/50">
                      <p className="text-sm font-semibold text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <Link to="/my-orders" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                      <Package size={16} /> My Orders
                    </Link>
                    <Link to="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                      <UserCircle size={16} /> Profile
                    </Link>
                    <button onClick={() => { logout(); setUserMenuOpen(false); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors">
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link to="/login" className="hidden md:inline-flex h-9 px-5 items-center justify-center rounded-full gradient-bg text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
              Login
            </Link>
          )}

          <button className="md:hidden p-2 text-muted-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Category bar - desktop */}
      <div className="hidden md:block border-t border-border bg-card/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-1 py-2 overflow-x-auto scrollbar-hide">
            {categories.map(cat => (
              <Link
                key={cat}
                to={cat === 'All Categories' ? '/products' : `/products?category=${encodeURIComponent(cat)}`}
                className="px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card animate-fade-in">
          <div className="px-4 py-3">
            <form onSubmit={handleSearch} className="mb-3">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full h-10 pl-10 pr-4 rounded-full border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </form>
            <div className="flex flex-wrap gap-2 mb-3">
              {categories.map(cat => (
                <Link
                  key={cat}
                  to={cat === 'All Categories' ? '/products' : `/products?category=${encodeURIComponent(cat)}`}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-accent text-accent-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {cat}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-1 border-t border-border pt-3">
              <Link to="/" onClick={() => setMobileOpen(false)} className="py-2 text-sm font-medium text-foreground">Home</Link>
              <Link to="/products" onClick={() => setMobileOpen(false)} className="py-2 text-sm font-medium text-foreground">Products</Link>
              {!user && (
                <Link to="/login" onClick={() => setMobileOpen(false)} className="py-2 text-sm font-semibold text-primary">Login</Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
