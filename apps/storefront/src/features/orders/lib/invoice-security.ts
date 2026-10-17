import crypto from 'crypto';

const INVOICE_SECRET =
    process.env.INVOICE_SECRET ||
    process.env.COOKIE_SECRET ||
    process.env.REVALIDATION_SECRET ||
    'vakaa-haute-couture-invoice-signature-key-2026';

function getKey(): Buffer {
    return crypto.createHash('sha256').update(INVOICE_SECRET).digest();
}

/**
 * Generates an authenticated encrypted token (AES-256-GCM) for an order invoice.
 * Securely seals orderCode and customerEmail into an opaque URL-safe token.
 * Zero cleartext PII is exposed in URLs or browser history.
 */
export function generateInvoiceToken(orderCode: string, customerEmail?: string): string {
    const normalizedCode = (orderCode || '').trim().toUpperCase();
    const normalizedEmail = (customerEmail || '').trim().toLowerCase();
    const text = `${normalizedCode}:${normalizedEmail}`;

    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', getKey(), iv);
    const enc = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return Buffer.concat([iv, tag, enc]).toString('base64url');
}

/**
 * Decrypts and verifies the AEAD token against the orderCode.
 * Returns the customer's email address if valid and untampered, or null if invalid.
 */
export function extractCustomerEmailFromToken(
    orderCode: string,
    token: string | null | undefined
): string | null {
    if (!token || typeof token !== 'string') return null;
    try {
        const buf = Buffer.from(token, 'base64url');
        if (buf.length < 28) return null; // 12 iv + 16 tag
        const iv = buf.subarray(0, 12);
        const tag = buf.subarray(12, 28);
        const enc = buf.subarray(28);

        const decipher = crypto.createDecipheriv('aes-256-gcm', getKey(), iv);
        decipher.setAuthTag(tag);
        const decrypted = Buffer.concat([decipher.update(enc), decipher.final()]).toString('utf8');
        const [code, ...emailParts] = decrypted.split(':');
        const email = emailParts.join(':');

        if ((code || '').trim().toUpperCase() !== (orderCode || '').trim().toUpperCase()) {
            return null;
        }
        return email || null;
    } catch {
        return null;
    }
}

/**
 * Validates the token for an order.
 */
export function verifyInvoiceToken(
    orderCode: string,
    customerEmail: string | undefined,
    token: string | null | undefined
): boolean {
    const extractedEmail = extractCustomerEmailFromToken(orderCode, token);
    if (!extractedEmail) return false;
    if (customerEmail) {
        return extractedEmail.toLowerCase() === customerEmail.trim().toLowerCase();
    }
    return true;
}
