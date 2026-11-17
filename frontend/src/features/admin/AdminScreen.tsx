import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { AsyncRegion } from '../../shared/components/AsyncRegion';
import { Badge } from '../../shared/components/ui/Content';
import { Button } from '../../shared/components/ui/Button';
import { Dialog } from '../../shared/components/ui/Dialog';
import { AdminForm } from './AdminForm';
import { labelInput, noteInput, sectionLabels, type AdminRecord, type AdminSection, type AllowedWorkspace } from './model';
import { mockAdminAdapter, type AdminAdapter } from './api/mock';
import { useAdmin, useAdminCommand } from './query';
import './styles.css';

export type AdminScreenName = AdminSection | 'overview' | 'newCategory';
export function AdminScreen({ screen, detail = false, adapter = mockAdminAdapter }: { screen: AdminScreenName; detail?: boolean; adapter?: AdminAdapter }) {
  const { recordId } = useParams();
  return <Workspace key={`${adapter.key}:${screen}:${detail ? recordId ?? '' : ''}`} screen={screen} detail={detail} adapter={adapter} />;
}
function Workspace({ screen, detail, adapter }: { screen: AdminScreenName; detail: boolean; adapter: AdminAdapter }) {
  const query = useAdmin(adapter, detail); const { recordId } = useParams();
  const [aboutOpen, setAboutOpen] = useState(false);
  const title = useRef<HTMLHeadingElement>(null); const retry = useRef<HTMLButtonElement>(null); const restore = useRef(false);
  useEffect(() => {
    if (restore.current && !query.isFetching) {
      if (document.activeElement === document.body) (retry.current ?? title.current)?.focus();
      restore.current = false;
    }
  }, [query.isFetching, query.isError, query.errorUpdatedAt]);
  const heading = screen === 'overview' ? 'Super admin workspace' : screen === 'newCategory' ? 'New sample category' : `${sectionLabels[screen]}${detail ? ' detail' : ''}`;
  const record = query.data?.access === 'allowed' ? query.data.records.find((item) => item.kind === screen && item.id === recordId) : undefined;
  return <>
    <div className="page-heading"><p className="eyebrow">Admin demo</p><h1 ref={title} tabIndex={-1}>{heading}</h1><p>Explore marketplace oversight with fictional records.</p></div>
    <aside className="admin-notice" aria-label="Sample admin limitations"><Badge>Sample admin · MOCK</Badge>
      <p>No real accounts, approvals, refunds or moderation actions. Use fictional text only. Changes reset on refresh and do not affect customer or supplier demos.</p>
    </aside>
    {query.data?.access === 'allowed' && (query.isError || query.isFetching) && <div className="admin-refresh">
      {query.isError ? <p role="alert">We could not refresh the sample admin workspace. The last fictional snapshot and your unsaved text are kept.</p>
        : <p role="status">Refreshing sample admin workspace.</p>}
      <Button ref={retry} variant="secondary" busy={query.isFetching} onClick={() => { restore.current = true; void query.refetch(); }}>Retry admin refresh</Button>
    </div>}
    <AsyncRegion title={screen === 'overview' ? 'Overview' : heading} state={query.isPending || (detail && query.isFetching && !record) ? { status: 'loading' }
      : !query.data || (detail && !record && query.isError) ? { status: 'error', onRetry: () => { void query.refetch(); } }
      : query.data.access === 'forbidden' ? { status: 'forbidden' }
      : { status: 'ready', children: <Content key={`${screen}:${recordId ?? ''}`} screen={screen} detail={detail} data={query.data} record={record} adapter={adapter} /> }} />
    {screen === 'overview' && <><Button variant="secondary" onClick={() => setAboutOpen(true)}>About this workspace</Button>
      <Dialog open={aboutOpen} onClose={() => setAboutOpen(false)} title="About this workspace" description="This fictional demo provides no administrator permissions. Live authentication, authorization and operational decisions require approved contracts." /></>}
  </>;
}

function Content({ screen, detail, data, record, adapter }: { screen: AdminScreenName; detail: boolean; data: AllowedWorkspace; record?: AdminRecord; adapter: AdminAdapter }) {
  const navigate = useNavigate(); const version = { expectedRevision: data.revision };
  if (screen === 'overview') return <>
    <p>Sample oversight counts only. No revenue, refund totals or operational status is inferred.</p>
    <dl className="admin-metrics">{Object.entries(sectionLabels).map(([kind, label]) => <div key={kind}><dt><Link to={`/admin/${kind}`}>{label}</Link></dt>
      <dd>{data.records.filter((item) => item.kind === kind).length}</dd></div>)}</dl>
    <p>Supplier approval, account restrictions, refund eligibility and moderation policy remain unconfirmed.</p>
  </>;
  if (screen === 'newCategory') return <>
    <p>Create a fictional category label for this session only. This does not approve a marketplace taxonomy.</p>
    <AdminForm adapter={adapter} schema={labelInput} inputLabel="New sample category label" label="Create sample category"
      command={(label) => ({ type: 'createCategory', ...version, label })} onSaved={() => { void navigate('/admin/categories'); }} />
  </>;
  if (detail) return record ? <RecordDetail key={`${record.kind}:${record.id}`} record={record} data={data} adapter={adapter} />
    : <><p>This sample record could not be found.</p><Link to={`/admin/${screen}`}>Back to {sectionLabels[screen].toLowerCase()}</Link></>;
  const records = data.records.filter((item) => item.kind === screen);
  return <>
    {screen === 'categories' && <p><Link to="/admin/categories/new">Add sample category</Link></p>}
    {records.length === 0 ? <p>No sample {sectionLabels[screen].toLowerCase()} in this workspace.</p> : <ul className="admin-list">{records.map((item) => <li key={item.id}>
      <h3><Link to={`/admin/${item.kind}/${item.id}`}>{item.label}</Link></h3><p>Sample reference: {item.id}</p>
    </li>)}</ul>}
  </>;
}

