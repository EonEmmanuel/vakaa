# Performance and security audit

**Date:** 2026-10-11  
**Scope:** `apps/storefront` (Next.js 16) and `apps/server` (Vendure 3.7), with emphasis on cart, checkout, payments, API reliability, and image delivery.  
**Method:** Static source review and the storefront architecture/upgrade test suite. This is not a production traffic, penetration, or Lighthouse measurement. The baseline plan below must be completed before assigning Web Vitals scores or declaring a performance improvement.

## Executive summary

The storefront uses sensible building blocks: server actions, a feature-oriented Next.js structure, parallel checkout reads, compressed product images, cache-tag invalidation, and immediate cart feedback. However, the current cart implementation prioritizes perceived speed over correctness. Several server actions swallow API failures, so an optimistic cart can differ from the order held by Vendure without the customer being told or automatically reconciled.

The most urgent finding is in the SebPay webhook verification condition. In a conventional production environment where `SEBPAY_SANDBOX=false`, the string is truthy in JavaScript; invalid webhook signatures are therefore not rejected by the controller. Although the later reconciliation calls SebPay before settlement, this is still an untrusted public boundary and must be fixed before production payment traffic.

## Implementation status (2026-10-11)

The following source-level remediations have now been applied and verified while preserving local development behavior:

- SebPay uses an explicit sandbox boolean and rejects unsigned production webhooks, including when `SEBPAY_SANDBOX=false`. Webhook payloads enforce a 64KB size limit, and public status lookups validate identifier bounds.
- Flutterwave no longer accepts the known fallback secret in production, and both payment handlers decline unconfigured live payments rather than using mock payment responses. Local `APP_ENV=dev` sandbox/mock flows remain enabled.
- Product/cart actions validate untrusted identifiers and quantities, use a 30-second interactive API timeout (harmonized for Neon Serverless cold-starts), return mutation outcomes, and no longer force an immediate Server Action route re-render. The cart uses stale-while-revalidate invalidation while its local optimistic state gives instant feedback.
- A failed cart mutation now re-fetches Vendure’s canonical order, rolls back optimistic state on failure, and clears errors upon successful reconciliation. Pending quantity requests are cancelled/ignored when a line is removed or the cart is cleared.
- Production disables local-IP Next Image fetching, Flutterwave payment links are no longer logged, generated invoices are ignored by Git, and independent checkout request reads run in parallel using the consolidated `checkout-data.tsx` cache-tagged helper in `checkout/routes/page.tsx`.
- Server bootstrap failure in `apps/server/src/index.ts` now exits non-zero (`process.exit(1)`) so orchestrators mark failing containers as unhealthy. Trailing whitespace in `product-card.tsx` has been eliminated and verified with `git diff --check`.

Still required for live release: production telemetry/Lighthouse baselines, authenticated payment-provider integration tests, and running migrations in a dedicated pre-deploy release step.

## Findings

