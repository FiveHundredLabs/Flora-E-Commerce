import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { z } from 'zod';
import { AsyncRegion } from '../../shared/components/AsyncRegion';
import { Badge, Card } from '../../shared/components/ui/Content';
import { Button } from '../../shared/components/ui/Button';
import { Dialog } from '../../shared/components/ui/Dialog';
import { SampleForm } from './SampleForm';
import { noteInput, productInput, profileInput, stockValue, variantInput, type AllowedWorkspace, type SupplierCommand, type SupplierProduct } from './model';
import { useSupplier, useSupplierCommand } from './query';
import type { SupplierAdapter } from './api/mock';
import './styles.css';

export type SupplierScreenName = 'overview' | 'registration' | 'profile' | 'products' | 'newProduct' | 'product' | 'inventory' | 'orders' | 'sales';
const titles: Record<SupplierScreenName, string> = { overview: 'Supplier workspace', registration: 'Sample supplier registration', profile: 'Store profile',
  products: 'Supplier products', newProduct: 'New sample product', product: 'Edit sample product', inventory: 'Supplier inventory', orders: 'Supplier orders', sales: 'Sales overview' };

export function SupplierScreen({ screen, adapter }: { screen: SupplierScreenName; adapter?: SupplierAdapter }) {
  const query = useSupplier(adapter);
  const [aboutOpen, setAboutOpen] = useState(false);
  return <>
    <div className="page-heading"><p className="eyebrow">Supplier demo</p><h1>{titles[screen]}</h1><p>Explore store management with fictional data.</p></div>
    <aside className="supplier-notice" aria-label="Sample supplier limitations"><Badge>Sample supplier · MOCK</Badge>
      <p>No account is created and nothing is published. All changes reset on refresh. Use fictional text only; do not enter personal information.</p>
    </aside>
    <AsyncRegion title={screen === 'overview' ? 'Overview' : titles[screen]} state={query.isPending ? { status: 'loading' }
      : query.isError ? { status: 'error', onRetry: () => { void query.refetch(); } }
      : query.data.access === 'forbidden' ? { status: 'forbidden' }
      : { status: 'ready', children: <WorkspaceContent screen={screen} data={query.data} adapter={adapter} /> }} />
    {screen === 'overview' && <><Button variant="secondary" onClick={() => setAboutOpen(true)}>About this workspace</Button>
      <Dialog open={aboutOpen} onClose={() => setAboutOpen(false)} title="About this workspace"
        description="This is a fictional supplier demo. Registration does not create an account or establish approval. Live authorization and integrations require approved contracts." /></>}
  </>;
}

function WorkspaceContent({ screen, data, adapter }: { screen: SupplierScreenName; data: AllowedWorkspace; adapter?: SupplierAdapter }) {
  const { productId } = useParams();
  const navigate = useNavigate();
  const version = { expectedRevision: data.revision };
  if (screen === 'overview') return <>
    <h3>{data.profile.name}</h3><p>{data.profile.description}</p>
    <dl className="supplier-metrics"><div><dt>Sample products</dt><dd>{data.products.length}</dd></div><div><dt>Sample orders</dt><dd>{data.orders.length}</dd></div></dl>
    <p><Link to="/supplier/register">Explore sample registration</Link></p><p><Link to="/supplier/products">Manage sample products</Link></p>
    <p>Supplier approval and publishing policy are awaiting confirmation. This workspace grants no real permissions.</p>
  </>;
  if (screen === 'registration' || screen === 'profile') {
    const registration = screen === 'registration';
    const values = registration ? data.registration : data.profile;
    return <>
      <p>{registration ? 'Preview a separate fictional supplier application. No credentials, contact details, account creation or approval request are sent.' : 'Edit the fictional store profile. These changes do not update the public sample marketplace.'}</p>
      {registration && data.registration && <p>A sample application is saved in this session. It has no real approval status.</p>}
      <SampleForm key={screen} adapter={adapter} schema={profileInput} fields={[
        { name: 'name', label: 'Sample store name', value: values?.name }, { name: 'description', label: 'Sample store description', value: values?.description },
      ]} command={(input) => ({ type: registration ? 'register' : 'profile', ...version, data: input })}
      label={registration ? 'Save sample application' : 'Save sample profile'} />
    </>;
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
  return <>
    <Button variant="secondary" onClick={() => { mutation.reset(); setOpen(true); }}>{label}</Button>
    <Dialog open={open} onClose={() => { if (!mutation.isPending) setOpen(false); }} title={label} description="Remove this fictional item from the current session? This does not affect the marketplace or sample order history.">
      {mutation.isError && <p role="alert">The sample item could not be removed. Try again.</p>}
      <Button variant="destructive" busy={mutation.isPending} onClick={() => {
        if (mutation.isPending) return;
        mutation.mutate(command, { onSuccess: () => { setOpen(false); onRemoved?.(); } });
      }}>Confirm removal</Button>
    </Dialog>
  </>;
}
