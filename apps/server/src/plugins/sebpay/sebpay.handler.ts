import {
    CreatePaymentErrorResult,
    CreatePaymentResult,
    LanguageCode,
    Logger,
    PaymentMethodHandler,
    SettlePaymentResult,
} from '@vendure/core';
import { SebpayClient } from './sebpay.client';
import {
    resolveCorridorCurrency,
    SEBPAY_MINIMUM_AMOUNT,
    SEBPAY_MONEY_MINOR_FACTOR,
    SEBPAY_PENDING_TTL_MS,
    toLocalPhone,
    type SebpayCollectionRequest,
    type SebpayCollectionResponseData,
} from './types';

const loggerCtx = 'SebpayPaymentHandler';

/**
 * Builds the payment metadata stored on the Vendure Payment. The `public` block
 * is the only part exposed through the Storefront Shop API.
 */
function buildPaymentMetadata(
    externalReference: string,
    data: SebpayCollectionResponseData,
    extra: { operator: string; country: string; phone: string; currency: string }
) {
    return {
        externalReference,
        transactionId: data.transaction_id,
        operator: extra.operator,
        country: extra.country,
        phone: extra.phone,
        currency: extra.currency,
        status: data.status,
        providerLink: data.provider_link,
        public: {
            externalReference,
            transactionId: data.transaction_id,
            providerLink: data.provider_link,
            status: data.status,
        },
    };
}

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
            Logger.warn(
                `Blocked SebPay payment for order ${order.code}: SebPay is paused (SEBPAY_ENABLED != true).`,
                loggerCtx
            );
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
            Logger.error(
                `SebPay live payment blocked for order ${order.code}: missing ` +
                    `${!publicKey ? 'SEBPAY_PUBLIC_KEY ' : ''}${!secretKey ? 'SEBPAY_SECRET_KEY ' : ''}${
                        !webhookUrl ? 'SEBPAY_WEBHOOK_URL' : ''
                    }`.trim(),
                loggerCtx
            );
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
        // SebPay requires the LOCAL subscriber number: digits only, without the
        // country dial code ("indicatif") — e.g. Cameroun 677077594. Desktop
        // sources may carry a full international number; both normalize below.
        const phone = toLocalPhone(country, String(rawPhone));

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

        // SebPay rejects amounts under 10 units at the carrier stage — catch it
        // early with an explicit, provider-neutral message.
        if (chargeAmount < SEBPAY_MINIMUM_AMOUNT) {
            return {
                amount,
                state: 'Declined',
                errorMessage: `Payment amount is below the accepted minimum of ${SEBPAY_MINIMUM_AMOUNT} ${currency}.`,
            };
        }

        // 4. Idempotency guards -------------------------------------------------
        // Vendure may invoke createPayment more than once for the same order (a
        // double-click, a retried request, or two racing checkouts). Never open a
        // second SebPay collection for an order that is already covered.
        const priorSebpayPayments = (order.payments ?? []).filter((p) => p.method === 'sebpay');
        const coveringPayment = priorSebpayPayments.find(
            (p) => p.state === 'Authorized' || p.state === 'Settled'
        );
        if (coveringPayment || chargeAmount <= 0) {
            Logger.warn(
                `Skipping duplicate SebPay collection for order ${order.code}: ` +
                    `existing ${coveringPayment?.state ?? 'none'} payment, outstanding amount ${chargeAmount}.`,
                loggerCtx
            );
            return {
                amount,
                state: 'Declined',
                errorMessage: 'A payment for this order is already in progress.',
            };
        }

        // A stable reference keyed to the order (rather than a timestamp) means a
        // retried or concurrent submission reuses the same SebPay collection
        // instead of creating a duplicate charge.
        let externalReference = metadata.external_reference || `VAKAA-${order.code}`;

        // 5. Call SebPay collection API
        const collectionRequest: SebpayCollectionRequest = {
            amount: chargeAmount,
            currency,
            phone,
            operator,
            country,
            external_reference: externalReference,
            callback_url: webhookUrl || undefined,
            otp_code: otpCode,
        };
        let response = await client.createCollection(collectionRequest);

        // A failure may just mean this reference was already used by an earlier
        // (retried/concurrent) submission. Resolve the existing collection rather
        // than charging the customer a second time.
        if (!response.success || !response.data) {
            const existing = await client.getCollectionStatus(externalReference);
            if (existing.success && existing.data) {
                const existingData = existing.data;
                const alreadyClaimed = priorSebpayPayments.some(
                    (p) => p.transactionId === existingData.transaction_id
                );
                // SebPay keeps a collection 'pending' long after its USSD prompt
                // has expired (observed live: status frozen at 'pending',
                // created_at unchanged for tens of minutes). A stale pending can
                // no longer be completed by the customer, so adopting it would
                // strand the order in PaymentAuthorized forever. Treat pendings
                // older than the TTL as dead and start a fresh collection. When
                // created_at is absent (older API shapes), keep adopting.
                const stalePending =
                    existingData.status === 'pending' &&
                    !!existingData.created_at &&
                    Date.now() - Date.parse(existingData.created_at) > SEBPAY_PENDING_TTL_MS;
                if ((existingData.status === 'approved' || existingData.status === 'pending') && !stalePending) {
                    if (alreadyClaimed) {
                        // A payment row already holds this provider transaction;
                        // another Authorized row would double-count the covered
                        // total and could lead to a double refund.
                        Logger.warn(
                            `Order ${order.code} already has a payment row for SebPay collection ` +
                                `${existingData.transaction_id}; not duplicating it.`,
                            loggerCtx
                        );
                        return {
                            amount,
                            state: 'Declined',
                            errorMessage: 'A payment for this order is already in progress.',
                        };
                    }
                    // Adopt the existing collection and let the webhook/poller
                    // settle it, so the order completes without being charged
                    // twice. Approved = already paid; Pending = provider
                    // initiated and awaiting customer confirmation.
                    Logger.warn(
                        `Order ${order.code} already has a ${existingData.status} SebPay collection ` +
                            `${existingData.transaction_id}; reusing it instead of charging again.`,
                        loggerCtx
                    );
                    return {
                        amount: order.totalWithTax,
                        state: 'Authorized',
                        transactionId: existingData.transaction_id,
                        metadata: buildPaymentMetadata(externalReference, existingData, {
                            operator,
                            country,
                            phone,
                            currency,
                        }),
                    };
                }
                if (existingData.status === 'rejected' || stalePending) {
                    // Genuinely rejected, or a pending that outlived the USSD
                    // prompt: allow a retry with a fresh ref.
                    if (stalePending) {
                        Logger.warn(
                            `Order ${order.code}: SebPay collection ${existingData.transaction_id} ` +
                                `still 'pending' past its TTL; starting a fresh collection.`,
                            loggerCtx
                        );
                    }
                    externalReference =
                        metadata.external_reference || `VAKAA-${order.code}-r${Date.now().toString(36)}`;
                    collectionRequest.external_reference = externalReference;
                    response = await client.createCollection(collectionRequest);
                }
            }
        }

        if (!response.success || !response.data) {
            const reason =
                response.message ||
                (response.errors ? Object.values(response.errors).flat().join(', ') : 'Payment initiation failed');
            // Keep the real provider reason in the logs; the storefront shows a
            // generic message to the customer.
            Logger.error(
                `SebPay collection failed for order ${order.code} (ref=${externalReference}, ` +
                    `httpStatus=${response.httpStatus ?? 'n/a'}): ${reason}`,
                loggerCtx
            );
            return {
                amount: order.totalWithTax,
                state: 'Declined',
                errorMessage: reason,
            };
        }

        const data = response.data;

        // 6. Return payment in 'Authorized' (pending settlement via webhook/polling)
        return {
            amount: order.totalWithTax,
            state: 'Authorized',
            transactionId: data.transaction_id,
            metadata: buildPaymentMetadata(externalReference, data, {
                operator,
                country,
                phone,
                currency,
            }),
        };
    },
    settlePayment: async (ctx, order, payment, args): Promise<SettlePaymentResult> => {
        return { success: true };
    },
});
