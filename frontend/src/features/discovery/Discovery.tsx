import { Link, useLocation, useParams, useSearchParams } from 'react-router';
import { useEffect, useRef, useState, type ReactNode } from 'react';
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
      {/* Breadcrumb Header */}
      <div className="discovery-hero-header">
        <p className="eyebrow">Discover at your own pace</p>
        <h1>{title}</h1>
        <p>{kind === 'shops' ? 'Meet the spaces behind the stems.' : 'A small collection of flowers, foliage and growing things.'}</p>
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
        {/* Left Column: Filters */}
        <Filters
          values={filters}
          revision={navigationKey}
          apply={(values) => setParams(writeFilters(values))}
          clear={() => setParams({})}
        />

        {/* Right Column: Catalog Grid & Toolbar */}
        <div className="discovery-content-area">
          {/* Top Toolbar */}
          <div className="discovery-toolbar">
            <div className="discovery-toolbar__counter">
              {query.data && (
                <p role="status" aria-live="polite" className="results-count-status">
                  {count} sample {kind === 'shops' ? 'shops' : 'products'} found.
                </p>
              )}
            </div>

            <div className="discovery-toolbar__controls">
              <div className="discovery-toolbar__sort">
                <label htmlFor="toolbar-sort-select" className="sr-only">Sort collection</label>
                <select
                  id="toolbar-sort-select"
                  aria-label="Sort collection"
                  className="fiama-toolbar-select"
                  value={filters.sort}
                  onChange={(e) => setParams(writeFilters({ ...filters, sort: e.target.value as typeof filters.sort }))}
                >
                  <option value="name-asc">Sort: A to Z</option>
                  <option value="name-desc">Sort: Z to A</option>
                </select>
              </div>

              {kind === 'products' && (
                <div className="discovery-toolbar__views" role="group" aria-label="Layout view mode">
                  <button
                    type="button"
                    className={`view-mode-btn ${viewMode === '3-col' ? 'is-active' : ''}`}
                    aria-label="3-column grid view"
                    aria-pressed={viewMode === '3-col'}
                    onClick={() => setViewMode('3-col')}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <rect x="2" y="2" width="5" height="20" />
                      <rect x="9.5" y="2" width="5" height="20" />
                      <rect x="17" y="2" width="5" height="20" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className={`view-mode-btn ${viewMode === '4-col' ? 'is-active' : ''}`}
                    aria-label="4-column grid view"
                    aria-pressed={viewMode === '4-col'}
                    onClick={() => setViewMode('4-col')}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <rect x="2" y="2" width="4" height="20" />
                      <rect x="7.5" y="2" width="4" height="20" />
                      <rect x="13" y="2" width="4" height="20" />
                      <rect x="18.5" y="2" width="4" height="20" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className={`view-mode-btn ${viewMode === 'list' ? 'is-active' : ''}`}
                    aria-label="List view"
                    aria-pressed={viewMode === 'list'}
                    onClick={() => setViewMode('list')}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <rect x="2" y="4" width="20" height="3" />
                      <rect x="2" y="10.5" width="20" height="3" />
                      <rect x="2" y="17" width="20" height="3" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>

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
              title={`Sample ${title.toLowerCase()}`}
              state={
                query.isPending || (query.isFetching && !query.data)
                  ? { status: 'loading' }
                  : !query.data
                  ? { status: 'error', onRetry: () => { void query.refetch(); } }
                  : count === 0
                  ? { status: 'empty', message: 'No matches. Try another search or clear the filters.' }
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

          {/* Numerical Pagination */}
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
  renderProductAction?: (product: Product) => ReactNode;
}) {
  const results = useRef<HTMLDivElement>(null);
  const { slug } = useParams();
  const [params] = useSearchParams();
  const returnSearch = writeFilters(readFilters(params).filters).toString();
  const listPath = `/${kind}${returnSearch ? `?${returnSearch}` : ''}`;
  const query = useDiscovery(adapter);
  const wishlist = useWishlist();

  const [activeTab, setActiveTab] = useState<'desc' | 'care' | 'delivery' | 'reviews'>('desc');
  const [activeThumbnail, setActiveThumbnail] = useState(1);
  const [pdpQuantity, setPdpQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<'Standard' | 'Deluxe' | 'Premium'>('Standard');

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

  return (
    <div className="discovery-detail-page">
      <Breadcrumbs
        items={[
          { label: 'Marketplace', to: '/' },
          { label: kind === 'shops' ? 'Shops' : 'Products', to: listPath },
        ]}
        current={record?.name ?? `${label} details`}
      />

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
                  children: (
                    <div className="catalog-detail fiama-pdp-layout">
                      <div className="pdp-gallery-column">
                        <div className="pdp-main-image-wrap">
                          <Illustration
                            category={'category' in record ? record.category : record.categories[0] ?? 'bouquets'}
                          />
                          {'category' in record && <Badge tone="sale" className="pdp-badge">SALE -20%</Badge>}
                        </div>
                        <div className="pdp-thumbnails-strip" role="group" aria-label="Product thumbnails">
                          {[1, 2, 3, 4].map((thumb) => (
                            <button
                              key={thumb}
                              type="button"
                              className={`pdp-thumb-box ${activeThumbnail === thumb ? 'is-active' : ''}`}
                              aria-label={`Thumbnail ${thumb}`}
                              onClick={() => setActiveThumbnail(thumb)}
                            >
                              <Illustration
                                category={'category' in record ? record.category : record.categories[0] ?? 'bouquets'}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="pdp-info-column">
                        <p className="pdp-description">{record.description}</p>

                        {'location' in record ? (
                          <div className="shop-detail-meta">
                            <p className="shop-location-text">
                              {locationNames[record.location]} · Fictional location
                            </p>
                            <p className="shop-categories-text">
                              {record.categories.map((category) => categoryNames[category]).join(' · ')}
                            </p>
                            <p className="shop-contact-notice">Contact details are not available in the sample catalog.</p>
                          </div>
                        ) : (
                          <div className="product-detail-meta">
                            <div className="pdp-tags-row">
                              <Badge tone="subtle">{categoryNames[record.category]}</Badge>
                              {store && (
                                <span className="pdp-store-attribution">
                                  From <Link to={`/shops/${store.slug}`}>{store.name}</Link>
                                </span>
                              )}
                            </div>

                            <div className="pdp-rating-stars" aria-label="5 out of 5 stars">
                              <span className="stars-gold">★★★★★</span>
                              <span className="rating-count">(4.9 · 24 customer reviews)</span>
                            </div>

                            <div className="pdp-price-row">
                              <span className="pdp-price-current">$38.00</span>
                              <span className="pdp-price-original">$48.00</span>
                              <span className="pdp-stock-tag">In Stock</span>
                            </div>

                            <p className="sample-catalog-notice">Illustration only. Price and availability are not offered in this sample catalog.</p>

                            {/* Variant selector */}
                            <div className="pdp-variant-block">
                              <span className="variant-title">Arrangement Size:</span>
                              <div className="variant-pill-group" role="radiogroup" aria-label="Arrangement size">
                                {(['Standard', 'Deluxe', 'Premium'] as const).map((size) => (
                                  <button
                                    key={size}
                                    type="button"
                                    role="radio"
                                    aria-checked={selectedVariant === size}
                                    className={`pdp-variant-pill ${selectedVariant === size ? 'is-selected' : ''}`}
                                    onClick={() => setSelectedVariant(size)}
                                  >
                                    {size}
                                  </button>
                                ))}
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
                            {renderProductAction?.(record)}
                          </div>
                        )}
                      </div>
                    </div>
                  ),
                }
          }
        />

        {/* Product Information Tabs */}
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
                id="tab-care"
                aria-controls="panel-care"
                aria-selected={activeTab === 'care'}
                className={`pdp-tab-btn ${activeTab === 'care' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('care')}
              >
                Floral Care Guide
              </button>
              <button
                type="button"
                role="tab"
                id="tab-delivery"
                aria-controls="panel-delivery"
                aria-selected={activeTab === 'delivery'}
                className={`pdp-tab-btn ${activeTab === 'delivery' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('delivery')}
              >
                Delivery & Packaging
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
            </div>

            <div className="pdp-tab-panels">
              {activeTab === 'desc' && (
                <div role="tabpanel" id="panel-desc" aria-labelledby="tab-desc" className="pdp-tab-panel">
                  <p>{record.description}</p>
                  <table className="fiama-spec-table">
                    <tbody>
                      <tr>
                        <th>Arrangement Type</th>
                        <td>Hand-tied artisanal botanical bouquet</td>
                      </tr>
                      <tr>
                        <th>Vase Life</th>
                        <td>7–10 days with regular water replacement</td>
                      </tr>
                      <tr>
                        <th>Stem Count</th>
                        <td>18–24 assorted blooms & lush green foliage</td>
                      </tr>
                      <tr>
                        <th>Sourcing</th>
                        <td>Locally cultivated by artisanal botanical growers</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'care' && (
                <div role="tabpanel" id="panel-care" aria-labelledby="tab-care" className="pdp-tab-panel">
                  <h3>How to Keep Your Flowers Fresh</h3>
                  <ul>
                    <li>Trim stems diagonally at a 45° angle before placing in fresh water.</li>
                    <li>Change vase water every 48 hours and add flower food.</li>
                    <li>Keep blooms away from direct sunlight, heating vents, and ripening fruit.</li>
                    <li>Mist foliage lightly with clean water each morning.</li>
                  </ul>
                </div>
              )}

              {activeTab === 'delivery' && (
                <div role="tabpanel" id="panel-delivery" aria-labelledby="tab-delivery" className="pdp-tab-panel">
                  <h3>Delivery & Sustainable Packaging</h3>
                  <p>
                    Every floral arrangement is hand-delivered in temperature-controlled, 100% recyclable hydration packs.
                    Orders placed before 2:00 PM are eligible for same-day local delivery across Colombo and Kandy metro areas.
                  </p>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div role="tabpanel" id="panel-reviews" aria-labelledby="tab-reviews" className="pdp-tab-panel">
                  <div className="pdp-reviews-summary">
                    <span className="reviews-score">4.9</span>
                    <span className="reviews-stars">★★★★★</span>
                    <span>Based on 24 verified floral enthusiast reviews</span>
                  </div>
                  <div className="pdp-review-item">
                    <div className="review-header">
                      <strong>Eleanor Vance</strong>
                      <span className="stars-gold">★★★★★</span>
                      <span className="review-date">2 days ago</span>
                    </div>
                    <p>The stems arrived in pristine condition! Exquisite color harmony and fresh scent lasted well over a week.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {kind === 'shops' && query.data && record && (
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
        )}
      </div>

      <Link className="catalog-back" to={listPath}>
        Back to {kind}
      </Link>
    </div>
  );
}
