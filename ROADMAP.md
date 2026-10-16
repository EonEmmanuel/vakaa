# Vakaa Storefront Upgrade Roadmap & Status

This document tracks the phased upgrade of the Vakaa storefront to premium production quality.

---

## 🛠️ Architecture & Non-Negotiable Rules
* **Monorepo:** `bun` workspaces (`apps/storefront`, `apps/server`).
* **Stack:** Next.js 16 (App Router with `next-intl`), React 19, Tailwind CSS v4, Framer Motion, GSAP 3.12+, Base UI / shadcn primitives, Vendure GraphQL (`gql.tada`).
* **Verification:** Run `bun run --filter storefront check-types` after any file change. Zero broken types.
* **No Claude.ai Artifacts:** Always write HTML files, preview tools, and checkers directly to disk using `Write`.

---

## ✅ Completed Phases

### Phase 1: Semantic Tokens & Motion System
* `globals.css`: Extended with semantic checkout tokens, gold contrast fix (`#B8860B`), motion variables.
* `lib/motion/tokens.ts`: Centralized duration and easing curves.
* `lib/motion/framer-variants.ts`: 15+ reusable animation variants.
* `lib/motion/gsap-hooks.ts`: SSR-safe, `gsap.context` cleaned, `prefers-reduced-motion` aware hooks (`useGsapMagnetic`, `useGsapTilt`, `useGsapFloating`, `useGsapContinuousRotation`).
* `lib/motion/reduced-motion.ts`: Accessibility motion helper utilities.

### Phase 2: Design System & Checkout Architecture
* Unified `components/ui/skeleton.tsx` (all variants) and `components/ui/empty-state.tsx`.
* Reusable `components/ui/form-field.tsx` (RHF Controller + Zod v4 validation).
* Refactored checkout flow into modular registry:
  * `features/checkout/steps/index.ts` (registry)
  * `features/checkout/steps/CheckoutStepShell.tsx` (accordion + GSAP magnetic indicator)
  * `features/checkout/routes/checkout-flow.tsx` (streamlined to ~100 lines)
  * Step components: `contact-step.tsx`, `shipping-address-step.tsx`, `delivery-step.tsx`, `payment-step.tsx`, `review-step.tsx`.

### Phase 3: Premium GSAP Interactions
* `features/products/components/product-card.tsx`: Added `useGsapTilt` (4° max, 1.01x scale) + `useGsapMagnetic` (0.15 strength) on wishlist button.
* `features/products/components/product-image-carousel.tsx`: Added `useGsapMagnetic` (0.1 strength) on navigation buttons.
* `components/ui/button.tsx`: Added `magnetic` boolean prop wired to `useGsapMagnetic`.
* Verified: `bun run --filter storefront check-types` passes cleanly.

### Phase 4: Accessibility & Contrast Audit ✅ **COMPLETED**
1. **Contrast Verification:** Created standalone local `./contrast-checker.html` to verify key brand colors (gold `#B8860B` on white/dark for 4.5:1 WCAG AA). ✅
2. **ARIA Enhancements:** Added `aria-current="step"`, `aria-live` regions for cart updates and step announcements, and robust accessible names across checkout steps and cart. ✅
3. **Focus Management:** Smooth keyboard focus trapping and step transitions in the accordion shell via proper `aria-disabled`, `aria-controls`, `aria-labelledby`, `aria-describedby` attributes. ✅
4. **Reduced Motion:** All GSAP and Framer Motion transitions respect user OS preferences via `prefers-reduced-motion` media query. ✅

### Phase 4.5: Action Latency & Network Bottleneck Resolution ✅ **COMPLETED**
1. **Atomic Cart Clear (`clearCart`):** Replaced N sequential line-item mutations with Vendure's single atomic `removeAllOrderLines` mutation.
2. **Optimistic Cart Quantity Stepper (`CartItemQuantity`):** Extracted debounced client component (300ms window) with 0ms visual state response.
3. **Eliminated Checkout Step Double-Render Waterfall:** Removed redundant `router.refresh()` calls after server actions across shipping, delivery, and contact steps.
4. **Guest Customer Query Tax Removal:** Added `if (!token) return null;` in `getActiveCustomer()` to eliminate an unauthenticated GraphQL round-trip on every page view.
5. **Homepage Best Sellers Caching:** Added Next.js `'use cache'`, `cacheLife('hours')`, and `cacheTag('products')` to `getBestSellerProducts`.
6. **GraphQL AST Print Memoization:** Memoized `print(document)` strings in `api.ts` with `WeakMap` cache.
7. **Buffered Search Indexing in Vendure:** Configured `bufferUpdates: true` on `DefaultSearchPlugin` so order placement is never blocked by synchronous search re-indexing over WAN.

---

## ⏳ Pending Phases

### ⏳ Phase 5: Cart Drawer & Remaining Micro-Interactions
* Slide-out cart drawer with tactile spring motion.
* Visual fly-to-cart confirmation enhancements.

### ⏳ Phase 6: Predictive Search & URL State Persistence
* Debounced predictive search with animated dropdown.
* URL state persistence for filters and pagination.