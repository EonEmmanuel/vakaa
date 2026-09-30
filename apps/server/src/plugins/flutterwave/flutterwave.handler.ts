import {
    CreatePaymentErrorResult,
    CreatePaymentResult,
    LanguageCode,
    Logger,
    PaymentMethodHandler,
    SettlePaymentResult,
} from '@vendure/core';
import { FlutterwaveClient } from './flutterwave.client';

const loggerCtx = 'FlutterwavePaymentHandler';

export const flutterwavePaymentHandler = new PaymentMethodHandler({
    code: 'flutterwave',
    description: [
        {
            languageCode: LanguageCode.en,
            value: 'Flutterwave Multi-Rail Gateway (Cards, Mobile Money, Bank Transfer)',
        },
        {
            languageCode: LanguageCode.fr,
            value: 'Passerelle Flutterwave (Cartes bancaires, Mobile Money, Virement)',
        },
    ],
    args: {
        publicKey: {
            type: 'string',
            label: [{ languageCode: LanguageCode.en, value: 'Public Key' }],
            defaultValue: process.env.FLW_PUBLIC_KEY || '',
        },
        secretKey: {
            type: 'string',
            label: [{ languageCode: LanguageCode.en, value: 'Secret Key' }],
            defaultValue: process.env.FLW_SECRET_KEY || '',
        },
        secretHash: {
            type: 'string',
            label: [{ languageCode: LanguageCode.en, value: 'Webhook Secret Hash' }],
            defaultValue: process.env.FLW_SECRET_HASH || '',
        },
        isSandbox: {
            type: 'boolean',
            label: [{ languageCode: LanguageCode.en, value: 'Sandbox Mode' }],
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
        const isPlaceholder = (val?: string) =>
            !val || val.includes('your-') || val.includes('your_') || val.includes('placeholder');

        // Prioritize active process.env keys if database args contain outdated placeholder strings
        const secretKey = !isPlaceholder(process.env.FLW_SECRET_KEY)
            ? process.env.FLW_SECRET_KEY!
            : (!isPlaceholder(args.secretKey) ? args.secretKey : '');

        const publicKey = !isPlaceholder(process.env.FLW_PUBLIC_KEY)
            ? process.env.FLW_PUBLIC_KEY!
            : (!isPlaceholder(args.publicKey) ? args.publicKey : '');

        const secretHash = !isPlaceholder(process.env.FLW_SECRET_HASH)
            ? process.env.FLW_SECRET_HASH!
            : (!isPlaceholder(args.secretHash) ? args.secretHash : '');

        const isSandbox = args.isSandbox ?? (process.env.FLW_SANDBOX === 'true');

        const client = new FlutterwaveClient({
            secretKey,
            publicKey,
            secretHash,
            isSandbox,
        });

        // 1. Amount scaling: Vendure stores all prices in minor units (hundredths, e.g. 35,000 CFA is stored as 3500000).
        // For zero-decimal currencies (XAF, XOF) we divide by 100 to get the whole Franc amount (e.g. 176000 -> 1760 XAF).
        // For 2-decimal currencies (EUR, USD) we divide by 100 to get the decimal amount.
        const isZeroDecimal = ['XAF', 'XOF', 'GNF', 'RWF'].includes(order.currencyCode.toUpperCase());
        const chargeAmount = isZeroDecimal
            ? Math.round(amount / 100)
            : Math.round(amount) / 100;

        // 2. Generate idempotent transaction reference
        const txRef = metadata.tx_ref || `VAKAA-${order.code}-${Date.now().toString(36)}`;

        // 3. Resolve customer details
        const email =
            order.customer?.emailAddress ||
            (metadata.email as string) ||
            'customer@vakaa.store';
        const name =
            (order.customer ? `${order.customer.firstName} ${order.customer.lastName}`.trim() : '') ||
            (order.shippingAddress?.fullName as string) ||
            'VAKAA Customer';
        const phone =
            order.customer?.phoneNumber ||
            order.shippingAddress?.phoneNumber ||
            (metadata.phone as string) ||
            undefined;

        // 4. Resolve storefront redirect URL
        const storefrontUrl = process.env.STOREFRONT_URL || 'http://localhost:3001';
        const redirectUrl = `${storefrontUrl}/order-confirmation/${encodeURIComponent(
            order.code
        )}`;

        // 5. Determine payment options for Flutterwave based on currency and shipping country
        const currency = order.currencyCode.toUpperCase();
        const country = (order.shippingAddress?.countryCode || (metadata.countryCode as string) || '').toUpperCase();

        const options = new Set<string>(['card']);

        // Match local African mobile money rails by shipping country
        if (country === 'KE') {
            options.add('mpesa');
        } else if (country === 'GH') {
            options.add('mobilemoneyghana');
        } else if (country === 'UG') {
            options.add('mobilemoneyuganda');
        } else if (country === 'RW') {
            options.add('mobilemoneyrwanda');
        } else if (country === 'ZM') {
            options.add('mobilemoneyzambia');
        } else if (
            ['CI', 'SN', 'BJ', 'BF', 'ML', 'NE', 'TG', 'GW'].includes(country) ||
            currency === 'XOF'
        ) {
            options.add('mobilemoneyxof');
        } else if (
            ['CM', 'GA', 'CG', 'CF', 'TD', 'GQ'].includes(country) ||
            currency === 'XAF'
        ) {
            options.add('mobilemoneyxaf');
        }

        // Add bank transfer & USSD where supported
        options.add('banktransfer');
        if (['NG', 'GH', 'KE', 'ZA'].includes(country) || ['NGN', 'USD'].includes(currency)) {
            options.add('ussd');
        }

        const paymentOptions = Array.from(options).join(',');

        Logger.info(
            `Initializing Flutterwave payment for order ${order.code}: amount=${chargeAmount} ${order.currencyCode}, options=${paymentOptions}, txRef=${txRef}`,
            loggerCtx
        );

        const response = await client.initializePayment({
            tx_ref: txRef,
            amount: chargeAmount,
            currency: order.currencyCode,
            redirect_url: redirectUrl,
            customer: {
                email,
                name,
                phonenumber: phone,
            },
            customizations: {
                title: 'VAKAA Luxury',
                description: `Paiement pour la commande ${order.code}`,
                logo: `${storefrontUrl}/images/vakaa-logo-gold.png`,
            },
            payment_options: paymentOptions,
        });

        if (response.status !== 'success' || !response.data?.link) {
            Logger.error(
                `Flutterwave payment initialization declined/failed for order ${order.code}: ${response.message || JSON.stringify(response)}`,
                loggerCtx
            );
            return {
                amount: order.totalWithTax,
                state: 'Declined',
                errorMessage: response.message || 'Échec de l’initialisation Flutterwave',
            };
        }

        const checkoutLink = response.data.link;
        Logger.info(
            `Flutterwave checkout link created for order ${order.code}: ${checkoutLink}`,
            loggerCtx
        );

        // 6. Return payment in 'Authorized' pending completion on hosted checkout
        return {
            amount: order.totalWithTax,
            state: 'Authorized',
            transactionId: txRef,
            metadata: {
                txRef,
                link: checkoutLink,
                status: 'pending',
                public: {
                    txRef,
                    link: checkoutLink,
                },
            },
        };
    },
    settlePayment: async (ctx, order, payment, args): Promise<SettlePaymentResult> => {
        return { success: true };
    },
});
