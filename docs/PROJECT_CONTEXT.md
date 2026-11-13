# Project context

## Verified client intent
Flower & Flora E-Commerce Platform: customers discover and buy floral products from registered suppliers; supplier/store management and super-admin oversight. Source: `references/client-feature-document.pdf`, pp. 1–5.

## Actors
Customer; Supplier / Store; Super Admin. Separate navigational shells, shared design primitives and access-aware routes.

## Core workflows
Browse stores and products; cart/checkout; delivery or store pickup; payment outcome and order history; post-delivery feedback; supplier profile/catalog/inventory/order management; super-admin supplier approval, categories, order/payment/refund oversight and moderation.

## External integrations
Uber Connect, PickMe Flash, online payment gateway, AWS S3 and n8n image background removal are mentioned, but provider eligibility/contracts and service costs remain unresolved. Frontend integrates only through approved backend APIs.

## Deadline
Target 2026-12-25, contingent on final scope, feedback and third-party availability.

## Constraints
Frontend-first build; backend API not provided. DBML provides conceptual data vocabulary, not wire formats. Client provided three palette options but did not approve one in the source.
