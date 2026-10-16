import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Normalizes asset URLs from Vendure / Cloudflare R2:
 * - Fixes backslashes on Windows platforms (assets\preview\... -> assets/preview/...)
 * - Fixes missing slash in R2 domain prefixes (.r2.devpreview/... -> .r2.dev/preview/...)
 * - Normalizes protocol or relative URLs
 */
export function normalizeAssetUrl(url?: string | null): string {
  if (!url) return '';
  if (url.includes('my-shop.com') || url.includes('example.com')) return '';
  let normalized = url.replace(/\\/g, '/');
  if (normalized.includes('.r2.devpreview/')) {
    normalized = normalized.replace('.r2.devpreview/', '.r2.dev/preview/');
  } else if (normalized.includes('.r2.dev') && !normalized.includes('.r2.dev/')) {
    normalized = normalized.replace('.r2.dev', '.r2.dev/');
  }

  const serverPort = process.env.PORT || '3000';
  const vendureHost =
    process.env.NEXT_PUBLIC_VENDURE_HOST ||
    process.env.NEXT_PUBLIC_VENDURE_SHOP_API_URL?.replace(/\/shop-api\/?$/, '') ||
    (process.env.NODE_ENV === 'production' ? 'https://api.vakaa.online' : `http://localhost:${serverPort}`);

  // Reroute inaccessible R2 dev URLs to the Vendure asset server
  if (normalized.includes('.r2.dev/')) {
    const parts = normalized.split('.r2.dev/');
    const afterR2 = parts[1];
    if (afterR2) {
      return `${vendureHost.replace(/\/$/, '')}/assets/${afterR2.replace(/^\//, '')}`;
    }
  }

  // Rewrite localhost:3000 URLs to the live backend host in production
  if (normalized.includes('localhost:3000') || normalized.includes('127.0.0.1:3000')) {
    if (process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_VENDURE_HOST || process.env.NEXT_PUBLIC_VENDURE_SHOP_API_URL) {
      normalized = normalized.replace(/^https?:\/\/(localhost|127\.0\.0\.1):3000/, vendureHost.replace(/\/$/, ''));
    }
  }

  // Rewrite relative asset paths
  if (normalized.startsWith('/assets/')) {
    normalized = `${vendureHost.replace(/\/$/, '')}${normalized}`;
  }

  return normalized;
}
