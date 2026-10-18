// Client-safe public surface of the products feature.
// Server-only components (ProductGrid) are intentionally NOT re-exported
// here: importing them through this barrel would pull server-only modules
// (next/root-params via platform/i18n/server) into client component graphs
// and break the Turbopack build. Consumers import them directly, e.g.
// '@/features/products/product-grid'.
export { ProductCard } from './components/product-card';
export { ProductCardFragment } from './graphql';
