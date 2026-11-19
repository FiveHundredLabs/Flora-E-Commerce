import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Truck, Headphones, Gift, ShieldCheck, ArrowRight, Sparkles, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { ProductCard } from '../features/discovery/ProductCard';
import { type Product } from '../features/discovery/model';
import {
  floristModels,
  categoryCirculars,
  promoBanners,
  flowerSubscriptions,
  blogStories,
} from '../features/discovery/assets';

const HERO_SLIDES = [
  {
    kicker: 'VALENTINE DAY',
    title: 'Welcome to Flower & Flora',
    tagline: 'Fresh Flower Feeling Love',
    subtitle: 'Connecting passionate local florists with flower lovers. Handcrafted bouquets, sustainable botanicals, and seasonal fresh blooms.',
    cta: 'SHOP NOW >',
    link: '/products',
    image: floristModels.heroWhiteTulips,
  },
  {
    kicker: 'BOTANICAL LIVING',
    title: 'Bring Living Nature Home',
    tagline: 'Living Greens & Curated Plants',
    subtitle: 'Explore curated houseplants, lush ferns, and hardy succulents cultivated by artisanal growers across Colombo and Kandy.',
    cta: 'EXPLORE PLANTS >',
    link: '/products?category=plants',
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=1000&q=85',
  },
  {
    kicker: 'SEASONAL HARVEST',
    title: 'Fresh From Local Gardens',
    tagline: 'Single Variety Stems & Wildflowers',
    subtitle: 'Single-variety stems, exotic blossoms, and wildflower bundles harvested daily with freshness guaranteed.',
    cta: 'BROWSE STEMS >',
    link: '/products?category=stems',
    image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1000&q=85',
  },
];

