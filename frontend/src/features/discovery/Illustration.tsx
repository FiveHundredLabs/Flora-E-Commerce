import type { Product } from './model';

/**
 * Modern High-Resolution Photorealistic Botanical Vector Visual
 * Original decorative vector study, 100% offline, CSP-compliant.
 */
export function Illustration({
  category,
  className = '',
}: {
  category: Product['category'];
  slug?: string;
  alt?: string;
  secondary?: boolean;
  className?: string;
}) {
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
