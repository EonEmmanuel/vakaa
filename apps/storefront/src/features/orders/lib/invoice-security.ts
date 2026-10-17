import crypto from 'crypto';

const INVOICE_SECRET =
    process.env.INVOICE_SECRET ||
    process.env.COOKIE_SECRET ||
    process.env.REVALIDATION_SECRET ||
    'vakaa-haute-couture-invoice-signature-key-2026';

/**
 * Generates a cryptographic HMAC-SHA256 signature for an order invoice.
 * Binds orderCode and customerEmail into a secure 32-character hex token,
 * eliminating the need to expose customer email PII in public URLs.
 */
export function generateInvoiceToken(orderCode: string, customerEmail?: string): string {
    const normalizedCode = (orderCode || '').trim().toUpperCase();
    const normalizedEmail = (customerEmail || '').trim().toLowerCase();
    const payload = `${normalizedCode}:${normalizedEmail}`;
    return crypto
        .createHmac('sha256', INVOICE_SECRET)
        .update(payload)
        .digest('hex')
        .slice(0, 32);
}

/**
 * Validates the HMAC token using timing-safe comparison to prevent side-channel timing attacks.
 */
export function verifyInvoiceToken(
    orderCode: string,
    customerEmail: string | undefined,
    token: string | null | undefined
): boolean {
    if (!token || typeof token !== 'string') return false;
    const expected = generateInvoiceToken(orderCode, customerEmail);
    if (token.length !== expected.length) return false;

    try {
        return crypto.timingSafeEqual(Buffer.from(token, 'utf-8'), Buffer.from(expected, 'utf-8'));
    } catch {
        return false;
    }
}
