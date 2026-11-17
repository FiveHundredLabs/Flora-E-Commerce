import type { Product } from './model';

/** Original decorative vector study, not a product photograph or approved logo. */
export function Illustration({ category }: { category: Product['category'] }) {
  return <svg className={`catalog-art catalog-art--${category}`} viewBox="0 0 320 240" aria-hidden="true" focusable="false">
    <path d="M0 215Q160 185 320 215V240H0Z" fill="var(--secondary)" />
    <g fill="none" stroke="var(--primary)" strokeWidth="2" opacity=".7">
      <path d="M160 196V89M160 164Q110 158 109 122Q155 122 160 164ZM160 143Q206 136 211 105Q167 108 160 143Z" />
      {category === 'plants' ? <><path d="M133 169H187L178 211H142ZM160 114Q126 96 132 65Q161 77 160 114ZM160 96Q184 82 185 52Q158 63 160 96Z" /><path d="M139 183H181" /></>
        : <>{[0, 60, 120, 180, 240, 300].map((angle) => <ellipse key={angle} cx="160" cy="63" rx="13" ry="26" transform={`rotate(${angle} 160 89)`} fill="var(--card)" />)}<circle cx="160" cy="89" r="11" fill="var(--secondary)" />{category === 'bouquets' && <path d="M134 168L160 214L186 168M143 187L177 187" />}</>}
    </g>
  </svg>;
}
