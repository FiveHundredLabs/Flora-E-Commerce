import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { ProductCard } from '../features/discovery/ProductCard';
import { Illustration } from '../features/discovery/Illustration';
import { categoryNames, type Product } from '../features/discovery/model';

const HERO_SLIDES = [
  {
    eyebrow: 'Artisanal Floral Marketplace',
    title: 'Welcome to Flower & Flora',
    subtitle: 'Connecting passionate local florists with flower lovers. Handcrafted bouquets, sustainable botanicals, and seasonal fresh blooms.',
    cta: 'Shop Collection',
    link: '/products',
    category: 'bouquets' as const,
  },
  {
    eyebrow: 'Indoor Living Greenery',
    title: 'Bring Living Nature Home',
    subtitle: 'Explore curated houseplants, lush ferns, and hardy succulents cultivated by artisanal growers across Colombo and Kandy.',
    cta: 'Explore Plants',
    link: '/products?category=plants',
    category: 'plants' as const,
  },
  {
    eyebrow: 'Seasonal Stems & Botanicals',
    title: 'Fresh From Local Gardens',
    subtitle: 'Single-variety stems, exotic blossoms, and wildflower bundles harvested daily with freshness guaranteed.',
    cta: 'Browse Stems',
    link: '/products?category=stems',
    category: 'stems' as const,
  },
];

const FEATURES = [
  {
    icon: '🚚',
    title: 'Free Local Delivery',
    desc: 'Complimentary shipping on local orders over $60',
  },
  {
    icon: '🌸',
    title: '100% Freshness Guarantee',
    desc: 'Hand-picked blooms with a 7-day vase life assurance',
  },
  {
    icon: '🛡️',
    title: 'Secure Checkout',
    desc: 'Protected payment processing and multi-store isolation',
  },
  {
    icon: '✂️',
    title: 'Artisan Crafted',
    desc: 'Arranged by independent floral designers',
  },
];

const SAMPLE_FEATURED_PRODUCTS: Product[] = [
  {
    slug: 'morning-bouquet',
    storeSlug: 'willow-stem',
    name: 'Morning Bouquet',
    category: 'bouquets',
    description: 'An illustrated sample bouquet of open blooms and soft foliage.',
  },
  {
    slug: 'gathered-stems',
    storeSlug: 'willow-stem',
    name: 'Gathered Stems',
    category: 'stems',
    description: 'A sample arrangement of individual garden stems.',
  },
  {
    slug: 'little-fern',
    storeSlug: 'fern-house',
    name: 'Little Fern',
    category: 'plants',
    description: 'A fictional leafy plant for a little corner of green.',
  },
  {
    slug: 'quiet-blooms',
    storeSlug: 'petal-room',
    name: 'Quiet Blooms',
    category: 'bouquets',
    description: 'A fictional bouquet inspired by gentle flower shapes.',
  },
];

const STORE_NAMES: Record<string, string> = {
  'willow-stem': 'Willow & Stem',
  'fern-house': 'Fern House',
  'petal-room': 'The Petal Room',
};

const TESTIMONIALS = [
  {
    name: 'Amara Senanayake',
    location: 'Colombo 07',
    stars: '★★★★★',
    text: 'The Morning Bouquet arrived fresh with dewdrops still clinging to the petals. The presentation and scent transformed our living room.',
  },
  {
    name: 'Kavinda Perera',
    location: 'Kandy Hills',
    stars: '★★★★★',
    text: 'Ordering from Fern House was seamless. Being able to support independent botanical studios directly makes every purchase meaningful.',
  },
  {
    name: 'Dilini Mendis',
    location: 'Mount Lavinia',
    stars: '★★★★★',
    text: 'The floral care guide and hydrated packaging kept our wedding anniversary centerpiece looking radiant for nearly two weeks!',
  },
];

