import { useEffect, useState } from 'react';
import { Breadcrumbs } from '../shared/components/ui/Breadcrumbs';
import { Button } from '../shared/components/ui/Button';
import { TextField } from '../shared/components/ui/Fields';

export function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    document.title = 'Contact Us | Flower & Flora';
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && email.trim() && message.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <div className="contact-page">
      <Breadcrumbs
        items={[{ label: 'Home', to: '/' }]}
        current="Contact Us"
      />

      <div className="page-heading">
        <p className="eyebrow">Get In Touch</p>
        <h1>We Would Love to Hear From You</h1>
        <p>Whether you need bespoke wedding florals, custom botanicals, or supplier partnership advice.</p>
      </div>

      {/* 3 Contact Info Cards */}
      <section className="contact-info-section" aria-label="Contact channels">
        <div className="contact-cards-grid">
          <div className="contact-info-card">
            <div className="contact-icon-circle" aria-hidden="true">
              📧
            </div>
            <h3>Customer Care</h3>
            <p>Our floral concierge team is on hand 6 days a week.</p>
            <a href="mailto:hello@flowerflora.lk" className="contact-link">hello@flowerflora.lk</a>
            <span className="contact-subtext">Mon–Sat: 8:00 AM – 7:00 PM</span>
          </div>

          <div className="contact-info-card">
            <div className="contact-icon-circle" aria-hidden="true">
              📍
            </div>
            <h3>Studio Pavilions</h3>
            <p>Visit our flagship artisanal flower displays.</p>
            <address className="contact-address">
              42 Horton Place, Colombo 07<br />
              18 Peradeniya Rd, Kandy
            </address>
          </div>

          <div className="contact-info-card">
            <div className="contact-icon-circle" aria-hidden="true">
              🌿
            </div>
            <h3>Florist Partnerships</h3>
            <p>Are you an artisanal grower or boutique florist?</p>
            <a href="mailto:growers@flowerflora.lk" className="contact-link">growers@flowerflora.lk</a>
            <span className="contact-subtext">Supplier onboarding inquiries</span>
          </div>
        </div>
      </section>

      {/* Overlapping Contact Form Card */}
      <section className="contact-form-section">
        <div className="contact-form-card">
          <div className="contact-form-header">
            <h2 className="contact-form-title">Send a Botanical Inquiry</h2>
            <p>Fill out the form below and our studio team will respond within 4 business hours.</p>
          </div>

          {submitted ? (
            <div className="contact-success-banner" role="status">
              <h3>Thank You, {name}!</h3>
              <p>Your message has been safely received. Our floral concierge will follow up via {email} shortly.</p>
              <Button
                variant="secondary"
                onClick={() => {
                  setSubmitted(false);
                  setName('');
                  setEmail('');
                  setPhone('');
                  setMessage('');
                }}
              >
                Send Another Note
              </Button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <div className="form-fields-grid">
                <TextField
                  label="Your Full Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Amara Senanayake"
                />

                <TextField
                  label="Email Address"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. amara@example.com"
                />
              </div>

              <TextField
                label="Phone Number"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +94 77 123 4567"
              />

              <div className="field">
                <label htmlFor="contact-message">
                  How can we help you? <span aria-hidden="true">*</span>
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your floral arrangements, wedding dates, or questions..."
                  className="contact-textarea"
                />
              </div>

              <Button type="submit" variant="primary" className="contact-submit-btn">
                Send Message →
              </Button>
            </form>
          )}
        </div>
      </section>

      {/* Location Map Section */}
      <section className="contact-map-section" aria-label="Studio Location Map">
        <div className="contact-map-card">
          <div className="map-placeholder-content">
            <span className="map-pin-icon" aria-hidden="true">📍</span>
            <h3>Colombo Flagship Pavilion & Studio</h3>
            <p>42 Horton Place, Cinnamon Gardens, Colombo 07 · Valet Parking Available</p>
            <div className="map-hours-pill">Open Today: 8:00 AM – 7:00 PM</div>
          </div>
        </div>
      </section>
    </div>
  );
}
