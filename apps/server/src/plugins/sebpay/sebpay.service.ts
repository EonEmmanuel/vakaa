import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import {
    ChannelService,
    LanguageCode,
    Logger,
    OrderService,
    Payment,
    PaymentMethodService,
    RequestContext,
    RequestContextService,
    TransactionalConnection,
} from '@vendure/core';
import { SebpayClient } from './sebpay.client';
import { SebpayPluginOptions } from './types';

export const SEBPAY_OPTIONS = Symbol('SEBPAY_OPTIONS');
const loggerCtx = 'SebpayPlugin';

@Injectable()
export class SebpayService implements OnApplicationBootstrap {
    public readonly client: SebpayClient;

    constructor(
        @Inject(SEBPAY_OPTIONS) private readonly options: SebpayPluginOptions,
        private readonly connection: TransactionalConnection,
        private readonly paymentMethodService: PaymentMethodService,
        private readonly orderService: OrderService,
        private readonly channelService: ChannelService,
        private readonly requestContextService: RequestContextService
    ) {
        this.client = new SebpayClient(this.options);
    }

    async onApplicationBootstrap() {
        await this.autoProvisionPaymentMethod();
    }

    /**
     * Auto-provisions the SebPay payment method if not already present.
     */
    private async autoProvisionPaymentMethod() {
        try {
            const ctx = await this.requestContextService.create({ apiType: 'admin' });
            const methods = await this.paymentMethodService.findAll(ctx);
            const exists = methods.items.some((m) => m.code === 'sebpay');

            if (!exists) {
                Logger.info('Auto-provisioning SebPay payment method in default channel...', loggerCtx);
                await this.paymentMethodService.create(ctx, {
                    code: 'sebpay',
                    enabled: true,
                    handler: {
                        code: 'sebpay',
                        arguments: [
                            { name: 'publicKey', value: this.options.publicKey || '' },
                            { name: 'secretKey', value: this.options.secretKey || '' },
                            { name: 'isSandbox', value: String(this.options.isSandbox ?? true) },
                        ],
                    },
                    translations: [
                        {
                            languageCode: LanguageCode.en,
                            name: 'SebPay Mobile Money & Cards',
                            description: 'Pay with MTN MoMo, Moov, Orange Money, or Wave.',
                        },
                        {
                            languageCode: LanguageCode.fr,
                            name: 'SebPay Mobile Money & Cartes',
                            description: 'Paiement par MTN MoMo, Moov Money, Orange Money ou Wave.',
                        },
                    ],
                });
                Logger.info('SebPay payment method provisioned successfully.', loggerCtx);
            }
        } catch (err) {
            Logger.warn(`Could not auto-provision SebPay payment method: ${err instanceof Error ? err.message : String(err)}`, loggerCtx);
        }
    }

    /**
     * Reconciles a payment status with SebPay and settles/declines the order.
     */
    async reconcilePayment(ctx: RequestContext, transactionIdOrRef: string): Promise<{ settled: boolean; status: string; orderCode?: string }> {
        // Find payment by transactionId
        let payment = await this.connection
            .getRepository(ctx, Payment)
            .findOne({
                where: { transactionId: transactionIdOrRef },
                relations: ['order'],
            });

        // If not found by transactionId, search metadata by externalReference
        if (!payment) {
            const allPayments = await this.connection
                .getRepository(ctx, Payment)
                .find({ relations: ['order'] });

            payment = allPayments.find(
                (p) => (p.metadata as any)?.externalReference === transactionIdOrRef
            ) || null;
        }

        if (!payment) {
            return { settled: false, status: 'not_found' };
        }

        // Idempotency check: if already Settled or Declined, return immediate state
        if (payment.state === 'Settled') {
            return { settled: true, status: 'approved', orderCode: payment.order?.code };
        }
        if (payment.state === 'Declined' || payment.state === 'Cancelled') {
            return { settled: false, status: 'rejected', orderCode: payment.order?.code };
        }

        // Query SebPay status
        const statusResponse = await this.client.getCollectionStatus(transactionIdOrRef);
        if (!statusResponse.success || !statusResponse.data) {
            return { settled: false, status: 'query_failed' };
        }

        const remoteStatus = statusResponse.data.status;

        if (remoteStatus === 'approved') {
            // Amount verification constraint from payments-engineering
            const paidAmount = statusResponse.data.amount;
            if (paidAmount && Math.abs(paidAmount - payment.amount) > 1) {
                Logger.error(
                    `Amount mismatch on payment ${payment.id}: expected ${payment.amount}, received ${paidAmount}`,
                    loggerCtx
                );
                return { settled: false, status: 'amount_mismatch' };
            }

            Logger.info(`Settling payment ${payment.id} for order ${payment.order?.code}...`, loggerCtx);
            const result = await this.orderService.settlePayment(ctx, payment.id);

            const isSuccess = !(result as any).errorCode;
            return {
                settled: isSuccess,
                status: 'approved',
                orderCode: payment.order?.code,
            };
        }

        if (remoteStatus === 'rejected') {
            Logger.info(`Transitioning payment ${payment.id} to Declined...`, loggerCtx);
            await this.orderService.transitionPaymentToState(ctx, payment.id, 'Declined');
            return {
                settled: false,
                status: 'rejected',
                orderCode: payment.order?.code,
            };
        }

        return {
            settled: false,
            status: remoteStatus,
            orderCode: payment.order?.code,
        };
    }
}
