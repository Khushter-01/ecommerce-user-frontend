import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-card border-t border-border mt-16">
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-lg font-black gradient-text mb-3">ShopVibe</h3>
          <p className="text-sm text-muted-foreground">Your one-stop shop for the best products at unbeatable prices.</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">Shop</h4>
          <div className="flex flex-col gap-2">
            <Link to="/products" className="text-sm text-muted-foreground hover:text-foreground transition-colors">All Products</Link>
            <Link to="/products?sort=newest" className="text-sm text-muted-foreground hover:text-foreground transition-colors">New Arrivals</Link>
            <Link to="/products?category=Electronics" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Electronics</Link>
            <Link to="/products?category=Fashion" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Fashion</Link>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">Account</h4>
          <div className="flex flex-col gap-2">
            <Link to="/profile" className="text-sm text-muted-foreground hover:text-foreground transition-colors">My Profile</Link>
            <Link to="/my-orders" className="text-sm text-muted-foreground hover:text-foreground transition-colors">My Orders</Link>
            <Link to="/cart" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Cart</Link>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">Support</h4>
          <p className="text-sm text-muted-foreground">support@shopvibe.com</p>
          <p className="text-sm text-muted-foreground mt-1">1-800-SHOPVIBE</p>
        </div>
      </div>
      <div className="mt-10 pt-6 border-t border-border text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} ShopVibe. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
