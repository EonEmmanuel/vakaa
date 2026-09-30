import {
    Controller,
    Get,
    Headers,
    HttpStatus,
    Param,
    Post,
    Req,
    Res,
} from '@nestjs/common';
import { Logger, RequestContextService } from '@vendure/core';
import { FlutterwaveService } from './flutterwave.service';
import { FlutterwaveWebhookPayload } from './types';

interface HttpRequest {
    body: any;
    headers?: Record<string, string | string[] | undefined>;
}

interface HttpResponse {
    status(code: number): HttpResponse;
    json(data: any): HttpResponse;
    send(data?: any): HttpResponse;
}

const loggerCtx = 'FlutterwaveWebhook';

@Controller('payments/flutterwave')
export class FlutterwaveController {
    constructor(
        private readonly flutterwaveService: FlutterwaveService,
        private readonly requestContextService: RequestContextService
    ) {}

    /**
     * Webhook endpoint to receive real-time notifications from Flutterwave.
     */
    @Post('webhook')
    async handleWebhook(
        @Req() req: HttpRequest,
        @Res() res: HttpResponse,
        @Headers('verif-hash') signature?: string
    ) {
        // 1. Verify signature hash
        const isValid = this.flutterwaveService.client.verifyWebhookSignature(signature);

        if (!isValid && process.env.FLW_SECRET_HASH) {
            Logger.warn('Invalid signature hash received on Flutterwave webhook', loggerCtx);
            return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Invalid webhook signature' });
        }

        const payload = req.body as FlutterwaveWebhookPayload;

        if (!payload || !payload.data?.id) {
            return res.status(HttpStatus.BAD_REQUEST).json({ error: 'Missing transaction data' });
        }

        Logger.info(
            `Received Flutterwave webhook for tx_ref: ${payload.data.tx_ref}, id: ${payload.data.id}, status: ${payload.data.status}`,
            loggerCtx
        );

        // 2. Settle payment asynchronously / idempotently
        try {
            const ctx = await this.requestContextService.create({ apiType: 'shop' });
            await this.flutterwaveService.reconcileTransaction(ctx, payload.data.id);
        } catch (error) {
            Logger.error(
                `Error reconciling Flutterwave webhook: ${error instanceof Error ? error.message : error}`,
                loggerCtx
            );
        }

        // 3. Return HTTP 200 within 5 seconds as required by Flutterwave
        return res.status(HttpStatus.OK).json({ received: true });
    }

    /**
     * Server-to-server endpoint to verify transaction status (e.g. after customer returns to storefront).
     */
    @Get('verify/:id')
    async verifyTransaction(@Param('id') id: string) {
        try {
            const ctx = await this.requestContextService.create({ apiType: 'shop' });
            const result = await this.flutterwaveService.reconcileTransaction(ctx, id);
            return result;
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Verification failed',
            };
        }
    }
}
