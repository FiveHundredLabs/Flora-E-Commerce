import { useEffect, useState } from 'react';
import { Phone, Mail, MapPin, Send, Flower2 } from 'lucide-react';
import { Breadcrumbs } from '../shared/components/ui/Breadcrumbs';
import { Button } from '../shared/components/ui/Button';
import { TextField } from '../shared/components/ui/Fields';

export function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    document.title = 'Contact Us | Flower & Flora';
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string; email?: string; message?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Please provide your full name.';
    }
    if (!email.trim()) {
      newErrors.email = 'Please provide your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!message.trim()) {
      newErrors.message = 'Please tell us how we can help you.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setSubmitted(true);
  };

  return (
    <div className="contact-page">
      {/* Header Banner (Screenshot 1) */}
      <div className="contact-hero-banner">
        <Breadcrumbs
          items={[{ label: 'Home', to: '/' }]}
          current="Contact"
        />
        <p className="eyebrow">Get In Touch</p>
        <h1 className="contact-hero-title">We Would Love to Hear From You</h1>
        <p className="contact-hero-sub">Get in touch with our studio artisans and floral concierge.</p>
      </div>

      {/* Interactive Location Map (Screenshot 1) */}
      <section className="contact-map-section" aria-label="Studio Location Map">
        <div className="contact-map-card">
          <div className="map-embed-frame">
            <iframe
              title="Flower & Flora Colombo Flagship Studio"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15843.435773177894!2d79.866034!3d6.907481!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2597b876e6255%3A0x6b447cb028ef7988!2sCinnamon%20Gardens%2C%20Colombo%2007!5e0!3m2!1sen!2slk!4v1700000000000!5m2!1sen!2slk"
              width="100%"
              height="380"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* Rose Emblem + Need Help? Row (Screenshot 1) */}
      <div className="contact-emblem-wrap">
        <div className="rose-emblem-icon" aria-hidden="true">
          <Flower2 size={36} strokeWidth={1.5} />
        </div>
        <h2 className="need-help-title">Need Help?</h2>
        <div className="emblem-divider" aria-hidden="true" />
      </div>

      {/* 3-Column Help Info (Screenshot 1) */}
      <section className="contact-info-section" aria-label="Contact channels">
        <div className="contact-cards-grid">
          {/* Col 1: Phone / Customer Care */}
          <div className="contact-info-card">
            <div className="contact-icon-circle" aria-hidden="true">
              <Phone size={22} />
            </div>
            <span className="contact-col-kicker">PHONE</span>
            <h3 className="contact-col-title">Customer Care</h3>
            <p>Our floral concierge team is available 6 days a week.</p>
            <a href="tel:+94112345678" className="contact-link">+94 11 234 5678</a>
            <span className="contact-subtext">Mon–Sat: 8:00 AM – 7:00 PM</span>
          </div>

          {/* Col 2: Customer Service / Studio Pavilions */}
          <div className="contact-info-card">
            <div className="contact-icon-circle" aria-hidden="true">
              <MapPin size={22} />
            </div>
            <span className="contact-col-kicker">CUSTOMER SERVICE</span>
            <h3 className="contact-col-title">Studio Pavilions</h3>
            <p>Visit our flagship artisanal flower displays.</p>
            <address className="contact-address">
              42 Horton Place, Colombo 07<br />
              18 Peradeniya Rd, Kandy
            </address>
          </div>

          {/* Col 3: Returns / Florist Partnerships */}
          <div className="contact-info-card">
            <div className="contact-icon-circle" aria-hidden="true">
              <Mail size={22} />
            </div>
            <span className="contact-col-kicker">RETURNS</span>
            <h3 className="contact-col-title">Florist Partnerships</h3>
            <p>Are you an artisanal grower or boutique florist?</p>
            <a href="mailto:growers@flowerflora.lk" className="contact-link">growers@flowerflora.lk</a>
            <span className="contact-subtext">Supplier onboarding inquiries</span>
          </div>
        </div>
      </section>

      {/* "Send Us Your Questions!" Pastel Green Card (Screenshot 1) */}
      <section className="contact-form-section">
        <div className="contact-form-framed-card">
          {/* Baby's breath floral sprays decoration */}
          <div className="floral-spray floral-spray--left" aria-hidden="true">
            <svg width="60" height="120" viewBox="0 0 60 120" fill="none">
              <path d="M10 110Q30 60 50 10M30 70Q15 50 20 40M40 40Q55 30 50 20M25 85Q10 80 15 70" stroke="var(--color-sage-accent)" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
              <circle cx="50" cy="10" r="3" fill="var(--color-mint-soft)"/>
              <circle cx="20" cy="40" r="2.5" fill="var(--color-mint-soft)"/>
              <circle cx="50" cy="20" r="2.5" fill="var(--color-mint-soft)"/>
              <circle cx="15" cy="70" r="2" fill="var(--color-mint-soft)"/>
            </svg>
          </div>
          <div className="floral-spray floral-spray--right" aria-hidden="true">
            <svg width="60" height="120" viewBox="0 0 60 120" fill="none">
              <path d="M50 110Q30 60 10 10M30 70Q45 50 40 40M20 40Q5 30 10 20M35 85Q50 80 45 70" stroke="var(--color-sage-accent)" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
              <circle cx="10" cy="10" r="3" fill="var(--color-mint-soft)"/>
              <circle cx="40" cy="40" r="2.5" fill="var(--color-mint-soft)"/>
              <circle cx="10" cy="20" r="2.5" fill="var(--color-mint-soft)"/>
              <circle cx="45" cy="70" r="2" fill="var(--color-mint-soft)"/>
            </svg>
          </div>

          <div className="contact-form-header">
            <h2 className="contact-form-title">Send Us Your Questions!</h2>
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
                  setErrors({});
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
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                  }}
                  error={errors.name}
                  placeholder="e.g. Amara Senanayake"
                />

                <TextField
                  label="Email Address"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  error={errors.email}
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
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (errors.message) setErrors((prev) => ({ ...prev, message: undefined }));
                  }}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? 'contact-message-error' : undefined}
                  placeholder="Tell us about your floral arrangements, wedding dates, or questions..."
                  className={`contact-textarea ${errors.message ? 'is-invalid' : ''}`}
                />
                {errors.message && (
                  <p id="contact-message-error" className="field__error" role="alert">
                    {errors.message}
                  </p>
                )}
              </div>

              <div className="form-submit-row">
                <Button type="submit" variant="primary" className="contact-submit-btn">
                  Send Message <Send size={15} aria-hidden="true" />
                </Button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
