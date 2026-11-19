# Flower & Flora Design System & Modern UX Specification

## 1. Vision & Modern Architectural Philosophy

Flower & Flora is a modern, high-end multi-supplier marketplace for luxury floristry, fresh bouquets, and botanical lifestyle products. This design specification translates the 5 reference screenshots from the **Florial** Shopify theme (`https://wpbingo-florial.myshopify.com/`) into an ultra-modern, production-quality frontend grounded in our approved **Botanical Green (Fresh & Natural)** palette.

### Core Principles
- **Curated Photorealistic Botanical Imagery**: Replaces abstract SVG vector shapes with curated, high-resolution floral bouquet photography featuring transparent cutout backgrounds, realistic soft drop shadows, and authentic florist model portraiture.
- **Fluid Modern Micro-Interactions**: Powered by `motion` (Framer Motion) for hardware-accelerated drawer transitions, subtle card hover zooms (`scale(1.04)`), smooth accordion collapses, and page route transitions.
- **Modern Minimal Iconography**: Uses `lucide-react` for crisp, feather-weight line icons (shopping bag, heart, eye, truck, shield, gift, pin, phone, stars, search) matching the luxury editorial look.
- **Organic Geometry**: 50% circular category masks with delicate borders, rounded pill CTA buttons and search bars (`border-radius: 9999px`), and soft `8px`–`12px` card curvature.
- **Multi-Supplier Architecture (OD-02)**: Subtle boutique store attribution badges ("Crafted by: Store Name") on cards and PDP; independent per-store cart grouping and checkout in the slide-out Cart Drawer.

---

## 2. Design Tokens & Color Palette

### 2.1 Botanical Green Color Tokens

| Token Name | Hex Code | Role & UI Application |
|:---|:---|:---|
| `--color-forest-deep` | `#244C3A` | **Primary Brand Color**: H1–H6 headlines, primary pill buttons, active tabs, brand wordmark, sticky nav highlights |
| `--color-sage-accent` | `#6F967B` | **Secondary Brand Color**: Button hover states, secondary actions, category active rings, store attribution links |
| `--color-mint-soft` | `#B7CDB5` | **Soft Mint / Border**: Delicate card borders, circular category outlines, subtle dividers, active ring halos |
| `--color-cream-warm` | `#F5F3E9` | **Canvas / Background**: Page backdrop, hero background tint, order summary backing, benefit card backing |
| `--color-gold-warm` | `#D9A85F` | **Luxury Accent / Gold**: 5-star customer reviews, Sale % discount flags, urgency countdown highlights |
| `--color-forest-text` | `#1A3629` | **Body Foreground**: High-contrast, readable dark botanical green for paragraph copy and labels |
| `--color-forest-muted` | `#5A6B60` | **Muted Copy**: Secondary labels, category tags, SKU notes, metadata, footer links |
| `--color-white` | `#FFFFFF` | **Pure White**: Product cards, modal surfaces, inputs, sticky header background |
| `--color-destructive` | `#B33A3A` | **Destructive / Error**: Form errors, remove action, out-of-stock badges |
| `--color-success` | `#2D6A4F` | **Success / In-Stock**: In-stock live pulse indicator, verified supplier badge, order confirmation |

### 2.2 Semantic CSS Variables (`tokens.css`)

```css
:root {
  /* Brand Palette */
  --color-forest-deep: #244c3a;
  --color-sage-accent: #6f967b;
  --color-mint-soft: #b7cdb5;
  --color-cream-warm: #f5f3e9;
  --color-gold-warm: #d9a85f;
  --color-forest-text: #1a3629;
  --color-forest-muted: #5a6b60;
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
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 14px;
  --radius-pill: 9999px;
  --radius-circle: 50%;
  --radius: var(--radius-md);

  /* Elevation Shadows */
  --shadow-sm: 0 2px 6px rgba(36, 76, 58, 0.05);
  --shadow-md: 0 6px 20px rgba(36, 76, 58, 0.08);
  --shadow-lg: 0 16px 36px rgba(36, 76, 58, 0.12);
  --shadow-hover: 0 10px 28px rgba(36, 76, 58, 0.14);

  /* Typography */
  --font-heading: 'Marcellus', Georgia, serif;
  --font-body: 'Poppins', system-ui, -apple-system, sans-serif;
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
  --text-4xl: 2.25rem;
  --text-5xl: 3rem;
  --text-hero: 4rem;

  /* Layout */
  --content-width: 1440px;
  --content-wide: 1770px;
  --space-gutter: 30px;
  --section-padding-y: 80px;
}
```