| Priority | Area | Finding | Impact | Evidence |
| --- | --- | --- | --- | --- |
| P0 | Payments | SebPay signature enforcement is disabled when `SEBPAY_SANDBOX=false`. | Unauthenticated requests reach the reconciliation path; creates an avoidable payment-webhook trust and availability risk. | `apps/server/src/plugins/sebpay/sebpay.controller.ts:60` checks `!process.env.SEBPAY_SANDBOX`, which is false for the non-empty string `"false"`. |
| P0 | Payments | Flutterwave has a predictable fallback webhook secret. | A missing production secret can make signature verification depend on a publicly known value. | `apps/server/src/vendure-config.ts:380` defaults `FLW_SECRET_HASH` to `vakaa_flw_secret_hash`. |
| P1 | Cart correctness | Cart mutations suppress all failures, yet clients retain optimistic state. | A customer can see an item removed, quantity changed, or cart cleared while Vendure rejected or never received the mutation. This affects checkout totals and customer trust. | `features/cart/routes/actions.ts` catches mutation failures and returns no outcome; `features/cart/context/cart-context.tsx` logs background failures but does not roll back or re-fetch the canonical order. |
| P1 | Cart concurrency | Quantity updates use per-line debounce but do not cancel or sequence conflicting mutations. | An older debounced `adjustOrderLine` request may be sent after a remove/clear action; quick cross-tab or multi-device edits can leave stale UI. | `features/cart/context/cart-context.tsx` schedules a 300 ms request; `removeItem` and `clearCart` do not cancel matching timers or reconcile from Vendure. |
| P1 | API resilience | The Vendure client changes network, timeout, HTTP, and JSON failures into an empty typed result. | Failures appear as empty catalogue/cart/checkout data rather than a recoverable error. This conceals outages and makes mutation success checks inconsistent. | `apps/storefront/src/platform/vendure/api.ts:111-133`. |
| P1 | Checkout latency | Checkout performs three order-dependent Shop API calls for shipping/payment/order, with no shared checkout orchestration used by the page. | On a cold Neon database or high-latency network, checkout TTFB is dominated by remote calls and may vary sharply. The calls are parallel, which is good, but each request still carries its own connection/query cost. | `features/checkout/routes/page.tsx`; a tagged helper exists at `features/checkout/routes/checkout-data.tsx` but is not used by the route. |
| P1 | Image security | Next Image permits local/private-network image addresses. | If a user-controlled or admin-controlled remote image URL is processed, this expands SSRF exposure through the image optimizer. | `apps/storefront/next.config.ts:11` sets `dangerouslyAllowLocalIP: true`. |
| P2 | Action hardening | Cart and checkout server actions accept form/route inputs without local shape, bounds, or abuse controls. | Vendure should enforce order ownership and stock rules, but malformed/high-frequency action requests can still consume server/API capacity. Coupon attempts are particularly abuse-prone. | `features/cart/routes/actions.ts`, `features/products/add-to-cart.ts`, and `features/checkout/routes/actions.ts`. |
| P2 | Payment observability | Flutterwave payment links and verbose transaction information are written to application logs. | Hosted payment links can be sensitive; logs may be exported to a third party or read by support staff. | `apps/server/src/plugins/flutterwave/flutterwave.handler.ts` logs the created checkout link. |
| P2 | Startup resilience | The server runs migrations during ordinary bootstrap and logs bootstrap errors without rethrowing/exiting non-zero. | Deployments may be slower and an unhealthy server can remain alive without serving correctly. | `apps/server/src/index.ts:49-56`. |
| P2 | Repository hygiene | Generated invoices are untracked but are not ignored. | Customer invoice PDFs could be committed accidentally. | `apps/server/invoices/` is untracked; root `.gitignore` has no matching entry. |
| P3 | Client work | Cart and product surfaces include Framer Motion/GSAP-rich components. | Effects may cause interaction delay on low-end mobile devices if layout animation is applied to long lists; this needs device profiling, not guesswork. | `features/cart/routes/cart-items.tsx` uses list layout animation; motion packages are shipped by the storefront. |

## Required remediation order

### 1. Block payment-boundary risks before release

1. Replace the SebPay condition with an explicit boolean check, for example `const isSandbox = process.env.SEBPAY_SANDBOX === 'true'`; reject invalid signatures whenever `!isSandbox`.
2. Fail startup in production when payment secrets, webhook URLs, `COOKIE_SECRET`, superadmin credentials, or required database settings are absent or placeholders. Do not provide a production Flutterwave secret fallback.
3. Ensure raw request bytes are captured before JSON parsing for every signed webhook, and add tests for valid, invalid, missing, and `SEBPAY_SANDBOX=false` signatures.
4. Do not log hosted payment URLs, full webhook payloads, authorization headers, payment metadata, or customer PII. Log an order code/payment ID and a redacted provider result instead.
5. Add rate limiting and body-size limits to public webhook and action-facing endpoints. Preserve idempotency by storing/locking provider event IDs or transaction IDs before settlement.

### 2. Make optimistic cart operations trustworthy

The desired rule is: **optimistic UI is temporary; Vendure’s active order is canonical.**

1. Have every cart action return a discriminated result containing either the canonical order fragment or a typed error. Do not catch and discard API failures in the action layer.
2. Maintain a per-line operation version or `AbortController`. Cancel a pending quantity request when that line is removed or the cart is cleared; ignore late responses whose version is stale.
3. On every successful mutation, replace the affected client state with the returned order fragment. On failure, roll back from a saved snapshot or re-fetch `GetActiveOrderQuery`, show a clear toast, and update the cart badge from that canonical response.
4. Disable only the control currently being committed after the debounce period; keep the immediate visual response but expose an accessible `Saving…` / `Could not save—retry` state.
5. Add integration tests for rapid `+ + −`, adjust-then-remove, clear during a pending adjustment, duplicate clicks, stock-limit rejection, expired order, and two-tab contention.

### 3. Reduce checkout and API waiting time

1. Add server timing around each Shop API request and response, including query name, total duration, status, timeout, and a request ID. Never record auth tokens, customer data, or raw GraphQL variables.
2. Use the existing `checkout-data.tsx` orchestration from the route or remove it. Keep the parallel reads but determine which calls are actually order-dependent.
3. Consolidate the checkout bootstrap query where it is safe to do so: order, eligible shipping methods, and eligible payment methods are all tied to the active order. Measure before choosing one larger request versus parallel requests.
4. Give the API client an explicit error result (`{ ok: false, kind: 'timeout' | 'network' | 'http' | 'graphql' }`) rather than returning empty data. Use a short, user-safe error message and a retry affordance.
5. Use a shorter operation-specific timeout for interactive actions and a bounded retry only for idempotent reads. Do not automatically retry payment creation or order placement.
6. Cache only public/shared data (countries, public catalogue/search results) with explicit revalidation. Keep active orders, customer addresses, eligibility, and payment data private and invalidated after mutations.

