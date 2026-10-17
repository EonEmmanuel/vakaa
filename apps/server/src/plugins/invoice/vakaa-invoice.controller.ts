import { Controller, Get, Param, Query, Req, Res, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { ChannelService, RequestContext, OrderService, Logger } from '@vendure/core';
import { InvoiceService } from '@pinelab/pinelab-invoice-plugin';

import * as crypto from 'crypto';

const INVOICE_SECRET =
    process.env.INVOICE_SECRET ||
    process.env.COOKIE_SECRET ||
    process.env.REVALIDATION_SECRET ||
    'vakaa-haute-couture-invoice-signature-key-2026';

function generateInvoiceToken(orderCode: string, customerEmail?: string): string {
    const normalizedCode = (orderCode || '').trim().toUpperCase();
    const normalizedEmail = (customerEmail || '').trim().toLowerCase();
    const payload = `${normalizedCode}:${normalizedEmail}`;
    return crypto
        .createHmac('sha256', INVOICE_SECRET)
        .update(payload)
        .digest('hex')
        .slice(0, 32);
}

function verifyInvoiceToken(
    orderCode: string,
    customerEmail: string | undefined,
    token: string | null | undefined
): boolean {
    if (!token || typeof token !== 'string') return false;
    const expected = generateInvoiceToken(orderCode, customerEmail);
    if (token.length !== expected.length) return false;
    try {
        return crypto.timingSafeEqual(Buffer.from(token, 'utf-8'), Buffer.from(expected, 'utf-8'));
    } catch {
        return false;
    }
}

@Controller('api/invoices')
export class VakaaInvoiceController {
    // Deduplicate concurrent on-the-fly generation requests for the same order code
    private inFlightGenerations = new Map<string, Promise<any>>();

    constructor(
        private moduleRef: ModuleRef,
        private channelService: ChannelService,
        private orderService: OrderService,
    ) {}

    private getInvoiceService(): InvoiceService | null {
        try {
            return this.moduleRef.get(InvoiceService, { strict: false });
        } catch {
            return null;
        }
    }

    /**
     * Storefront-friendly direct invoice download:
     * GET /api/invoices/download/:orderCode?token=... OR ?email=customer@example.com
     * Automatically resolves the default channel and generates on-the-fly if not already generated.
     * Subsequent downloads stream directly from Cloudflare R2 in milliseconds without touching Puppeteer.
     */
    @Get('download/:orderCode')
    async download(
        @Param('orderCode') orderCode: string,
        @Query('email') email: string,
        @Query('token') token: string,
        @Req() req: any,
        @Res() res: any
    ) {
        if (!orderCode) {
            throw new BadRequestException('Order code is required');
        }

        const invoiceService = this.getInvoiceService();
        if (!invoiceService) {
            throw new NotFoundException('Invoice service is unavailable');
        }

        const channel = await this.channelService.getDefaultChannel();
        if (!channel) {
            throw new NotFoundException('Channel not found');
        }

        const ctx = new RequestContext({
            apiType: 'admin',
            authorizedAsOwnerOnly: false,
            isAuthorized: true,
            channel,
        });

        const order = await this.orderService.findOneByCode(ctx, orderCode, ['customer']);
        if (!order) {
            throw new NotFoundException(`Order ${orderCode} not found`);
        }

        const customerEmail = email ? decodeURIComponent(email).trim().toLowerCase() : '';
        const orderEmail = order.customer?.emailAddress?.trim().toLowerCase();

        // Cryptographic or email security check
        let isAuthorized = false;
        if (token && orderEmail) {
            isAuthorized = verifyInvoiceToken(order.code, orderEmail, token);
        }
        if (!isAuthorized && customerEmail && orderEmail) {
            isAuthorized = orderEmail === customerEmail;
        }

        if (!isAuthorized) {
            Logger.warn(
                `Unauthorized invoice download attempt for order ${orderCode}: requested with token="${token || ''}" email="${email || ''}"`,
                'VakaaInvoicePlugin'
            );
            throw new ForbiddenException('Invalid credentials for this invoice');
        }

        // Prevent generating invoices for unfinalized cart / unplaced orders
        if (!order.orderPlacedAt) {
            Logger.warn(`Invoice requested for unplaced order ${orderCode} (state: ${order.state})`, 'VakaaInvoicePlugin');
            throw new BadRequestException(`Order ${orderCode} is not yet finalized`);
        }

        try {
            // Check if invoice already exists with valid storage reference
            let existingInvoices = await invoiceService.getInvoicesForOrder(ctx, order.id);
            let hasStoredInvoice = existingInvoices && existingInvoices.length > 0 && Boolean(existingInvoices[0].storageReference);

            // If an invoice record exists but storageReference is null, the worker is currently saving it to R2.
            // Wait briefly to allow the worker upload to complete rather than generating a duplicate.
            if (!hasStoredInvoice && existingInvoices && existingInvoices.length > 0) {
                for (let i = 0; i < 5; i++) {
                    await new Promise((resolve) => setTimeout(resolve, 500));
                    existingInvoices = await invoiceService.getInvoicesForOrder(ctx, order.id);
                    if (existingInvoices && existingInvoices.length > 0 && Boolean(existingInvoices[0].storageReference)) {
                        hasStoredInvoice = true;
                        break;
                    }
                }
            }

            if (!hasStoredInvoice) {
                Logger.info(`Generating invoice on the fly for order ${orderCode}`, 'VakaaInvoicePlugin');
                // Deduplicate concurrent on-the-fly requests for the same order
                let generationPromise = this.inFlightGenerations.get(order.code);
                if (!generationPromise) {
                    generationPromise = invoiceService.createInvoicesForOrder(channel.token, order.code, false)
                        .finally(() => {
                            this.inFlightGenerations.delete(order.code);
                        });
                    this.inFlightGenerations.set(order.code, generationPromise);
                }
                await generationPromise;
            }

            const streamOrRedirect = await invoiceService.downloadInvoice(ctx, {
                orderCode: order.code,
                customerEmail: order.customer!.emailAddress, // Pass exact DB casing for Pinelab's strict equality
                invoiceNumber: undefined,
                res,
            });

            if (typeof streamOrRedirect === 'string' || streamOrRedirect instanceof String) {
                return res.redirect(302, String(streamOrRedirect));
            } else {
                if (!res.headersSent) {
                    res.setHeader('Content-Type', 'application/pdf');
                    res.setHeader('Content-Disposition', `inline; filename="Facture-VAKAA-${order.code}.pdf"`);
                    res.setHeader('Cache-Control', 'private, max-age=86400, no-transform');
                }
                streamOrRedirect.on('error', (streamErr: any) => {
                    Logger.error(
                        `Stream error while delivering invoice for ${orderCode}: ${streamErr?.message}`,
                        'VakaaInvoicePlugin',
                        streamErr?.stack
                    );
                    if (!res.headersSent) {
                        res.status(500).send('Error streaming invoice');
                    } else {
                        res.end();
                    }
                });
                res.on('close', () => {
                    if (!res.writableEnded && typeof (streamOrRedirect as any).destroy === 'function') {
                        (streamOrRedirect as any).destroy();
                    }
                });
                return streamOrRedirect.pipe(res);
            }
        } catch (error: any) {
            if (
                error instanceof ForbiddenException ||
                error instanceof BadRequestException ||
                error instanceof NotFoundException
            ) {
                throw error;
            }

            Logger.error(
                `Failed to retrieve or generate invoice for order ${orderCode}: ${error?.message}`,
                'VakaaInvoicePlugin',
                JSON.stringify({
                    orderCode,
                    orderState: order?.state,
                    orderPlacedAt: order?.orderPlacedAt,
                    hasR2Bucket: Boolean(process.env.R2_BUCKET_NAME),
                    puppeteerPath: process.env.PUPPETEER_EXECUTABLE_PATH || 'system-default',
                    error: error?.message,
                    stack: error?.stack,
                })
            );
            throw new NotFoundException(`Invoice could not be retrieved or generated: ${error?.message || 'Internal error'}`);
        }
    }
}
