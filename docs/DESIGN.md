# Design system and UX specification

## Status
The client PDF pp6–7 presents **three options**, none confirmed as selected: Botanical Green, Floral Blush, Lavender Bloom. Do not present an option as approved.

## Tokens
Use CSS custom properties with semantic names (`--background`, `--foreground`, `--primary`, `--muted`, `--border`, `--destructive`, `--radius`) and map to shadcn/ui. Keep brand palette values configurable until signoff.

FE-0201 implements these in `frontend/src/shared/styles/tokens.css` with provisional neutral values. Component APIs, shell routes and validation limits are documented in `FE-0201_DESIGN_SYSTEM.md`. No palette is approved by this implementation.

FE-0202 adds forced-colors system-color boundaries for navigation, focus, buttons, invalid fields and loading skeletons. State-composition review and manual assistive-technology limits are in `FE-0202_DESIGN_SYSTEM_REVIEW.md`.

## Information architecture
Customer: discovery → store/product detail → cart → fulfilment → payment outcome → orders → review.
Supplier: overview → store profile → products/variants → inventory → orders/fulfilment → sales.
Super Admin: overview → suppliers/users → categories → orders → payments/refunds → feedback.

## Components
Shared: header, navigation, breadcrumbs, buttons, inputs, select, searchable filter, cards, image gallery, table, status badge, pagination, skeleton, empty state, error state, toast, confirmation dialog. Separate feature-specific composites from primitives.

## Accessibility
WCAG 2.2 AA target; keyboard support, focus rings, semantic landmarks, form labels and error descriptions, reduced motion, responsive touch targets, alt text, contrast verification.

## Page definition of done
Desktop/tablet/mobile; happy/loading/empty/error/permission-denied states; keyboard and screen-reader review; form validation; deterministic test selectors only when needed.