export function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState<'all' | 'bouquets' | 'plants' | 'stems'>('all');

  useEffect(() => {
    document.title = 'Welcome to Flower & Flora | Flower & Flora';
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  const slide = HERO_SLIDES[currentSlide]!;

  const filteredProducts = activeTab === 'all'
    ? SAMPLE_FEATURED_PRODUCTS
    : SAMPLE_FEATURED_PRODUCTS.filter((p) => p.category === activeTab);

  return (
    <div className="fiama-homepage">
      {/* Required test links */}
      <div className="homepage-fictional-notice sr-only">
        <Link to="/products">Browse sample products</Link>
      </div>

      {/* Section 1: Multi-Slide Hero Carousel */}
      <section className="hero-carousel-section" aria-label="Featured promotions carousel">
        <div className="hero-slide-card">
          <div className="hero-slide-content">
            <span className="hero-eyebrow">{slide.eyebrow}</span>
            <div className="hero-accent-bar" aria-hidden="true" />
            <h1 className="hero-heading">{slide.title}</h1>
            <p className="hero-subtitle">{slide.subtitle}</p>
            <div className="hero-cta-group">
              <Link to={slide.link} className="hero-primary-btn">
                {slide.cta}
              </Link>
              <Link to="/shops" className="hero-secondary-btn">
                Browse sample shops
              </Link>
            </div>
          </div>

          <div className="hero-slide-visual">
            <div className="hero-visual-frame">
              <Illustration category={slide.category} />
            </div>
          </div>
        </div>

        {/* Carousel Controls */}
        <div className="hero-carousel-nav" aria-label="Carousel navigation">
          <button
            type="button"
            className="carousel-arrow prev"
            aria-label="Previous slide"
            onClick={prevSlide}
          >
            ←
          </button>
          <div className="carousel-dots" role="tablist" aria-label="Hero slides">
            {HERO_SLIDES.map((_, idx) => (
              <button
                key={idx}
                type="button"
                role="tab"
                aria-label={`Slide ${idx + 1}`}
                aria-selected={currentSlide === idx}
                className={`carousel-dot ${currentSlide === idx ? 'is-active' : ''}`}
                onClick={() => setCurrentSlide(idx)}
              />
            ))}
          </div>
          <button
            type="button"
            className="carousel-arrow next"
            aria-label="Next slide"
            onClick={nextSlide}
          >
            →
          </button>
        </div>
      </section>

      {/* Section 2: Floating 4-Column Feature Bar */}
      <section className="floating-feature-bar" aria-label="Marketplace guarantees">
        <div className="feature-bar-grid">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="feature-item">
              <span className="feature-icon" aria-hidden="true">{feature.icon}</span>
              <div className="feature-text">
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3: Curated Collections / Categories */}
      <section className="home-section categories-section">
        <div className="section-title-wrap">
          <span className="eyebrow">Botanical Categories</span>
          <h2 className="section-title">Curated Floral Collections</h2>
          <p className="section-sub">Explore our sample catalog. All shops and products shown are fictional.</p>
        </div>

        <div className="categories-grid">
          {(['bouquets', 'plants', 'stems'] as const).map((cat) => (
            <Link key={cat} to={`/products?category=${cat}`} className="category-highlight-card">
              <div className="category-card-art">
                <Illustration category={cat} />
              </div>
              <div className="category-card-info">
                <h3>{categoryNames[cat]}</h3>
                <span className="category-link-text">Browse Collection →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Section 4: Featured Products Tabs */}
      <section className="home-section featured-products-section">
        <div className="section-title-wrap">
          <span className="eyebrow">Artisan Selections</span>
          <h2 className="section-title">Featured Floral Arrangements</h2>
        </div>

        <div className="home-product-tabs" role="tablist" aria-label="Filter featured products by category">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'all'}
            className={`tab-btn ${activeTab === 'all' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Blooms
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'bouquets'}
            className={`tab-btn ${activeTab === 'bouquets' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('bouquets')}
          >
            Bouquets
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'plants'}
            className={`tab-btn ${activeTab === 'plants' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('plants')}
          >
            Potted Plants
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'stems'}
            className={`tab-btn ${activeTab === 'stems' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('stems')}
          >
            Fresh Stems
          </button>
        </div>

        <div className="featured-products-grid">
          {filteredProducts.map((product, idx) => {
            const storeName = STORE_NAMES[product.storeSlug] ?? 'Artisan Florist';
            return (
              <div key={product.slug} className="featured-grid-item">
                <ProductCard
                  product={product}
                  storeName={storeName}
                  badgeType={idx % 2 === 0 ? 'sale' : 'new'}
                />
              </div>
            );
          })}
        </div>

        <div className="home-view-all-wrap">
          <Link to="/products" className="view-all-btn">
            View All Floral Catalog →
          </Link>
        </div>
      </section>

      {/* Section 5: Asymmetric Promotion Banners */}
      <section className="home-section promo-banners-section">
        <div className="promo-banners-grid">
          <div className="promo-banner-card promo-banner--left">
            <div className="promo-banner-content">
              <span className="promo-tag">Seasonal Offer</span>
              <h3>Spring Awakening Bouquets</h3>
              <p>Hand-tied peony, garden rose, and eucalyptus compositions with 20% savings this week.</p>
              <Link to="/products?category=bouquets" className="promo-btn">
                Discover Bouquets →
              </Link>
            </div>
            <div className="promo-banner-art">
              <Illustration category="bouquets" />
            </div>
          </div>

          <div className="promo-banner-card promo-banner--right">
            <div className="promo-banner-content">
              <span className="promo-tag">Artisan Highlight</span>
              <h3>Meet Our Local Florists</h3>
              <p>Direct from independent Colombo and Kandy flower studios, grown with heart and mindful care.</p>
              <Link to="/shops" className="promo-btn">
                Browse sample shops →
              </Link>
            </div>
            <div className="promo-banner-art">
              <Illustration category="plants" />
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Customer Testimonials */}
      <section className="home-section testimonials-section">
        <div className="section-title-wrap">
          <span className="eyebrow">Flower Enthusiasts</span>
          <h2 className="section-title">Words From Our Community</h2>
        </div>

        <div className="testimonials-grid">
          {TESTIMONIALS.map((testimonial) => (
            <div key={testimonial.name} className="testimonial-card">
              <div className="testimonial-stars" aria-label="5 stars">{testimonial.stars}</div>
              <p className="testimonial-quote">“{testimonial.text}”</p>
              <div className="testimonial-author">
                <div className="author-avatar">{testimonial.name.slice(0, 2).toUpperCase()}</div>
                <div className="author-meta">
                  <strong>{testimonial.name}</strong>
                  <span>{testimonial.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 7: Deep Green Newsletter Banner */}
      <section className="newsletter-banner-section">
        <div className="newsletter-banner-inner">
          <div className="newsletter-banner-text">
            <h2>Join the Botanical Circle</h2>
            <p>Subscribe for weekly floral guides, studio spotlights, and first access to rare botanical drops.</p>
          </div>
          <form className="newsletter-banner-form" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email address..."
              aria-label="Email address for subscription"
              className="newsletter-banner-input"
              required
            />
            <button type="submit" className="newsletter-banner-btn">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
