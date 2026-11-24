# Phase 01 — Complete Botanical Design System Foundation

Read the master prompt, design system, requirements mapping, audit output and quality gates. Implement real reusable UI foundation in the existing app.

1. Replace old presentation theme with unified semantic tokens; ensure the five fixed colors are respected. Introduce neutral/semantic/error colors only for practical UI. Map tokens to project's actual Tailwind/shadcn conventions; handle all Radix/shadcn components. Remove old conflicting global CSS *only after confirming no retained feature depends on it*.
2. Configure typography responsibly: Cormorant Garamond (editorial public display) and DM Sans (body/UI) or approved existing equivalents. Load fonts safely. Define type scales, containers, spacing, border, shadow, radius, focus/hover and motion tokens.
3. Build and visually verify shared components: button variants, icon buttons, links, labeled inputs, selects, combobox, checkbox/radio, textarea, form errors, badges, drawers, dialogs, accessible dropdown, tabs, table primitives, skeleton, empty state, errors, price formatting, images, status tags, toasts and confirm dialogs.
4. Create public, supplier and super-admin layout primitives (not full pages yet): public site shell vs compact dashboard shell, content container, headers, page headings, responsive navigation patterns, consistent breadcrumbs. Avoid mixing serif hero typography into merchant/admin tables.
5. Add consistent support for focus-visible, disabled/busy state, reduced-motion and keyboard navigation. Define reusable form field components to support React Hook Form/Zod, preserving current forms.
6. Implement an isolated internal `/dev/design-system` preview route or Storybook stories if existing tooling supports; do not publicly expose in production. Include key color pairings and all component interaction variants.
7. Verify actual text contrast. Never use sage or gold as tiny text on cream. Primary solid button deep green/cream, outlined button deep green border, understated text button, and accessible destructive button.
8. Support responsive 360/390/768/1024/1440px and avoid mobile overflow, layout shifts and broken modal focus.

**Definition of done:** new tokens and primitives are visible, theme conflicts removed, reusable shells ready, no business logic modified, real build/typecheck/lint results and visual verification documented.
