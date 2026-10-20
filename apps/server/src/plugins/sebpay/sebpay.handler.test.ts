import { describe, test, expect, mock, beforeEach, afterEach } from 'bun:test';
import { sebpayPaymentHandler } from './sebpay.handler';

/** Vendure passes handler args as an array of {name, value} pairs. */
const ARGS: any[] = [
    { name: 'publicKey', value: 'pk_test_abc' },
    { name: 'secretKey', value: 'sk_test_abc' },
    { name: 'isSandbox', value: 'true' },
];

function mockOrder(overrides: Record<string, any> = {}): any {
    return {
        code: 'ORDER1',
        totalWithTax: 100_000,
        currencyCode: 'XOF',
        shippingAddress: { countryCode: 'BJ', phoneNumber: '97000000' },
        billingAddress: { countryCode: 'BJ' },
        customer: { phoneNumber: '97000000' },
        payments: [],
        ...overrides,
    };
}

/** A minimal Response-like object: the client only uses `.status` and `.json()`. */
function jsonResponse(status: number, body: unknown): any {
    return { status, json: async () => body };
}

function collectionOK(overrides: Record<string, any> = {}) {
    return {
        success: true,
        data: {
            transaction_id: 'tx1',
            status: 'pending',
            external_reference: 'VAKAA-ORDER1',
            amount: 1000,
            currency: 'XOF',
            ...overrides,
        },
        message: 'ok',
    };
}

describe('sebpayPaymentHandler.createPayment idempotency', () => {
    let fetchMock: ReturnType<typeof mock>;
    const originalFetch = globalThis.fetch;
    const originalEnv = { ...process.env };

    beforeEach(() => {
        process.env.SEBPAY_ENABLED = 'true';
        process.env.SEBPAY_SANDBOX = 'true';
        delete process.env.APP_ENV;
        fetchMock = mock(() => Promise.resolve(jsonResponse(200, collectionOK())));
        (globalThis as any).fetch = fetchMock;
    });

    afterEach(() => {
        (globalThis as any).fetch = originalFetch;
        process.env = { ...originalEnv };
    });

    test('uses a stable per-order external reference (not a timestamp)', async () => {
        const result: any = await (sebpayPaymentHandler as any).createPayment(
            {} as any,
            mockOrder(),
            100_000,
            ARGS,
            {}
        );

        expect(result.state).toBe('Authorized');
        expect(result.transactionId).toBe('tx1');
        expect(result.metadata.externalReference).toBe('VAKAA-ORDER1');
        expect(result.metadata.public.transactionId).toBe('tx1');

        const body = JSON.parse((fetchMock.mock.calls[0][1] as any).body);
        expect(body.external_reference).toBe('VAKAA-ORDER1');
        expect(body.amount).toBe(1000);
        expect(body.phone).toBe('97000000');
        expect(body.currency).toBe('XOF');
    });

    test('does not create a second collection when the order already has an Authorized SebPay payment', async () => {
        const order = mockOrder({
            payments: [
                { id: 1, method: 'sebpay', state: 'Authorized', amount: 100_000, transactionId: 'tx0' },
            ],
        });

        const result: any = await (sebpayPaymentHandler as any).createPayment(
            {} as any,
            order,
            100_000,
            ARGS,
            {}
        );

        expect(result.state).toBe('Declined');
        expect(fetchMock).not.toHaveBeenCalled();
    });

    test('declines without calling SebPay when there is no outstanding amount', async () => {
        const result: any = await (sebpayPaymentHandler as any).createPayment(
            {} as any,
            mockOrder(),
            0,
            ARGS,
            {}
        );

        expect(result.state).toBe('Declined');
        expect(fetchMock).not.toHaveBeenCalled();
    });

    test('reuses an already-approved collection when the reference was already used', async () => {
        fetchMock = mock((url: string, init?: any) => {
            const method = init?.method ?? 'GET';
            if (method === 'POST') {
                return Promise.resolve(
                    jsonResponse(422, { success: false, message: 'external_reference already used' })
                );
            }
            return Promise.resolve(
                jsonResponse(
                    200,
                    collectionOK({ transaction_id: 'tx9', status: 'approved' })
                )
            );
        });
        (globalThis as any).fetch = fetchMock;

        const result: any = await (sebpayPaymentHandler as any).createPayment(
            {} as any,
            mockOrder(),
            100_000,
            ARGS,
            {}
        );

        expect(result.state).toBe('Authorized');
        expect(result.transactionId).toBe('tx9');
        // One POST attempt + one status lookup; never a second collection POST.
        expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    test('adopts an existing pending collection instead of declining', async () => {
        fetchMock = mock((url: string, init?: any) => {
            const method = init?.method ?? 'GET';
            if (method === 'POST') {
                return Promise.resolve(
                    jsonResponse(422, { success: false, message: 'external_reference already used' })
                );
            }
            return Promise.resolve(
                jsonResponse(200, collectionOK({ transaction_id: 'tx9', status: 'pending' }))
            );
        });
        (globalThis as any).fetch = fetchMock;

        const result: any = await (sebpayPaymentHandler as any).createPayment(
            {} as any,
            mockOrder(),
            100_000,
            ARGS,
            {}
        );

        // Authorized while pending means "provider initiated, awaiting
        // settlement" - the webhook/poller settles it and the order completes.
        expect(result.state).toBe('Authorized');
        expect(result.transactionId).toBe('tx9');
        expect(result.metadata.public.transactionId).toBe('tx9');
        // One collection attempt + one status lookup; never a second collection.
        expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    test('does not duplicate a payment row when one already claims that collection', async () => {
        fetchMock = mock((url: string, init?: any) => {
            const method = init?.method ?? 'GET';
            if (method === 'POST') {
                return Promise.resolve(
                    jsonResponse(422, { success: false, message: 'external_reference already used' })
                );
            }
            return Promise.resolve(
                jsonResponse(200, collectionOK({ transaction_id: 'tx9', status: 'pending' }))
            );
        });
        (globalThis as any).fetch = fetchMock;

        const order = mockOrder({
            payments: [
                // A non-covering state to bypass the covering-payment guard,
                // while already holding the provider transaction id.
                { id: 2, method: 'sebpay', state: 'Error', amount: 0, transactionId: 'tx9' },
            ],
        });

        const result: any = await (sebpayPaymentHandler as any).createPayment(
            {} as any,
            order,
            100_000,
            ARGS,
            {}
        );

        expect(result.state).toBe('Declined');
        expect(result.transactionId).toBeUndefined();
    });
});
