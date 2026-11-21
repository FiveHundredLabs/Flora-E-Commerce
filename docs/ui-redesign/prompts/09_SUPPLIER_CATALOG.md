# Phase 09 — Supplier Products, Variant Inventory and Flora Image Processing

Implement operational product management, not a static mock catalogue.

## Catalog list and editing
- Products table with thumbnail, name, status, price/price range, variant count, stock indicator and approved actions; responsive filters/search/sorting/pagination only as supported.
- Product create/edit layout with well-grouped sections: basic content, media, options/variants, price, availability/locations. Use typed form validation, dirty-state confirmation and safe save error handling. Products have **no product categories**.
- Variant builder for supported size/color/wrapping/add-on dimensions. Avoid combinatorial UI overload: group option types logically, generate or edit only valid variant combinations according to backend model. Show pricing and identifiers with clear distinction between an option and a sellable SKU.
- Inventory matrix by sellable variant × store location, with stock/available values and server-side validation. No optimistic stock changes without rollback and no editing for unauthorized supplier/location.

## Background removal lifecycle
- Authorized supplier or admin uploads image; integrate only via existing backend-signed upload endpoints for original to S3.
- Show original preview, uploading state, server-queued/processing n8n workflow state, processed preview, failure message and allowed retry/remove actions if supported.
- Fetch processed image via backend-authorized asset URLs or approved public assets. Never call n8n endpoints with secrets from the browser, never expose S3 credentials.
- If API only supports final URLs, build honest intermediate states from what's available; **do not fake progress percentages or job status**.
- Use good file-type/size constraints derived from actual backend, preview cleanup and screen reader announcements.

**Tests:** create/edit validation, variant selection and stock location correctness, upload failure/retry, pending processed image, 403 authorization, empty products and narrow mobile screens.
