export interface FlutterwavePluginOptions {
    secretKey?: string;
    publicKey?: string;
    secretHash?: string;
    isSandbox?: boolean;
    webhookUrl?: string;
    mockMode?: boolean;
}

export interface FlutterwaveInitializePaymentRequest {
    tx_ref: string;
    amount: number;
    currency: string;
    redirect_url: string;
    customer: {
        email: string;
        phonenumber?: string;
        name: string;
    };
    customizations?: {
        title?: string;
        description?: string;
        logo?: string;
    };
    payment_options?: string;
    meta?: Record<string, any>;
}

export interface FlutterwaveInitializePaymentResponse {
    status: 'success' | 'error';
    message: string;
    data?: {
        link: string;
    };
}

export interface FlutterwaveVerifyTransactionResponse {
    status: 'success' | 'error';
    message: string;
    data?: {
        id: number;
        tx_ref: string;
        flw_ref: string;
        amount: number;
        currency: string;
        charged_amount: number;
        status: 'successful' | 'failed' | 'pending';
        payment_type: string;
        customer: {
            id: number;
            name: string;
            phone_number: string | null;
            email: string;
        };
        meta?: Record<string, any>;
    };
}

export interface FlutterwaveWebhookPayload {
    event: 'charge.completed';
    data: {
        id: number;
        tx_ref: string;
        flw_ref: string;
        amount: number;
        currency: string;
        charged_amount: number;
        status: 'successful' | 'failed' | 'pending';
        customer: {
            id: number;
            name: string;
            phone_number: string | null;
            email: string;
        };
    };
    'event.type'?: string;
}
