import { VendurePlugin, PluginCommonModule, ChannelService, RequestContext, Logger } from '@vendure/core';
import { OnApplicationBootstrap } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { InvoiceService } from '@pinelab/pinelab-invoice-plugin';
import { VakaaInvoiceController } from './vakaa-invoice.controller';
import { vakaaInvoiceTemplate } from './vakaa-invoice.template';

@VendurePlugin({
    imports: [PluginCommonModule],
    controllers: [VakaaInvoiceController],
    compatibility: '^3.0.0',
})
export class VakaaInvoicePlugin implements OnApplicationBootstrap {
    constructor(
        private moduleRef: ModuleRef,
        private channelService: ChannelService,
    ) {}

    async onApplicationBootstrap() {
        try {
            let invoiceService: InvoiceService | null = null;
            try {
                invoiceService = this.moduleRef.get(InvoiceService, { strict: false });
            } catch {
                invoiceService = null;
            }

            if (!invoiceService) {
                return;
            }

            const channel = await this.channelService.getDefaultChannel();
            if (!channel) return;

            const ctx = new RequestContext({
                apiType: 'admin',
                authorizedAsOwnerOnly: false,
                isAuthorized: true,
                channel,
            });

            const config = await invoiceService.getConfig(ctx);
            // Ensure invoice generation is enabled and uses the bespoke VAKAA luxury template
            if (!config || !config.enabled || !config.templateString || config.templateString.includes('pinelab.studio')) {
                await invoiceService.upsertConfig(ctx, {
                    enabled: true,
                    createCreditInvoices: true,
                    templateString: vakaaInvoiceTemplate,
                });
                Logger.info('VAKÁA luxury invoice template configured and enabled for default channel', 'VakaaInvoicePlugin');
            }
        } catch (error: any) {
            Logger.warn(`Could not auto-configure invoice template on bootstrap: ${error?.message}`, 'VakaaInvoicePlugin');
        }
    }
}