---

## 3. Page Specifications (Faithfully Matching the 5 Uploaded Screenshots)

### 3.1 Homepage (`/`) — Reference Screenshot 5
1. **Editorial Hero Slider**:
   - High-resolution editorial photography of a florist model holding a lush bouquet of white fresh tulips against a soothing pastel backdrop.
   - Small-caps kicker: `VALENTINE DAY`.
   - Title: `Fresh Flower Feeling Love` in 56px `Marcellus`.
   - Primary CTA: Pill outline button `SHOP NOW >` with hover fill.
2. **4-Item Service Guarantees Bar**:
   - Clean horizontal row with delicate Lucide line icons:
     * *Free Shipping* (Truck icon)
     * *24/7 Support* (Headphones icon)
     * *Gift Package* (Gift box icon)
     * *Secure Payment* (Shield lock icon)
3. **Asymmetric 3-Column Banner Grid**:
   - 3 photographic floral cards: *"Spring Collection"*, *"Simple & Elegant"*, *"Summer Loving"*.
   - Smooth image scale on hover (`scale(1.08)`) with underlined "Discover Now" links.
4. **Hot Categories (Circular Showcase)**:
   - Section heading with delicate botanical leaf accent.
   - 4 large circular photo cards (`border-radius: 50%`, `160px x 160px`):
     * *Bespoke* (Custom artisan arrangements)
     * *Birthday* (Celebration bouquets)
     * *Next Day* (Express local delivery)
     * *Plant* (Curated indoor potted plants)
   - Hover zoom within circular mask and active Sage Green border ring.
5. **Mid-Page Birthday Bouquets Spotlight Banner**:
   - 2-column split banner: Left warm olive/sage card with "SPECIAL COLLECTION / BIRTHDAY BOUQUETS: Vibrant yellow daffodils and roses..." + "SHOP NOW"; Right photo of florist holding bright yellow bouquet.
6. **Shop Best Sellers (4-Column Product Grid)**:
   - Section title with pink/accent center line marker.
   - 4-column product grid featuring real cutout bouquet photography on pure white cards.
   - Each card: Discount pill badge (`-6%`, `-21%`), title, gold review stars, sale price + strikethrough compare price, color swatches, size selector (S, M, L), and inline quantity stepper `[- 1 +]` with quick Add-to-Bag icon.
7. **Flower Subscriptions Section**:
   - Warm blush/cream banner with floral border texture and title "Flower Subscriptions".
   - 3 subscription frequency cards: *Weekly Subscription*, *Bi-Weekly Subscription*, *Monthly Subscription*.
8. **Our Blog & Editorial Stories**:
   - 3-column articles with floral photography and date tags.
9. **4-Column Modern Footer**:
   - Columns: ABOUT US, HELP, LOCAL, OUR NEWSLETTER with email input, submit button, social links (f, x, instagram, tiktok), copyright, and payment method badges.

### 3.2 Products / Collection Catalog (`/products`) — Reference Screenshot 3
1. **Hero Banner**:
   - Soft pastel blush background featuring a real cutout photograph of a smiling model with straw hat holding a vibrant bouquet of flowers.
   - Large `Marcellus` title "Products" and breadcrumbs "Home / Products".
   - 4 circular category icon buttons under title: "BESPOKE", "BIRTHDAY", "NEXT DAY", "PLANT".
2. **Left Filter Sidebar (Sticky Desktop, Off-Canvas Mobile)**:
   - COLLECTIONS (Bespoke (12), Birthday (8), Next Day (9), Plant (8), Wedding (7)).
   - AVAILABILITY (In stock (27), Out of stock (3)).
   - PRICE (Dual-handle range slider with active price indicators).
   - SIZE (S, M, L, XL pills with count badges).
   - BRAND / STORES (Multi-supplier store filter).
   - COLOR (Circular/square swatches with color names and count badges: Orange, Pink, Purple, Red, White, Yellow).
   - FEATURE PRODUCT (Miniature sidebar product cards with thumbnail and price).
3. **Product Grid Toolbar**:
   - "You've viewed X of Y products" counter.
   - 2-col, 3-col, 4-col layout mode switchers.
   - Sorting dropdown ("Alphabetically: A-Z", "Price: Low to High", "Price: High to Low", "Best Selling").
