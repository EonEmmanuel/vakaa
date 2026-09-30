import { Controller, Get, Param, Query, Req, Res, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { ChannelService, RequestContext, OrderService, Logger } from '@vendure/core';
import { InvoiceService } from '@pinelab/pinelab-invoice-plugin';

@Controller('api/invoices')
export class VakaaInvoiceController {
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
     * GET /api/invoices/download/:orderCode?email=customer@example.com
     * Automatically resolves the default channel and generates on-the-fly if not already generated.
     */
    @Get('download/:orderCode')
    async download(
        @Param('orderCode') orderCode: string,
        @Query('email') email: string,
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

        // Verify authorization: email must match order customer
        if (orderEmail && customerEmail && orderEmail !== customerEmail) {
            Logger.warn(
                `Unauthorized invoice download attempt for order ${orderCode}: requested with ${customerEmail}, expected ${orderEmail}`,
                'VakaaInvoicePlugin'
            );
            throw new ForbiddenException('Invalid credentials for this invoice');
        }

        try {
            // Check if invoice already exists; if not, create it immediately
            const existingInvoices = await invoiceService.getInvoicesForOrder(ctx, order.id);
            if (!existingInvoices || existingInvoices.length === 0) {
                Logger.info(`Generating invoice on the fly for order ${orderCode}`, 'VakaaInvoicePlugin');
                await invoiceService.createInvoicesForOrder(channel.token, order.code, false);
            }

            const streamOrRedirect = await invoiceService.downloadInvoice(ctx, {
                orderCode: order.code,
                customerEmail: order.customer?.emailAddress || customerEmail,
                invoiceNumber: undefined,
                res,
            });

            if (typeof streamOrRedirect === 'string' || streamOrRedirect instanceof String) {
                return res.redirect(302, String(streamOrRedirect));
            } else {
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `inline; filename="Facture-VAKAA-${order.code}.pdf"`);
                return streamOrRedirect.pipe(res);
            }
        } catch (error: any) {
            Logger.error(`Error streaming invoice for ${orderCode}: ${error?.message}`, 'VakaaInvoicePlugin', error);
            throw new NotFoundException('Invoice could not be retrieved or generated');
        }
    }
}
