import crypto from 'crypto';
import {
    SebpayCollectionRequest,
    SebpayCollectionResponse,
    SebpayOperator,
    SebpayPluginOptions,
} from './types';

export class SebpayClient {
    private readonly baseUrl = 'https://newapi.sebpay.bj/api/v1';

    constructor(private readonly options: SebpayPluginOptions) {}

    /**
     * Initiates a Mobile Money collection request.
     */
    async createCollection(request: SebpayCollectionRequest): Promise<SebpayCollectionResponse> {
        // If mock mode is active (e.g. during local tests without live API keys)
        if (this.isMockActive()) {
            return this.mockCreateCollection(request);
        }

        const url = `${this.baseUrl}/collections`;
        const headers = {
            'Content-Type': 'application/json',
            'X-Public-Key': this.options.publicKey,
            'X-Secret-Key': this.options.secretKey,
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify(request),
            });

            const data = (await response.json()) as SebpayCollectionResponse;
            return data;
        } catch (error) {
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Network error communicating with SebPay',
            };
        }
    }

    /**
     * Checks current status of a transaction by transaction_id or external_reference.
     */
    async getCollectionStatus(idOrRef: string): Promise<SebpayCollectionResponse> {
        if (this.isMockActive()) {
            return this.mockGetCollectionStatus(idOrRef);
        }

        const url = `${this.baseUrl}/collections/${encodeURIComponent(idOrRef)}`;
        const headers = {
            'X-Public-Key': this.options.publicKey,
            'X-Secret-Key': this.options.secretKey,
        };

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers,
            });

            const data = (await response.json()) as SebpayCollectionResponse;
            return data;
        } catch (error) {
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Network error querying transaction status',
            };
        }
    }

    /**
     * Retrieves supported Mobile Money operators, optionally filtered by country.
     */
    async getOperators(countryCode?: string): Promise<SebpayOperator[]> {
        if (this.isMockActive()) {
            return this.mockOperators(countryCode);
        }

        const query = countryCode ? `?country=${encodeURIComponent(countryCode.toLowerCase())}` : '';
        const url = `${this.baseUrl}/operators${query}`;
        const headers = {
            'X-Public-Key': this.options.publicKey,
            'X-Secret-Key': this.options.secretKey,
        };

        try {
            const response = await fetch(url, { method: 'GET', headers });
            const result = (await response.json()) as { success: boolean; data?: SebpayOperator[] };
            return result.data || [];
        } catch {
            return this.mockOperators(countryCode);
        }
    }

    /**
     * Validates incoming webhook signature using HMAC-SHA256 and constant-time comparison.
     */
    verifyWebhookSignature(rawBody: string, signature: string): boolean {
        if (!signature || !this.options.secretKey) {
            return false;
        }

        try {
            const expected = crypto
                .createHmac('sha256', this.options.secretKey)
                .update(rawBody)
                .digest('hex');

            const sigBuf = Buffer.from(signature, 'utf8');
            const expBuf = Buffer.from(expected, 'utf8');

            if (sigBuf.length !== expBuf.length) {
                return false;
            }

            return crypto.timingSafeEqual(sigBuf, expBuf);
        } catch {
            return false;
        }
    }

    private isMockActive(): boolean {
        if (this.options.mockMode === true) return true;
        if (!this.options.publicKey || !this.options.secretKey) return true;
        if (this.options.publicKey.includes('your_') || this.options.secretKey.includes('your_')) return true;
        return false;
    }

    private mockCreateCollection(request: SebpayCollectionRequest): SebpayCollectionResponse {
        const mockTxId = `sb_mock_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        return {
            success: true,
            data: {
                transaction_id: mockTxId,
                status: 'pending',
                external_reference: request.external_reference,
                amount: request.amount,
                currency: request.currency,
                message: 'Mock payment initiated. Prompt dispatched to simulated phone.',
                provider_link: request.operator === 'wave' ? 'https://pay.wave.com/mock-link' : undefined,
            },
            message: 'Collection initiated (Dev Mock)',
        };
    }

    private mockGetCollectionStatus(idOrRef: string): SebpayCollectionResponse {
        return {
            success: true,
            data: {
                transaction_id: idOrRef.startsWith('sb_') ? idOrRef : `sb_mock_${Date.now()}`,
                status: 'approved',
                external_reference: idOrRef,
                amount: 10000,
                currency: 'XAF',
                message: 'Mock payment verified successfully.',
            },
            message: 'Transaction found (Dev Mock)',
        };
    }

    private mockOperators(countryCode?: string): SebpayOperator[] {
        const cc = (countryCode || 'BJ').toUpperCase();
        if (cc === 'CM' || cc === 'GA' || cc === 'CG') {
            return [
                { id: 1, name: 'MTN MoMo Cameroon', slug: 'mtn', code: 'MTN_CM', country: 'CM', otp_required: false },
                { id: 2, name: 'Orange Money Cameroon', slug: 'orange', code: 'ORG_CM', country: 'CM', otp_required: false },
            ];
        }
        return [
            { id: 3, name: 'MTN Mobile Money', slug: 'mtn', code: 'MTN_BJ', country: 'BJ', otp_required: false },
            { id: 4, name: 'Moov Money', slug: 'moov', code: 'MOOV_BJ', country: 'BJ', otp_required: false },
            { id: 5, name: 'Orange Money', slug: 'orange', code: 'ORG_CI', country: 'CI', otp_required: true, ussd_code: '#144*77#' },
            { id: 6, name: 'Wave', slug: 'wave', code: 'WAVE_SN', country: 'SN', otp_required: false },
        ];
    }
}