function RecordDetail({ record, data, adapter }: { record: AdminRecord; data: AllowedWorkspace; adapter: AdminAdapter }) {
  const version = { expectedRevision: data.revision }; const navigate = useNavigate();
  return <>
    <h3>{record.label}</h3><p>Sample reference: {record.id}</p>
    {record.kind === 'suppliers' && <><p>Application fixture: {record.application}</p><p>Approval, rejection and publication controls are unavailable pending supplier policy and account contracts.</p></>}
    {record.kind === 'users' && <><p>Actor label: {record.actor} (fixture only)</p><p>This is a fictional display alias, not an identity record. Role grants, account restrictions and deletion are unavailable pending authorization policy.</p></>}
    {record.kind === 'orders' && <>
      <p><Link to={`/admin/suppliers/${record.supplierId}`}>View sample supplier</Link> · <Link to={`/admin/users/${record.userId}`}>View sample user</Link></p>
      <ul>{record.items.map((item, index) => <li key={index}>{item.label} · quantity {item.quantity}</li>)}</ul>
      <p>Payment: {record.paymentExample ? `${record.paymentExample} (client example only)` : 'not connected; no payment has been requested'}</p>
      <p>No amount, charge, shipment, cancellation or refund is performed here.</p>
    </>}
    {record.kind === 'refunds' && <><p>Request fixture: {record.reason}</p><p><Link to={`/admin/orders/${record.orderId}`}>View related sample order</Link></p>
      <p>No refund decision, eligibility, amount or gateway action is established. Approval and refund submission are unavailable pending contracts.</p></>}
    {record.kind === 'reviews' && <><p>Fictional feedback: {record.comment}</p><p><Link to={`/admin/orders/${record.orderId}`}>View related sample order</Link> · <Link to={`/admin/suppliers/${record.supplierId}`}>View sample supplier</Link></p>
      <p>Oversight notes do not publish, hide, edit or verify feedback. Moderation actions await an approved policy.</p></>}
    {'canRename' in record && (record.canRename ? <AdminForm adapter={adapter} schema={labelInput} initial={record.label} inputLabel="Sample display label" label="Save sample label"
      command={(label) => ({ type: 'rename', ...version, kind: record.kind, id: record.id, label })} /> : <p>Label editing is unavailable for this sample record.</p>)}
    {record.kind === 'categories' ? <>
      <p>Category changes stay within this demo and do not update the public catalog.</p>
      {record.canRemove ? <RemoveCategory record={record} revision={data.revision} adapter={adapter} onRemoved={() => { void navigate('/admin/categories'); }} />
        : <p>Removal is unavailable for this sample category.</p>}
    </> : <>
      <p>Saved sample oversight note: {record.note || 'None'}</p>
      {record.canAnnotate ? <AdminForm adapter={adapter} schema={noteInput} initial={record.note} inputLabel="Sample oversight note" label="Save sample oversight note"
        command={(note) => ({ type: 'annotate', ...version, kind: record.kind, id: record.id, note })} />
        : <p>Note editing is unavailable for this sample record.</p>}
      <p>Notes are editable session-only text, not an authoritative audit trail or operational decision.</p>
    </>}
    <Link to={`/admin/${record.kind}`}>Back to {sectionLabels[record.kind].toLowerCase()}</Link>
  </>;
}

function RemoveCategory({ record, revision, adapter, onRemoved }: { record: Extract<AdminRecord, { kind: 'categories' }>; revision: number; adapter: AdminAdapter; onRemoved: () => void }) {
  const [open, setOpen] = useState(false); const submitting = useRef(false); const confirm = useRef<HTMLButtonElement>(null);
  const mutation = useAdminCommand(adapter);
  useEffect(() => { if (mutation.isError && document.activeElement === document.body) confirm.current?.focus(); }, [mutation.isError]);
  return <><Button variant="secondary" onClick={() => { mutation.reset(); setOpen(true); }}>Remove sample category</Button>
    <Dialog open={open} onClose={() => { if (!submitting.current) setOpen(false); }} title="Remove sample category" description="Remove this fictional category from the current session? Public products and supplier categories are unaffected.">
      {mutation.isPending && <p role="status">Removing sample category.</p>}
      {mutation.isError && <p role="alert">The sample category could not be removed. Try again.</p>}
      <Button ref={confirm} variant="destructive" busy={mutation.isPending} onClick={() => {
        if (submitting.current) return; submitting.current = true;
        mutation.mutate({ type: 'removeCategory', expectedRevision: revision, id: record.id }, { onSuccess: () => { setOpen(false); onRemoved(); }, onSettled: () => { submitting.current = false; } });
      }}>Confirm removal</Button>
    </Dialog>
  </>;
}
