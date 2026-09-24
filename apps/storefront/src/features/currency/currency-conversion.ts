/**
 * Currency conversion and formatting utilities for VAKAA.
 *
 * Base operating and settlement currency is XAF (Central African CFA Franc / Franc CFA BEAC).
 * Reference rates:
 * - EUR: Statutory fixed parity peg 1 EUR = 655.957 XAF (BEAC / French Treasury agreement)
 * - USD: Standard market reference estimate 1 USD = 600.0 XAF
 */

export const XAF_TO_EUR_PEG = 655.957;
export const XAF_TO_USD_RATE = 600.0;
export const XAF_TO_NGN_RATE = 2.5; // Reference estimate: 1 XAF ≈ 2.5 NGN (1 USD ≈ 1,500 NGN)

export const ZERO_DECIMAL_CURRENCIES = new Set([
    'XAF',
    'XOF',
    'NGN',
    'JPY',
    'KRW',
    'CLP',
    'VND',
    'BIF',
    'DJF',
    'GNF',
    'KMF',
    'RWF',
    'UGX',
]);

export function isZeroDecimal(currencyCode: string): boolean {
    return ZERO_DECIMAL_CURRENCIES.has((currencyCode || 'XAF').toUpperCase());
}

/**
 * Converts a base XAF amount (in major units, e.g. 15000 FCFA) to a target reference currency.
 */
export function convertFromXaf(xafMajorAmount: number, targetCurrency: string): number {
    const target = (targetCurrency || 'XAF').toUpperCase();
    if (target === 'XAF' || target === 'XOF') {
        return xafMajorAmount;
    }
    if (target === 'EUR') {
        return xafMajorAmount / XAF_TO_EUR_PEG;
    }
    if (target === 'USD') {
        return xafMajorAmount / XAF_TO_USD_RATE;
    }
    if (target === 'NGN') {
        return xafMajorAmount * XAF_TO_NGN_RATE;
    }
    return xafMajorAmount;
}

/**
 * Formats a currency amount according to ISO rules:
 * - XAF / XOF: 0 decimal digits (e.g. "15 000 FCFA" in French, "FCFA 15,000" in English)
 * - EUR / USD: 2 decimal digits (e.g. "22,87 €" or "$25.00")
 */
export function formatMoney(amount: number, currencyCode: string = 'XAF', locale: string = 'fr-FR'): string {
    const code = (currencyCode || 'XAF').toUpperCase();
    const zeroDec = isZeroDecimal(code);

    try {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: code,
            minimumFractionDigits: zeroDec ? 0 : 2,
            maximumFractionDigits: zeroDec ? 0 : 2,
        }).format(amount);
    } catch {
        if (code === 'XAF' || code === 'XOF') {
            return `${Math.round(amount).toLocaleString(locale)} FCFA`;
        }
        if (code === 'NGN') {
            return `₦${Math.round(amount).toLocaleString(locale)}`;
        }
        return `${code} ${amount.toFixed(zeroDec ? 0 : 2)}`;
    }
}
