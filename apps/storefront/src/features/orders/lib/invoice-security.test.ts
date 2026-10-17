import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { generateInvoiceToken, verifyInvoiceToken, extractCustomerEmailFromToken } from './invoice-security';

describe('invoice-security', () => {
    const orderCode = 'AZE4E5BE44R18137';
    const email = 'lementalistsupreme019@gmail.com';

    it('generates valid AEAD tokens', () => {
        const token = generateInvoiceToken(orderCode, email);
        assert.ok(token);
        assert.ok(token.length > 20);
    });

    it('extracts and verifies customer email from token', () => {
        const token = generateInvoiceToken(orderCode, email);
        const extracted = extractCustomerEmailFromToken(orderCode, token);
        assert.equal(extracted, email);
    });

    it('normalizes casing and whitespace', () => {
        const token = generateInvoiceToken('  aze4e5be44r18137  ', '  LEMENTALISTSUPREME019@GMAIL.COM ');
        const extracted = extractCustomerEmailFromToken(orderCode, token);
        assert.equal(extracted, email);
    });

    it('verifies valid token', () => {
        const token = generateInvoiceToken(orderCode, email);
        assert.equal(verifyInvoiceToken(orderCode, email, token), true);
    });

    it('rejects tampered order code', () => {
        const token = generateInvoiceToken(orderCode, email);
        assert.equal(extractCustomerEmailFromToken('BZE4E5BE44R18138', token), null);
        assert.equal(verifyInvoiceToken('BZE4E5BE44R18138', email, token), false);
    });

    it('rejects forged or malformed tokens', () => {
        assert.equal(extractCustomerEmailFromToken(orderCode, 'invalid-token-string'), null);
        assert.equal(verifyInvoiceToken(orderCode, email, 'invalid-token-string'), false);
        assert.equal(verifyInvoiceToken(orderCode, email, null), false);
        assert.equal(verifyInvoiceToken(orderCode, email, undefined), false);
        assert.equal(verifyInvoiceToken(orderCode, email, ''), false);
    });
});
