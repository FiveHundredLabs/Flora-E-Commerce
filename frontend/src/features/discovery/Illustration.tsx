import { useState } from 'react';
import type { Product } from './model';
import { getProductPhoto } from './assets';

/**
 * Modern High-Resolution Photorealistic Botanical Visual
 * Uses curated cutout photography with soft drop shadow and graceful vector fallback.
 */
export function Illustration({
  category,
  slug,
  alt,
  secondary = false,
  className = '',
}: {
  category: Product['category'];
  slug?: string;
  alt?: string;
  secondary?: boolean;
  className?: string;
}) {
  const [imageError, setImageError] = useState(false);
  const photo = getProductPhoto(slug);
  const imageSrc = secondary && photo.secondary ? photo.secondary : photo.primary;
  const imageAlt = alt || photo.alt;

  if (!imageError && imageSrc) {
    return (
      <img
        src={imageSrc}
        alt={imageAlt}
        loading="lazy"
        onError={() => setImageError(true)}
        className={`botanical-cutout-img ${className}`}
      />
    );
  }

  // Graceful botanical SVG fallback if offline or failed load
  return (
    <svg
      className={`catalog-art catalog-art--${category} ${className}`}
      viewBox="0 0 320 240"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id={`grad-${category}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--color-mint-soft)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="160" cy="120" r="100" fill={`url(#grad-${category})`} />
      <path d="M0 215Q160 185 320 215V240H0Z" fill="var(--secondary)" opacity="0.3" />
      <g fill="none" stroke="var(--primary)" strokeWidth="2" opacity=".8">
        <path d="M160 196V89M160 164Q110 158 109 122Q155 122 160 164ZM160 143Q206 136 211 105Q167 108 160 143Z" />
        {category === 'plants' ? (
          <>
            <path d="M133 169H187L178 211H142ZM160 114Q126 96 132 65Q161 77 160 114ZM160 96Q184 82 185 52Q158 63 160 96Z" />
            <path d="M139 183H181" />
          </>
        ) : (
          <>
            {[0, 60, 120, 180, 240, 300].map((angle) => (
              <ellipse
                key={angle}
                cx="160"
                cy="63"
                rx="13"
                ry="26"
                transform={`rotate(${angle} 160 89)`}
                fill="var(--card)"
              />
            ))}
            <circle cx="160" cy="89" r="11" fill="var(--secondary)" />
            {category === 'bouquets' && <path d="M134 168L160 214L186 168M143 187L177 187" />}
          </>
        )}
      </g>
    </svg>
  );
}
