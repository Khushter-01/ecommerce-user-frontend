import { Zap, Truck, ShieldCheck, Gift, Tag, Star } from 'lucide-react';

const items = [
  { icon: Zap, text: 'Flash Sale — Up to 50% Off!' },
  { icon: Truck, text: 'Free Shipping on Orders Above ₹500' },
  { icon: ShieldCheck, text: '100% Secure Payments' },
  { icon: Gift, text: 'New Arrivals Every Week' },
  { icon: Tag, text: 'Exclusive Deals for Members' },
  { icon: Star, text: 'Top Rated Products' },
];

const Marquee = () => (
  <div className="gradient-bg overflow-hidden py-2.5">
    <div className="animate-marquee flex whitespace-nowrap">
      {[...items, ...items].map((item, i) => (
        <span key={i} className="inline-flex items-center gap-2 mx-8 text-primary-foreground text-sm font-medium">
          <item.icon size={16} />
          {item.text}
        </span>
      ))}
    </div>
  </div>
);

export default Marquee;
