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
 * SebPay's collections API rejects any amount below 10 units (its own
 * validation: "amount must not be less than 10"). Additionally the mobile
 * money carriers reject small amounts downstream (MTN CM declined 40 with a
 * generic "not authorized"); amounts >= 100 were confirmed accepted on the
 * CM corridor. The guard uses 100 so customers get an early, clear decline
 * instead of an opaque carrier error.
 */
export const SEBPAY_MINIMUM_AMOUNT = 100;

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
 * SebPay expects the customer's Mobile Money number in LOCAL subscriber
 * format: digits only, no dial code ("indicatif"), no "+". Examples:
 * Benin 97000000, Cameroun 677077594 (9 digits). The carrier rejects
 * international formats ("le numero de telephone ne doit contenir que des
 * chiffres ... ne doit pas contenir d indicatif de pays"), so numbers that
 * already start with the country's dial code are stripped down to local.
 */
export function toLocalPhone(countryCode: string, rawPhone: string): string {
    const digits = (rawPhone || '').replace(/\D/g, '');
    const dialCode = COUNTRY_DIAL_CODES[(countryCode || '').toUpperCase()];
    if (dialCode && digits.startsWith(dialCode)) {
        return digits.slice(dialCode.length);
    }
    return digits;
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
