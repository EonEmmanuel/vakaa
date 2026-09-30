import { cookies, headers } from 'next/headers';

/**
 * Geolocation & regional currency mapping for VAKAA.
 *
 * Base boutique currency is XAF.
 * Regional corridors supported by Flutterwave & boutique operations:
 * - Central African Franc (XAF): Cameroon, Gabon, Congo, Chad, CAR, Eq. Guinea
 * - West African Franc (XOF): Côte d'Ivoire, Senegal, Benin, Burkina Faso, Mali, Niger, Togo, Guinea-Bissau
 * - Nigerian Naira (NGN): Nigeria
 * - Euro (EUR): European Union
 * - US Dollar (USD): Global Americas & International
 */

export const COUNTRY_COOKIE = 'vakaa-country';
export const CURRENCY_COOKIE = 'vendure-currency';

export const XAF_COUNTRIES = new Set(['CM', 'GA', 'CG', 'CF', 'TD', 'GQ']);
export const XOF_COUNTRIES = new Set(['CI', 'SN', 'BJ', 'BF', 'ML', 'NE', 'TG', 'GW']);
export const EUR_COUNTRIES = new Set([
    'FR', 'DE', 'IT', 'ES', 'BE', 'NL', 'PT', 'AT', 'IE', 'FI', 'LU', 'GR', 'MC', 'AD'
]);

export function getCurrencyForCountry(countryCode?: string | null): string {
    if (!countryCode) return 'XAF';
    const upper = countryCode.toUpperCase();

    if (XAF_COUNTRIES.has(upper)) return 'XAF';
    if (XOF_COUNTRIES.has(upper)) return 'XOF';
    if (upper === 'NG') return 'NGN';
    if (EUR_COUNTRIES.has(upper)) return 'EUR';

    // All other African countries (Kenya, Ghana, Uganda, Rwanda, South Africa, etc.)
    // and international visitors (US, CA, GB, etc.) default to USD
    return 'USD';
}

/**
 * Extracts the 2-letter ISO country code from standard reverse-proxy headers.
 */
export function detectCountryFromHeaders(requestHeaders: Headers): string | null {
    // Vercel Edge
    const vercelCountry = requestHeaders.get('x-vercel-ip-country');
    if (vercelCountry && vercelCountry.length === 2) {
        return vercelCountry.toUpperCase();
    }

    // Cloudflare
    const cfCountry = requestHeaders.get('cf-ipcountry');
    if (cfCountry && cfCountry.length === 2 && cfCountry !== 'XX' && cfCountry !== 'T1') {
        return cfCountry.toUpperCase();
    }

    // Generic proxy headers
    const genericCountry = requestHeaders.get('x-country-code') || requestHeaders.get('geoip-country-code');
    if (genericCountry && genericCountry.length === 2) {
        return genericCountry.toUpperCase();
    }

    return null;
}

/**
 * Server-side helper to get the customer's active or detected country code.
 * Reads the 'vakaa-country' cookie first; falls back to incoming headers or 'CM'.
 */
export async function getDetectedCountry(): Promise<string> {
    try {
        const cookieStore = await cookies();
        const cookieCountry = cookieStore.get(COUNTRY_COOKIE)?.value;
        if (cookieCountry && cookieCountry.length === 2) {
            return cookieCountry.toUpperCase();
        }
    } catch {
        // Fallback if cookies() unavailable in current context
    }

    try {
        const headerStore = await headers();
        const headerCountry = detectCountryFromHeaders(headerStore);
        if (headerCountry) {
            return headerCountry;
        }
    } catch {
        // Fallback if headers() unavailable
    }

    // Default to Cameroon (boutique base country)
    return 'CM';
}
