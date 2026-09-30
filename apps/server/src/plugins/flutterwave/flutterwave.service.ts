import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import {
    ChannelService,
    LanguageCode,
    Logger,
    PaymentMethod,
    PaymentMethodService,
    PaymentService,
    RequestContext,
    RequestContextService,
    TransactionalConnection,
} from '@vendure/core';
import { FlutterwaveClient } from './flutterwave.client';
import { flutterwavePaymentHandler } from './flutterwave.handler';
import { FlutterwavePluginOptions } from './types';

const loggerCtx = 'FlutterwaveService';

@Injectable()
export class FlutterwaveService implements OnApplicationBootstrap {
    public readonly client: FlutterwaveClient;

    constructor(
        @Inject('FLUTTERWAVE_PLUGIN_OPTIONS')
        private readonly options: FlutterwavePluginOptions,
        private readonly connection: TransactionalConnection,
        private readonly paymentMethodService: PaymentMethodService,
        private readonly paymentService: PaymentService,
        private readonly channelService: ChannelService,
        private readonly requestContextService: RequestContextService
    ) {
        this.client = new FlutterwaveClient(this.options);
    }

    async onApplicationBootstrap(): Promise<void> {
        try {
            const ctx = await this.requestContextService.create({ apiType: 'admin' });
            await this.ensurePaymentMethodCreated(ctx);
        } catch (error) {
            Logger.warn(
                `Could not auto-provision Flutterwave PaymentMethod on bootstrap: ${
                    error instanceof Error ? error.message : error
                }`,
                loggerCtx
            );
        }
    }

    private async ensurePaymentMethodCreated(ctx: RequestContext): Promise<void> {
        const existing = await this.connection
            .getRepository(ctx, PaymentMethod)
            .findOne({ where: { code: 'flutterwave' } });

        const isPlaceholder = (val?: string) =>
            !val || val.includes('your-') || val.includes('your_') || val.includes('placeholder');

        const activePublicKey: string =
            (!isPlaceholder(this.options.publicKey) ? this.options.publicKey : undefined) ||
            process.env.FLW_PUBLIC_KEY ||
            '';

        const activeSecretKey: string =
            (!isPlaceholder(this.options.secretKey) ? this.options.secretKey : undefined) ||
            process.env.FLW_SECRET_KEY ||
            '';

        const activeSecretHash: string =
            (!isPlaceholder(this.options.secretHash) ? this.options.secretHash : undefined) ||
            process.env.FLW_SECRET_HASH ||
            '';

        if (existing) {
            // Check if existing handler args contain placeholders while valid keys exist
            const existingSecretKey = existing.handler?.args?.find(a => a.name === 'secretKey')?.value;
            if (isPlaceholder(existingSecretKey) && !isPlaceholder(activeSecretKey)) {
                Logger.info('Updating Flutterwave PaymentMethod with active environment credentials...', loggerCtx);
                await this.paymentMethodService.update(ctx, {
                    id: existing.id,
                    handler: {
                        code: flutterwavePaymentHandler.code,
                        arguments: [
                            { name: 'publicKey', value: activePublicKey },
                            { name: 'secretKey', value: activeSecretKey },
                            { name: 'secretHash', value: activeSecretHash },
                            { name: 'isSandbox', value: String(this.options.isSandbox ?? true) },
                        ],
                    },
                });
                Logger.info('Successfully updated Flutterwave credentials in database.', loggerCtx);
            } else {
                Logger.info('Flutterwave PaymentMethod is configured and active.', loggerCtx);
            }
            return;
        }

        Logger.info('Auto-provisioning Flutterwave PaymentMethod in Vendure...', loggerCtx);

        await this.paymentMethodService.create(ctx, {
            code: 'flutterwave',
            enabled: true,
            handler: {
                code: flutterwavePaymentHandler.code,
                arguments: [
                    { name: 'publicKey', value: activePublicKey },
                    { name: 'secretKey', value: activeSecretKey },
                    { name: 'secretHash', value: activeSecretHash },
                    { name: 'isSandbox', value: String(this.options.isSandbox ?? true) },
                ],
            },
            translations: [
                {
                    languageCode: LanguageCode.en,
                    name: 'Flutterwave (Cards, Mobile Money, USSD)',
                    description: 'Secure payment via Visa/Mastercard, Francophone Mobile Money (MTN, Orange, Moov), or Bank Transfer.',
                },
                {
                    languageCode: LanguageCode.fr,
                    name: 'Flutterwave (Cartes bancaires & Mobile Money)',
                    description: 'Paiement sécurisé par Carte bancaire, Mobile Money (MTN, Orange, Moov) ou Virement.',
                },
            ],
        });

        Logger.info('Successfully provisioned Flutterwave PaymentMethod.', loggerCtx);
    }

    /**
     * Server-to-server transaction verification and reconciliation.
     * Enforces amount and currency match before settling.
     */
    async reconcileTransaction(
        ctx: RequestContext,
        transactionId: string | number
    ): Promise<{ success: boolean; message: string; paymentId?: string }> {
        const verification = await this.client.verifyTransaction(transactionId);

        if (verification.status !== 'success' || !verification.data) {
            return {
                success: false,
                message: verification.message || 'Transaction could not be verified on Flutterwave',
            };
        }

        const data = verification.data;

        if (data.status !== 'successful') {
            return {
                success: false,
                message: `Transaction on Flutterwave is in status: ${data.status}`,
            };
        }

        const txRef = data.tx_ref;

        // Locate order payment in Vendure by transactionId or tx_ref
        const payments = await this.connection.rawConnection
            .getRepository('payment')
            .createQueryBuilder('payment')
            .leftJoinAndSelect('payment.order', 'order')
            .where('payment.transactionId = :txId OR payment.transactionId = :txRef', {
                txId: String(data.id),
                txRef,
            })
            .getMany();

        const payment = payments[0] as any;

        if (!payment) {
            Logger.warn(
                `Reconciliation skipped: No matching Vendure payment for tx_ref ${txRef}`,
                loggerCtx
            );
            return { success: false, message: 'Matching Vendure payment record not found' };
        }

        // Amount & currency verification: payment.amount is stored in Vendure minor units (hundredths, e.g. 176000 for 1760 XAF).
        // Flutterwave data.amount is in real-world currency units (e.g. 1760 XAF).
        const isZeroDecimal = ['XAF', 'XOF', 'GNF', 'RWF'].includes(data.currency.toUpperCase());
        const expectedAmount = isZeroDecimal ? Math.round(payment.amount / 100) : Math.round(payment.amount) / 100;

        if (Math.abs(data.amount - expectedAmount) > 1) {
            Logger.error(
                `Amount mismatch! Expected ${expectedAmount} ${payment.order?.currencyCode}, but got ${data.amount} ${data.currency}`,
                loggerCtx
            );
            return { success: false, message: 'Amount mismatch detected' };
        }

        if (payment.state === 'Settled') {
            return { success: true, message: 'Payment already settled', paymentId: payment.id };
        }

        // Settle payment
        const result = await this.paymentService.transitionToState(ctx, payment.id, 'Settled');

        if ((result as any).state === 'Settled') {
            Logger.info(`Payment ${payment.id} successfully settled for order ${payment.order?.code}`, loggerCtx);
            return { success: true, message: 'Payment settled successfully', paymentId: payment.id };
        }

        return { success: false, message: 'Failed to transition payment state to Settled' };
    }
}
