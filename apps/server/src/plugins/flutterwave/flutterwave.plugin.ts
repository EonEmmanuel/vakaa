import { PluginCommonModule, Type, VendurePlugin } from '@vendure/core';
import { FlutterwaveController } from './flutterwave.controller';
import { flutterwavePaymentHandler } from './flutterwave.handler';
import { FlutterwaveService } from './flutterwave.service';
import { FlutterwavePluginOptions } from './types';

@VendurePlugin({
    imports: [PluginCommonModule],
    controllers: [FlutterwaveController],
    providers: [
        FlutterwaveService,
        {
            provide: 'FLUTTERWAVE_PLUGIN_OPTIONS',
            useFactory: () => FlutterwavePlugin.options,
        },
    ],
    configuration: (config) => {
        config.paymentOptions.paymentMethodHandlers.push(flutterwavePaymentHandler);
        return config;
    },
    compatibility: '^3.0.0',
})
export class FlutterwavePlugin {
    static options: FlutterwavePluginOptions;

    static init(options: FlutterwavePluginOptions): Type<FlutterwavePlugin> {
        this.options = options;
        return FlutterwavePlugin;
    }
}
