import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, Boxes, ClipboardList, PackageOpen, ShieldCheck, Store } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router';
import { z } from 'zod';
import { AsyncRegion } from '../../shared/components/AsyncRegion';
import { Badge, Card } from '../../shared/components/ui/Content';
import { Button } from '../../shared/components/ui/Button';
import { Dialog } from '../../shared/components/ui/Dialog';
import { SampleForm } from './SampleForm';
import { noteInput, productInput, profileInput, stockValue, variantInput, type AllowedWorkspace, type SupplierCommand, type SupplierProduct } from './model';
import { useSupplier, useSupplierCommand } from './query';
import { mockSupplierAdapter, type SupplierAdapter } from './api/mock';
import './styles.css';

export type SupplierScreenName = 'overview' | 'registration' | 'profile' | 'products' | 'newProduct' | 'product' | 'inventory' | 'orders' | 'sales';
const titles: Record<SupplierScreenName, string> = { overview: 'Supplier workspace', registration: 'Sample supplier registration', profile: 'Store profile',
  products: 'Supplier products', newProduct: 'New sample product', product: 'Edit sample product', inventory: 'Supplier inventory', orders: 'Supplier orders', sales: 'Sales overview' };

export function SupplierScreen({ screen, adapter }: { screen: SupplierScreenName; adapter?: SupplierAdapter }) {
  const source = adapter ?? mockSupplierAdapter;
  return <SupplierWorkspaceScreen key={source.key} screen={screen} adapter={source} />;
}

function SupplierWorkspaceScreen({ screen, adapter }: { screen: SupplierScreenName; adapter: SupplierAdapter }) {
  const query = useSupplier(adapter);
  const [aboutOpen, setAboutOpen] = useState(false);
  const title = useRef<HTMLHeadingElement>(null);
  const retry = useRef<HTMLButtonElement>(null);
  const restoreFocus = useRef(false);
  useEffect(() => {
    if (restoreFocus.current && !query.isFetching) {
      if (document.activeElement === document.body) (retry.current ?? title.current)?.focus();
      restoreFocus.current = false;
    }
  // Instant retries may batch away the fetching transition; also observe settlement.
  }, [query.isFetching, query.isError, query.errorUpdatedAt]);
  return <div className="supplier-page">
    <header className="supplier-page__header"><div><p className="supplier-kicker">Merchant workspace · local preview</p><h1 ref={title} tabIndex={-1}>{titles[screen]}</h1><p>Manage one fictional supplier store with the capabilities available in this session.</p></div><div className="supplier-page__identity"><Store size={20} aria-hidden="true" /><span>Single-store workspace</span><strong>No authenticated account</strong></div></header>
    <aside className="supplier-notice" aria-label="Sample supplier limitations"><Badge>Sample supplier · MOCK</Badge>
      <p>No account is created and nothing is published. All changes reset on refresh. Use fictional text only; do not enter personal information.</p>
    </aside>
    {query.data?.access === 'allowed' && (query.isError || query.isFetching) && <div className="supplier-refresh">
      {query.isError ? <p role="alert">We could not refresh the sample workspace. Showing the last sample snapshot; your unsaved inputs are kept.</p>
        : <p role="status">Refreshing sample workspace.</p>}
      <Button ref={retry} variant="secondary" busy={query.isFetching} onClick={() => { restoreFocus.current = true; void query.refetch(); }}>Retry workspace refresh</Button>
    </div>}
    <AsyncRegion title={screen === 'overview' ? 'Overview' : titles[screen]} state={query.isPending ? { status: 'loading' }
      : !query.data ? { status: 'error', onRetry: () => { void query.refetch(); } }
      : query.data.access === 'forbidden' ? { status: 'forbidden' }
      : { status: 'ready', children: <WorkspaceContent screen={screen} data={query.data} adapter={adapter} /> }} />
    {screen === 'overview' && <><Button variant="secondary" onClick={() => setAboutOpen(true)}>About this workspace</Button>
      <Dialog open={aboutOpen} onClose={() => setAboutOpen(false)} title="About this workspace"
        description="This is a fictional supplier demo. Registration does not create an account or establish approval. Live authorization and integrations require approved contracts." /></>}
  </div>;
}

