import { useState } from 'react';
import type { categories } from './model';
import { botanicalProducts, getCategoryPhoto, getStorePhoto } from './assets';

type IllustrationKind = typeof categories[number];

/**
 * Botanical Visual Component:
 * Displays verified high-resolution photography when available for products and stores,
 * with automatic, graceful fallback to responsive SVG botanical vector graphics.
 */
export function Illustration({
  category,
  slug,
  alt,
  secondary = false,
  className = '',
}: {
  category: IllustrationKind;
  slug?: string;
  alt?: string;
  secondary?: boolean;
  className?: string;
}) {
  const [hasError, setHasError] = useState(false);

  let photoUrl: string | undefined;
  let photoAlt: string | undefined;

  if (!hasError) {
    if (slug) {
      const productPhoto = botanicalProducts[slug];
      if (productPhoto) {
        photoUrl = secondary && productPhoto.secondary ? productPhoto.secondary : productPhoto.primary;
        photoAlt = alt ?? productPhoto.alt;
      } else {
        const storePhoto = getStorePhoto(slug);
        if (storePhoto) {
          photoUrl = storePhoto.primary;
          photoAlt = alt ?? storePhoto.alt;
        }
      }
    } else {
      const categoryPhoto = getCategoryPhoto(category);
      photoUrl = categoryPhoto?.primary;
      photoAlt = categoryPhoto?.alt;
    }
  }

  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={photoAlt ?? `${category} botanical sample visual`}
        className={`catalog-art catalog-photo catalog-photo--${category} ${className}`}
        loading="lazy"
        onError={() => setHasError(true)}
      />
    );
  }

  return (
    <svg
      className={`catalog-art catalog-art--${category} ${className}`}
      viewBox="0 0 320 240"
      aria-hidden={alt ? undefined : 'true'}
      aria-label={alt}
      role={alt ? 'img' : undefined}
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