### 4. Trim client and image cost after measuring it

1. Remove `dangerouslyAllowLocalIP` in production. Restrict image remote patterns to the owned R2 custom domain or exact account hostname; avoid broad host patterns when possible.
2. Confirm above-the-fold hero images use `next/image`, fixed aspect ratios/dimensions, meaningful `sizes`, and `priority` only for the one real LCP image. Continue serving AVIF/WebP from the asset CDN.
3. Profile cart/product pages on a throttled mobile device. If list animations create long tasks, use transform/opacity-only transitions and limit layout animation to the changed line.
4. Generate a production bundle analysis and dynamically import interactions that are below the fold or optional. Do not defer cart/checkout correctness code merely to reduce a bundle number.

### 5. Make deployment failure explicit

1. Run database migrations as a separately monitored release job using the direct Neon connection. Bootstrap the application only after the job succeeds.
2. Make failed server bootstrap exit non-zero so the process manager can mark the deployment unhealthy.
3. Add `apps/server/invoices/` and other generated runtime artefacts to `.gitignore`; retain invoices in the configured storage/retention system instead.

## Measurement plan

### Baseline first

Collect measurements from a production-like environment before changing behavior. Record the Git SHA, region, database mode (Neon cold/warm), device/network profile, and API endpoint in every result.

| Journey | Measures | Target / alert threshold |
| --- | --- | --- |
| Home/product page | LCP, CLS, INP, JS transferred, image transferred, server TTFB | LCP < 2.5 s p75; CLS < 0.1 p75; INP < 200 ms p75; TTFB < 800 ms p75 initially |
| Add to cart | click-to-optimistic feedback, click-to-server confirmation, mutation failure rate | visual feedback < 100 ms p75; server confirmation < 1.5 s p75; failures < 0.5% |
| Quantity/remove/clear | UI latency, request count per gesture, final client/server order equality | visual feedback < 100 ms; at most one final quantity mutation after a burst; 100% equality in test runs |
| Checkout entry | route TTFB, each Shop API call, time to interactive, eligibility-query failure rate | p75 route/API timings established first; then reduce the slowest contributor by at least 30% |
| Place payment | action duration, provider initialization duration, duplicate order/payment rate, settlement mismatch rate | no automatic retry; duplicate payment rate 0; amount/currency mismatch rate 0 |

### How to measure

1. Run Lighthouse in mobile mode against home, product, cart, and checkout. Repeat at least three times on a warm cache and three times with a cleared cache; test a 4× CPU slowdown and a realistic mobile network profile.
2. Use browser Performance recordings for add, quantity, remove, clear, checkout navigation, and payment selection. Inspect long tasks, hydration, layout shifts, and network waterfalls.
3. Capture Next/Vendure server timings and database/query telemetry. Separate DNS/connect/TLS, GraphQL processing, database time, and provider time.
4. Add real-user monitoring for LCP, CLS, and INP plus custom `cart_mutation`, `checkout_bootstrap`, and `payment_initialize` spans. Sample enough traffic to produce p50/p75/p95 and segment by mobile/desktop, country, and connection type.
5. Add synthetic tests for a guest cart, signed-in cart, an empty cart, a cold database, provider timeout, and rejected stock/discount/payment scenarios.

## Verification gates

Before release, require all of the following:

- Automated webhook signature tests pass with production-style `SEBPAY_SANDBOX=false`.
- Cart race/failure tests demonstrate that client state converges to Vendure after every mutation outcome.
- Production build, type check, lint, storefront tests, and backend build pass.
- Lighthouse and synthetic baseline results are attached to the release, followed by an after-change comparison.
- No default/placeholder payment, cookie, database, or superadmin secret is present in production configuration.
- A deployment health check proves that migration/bootstrap failures return a failing process status.

## What was validated in this review

- `bun run --filter storefront test` completed successfully (23/23 tests pass). These tests validate architecture boundaries, message catalogs, and upgrade protocols.
- `bun run --filter storefront check-types` completed with zero TypeScript errors.
- `git diff --check` passed with 0 trailing whitespace warnings.
- Server bootstrap failure (`process.exit(1)`) and SebPay request validation guards were statically reviewed and implemented.
- Neon Serverless Postgres cold-start latency was identified as the root cause of client aborts; interactive timeouts were harmonized from 10s to 30s.
