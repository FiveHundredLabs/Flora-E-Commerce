import { useEffect } from 'react';
import { Link } from 'react-router';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { AsyncRegion } from '../shared/components/AsyncRegion';
import { Price, StatusTag } from '../shared/components/ui/Feedback';
import { Illustration, categories, categoryNames, locationNames, useDiscovery, type Catalog, type DiscoveryAdapter, type Product, type Store } from '../features/discovery';
import './home-editorial.css';

const heroImage = '/assets/editorial-home-hero.webp';
const storyImage = '/assets/editorial-home-story.webp';
const campaignImage = '/assets/editorial-home-campaign.webp';

function FixtureProduct({ product, store }: { product: Product; store?: Store }) {
  const visualKind = store?.categories[0] ?? 'bouquets';
  return <article className="editorial-product">
    <Link to={`/products/${product.slug}`} className="editorial-product__visual" aria-label={`View ${product.name}`}>
      <Illustration category={visualKind} slug={product.slug} alt={product.name} />
    </Link>
    <div className="editorial-product__body">
      <h3><Link to={`/products/${product.slug}`}>{product.name}</Link></h3>
      {store && <Link className="editorial-product__store" to={`/shops/${store.slug}`}>{store.name}</Link>}
      <div className="editorial-product__meta"><Price /><StatusTag>Availability not connected</StatusTag></div>
    </div>
  </article>;
}

function FixtureStore({ store }: { store: Store }) {
  return <article className="editorial-store">
    <div className="editorial-store__art"><Illustration category={store.categories[0] ?? 'bouquets'} slug={store.slug} alt={store.name} /></div>
    <div className="editorial-store__content">
      <p className="editorial-store__location"><MapPin size={15} aria-hidden="true" />{locationNames[store.location]}</p>
      <h3><Link to={`/shops/${store.slug}`}>{store.name}</Link></h3>
      <p>{store.description}</p>
      <p className="editorial-store__categories">{store.categories.map((category) => categoryNames[category]).join(' · ')}</p>
      <Link to={`/shops/${store.slug}`} className="editorial-inline-link">Visit shop <ArrowUpRight size={15} aria-hidden="true" /></Link>
    </div>
  </article>;
}

