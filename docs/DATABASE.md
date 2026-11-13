# Database reference map

Source: `references/flower-marketplace-schema.dbml` (PostgreSQL). Contains 41 tables and 19 enums.

## Tables
`users`, `roles`, `permissions`, `user_roles`, `role_permissions`, `refresh_tokens`, `login_history`, `stores`, `categories`, `store_categories`, `store_addresses`, `store_locations`, `products`, `product_attributes`, `attribute_values`, `product_variants`, `variant_option_values`, `product_images`, `inventories`, `inventory_transactions`, `carts`, `cart_items`, `wishlists`, `wishlist_items`, `orders`, `order_items`, `order_status_history`, `payments`, `payment_transactions`, `payment_webhooks`, `refunds`, `delivery_addresses`, `deliveries`, `delivery_provider_requests`, `reviews`, `review_images`, `media_assets`, `media_processing_jobs`, `notifications`, `notification_queue`, `audit_logs`.

## Important distinction
This schema is backend data modeling input, **not** a request to create browser database access or derive API endpoints. UI DTOs should follow approved OpenAPI schemas and redact sensitive fields (password hashes, refresh token hashes, payment/webhook internals, audit data).
