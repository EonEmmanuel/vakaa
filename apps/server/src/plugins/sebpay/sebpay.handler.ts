import {
    CreatePaymentErrorResult,
    CreatePaymentResult,
    LanguageCode,
    PaymentMethodHandler,
    SettlePaymentResult,
} from '@vendure/core';
import { SebpayClient } from './sebpay.client';
import { resolveCorridorCurrency, SEBPAY_MONEY_MINOR_FACTOR, toInternationalPhone } from './types';

export const sebpayPaymentHandler = new PaymentMethodHandler({
    code: 'sebpay',
    description: [
        {
            languageCode: LanguageCode.en,
            value: 'SebPay Mobile Money & Cards',
        },
        {
            languageCode: LanguageCode.fr,
            value: 'Paiement Mobile Money SebPay (MTN, Moov, Orange, Wave)',
        },
    ],
    args: {
        publicKey: {
            type: 'string',
            label: [{ languageCode: LanguageCode.en, value: 'Public Key' }],
            description: [{ languageCode: LanguageCode.en, value: 'SebPay Public Key (pk_live_... or pk_test_...)' }],
            required: false,
        },
        secretKey: {
            type: 'string',
            label: [{ languageCode: LanguageCode.en, value: 'Secret Key' }],
            description: [{ languageCode: LanguageCode.en, value: 'SebPay Secret Key (sk_live_... or sk_test_...)' }],
            required: false,
        },
        isSandbox: {
            type: 'boolean',
            label: [{ languageCode: LanguageCode.en, value: 'Sandbox Mode' }],
            required: false,
            defaultValue: true,
        },
    },
    createPayment: async (
        ctx,
        order,
        amount,
        args,
        metadata
    ): Promise<CreatePaymentResult | CreatePaymentErrorResult> => {
        // Master kill-switch: SebPay is paused (SEBPAY_ENABLED !== "true") until
        // the provider is verified. Fail closed without ever calling the API.
        if (process.env.SEBPAY_ENABLED !== 'true') {
            return {
                amount,
                state: 'Declined',
                errorMessage:
                    'SebPay Mobile Money is temporarily unavailable. Please choose another payment method.',
            };
        }

        // Resolve API credentials: args take precedence over env
        const publicKey = args.publicKey || process.env.SEBPAY_PUBLIC_KEY || '';
        const secretKey = args.secretKey || process.env.SEBPAY_SECRET_KEY || '';
        const isSandbox = process.env.APP_ENV === 'dev'
            ? (args.isSandbox ?? true)
            : process.env.SEBPAY_SANDBOX === 'true';
        const webhookUrl = process.env.SEBPAY_WEBHOOK_URL || '';

        if (!isSandbox && (!publicKey || !secretKey || !webhookUrl)) {
            return {
                amount,
                state: 'Declined',
                errorMessage: 'SebPay is not configured for live payments.',
            };
        }

        const client = new SebpayClient({
            publicKey,
            secretKey,
            isSandbox,
            webhookUrl,
        });

        // 1. Resolve customer country & phone
        const rawCountry =
            metadata.country ||
            order.shippingAddress?.countryCode ||
            order.billingAddress?.countryCode ||
            'BJ';
        const country = String(rawCountry).toUpperCase();

        const rawPhone =
            metadata.phone ||
            order.customer?.phoneNumber ||
            order.shippingAddress?.phoneNumber ||
            '';
        // SebPay requires an international number without the "+". The
        // storefront collects a local number ("sans indicatif"), so prepend the
        // country's dialling code when it is missing.
        const phone = toInternationalPhone(country, String(rawPhone));

        if (!phone) {
            return {
                amount,
                state: 'Declined',
                errorMessage: 'A valid customer mobile phone number is required for Mobile Money payment.',
            };
        }

        const operator = String(metadata.operator || 'mtn').toLowerCase();
        // Accept the documented `otp_code` key as well as the storefront's `otp`.
        const rawOtp = metadata.otp_code ?? metadata.otp;
        const otpCode =
            rawOtp != null && String(rawOtp).trim().length > 0 ? String(rawOtp).trim() : undefined;

        // 2. Resolve currency for corridor (XAF for CEMAC, XOF for UEMOA)
        const currency = resolveCorridorCurrency(country, order.currencyCode);

        // 3. Amount scaling: Vendure stores prices in minor units (hundredths).
        // Convert to major units for SebPay collection API (e.g. 176000 -> 1760 XAF).
        const chargeAmount = Math.round(amount / SEBPAY_MONEY_MINOR_FACTOR);

        // 4. Enforce idempotency: unique external reference per attempt
        const externalReference =
            metadata.external_reference ||
            `VAKAA-${order.code}-${Date.now().toString(36)}`;

        // 5. Call SebPay collection API
        const response = await client.createCollection({
            amount: chargeAmount,
            currency,
            phone,
            operator,
            country,
            external_reference: externalReference,
            callback_url: webhookUrl || undefined,
            otp_code: otpCode,
        });

        if (!response.success || !response.data) {
            return {
                amount: order.totalWithTax,
                state: 'Declined',
                errorMessage:
                    response.message ||
                    (response.errors ? Object.values(response.errors).flat().join(', ') : 'Payment initiation failed'),
            };
        }

        const data = response.data;

        // 6. Return payment in 'Authorized' (pending settlement via webhook/polling)
        return {
            amount: order.totalWithTax,
            state: 'Authorized',
            transactionId: data.transaction_id,
            metadata: {
                externalReference,
                transactionId: data.transaction_id,
                operator,
                country,
                phone,
                currency,
                status: data.status,
                providerLink: data.provider_link,
                // Public metadata exposed to Storefront Shop API
                public: {
                    externalReference,
                    transactionId: data.transaction_id,
                    providerLink: data.provider_link,
                    status: data.status,
                },
            },
        };
    },
    settlePayment: async (ctx, order, payment, args): Promise<SettlePaymentResult> => {
        return { success: true };
    },
});
