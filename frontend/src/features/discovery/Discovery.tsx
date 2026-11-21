import { Link, useLocation, useParams, useSearchParams } from 'react-router';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Eye, Flame, CheckCircle, Truck, ShieldCheck, Ruler, Grid3X3, Grid2X2, LayoutGrid } from 'lucide-react';
import { AsyncRegion } from '../../shared/components/AsyncRegion';
import { Badge } from '../../shared/components/ui/Content';
import { Breadcrumbs } from '../../shared/components/ui/Breadcrumbs';
import { useDiscovery } from './query';
import { type DiscoveryAdapter } from './api/mock';
import {
  categoryNames,
  defaultFilters,
  locationNames,
  readFilters,
  selectProducts,
  selectStores,
  writeFilters,
  type Kind,
  type Product,
} from './model';
import { Filters } from './Filters';
import { ProductCards, StoreCards } from './Cards';
import { Illustration } from './Illustration';
import { RefreshNotice } from './RefreshNotice';
import { useWishlist } from './wishlist';
import { categoryCirculars } from './assets';

export function MockNotice() {
  return (
    <div className="mock-notice">
      <Badge>Sample catalog · MOCK</Badge>
      <p>All shops and products here are fictional. No real purchases or payments are available.</p>
    </div>
  );
}