4. **3-Column Product Grid**:
   - Real cutout bouquet photography with soft natural drop shadows.
   - Badges, ratings, swatches, inline quantity stepper `[- 1 +]`, and Add-to-Bag button.
5. **Numerical Pagination**: Soft rounded pagination buttons (`1`, `2`, `>`).

### 3.3 Product Details Page (PDP) (`/products/:slug`) — Reference Screenshot 2
1. **Breadcrumbs**: `Home / Bespoke / Product Name`.
2. **2-Column Split Hero**:
   - **Left Gallery**:
     * Far-left vertical 5-thumbnail selector strip.
     * Large square high-resolution zoomable main photo.
     * Discount flag badge (`-6%`) on top right of the photo.
   - **Right Buy Box**:
     * 5 gold review stars + review count link.
     * Product title in `Marcellus` `32px`.
     * Price comparison: Strikethrough original price + highlighted sale price in Deep Green / Accent.
     * Live social proof badges:
       - Eye icon: *"12 people are viewing this right now"*
       - Fire icon: *"16 sold in last 6 hours"*
       - Green checkmark: *"In stock - ready to ship"*
     * Short botanical description.
     * Color selection with circular swatches.
     * Size selection with pills (`S`, `M`, `L`, `XL`) + "Size Guide" ruler link.
     * Stock urgency progress bar: *"Only 10 item(s) left in stock!"*.
     * Quantity stepper `[- 1 +]` + full-width `ADD TO CART` button + Wishlist heart button.
     * "I agree with the Terms and conditions" checkbox.
     * Secondary dynamic `BUY IT NOW` button.
     * Quick actions: Compare, Ask Question, Shipping info, Share.
     * Estimated Delivery widget: Truck icon: *"Order in the next 12 hours to get it between Nov 26 and Nov 29"*.
     * "Buy more save more!" volume pricing discount box.
     * "Pickup available at Bloom Store - Ready in 24 hours".
     * "Frequently Bought Together" upsell bundle box with thumbnail and add button.
     * Guaranteed Checkout badge row: VISA, Mastercard, Amex, Stripe, Shopify.
3. **Information Tabs**:
   - Horizontal tabs: *Description*, *Review*, *Shipping*, *Return*.
   - Active tab with solid underline.
4. **Related Products**: 4-column product grid with real floral images and inline buy controls.

### 3.4 About Us Page (`/about`) — Reference Screenshot 4
1. **Header Banner**: High-resolution flat-lay floral background (daisies, lavender petals on soft blue backdrop) with white `Marcellus` title "About Us" and breadcrumbs.
2. **Story Section**:
   - Left: "Visit Our Beautiful Showroom!" with narrative text.
   - Right: Real photo of a smiling florist holding fresh white lilies giving a thumbs up.
3. **3-Card Value Proposition Feature Row**:
   - 3 clean white cards with circular icon badges:
     * *10% OFF + FREE SHIPPING*
     * *FRESH BLOOMS*
     * *SUPER FLEXIBLE*
4. **Florist Team / Model Portraits**:
   - 3-column portrait grid of smiling florists holding bouquets (peonies, tulips, mixed daisies).
5. **Testimonials Carousel**:
   - "Testimonials" in serif.
   - 3 quote cards with customer avatars and names ("ANN SMITH", "ARIANNA DOE", "JANE CLINTON").
6. **Lifestyle Arrangement Gallery**: 4 square photos of florists arranging blooms.

### 3.5 Contact Us Page (`/contact`) — Reference Screenshot 1
1. **Header**: "Contact" with clean breadcrumbs.
2. **Interactive Location Map**: Centered modern map with soft rounded corners.
3. **Help Information Row**:
   - Centered rose botanical emblem + "Need Help?".
   - 3 clean columns: PHONE, CUSTOMER SERVICE, RETURNS.
4. **"Send Us Your Questions!" Form**:
   - Soft pastel green card framed by baby's breath floral sprays on the left and right borders.
   - 2-column input row (Name*, Email*) with clean white inputs.
   - Large Message textarea.
   - Outline pill `SUBMIT` button with hover fill.

---

## 4. Multi-Store Architecture Compatibility (OD-02)

To strictly adhere to marketplace business rules:
- Every product card and PDP shows the originating artisan florist ("Crafted by: Bloom & Blossom").
- The slide-out Cart Drawer and Cart Page group items into distinct store sections with independent per-store checkout triggers.
