import { useState } from 'react';
import {
  Button,
  IconButton,
  TextField,
  SearchInput,
  TextareaField,
  SelectField,
  Combobox,
  CheckboxField,
  RadioGroupField,
  SwitchField,
  Card,
  Badge,
  StatusChip,
  Skeleton,
  EmptyState,
  Alert,
  Price,
  ImageWithFallback,
  Separator,
  Dialog,
  ConfirmDialog,
  Drawer,
  Dropdown,
  Tabs,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableEmptyRow,
  TableLoadingRow,
  Breadcrumbs,
  ToastProvider,
  useToast,
} from '../../shared/components/ui';
import { Container } from '../../shared/components/layout';
import {
  Heart,
  ShoppingBag,
  Trash2,
  Edit3,
  Inbox,
  ExternalLink,
} from 'lucide-react';

export function DesignSystemPreview() {
  return (
    <ToastProvider>
      <DesignSystemContent />
    </ToastProvider>
  );
}

function DesignSystemContent() {
  const { showToast } = useToast();

  // State for interactive demos
  const [busyButton, setBusyButton] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [comboboxVal, setComboboxVal] = useState('colombo');
  const [checkboxVal, setCheckboxVal] = useState(true);
  const [radioVal, setRadioVal] = useState('express');
  const [switchVal, setSwitchVal] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [tableDensity, setTableDensity] = useState<'normal' | 'compact'>('normal');
  const [activeTab, setActiveTab] = useState('buttons');

  const comboboxOptions = [
    { value: 'colombo', label: 'Colombo 03 — Kollupitiya', hint: 'Western Province' },
    { value: 'kandy', label: 'Kandy Central', hint: 'Central Province' },
    { value: 'galle', label: 'Galle Fort', hint: 'Southern Province' },
    { value: 'negombo', label: 'Negombo Coastal', hint: 'Western Province' },
  ];

  const radioOptions = [
    { value: 'standard', label: 'Standard Delivery (2-3 days)', hint: 'Eco-friendly packaging' },
    { value: 'express', label: 'Express Delivery (Next day)', hint: 'Direct florist courier' },
    { value: 'pickup', label: 'Studio Pickup', hint: 'Free from florist workshop' },
  ];

  const dropdownItems = [
    { id: 'view', label: 'View details', icon: <ExternalLink size={14} />, onClick: () => showToast({ title: 'Viewing details', tone: 'info' }) },
    { id: 'edit', label: 'Edit catalog item', icon: <Edit3 size={14} />, onClick: () => showToast({ title: 'Editing item', tone: 'info' }) },
    { id: 'delete', label: 'Remove listing', icon: <Trash2 size={14} />, destructive: true, onClick: () => setConfirmOpen(true) },
  ];

  return (
    <div className="dev-design-system-preview">
      {/* Header Banner */}
      <header className="dev-header">
        <Container variant="public">
          <div className="dev-header__inner">
            <Badge tone="sale">Internal Dev Route</Badge>
            <h1 className="dev-header__title">Botanical Editorial Design System Foundation</h1>
            <p className="dev-header__subtitle">
              Phase 01 Foundation Verification Harness. Strict WCAG 2.2 AA Contrast,
              Accessible UI Primitives, Responsive Containers &amp; Operational Density.
            </p>
          </div>
        </Container>
      </header>

      <Container variant="public" className="dev-body">
        {/* Section 1: Color Palette & Contrast Matrix */}
        <section className="dev-section" aria-labelledby="sec-colors">
          <h2 id="sec-colors" className="dev-section__title">1. Brand Palette &amp; Contrast Matrix</h2>
          <p className="dev-section__desc">
            The five fixed brand colors plus semantic UI tokens. Every text pairing is guarded
            against WCAG 2.2 AA (minimum 4.5:1 for body copy). Sage and Gold are ornamental accents and
            are never used as tiny text on cream.
          </p>

          <div className="dev-palette-grid">
            <div className="dev-swatch" style={{ background: '#244C3A', color: '#F5F3E9' }}>
              <span className="dev-swatch__name">brand.deep</span>
              <span className="dev-swatch__hex">#244C3A</span>
              <span className="dev-swatch__role">Primary solid actions, text</span>
            </div>
            <div className="dev-swatch" style={{ background: '#6F967B', color: '#FFFFFF' }}>
              <span className="dev-swatch__name">brand.sage</span>
              <span className="dev-swatch__hex">#6F967B</span>
              <span className="dev-swatch__role">Accents, strokes (not text on cream)</span>
            </div>
            <div className="dev-swatch" style={{ background: '#B7CDB5', color: '#1A3629' }}>
              <span className="dev-swatch__name">brand.mist</span>
              <span className="dev-swatch__hex">#B7CDB5</span>
              <span className="dev-swatch__role">Section tints, borders</span>
            </div>
            <div className="dev-swatch" style={{ background: '#F5F3E9', color: '#244C3A', border: '1px solid #DFE4D9' }}>
              <span className="dev-swatch__name">brand.cream</span>
              <span className="dev-swatch__hex">#F5F3E9</span>
              <span className="dev-swatch__role">Main warm background</span>
            </div>
            <div className="dev-swatch" style={{ background: '#D9A85F', color: '#1A3629' }}>
              <span className="dev-swatch__name">brand.gold</span>
              <span className="dev-swatch__hex">#D9A85F</span>
              <span className="dev-swatch__role">Decorative rules, stars, sale badge</span>
            </div>
          </div>

          <div className="dev-contrast-table-wrap">
            <Table caption="Contrast Verification Matrix">
              <TableHeader>
                <TableRow>
                  <TableHead>Foreground Color</TableHead>
                  <TableHead>Background Color</TableHead>
                  <TableHead>Measured Ratio</TableHead>
                  <TableHead>WCAG 2.2 Status</TableHead>
                  <TableHead>Allowed UI Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell><strong>Deep Forest (#244C3A)</strong></TableCell>
                  <TableCell>Warm Cream (#F5F3E9)</TableCell>
                  <TableCell><strong>8.70 : 1</strong></TableCell>
                  <TableCell><Badge tone="success">Passes AAA (≥ 7:1)</Badge></TableCell>
                  <TableCell>Public titles, headings, normal copy, labels</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><strong>Muted Forest (#435648)</strong></TableCell>
                  <TableCell>Warm Cream (#F5F3E9)</TableCell>
                  <TableCell><strong>7.07 : 1</strong></TableCell>
                  <TableCell><Badge tone="success">Passes AAA (≥ 7:1)</Badge></TableCell>
                  <TableCell>Secondary copy, field hints, breadcrumbs</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><strong>Warm Cream (#F5F3E9)</strong></TableCell>
                  <TableCell>Deep Forest (#244C3A)</TableCell>
                  <TableCell><strong>8.70 : 1</strong></TableCell>
                  <TableCell><Badge tone="success">Passes AAA (≥ 7:1)</Badge></TableCell>
                  <TableCell>Solid primary button text, dark card text</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><strong>Pure White (#FFFFFF)</strong></TableCell>
                  <TableCell>Deep Forest (#244C3A)</TableCell>
                  <TableCell><strong>9.50 : 1</strong></TableCell>
                  <TableCell><Badge tone="success">Passes AAA (≥ 7:1)</Badge></TableCell>
                  <TableCell>Primary button text, inverted tags</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><strong>Brick Red (#B33A3A)</strong></TableCell>
                  <TableCell>White (#FFFFFF)</TableCell>
                  <TableCell><strong>5.84 : 1</strong></TableCell>
                  <TableCell><Badge tone="success">Passes AA (≥ 4.5:1)</Badge></TableCell>
                  <TableCell>Form errors, destructive action badges</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><strong>Dark Amber (#8C4D00)</strong></TableCell>
                  <TableCell>Warning Tint (#FEF7E0)</TableCell>
                  <TableCell><strong>5.50 : 1</strong></TableCell>
                  <TableCell><Badge tone="success">Passes AA (≥ 4.5:1)</Badge></TableCell>
                  <TableCell>Pending/Warning status badges</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><strong>Deep Green (#2D6A4F)</strong></TableCell>
                  <TableCell>Success Tint (#EAF4EE)</TableCell>
                  <TableCell><strong>5.50 : 1</strong></TableCell>
                  <TableCell><Badge tone="success">Passes AA (≥ 4.5:1)</Badge></TableCell>
                  <TableCell>Active/Success status chips</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><strong>Sage Accent (#6F967B)</strong></TableCell>
                  <TableCell>Warm Cream (#F5F3E9)</TableCell>
                  <TableCell>2.99 : 1</TableCell>
                  <TableCell><Badge tone="danger">Restricted (Non-text UI)</Badge></TableCell>
                  <TableCell>Borders, selected fills only; never normal body text</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><strong>Warm Gold (#D9A85F)</strong></TableCell>
                  <TableCell>Warm Cream (#F5F3E9)</TableCell>
                  <TableCell>1.94 : 1</TableCell>
                  <TableCell><Badge tone="danger">Restricted (Decorative)</Badge></TableCell>
                  <TableCell>Rating star icons, ornamental lines only</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </section>

        {/* Section 2: Typography Scale & Thematic Separation */}
        <section className="dev-section" aria-labelledby="sec-typography">
          <h2 id="sec-typography" className="dev-section__title">2. Typography &amp; Thematic Separation</h2>
          <p className="dev-section__desc">
            Public editorial surfaces use <code>Cormorant Garamond</code> serif headings.
            Back-office supplier and super-admin portals strictly use <code>DM Sans</code> (or system sans)
            to preserve operational density and avoid mixing serif hero typography into data tables.
          </p>

          <div className="dev-type-comparison">
            <div className="dev-type-card dev-type-card--public">
              <span className="dev-type-badge">Public Editorial Display</span>
              <h1 style={{ margin: '0.5rem 0', fontSize: '2.5rem' }}>Bespoke Florist Studio</h1>
              <p style={{ margin: 0, fontSize: '1rem', color: 'var(--text-muted)' }}>
                Hand-tied bouquets with seasonal garden blooms, wrapped in natural linen paper.
              </p>
            </div>

            <div className="dev-type-card dev-type-card--portal">
              <span className="dev-type-badge">Back-Office Operational Sans</span>
              <h2 style={{ margin: '0.5rem 0', fontSize: '1.5rem', fontFamily: 'var(--font-portal)' }}>
                Supplier Catalog &amp; Batch Oversight
              </h2>
              <p style={{ margin: 0, fontSize: '0.875rem', fontFamily: 'var(--font-portal)', color: 'var(--text-muted)' }}>
                12 active listings &bull; 4 pending supplier verifications &bull; Batch #FF-9024
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Interactive Component Demos */}
        <section className="dev-section" aria-labelledby="sec-components">
          <h2 id="sec-components" className="dev-section__title">3. Shared Accessible UI Primitives</h2>

          <Tabs
            activeTab={activeTab}
            onChange={setActiveTab}
            tabs={[
              {
                id: 'buttons',
                label: 'Buttons & Actions',
                content: (
                  <div className="dev-demo-group">
                    <h3 className="dev-demo-heading">Button Variants</h3>
                    <div className="dev-demo-row">
                      <Button variant="primary">Primary Solid</Button>
                      <Button variant="secondary">Secondary Outline</Button>
                      <Button variant="quiet">Quiet Text</Button>
                      <Button variant="destructive">Destructive</Button>
                      <Button variant="accent">Accent Gold</Button>
                    </div>

                    <h3 className="dev-demo-heading">Sizes &amp; States</h3>
                    <div className="dev-demo-row">
                      <Button size="sm">Small (32px)</Button>
                      <Button size="md">Medium (44px)</Button>
                      <Button size="lg">Large (52px)</Button>
                      <Button disabled>Disabled</Button>
                      <Button
                        busy={busyButton}
                        onClick={() => {
                          setBusyButton(true);
                          setTimeout(() => setBusyButton(false), 2000);
                        }}
                      >
                        {busyButton ? 'Processing...' : 'Click for Busy State'}
                      </Button>
                    </div>

                    <h3 className="dev-demo-heading">Icon Buttons &amp; Affixes</h3>
                    <div className="dev-demo-row">
                      <Button startIcon={<ShoppingBag size={16} />}>Add to Bag</Button>
                      <Button variant="secondary" endIcon={<ExternalLink size={16} />}>Studio Profile</Button>
                      <IconButton aria-label="Add to wishlist" icon={<Heart size={18} />} />
                      <IconButton aria-label="Edit listing" icon={<Edit3 size={18} />} variant="secondary" />
                      <IconButton aria-label="Delete item" icon={<Trash2 size={18} />} variant="destructive" />
                    </div>
                  </div>
                ),
              },
              {
                id: 'forms',
                label: 'Form Controls & Inputs',
                content: (
                  <div className="dev-demo-group">
                    <div className="dev-form-grid">
                      <TextField
                        label="Bouquet Name"
                        hint="Descriptive botanical title."
                        defaultValue="Wild Meadow Peony Bouquet"
                        required
                      />

                      <TextField
                        label="SKU Code"
                        hint="Must match supplier inventory code."
                        defaultValue="INV-FLR-001"
                        error="This SKU code is already assigned to Meadow Studio."
                        required
                      />

                      <SearchInput
                        label="Filter catalog"
                        value={searchVal}
                        onChange={(e) => setSearchVal(e.target.value)}
                        onClear={() => setSearchVal('')}
                        placeholder="Search stems, florists, bouquets..."
                      />

                      <SelectField label="Florist Category" hint="Assigned shop categorization." required>
                        <option value="artisan">Artisanal Florist</option>
                        <option value="botanical">Botanical Studio</option>
                        <option value="nursery">Greenhouse &amp; Nursery</option>
                      </SelectField>

                      <Combobox
                        label="Delivery Zone (Searchable Combobox)"
                        options={comboboxOptions}
                        value={comboboxVal}
                        onChange={setComboboxVal}
                        hint="Uses Arrow keys &amp; Enter for keyboard navigation."
                      />

                      <TextareaField
                        label="Care Instructions"
                        hint="Guidelines for extending bloom freshness."
                        maxLength={200}
                        showCount
                        defaultValue="Trim stems at a 45-degree angle under cool running water. Replace water daily."
                      />
                    </div>

                    <Separator />

                    <div className="dev-demo-row" style={{ alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <CheckboxField
                          label="Include complimentary handwritten botanical card"
                          hint="Custom calligraphy on handmade recycled cotton paper."
                          checked={checkboxVal}
                          onChange={(e) => setCheckboxVal(e.target.checked)}
                        />
                      </div>

                      <div style={{ flex: 1 }}>
                        <SwitchField
                          label="Store open for immediate same-day delivery"
                          hint="Courier dispatch active within Colombo city limits."
                          checked={switchVal}
                          onChange={setSwitchVal}
                        />
                      </div>
                    </div>

                    <RadioGroupField
                      legend="Fulfilment Preference"
                      name="delivery_pref"
                      options={radioOptions}
                      value={radioVal}
                      onChange={setRadioVal}
                      orientation="horizontal"
                    />
                  </div>
                ),
              },
              {
                id: 'status',
                label: 'Badges, Chips & Feedback',
                content: (
                  <div className="dev-demo-group">
                    <h3 className="dev-demo-heading">Product Badges</h3>
                    <div className="dev-demo-row">
                      <Badge tone="new">New Season</Badge>
                      <Badge tone="sale">Seasonal Special</Badge>
                      <Badge tone="stock">In Stock (14)</Badge>
                      <Badge tone="sold-out">Sold Out</Badge>
                      <Badge tone="subtle">Limited Edition</Badge>
                      <Badge tone="neutral">Standard Pack</Badge>
                    </div>

                    <h3 className="dev-demo-heading">Operational Status Chips</h3>
                    <div className="dev-demo-row">
                      <StatusChip status="Active" tone="active" />
                      <StatusChip status="Verified" tone="success" />
                      <StatusChip status="Pending Review" tone="pending" />
                      <StatusChip status="Processing Batch" tone="processing" />
                      <StatusChip status="Suspended" tone="suspended" />
                      <StatusChip status="Action Required" tone="danger" />
                    </div>

                    <h3 className="dev-demo-heading">Price Formatting</h3>
                    <div className="dev-demo-row" style={{ alignItems: 'center', gap: '2rem' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', display: 'block', color: 'var(--text-muted)' }}>Valid Price (LKR)</span>
                        <Price amount={4850} currency="LKR" />
                      </div>
                      <div>
                        <span style={{ fontSize: '0.75rem', display: 'block', color: 'var(--text-muted)' }}>Valid Price (USD)</span>
                        <Price amount={48.5} currency="USD" />
                      </div>
                      <div>
                        <span style={{ fontSize: '0.75rem', display: 'block', color: 'var(--text-muted)' }}>Missing Price (Honest Unavailable)</span>
                        <Price amount={null} />
                      </div>
                    </div>

                    <h3 className="dev-demo-heading">Alert Banners</h3>
                    <Alert tone="info" title="Seasonal Availability">
                      Ranunculus and peonies are available until late December.
                    </Alert>
                    <Alert tone="success" title="Catalog Updated">
                      Your changes have been safely published to the marketplace.
                    </Alert>
                    <Alert tone="warning" title="Stock Approaching Threshold">
                      Only 2 bunches of White Hydrangeas remain in current supplier batch.
                    </Alert>
                    <Alert tone="danger" title="Order Validation Blocked">
                      Delivery is not currently available for the selected postal area.
                    </Alert>

                    <h3 className="dev-demo-heading">Reusable Card Primitive</h3>
                    <Card
                      title="Meadow Bloom Studio"
                      eyebrow="Artisanal Florist"
                      actions={<Button size="sm" variant="secondary">Contact Studio</Button>}
                    >
                      <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                        Specialising in hand-tied seasonal posies, wild foliage wreaths, and botanical installations.
                      </p>
                    </Card>

                    <h3 className="dev-demo-heading">Image With Fallback &amp; Skeleton</h3>
                    <div className="dev-demo-row" style={{ alignItems: 'flex-start' }}>
                      <div style={{ width: 140 }}>
                        <span style={{ fontSize: '0.75rem', display: 'block', color: 'var(--text-muted)', marginBottom: 4 }}>Simulated Broken</span>
                        <ImageWithFallback src="invalid-url.jpg" alt="Botanical arrangement" width={140} height={140} />
                      </div>
                      <div style={{ width: 140 }}>
                        <span style={{ fontSize: '0.75rem', display: 'block', color: 'var(--text-muted)', marginBottom: 4 }}>Card Skeleton</span>
                        <Skeleton height={140} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: '0.75rem', display: 'block', color: 'var(--text-muted)', marginBottom: 4 }}>Empty State</span>
                        <EmptyState
                          icon={<Inbox size={32} />}
                          title="No pending customer inquiries"
                          description="When customers send notes with their orders, they will appear in this workspace."
                        />
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                id: 'overlays',
                label: 'Overlays & Dialogs',
                content: (
                  <div className="dev-demo-group">
                    <h3 className="dev-demo-heading">Interactive Modals &amp; Drawers</h3>
                    <div className="dev-demo-row">
                      <Button onClick={() => setDialogOpen(true)}>Open Standard Modal</Button>
                      <Button variant="destructive" onClick={() => setConfirmOpen(true)}>Open Confirm Dialog</Button>
                      <Button variant="secondary" onClick={() => setDrawerOpen(true)}>Open Slide Drawer</Button>
                      <Dropdown label="Row Actions" items={dropdownItems} />
                    </div>

                    <h3 className="dev-demo-heading">Notification Toasts</h3>
                    <div className="dev-demo-row">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => showToast({ title: 'New order placed', description: 'Order #FF-8902 received for Meadow Studio.', tone: 'info' })}
                      >
                        Info Toast
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => showToast({ title: 'Listing updated', description: 'Changes saved to catalogue.', tone: 'success' })}
                      >
                        Success Toast
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => showToast({ title: 'Low inventory alert', description: 'Hydrangeas running low.', tone: 'warning' })}
                      >
                        Warning Toast
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => showToast({ title: 'Action failed', description: 'Unable to update payment status.', tone: 'danger' })}
                      >
                        Danger Toast
                      </Button>
                    </div>

                    {/* Standard Dialog */}
                    <Dialog
                      open={dialogOpen}
                      onClose={() => setDialogOpen(false)}
                      title="Botanical Studio Profile Guidelines"
                      description="Standards for curated marketplace florists."
                    >
                      <p>
                        Flower &amp; Flora florists use biodegradable wrapping, honest sourcing,
                        and guaranteed fresh stem cuts. All images must represent real floral arrangements.
                      </p>
                      <p>
                        Press <kbd>Escape</kbd> or click the Close button to dismiss. Focus automatically
                        returns to the trigger button.
                      </p>
                    </Dialog>

                    {/* Confirm Dialog */}
                    <ConfirmDialog
                      open={confirmOpen}
                      onClose={() => setConfirmOpen(false)}
                      onConfirm={() => {
                        setConfirmOpen(false);
                        showToast({ title: 'Item removed', tone: 'danger' });
                      }}
                      title="Remove Catalog Listing?"
                      description="This action cannot be undone. Any active customer cart references will be invalidated."
                      confirmLabel="Yes, Remove Listing"
                      variant="destructive"
                    />

                    {/* Slide Drawer */}
                    <Drawer
                      open={drawerOpen}
                      onClose={() => setDrawerOpen(false)}
                      title="Marketplace Filter Options"
                      description="Refine florists and botanical arrangements."
                      footer={
                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                          <Button variant="secondary" onClick={() => setDrawerOpen(false)}>Cancel</Button>
                          <Button onClick={() => setDrawerOpen(false)}>Apply Filters</Button>
                        </div>
                      }
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <TextField label="Price Range Max" defaultValue="15,000" />
                        <SelectField label="Occasion">
                          <option>Celebration &amp; Birthday</option>
                          <option>Sympathy &amp; Remembrance</option>
                          <option>Weddings &amp; Events</option>
                        </SelectField>
                        <CheckboxField label="Organic certified stems only" />
                        <CheckboxField label="Includes glass vase" />
                      </div>
                    </Drawer>
                  </div>
                ),
              },
              {
                id: 'table',
                label: 'Data Table Primitives',
                content: (
                  <div className="dev-demo-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <h3 className="dev-demo-heading" style={{ margin: 0 }}>Operational Back-Office Table</h3>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setTableDensity((prev) => (prev === 'normal' ? 'compact' : 'normal'))}
                      >
                        Density: {tableDensity === 'normal' ? 'Normal (Default)' : 'Compact (Dense)'}
                      </Button>
                    </div>

                    <Table density={tableDensity} caption="Sample Supplier Catalog Orders">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order Ref</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Arrangement</TableHead>
                          <TableHead>Fulfilment</TableHead>
                          <TableHead align="right">Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead align="center">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell><code>#FF-7041</code></TableCell>
                          <TableCell>Amara Perera</TableCell>
                          <TableCell>White Gardenia Vase</TableCell>
                          <TableCell>Express Courier</TableCell>
                          <TableCell align="right"><Price amount={8500} /></TableCell>
                          <TableCell><StatusChip status="Processing" tone="processing" /></TableCell>
                          <TableCell align="center">
                            <Button size="sm" variant="quiet">Inspect</Button>
                          </TableCell>
                        </TableRow>
                        <TableRow selected>
                          <TableCell><code>#FF-7042</code></TableCell>
                          <TableCell>Devinda Silva</TableCell>
                          <TableCell>Wild Meadow Bouquet</TableCell>
                          <TableCell>Studio Pickup</TableCell>
                          <TableCell align="right"><Price amount={5400} /></TableCell>
                          <TableCell><StatusChip status="Verified" tone="success" /></TableCell>
                          <TableCell align="center">
                            <Button size="sm" variant="quiet">Inspect</Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell><code>#FF-7043</code></TableCell>
                          <TableCell>Nadeeka Fernando</TableCell>
                          <TableCell>Ranunculus Pastel Casket</TableCell>
                          <TableCell>Standard Delivery</TableCell>
                          <TableCell align="right"><Price amount={12800} /></TableCell>
                          <TableCell><StatusChip status="Pending Review" tone="warning" /></TableCell>
                          <TableCell align="center">
                            <Button size="sm" variant="quiet">Inspect</Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>

                    <h4 style={{ margin: '1.5rem 0 0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                      Table Loading Skeleton State
                    </h4>
                    <Table density="compact" caption="Loading state preview">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order Ref</TableHead>
                          <TableHead>Recipient</TableHead>
                          <TableHead>Item</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableLoadingRow colSpan={3} rows={2} />
                      </TableBody>
                    </Table>

                    <h4 style={{ margin: '1.5rem 0 0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                      Table Empty State
                    </h4>
                    <Table density="compact" caption="Empty state preview">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order Ref</TableHead>
                          <TableHead>Recipient</TableHead>
                          <TableHead>Item</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableEmptyRow colSpan={3} message="No archival orders found for this query." />
                      </TableBody>
                    </Table>
                  </div>
                ),
              },
            ]}
          />
        </section>

        {/* Section 4: Breadcrumbs & Navigation */}
        <section className="dev-section" aria-labelledby="sec-nav">
          <h2 id="sec-nav" className="dev-section__title">4. Breadcrumbs &amp; Navigational Hierarchy</h2>
          <div className="dev-demo-row" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                Public Editorial Breadcrumb:
              </span>
              <Breadcrumbs
                variant="public"
                items={[
                  { label: 'Home', to: '/' },
                  { label: 'Artisanal Florists', to: '/shops' },
                  { label: 'Meadow Studio', to: '/shops/meadow-studio' },
                ]}
                current="Wild Meadow Bouquet"
              />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                Dashboard Compact Breadcrumb:
              </span>
              <Breadcrumbs
                variant="dashboard"
                items={[
                  { label: 'Supplier Workspace', to: '/supplier' },
                  { label: 'Catalog', to: '/supplier/products' },
                ]}
                current="Edit Arrangement"
              />
            </div>
          </div>
        </section>
      </Container>
    </div>
  );
}
