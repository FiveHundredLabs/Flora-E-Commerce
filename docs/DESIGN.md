# Flower & Flora Design System & UX Specification (Fiama Botanical Theme)

## 1. Vision & Architectural Philosophy

Flower & Flora is a multi-supplier floral and botanical marketplace. This design specification translates the approved **Botanical Green (Fresh & Natural)** palette and the luxury botanical aesthetic of the **Fiama** design language into a cohesive, accessible, and high-performance frontend.

The visual style combines:
- **Architectural Crispness**: Sharp `0px` border-radii on cards, buttons, badges, tabs, and tables for an editorial, modern luxury botanical feel, contrasted with pill-shaped search inputs and rounded circular icon actions.
- **Botanical Green Palette**: Grounded in deep forest greens, soft sage accents, warm ochre gold highlights, and delicate cream backgrounds.
- **Rich Micro-Interactions**: Hover overlays on product cards, animated image swaps, floating tooltips, sticky navigation transitions, and custom input adornments.
- **Accessibility by Architecture**: Strict WCAG 2.2 AA conformance, 4.5:1 text contrast ratios, visible focus indicators, screen-reader landmarks, and forced-colors support.

---

## 2. Design Tokens & Color Palette

### 2.1 Palette Definition (OD-09 Resolved)

| Token Name | Hex Code | Role & Usage Description |
|:---|:---|:---|
| `--color-forest-deep` | `#244C3A` | **Primary Brand Color**: H1–H6 headings, primary brand buttons, footer headings, prominent iconography |
| `--color-sage-accent` | `#6F967B` | **Secondary Brand Color**: Active links, button hover states, secondary actions, badge backgrounds, accent underline bars |
| `--color-mint-soft` | `#B7CDB5` | **Soft Mint / Border**: Subtle borders, divider rules, inactive swatch outlines, card hairline borders |
| `--color-cream-warm` | `#F5F3E9` | **Canvas / Background**: Page backdrop, breadcrumb hero background, alternating section fills, dropdown backgrounds |
| `--color-gold-warm` | `#D9A85F` | **Accent / Luxury Gold**: Sale badges, review star ratings, limited-time deal countdowns, premium highlights |
| `--color-forest-text` | `#1A3629` | **Body Foreground**: High-contrast, readable dark botanical green for all paragraph copy and forms |
| `--color-forest-muted` | `#4E6B59` | **Muted Copy**: Secondary labels, SKU tags, subtitle eyebrows, metadata, breadcrumb inactive steps |
| `--color-white` | `#FFFFFF` | **Pure White**: Card surfaces, modal surfaces, form input backgrounds, elevated floating cards |
| `--color-destructive` | `#B33A3A` | **Destructive / Error**: Form validation errors, stock-out alerts, remove item buttons |
| `--color-success` | `#2D6A4F` | **Success / In-Stock**: In-stock pill badges, verified supplier indicators, order success notices |

### 2.2 CSS Variables Mapping (`tokens.css`)

