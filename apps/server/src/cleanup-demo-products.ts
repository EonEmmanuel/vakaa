import {
    bootstrap,
    ChannelService,
    DefaultLogger,
    JobQueueService,
    LanguageCode,
    LogLevel,
    ProductService,
    RequestContextService,
    SearchService,
} from '@vendure/core';
import { config } from './vendure-config';

const VAKAA_SLUGS = new Set([
    'maa-tote',
    'kemi-shoulder-bag',
    'zuri-clutch',
    'asa-crossbody',
    'aya-cardholder',
    'baguette-indigo-savane',
    'baguette-terre-emeraude',
]);

const cleanConfig = {
    ...config,
    apiOptions: {
        ...config.apiOptions,
        port: 3053,
    },
    logger: new DefaultLogger({ level: LogLevel.Info }),
};

async function run() {
    console.log('🧹 Starting cleanup of legacy demo products...');
    const app = await bootstrap(cleanConfig);
    const jobQueueService = app.get(JobQueueService);
    await jobQueueService.start();

    const channelService = app.get(ChannelService);
    const defaultChannel = await channelService.getDefaultChannel();
    const reqCtxService = app.get(RequestContextService);

    const ctx = await reqCtxService.create({
        apiType: 'admin',
        channelOrToken: defaultChannel,
        languageCode: LanguageCode.en,
    });

    const productService = app.get(ProductService);
    const searchService = app.get(SearchService);

    const allProducts = await productService.findAll(ctx, { take: 250 });
    console.log(`Found total ${allProducts.items.length} products in DB.`);

    let deletedCount = 0;
    let retainedCount = 0;

    for (const product of allProducts.items) {
        if (!VAKAA_SLUGS.has(product.slug)) {
            console.log(`  🗑️  Deleting legacy product: ${product.name} (id: ${product.id}, slug: ${product.slug})`);
            try {
                await productService.softDelete(ctx, product.id);
                deletedCount++;
            } catch (err: any) {
                console.error(`  Failed to delete product ${product.name}:`, err?.message || err);
            }
        } else {
            console.log(`  👜 Retaining authentic VAKAA product: ${product.name} (id: ${product.id}, slug: ${product.slug})`);
            retainedCount++;
        }
    }

    console.log(`Summary: Deleted ${deletedCount} legacy products, retained ${retainedCount} VAKAA products.`);

    console.log('🔍 Reindexing Vendure Search Service...');
    await searchService.reindex(ctx);

    console.log('⏳ Waiting for background job queues to settle...');
    await new Promise(resolve => setTimeout(resolve, 6000));

    await app.close();
    console.log('🎉 Cleanup and reindexing completed successfully!');
    process.exit(0);
}

run().catch(err => {
    console.error('❌ Error during demo cleanup:', err);
    process.exit(1);
});
