export interface SebpayPluginOptions {
    publicKey: string;
    secretKey: string;
    isSandbox?: boolean;
    webhookUrl?: string;
    /**
     * If true, enables local mock responses when no live API keys are provided.
     * Default: true in dev mode.
     */
    mockMode?: boolean;
}

export interface SebpayCollectionRequest {
    amount: number;
    currency: string;
    phone: string;
    operator: string;
    country: string;
    external_reference: string;
    callback_url?: string;
    otp_code?: string;
}

export interface SebpayCollectionResponseData {
    transaction_id: string;
    status: 'pending' | 'approved' | 'rejected';
    external_reference: string;
    amount: number;
    currency: string;
    provider_link?: string;
    message?: string;
}

export interface SebpayCollectionResponse {
    success: boolean;
    data?: SebpayCollectionResponseData;
    message?: string;
    errors?: Record<string, string[]>;
}

export interface SebpayWebhookPayload {
    transaction_id: string;
    external_reference: string;
    status: 'approved' | 'rejected' | 'pending';
    amount: number;
    currency: string;
    customer_phone?: string;
    created_at?: string;
    updated_at?: string;
}

export interface SebpayOperator {
    id: string | number;
    name: string;
    slug: string;
    code: string;
    country: string;
    otp_required: boolean;
    ussd_code?: string;
}

/**
 * CEMAC Central African corridors (native currency: XAF)
 */
export const CEMAC_COUNTRIES = new Set(['CM', 'GA', 'CG', 'TD', 'CF', 'GQ']);

/**
 * UEMOA West African corridors (native currency: XOF)
 */
export const UEMOA_COUNTRIES = new Set(['BJ', 'CI', 'SN', 'TG', 'BF', 'ML', 'NE', 'GW']);

/**
 * Returns the correct Franc CFA currency code (XAF vs XOF) based on country code.
 */
export function resolveCorridorCurrency(countryCode: string, orderCurrency: string = 'XAF'): string {
    const upperCountry = (countryCode || '').toUpperCase();
    if (CEMAC_COUNTRIES.has(upperCountry)) {
        return 'XAF';
    }
    if (UEMOA_COUNTRIES.has(upperCountry)) {
        return 'XOF';
    }
    return orderCurrency;
}