```css
:root {
  /* Brand Palettes */
  --color-forest-deep: #244c3a;
  --color-sage-accent: #6f967b;
  --color-mint-soft: #b7cdb5;
  --color-cream-warm: #f5f3e9;
  --color-gold-warm: #d9a85f;
  --color-forest-text: #1a3629;
  --color-forest-muted: #4e6b59;
  --color-white: #ffffff;
  --color-destructive: #b33a3a;
  --color-success: #2d6a4f;

  /* Semantic UI Tokens */
  --background: var(--color-cream-warm);
  --foreground: var(--color-forest-text);
  --card: var(--color-white);
  --card-foreground: var(--color-forest-text);
  --primary: var(--color-forest-deep);
  --primary-foreground: var(--color-white);
  --secondary: var(--color-sage-accent);
  --secondary-foreground: var(--color-white);
  --accent: var(--color-gold-warm);
  --accent-foreground: var(--color-forest-deep);
  --muted: #e8ede4;
  --muted-foreground: var(--color-forest-muted);
  --border: #dbe3d8;
  --border-strong: var(--color-mint-soft);
  --input: #cfd9cc;
  --input-focus: var(--color-sage-accent);
  --ring: var(--color-sage-accent);

  /* Geometry & Radii */
  --radius-none: 0px;
  --radius-sm: 2px;
  --radius-md: 4px;
  --radius-pill: 9999px;
  --radius: var(--radius-none); /* Fiama signature sharp aesthetic */

  /* Shadows */
  --shadow-sm: 0 2px 4px rgba(36, 76, 58, 0.05);
  --shadow-md: 0 5px 20px rgba(36, 76, 58, 0.08);
  --shadow-lg: 0 16px 32px rgba(36, 76, 58, 0.12);
  --shadow-hover: 0 8px 24px rgba(36, 76, 58, 0.14);

  /* Typography */
  --font-heading: 'Montserrat', system-ui, -apple-system, sans-serif;
  --font-body: 'Poppins', system-ui, -apple-system, sans-serif;
  --text-xs: 0.75rem;     /* 12px */
  --text-sm: 0.875rem;    /* 14px */
  --text-base: 1rem;       /* 16px */
  --text-lg: 1.125rem;    /* 18px */
  --text-xl: 1.25rem;     /* 20px */
  --text-2xl: 1.5rem;     /* 24px */
  --text-3xl: 1.875rem;   /* 30px */
  --text-4xl: 2.25rem;    /* 36px */
  --text-5xl: 3rem;       /* 48px */
  --text-hero: 4.25rem;   /* 68px */

  /* Layout */
  --content-width: 1200px;
  --space-gutter: 30px;
  --section-padding-y: 100px;
}
```

---

## 3. Typography System

The Fiama design leverages a dual-font structure:
1. **Headings & Accents (`Montserrat`)**:
   - Geometric, crisp, and high-impact.
   - Weights: `600` (Semi-bold for card titles and subheadings), `700` (Bold for page titles, section headers, badges, and uppercase navigation).
   - Letter Spacing: Section titles and uppercase eyebrows feature tracked spacing `+1.5px` to `+2px`.
2. **Body & Controls (`Poppins`)**:
   - Soft, balanced, and readable.
   - Weights: `400` (Regular body copy, product descriptions), `500` (Medium for table cells, filter labels, and inputs), `600` (Semi-bold for prices and key metrics).
   - Base Line Height: `1.8` for long-form prose; `1.4`–`1.5` for compact metadata.

---

## 4. Layout & Grid Architecture

- **Max Container Width**: `1200px` (with `15px` padding on both left and right, netting `1140px` content column).
- **Responsive Breakpoints**:
  - `Mobile (<768px)`: 1-column layouts, 2-column compact product grids (`15px` gutter), drawer-based filter and navigation.
  - `Tablet (768px - 1023px)`: 2-column or 3-column product grids, collapsible sidebars.
  - `Desktop (>=1024px)`: 4-column product grids (`col-3`), 3-column catalog grids with 1-column filter sidebar (`col-9` / `col-3`).
- **Section Rhythm**:
  - Vertical section padding: Desktop `100px`–`120px`; Mobile `50px`–`60px`.
  - Consistent alternating section backgrounds: Pure White (`#ffffff`) ↔ Warm Cream (`#F5F3E9`).

---

## 5. Global Navigation & Header System

The header follows the Fiama 3-tier and sticky layout, fully aligned with customer navigation and workspace roles:
1. **Top Announcement & Utility Bar**:
   - Background: `--color-forest-deep` (`#244C3A`), text `--color-cream-warm` (`#F5F3E9`).
   - Left: Promotional banner ("Free local delivery on orders over $60 · Freshness Guaranteed").
   - Right: Quick utility links to the multi-vendor portals: **Supplier Portal** (`/supplier`), **Admin Access** (`/admin`), and **Order Tracking** (`/account/orders`). This keeps the customer-facing main navigation clean, elegant, and shopping-focused.
2. **Main Header Row**:
   - **Logo**: Left-aligned wordmark "Flower & Flora." with a Golden Ochre dot (`#D9A85F`) at the end.
   - **Search Bar**: Centered pill shape (`border-radius: var(--radius-pill)`), height `48px`, border `2px solid var(--border)`, placeholder "Search flowers, bouquets, plants...". Embedded submit icon on the right; submitting queries navigates to `/products?q=...`.
   - **Utility Actions (Right)**:
     - User Account link/icon.
     - Wishlist button with live count badge linking to `/wishlist`.
     - Cart toggle button with circular Sage Green badge (`#6F967B`) and live total price (`$0.00`). Clicking opens the **Slide-Out Cart Drawer**.
