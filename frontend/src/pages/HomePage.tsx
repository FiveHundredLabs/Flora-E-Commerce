import { useEffect } from 'react';
import { Link } from 'react-router';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { AsyncRegion } from '../shared/components/AsyncRegion';
import { Price, StatusTag } from '../shared/components/ui/Feedback';
import { Illustration, categoryNames, locationNames, useDiscovery, type Catalog, type DiscoveryAdapter, type Product, type Store } from '../features/discovery';
import './home-editorial.css';

const heroImage = '/assets/editorial-home-hero.webp';
const storyImage = '/assets/editorial-home-story.webp';
const campaignImage = '/assets/editorial-home-campaign.webp';

function FixtureProduct({ product, store }: { product: Product; store?: Store }) {
  const visualKind = store?.categories[0] ?? 'bouquets';
  return <article className="editorial-product">
    <Link to={`/products/${product.slug}`} className="editorial-product__visual" aria-label={`View ${product.name}`}>
      <Illustration category={visualKind} />
    </Link>
    <div className="editorial-product__body">
      <span className="editorial-kicker">Sample catalog item</span>
      <h3><Link to={`/products/${product.slug}`}>{product.name}</Link></h3>
      {store && <Link className="editorial-product__store" to={`/shops/${store.slug}`}>{store.name}</Link>}
      <div className="editorial-product__meta"><Price /><StatusTag>Availability not connected</StatusTag></div>
    </div>
  </article>;
}

function FixtureStore({ store }: { store: Store }) {
  return <article className="editorial-store">
    <div className="editorial-store__art"><Illustration category={store.categories[0] ?? 'bouquets'} /></div>
    <div className="editorial-store__content">
      <p className="editorial-store__location"><MapPin size={15} aria-hidden="true" />{locationNames[store.location]}</p>
      <h3><Link to={`/shops/${store.slug}`}>{store.name}</Link></h3>
      <p>{store.description}</p>
      <p className="editorial-store__categories">{store.categories.map((category) => categoryNames[category]).join(' · ')}</p>
      <Link to={`/shops/${store.slug}`} className="editorial-inline-link">Visit sample store <ArrowUpRight size={15} aria-hidden="true" /></Link>
    </div>
  </article>;
}

function CatalogHome({ catalog }: { catalog: Catalog }) {
  const storeCategories = [...new Set(catalog.stores.flatMap((store) => store.categories))];
  const featuredProducts = catalog.products.slice(0, 4);
  const featuredStores = catalog.stores.slice(0, 3);

  return <>
    <section className="editorial-section editorial-categories" aria-labelledby="home-categories-title">
      <header className="editorial-section__header"><div><p className="editorial-kicker">Browse the sample marketplace</p><h2 id="home-categories-title">Begin with an inspiration</h2></div><p>These groupings come from the current supplier-store fixture. They are not a finalized production taxonomy.</p></header>
      {storeCategories.length > 0 ? <div className="editorial-category-grid">{storeCategories.map((category, index) => <Link key={category} to={`/shops?category=${category}`} className="editorial-category"><span aria-hidden="true">0{index + 1}</span><strong>{categoryNames[category]}</strong><small>View matching stores</small></Link>)}</div> : <div className="editorial-empty"><h3>Categories are not available yet.</h3><p>Explore the available supplier stores instead.</p><Link to="/shops" className="button button--outline">Explore shops</Link></div>}
    </section>

    <section className="editorial-section editorial-featured" aria-labelledby="home-featured-title">
      <header className="editorial-section__header"><div><p className="editorial-kicker">Recent discoveries</p><h2 id="home-featured-title">A closer look at the catalog</h2></div><div><p>Fictional development records are shown without invented price, stock, ratings or promotions.</p><Link to="/products" className="editorial-inline-link">View all sample products <ArrowUpRight size={15} aria-hidden="true" /></Link></div></header>
      {featuredProducts.length > 0 ? <div className="editorial-product-grid">{featuredProducts.map((product) => <FixtureProduct key={product.slug} product={product} store={catalog.stores.find((store) => store.slug === product.storeSlug)} />)}</div> : <div className="editorial-empty"><h3>No sample products are available.</h3><p>There is nothing to display from the current catalog fixture.</p></div>}
    </section>

    <section className="editorial-section editorial-florists" aria-labelledby="home-florists-title">
      <header className="editorial-section__header"><div><p className="editorial-kicker">Discover supplier stores</p><h2 id="home-florists-title">Different practices, one place to browse</h2></div><p>Store names, descriptions, locations and category labels below come directly from the current development fixture.</p></header>
      {featuredStores.length > 0 ? <div className="editorial-store-grid">{featuredStores.map((store) => <FixtureStore key={store.slug} store={store} />)}</div> : <div className="editorial-empty"><h3>No supplier stores are available.</h3><p>Try the store directory again when catalog data is available.</p></div>}
      {catalog.stores.length > featuredStores.length && <Link to="/shops" className="button button--outline editorial-centered-action">Explore every sample store</Link>}
    </section>
  </>;
}

