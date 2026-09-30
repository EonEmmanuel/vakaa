import crypto from 'crypto';
import {
    FlutterwaveInitializePaymentRequest,
    FlutterwaveInitializePaymentResponse,
    FlutterwavePluginOptions,
    FlutterwaveVerifyTransactionResponse,
} from './types';

export class FlutterwaveClient {
    private readonly baseUrl = 'https://api.flutterwave.com/v3';

    constructor(private readonly options: FlutterwavePluginOptions) {}

    /**
     * Creates a hosted payment checkout link on Flutterwave.
     */
    async initializePayment(
        request: FlutterwaveInitializePaymentRequest
    ): Promise<FlutterwaveInitializePaymentResponse> {
        if (this.isMockActive()) {
            return this.mockInitializePayment(request);
        }

        const url = `${this.baseUrl}/payments`;
        const headers = {
            Authorization: `Bearer ${this.options.secretKey}`,
            'Content-Type': 'application/json',
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify(request),
            });

            const data = (await response.json()) as FlutterwaveInitializePaymentResponse;
            return data;
        } catch (error) {
            return {
                status: 'error',
                message: error instanceof Error ? error.message : 'Network error communicating with Flutterwave',
            };
        }
    }

    /**
     * Verifies the true status of a transaction on Flutterwave.
     * Always used server-to-server; never trust client redirect params alone.
     */
    async verifyTransaction(
        transactionId: string | number
    ): Promise<FlutterwaveVerifyTransactionResponse> {
        if (this.isMockActive()) {
            return this.mockVerifyTransaction(transactionId);
        }

        const url = `${this.baseUrl}/transactions/${encodeURIComponent(String(transactionId))}/verify`;
        const headers = {
            Authorization: `Bearer ${this.options.secretKey}`,
            'Content-Type': 'application/json',
        };

        try {
            const response = await fetch(url, { method: 'GET', headers });
            const data = (await response.json()) as FlutterwaveVerifyTransactionResponse;
            return data;
        } catch (error) {
            return {
                status: 'error',
                message: error instanceof Error ? error.message : 'Network error verifying Flutterwave transaction',
            };
        }
    }

    /**
     * Verifies incoming webhook signature header against the configured secret hash.
     * Uses constant-time comparison to prevent timing attacks.
     */
    verifyWebhookSignature(signatureHeader?: string): boolean {
        const secretHash = this.options.secretHash || process.env.FLW_SECRET_HASH;
        if (!signatureHeader || !secretHash) {
            return false;
        }

        try {
            const sigBuf = Buffer.from(signatureHeader, 'utf8');
            const expectedBuf = Buffer.from(secretHash, 'utf8');

            if (sigBuf.length !== expectedBuf.length) {
                return false;
            }

            return crypto.timingSafeEqual(sigBuf, expectedBuf);
        } catch {
            return false;
        }
    }

    private isMockActive(): boolean {
        if (this.options.mockMode === true) return true;
        if (!this.options.secretKey) return true;
        if (this.options.secretKey.includes('your_') || this.options.secretKey.includes('placeholder')) return true;
        return false;
    }

    private mockInitializePayment(
        request: FlutterwaveInitializePaymentRequest
    ): FlutterwaveInitializePaymentResponse {
        const mockId = `flw_mock_${Date.now()}`;
        return {
            status: 'success',
            message: 'Hosted Link Created (Mock Sandbox)',
            data: {
                link: `${request.redirect_url}?status=successful&tx_ref=${encodeURIComponent(
                    request.tx_ref
                )}&transaction_id=${mockId}`,
            },
        };
    }

    private mockVerifyTransaction(
        transactionId: string | number
    ): FlutterwaveVerifyTransactionResponse {
        return {
            status: 'success',
            message: 'Transaction verified (Mock Sandbox)',
            data: {
                id: Number(String(transactionId).replace(/\D/g, '')) || 999999,
                tx_ref: `MOCK-${transactionId}`,
                flw_ref: `FLW-MOCK-${Date.now()}`,
                amount: 1000,
                currency: 'XAF',
                charged_amount: 1000,
                status: 'successful',
                payment_type: 'mobilemoneyfrancophone',
                customer: {
                    id: 1,
                    name: 'Test Customer',
                    phone_number: '+237670000000',
                    email: 'test@vakaa.store',
                },
            },
        };
    }
}
