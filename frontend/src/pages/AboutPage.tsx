import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Breadcrumbs } from '../shared/components/ui/Breadcrumbs';
import { Illustration } from '../features/discovery/Illustration';

const VALUES = [
  {
    icon: '🌸',
    title: 'Artisanal Craftsmanship',
    desc: 'Every bouquet is hand-tied by certified independent florists with deep horticultural passion and artistic devotion.',
  },
  {
    icon: '🌱',
    title: 'Eco-Mindful Sourcing',
    desc: 'We strictly champion seasonal harvests, organic cultivation, and 100% biodegradable and recyclable hydration packaging.',
  },
  {
    icon: '🤝',
    title: 'Grower Empowerment',
    desc: 'Fair pricing and direct customer connections for local flower farmers across the central highlands and coastal plains.',
  },
];

export function AboutPage() {
  const [showVideoModal, setShowVideoModal] = useState(false);

  useEffect(() => {
    document.title = 'About Us | Flower & Flora';
  }, []);

  return (
    <div className="about-page">
      <Breadcrumbs
        items={[{ label: 'Home', to: '/' }]}
        current="About Us"
      />

      <div className="page-heading">
        <p className="eyebrow">Our Botanical Journey</p>
        <h1>Connecting Local Florists with Flower Lovers</h1>
        <p>A multi-supplier floral marketplace cultivating sustainable, slow-flower living.</p>
      </div>

      {/* Story Section with Decorative Frame */}
      <section className="about-story-section">
        <div className="about-story-grid">
          <div className="about-story-visual">
            <div className="story-frame-outer">
              <div className="story-frame-inner">
                <Illustration category="bouquets" />
              </div>
              <div className="story-badge-floating">
                <strong>Est. 2026</strong>
                <span>Artisan Marketplace</span>
              </div>
            </div>
          </div>

          <div className="about-story-text">
            <span className="eyebrow">Mindful Floristry</span>
            <h2>Rooted in Nature, Cultivated with Integrity</h2>
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
        </div>
      </section>

      {/* 3 Core Values Cards */}
      <section className="about-values-section">
        <div className="section-title-wrap">
          <span className="eyebrow">Guiding Principles</span>
          <h2 className="section-title">The Flower & Flora Ethos</h2>
        </div>

        <div className="about-values-grid">
          {VALUES.map((val) => (
            <div key={val.title} className="about-value-card">
              <div className="value-icon-circle" aria-hidden="true">
                {val.icon}
              </div>
              <h3>{val.title}</h3>
              <p>{val.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Video Showcase Section with Pulsing Play Button */}
      <section className="about-video-section">
        <div className="video-banner-inner">
          <div className="video-play-pulse-wrap">
            <button
              type="button"
              className="video-play-btn"
              aria-label="Play our artisanal flower harvest documentary"
              onClick={() => setShowVideoModal(true)}
            >
              ▶
            </button>
          </div>
          <h2>Step Inside Our Highland Botanical Greenhouses</h2>
          <p>Watch how local growers cultivate rare orchids, heirloom ferns, and seasonal blooms.</p>
        </div>

        {showVideoModal && (
          <div className="video-preview-modal" role="dialog" aria-modal="true" aria-labelledby="doc-preview-title">
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
            <Link to="/products" className="button button--primary">
              Explore Floral Catalog
            </Link>
            <Link to="/shops" className="button button--secondary">
              Meet Our Florists
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
