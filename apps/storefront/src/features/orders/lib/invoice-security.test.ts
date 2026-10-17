import { describe, expect, it } from 'bun:test';
import { generateInvoiceToken, verifyInvoiceToken } from './invoice-security';

describe('invoice-security', () => {
    const orderCode = 'AZE4E5BE44R18137';
    const email = 'lementalistsupreme019@gmail.com';

    it('generates consistent HMAC-SHA256 tokens', () => {
        const token1 = generateInvoiceToken(orderCode, email);
        const token2 = generateInvoiceToken(orderCode, email);
        expect(token1).toBe(token2);
        expect(token1.length).toBe(32);
    });

    it('normalizes casing and whitespace', () => {
        const token1 = generateInvoiceToken(orderCode, email);
        const token2 = generateInvoiceToken('  aze4e5be44r18137  ', '  LEMENTALISTSUPREME019@GMAIL.COM ');
        expect(token1).toBe(token2);
    });

    it('verifies valid token using timing-safe comparison', () => {
        const token = generateInvoiceToken(orderCode, email);
        expect(verifyInvoiceToken(orderCode, email, token)).toBe(true);
    });

    it('rejects tampered order code', () => {
        const token = generateInvoiceToken(orderCode, email);
        expect(verifyInvoiceToken('BZE4E5BE44R18138', email, token)).toBe(false);
    });

    it('rejects tampered email', () => {
        const token = generateInvoiceToken(orderCode, email);
        expect(verifyInvoiceToken(orderCode, 'attacker@evil.com', token)).toBe(false);
    });

    it('rejects forged or malformed tokens', () => {
        expect(verifyInvoiceToken(orderCode, email, 'invalid-token-string')).toBe(false);
        expect(verifyInvoiceToken(orderCode, email, null)).toBe(false);
        expect(verifyInvoiceToken(orderCode, email, undefined)).toBe(false);
        expect(verifyInvoiceToken(orderCode, email, '')).toBe(false);
    });
});