export function DiscoveryList({ kind, adapter }: { kind: Kind; adapter?: DiscoveryAdapter }) {
  const query = useDiscovery(adapter);
  const results = useRef<HTMLDivElement>(null);
  const { key: navigationKey } = useLocation();
  const [params, setParams] = useSearchParams();
  const { filters, invalid } = readFilters(params);
  const [viewMode, setViewMode] = useState<'3-col' | '4-col' | 'list'>('3-col');
  const [currentPage, setCurrentPage] = useState(1);

  const title = kind === 'shops' ? 'Shops' : 'Products';
  const stores = query.data ? selectStores(query.data, filters) : [];
  const products = query.data ? selectProducts(query.data, filters) : [];
  const count = kind === 'shops' ? stores.length : products.length;

  return (
    <div className="discovery-page-layout">
      {/* Hero Banner with Model Cutout & 4 Category Circles (Screenshot 3) */}
      <div className="catalog-hero-banner">
        <div className="catalog-hero-inner">
          <div className="catalog-hero-copy">
            <Breadcrumbs
              items={[{ label: 'Home', to: '/' }]}
              current={title}
            />
            <h1 className="catalog-hero-title">{title}</h1>
            <p className="catalog-hero-sub">
              {kind === 'shops'
                ? 'Meet the independent artisan studios behind our sustainable stems.'
                : 'Hand-picked blooms, lush ferns, and bespoke floral arrangements.'}
            </p>

            {/* 4 Circular Category Icon Buttons (Screenshot 3) */}
            <div className="catalog-hero-categories" role="group" aria-label="Quick category filters">
              {Object.entries(categoryCirculars).map(([key, cat]) => {
                const targetLink = kind === 'shops' ? cat.link.replace('/products', '/shops') : cat.link;
                const icon = cat.title === 'Plant' ? '🪴' : cat.title === 'Next Day' ? '🌾' : cat.title === 'Birthday' ? '🌻' : '🌸';
                return (
                  <Link key={key} to={targetLink} className="catalog-category-pill">
                    <div className="pill-thumb" aria-hidden="true">
                      <span className="pill-thumb-symbol">{icon}</span>
                    </div>
                    <span className="pill-name">{cat.title.toUpperCase()}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="catalog-hero-model-wrap" aria-hidden="true">
            <svg className="catalog-hero-model-art" viewBox="0 0 160 160" width="140" height="140">
              <circle cx="80" cy="80" r="70" fill="var(--color-cream-warm)" stroke="var(--color-mint-soft)" strokeWidth="2" />
              <path d="M80 40 C60 60 50 90 80 120 C110 90 100 60 80 40 Z" fill="var(--color-forest-deep)" opacity="0.8" />
              <circle cx="80" cy="70" r="10" fill="var(--color-gold-warm)" />
            </svg>
          </div>
        </div>
      </div>

      <MockNotice />
      <p className="catalog-provisional">Sample filters are provisional while the final catalog rules are agreed.</p>

      {invalid && (
        <p role="alert">
          Some URL filters were invalid. Safe defaults are shown; you can clear or change the filters.
        </p>
      )}

      {/* Main 2-Column Grid */}
      <div className="discovery-main-grid">
        {/* Left Column: Filter Sidebar (Screenshot 3) */}
        <Filters
          values={filters}
          revision={navigationKey}
          apply={(values) => setParams(writeFilters(values))}
          clear={() => setParams({})}
        />

        {/* Right Column: Catalog Grid & Toolbar */}
        <div className="discovery-content-area">
          {/* Top Toolbar (Screenshot 3) */}
          <div className="discovery-toolbar">
            <div className="discovery-toolbar__counter">
              {query.data && (
                <p role="status" aria-live="polite" className="results-count-status">
                  You’ve viewed {count} of {count} sample {kind === 'shops' ? 'shops' : 'products'}
                </p>
              )}
            </div>

            <div className="discovery-toolbar__controls">
              {/* Layout Switchers */}
              <div className="discovery-toolbar__modes" role="group" aria-label="Layout view mode">
                <button
                  type="button"
                  className={`view-mode-btn ${viewMode === '3-col' ? 'is-active' : ''}`}
                  aria-label="3 column grid view"
                  aria-pressed={viewMode === '3-col'}
                  onClick={() => setViewMode('3-col')}
                >
                  <Grid3X3 size={18} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className={`view-mode-btn ${viewMode === '4-col' ? 'is-active' : ''}`}
                  aria-label="4 column grid view"
                  aria-pressed={viewMode === '4-col'}
                  onClick={() => setViewMode('4-col')}
                >
                  <LayoutGrid size={18} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className={`view-mode-btn ${viewMode === 'list' ? 'is-active' : ''}`}
                  aria-label="List view"
                  aria-pressed={viewMode === 'list'}
                  onClick={() => setViewMode('list')}
                >
                  <Grid2X2 size={18} aria-hidden="true" />
                </button>
              </div>

              {/* Sorting Dropdown */}
              <div className="discovery-toolbar__sort">
                <label htmlFor="toolbar-sort-select" className="sr-only">Sort collection</label>
                <select
                  id="toolbar-sort-select"
                  aria-label="Sort collection"
                  className="fiama-toolbar-select"
                  value={filters.sort}
                  onChange={(e) => setParams(writeFilters({ ...filters, sort: e.target.value as typeof filters.sort }))}
                >
                  <option value="name-asc">Alphabetically: A-Z</option>
                  <option value="name-desc">Alphabetically: Z-A</option>
                </select>
              </div>
            </div>
          </div>

          {/* Refresh Notice */}
          {query.data && (
            <RefreshNotice
              fetching={query.isFetching}
              failed={query.isError}
              retry={() => query.refetch()}
              target={results}
            />
          )}

          {/* Catalog Async Content Region */}
          <div ref={results}>
            <AsyncRegion
              title={`Sample ${kind}`}
              state={
                query.isPending || (query.isFetching && !query.data)
                  ? { status: 'loading' }
                  : !query.data
                  ? { status: 'error', onRetry: () => { void query.refetch(); } }
                  : count === 0
                  ? { status: 'empty', message: 'No matches for your search filters.' }
                  : {
                      status: 'ready',
                      children:
                        kind === 'shops' ? (
                          <StoreCards stores={stores} />
                        ) : (
                          <ProductCards products={products} catalog={query.data} viewMode={viewMode} />
                        ),
                    }
              }
            />
          </div>

          {/* Numerical Pagination (Screenshot 3) */}
          {count > 0 && (
            <nav className="fiama-pagination" aria-label="Catalog pagination">
              <button
                type="button"
                className={`pagination-box ${currentPage === 1 ? 'is-active' : ''}`}
                aria-label="Page 1"
                aria-current={currentPage === 1 ? 'page' : undefined}
                onClick={() => setCurrentPage(1)}
              >
                1
              </button>
              {count > 6 && (
                <button
                  type="button"
                  className={`pagination-box ${currentPage === 2 ? 'is-active' : ''}`}
                  aria-label="Page 2"
                  aria-current={currentPage === 2 ? 'page' : undefined}
                  onClick={() => setCurrentPage(2)}
                >
                  2
                </button>
              )}
              <button
                type="button"
                className="pagination-box pagination-arrow"
                aria-label="Next page"
                onClick={() => setCurrentPage((p) => Math.min(2, p + 1))}
              >
                →
              </button>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}

export function DiscoveryDetail({
  kind,
  adapter,
  renderProductAction,
}: {
  kind: Kind;
  adapter?: DiscoveryAdapter;
  renderProductAction?: (product: Product, quantity?: number) => ReactNode;
}) {
  const results = useRef<HTMLDivElement>(null);
  const { slug } = useParams();
  const [params] = useSearchParams();
  const returnSearch = writeFilters(readFilters(params).filters).toString();
  const listPath = `/${kind}${returnSearch ? `?${returnSearch}` : ''}`;
  const query = useDiscovery(adapter);
  const wishlist = useWishlist();

  const [activeTab, setActiveTab] = useState<'desc' | 'reviews' | 'shipping' | 'returns'>('desc');
  const [activeThumbnail, setActiveThumbnail] = useState(1);
  const [pdpQuantity, setPdpQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<'S' | 'M' | 'L' | 'XL'>('M');
  const [selectedColor, setSelectedColor] = useState(0);
  const [agreedTerms, setAgreedTerms] = useState(true);

  const colors = [
    { name: 'Pure White', hex: '#FAF9F6' },
    { name: 'Sage Leaf', hex: '#6F967B' },
    { name: 'Warm Cream', hex: '#EED9C4' },
    { name: 'Blush Rose', hex: '#E8B4B8' },
  ];

  const record =
    kind === 'shops'
      ? query.data?.stores.find((store) => store.slug === slug)
      : query.data?.products.find((product) => product.slug === slug);

  const store =
    kind === 'products'
      ? query.data?.stores.find(
          (item) => item.slug === query.data?.products.find((product) => product.slug === slug)?.storeSlug,
        )
      : undefined;

  const label = kind === 'shops' ? 'Shop' : 'Product';
  const pageTitle = record?.name ?? (query.data ? `${label} not found` : `${label} details`);

  useEffect(() => {
    document.title = `${pageTitle} | Flower & Flora`;
  }, [pageTitle]);

  const isProduct = kind === 'products' && record && 'category' in record;
  const inWishlist = isProduct ? wishlist.has(record.slug) : false;

  // Filter products for the store or related products
  const relatedProducts = query.data?.products.filter((p) => p.slug !== slug).slice(0, 4) ?? [];

  return (
    <div className="discovery-detail-page">
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: kind === 'shops' ? 'Shops' : 'Products', to: listPath },
        ]}
        current={record?.name ?? `${label} details`}
      />

      {/* Accessible Title */}
      <div className="page-heading">
        <h1>{pageTitle}</h1>
      </div>

      <MockNotice />

      {query.data && (
        <RefreshNotice
          fetching={query.isFetching}
          failed={query.isError}
          retry={() => query.refetch()}
          target={results}
        />
      )}

      <div ref={results}>
        <AsyncRegion
          title={`${label} information`}
          state={
            query.isPending || (query.isFetching && !query.data)
              ? { status: 'loading' }
              : !query.data
              ? { status: 'error', onRetry: () => { void query.refetch(); } }
              : !record
              ? { status: 'empty', message: `This sample ${label.toLowerCase()} could not be found.` }
              : {
                  status: 'ready',
                  children:
                    kind === 'shops' && 'location' in record ? (
                      <div className="catalog-detail fiama-shop-detail-layout">
                        <div className="shop-studio-banner-card">
                          <div className="shop-studio-header-row">
                            <div className="shop-studio-avatar" aria-hidden="true">
                              <span>{record.name.slice(0, 2).toUpperCase()}</span>
                            </div>
                            <div className="shop-studio-meta">
                              <Badge tone="new">Verified Artisan Florist</Badge>
                              <h2 className="shop-studio-title">{record.name}</h2>
                              <p className="shop-location-text">
                                📍 {locationNames[record.location]} · Independent Floristry Studio
                              </p>
                            </div>
                          </div>
                          <p className="shop-description-text">{record.description}</p>
                          <div className="shop-categories-tags">
                            {record.categories.map((cat) => (
                              <span key={cat} className="shop-category-tag">
                                {categoryNames[cat]}
                              </span>
                            ))}
                          </div>
                          <p className="shop-contact-notice">Contact details are not available in the sample catalog.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="catalog-detail fiama-pdp-layout">
                        {/* Left Column: 5-Thumbnail Vertical Strip + Zoomable Photo (Screenshot 2) */}
                        <div className="pdp-gallery-column">
                          <div className="pdp-gallery-strip-layout">
                            {/* 5-Thumbnail Strip */}
                            <div className="pdp-thumbnails-strip" role="group" aria-label="Product thumbnails">
                              {[1, 2, 3, 4, 5].map((thumb) => (
                                <button
                                  key={thumb}
                                  type="button"
                                  className={`pdp-thumb-box ${activeThumbnail === thumb ? 'is-active' : ''}`}
                                  aria-label={`Thumbnail ${thumb}`}
                                  onClick={() => setActiveThumbnail(thumb)}
                                >
                                  <Illustration
                                    category={'category' in record ? record.category : 'bouquets'}
                                  />
                                </button>
                              ))}
                            </div>

                            {/* Large Main Zoomable Photo */}
                            <div className="pdp-main-image-wrap">
                              <Illustration
                                category={'category' in record ? record.category : 'bouquets'}
                                className="pdp-main-illustration"
                              />
                              <Badge tone="sale" className="pdp-badge">-20%</Badge>
                            </div>
                          </div>
                        </div>

                        {/* Right Column: Buy Box (Screenshot 2) */}
                        <div className="pdp-info-column">
                          <p className="pdp-description">{record.description}</p>

                          <div className="product-detail-meta">
                            {/* Title & Reviews */}
                            <div className="pdp-header-block">
                              <h2 className="pdp-title">{record.name}</h2>
                              <div className="pdp-rating-stars" aria-label="5 out of 5 stars">
                                <span className="stars-gold">★★★★★</span>
                                <span className="rating-count">(4.9 · 24 customer reviews)</span>
                              </div>
                            </div>

                            {/* Price Comparison */}
                            <div className="pdp-price-row">
                              <span className="pdp-price-original">$48.00</span>
                              <span className="pdp-price-current">$38.00</span>
                              <Badge tone="stock" className="pdp-stock-badge">In Stock</Badge>
                            </div>

                            {/* Store Attribution (OD-02) */}
                            {store && (
                              <div className="pdp-store-attribution-row">
                                <span className="attribution-label">Crafted by:</span>
                                <Link to={`/shops/${store.slug}`} className="attribution-store-link">
                                  {store.name}
                                </Link>
                              </div>
                            )}

                            {/* Social Proof Live Badges (Screenshot 2) */}
                            <div className="pdp-social-proof-badges">
                              <div className="social-badge-item">
                                <Eye size={15} className="social-icon" aria-hidden="true" />
                                <span><strong>12 people</strong> are viewing this right now</span>
                              </div>
                              <div className="social-badge-item">
                                <Flame size={15} className="social-icon social-icon--fire" aria-hidden="true" />
                                <span><strong>16 sold</strong> in last 6 hours</span>
                              </div>
                              <div className="social-badge-item">
                                <CheckCircle size={15} className="social-icon social-icon--check" aria-hidden="true" />
                                <span>In stock - ready for fresh same-day dispatch</span>
                              </div>
                            </div>

                            {/* Color Selection Swatches (Screenshot 2) */}
                            <div className="pdp-options-block">
                              <span className="option-label">Color: <strong>{colors[selectedColor]?.name}</strong></span>
                              <div className="pdp-swatches-row" role="radiogroup" aria-label="Flower color palette">
                                {colors.map((c, i) => (
                                  <button
                                    key={c.name}
                                    type="button"
                                    role="radio"
                                    aria-checked={selectedColor === i}
                                    className={`pdp-swatch-circle ${selectedColor === i ? 'is-selected' : ''}`}
                                    style={{ backgroundColor: c.hex }}
                                    title={c.name}
                                    onClick={() => setSelectedColor(i)}
                                  />
                                ))}
                              </div>
                            </div>

                            {/* Size Selection Pills (Screenshot 2) */}
                            <div className="pdp-options-block">
                              <div className="option-header-row">
                                <span className="option-label">Size: <strong>{selectedVariant}</strong></span>
                                <button type="button" className="size-guide-btn">
                                  <Ruler size={14} aria-hidden="true" /> Size Guide
                                </button>
                              </div>
                              <div className="pdp-size-pills-row" role="radiogroup" aria-label="Arrangement size">
                                {(['S', 'M', 'L', 'XL'] as const).map((size) => (
                                  <button
                                    key={size}
                                    type="button"
                                    role="radio"
                                    aria-checked={selectedVariant === size}
                                    className={`pdp-size-pill ${selectedVariant === size ? 'is-selected' : ''}`}
                                    onClick={() => setSelectedVariant(size)}
                                  >
                                    {size}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Stock Urgency Progress Bar (Screenshot 2) */}
                            <div className="pdp-stock-urgency-block">
                              <p className="stock-urgency-text">Only <strong>10 item(s)</strong> left in stock!</p>
                              <div className="stock-urgency-track">
                                <div className="stock-urgency-fill" style={{ width: '40%' }} />
                              </div>
                            </div>

                            {/* Boxed Quantity Stepper */}
                            <div className="pdp-stepper-row">
                              <div className="cart-plus-minus" role="group" aria-label="Product quantity">
                                <button
                                  type="button"
                                  className="dec qtybutton"
                                  aria-label="Decrease quantity"
                                  disabled={pdpQuantity <= 1}
                                  onClick={() => setPdpQuantity((q) => Math.max(1, q - 1))}
                                >
                                  -
                                </button>
                                <input
                                  type="number"
                                  aria-label="Selected quantity"
                                  value={pdpQuantity}
                                  min={1}
                                  max={99}
                                  readOnly
                                  className="cart-plus-minus-box"
                                />
                                <button
                                  type="button"
                                  className="inc qtybutton"
                                  aria-label="Increase quantity"
                                  disabled={pdpQuantity >= 99}
                                  onClick={() => setPdpQuantity((q) => Math.min(99, q + 1))}
                                >
                                  +
                                </button>
                              </div>

                              <button
                                type="button"
                                className={`pdp-wishlist-toggle ${inWishlist ? 'is-active' : ''}`}
                                aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                                aria-pressed={inWishlist}
                                onClick={() =>
                                  'category' in record &&
                                  wishlist.toggle({
                                    productSlug: record.slug,
                                    storeSlug: record.storeSlug,
                                    name: record.name,
                                    category: record.category,
                                  })
                                }
                              >
                                {inWishlist ? '♥ In Wishlist' : '♡ Add to Wishlist'}
                              </button>
                            </div>

                            {/* Consumer action slot (AddSampleProduct) */}
                            {'category' in record && renderProductAction?.(record, pdpQuantity)}

                            {/* Terms Checkbox */}
                            <div className="pdp-terms-row">
                              <label className="pdp-terms-label">
                                <input
                                  type="checkbox"
                                  checked={agreedTerms}
                                  onChange={(e) => setAgreedTerms(e.target.checked)}
                                />
                                <span>I agree with the Terms and conditions</span>
                              </label>
                            </div>

                            {/* Estimated Delivery Widget (Screenshot 2) */}
                            <div className="pdp-delivery-estimate-card">
                              <Truck size={20} className="delivery-icon" aria-hidden="true" />
                              <div className="delivery-text">
                                <p><strong>Estimated Delivery:</strong> Order in the next <strong>12 hours</strong> to get it between Nov 26 and Nov 29.</p>
                              </div>
                            </div>

                            {/* Volume Pricing Discount Box (Screenshot 2) */}
                            <div className="pdp-volume-pricing-box">
                              <h4 className="volume-title">Buy more save more!</h4>
                              <div className="volume-tiers-list">
                                <div className="volume-tier-item">
                                  <span>Buy 2:</span>
                                  <strong>Save 5% ($36.10 each)</strong>
                                </div>
                                <div className="volume-tier-item">
                                  <span>Buy 3:</span>
                                  <strong>Save 10% ($34.20 each)</strong>
                                </div>
                                <div className="volume-tier-item">
                                  <span>Buy 5+:</span>
                                  <strong>Save 15% ($32.30 each)</strong>
                                </div>
                              </div>
                            </div>

                            {/* Store Pickup Notice */}
                            <div className="pdp-pickup-notice">
                              <CheckCircle size={16} aria-hidden="true" />
                              <span>Pickup available at <strong>{store?.name ?? 'Studio'}</strong> · Ready in 24 hours</span>
                            </div>

                            {/* Guaranteed Safe Checkout Badges (Screenshot 2) */}
                            <div className="pdp-safe-checkout-block">
                              <div className="checkout-title-row">
                                <ShieldCheck size={16} aria-hidden="true" />
                                <span>Guaranteed Safe & Secure Checkout</span>
                              </div>
                              <div className="checkout-icons-row">
                                <span className="payment-badge">VISA</span>
                                <span className="payment-badge">Mastercard</span>
                                <span className="payment-badge">AMEX</span>
                                <span className="payment-badge">Stripe</span>
                                <span className="payment-badge">Shopify Pay</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ),
                }
          }
        />

        {/* Shop Products Section (when kind === 'shops') */}
        {kind === 'shops' && query.data && record && (
          <div className="shop-products-section">
            <AsyncRegion
              title="Products from this shop"
              state={
                selectProducts(query.data, defaultFilters, record.slug).length === 0
                  ? { status: 'empty', message: 'No sample products for this shop yet.' }
                  : {
                      status: 'ready',
                      children: (
                        <ProductCards
                          products={selectProducts(query.data, defaultFilters, record.slug)}
                          catalog={query.data}
                        />
                      ),
                    }
              }
            />
          </div>
        )}

        {/* Product Information Tabs (Screenshot 2) */}
        {kind === 'products' && record && (
          <div className="pdp-tabs-container">
            <div className="pdp-tab-headers" role="tablist" aria-label="Product details tabs">
              <button
                type="button"
                role="tab"
                id="tab-desc"
                aria-controls="panel-desc"
                aria-selected={activeTab === 'desc'}
                className={`pdp-tab-btn ${activeTab === 'desc' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('desc')}
              >
                Description
              </button>
              <button
                type="button"
                role="tab"
                id="tab-reviews"
                aria-controls="panel-reviews"
                aria-selected={activeTab === 'reviews'}
                className={`pdp-tab-btn ${activeTab === 'reviews' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('reviews')}
              >
                Customer Reviews (24)
              </button>
              <button
                type="button"
                role="tab"
                id="tab-shipping"
                aria-controls="panel-shipping"
                aria-selected={activeTab === 'shipping'}
                className={`pdp-tab-btn ${activeTab === 'shipping' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('shipping')}
              >
                Shipping & Handling
              </button>
              <button
                type="button"
                role="tab"
                id="tab-returns"
                aria-controls="panel-returns"
                aria-selected={activeTab === 'returns'}
                className={`pdp-tab-btn ${activeTab === 'returns' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('returns')}
              >
                Return Policy
              </button>
            </div>

            <div className="pdp-tab-content-panel">
              {activeTab === 'desc' && (
                <div id="panel-desc" role="tabpanel" aria-labelledby="tab-desc">
                  <h3>Artisan Botanical Arrangement</h3>
                  <p>{record.description}</p>
                  <p>
                    Every floral composition is hand-tied by certified independent florists using sustainably grown,
                    chemical-free stems harvested on the morning of dispatch. Stems are conditioned in organic nutrient solution
                    and wrapped in biodegradable hydration wraps.
                  </p>
                </div>
              )}
              {activeTab === 'reviews' && (
                <div id="panel-reviews" role="tabpanel" aria-labelledby="tab-reviews">
                  <h3>Customer Reviews</h3>
                  <div className="review-item">
                    <div className="review-stars">★★★★★</div>
                    <p className="review-text">“The flowers arrived in pristine condition, with vibrant petals and dewdrops. Lasted over 10 days!”</p>
                    <span className="review-author">— Samantha K., Verified Buyer</span>
                  </div>
                </div>
              )}
              {activeTab === 'shipping' && (
                <div id="panel-shipping" role="tabpanel" aria-labelledby="tab-shipping">
                  <h3>Handcrafted Delivery</h3>
                  <p>Free standard delivery on all orders over $60. Hand-delivered in climate-controlled temperature bags.</p>
                </div>
              )}
              {activeTab === 'returns' && (
                <div id="panel-returns" role="tabpanel" aria-labelledby="tab-returns">
                  <h3>100% Freshness Guarantee</h3>
                  <p>If your bouquet does not remain radiant for at least 7 days, our studio will dispatch a complimentary replacement immediately.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Related Products Grid (Screenshot 2) */}
        {kind === 'products' && record && Boolean(renderProductAction) && relatedProducts.length > 0 && query.data && (
          <div className="pdp-related-products-section">
            <div className="section-title-wrap">
              <span className="eyebrow">Complementary Botanicals</span>
              <h2 className="section-title">Related Products</h2>
            </div>
            <ProductCards products={relatedProducts} catalog={query.data} viewMode="4-col" />
          </div>
        )}
      </div>

      <Link className="catalog-back" to={listPath}>
        Back to {kind}
      </Link>
    </div>
  );
}