function CatalogHome({ catalog }: { catalog: Catalog }) {
  const availableCategories = new Set(catalog.stores.flatMap((store) => store.categories));
  const storeCategories = categories.filter((category) => availableCategories.has(category));
  const featuredProducts = catalog.products.slice(0, 4);
  const homepageStores = catalog.stores.slice(0, 10);

  return <>
    <section className="editorial-section editorial-categories" aria-labelledby="home-categories-title">
      <header className="editorial-categories__header"><h2 id="home-categories-title">Categories</h2></header>
      {storeCategories.length > 0 ? <ul className="editorial-category-rail" aria-label="Shop categories">{storeCategories.map((category) => <li key={category}><Link to={`/shops?category=${category}`} className="editorial-category" aria-label={`Browse ${categoryNames[category]} stores`}><span className="editorial-category__visual" aria-hidden="true"><Illustration category={category} /></span><strong>{categoryNames[category]}</strong></Link></li>)}</ul> : <div className="editorial-empty"><h3>Categories are not available yet.</h3><p>Explore the available supplier stores instead.</p><Link to="/shops" className="button button--outline">Explore shops</Link></div>}
    </section>

    <section className="editorial-section editorial-florists" aria-labelledby="home-florists-title">
      <header className="editorial-florists__header"><h2 id="home-florists-title">Our Shops</h2></header>
      {homepageStores.length > 0 ? <div className="editorial-store-grid">{homepageStores.map((store) => <FixtureStore key={store.slug} store={store} />)}</div> : <div className="editorial-empty"><h3>No supplier stores are available.</h3><p>Try the store directory again when catalog data is available.</p></div>}
    </section>

    <section className="editorial-section editorial-featured" aria-labelledby="home-featured-title">
      <header className="editorial-section__header"><div><p className="editorial-kicker">Recent discoveries</p><h2 id="home-featured-title">A closer look at the catalog</h2></div><div><p>Hand-picked seasonal arrangements from our independent florist partners.</p><Link to="/products" className="editorial-inline-link">View all products <ArrowUpRight size={15} aria-hidden="true" /></Link></div></header>
      {featuredProducts.length > 0 ? <div className="editorial-product-grid">{featuredProducts.map((product) => <FixtureProduct key={product.slug} product={product} store={catalog.stores.find((store) => store.slug === product.storeSlug)} />)}</div> : <div className="editorial-empty"><h3>No products are available.</h3><p>Check back soon for new arrivals.</p></div>}
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
        <h1 id="home-hero-title">Flowers, thoughtfully gathered.</h1>
        <div className="editorial-actions"><Link to="/products" className="button button--solid">Explore flowers</Link><Link to="/shops" className="button button--outline">Discover shops</Link></div>
      </div>
      <a className="editorial-hero__continue" href="#home-categories-title">Continue to discover <span aria-hidden="true">↓</span></a>
    </section>

    <AsyncRegion title="Marketplace discoveries" state={catalog.isPending || (catalog.isFetching && !catalog.data) ? { status: 'loading' } : catalog.isError || !catalog.data ? { status: 'error', onRetry: () => { void catalog.refetch(); } } : catalog.data.products.length === 0 && catalog.data.stores.length === 0 ? { status: 'empty', message: 'The sample marketplace does not have catalog records yet.' } : { status: 'ready', children: <CatalogHome catalog={catalog.data} /> }} />

    <section className="editorial-story" aria-labelledby="home-story-title">
      <div className="editorial-story__image"><img src={storyImage} alt="Hands arranging loose flowers and foliage on a wooden worktable" width="1672" height="941" loading="lazy" /></div>
      <div className="editorial-story__copy"><p className="editorial-kicker">Made distinct by each store</p><h2 id="home-story-title">The arrangement begins before checkout.</h2><p>Flower & Flora is designed as a place to discover supplier stores and understand who is behind each catalog item. The marketplace keeps store identity visible from browsing through store-specific checkout.</p><Link to="/about" className="editorial-inline-link">Read about the marketplace <ArrowUpRight size={15} aria-hidden="true" /></Link></div>
    </section>

    <section className="editorial-section editorial-process" aria-labelledby="home-process-title">
      <header className="editorial-section__header"><div><p className="editorial-kicker">How it works</p><h2 id="home-process-title">Order in three easy steps</h2></div><p>Browse by flower type, choose the shop that speaks to you, and place your order directly with them.</p></header>
      <ol><li><span>01</span><h3>Pick a flower type</h3><p>Choose from bouquets, roses, orchids, tropical arrangements, and more.</p></li><li><span>02</span><h3>Choose your florist</h3><p>Browse local flower shops that carry your selected flowers and read their story.</p></li><li><span>03</span><h3>Order &amp; enjoy</h3><p>Add your favourites to the cart and place your order directly with the shop.</p></li></ol>
    </section>

    <section className="editorial-campaign" aria-labelledby="home-campaign-title">
      <div className="editorial-campaign__image"><img src={campaignImage} alt="White flowers, fern and grasses arranged against a deep green backdrop" width="1024" height="1536" loading="lazy" /></div>
      <div className="editorial-campaign__copy"><p className="editorial-kicker">An editorial pause</p><h2 id="home-campaign-title">Quiet forms. Living details.</h2><p>Explore botanical shapes through our curated catalog, then move into the store profile that gives each item its context.</p><Link to="/products" className="button button--accent">Browse the catalog</Link></div>
    </section>

    <section className="editorial-section editorial-trust" aria-labelledby="home-trust-title">
      <div><p className="editorial-kicker">Our Commitment</p><h2 id="home-trust-title">Thoughtfully gathered, transparently delivered.</h2></div>
      <div className="editorial-trust__grid"><article><h3>Pickup &amp; Delivery</h3><p>Select flexible delivery or in-store pickup directly from local florists in your community.</p></article><article><h3>Direct Support</h3><p>Every floral order connects you directly with the artisan florist preparing your arrangement.</p></article><article><h3>Need Assistance?</h3><p>Our dedicated team is here to assist with inquiries, custom arrangements, and store details.</p><Link to="/contact" className="editorial-inline-link">Contact our team <ArrowUpRight size={15} aria-hidden="true" /></Link></article></div>
    </section>

    <section className="editorial-invitation" aria-labelledby="home-invitation-title"><p className="editorial-kicker">Continue exploring</p><h2 id="home-invitation-title">Find a floral direction, then meet the store behind it.</h2><div className="editorial-actions"><Link to="/products" className="button button--solid">Explore flowers</Link><Link to="/shops" className="button button--outline">Discover shops</Link></div></section>
  </div>;
}