3. **Primary Navigation Bar**:
   - Centered uppercase links: `HOME`, `SHOP / PRODUCTS`, `SHOPS / STORES`, `WISHLIST`, `ABOUT US`, `CONTACT US`.
   - Typography: Montserrat 700, `14px`, letter-spacing `1.2px`.
   - Hover effect: Underline and color shift to `--color-sage-accent` (`#6F967B`).
4. **Sticky Header Behavior**:
   - When scrolled past the hero threshold, a slim `65px` white navigation bar pins to top with `--shadow-md`.
5. **Drawers**:
   - **Mobile Navigation Drawer**: Off-canvas left-sliding panel with accordion categories, search input, and social links.
   - **Slide-Out Cart Drawer**: Off-canvas right-sliding panel (`width: 420px; max-width: 90vw`). Displays line items cleanly grouped by Store (OD-02 compliant), item quantity controls, subtotal, and direct links to per-store checkout and the full `/cart` page.

---

## 6. Page-by-Page Component Specifications

### 6.1 Home Page (`/`)
- **Multi-Slide Hero Carousel**:
  - Interactive carousel rotating between seasonal floral highlights, artisanal grower stories, and curated event bouquets with smooth cross-fade and navigation dots/arrows.
  - Height: `680px`–`720px` desktop / `460px` mobile.
  - Background: Soft cream gradient or ambient botanical photography.
  - Left content:
    - Eyebrow: Montserrat 700, `15px`, uppercase, color `--color-forest-muted`.
    - **Signature Underline Bar**: `2px` thick, `50px` wide, color `--color-sage-accent`, margin `12px 0 24px`.
    - Title: Montserrat 700, `68px` (responsive to `34px`), color `--color-forest-deep`.
    - Subtitle: Poppins 400, `16px`, color `--color-forest-muted`.
    - Primary CTA: Sharp button (`border-radius: 0px`), background `--color-sage-accent`, text white, hover `--color-forest-deep`.
  - Right content: Cutout bouquet image with soft ambient shadow.
- **Floating Feature Bar (`.ltn__feature-area`)**:
  - Overlapping card resting across the bottom hero boundary.
  - 4 columns: *Free Delivery*, *100% Fresh Guarantee*, *Secure Checkout*, *Artisan Crafted*.
  - Clean botanical line icons + Montserrat 700 title + Poppins 400 helper text.
- **Curated Collections / Category Circles**:
  - Horizontal or grid layout of categories (Fresh Bouquets, Wedding, Indoor Plants, Dried Florals, Gift Baskets).
- **Featured Products Section**:
  - Section title with center alignment and botanical leaf motif.
  - Filter tabs (All, Trending, Best Sellers, New Arrivals).
  - 4-column product grid using the Signature Product Card.
- **Mid-Page Promo Banners**:
  - 2-column asymmetric banner cards with image zoom on hover and floating white offer cards.
- **Customer Testimonials Carousel**:
  - Warm cream background, quote icon in Gold, customer avatar, star ratings, and review excerpt.

### 6.2 Products / Catalog Page (`/products`)
- **Breadcrumb Hero Banner**:
  - Off-white / cream background (`#F5F3E9`), height `200px`.
  - Centered Montserrat 700 H1 title ("All Floral Products").
  - Breadcrumbs: `Home > Products`.
- **2-Column Layout**:
  - **Left Filter Sidebar (`col-3`)**:
    - Widget Title: Montserrat 700, `18px`, uppercase, accented with `border-left: 3px solid var(--color-sage-accent)`.
    - Category list with count pills.
    - Price Range Slider / Dual handles ($0 to $250+).
    - Color swatches (circular color circles with active checkmark / ring).
    - Flower Occasion checkboxes (Birthday, Anniversary, Sympathy, Celebration).
    - Tag cloud with sharp rectangular pills.
  - **Right Product Grid (`col-9`)**:
    - **Top Toolbar**:
      - View Switcher: 3-column grid icon, 4-column grid icon, List view icon.
      - Product counter: "Showing 1–12 of 36 results".
      - Sorting dropdown (Featured, Price: Low to High, Price: High to Low, Newest).
    - Product Grid (3 or 4 columns).
    - Numerical Pagination: Sharp square boxes (`45px x 45px`), active page filled in `--color-forest-deep`.

