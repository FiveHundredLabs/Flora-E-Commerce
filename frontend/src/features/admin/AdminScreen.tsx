import { useEffect, useRef, useState, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import {
  Store,
  Users,
  FolderTree,
  ShoppingBag,
  Receipt,
  MessageSquare,
  RotateCcw,
  Plus,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { AsyncRegion } from '../../shared/components/AsyncRegion';
import { Badge } from '../../shared/components/ui/Content';
import { Button } from '../../shared/components/ui/Button';
import { Dialog } from '../../shared/components/ui/Dialog';
import { AdminForm } from './AdminForm';
import {
  AdminTable,
  StatusBadge,
  type ColumnDef,
} from './AdminTable';
import {
  SupplierReviewDialog,
  UserStatusDialog,
  CategoryCreateDialog,
  CategoryEditDialog,
  CategoryDeleteDialog,
  OrderInspectDialog,
  RefundDecisionDialog,
  ReviewModerationDialog,
  ResetWorkspaceDialog,
  AnnotateDialog,
} from './AdminDialogs';
import {
  labelInput,
  noteInput,
  sectionLabels,
  type AdminRecord,
  type AdminSection,
  type AllowedWorkspace,
} from './model';
import { mockAdminAdapter, type AdminAdapter } from './api/mock';
import { useAdmin, useAdminCommand } from './query';
import './styles.css';

export type AdminScreenName = AdminSection | 'overview' | 'newCategory';

export function AdminScreen({
  screen,
  detail = false,
  adapter = mockAdminAdapter,
}: {
  screen: AdminScreenName;
  detail?: boolean;
  adapter?: AdminAdapter;
}) {
  const { recordId } = useParams();
  return (
    <Workspace
      key={`${adapter.key}:${screen}:${detail ? recordId ?? '' : ''}`}
      screen={screen}
      detail={detail}
      adapter={adapter}
    />
  );
}

function Workspace({
  screen,
  detail,
  adapter,
}: {
  screen: AdminScreenName;
  detail: boolean;
  adapter: AdminAdapter;
}) {
  const query = useAdmin(adapter, detail);
  const { recordId } = useParams();
  const [aboutOpen, setAboutOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const title = useRef<HTMLHeadingElement>(null);
  const retry = useRef<HTMLButtonElement>(null);
  const restore = useRef(false);

  useEffect(() => {
    if (restore.current && !query.isFetching) {
      if (document.activeElement === document.body) {
        (retry.current ?? title.current)?.focus();
      }
      restore.current = false;
    }
  }, [query.isFetching, query.isError, query.errorUpdatedAt]);

  const heading =
    screen === 'overview'
      ? 'Super admin workspace'
      : screen === 'newCategory'
      ? 'New sample category'
      : `${sectionLabels[screen]}${detail ? ' detail' : ''}`;

  const record =
    query.data?.access === 'allowed'
      ? query.data.records.find((item) => item.kind === screen && item.id === recordId)
      : undefined;

  return (
    <div className="admin-workspace-layout">
      {/* Top Admin Botanical Toolbar */}
      <nav className="admin-toolbar" aria-label="Admin top toolbar">
        <div className="admin-toolbar__breadcrumbs">
          <Link to="/admin" className="admin-crumb">Admin</Link>
          {screen !== 'overview' && (
            <>
              <ChevronRight size={14} className="admin-crumb-sep" aria-hidden="true" />
              <Link to={`/admin/${screen === 'newCategory' ? 'categories' : screen}`} className="admin-crumb">
                {screen === 'newCategory' ? 'Categories' : sectionLabels[screen]}
              </Link>
            </>
          )}
          {detail && record && (
            <>
              <ChevronRight size={14} className="admin-crumb-sep" aria-hidden="true" />
              <span className="admin-crumb is-current" aria-current="page">{record.label}</span>
            </>
          )}
        </div>

        <div className="admin-toolbar__actions">
          <Badge tone="neutral" className="admin-toolbar__badge">
            <ShieldCheck size={12} aria-hidden="true" /> Super Admin · MOCK
          </Badge>
          <Link to="/" className="admin-toolbar__link">
            Return to marketplace
          </Link>
          {query.data?.access === 'allowed' && (
            <Button
              variant="secondary"
              className="admin-reset-btn"
              onClick={() => setResetOpen(true)}
            >
              <RotateCcw size={14} aria-hidden="true" />
              Reset Demo State
            </Button>
          )}
        </div>
      </nav>

      {/* Main Page Heading */}
      <div className="page-heading">
        <p className="eyebrow">Admin demo</p>
        <h1 ref={title} tabIndex={-1}>{heading}</h1>
        <p>Explore marketplace oversight with fictional records and functioning moderation workflows.</p>
      </div>

      <aside className="admin-notice" aria-label="Sample admin limitations">
        <Badge>Sample admin · MOCK</Badge>
        <p>
          No real accounts, approvals, refunds or moderation actions. Use fictional text only. Changes reset on refresh and do not affect customer or supplier demos.
        </p>
      </aside>

      {query.data?.access === 'allowed' && (query.isError || query.isFetching) && (
        <div className="admin-refresh">
          {query.isError ? (
            <p role="alert">
              We could not refresh the sample admin workspace. The last fictional snapshot and your unsaved text are kept.
            </p>
          ) : (
            <p role="status">Refreshing sample admin workspace.</p>
          )}
          <Button
            ref={retry}
            variant="secondary"
            busy={query.isFetching}
            onClick={() => {
              restore.current = true;
              void query.refetch();
            }}
          >
            Retry admin refresh
          </Button>
        </div>
      )}

      <AsyncRegion
        title={screen === 'overview' ? 'Overview' : heading}
        state={
          query.isPending || (detail && query.isFetching && !record)
            ? { status: 'loading' }
            : !query.data || (detail && !record && query.isError)
            ? { status: 'error', onRetry: () => { void query.refetch(); } }
            : query.data.access === 'forbidden'
            ? { status: 'forbidden' }
            : {
                status: 'ready',
                children: (
                  <Content
                    key={`${screen}:${recordId ?? ''}`}
                    screen={screen}
                    detail={detail}
                    data={query.data}
                    record={record}
                    adapter={adapter}
                  />
                ),
              }
        }
      />

      {screen === 'overview' && (
        <div className="admin-overview-footer">
          <Button variant="secondary" onClick={() => setAboutOpen(true)}>
            About this workspace
          </Button>
          <Dialog
            open={aboutOpen}
            onClose={() => setAboutOpen(false)}
            title="About this workspace"
            description="This fictional demo provides no administrator permissions. Live authentication, authorization and operational decisions require approved contracts."
          />
        </div>
      )}

      {query.data?.access === 'allowed' && (
        <ResetWorkspaceDialog
          open={resetOpen}
          onClose={() => setResetOpen(false)}
          revision={query.data.revision}
          adapter={adapter}
        />
      )}
    </div>
  );
}

function Content({
  screen,
  detail,
  data,
  record,
  adapter,
}: {
  screen: AdminScreenName;
  detail: boolean;
  data: AllowedWorkspace;
  record?: AdminRecord;
  adapter: AdminAdapter;
}) {
  const navigate = useNavigate();
  const version = { expectedRevision: data.revision };

  if (screen === 'overview') {
    return <AdminOverview data={data} adapter={adapter} />;
  }

  if (screen === 'newCategory') {
    return (
      <>
        <p>Create a fictional category label for this session only. This does not approve a marketplace taxonomy.</p>
        <AdminForm
          adapter={adapter}
          schema={labelInput}
          inputLabel="New sample category label"
          label="Create sample category"
          command={(label) => ({ type: 'createCategory', ...version, label })}
          onSaved={() => { void navigate('/admin/categories'); }}
        />
      </>
    );
  }

  if (detail) {
    return record ? (
      <RecordDetail key={`${record.kind}:${record.id}`} record={record} data={data} adapter={adapter} />
    ) : (
      <>
        <p>This sample record could not be found.</p>
        <Link to={`/admin/${screen}`}>Back to {sectionLabels[screen].toLowerCase()}</Link>
      </>
    );
  }

  return <AdminSectionTable screen={screen} data={data} adapter={adapter} />;
}

// Overview Dashboard with 6 KPI cards & Quick Moderation Queues
function AdminOverview({ data, adapter }: { data: AllowedWorkspace; adapter: AdminAdapter }) {
  const [createCatOpen, setCreateCatOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Extract<AdminRecord, { kind: 'suppliers' }> | null>(null);
  const [selectedRefund, setSelectedRefund] = useState<Extract<AdminRecord, { kind: 'refunds' }> | null>(null);
  const [selectedReview, setSelectedReview] = useState<Extract<AdminRecord, { kind: 'reviews' }> | null>(null);

  const suppliers = useMemo(() => data.records.filter((r): r is Extract<AdminRecord, { kind: 'suppliers' }> => r.kind === 'suppliers'), [data.records]);
  const users = useMemo(() => data.records.filter((r): r is Extract<AdminRecord, { kind: 'users' }> => r.kind === 'users'), [data.records]);
  const categories = useMemo(() => data.records.filter((r): r is Extract<AdminRecord, { kind: 'categories' }> => r.kind === 'categories'), [data.records]);
  const orders = useMemo(() => data.records.filter((r): r is Extract<AdminRecord, { kind: 'orders' }> => r.kind === 'orders'), [data.records]);
  const refunds = useMemo(() => data.records.filter((r): r is Extract<AdminRecord, { kind: 'refunds' }> => r.kind === 'refunds'), [data.records]);
  const reviews = useMemo(() => data.records.filter((r): r is Extract<AdminRecord, { kind: 'reviews' }> => r.kind === 'reviews'), [data.records]);

  const pendingSuppliers = suppliers.filter((s) => s.status === 'pending');
  const pendingRefunds = refunds.filter((r) => r.status === 'pending');
  const flaggedReviews = reviews.filter((r) => r.status === 'flagged');
  const flaggedOrders = orders.filter((o) => o.status === 'flagged');

  return (
    <div className="admin-overview">
      <p className="admin-overview-lead">
        Sample oversight counts only. No revenue, refund totals or operational status is inferred.
      </p>

      {/* Summary links are independent cards rather than term/definition pairs. */}
      <section className="admin-metrics" aria-label="Marketplace sample counts">
        {/* Suppliers KPI Card */}
        <div className="admin-metric-card">
          <div className="admin-metric-card__header">
            <h3>
              <Link to="/admin/suppliers">
                <Store size={18} className="admin-metric-icon" aria-hidden="true" />
                Suppliers
              </Link>
            </h3>
            {pendingSuppliers.length > 0 && (
              <span className="badge badge--warning">{pendingSuppliers.length} Pending</span>
            )}
          </div>
          <p className="admin-metric-card__value">{suppliers.length}</p>
          <div className="admin-metric-card__footer">
            <span>{suppliers.filter((s) => s.status === 'approved').length} Approved</span>
            <Link to="/admin/suppliers" className="admin-card-link">Review →</Link>
          </div>
        </div>

        {/* Users KPI Card */}
        <div className="admin-metric-card">
          <div className="admin-metric-card__header">
            <h3>
              <Link to="/admin/users">
                <Users size={18} className="admin-metric-icon" aria-hidden="true" />
                Users
              </Link>
            </h3>
            <span className="badge badge--neutral">
              {users.filter((u) => u.actor === 'Customer').length} Cust / {users.filter((u) => u.actor === 'Supplier').length} Supp
            </span>
          </div>
          <p className="admin-metric-card__value">{users.length}</p>
          <div className="admin-metric-card__footer">
            <span>{users.filter((u) => u.status === 'suspended').length} Suspended</span>
            <Link to="/admin/users" className="admin-card-link">Manage →</Link>
          </div>
        </div>

        {/* Categories KPI Card */}
        <div className="admin-metric-card">
          <div className="admin-metric-card__header">
            <h3>
              <Link to="/admin/categories">
                <FolderTree size={18} className="admin-metric-icon" aria-hidden="true" />
                Categories
              </Link>
            </h3>
            <button
              type="button"
              className="admin-mini-action-btn"
              aria-label="Add category modal"
              onClick={() => setCreateCatOpen(true)}
            >
              <Plus size={14} aria-hidden="true" /> Add
            </button>
          </div>
          <p className="admin-metric-card__value">{categories.length}</p>
          <div className="admin-metric-card__footer">
            <span>Marketplace taxonomy</span>
            <Link to="/admin/categories" className="admin-card-link">Browse →</Link>
          </div>
        </div>

        {/* Orders KPI Card */}
        <div className="admin-metric-card">
          <div className="admin-metric-card__header">
            <h3>
              <Link to="/admin/orders">
                <ShoppingBag size={18} className="admin-metric-icon" aria-hidden="true" />
                Orders
              </Link>
            </h3>
            {flaggedOrders.length > 0 && (
              <span className="badge badge--danger">{flaggedOrders.length} On Hold</span>
            )}
          </div>
          <p className="admin-metric-card__value">{orders.length}</p>
          <div className="admin-metric-card__footer">
            <span>{orders.filter((o) => o.status === 'processing').length} Processing</span>
            <Link to="/admin/orders" className="admin-card-link">Inspect →</Link>
          </div>
        </div>

        {/* Refunds KPI Card */}
        <div className="admin-metric-card">
          <div className="admin-metric-card__header">
            <h3>
              <Link to="/admin/refunds">
                <Receipt size={18} className="admin-metric-icon" aria-hidden="true" />
                Refund requests
              </Link>
            </h3>
            {pendingRefunds.length > 0 && (
              <span className="badge badge--warning">{pendingRefunds.length} Action Needed</span>
            )}
          </div>
          <p className="admin-metric-card__value">{refunds.length}</p>
          <div className="admin-metric-card__footer">
            <span>{pendingRefunds.length} Pending Review</span>
            <Link to="/admin/refunds" className="admin-card-link">Decide →</Link>
          </div>
        </div>

        {/* Feedback KPI Card */}
        <div className="admin-metric-card">
          <div className="admin-metric-card__header">
            <h3>
              <Link to="/admin/reviews">
                <MessageSquare size={18} className="admin-metric-icon" aria-hidden="true" />
                Feedback
              </Link>
            </h3>
            {flaggedReviews.length > 0 && (
              <span className="badge badge--danger">{flaggedReviews.length} Flagged</span>
            )}
          </div>
          <p className="admin-metric-card__value">{reviews.length}</p>
          <div className="admin-metric-card__footer">
            <span>{reviews.filter((r) => r.status === 'approved').length} Public</span>
            <Link to="/admin/reviews" className="admin-card-link">Moderate →</Link>
          </div>
        </div>
      </section>

      {/* Moderation Action Queue Section */}
      <section className="admin-queue-section" aria-label="Moderation queues">
        <h2 className="admin-queue-title">Active Moderation Queue</h2>
        <div className="admin-queue-grid">
          {/* Pending Suppliers Queue */}
          <div className="admin-queue-card">
            <h3>Pending Supplier Applications ({pendingSuppliers.length})</h3>
            {pendingSuppliers.length === 0 ? (
              <p className="admin-queue-clear">🌿 No pending supplier applications.</p>
            ) : (
              <ul className="admin-queue-list">
                {pendingSuppliers.map((supp) => (
                  <li key={supp.id} className="admin-queue-item">
                    <div>
                      <strong>{supp.label}</strong>
                      <p className="admin-queue-sub">{supp.location ?? 'Location unassigned'}</p>
                    </div>
                    <Button
                      variant="secondary"
                      className="admin-queue-btn"
                      onClick={() => setSelectedSupplier(supp)}
                    >
                      Review
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Pending Refunds Queue */}
          <div className="admin-queue-card">
            <h3>Pending Refund Decisions ({pendingRefunds.length})</h3>
            {pendingRefunds.length === 0 ? (
              <p className="admin-queue-clear">🌿 No pending refund requests.</p>
            ) : (
              <ul className="admin-queue-list">
                {pendingRefunds.map((ref) => (
                  <li key={ref.id} className="admin-queue-item">
                    <div>
                      <strong>{ref.label}</strong>
                      <p className="admin-queue-sub">{ref.reason.slice(0, 45)}...</p>
                    </div>
                    <Button
                      variant="secondary"
                      className="admin-queue-btn"
                      onClick={() => setSelectedRefund(ref)}
                    >
                      Process
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Flagged Reviews Queue */}
          <div className="admin-queue-card">
            <h3>Flagged Reviews ({flaggedReviews.length})</h3>
            {flaggedReviews.length === 0 ? (
              <p className="admin-queue-clear">🌿 No flagged reviews requiring action.</p>
            ) : (
              <ul className="admin-queue-list">
                {flaggedReviews.map((rev) => (
                  <li key={rev.id} className="admin-queue-item">
                    <div>
                      <strong>{rev.label}</strong>
                      <p className="admin-queue-sub">"{rev.comment.slice(0, 40)}..."</p>
                    </div>
                    <Button
                      variant="secondary"
                      className="admin-queue-btn"
                      onClick={() => setSelectedReview(rev)}
                    >
                      Moderate
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      <p className="admin-policy-disclaimer">
        Supplier approval, account restrictions, refund eligibility and moderation policy remain unconfirmed.
      </p>

      {/* Modals for Quick Actions from Overview */}
      <CategoryCreateDialog
        open={createCatOpen}
        onClose={() => setCreateCatOpen(false)}
        revision={data.revision}
        adapter={adapter}
      />

      {selectedSupplier && (
        <SupplierReviewDialog
          open={Boolean(selectedSupplier)}
          onClose={() => setSelectedSupplier(null)}
          supplier={selectedSupplier}
          revision={data.revision}
          adapter={adapter}
        />
      )}

      {selectedRefund && (
        <RefundDecisionDialog
          open={Boolean(selectedRefund)}
          onClose={() => setSelectedRefund(null)}
          refund={selectedRefund}
          revision={data.revision}
          adapter={adapter}
        />
      )}

      {selectedReview && (
        <ReviewModerationDialog
          open={Boolean(selectedReview)}
          onClose={() => setSelectedReview(null)}
          review={selectedReview}
          revision={data.revision}
          adapter={adapter}
        />
      )}
    </div>
  );
}

// Section Table View with Live Search, Filter Pills & Row Dialogs
function AdminSectionTable({
  screen,
  data,
  adapter,
}: {
  screen: AdminSection;
  data: AllowedWorkspace;
  adapter: AdminAdapter;
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Dialog States
  const [supplierReviewTarget, setSupplierReviewTarget] = useState<Extract<AdminRecord, { kind: 'suppliers' }> | null>(null);
  const [userStatusTarget, setUserStatusTarget] = useState<Extract<AdminRecord, { kind: 'users' }> | null>(null);
  const [catCreateOpen, setCatCreateOpen] = useState(false);
  const [catEditTarget, setCatEditTarget] = useState<Extract<AdminRecord, { kind: 'categories' }> | null>(null);
  const [catDeleteTarget, setCatDeleteTarget] = useState<Extract<AdminRecord, { kind: 'categories' }> | null>(null);
  const [orderInspectTarget, setOrderInspectTarget] = useState<Extract<AdminRecord, { kind: 'orders' }> | null>(null);
  const [refundDecisionTarget, setRefundDecisionTarget] = useState<Extract<AdminRecord, { kind: 'refunds' }> | null>(null);
  const [reviewModerationTarget, setReviewModerationTarget] = useState<Extract<AdminRecord, { kind: 'reviews' }> | null>(null);
  const [noteTarget, setNoteTarget] = useState<Extract<AdminRecord, { kind: 'suppliers' | 'users' | 'orders' | 'refunds' | 'reviews' }> | null>(null);

  const allRecords = useMemo(
    () => data.records.filter((item) => item.kind === screen),
    [data.records, screen]
  );

  // Status Filter Options per Section
  const filterOptions = useMemo(() => {
    if (screen === 'suppliers') {
      const supps = allRecords as Extract<AdminRecord, { kind: 'suppliers' }>[];
      return [
        { id: 'all', label: 'All', count: supps.length },
        { id: 'pending', label: 'Pending', count: supps.filter((s) => s.status === 'pending').length },
        { id: 'approved', label: 'Approved', count: supps.filter((s) => s.status === 'approved').length },
        { id: 'suspended', label: 'Suspended', count: supps.filter((s) => s.status === 'suspended').length },
      ];
    }
    if (screen === 'users') {
      const u = allRecords as Extract<AdminRecord, { kind: 'users' }>[];
      return [
        { id: 'all', label: 'All', count: u.length },
        { id: 'active', label: 'Active', count: u.filter((item) => item.status === 'active').length },
        { id: 'suspended', label: 'Suspended', count: u.filter((item) => item.status === 'suspended').length },
        { id: 'customer', label: 'Customers', count: u.filter((item) => item.actor === 'Customer').length },
        { id: 'supplier', label: 'Suppliers', count: u.filter((item) => item.actor === 'Supplier').length },
      ];
    }
    if (screen === 'categories') {
      const c = allRecords as Extract<AdminRecord, { kind: 'categories' }>[];
      return [
        { id: 'all', label: 'All', count: c.length },
        { id: 'active', label: 'Active', count: c.filter((item) => item.status === 'active').length },
      ];
    }
    if (screen === 'orders') {
      const o = allRecords as Extract<AdminRecord, { kind: 'orders' }>[];
      return [
        { id: 'all', label: 'All', count: o.length },
        { id: 'processing', label: 'Processing', count: o.filter((item) => item.status === 'processing').length },
        { id: 'shipped', label: 'Shipped', count: o.filter((item) => item.status === 'shipped').length },
        { id: 'flagged', label: 'Flagged (Hold)', count: o.filter((item) => item.status === 'flagged').length },
      ];
    }
    if (screen === 'refunds') {
      const r = allRecords as Extract<AdminRecord, { kind: 'refunds' }>[];
      return [
        { id: 'all', label: 'All', count: r.length },
        { id: 'pending', label: 'Pending', count: r.filter((item) => item.status === 'pending').length },
        { id: 'approved', label: 'Approved', count: r.filter((item) => item.status === 'approved').length },
        { id: 'rejected', label: 'Rejected', count: r.filter((item) => item.status === 'rejected').length },
      ];
    }
    if (screen === 'reviews') {
      const rev = allRecords as Extract<AdminRecord, { kind: 'reviews' }>[];
      return [
        { id: 'all', label: 'All', count: rev.length },
        { id: 'approved', label: 'Approved (Public)', count: rev.filter((item) => item.status === 'approved').length },
        { id: 'flagged', label: 'Flagged', count: rev.filter((item) => item.status === 'flagged').length },
        { id: 'hidden', label: 'Hidden', count: rev.filter((item) => item.status === 'hidden').length },
      ];
    }
    return [];
  }, [allRecords, screen]);

  // Filtered Records
  const filteredRecords = useMemo(() => {
    let result = allRecords;

    // Status Filter
    if (statusFilter !== 'all') {
      result = result.filter((r) => {
        if ('status' in r && r.status === statusFilter) return true;
        if (r.kind === 'users' && r.actor.toLowerCase() === statusFilter) return true;
        return false;
      });
    }

    // Search Query Filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((r) => {
        if (r.label.toLowerCase().includes(q)) return true;
        if (r.id.toLowerCase().includes(q)) return true;
        if ('note' in r && r.note.toLowerCase().includes(q)) return true;
        if (r.kind === 'suppliers' && (r.application.toLowerCase().includes(q) || r.location?.toLowerCase().includes(q))) return true;
        if (r.kind === 'categories' && (r.slug?.toLowerCase().includes(q) || r.description?.toLowerCase().includes(q))) return true;
        if (r.kind === 'orders' && (r.supplierId.toLowerCase().includes(q) || r.userId.toLowerCase().includes(q))) return true;
        if (r.kind === 'refunds' && (r.reason.toLowerCase().includes(q) || r.orderId.toLowerCase().includes(q))) return true;
        if (r.kind === 'reviews' && (r.comment.toLowerCase().includes(q) || r.orderId.toLowerCase().includes(q))) return true;
        return false;
      });
    }

    return result;
  }, [allRecords, statusFilter, search]);

  // Dynamic Column Definitions per section
  if (screen === 'suppliers') {
    const suppliers = filteredRecords as Extract<AdminRecord, { kind: 'suppliers' }>[];
    const columns: ColumnDef<Extract<AdminRecord, { kind: 'suppliers' }>>[] = [
      {
        id: 'status',
        header: 'Status',
        cell: (s) => <StatusBadge status={s.status} />,
      },
      {
        id: 'location',
        header: 'Location & Focus',
        cell: (s) => (
          <div className="admin-cell-multiline">
            <span>{s.location ?? 'General'}</span>
            {s.specialties && <small className="admin-cell-sub">{s.specialties}</small>}
          </div>
        ),
      },
      {
        id: 'note',
        header: 'Oversight Note',
        cell: (s) => <span className="admin-note-cell">{s.note || '—'}</span>,
      },
    ];

    return (
      <>
        <AdminTable
          title="Suppliers"
          totalRecordsCount={allRecords.length}
          filteredRecords={suppliers}
          columns={columns}
          statusFilterOptions={filterOptions}
          currentStatusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          searchQuery={search}
          onSearchQueryChange={setSearch}
          searchPlaceholder="Search suppliers by name, ID or location..."
          recordHref={(s) => `/admin/suppliers/${s.id}`}
          rowActions={(s) => (
            <>
              <Button
                variant="secondary"
                className="admin-action-btn"
                onClick={() => setSupplierReviewTarget(s)}
              >
                Review
              </Button>
              {s.canAnnotate && (
                <Button
                  variant="secondary"
                  className="admin-action-btn"
                  onClick={() => setNoteTarget(s)}
                >
                  Add Note
                </Button>
              )}
            </>
          )}
        />
        {supplierReviewTarget && (
          <SupplierReviewDialog
            open={Boolean(supplierReviewTarget)}
            onClose={() => setSupplierReviewTarget(null)}
            supplier={supplierReviewTarget}
            revision={data.revision}
            adapter={adapter}
          />
        )}
        {noteTarget && noteTarget.kind === 'suppliers' && (
          <AnnotateDialog
            open={Boolean(noteTarget)}
            onClose={() => setNoteTarget(null)}
            record={noteTarget}
            revision={data.revision}
            adapter={adapter}
          />
        )}
      </>
    );
  }

  if (screen === 'users') {
    const users = filteredRecords as Extract<AdminRecord, { kind: 'users' }>[];
    const columns: ColumnDef<Extract<AdminRecord, { kind: 'users' }>>[] = [
      {
        id: 'actor',
        header: 'Actor Role',
        cell: (u) => <Badge tone={u.actor === 'Supplier' ? 'new' : 'neutral'}>{u.actor}</Badge>,
      },
      {
        id: 'status',
        header: 'Status',
        cell: (u) => <StatusBadge status={u.status} />,
      },
      {
        id: 'email',
        header: 'Contact Email',
        cell: (u) => <span>{u.email ?? 'mock@flowerflora.demo'}</span>,
      },
      {
        id: 'note',
        header: 'Note',
        cell: (u) => <span className="admin-note-cell">{u.note || '—'}</span>,
      },
    ];

    return (
      <>
        <AdminTable
          title="Users"
          totalRecordsCount={allRecords.length}
          filteredRecords={users}
          columns={columns}
          statusFilterOptions={filterOptions}
          currentStatusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          searchQuery={search}
          onSearchQueryChange={setSearch}
          searchPlaceholder="Search users by alias, ID or email..."
          recordHref={(u) => `/admin/users/${u.id}`}
          rowActions={(u) => (
            <>
              <Button
                variant="secondary"
                className="admin-action-btn"
                onClick={() => setUserStatusTarget(u)}
              >
                Moderate
              </Button>
              {u.canAnnotate && (
                <Button
                  variant="secondary"
                  className="admin-action-btn"
                  onClick={() => setNoteTarget(u)}
                >
                  Add Note
                </Button>
              )}
            </>
          )}
        />
        {userStatusTarget && (
          <UserStatusDialog
            open={Boolean(userStatusTarget)}
            onClose={() => setUserStatusTarget(null)}
            user={userStatusTarget}
            revision={data.revision}
            adapter={adapter}
          />
        )}
        {noteTarget && noteTarget.kind === 'users' && (
          <AnnotateDialog
            open={Boolean(noteTarget)}
            onClose={() => setNoteTarget(null)}
            record={noteTarget}
            revision={data.revision}
            adapter={adapter}
          />
        )}
      </>
    );
  }

  if (screen === 'categories') {
    const categories = filteredRecords as Extract<AdminRecord, { kind: 'categories' }>[];
    const columns: ColumnDef<Extract<AdminRecord, { kind: 'categories' }>>[] = [
      {
        id: 'slug',
        header: 'URL Slug',
        cell: (c) => <code>{c.slug ?? c.id}</code>,
      },
      {
        id: 'description',
        header: 'Catalog Description',
        cell: (c) => <span>{c.description || 'General category'}</span>,
      },
      {
        id: 'status',
        header: 'Status',
        cell: (c) => <StatusBadge status={c.status} />,
      },
    ];

    return (
      <>
        <AdminTable
          title="Categories"
          totalRecordsCount={allRecords.length}
          filteredRecords={categories}
          columns={columns}
          statusFilterOptions={filterOptions}
          currentStatusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          searchQuery={search}
          onSearchQueryChange={setSearch}
          searchPlaceholder="Search categories..."
          recordHref={(c) => `/admin/categories/${c.id}`}
          primaryAction={
            <div className="admin-table-primary-group">
              <Link to="/admin/categories/new" className="button button--secondary">
                Add sample category
              </Link>
              <Button
                variant="primary"
                onClick={() => setCatCreateOpen(true)}
              >
                <Plus size={14} aria-hidden="true" /> New Category
              </Button>
            </div>
          }
          rowActions={(c) => (
            <>
              {c.canRename && (
                <Button
                  variant="secondary"
                  className="admin-action-btn"
                  onClick={() => setCatEditTarget(c)}
                >
                  Edit
                </Button>
              )}
              {c.canRemove && (
                <Button
                  variant="destructive"
                  className="admin-action-btn"
                  onClick={() => setCatDeleteTarget(c)}
                >
                  Delete
                </Button>
              )}
            </>
          )}
        />
        <CategoryCreateDialog
          open={catCreateOpen}
          onClose={() => setCatCreateOpen(false)}
          revision={data.revision}
          adapter={adapter}
        />
        {catEditTarget && (
          <CategoryEditDialog
            open={Boolean(catEditTarget)}
            onClose={() => setCatEditTarget(null)}
            category={catEditTarget}
            revision={data.revision}
            adapter={adapter}
          />
        )}
        {catDeleteTarget && (
          <CategoryDeleteDialog
            open={Boolean(catDeleteTarget)}
            onClose={() => setCatDeleteTarget(null)}
            category={catDeleteTarget}
            revision={data.revision}
            adapter={adapter}
          />
        )}
      </>
    );
  }

  if (screen === 'orders') {
    const orders = filteredRecords as Extract<AdminRecord, { kind: 'orders' }>[];
    const columns: ColumnDef<Extract<AdminRecord, { kind: 'orders' }>>[] = [
      {
        id: 'status',
        header: 'Status',
        cell: (o) => <StatusBadge status={o.status} />,
      },
      {
        id: 'details',
        header: 'Customer & Supplier',
        cell: (o) => (
          <div className="admin-cell-multiline">
            <span>Customer: {o.userId}</span>
            <small className="admin-cell-sub">Supplier: {o.supplierId}</small>
          </div>
        ),
      },
      {
        id: 'items',
        header: 'Items',
        cell: (o) => <span>{o.items.map((i) => `${i.label} (x${i.quantity})`).join(', ')}</span>,
      },
      {
        id: 'payment',
        header: 'Payment Status',
        cell: (o) => <StatusBadge status={o.paymentExample ?? 'pending'} />,
      },
    ];

    return (
      <>
        <AdminTable
          title="Orders"
          totalRecordsCount={allRecords.length}
          filteredRecords={orders}
          columns={columns}
          statusFilterOptions={filterOptions}
          currentStatusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          searchQuery={search}
          onSearchQueryChange={setSearch}
          searchPlaceholder="Search orders by item, customer or ID..."
          recordHref={(o) => `/admin/orders/${o.id}`}
          rowActions={(o) => (
            <>
              <Button
                variant="secondary"
                className="admin-action-btn"
                onClick={() => setOrderInspectTarget(o)}
              >
                Inspect
              </Button>
              {o.canAnnotate && (
                <Button
                  variant="secondary"
                  className="admin-action-btn"
                  onClick={() => setNoteTarget(o)}
                >
                  Add Note
                </Button>
              )}
            </>
          )}
        />
        {orderInspectTarget && (
          <OrderInspectDialog
            open={Boolean(orderInspectTarget)}
            onClose={() => setOrderInspectTarget(null)}
            order={orderInspectTarget}
            revision={data.revision}
            adapter={adapter}
          />
        )}
        {noteTarget && noteTarget.kind === 'orders' && (
          <AnnotateDialog
            open={Boolean(noteTarget)}
            onClose={() => setNoteTarget(null)}
            record={noteTarget}
            revision={data.revision}
            adapter={adapter}
          />
        )}
      </>
    );
  }

  if (screen === 'refunds') {
    const refunds = filteredRecords as Extract<AdminRecord, { kind: 'refunds' }>[];
    const columns: ColumnDef<Extract<AdminRecord, { kind: 'refunds' }>>[] = [
      {
        id: 'status',
        header: 'Decision Status',
        cell: (r) => <StatusBadge status={r.status} />,
      },
      {
        id: 'order',
        header: 'Related Order',
        cell: (r) => <Link to={`/admin/orders/${r.orderId}`} className="admin-ref-link">{r.orderId}</Link>,
      },
      {
        id: 'reason',
        header: 'Customer Reason',
        cell: (r) => <span className="admin-reason-cell">{r.reason}</span>,
      },
      {
        id: 'decision',
        header: 'Decision Note',
        cell: (r) => <span>{r.decisionReason ?? r.note ?? '—'}</span>,
      },
    ];

    return (
      <>
        <AdminTable
          title="Refund requests"
          totalRecordsCount={allRecords.length}
          filteredRecords={refunds}
          columns={columns}
          statusFilterOptions={filterOptions}
          currentStatusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          searchQuery={search}
          onSearchQueryChange={setSearch}
          searchPlaceholder="Search refund requests..."
          recordHref={(r) => `/admin/refunds/${r.id}`}
          rowActions={(r) => (
            <>
              <Button
                variant="secondary"
                className="admin-action-btn"
                onClick={() => setRefundDecisionTarget(r)}
              >
                Decision
              </Button>
              {r.canAnnotate && (
                <Button
                  variant="secondary"
                  className="admin-action-btn"
                  onClick={() => setNoteTarget(r)}
                >
                  Add Note
                </Button>
              )}
            </>
          )}
        />
        {refundDecisionTarget && (
          <RefundDecisionDialog
            open={Boolean(refundDecisionTarget)}
            onClose={() => setRefundDecisionTarget(null)}
            refund={refundDecisionTarget}
            revision={data.revision}
            adapter={adapter}
          />
        )}
        {noteTarget && noteTarget.kind === 'refunds' && (
          <AnnotateDialog
            open={Boolean(noteTarget)}
            onClose={() => setNoteTarget(null)}
            record={noteTarget}
            revision={data.revision}
            adapter={adapter}
          />
        )}
      </>
    );
  }

  if (screen === 'reviews') {
    const reviews = filteredRecords as Extract<AdminRecord, { kind: 'reviews' }>[];
    const columns: ColumnDef<Extract<AdminRecord, { kind: 'reviews' }>>[] = [
      {
        id: 'status',
        header: 'Visibility Status',
        cell: (rev) => <StatusBadge status={rev.status} />,
      },
      {
        id: 'rating',
        header: 'Rating',
        cell: (rev) => <span className="admin-stars">{'★'.repeat(rev.rating)}</span>,
      },
      {
        id: 'comment',
        header: 'Customer Comment',
        cell: (rev) => <span className="admin-comment-cell">"{rev.comment}"</span>,
      },
      {
        id: 'order',
        header: 'Order Reference',
        cell: (rev) => <Link to={`/admin/orders/${rev.orderId}`} className="admin-ref-link">{rev.orderId}</Link>,
      },
    ];

    return (
      <>
        <AdminTable
          title="Feedback"
          totalRecordsCount={allRecords.length}
          filteredRecords={reviews}
          columns={columns}
          statusFilterOptions={filterOptions}
          currentStatusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          searchQuery={search}
          onSearchQueryChange={setSearch}
          searchPlaceholder="Search customer reviews..."
          recordHref={(rev) => `/admin/reviews/${rev.id}`}
          rowActions={(rev) => (
            <>
              <Button
                variant="secondary"
                className="admin-action-btn"
                onClick={() => setReviewModerationTarget(rev)}
              >
                Moderate
              </Button>
              {rev.canAnnotate && (
                <Button
                  variant="secondary"
                  className="admin-action-btn"
                  onClick={() => setNoteTarget(rev)}
                >
                  Add Note
                </Button>
              )}
            </>
          )}
        />
        {reviewModerationTarget && (
          <ReviewModerationDialog
            open={Boolean(reviewModerationTarget)}
            onClose={() => setReviewModerationTarget(null)}
            review={reviewModerationTarget}
            revision={data.revision}
            adapter={adapter}
          />
        )}
        {noteTarget && noteTarget.kind === 'reviews' && (
          <AnnotateDialog
            open={Boolean(noteTarget)}
            onClose={() => setNoteTarget(null)}
            record={noteTarget}
            revision={data.revision}
            adapter={adapter}
          />
        )}
      </>
    );
  }

  return null;
}

// Dedicated Record Detail View with Moderation Action Triggers
function RecordDetail({
  record,
  data,
  adapter,
}: {
  record: AdminRecord;
  data: AllowedWorkspace;
  adapter: AdminAdapter;
}) {
  const version = { expectedRevision: data.revision };
  const navigate = useNavigate();

  // Dialog triggers for record detail
  const [supplierReviewOpen, setSupplierReviewOpen] = useState(false);
  const [userStatusOpen, setUserStatusOpen] = useState(false);
  const [orderInspectOpen, setOrderInspectOpen] = useState(false);
  const [refundDecisionOpen, setRefundDecisionOpen] = useState(false);
  const [reviewModerationOpen, setReviewModerationOpen] = useState(false);

  return (
    <div className="admin-record-detail">
      <div className="admin-detail-header">
        <div>
          <h3>{record.label}</h3>
          <p className="admin-record-ref">Sample reference: {record.id}</p>
        </div>
        {'status' in record && <StatusBadge status={record.status} />}
      </div>

      {/* Record Kind Specific Content */}
      {record.kind === 'suppliers' && (
        <div className="admin-detail-content">
          <p>Application fixture: {record.application}</p>
          {record.location && <p>Location: {record.location}</p>}
          {record.specialties && <p>Specialties: {record.specialties}</p>}
          <div className="admin-detail-actions-row">
            <Button variant="secondary" onClick={() => setSupplierReviewOpen(true)}>
              Moderate Supplier Application
            </Button>
          </div>
          <p>Approval, rejection and publication controls are unavailable pending supplier policy and account contracts.</p>
          <SupplierReviewDialog
            open={supplierReviewOpen}
            onClose={() => setSupplierReviewOpen(false)}
            supplier={record}
            revision={data.revision}
            adapter={adapter}
          />
        </div>
      )}

      {record.kind === 'users' && (
        <div className="admin-detail-content">
          <p>Actor label: {record.actor} (fixture only)</p>
          {record.email && <p>Contact email: {record.email}</p>}
          <div className="admin-detail-actions-row">
            <Button variant="secondary" onClick={() => setUserStatusOpen(true)}>
              Manage User Status & Role
            </Button>
          </div>
          <p>This is a fictional display alias, not an identity record. Role grants, account restrictions and deletion are unavailable pending authorization policy.</p>
          <UserStatusDialog
            open={userStatusOpen}
            onClose={() => setUserStatusOpen(false)}
            user={record}
            revision={data.revision}
            adapter={adapter}
          />
        </div>
      )}

      {record.kind === 'orders' && (
        <div className="admin-detail-content">
          <p>
            <Link to={`/admin/suppliers/${record.supplierId}`}>View sample supplier</Link> ·{' '}
            <Link to={`/admin/users/${record.userId}`}>View sample user</Link>
          </p>
          <ul className="admin-items-list">
            {record.items.map((item, index) => (
              <li key={index}>
                {item.label} · quantity {item.quantity}
                {item.unitPrice !== undefined ? ` · $${item.unitPrice.toFixed(2)}` : ''}
              </li>
            ))}
          </ul>
          <p>Payment: {record.paymentExample ? `${record.paymentExample} (client example only)` : 'not connected; no payment has been requested'}</p>
          <div className="admin-detail-actions-row">
            <Button variant="secondary" onClick={() => setOrderInspectOpen(true)}>
              Inspect Order & Hold Status
            </Button>
          </div>
          <p>No amount, charge, shipment, cancellation or refund is performed here.</p>
          <OrderInspectDialog
            open={orderInspectOpen}
            onClose={() => setOrderInspectOpen(false)}
            order={record}
            revision={data.revision}
            adapter={adapter}
          />
        </div>
      )}

      {record.kind === 'refunds' && (
        <div className="admin-detail-content">
          <p>Request fixture: {record.reason}</p>
          {record.decisionReason && <p>Decision reason: {record.decisionReason}</p>}
          <p><Link to={`/admin/orders/${record.orderId}`}>View related sample order</Link></p>
          <div className="admin-detail-actions-row">
            <Button variant="secondary" onClick={() => setRefundDecisionOpen(true)}>
              Process Refund Decision
            </Button>
          </div>
          <p>No refund decision, eligibility, amount or gateway action is established. Approval and refund submission are unavailable pending contracts.</p>
          <RefundDecisionDialog
            open={refundDecisionOpen}
            onClose={() => setRefundDecisionOpen(false)}
            refund={record}
            revision={data.revision}
            adapter={adapter}
          />
        </div>
      )}

      {record.kind === 'reviews' && (
        <div className="admin-detail-content">
          <p>Fictional feedback: {record.comment}</p>
          {record.moderationReason && <p>Moderation reason: {record.moderationReason}</p>}
          <p>
            <Link to={`/admin/orders/${record.orderId}`}>View related sample order</Link> ·{' '}
            <Link to={`/admin/suppliers/${record.supplierId}`}>View sample supplier</Link>
          </p>
          <div className="admin-detail-actions-row">
            <Button variant="secondary" onClick={() => setReviewModerationOpen(true)}>
              Moderate Feedback Visibility
            </Button>
          </div>
          <p>Oversight notes do not publish, hide, edit or verify feedback. Moderation actions await an approved policy.</p>
          <ReviewModerationDialog
            open={reviewModerationOpen}
            onClose={() => setReviewModerationOpen(false)}
            review={record}
            revision={data.revision}
            adapter={adapter}
          />
        </div>
      )}

      {/* Label Edit Form */}
      {'canRename' in record && (
        record.canRename ? (
          <AdminForm
            adapter={adapter}
            schema={labelInput}
            initial={record.label}
            inputLabel="Sample display label"
            label="Save sample label"
            command={(label) => ({ type: 'rename', ...version, kind: record.kind, id: record.id, label })}
          />
        ) : (
          <p>Label editing is unavailable for this sample record.</p>
        )
      )}

      {/* Category removal or note annotation */}
      {record.kind === 'categories' ? (
        <>
          <p>Category changes stay within this demo and do not update the public catalog.</p>
          {record.canRemove ? (
            <RemoveCategory
              record={record}
              revision={data.revision}
              adapter={adapter}
              onRemoved={() => { void navigate('/admin/categories'); }}
            />
          ) : (
            <p>Removal is unavailable for this sample category.</p>
          )}
        </>
      ) : (
        <>
          <p>Saved sample oversight note: {record.note || 'None'}</p>
          {record.canAnnotate ? (
            <AdminForm
              adapter={adapter}
              schema={noteInput}
              initial={record.note}
              inputLabel="Sample oversight note"
              label="Save sample oversight note"
              command={(note) => ({ type: 'annotate', ...version, kind: record.kind, id: record.id, note })}
            />
          ) : (
            <p>Note editing is unavailable for this sample record.</p>
          )}
          <p>Notes are editable session-only text, not an authoritative audit trail or operational decision.</p>
        </>
      )}

      <div className="admin-back-link">
        <Link to={`/admin/${record.kind}`}>Back to {sectionLabels[record.kind].toLowerCase()}</Link>
      </div>
    </div>
  );
}

// RemoveCategory preserved with exact structure & semantics for test suite
function RemoveCategory({
  record,
  revision,
  adapter,
  onRemoved,
}: {
  record: Extract<AdminRecord, { kind: 'categories' }>;
  revision: number;
  adapter: AdminAdapter;
  onRemoved: () => void;
}) {
  const [open, setOpen] = useState(false);
  const submitting = useRef(false);
  const confirm = useRef<HTMLButtonElement>(null);
  const mutation = useAdminCommand(adapter);

  useEffect(() => {
    if (mutation.isError && document.activeElement === document.body) {
      confirm.current?.focus();
    }
  }, [mutation.isError]);

  return (
    <>
      <Button
        variant="secondary"
        onClick={() => {
          mutation.reset();
          setOpen(true);
        }}
      >
        Remove sample category
      </Button>
      <Dialog
        open={open}
        onClose={() => {
          if (!submitting.current) setOpen(false);
        }}
        title="Remove sample category"
        description="Remove this fictional category from the current session? Public products and supplier categories are unaffected."
      >
        {mutation.isPending && <p role="status">Removing sample category.</p>}
        {mutation.isError && <p role="alert">The sample category could not be removed. Try again.</p>}
        <Button
          ref={confirm}
          variant="destructive"
          busy={mutation.isPending}
          onClick={() => {
            if (submitting.current) return;
            submitting.current = true;
            mutation.mutate(
              { type: 'removeCategory', expectedRevision: revision, id: record.id },
              {
                onSuccess: () => {
                  setOpen(false);
                  onRemoved();
                },
                onSettled: () => {
                  submitting.current = false;
                },
              }
            );
          }}
        >
          Confirm removal
        </Button>
      </Dialog>
    </>
  );
}
