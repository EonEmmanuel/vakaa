import {
    Controller,
    Get,
    Headers,
    HttpStatus,
    Param,
    Post,
    Query,
    Req,
    Res,
} from '@nestjs/common';
import { Logger, RequestContextService } from '@vendure/core';
interface HttpRequest {
    body: any;
    rawBody?: Buffer | string;
    headers?: Record<string, string | string[] | undefined>;
}

interface HttpResponse {
    status(code: number): HttpResponse;
    json(data: any): HttpResponse;
    send(data?: any): HttpResponse;
}

import { SebpayService } from './sebpay.service';
import { SebpayWebhookPayload } from './types';

const loggerCtx = 'SebpayWebhook';

@Controller('payments/sebpay')
export class SebpayController {
    constructor(
        private readonly sebpayService: SebpayService,
        private readonly requestContextService: RequestContextService
    ) {}

    /**
     * Webhook endpoint to receive real-time status updates from SebPay.
     */
    @Post('webhook')
    async handleWebhook(
        @Req() req: HttpRequest,
        @Res() res: HttpResponse,
        @Headers('x-sebpay-signature') signature?: string
    ) {
        const payload = req.body as SebpayWebhookPayload;

        if (!payload || (!payload.transaction_id && !payload.external_reference)) {
            return res.status(HttpStatus.BAD_REQUEST).json({ error: 'Missing transaction details' });
        }

        // 1. Verify HMAC signature
        const rawBody =
            (req as any).rawBody?.toString('utf8') ||
            (typeof req.body === 'string' ? req.body : JSON.stringify(req.body));

        const isValid = this.sebpayService.client.verifyWebhookSignature(rawBody, signature || '');

        // If not valid and not running in mock mode, reject with 401
        if (!isValid && !process.env.SEBPAY_SANDBOX && process.env.SEBPAY_SECRET_KEY) {
            Logger.warn(`Invalid signature received on SebPay webhook. Ref: ${payload.external_reference}`, loggerCtx);
            return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Invalid HMAC signature' });
        }

        Logger.info(
            `Received SebPay webhook: tx=${payload.transaction_id}, ref=${payload.external_reference}, status=${payload.status}`,
            loggerCtx
        );

        // 2. Process reconciliation idempotently
        try {
            const ctx = await this.requestContextService.create({ apiType: 'admin' });
            const lookupId = payload.transaction_id || payload.external_reference;
            const result = await this.sebpayService.reconcilePayment(ctx, lookupId);

            Logger.info(`Webhook reconciliation result: ${result.status}, settled: ${result.settled}`, loggerCtx);

            // 3. Respond with HTTP 200 within 5 seconds as required by SebPay
            return res.status(HttpStatus.OK).json({ received: true, status: result.status });
        } catch (error) {
            Logger.error(`Error processing SebPay webhook: ${error instanceof Error ? error.message : String(error)}`, loggerCtx);
            // Return 200 to acknowledge delivery and prevent unbounded telco retry floods if internal error occurs
            return res.status(HttpStatus.OK).json({ received: true, error: 'Internal processing error' });
        }
    }

    /**
     * Endpoint for storefront client to poll payment status while awaiting USSD validation.
     */
    @Get('status/:identifier')
    async checkPaymentStatus(@Param('identifier') identifier: string) {
        try {
            const ctx = await this.requestContextService.create({ apiType: 'shop' });
            const result = await this.sebpayService.reconcilePayment(ctx, identifier);
            return result;
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Status check failed',
            };
        }
    }

    /**
     * Returns list of supported operators for a given country.
     */
    @Get('operators')
    async getOperators(@Query('country') country?: string) {
        const operators = await this.sebpayService.client.getOperators(country);
        return { success: true, operators };
    }
}