const GUARANTEES = [
  {
    icon: Truck,
    title: 'Free Shipping',
    desc: 'Free delivery on all local orders over $60',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    desc: 'Dedicated botanical concierge team',
  },
  {
    icon: Gift,
    title: 'Gift Package',
    desc: 'Eco-friendly luxury hydration packaging',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Payment',
    desc: '100% secure payment with multi-store isolation',
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
  {
    slug: 'sunny-meadow',
    storeSlug: 'willow-stem',
    name: 'Sunny Meadow',
    category: 'bouquets',
    description: 'Golden sunflowers and yellow ranunculus in summer meadow bouquet.',
  },
  {
    slug: 'leafy-companion',
    storeSlug: 'fern-house',
    name: 'Leafy Companion',
    category: 'plants',
    description: 'A sample potted plant with a simple, sculptural shape.',
  },
  {
    slug: 'garden-stems',
    storeSlug: 'garden-notes',
    name: 'Garden Stems',
    category: 'stems',
    description: 'A fictional selection of stems with an open garden feel.',
  },
  {
    slug: 'afternoon-flowers',
    storeSlug: 'garden-notes',
    name: 'Afternoon Flowers',
    category: 'bouquets',
    description: 'An illustrated sample bouquet for exploring the marketplace.',
  },
];

const STORE_NAMES: Record<string, string> = {
  'willow-stem': 'Willow & Stem',
  'fern-house': 'Fern House',
  'petal-room': 'The Petal Room',
  'garden-notes': 'Garden Notes',
};

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
      {/* Section 1: Editorial Hero Slider (Screenshot 5) */}
      <section className="editorial-hero-slider" aria-label="Editorial featured slider">
        <div className="editorial-hero-slide">
          <div className="editorial-hero-content">
            <span className="editorial-kicker">{slide.kicker}</span>
            <h1 className="editorial-title">{slide.title}</h1>
            <span className="editorial-tagline">{slide.tagline}</span>
            <p className="editorial-subtitle">{slide.subtitle}</p>

            <div className="editorial-cta-wrap">
              <Link to={slide.link} className="pill-cta-btn">
                {slide.cta}
              </Link>
              <Link to="/shops" className="pill-ghost-btn">
                Browse sample shops
              </Link>
            </div>
            <p className="editorial-fictional-note">
              Explore our sample catalog. All shops and products shown are fictional.
            </p>
          </div>

          <div className="editorial-hero-media">
            <div className="hero-model-wrap">
              <img
                src={slide.image}
                alt="Florist model holding fresh white tulips"
                className="hero-model-img"
              />
              <div className="hero-media-badge">
                <Sparkles size={16} aria-hidden="true" />
                <span>Hand-Tied Today</span>
              </div>
            </div>
          </div>
        </div>

        {/* Slider Navigation Arrows & Dots */}
        <div className="slider-controls-bar" aria-label="Slider navigation">
          <button
            type="button"
            className="slider-arrow-btn"
            aria-label="Previous slide"
            onClick={prevSlide}
          >
            <ChevronLeft size={20} aria-hidden="true" />
          </button>
          <div className="slider-dots-group" role="tablist" aria-label="Hero slides">
            {HERO_SLIDES.map((_, idx) => (
              <button
                key={idx}
                type="button"
                role="tab"
                aria-label={`Slide ${idx + 1}`}
                aria-selected={currentSlide === idx}
                className={`slider-dot ${currentSlide === idx ? 'is-active' : ''}`}
                onClick={() => setCurrentSlide(idx)}
              />
            ))}
          </div>
          <button
            type="button"
            className="slider-arrow-btn"
            aria-label="Next slide"
            onClick={nextSlide}
          >
            <ChevronRight size={20} aria-hidden="true" />
          </button>
        </div>
      </section>

      {/* Section 2: 4-Item Service Guarantees Bar (Screenshot 5) */}
      <section className="guarantees-bar" aria-label="Service guarantees">
        <div className="guarantees-grid">
          {GUARANTEES.map((g) => {
            const Icon = g.icon;
            return (
              <div key={g.title} className="guarantee-item">
                <div className="guarantee-icon-wrap" aria-hidden="true">
                  <Icon size={24} />
                </div>
                <div className="guarantee-text">
                  <h3 className="guarantee-title">{g.title}</h3>
                  <p className="guarantee-desc">{g.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 3: Asymmetric 3-Column Banner Grid (Screenshot 5) */}
      <section className="home-section promo-banners-section">
        <div className="promo-banners-grid">
          {Object.entries(promoBanners).map(([key, banner]) => (
            <div key={key} className="promo-banner-card">
              <div className="promo-banner-bg">
                <img src={banner.image} alt={banner.title} className="promo-banner-img" />
              </div>
              <div className="promo-banner-overlay">
                <span className="promo-kicker">{banner.subtitle}</span>
                <h3 className="promo-title">{banner.title}</h3>
                <Link to={banner.link} className="promo-discover-link">
                  {banner.action} <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 4: Hot Categories (Circular Showcase) (Screenshot 5) */}
      <section className="home-section hot-categories-section">
        <div className="section-title-wrap">
          <span className="eyebrow">Discover Our Collections</span>
          <h2 className="section-title">Hot Categories</h2>
          <div className="section-accent-leaf" aria-hidden="true">🌿</div>
        </div>

        <div className="circular-categories-grid">
          {Object.entries(categoryCirculars).map(([key, cat]) => (
            <Link key={key} to={cat.link} className="circular-category-item">
              <div className="circular-avatar-wrap">
                <img src={cat.image} alt={cat.title} className="circular-avatar-img" />
                <span className="circular-hover-ring" aria-hidden="true" />
              </div>
              <h3 className="circular-category-title">{cat.title}</h3>
              <span className="circular-category-count">{cat.count}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Section 5: Birthday Bouquets Spotlight Banner (Screenshot 5) */}
      <section className="home-section spotlight-banner-section">
        <div className="spotlight-banner-card">
          <div className="spotlight-content-column">
            <span className="spotlight-badge">SPECIAL COLLECTION</span>
            <h2 className="spotlight-heading">Birthday Bouquets</h2>
            <p className="spotlight-desc">
              Vibrant yellow daffodils, cheerful garden ranunculus, and sun-kissed roses hand-arranged to bring instant joy to every birthday celebration.
            </p>
            <div className="spotlight-cta-row">
              <Link to="/products?category=bouquets" className="pill-cta-btn pill-cta--dark">
                SHOP NOW <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="spotlight-image-column">
            <img
              src={floristModels.birthdaySpotlight}
              alt="Smiling florist holding vibrant yellow birthday bouquet"
              className="spotlight-model-img"
            />
          </div>
        </div>
      </section>

      {/* Section 6: Shop Best Sellers (4-Column Product Grid) (Screenshot 5) */}
      <section className="home-section best-sellers-section">
        <div className="section-title-wrap">
          <span className="eyebrow">Curated Arrangements</span>
          <h2 className="section-title">Shop Best Sellers</h2>
          <div className="section-accent-line" aria-hidden="true" />
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

        <div className="best-sellers-grid">
          {filteredProducts.map((product, idx) => {
            const storeName = STORE_NAMES[product.storeSlug] ?? 'Artisan Florist';
            return (
              <div key={product.slug} className="best-seller-item">
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
          <Link to="/products" className="pill-cta-btn pill-cta--outline">
            VIEW ALL PRODUCTS <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* Section 7: Flower Subscriptions (Screenshot 5) */}
      <section className="home-section subscriptions-section">
        <div className="section-title-wrap">
          <span className="eyebrow">Living Florals Delivered</span>
          <h2 className="section-title">Flower Subscriptions</h2>
          <p className="section-sub">Experience perpetual beauty in your sanctuary. Cancel, pause or reschedule at any moment.</p>
        </div>

        <div className="subscriptions-grid">
          {flowerSubscriptions.map((sub) => (
            <div key={sub.frequency} className={`subscription-card ${sub.featured ? 'is-featured' : ''}`}>
              <div className="sub-media-wrap">
                <img src={sub.image} alt={sub.frequency} className="sub-media-img" />
                <span className="sub-savings-badge">{sub.savings}</span>
              </div>
              <div className="sub-card-body">
                <h3 className="sub-card-title">{sub.frequency}</h3>
                <div className="sub-price">{sub.price}</div>
                <p className="sub-desc">{sub.desc}</p>
                <Link to="/products?category=bouquets" className="sub-cta-btn">
                  SUBSCRIBE NOW <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 8: Our Blog & Editorial Stories (Screenshot 5) */}
      <section className="home-section blog-stories-section">
        <div className="section-title-wrap">
          <span className="eyebrow">Botanical Journal</span>
          <h2 className="section-title">Our Blog & Editorial Stories</h2>
        </div>

        <div className="blog-stories-grid">
          {blogStories.map((post) => (
            <article key={post.title} className="blog-story-card">
              <div className="blog-story-thumb">
                <img src={post.image} alt={post.title} className="blog-thumb-img" />
              </div>
              <div className="blog-story-content">
                <div className="blog-meta-row">
                  <span className="blog-date"><Calendar size={13} aria-hidden="true" /> {post.date}</span>
                  <span className="blog-author">By {post.author}</span>
                </div>
                <h3 className="blog-title">{post.title}</h3>
                <Link to="/about" className="blog-read-more">
                  Read Article <ArrowRight size={13} aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
