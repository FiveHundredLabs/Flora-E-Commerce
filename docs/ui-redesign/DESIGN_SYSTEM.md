# Design System v1 — Botanical Editorial Luxury

All screens share these values, but **marketing / commerce** and **back-office** use different density and typography rules.

## Identity
- Voice: calm, descriptive, editorial, accurate, warm, premium without pretence. Never invent customer testimonials or unsupported delivery guarantees.
- Atmosphere: bespoke florist studio meets reliable marketplace.
- Composition: contrast in section scale; strong asymmetry balanced with disciplined grids. Photography has intentional focus and breathing room. Avoid cloning the supplied reference screenshot.
- Avoid: cobalt/terracotta from old design, neon greens, rainbow graph palettes, excessive gradients, overly rounded cards, blur/glassmorphism, decorative gimmicks, intrusive popups and autoplay video.

## Brand tokens

| Token | Value | Suggested use |
|---|---|---|
| `brand.deep` | `#244C3A` | Primary actions, dark surfaces, text, nav |
| `brand.sage` | `#6F967B` | Selected backgrounds, strokes, accents (NOT small text on cream) |
| `brand.mist` | `#B7CDB5` | Section background, subtle shapes, borders |
| `brand.cream` | `#F5F3E9` | Main warm background |
| `brand.gold` | `#D9A85F` | Tiny accents, labels, decorative rules, icons |
| `surface.paper` | `#FFFFFF` | Portal panels, forms, commerce cards |
| `surface.soft` | `#FCFBF7` | Soft alternate background |
| `border.soft` | `#DFE4D9` | Fine separators and boundaries |
| `text.strong` | `#244C3A` | Headings and normal copy |
| `text.muted` | `#435648` | Secondary copy |
| `danger` | choose accessible muted brick red | Form errors, destructive actions |
| `warning` | choose accessible dark amber | Non-destructive warning |
| `success` | choose accessible deeper green | Positive state |
| `info` | choose accessible neutral/slate | Informational state |

Before mapping CSS variables into shadcn tokens, confirm Tailwind/shadcn versions. Define actual variables in the project's existing styling entry point and adapt semantic `background`, `foreground`, `card`, `popover`, `primary`, `secondary`, `muted`, `accent`, `border`, `input`, `ring`, `destructive`, `chart`, etc. Ensure every variant has readable foreground pairings. Restrict dark theme to an explicit requirement; prioritize excellent light theme.

**Contrast guard:** `#244C3A` on `#F5F3E9` ~= 8.70:1; `#6F967B` on cream ~= 2.99:1; `#D9A85F` on cream ~= 1.94:1. Deep-green small text on gold ~= 4.48:1, just below strict 4.5:1 AA normal text. Gold-on-green also may not pass. Validate **actual rendered combinations** in components; do not assume ornamental colors are readable text colors. Default AA normal text 4.5:1, large text 3:1, UI non-text contrast 3:1 when applicable.

## Typography
- Display: `Cormorant Garamond` (or another legally usable high-quality editorial serif already licensed in repo); headings typically 38–76px desktop and fluid/clamped, 32–46px mobile; avoid ultra-thin weights.
- Body/UI: `DM Sans` (or existing similarly readable sans); body 15–17px; 1.5–1.65 line height. Admin data sizes 13–15px only where accessible and appropriate.
- Use font-display swap and font subset/self-hosting or established project loading strategy. Prevent layout shifts.
- Public titles: serif, sentence case, balanced lines. Portal table labels, KPI labels, navigation: sans. Avoid all-caps paragraph text.

## Layout
- Public content max-width ~1280–1360px, viewport gutters mobile 20px; tablet 32px; desktop 48–64px.
- 12-column desktop grid; 8-column tablet; 4-column mobile conceptually. On mobile use 2-column products when 320px screens and prices fit; otherwise 1-column at narrow widths.
- Spacing scale based on 4/8px steps; public section spacing roughly 80–120px desktop, 48–72px mobile; portals more compact 20–32px content spacing.
- Cards: image-first, modest 8–16px radius when useful, borders preferred to heavy shadows. Buttons 44–48px min practical touch area, large readable labels, focus rings.
- Section patterns: split image/text, calm dark-green campaign panels, alternating warm white/cream, wide photography, thin editorial dividers, quiet collection tiles, restrained microcopy.
- Portal app shell: navigation sidebar + topbar + breadcrumbs; sticky action areas where appropriate; collapsible mobile sidebar; fixed semantics for data tables/filter bars.

## Component inventory
Foundation: Button (solid/outline/quiet/destructive), IconButton, TextInput, SearchInput, Textarea, Select, Combobox, MultiSelect, Checkbox, Radio, Switch, FormField, Helper/ErrorText, Badge, Tabs, Breadcrumb, Dialog, Drawer/Sheet, Tooltip, Popover, Toast, Skeleton, EmptyState, Alert, Pagination, PaginationStatus, Price, ImageWithFallback, Separator, ResponsiveContainer, PageHeader, ConfirmDialog, DataTable, FilterBar, FileUploader, StatCard, Timeline/StatusStepper.

Commerce: SiteHeader/MobileMenu/SearchOverlay, StoreCard, ProductCard, ProductGallery, VariantSelector, AddOnSelector, PriceSummary, StockBadge, CartItem, PerStoreCartGroup, FulfilmentOption, OrderStatusTimeline, ShopRating, ReviewCard (actual data only).

Admin/Supplier: DashboardShell, RoleNavigation, StatsGrid, DataTableFilters, TableToolbar, LoadingRow, BulkActions (only authorized), KPI trend indication (only real data), ApprovalDrawer, OrderItemsTable, ImageProcessingState, StatusChip, AuditInfo (if supported).

## UX behavior
- Never rely on color alone. All form inputs have persistent labels and programmatic error descriptions.
- Avoid nested clickable interactive elements in product cards.
- Focus moves correctly on modal/drawer open/close. Escape dismisses appropriate overlays. Focus is visible for keyboard users.
- Product/add-to-cart/quantity/checkout feedback is immediate and clearly associated with the relevant item; error rollback is handled.
- Responsive filter drawer on mobile; applied filter chips, result counts and reset action on search/listing pages.
- Real shipping/fulfilment availability is shown before order confirmation; delivery price must come from verified quotes or say unavailable/pending.
- Cart totals and checkout totals are computed with server-verified prices at the appropriate stages.
- Table sorting, filters, counts, date ranges and CSV export must reflect actual backend capabilities; do not invent.

## Photographic direction and assets
Warm daylight, real botanical textures, cream stone, linen, pottery, pale studio walls, green foliage, bespoke bouquets. Mix full-bleed editorial still life with product cutouts on consistent neutral surfaces. Use only project-owned/licensed images and provide meaningful alt text, `width`/`height` or aspect ratio, srcset/sizes, lazy-loading below fold; prioritize hero LCP resource. The supplied reference's blue gradient and terracotta sections are **not** part of the new brand palette.

## Motion
Subtle reveal when helpful, small hover emphasis, no forced parallax, no layout-transform animations that impair use; respect reduced-motion preference. Inputs, drawers, tabs and page transitions must not delay interaction or block screen readers.

## Thematic separation
- **Public landing:** editorial serif, atmospheric oversized imagery, story sections, varied asymmetric composition.
- **Shop/PDP/cart:** more structured, shopping-first clarity, stable imagery, visible price and actions.
- **Supplier/Admin:** information dense but calm, sans-first UI, sticky table headers, accessible controls, strong information hierarchy, few decorative images.
