import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { generateInvoiceToken, verifyInvoiceToken } from './invoice-security';

describe('invoice-security', () => {
    const orderCode = 'AZE4E5BE44R18137';
    const email = 'lementalistsupreme019@gmail.com';

    it('generates consistent HMAC-SHA256 tokens', () => {
        const token1 = generateInvoiceToken(orderCode, email);
        const token2 = generateInvoiceToken(orderCode, email);
        assert.equal(token1, token2);
        assert.equal(token1.length, 32);
    });

    it('normalizes casing and whitespace', () => {
        const token1 = generateInvoiceToken(orderCode, email);
        const token2 = generateInvoiceToken('  aze4e5be44r18137  ', '  LEMENTALISTSUPREME019@GMAIL.COM ');
        assert.equal(token1, token2);
    });

    it('verifies valid token using timing-safe comparison', () => {
        const token = generateInvoiceToken(orderCode, email);
        assert.equal(verifyInvoiceToken(orderCode, email, token), true);
    });

    it('rejects tampered order code', () => {
        const token = generateInvoiceToken(orderCode, email);
        assert.equal(verifyInvoiceToken('BZE4E5BE44R18138', email, token), false);
    });

    it('rejects tampered email', () => {
        const token = generateInvoiceToken(orderCode, email);
        assert.equal(verifyInvoiceToken(orderCode, 'attacker@evil.com', token), false);
    });

    it('rejects forged or malformed tokens', () => {
        assert.equal(verifyInvoiceToken(orderCode, email, 'invalid-token-string'), false);
        assert.equal(verifyInvoiceToken(orderCode, email, null), false);
        assert.equal(verifyInvoiceToken(orderCode, email, undefined), false);
        assert.equal(verifyInvoiceToken(orderCode, email, ''), false);
    });
});