### 6.3 Product Detail Page (PDP) (`/products/:slug`)
- **50/50 Two-Column Hero Split**:
  - **Left: Gallery**:
    - Large square main product image with hover zoom cursor.
    - 4-thumbnail row underneath with sharp borders; active image bordered in `--color-sage-accent`.
  - **Right: Purchase Details**:
    - Title: Montserrat 700, `32px`, color `--color-forest-deep`.
    - Ratings: 5 Gold stars (`#D9A85F`) + customer review count.
    - Price: Prominent current price in `--color-forest-deep` (`26px`) + strikethrough original price in muted gray.
    - Stock & SKU: Status pill (e.g., "In Stock" in green) + SKU identifier.
    - Store Attribution: Link to the supplier's store ("Crafted by: Green Petals Studio").
    - Short Description excerpt.
    - Variant Selectors: Sharp rectangular option pills (Size: Standard, Deluxe, Premium).
    - **Quantity Stepper (`.cart-plus-minus`)**:
      - Boxed stepper: `width: 140px; height: 52px; border: 2px solid var(--border-strong)`.
      - `-` and `+` buttons on ends, center numeric value.
    - **Action Row**:
      - Primary "Add to Cart" button: Sharp, full height `52px`, background `--color-forest-deep`, hover `--color-sage-accent`.
      - "Add to Wishlist" square icon button (`52px x 52px`).
- **Product Information Tabs**:
  - Horizontal tabs: *Description*, *Care Instructions*, *Delivery & Packaging*, *Customer Reviews*.
  - Active tab underlined in `--color-sage-accent`.
  - Tab content: Clean typography, alternating zebra rows on specification tables.

### 6.4 Wishlist Page (`/wishlist`)
- **Breadcrumb Header**: "My Wishlist".
- **Structured Wishlist Table**:
  - Columns:
    1. **Remove**: Circular `×` button with red hover state.
    2. **Image**: `80px x 80px` sharp square thumbnail.
    3. **Product Name & Store**: Montserrat 700 title + store badge.
    4. **Unit Price**: Current price with currency symbol.
    5. **Stock Status**: "In Stock" (green) or "Sold Out" (red) badge.
    6. **Action**: "Add to Cart" button (compact `42px` height).
- **Guest Persistence (LocalStorage)**:
  - Wishlist items persist across browser sessions in local storage without requiring customer login.
  - One-click "Add to Cart" instantly moves items into the active cart drawer, grouped by store (OD-02).
- **Empty State**:
  - Minimal botanical illustration or icon.
  - "Your wishlist is currently empty".
  - "Explore Catalog" CTA button linking to `/products`.

### 6.5 About Us Page (`/about`)
- **Story Section**:
  - Alternating asymmetric grid: floral arrangement photo with offset decorative Sage Green background frame + story narrative.
  - Headline: "Connecting Local Florists with Flower Lovers".
- **Mission & Values (3-Column Cards)**:
  - White cards with `--shadow-md`, circular botanical icons, bold titles, and brief value statements.
- **Video Banner / Visual Break**:
  - Full-width hero banner with dark green tint overlay and animated pulsing Play button.
- **Supplier & Artisan Spotlight**:
  - Showcase of local flower growers and florists participating in the marketplace.

### 6.6 Contact Us Page (`/contact`)
- **3-Column Contact Cards**:
  - *Customer Support*, *Store Locations*, *Supplier Inquiries*.
  - Pure white background, `2px solid var(--border)`, centered circular icon (`60px x 60px`) transitioning to filled Sage Green on card hover.
- **Contact Form Box (Overlapping Layout)**:
  - Elevated white card with `--shadow-lg`, padding `48px`, overlapping the bottom map section.
  - Section title with left vertical accent bar: `border-left: 3px solid var(--color-sage-accent)`.
  - Inputs with embedded right-aligned icons (user, envelope, phone, pencil).
  - Form validation states with accessible error labels.
  - Full-width or prominent "Send Message" CTA.
- **Location Map Integration**:
  - Clean map container with custom botanical dark green styling.

