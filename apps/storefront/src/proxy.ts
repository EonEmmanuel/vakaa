import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { routing } from './platform/i18n/routing';
import {
    COUNTRY_COOKIE,
    CURRENCY_COOKIE,
    detectCountryFromHeaders,
    getCurrencyForCountry,
} from './platform/geolocation';

const middleware = createMiddleware(routing);

export function proxy(request: NextRequest) {
    const response = middleware(request);

    const existingCountry = request.cookies.get(COUNTRY_COOKIE)?.value;
    const existingCurrency = request.cookies.get(CURRENCY_COOKIE)?.value;

    // Optional query param for testing in development: e.g. /?geo=CI or /?geo=FR
    const geoParam =
        request.nextUrl.searchParams.get('geo') || request.nextUrl.searchParams.get('country');
    const isOverride = Boolean(geoParam && geoParam.length === 2);

    if (isOverride || !existingCountry || !existingCurrency) {
        const detectedCountry = isOverride
            ? geoParam!.toUpperCase()
            : detectCountryFromHeaders(request.headers) || 'CM';
        const suggestedCurrency = getCurrencyForCountry(detectedCountry);

        if (isOverride || !existingCountry) {
            response.cookies.set(COUNTRY_COOKIE, detectedCountry, {
                path: '/',
                maxAge: 60 * 60 * 24 * 365,
                sameSite: 'lax',
            });
        }

        if (isOverride || !existingCurrency) {
            response.cookies.set(CURRENCY_COOKIE, suggestedCurrency, {
                path: '/',
                maxAge: 60 * 60 * 24 * 365,
                sameSite: 'lax',
            });
        }
    }

    return response;
}

export const config = { matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'] };
