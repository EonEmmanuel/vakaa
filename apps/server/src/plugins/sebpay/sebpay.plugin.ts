import { PluginCommonModule, Type, VendurePlugin } from '@vendure/core';
import { SebpayController } from './sebpay.controller';
import { SEBPAY_OPTIONS, SebpayService } from './sebpay.service';
import { SebpayPluginOptions } from './types';

@VendurePlugin({
    imports: [PluginCommonModule],
    controllers: [SebpayController],
    providers: [
        SebpayService,
        {
            provide: SEBPAY_OPTIONS,
            useFactory: () => SebpayPlugin.options,
        },
    ],
    compatibility: '^3.0.0',
})
export class SebpayPlugin {
    static options: SebpayPluginOptions;

    static init(options: SebpayPluginOptions): Type<SebpayPlugin> {
        this.options = options;
        return SebpayPlugin;
    }
}
