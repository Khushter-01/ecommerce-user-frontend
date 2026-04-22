import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    title: 'Shop the Latest Trends',
    subtitle: 'Discover premium products at unbeatable prices. From tech to fashion — all in one place.',
    cta: 'Shop Now',
    link: '/products',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
    gradient: 'from-primary/20 via-background to-accent/30',
  },
  {
    title: 'New Season, New Style',
    subtitle: 'Explore our curated collection of top fashion picks for every occasion.',
    cta: 'View Fashion',
    link: '/products?category=Fashion',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d',
    gradient: 'from-accent/30 via-background to-primary/20',
  },
  {
    title: "Tech Deals You'll Love",
    subtitle: "The latest gadgets, phones, and laptops at prices that won't break the bank.",
    cta: 'Browse Tech',
    link: '/products?category=Electronics',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
    gradient: 'from-primary/10 via-accent/20 to-primary/30',
  },
];

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((i) => (i + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((i) => (i - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next]);

  const slide = slides[current];

  return (
    <section className={`relative bg-gradient-to-br ${slide.gradient} transition-all duration-700`}>
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center gap-10">

          {/* TEXT */}
          <div key={current} className="flex-1 animate-carousel-in max-w-xl">
            <h1 className="text-4xl md:text-6xl font-black text-foreground leading-tight mb-4">
              {slide.title.split(' ').map((word, i) => (
                <span key={i} className={i % 3 === 2 ? 'gradient-text' : ''}>
                  {word}{' '}
                </span>
              ))}
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-lg">
              {slide.subtitle}
            </p>

            <Link
              to={slide.link}
              className="inline-flex h-12 px-8 items-center justify-center rounded-full gradient-bg text-primary-foreground font-semibold hover:opacity-90 transition-opacity gap-2 shadow-lg"
            >
              {slide.cta} <ArrowRight size={18} />
            </Link>
          </div>

          {/* ✅ IMAGE (THIS WAS MISSING) */}
          <div className="flex-1 relative">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-[300px] md:h-[400px] object-cover rounded-2xl shadow-lg hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/10 rounded-2xl"></div>
          </div>

        </div>
      </div>

      {/* CONTROLS */}
      <div className="absolute bottom-6 right-6 flex items-center gap-2">
        <button
          onClick={prev}
          className="p-2 rounded-full bg-card/80 backdrop-blur border border-border text-foreground hover:bg-card transition-colors"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="flex gap-1.5 mx-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current
                  ? 'w-6 gradient-bg'
                  : 'w-2 bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="p-2 rounded-full bg-card/80 backdrop-blur border border-border text-foreground hover:bg-card transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
  );
};

export default HeroCarousel;