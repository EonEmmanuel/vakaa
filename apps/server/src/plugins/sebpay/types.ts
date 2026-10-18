export interface SebpayPluginOptions {
    publicKey: string;
    secretKey: string;
    isSandbox?: boolean;
    webhookUrl?: string;
    /**
     * Master switch for the SebPay integration.
     *
     * When `false` (the default) SebPay is paused:
     *  - the `sebpay` payment method is kept disabled, so Vendure omits it from
     *    `eligiblePaymentMethods` and customers cannot select it at checkout;
     *  - the payment handler declines any direct/out-of-band attempt instead of
     *    calling the SebPay API.
     *
     * Set `SEBPAY_ENABLED=true` to re-enable once SebPay has been verified.
     */
    enabled?: boolean;
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
    /** HTTP status of the underlying request, when available (diagnostics). */
    httpStatus?: number;
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
 * Vendure stores monetary values in minor units (hundredths), whereas the
 * SebPay collections API works in major units. This factor converts between the
 * two and MUST be applied consistently on both the request and the response path.
 */
export const SEBPAY_MONEY_MINOR_FACTOR = 100;

/**
 * ITU country dialling codes for the corridors Vakaa supports. Used to
 * normalize a locally-entered Mobile Money number into the international
 * format SebPay requires (without the leading "+").
 */
export const COUNTRY_DIAL_CODES: Record<string, string> = {
    BJ: '229',
    CI: '225',
    SN: '221',
    CM: '237',
    BF: '226',
    TG: '228',
    ML: '223',
    GA: '241',
    GN: '224',
    CG: '242',
    NE: '227',
    GW: '245',
    CF: '236',
    TD: '235',
    GQ: '240',
};

/**
 * Normalizes a phone number to international format without the leading "+"
 * (e.g. "97000000" with country "BJ" -> "22997000000"). If the number already
 * begins with the country's dialling code it is returned unchanged, so this is
 * safe whether the client sends a local or an already-international number.
 */
export function toInternationalPhone(countryCode: string, rawPhone: string): string {
    const digits = (rawPhone || '').replace(/\D/g, '');
    const dialCode = COUNTRY_DIAL_CODES[(countryCode || '').toUpperCase()];
    if (!dialCode) {
        return digits;
    }
    return digits.startsWith(dialCode) ? digits : `${dialCode}${digits}`;
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