### 6.7 Footer Section
- **4-Column Layout**:
  - **Col 1 (Brand & Mission)**: Flower & Flora logo, brief statement, physical location, email, and circular social icon buttons (Instagram, Facebook, Pinterest, Twitter).
  - **Col 2 (Customer Care)**: Orders & Tracking, Delivery Information, Returns Policy, FAQs, Contact.
  - **Col 3 (Marketplace)**: All Stores, Become a Supplier, Wholesale, Terms of Service.
  - **Col 4 (Newsletter)**: "Join our Bloom Club", email input with embedded arrow button, privacy disclaimer.
- **Bottom Bar**:
  - Left: "© 2026 Flower & Flora. All rights reserved."
  - Right: PayHere and payment method badge icons.

---

## 7. Product Card Anatomy & Micro-Interactions

The Signature Product Card (`ProductCard`) is the visual cornerstone of the marketplace:

```
+------------------------------------------+
|  [BADGE: SALE -20%]                      |
|                                          |
|                IMAGE                     |
|         (Hover: 2nd Image Swap)          |
|                                          |
|      +----------------------------+      |
|      | [Eye]  [Bag]  [Heart] [->] | <--- Centered Hover Action Bar
|      +----------------------------+      |
|                                          |
+------------------------------------------+
|  CATEGORY / STORE NAME                   |
|  Monstera Deliciosa Bouquet              |
|  ★★★★★ (12)                             |
|  $45.00  <s>$55.00</s>                   |
+------------------------------------------+
```

- **Card Shell**: White background, sharp `0px` radius, overflow hidden, subtle transition on border or shadow.
- **Image Container**: `1:1` square aspect ratio, background `#f8f8f8`.
  - Primary image shown by default.
  - Secondary image fades in with smooth opacity `0.4s` on card hover.
- **Badges (`top: 15px; right: 15px; position: absolute`)**:
  - Sale: `--color-gold-warm` (`#D9A85F`) or `--color-destructive`, white text, Montserrat 700, `11px` uppercase.
  - New: `--color-sage-accent` (`#6F967B`), white text.
  - Sold Out: `--color-forest-deep`, white text.
- **Hover Action Bar (`.product-hover-action`)**:
  - Hidden by default (`opacity: 0; transform: translateY(15px); pointer-events: none`).
  - On card hover: `opacity: 1; transform: translateY(0); pointer-events: auto; transition: all 0.3s ease`.
  - Row of 4 square icon buttons (`44px x 44px`):
    1. **Quick View** (eye icon) -> Opens an interactive modal dialog overlay with a mini-PDP containing the product image gallery, variant selectors, quantity stepper, and an instant "Add to Cart" button.
    2. **Add to Cart** (shopping bag) -> Instantly adds the item to the active store cart group and opens the slide-out Cart Drawer.
    3. **Add to Wishlist** (heart icon) -> Toggles item in the persisted LocalStorage wishlist with active filled red/gold heart state.
    4. **View Details** (external link icon) -> Navigates to `/products/:slug`.
  - Icon Button Hover: Background shifts to `--color-sage-accent`, white icon, with floating tooltip above.

---

## 8. Multi-Store Architecture Compatibility (OD-02)

To strictly comply with the confirmed multi-supplier business rule (**OD-02**):
1. **Store Attribution**: Every product card and detail view prominently displays its originating supplier store.
2. **Cart Grouping**: Cart drawer and cart screen group line items under distinct Store headers with separate store-level checkout actions.
3. **Checkout Independence**: Checkout operates per store; items from other stores remain safe in the cart.

---

## 9. Accessibility & Quality Targets (WCAG 2.2 AA)

- **Color Contrast**: All body text on cream background achieves `>= 4.5:1` contrast. White text on primary Deep Green `#244C3A` is `9.8:1` (AAA). White text on Sage Green `#6F967B` is `>= 4.5:1`.
- **Keyboard Navigation**: All interactive elements (hover action buttons, quantity pickers, tabs, filters, and drawers) have visible focus rings (`3px solid var(--ring)` with `2px` offset) and are fully accessible via `Tab`, `Enter`, `Space`, and arrow keys.
- **Screen Reader Support**: ARIA landmarks, `aria-expanded` on accordion filters and mobile drawers, live regions on cart counters and toast alerts, descriptive `aria-label`s on icon buttons.
- **Reduced Motion**: Respects `prefers-reduced-motion: reduce` by disabling image zoom scales and drawer translate transitions.
- **Forced Colors Mode**: Preserves border outlines and text visibility under high-contrast operating system modes.