function WorkspaceContent({ screen, data, adapter }: { screen: SupplierScreenName; data: AllowedWorkspace; adapter?: SupplierAdapter }) {
  const { productId } = useParams();
  const navigate = useNavigate();
  const version = { expectedRevision: data.revision };
  if (screen === 'overview') {
    const lowStock = data.products.flatMap((product) => product.variants).filter((variant) => variant.stock <= 3).length;
    const actionableOrders = data.orders.filter((order) => order.canRecordNote).length;
    return <div className="supplier-overview">
      <section className="supplier-store-summary" aria-labelledby="supplier-store-title"><div><p className="supplier-kicker">Current fixture store</p><h2 id="supplier-store-title">{data.profile.name}</h2><p>{data.profile.description}</p></div><div className="supplier-status"><ShieldCheck size={19} aria-hidden="true" /><span>Workspace access</span><strong>Allowed by fixture</strong><small>Not an approval or authenticated role</small></div></section>
      <dl className="supplier-metrics" aria-label="Current fixture counts"><div><dt><PackageOpen size={18} aria-hidden="true" /> Sample products</dt><dd><strong>{data.products.length}</strong><span>Unpublished records</span></dd></div><div><dt><ClipboardList size={18} aria-hidden="true" /> Sample orders</dt><dd><strong>{data.orders.length}</strong><span>Session fixtures</span></dd></div><div><dt><Boxes size={18} aria-hidden="true" /> Low sample counts</dt><dd><strong>{lowStock}</strong><span>Variants at 3 or fewer</span></dd></div></dl>
      <section className="supplier-work-queue" aria-labelledby="work-queue-title"><div><p className="supplier-kicker">Practical queue</p><h2 id="work-queue-title">Items needing attention</h2></div><ul><li><AlertTriangle size={19} aria-hidden="true" /><div><strong>{lowStock} low-count {lowStock === 1 ? 'variant' : 'variants'}</strong><span>Derived only from sample stock counts.</span></div><Link to="/supplier/inventory">Review inventory</Link></li><li><ClipboardList size={19} aria-hidden="true" /><div><strong>{actionableOrders} editable order {actionableOrders === 1 ? 'note' : 'notes'}</strong><span>No status transition or provider booking.</span></div><Link to="/supplier/orders">Review orders</Link></li></ul></section>
      <div className="supplier-overview__links"><Link to="/supplier/profile">Edit sample store profile</Link><Link to="/supplier/products">Manage sample products</Link><Link to="/supplier/register">Explore sample registration</Link></div>
      <p className="supplier-boundary">Supplier approval and publishing policy are awaiting confirmation. These counts are not KPIs, sales totals or real operational permissions.</p>
    </div>;
  }
  if (screen === 'registration' || screen === 'profile') {
    const registration = screen === 'registration';
    const values = registration ? data.registration : data.profile;
    return <div className="supplier-editor-layout"><section className="supplier-editor-copy"><p className="supplier-kicker">{registration ? 'Onboarding boundary' : 'Store identity'}</p><h2>{registration ? 'Application preview' : data.profile.name}</h2>
      <p>{registration ? 'Preview a separate fictional supplier application. No credentials, contact details, account creation or approval request are sent.' : 'Edit the fictional store identity fields supported by the current fixture. Changes do not update the public marketplace.'}</p>
      <ul><li>One supplier workspace represents one store.</li><li>Logo, cover, location, contact, categories and fulfilment settings are not connected.</li><li>Approval and publishing behavior remain undecided.</li></ul></section><section className="supplier-editor-card" aria-label={registration ? 'Sample application editor' : 'Sample profile editor'}>
      {registration && data.registration && <p className="supplier-saved-note">A sample application is saved in this session. It has no real approval status.</p>}
      <SampleForm key={screen} adapter={adapter} schema={profileInput} fields={[
        { name: 'name', label: 'Sample store name', value: values?.name }, { name: 'description', label: 'Sample store description', value: values?.description },
      ]} command={(input) => ({ type: registration ? 'register' : 'profile', ...version, data: input })}
      label={registration ? 'Save sample application' : 'Save sample profile'} />
      <p className="supplier-form-note">Inputs are validated locally, then acknowledged by the in-memory adapter. Refreshing resets changes.</p></section></div>;
  }
  if (screen === 'products') return <>
    <p><Link to="/supplier/products/new">Add sample product</Link></p>
    {data.products.length === 0 ? <p>No sample products yet. Add one to explore variants and inventory.</p> : <ul className="supplier-list">{data.products.map((product) => <li key={product.id}>
      <h3><Link to={`/supplier/products/${product.id}`}>{product.name}</Link></h3><p>{product.description || 'No sample description.'}</p>
      <p>{product.variants.length} sample variants · not published</p>
    </li>)}</ul>}
    <p>Image upload and processing are unavailable until storage and media contracts are approved.</p>
  </>;
  if (screen === 'newProduct') return <SampleForm adapter={adapter} schema={productInput} fields={[
    { name: 'name', label: 'Sample product name' }, { name: 'description', label: 'Sample product description' },
  ]} command={(input) => ({ type: 'createProduct', ...version, data: input })} label="Create sample product" onSaved={() => { void navigate('/supplier/products'); }} />;
  if (screen === 'product') {
    const product = data.products.find((item) => item.id === productId);
    return product ? <ProductEditor key={product.id} product={product} data={data} adapter={adapter} />
      : <><p>This sample product could not be found.</p><Link to="/supplier/products">Back to sample products</Link></>;
  }
  if (screen === 'inventory') return <>
    <p>Sample stock counts only: no reservations, stock guarantees or public availability changes. Use whole counts from 0 to 9,999 for this demo.</p>
    {data.products.every((product) => product.variants.length === 0) && <p>No sample variants to count. Add a variant from Products.</p>}
    {data.products.map((product) => product.variants.map((variant) => <Card key={`${product.id}-${variant.id}`} title={`${product.name} — ${variant.name}`}>
      <p>Current sample count: {variant.stock}</p><SampleForm adapter={adapter} schema={z.object({ stock: stockValue })}
        fields={[{ name: 'stock', label: `Stock for ${product.name} — ${variant.name}`, value: variant.stock, numeric: true }]}
        command={(input) => ({ type: 'stock', ...version, productId: product.id, variantId: variant.id, stock: input.stock })} label={`Save stock for ${variant.name}`} />
    </Card>))}
  </>;
  if (screen === 'orders') return <>
    <p>Fictional orders for this workspace only. Notes do not change payment, delivery or order status and do not book a provider.</p>
    {data.orders.length === 0 ? <p>No sample orders in this workspace.</p> : data.orders.map((order) => <Card key={order.id} title={order.id}>
      <ul>{order.items.map((item, index) => <li key={index}>{item.name} · quantity {item.quantity}</li>)}</ul>
      <p>Fulfilment: {order.fulfilment} (sample only)</p><p>Saved sample note: {order.note || 'None'}</p>
      {order.canRecordNote ? <SampleForm adapter={adapter} schema={noteInput} fields={[{ name: 'note', label: `Fulfilment note for ${order.id}`, value: order.note }]}
        command={(input) => ({ type: 'fulfilmentNote', ...version, orderId: order.id, data: input })} label={`Save note for ${order.id}`} />
        : <p>Note editing is unavailable for this sample order.</p>}
    </Card>)}
  </>;
  const units = data.orders.reduce((sum, order) => sum + order.items.reduce((total, item) => total + item.quantity, 0), 0);
  return <><p>Counts from the fictional order fixtures in this session, not real sales or paid orders.</p>
    <dl className="supplier-metrics"><div><dt>Sample order count</dt><dd>{data.orders.length}</dd></div><div><dt>Sample units ordered</dt><dd>{units}</dd></div></dl>
    {data.orders.length === 0 && <p>No sample sales activity.</p>}
    <p>Revenue, currency, refunds and payouts are unavailable until authoritative reporting and payment contracts are approved.</p>
  </>;
}

