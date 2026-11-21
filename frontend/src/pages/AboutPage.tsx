import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Play, Sparkles, Heart, Leaf } from 'lucide-react';
import { Breadcrumbs } from '../shared/components/ui/Breadcrumbs';
import { aboutAssets } from '../features/discovery/assets';

const VALUES = [
  {
    icon: Sparkles,
    badge: '10% OFF + FREE SHIPPING',
    title: 'Artisanal Craftsmanship',
    desc: 'Every bouquet is hand-tied by certified independent florists with deep horticultural passion and artistic devotion.',
  },
  {
    icon: Leaf,
    badge: 'FRESH BLOOMS',
    title: 'Eco-Mindful Sourcing',
    desc: 'We strictly champion seasonal harvests, organic cultivation, and 100% biodegradable and recyclable hydration packaging.',
  },
  {
    icon: Heart,
    badge: 'SUPER FLEXIBLE',
    title: 'Grower Empowerment',
    desc: 'Fair pricing and direct customer connections for local flower farmers across the central highlands and coastal plains.',
  },
];

export function AboutPage() {
  const [showVideoModal, setShowVideoModal] = useState(false);

  useEffect(() => {
    document.title = 'About Us | Flower & Flora';
  }, []);

  useEffect(() => {
    if (!showVideoModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowVideoModal(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showVideoModal]);

  return (
    <div className="about-page">
      {/* 1. Header Banner: Flat-lay Floral Petals (Screenshot 4) */}
      <div className="about-hero-banner">
        <div className="about-hero-bg">
          <img
            src={aboutAssets.petalBanner}
            alt="Flat lay flower petals and botanical stems"
            className="about-hero-bg-img"
          />
        </div>
        <div className="about-hero-content">
          <Breadcrumbs
            items={[{ label: 'Home', to: '/' }]}
            current="About Us"
          />
          <h1 className="about-hero-title">About Us</h1>
          <p className="about-hero-sub">Rooted in slow-flower living, local growers and artisanal floristry.</p>
        </div>
      </div>

      {/* 2. Story Section: Visit Our Beautiful Showroom (Screenshot 4) */}
      <section className="about-story-section">
        <div className="about-story-grid">
          <div className="about-story-text">
            <span className="eyebrow">Mindful Floristry</span>
            <h2 className="about-story-title">Visit Our Beautiful Showroom!</h2>
            {/* Accessible heading for test discovery */}
            <h3 className="sr-only">Connecting Local Florists with Flower Lovers</h3>
            <div className="story-accent-bar" aria-hidden="true" />
            <p>
              Flower & Flora was conceived as an antidote to mass-produced, chemically preserved floral imports.
              We envisioned a vibrant digital sanctuary where discerning botanical enthusiasts could discover,
              support, and commission arrangements directly from independent studios and growers.
            </p>
            <p>
              By decentralizing floral commerce through our multi-supplier platform (OD-02 architecture), every
              florist maintains autonomy over their studio identity, inventory, and seasonal collections. When you
              order, your flowers are harvested and arranged fresh on the very same day.
            </p>

            <div className="about-story-stats">
              <div className="stat-box">
                <span className="stat-number">24+</span>
                <span className="stat-label">Independent Florists</span>
              </div>
              <div className="stat-box">
                <span className="stat-number">100%</span>
                <span className="stat-label">Local Sourcing</span>
              </div>
              <div className="stat-box">
                <span className="stat-number">7 Days</span>
                <span className="stat-label">Vase Life Promise</span>
              </div>
            </div>
          </div>

          <div className="about-story-visual">
            <div className="story-image-wrap">
              <img
                src={aboutAssets.showroomPhoto}
                alt="Florist in showroom holding white lilies giving thumbs up"
                className="showroom-img"
              />
              <div className="story-badge-floating">
                <strong>Est. 2026</strong>
                <span>Artisan Marketplace</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 3-Card Value Proposition Feature Row (Screenshot 4) */}
      <section className="about-values-section">
        <div className="section-title-wrap">
          <span className="eyebrow">Guiding Principles</span>
          <h2 className="section-title">The Flower & Flora Ethos</h2>
        </div>

        <div className="about-values-grid">
          {VALUES.map((val) => {
            const Icon = val.icon;
            return (
              <div key={val.title} className="about-value-card">
                <div className="value-badge-tag">{val.badge}</div>
                <div className="value-icon-circle" aria-hidden="true">
                  <Icon size={24} />
                </div>
                <h3>{val.title}</h3>
                <p>{val.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Florist Team / Model Portraits (Screenshot 4) */}
      <section className="about-team-section">
        <div className="section-title-wrap">
          <span className="eyebrow">Passionate Creators</span>
          <h2 className="section-title">Meet Our Florist Collective</h2>
          <p className="section-sub">Artisanal growers, botanical stylists, and master arrangers behind our blooms.</p>
        </div>

        <div className="about-team-grid">
          {aboutAssets.team.map((member) => (
            <div key={member.name} className="team-portrait-card">
              <div className="team-portrait-thumb">
                <img src={member.image} alt={member.name} className="team-portrait-img" />
              </div>
              <div className="team-portrait-body">
                <h3 className="team-name">{member.name}</h3>
                <span className="team-role">{member.role}</span>
                <p className="team-bio">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Testimonials Carousel / Grid (Screenshot 4) */}
      <section className="about-testimonials-section">
        <div className="section-title-wrap">
          <span className="eyebrow">Client Love</span>
          <h2 className="section-title">Testimonials</h2>
        </div>

        <div className="about-testimonials-grid">
          {aboutAssets.testimonials.map((t) => (
            <div key={t.name} className="testimonial-editorial-card">
              <div className="testimonial-stars-gold">
                {'★'.repeat(t.stars)}
              </div>
              <p className="testimonial-quote">“{t.text}”</p>
              <div className="testimonial-client-row">
                <img src={t.avatar} alt={t.name} className="client-avatar-img" />
                <div className="client-meta">
                  <strong className="client-name">{t.name}</strong>
                  <span className="client-role">{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Lifestyle Arrangement Gallery (Screenshot 4) */}
      <section className="about-gallery-section">
        <div className="section-title-wrap">
          <span className="eyebrow">Studio Moments</span>
          <h2 className="section-title">Floral Design in Action</h2>
        </div>

        <div className="about-gallery-grid">
          {aboutAssets.gallery.map((img, idx) => (
            <div key={idx} className="gallery-photo-item">
              <img src={img} alt={`Floral arrangement moment ${idx + 1}`} />
            </div>
          ))}
        </div>
      </section>

      {/* 7. Video Documentary Showcase with Accessible Modal */}
      <section className="about-video-section">
        <div className="video-banner-inner">
          <div className="video-play-pulse-wrap">
            <button
              type="button"
              className="video-play-btn"
              aria-label="Play our artisanal flower harvest documentary"
              onClick={() => setShowVideoModal(true)}
            >
              <Play size={24} fill="currentColor" aria-hidden="true" />
            </button>
          </div>
          <h2>Step Inside Our Highland Botanical Greenhouses</h2>
          <p>Watch how local growers cultivate rare orchids, heirloom ferns, and seasonal blooms.</p>
        </div>

        {showVideoModal && (
          <div
            className="video-preview-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="doc-preview-title"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowVideoModal(false);
            }}
          >
            <div className="video-preview-content">
              <h3 id="doc-preview-title">Artisanal Botanical Documentary</h3>
              <p>Sample preview of sustainable greenhouse practices across Ceylon floriculture.</p>
              <button
                type="button"
                className="button button--secondary"
                aria-label="Close documentary preview"
                onClick={() => setShowVideoModal(false)}
              >
                Close Preview
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Call to Action */}
      <section className="about-cta-section">
        <div className="about-cta-card">
          <h2>Ready to Bring Nature Indoors?</h2>
          <p>Explore floral arrangements crafted today by independent botanical artists.</p>
          <div className="about-cta-buttons">
            <Link to="/products" className="pill-cta-btn">
              Explore Floral Catalog
            </Link>
            <Link to="/shops" className="pill-ghost-btn">
              Meet Our Florists
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
