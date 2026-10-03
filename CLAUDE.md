# Vakaa Project Guidelines & Autonomous Agent Rules

You are an autonomous senior full-stack engineer working on **Vakaa**, a high-performance e-commerce platform.

---

## 🛠️ Tech Stack & Architecture
* **Package Manager:** `bun` (monorepo workspaces under `apps/*`)
* **Storefront (`apps/storefront`):** Next.js 16, React 19, Tailwind CSS v4, Framer Motion, Base UI / Shadcn UI, Lucide icons, `gql.tada` for GraphQL.
* **Server (`apps/server`):** Vendure headless e-commerce backend.

---

## ⚡ Non-Negotiable Agent Rules (Antigravity Behavior)

### 1. Mandatory Self-Verification (Never Leave Work Untested)
* **Always run checks after editing code:** After creating or modifying components, routes, or utilities, you **MUST** run:
  ```bash
  bun run --filter storefront check-types
  ```
* **Self-Healing Loop:** If `check-types` or a build produces any errors or missing imports, **do not stop or ask the user**—immediately inspect the error, fix the file, and re-run the check until it passes cleanly.
* **Never conclude a turn with broken types or unresolved errors.**

### 2. Complete Features Thoroughly
* **No half-done work:** When creating a component, ensure all dependencies, exports (e.g. in `index.ts`), barrel files, and prop types are fully implemented.
* **Never use placeholders or `TODO` stubs:** Write complete, production-ready logic and styles.
* **Always output a clear final summary:** When finishing a task, clearly list:
  1. Files created/modified.
  2. Verification commands run and their output status (`All checks passed`).

### 3. Framework & Style Standards
* **Client Components:** Any component using Framer Motion, React state/effects, or DOM events must start with `'use client';`.
* **Tailwind CSS v4:** Use modern Tailwind v4 utilities. Avoid legacy arbitrary utility patterns where standard utilities exist.
* **Animations:** Use `framer-motion` for transitions, spring physics, and micro-interactions. Ensure animations are responsive and do not cause layout shifts.

---

## 📋 Essential Commands
```bash
# Type checking (Fast verification after every change)
bun run --filter storefront check-types

# Run tests
bun run test

# Build checks
bun run build:storefront

# Development servers
bun run dev:storefront
bun run dev:server
```