export function HomePage({ adapter }: { adapter?: DiscoveryAdapter } = {}) {
  const catalog = useDiscovery(adapter);

  useEffect(() => {
    document.title = 'Flower & Flora Marketplace | Flower & Flora';
  }, []);

  return <div className="editorial-home">
    <section className="editorial-hero" aria-labelledby="home-hero-title">
      <div className="editorial-hero__image"><img src={heroImage} alt="Garden flowers and foliage arranged in a deep green ceramic vessel" width="1672" height="941" fetchPriority="high" /></div>
      <div className="editorial-hero__copy">
        <p className="editorial-kicker">A multi-supplier floral marketplace</p>
        <h1 id="home-hero-title">Flowers, thoughtfully gathered.</h1>
        <p className="editorial-hero__lede">Browse a clearly labelled sample catalog of floral products and the independent supplier-store experiences behind them.</p>
        <div className="editorial-actions"><Link to="/products" className="button button--solid">Explore flowers</Link><Link to="/shops" className="button button--outline">Discover shops</Link></div>
        <p className="editorial-hero__note">Development preview — no live prices, purchases, payments or delivery quotes.</p>
      </div>
      <a className="editorial-hero__continue" href="#home-categories-title">Continue to discover <span aria-hidden="true">↓</span></a>
    </section>

    <AsyncRegion title="Marketplace discoveries" state={catalog.isPending || (catalog.isFetching && !catalog.data) ? { status: 'loading' } : catalog.isError || !catalog.data ? { status: 'error', onRetry: () => { void catalog.refetch(); } } : catalog.data.products.length === 0 && catalog.data.stores.length === 0 ? { status: 'empty', message: 'The sample marketplace does not have catalog records yet.' } : { status: 'ready', children: <CatalogHome catalog={catalog.data} /> }} />

    <section className="editorial-story" aria-labelledby="home-story-title">
      <div className="editorial-story__image"><img src={storyImage} alt="Hands arranging loose flowers and foliage on a wooden worktable" width="1672" height="941" loading="lazy" /></div>
      <div className="editorial-story__copy"><p className="editorial-kicker">Made distinct by each store</p><h2 id="home-story-title">The arrangement begins before checkout.</h2><p>Flower & Flora is designed as a place to discover supplier stores and understand who is behind each catalog item. The marketplace keeps store identity visible from browsing through store-specific checkout.</p><Link to="/about" className="editorial-inline-link">Read about the marketplace <ArrowUpRight size={15} aria-hidden="true" /></Link></div>
    </section>

    <section className="editorial-section editorial-process" aria-labelledby="home-process-title">
      <header className="editorial-section__header"><div><p className="editorial-kicker">How the sample flow works</p><h2 id="home-process-title">One store at a time</h2></div><p>The current commerce demonstration keeps checkout isolated by supplier store. It does not make live fulfilment or payment requests.</p></header>
      <ol><li><span>01</span><h3>Choose a store</h3><p>Browse supplier profiles and the fictional products attached to each store.</p></li><li><span>02</span><h3>Build a store-specific cart</h3><p>Add sample products while keeping each supplier group visible.</p></li><li><span>03</span><h3>Review fulfilment preferences</h3><p>Pickup, delivery provider and payment examples remain preferences until supported contracts confirm availability and cost.</p></li></ol>
    </section>

    <section className="editorial-campaign" aria-labelledby="home-campaign-title">
      <div className="editorial-campaign__image"><img src={campaignImage} alt="White flowers, fern and grasses arranged against a deep green backdrop" width="1024" height="1536" loading="lazy" /></div>
      <div className="editorial-campaign__copy"><p className="editorial-kicker">An editorial pause</p><h2 id="home-campaign-title">Quiet forms. Living details.</h2><p>Explore botanical shapes through the sample catalog, then move into the store profile that gives each item its context.</p><Link to="/products" className="button button--accent">Browse the catalog</Link></div>
    </section>

    <section className="editorial-section editorial-trust" aria-labelledby="home-trust-title">
      <div><p className="editorial-kicker">Before you continue</p><h2 id="home-trust-title">Clear about what is—and is not—connected.</h2></div>
      <div className="editorial-trust__grid"><article><h3>Pickup and delivery</h3><p>The checkout can capture a sample preference. Actual store eligibility, provider availability, timing and delivery price are not connected.</p></article><article><h3>Payment</h3><p>No live payment provider is connected, and completing the demonstration does not request or capture payment.</p></article><article><h3>Need context?</h3><p>Use the existing contact page for the local demonstration. It does not send a production support request.</p><Link to="/contact" className="editorial-inline-link">Open contact page <ArrowUpRight size={15} aria-hidden="true" /></Link></article></div>
    </section>

    <section className="editorial-invitation" aria-labelledby="home-invitation-title"><p className="editorial-kicker">Continue exploring</p><h2 id="home-invitation-title">Find a floral direction, then meet the store behind it.</h2><div className="editorial-actions"><Link to="/products" className="button button--solid">Explore flowers</Link><Link to="/shops" className="button button--outline">Discover shops</Link></div></section>
  </div>;
}