function ProductEditor({ product, data, adapter }: { product: SupplierProduct; data: AllowedWorkspace; adapter?: SupplierAdapter }) {
  const navigate = useNavigate();
  const previousVariants = useRef(product.variants.map((variant) => variant.id));
  useEffect(() => {
    const remaining = new Set(product.variants.map((variant) => variant.id));
    const removed = previousVariants.current.some((id) => !remaining.has(id));
    previousVariants.current = [...remaining];
    // Run after the removed card's dialog cleanup releases the inert background.
    if (removed && document.activeElement === document.body) document.getElementById('main')?.focus();
  }, [product.variants]);
  const version = { expectedRevision: data.revision, productId: product.id };
  return <>
    <h3>{product.name}</h3>
    <SampleForm adapter={adapter} schema={productInput} fields={[
      { name: 'name', label: 'Sample product name', value: product.name }, { name: 'description', label: 'Sample product description', value: product.description },
    ]} command={(input) => ({ type: 'editProduct', ...version, data: input })} label="Save sample product" />
    <p>Products stay in this demo. Publishing, prices, images and automatic image processing require approved contracts.</p>
    <RemoveSample adapter={adapter} label="Remove sample product" command={{ type: 'removeProduct', ...version }} onRemoved={() => { void navigate('/supplier/products'); }} />
    <h3>Sample variants</h3>
    {product.variants.length === 0 && <p>No sample variants yet.</p>}
    {product.variants.map((variant) => <Card key={variant.id} title={variant.name}>
      <SampleForm adapter={adapter} schema={variantInput} fields={[
        { name: 'name', label: `Variant name for ${variant.name}`, value: variant.name },
        { name: 'stock', label: `Variant stock for ${variant.name}`, value: variant.stock, numeric: true, hint: 'Whole sample counts from 0 to 9,999.' },
      ]} command={(input) => ({ type: 'editVariant', ...version, variantId: variant.id, data: input })} label={`Save variant ${variant.name}`} />
      <RemoveSample adapter={adapter} label={`Remove variant ${variant.name}`} command={{ type: 'removeVariant', ...version, variantId: variant.id }} />
    </Card>)}
    <Card title="Add sample variant"><SampleForm adapter={adapter} schema={variantInput} fields={[
      { name: 'name', label: 'New variant name' }, { name: 'stock', label: 'New variant stock', value: 0, numeric: true },
    ]} command={(input) => ({ type: 'addVariant', ...version, data: input })} label="Add sample variant" resetAfterSave /></Card>
    <Link to="/supplier/products">Back to sample products</Link>
  </>;
}

function RemoveSample({ adapter, label, command, onRemoved }: { adapter?: SupplierAdapter; label: string; command: SupplierCommand; onRemoved?: () => void }) {
  const [open, setOpen] = useState(false);
  const mutation = useSupplierCommand(adapter);
  const submitting = useRef(false);
  const confirm = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (mutation.isError && document.activeElement === document.body) confirm.current?.focus();
  }, [mutation.isError]);
  return <>
    <Button variant="secondary" onClick={() => { mutation.reset(); setOpen(true); }}>{label}</Button>
    <Dialog open={open} onClose={() => { if (!submitting.current) setOpen(false); }} title={label} description="Remove this fictional item from the current session? This does not affect the marketplace or sample order history.">
      {mutation.isError && <p role="alert">The sample item could not be removed. Try again.</p>}
      {mutation.isPending && <p role="status">Removing sample item.</p>}
      <Button ref={confirm} variant="destructive" busy={mutation.isPending} onClick={() => {
        if (submitting.current) return;
        submitting.current = true;
        mutation.mutate(command, { onSuccess: () => { setOpen(false); onRemoved?.(); }, onSettled: () => { submitting.current = false; } });
      }}>Confirm removal</Button>
    </Dialog>
  </>;
}
