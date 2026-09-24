import {
    bootstrap,
    ChannelService,
    CollectionService,
    DefaultLogger,
    Importer,
    JobQueueService,
    LanguageCode,
    LogLevel,
    Populator,
    ProductService,
    RequestContextService,
    SearchService,
} from '@vendure/core';
import fs from 'fs';
import path from 'path';
import { config } from './vendure-config';

const importAssetsDir = path.join(__dirname, '../static/vakaa-import-assets');
const productsCsvPath = path.join(__dirname, 'vakaa-products.csv');

const populateConfig = {
    ...config,
    apiOptions: {
        ...config.apiOptions,
        port: 3052,
    },
    importExportOptions: {
        importAssetsDir,
    },
    logger: new DefaultLogger({ level: LogLevel.Info }),
};

const FRENCH_PRODUCT_TRANSLATIONS: Record<string, { name: string; description: string }> = {
    'maa-tote': {
        name: 'Cabas Maa',
        description: 'Façonné à la main en raphia 100% naturel et cuir tanné végétal noble par des maîtres artisans ghanéens. Spacieux, élégant et intemporel.',
    },
    'kemi-shoulder-bag': {
        name: 'Sac Épaule Kemi',
        description: 'Rehaussé d\'accents de tissu Ankara authentique, cuir noir lisse et ferrures dorées. La pièce maîtresse idéale du jour à la nuit.',
    },
    'zuri-clutch': {
        name: 'Pochette Zuri',
        description: 'Raphia tissé doré avec armature en cuir structuré et fermoir en laiton. Conçu pour sublimer vos soirées d\'une sophistication africaine.',
    },
    'asa-crossbody': {
        name: 'Sac Bandoulière Asa',
        description: 'Polyvalence compacte et héritage artisanal. Confectionné en cuir au tannage végétal avec bandoulière ajustable pour un luxe quotidien sans effort.',
    },
    'aya-cardholder': {
        name: 'Porte-Cartes Aya',
        description: 'Porte-cartes en cuir pleine fleur cousu main avec insigne VAKAA embossé à la feuille de laiton. Dispose de 4 fentes pour cartes et d\'un compartiment central.',
    },
    'baguette-indigo-savane': {
        name: 'Baguette Indigo Savane',
        description: 'Sac baguette emblématique minutieusement façonné en textile africain tissé main indigo profond et ivoire, doté d\'une anse en cuir bleu nuit noble et de ferrures argentées.',
    },
    'baguette-terre-emeraude': {
        name: 'Baguette Terre & Émeraude',
        description: 'Sac baguette d\'épaule architectural associant un tissage artisanal rayé terracotta, vert émeraude et monochrome, rehaussé d\'une anse en cuir noir noble.',
    },
};

const VAKAA_COLLECTIONS_DATA = {
    defaultLanguage: LanguageCode.en,
    collections: [
        {
            name: 'Tote Bags',
            slug: 'tote-bags',
            description: 'Handcrafted woven raffia and structured luxury totes.',
            assetPaths: ['maa-tote.jpg'],
            filters: [
                {
                    code: 'facet-value-filter',
                    args: {
                        facetValueNames: ['category:Tote Bags'],
                        containsAny: false,
                    },
                },
            ],
        },
        {
            name: 'Shoulder Bags',
            slug: 'shoulder-bags',
            description: 'Timeless shoulder bags and baguettes crafted for day-to-night elegance.',
            assetPaths: ['kemi-shoulder.jpg'],
            filters: [
                {
                    code: 'facet-value-filter',
                    args: {
                        facetValueNames: ['category:Shoulder Bags'],
                        containsAny: false,
                    },
                },
            ],
        },
        {
            name: 'Clutches',
            slug: 'clutches',
            description: 'Refined evening clutches and artisanal minaudières.',
            assetPaths: ['zuri-clutch.jpg'],
            filters: [
                {
                    code: 'facet-value-filter',
                    args: {
                        facetValueNames: ['category:Clutches'],
                        containsAny: false,
                    },
                },
            ],
        },
        {
            name: 'Crossbodies',
            slug: 'crossbodies',
            description: 'Hands-free luxury crossbodies handcrafted from rich vegetable-tanned leather.',
            assetPaths: ['asa-crossbody.jpg'],
            filters: [
                {
                    code: 'facet-value-filter',
                    args: {
                        facetValueNames: ['category:Crossbodies'],
                        containsAny: false,
                    },
                },
            ],
        },
        {
            name: 'Accessories',
            slug: 'accessories',
            description: 'Bespoke cardholders, wallets, and leathercraft accessories.',
            assetPaths: ['aya-cardholder.jpg'],
            filters: [
                {
                    code: 'facet-value-filter',
                    args: {
                        facetValueNames: ['category:Accessories'],
                        containsAny: false,
                    },
                },
            ],
        },
    ],
};

const FRENCH_COLLECTION_TRANSLATIONS: Record<string, { name: string; description: string }> = {
    'tote-bags': {
        name: 'Cabas & Vannerie Noble',
        description: 'Cabas et paniers d\'exception en raphia noble et cuir.',
    },
    'shoulder-bags': {
        name: 'Sacs Porté Épaule',
        description: 'Sacs portés épaule et baguettes emblématiques façonnés pour une élégance du jour à la nuit.',
    },
    'clutches': {
        name: 'Pochettes & Minaudières',
        description: 'Pochettes de soirée raffinées et minaudières d\'exception.',
    },
    'crossbodies': {
        name: 'Sacs Bandoulière',
        description: 'Sacs bandoulière mains-libres façonnés en cuir noble au tannage végétal.',
    },
    'accessories': {
        name: 'Petite Maroquinerie',
        description: 'Porte-cartes, portefeuilles et petite maroquinerie d\'artisanat noble.',
    },
};

async function run() {
    console.log('🚀 Starting VAKAA luxury catalog seeding...');
    const app = await bootstrap(populateConfig);
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
    const collectionService = app.get(CollectionService);
    const searchService = app.get(SearchService);

    // 1. Remove old demo collections
    console.log('📦 Cleaning up old demo collections...');
    const existingCollections = await collectionService.findAll(ctx, { take: 100 });
    for (const col of existingCollections.items) {
        if (col.name !== '__root_collection__' && col.slug !== '__root_collection__') {
            try {
                console.log(`  Deleting collection: ${col.name} (id: ${col.id})`);
                await collectionService.delete(ctx, col.id);
            } catch (err: any) {
                console.log(`  Notice on collection ${col.name}: ${err?.message || err}`);
            }
        }
    }

    // 2. Remove old demo products
    console.log('🧹 Cleaning up old demo products...');
    const existingProducts = await productService.findAll(ctx, { take: 250 });
    for (const p of existingProducts.items) {
        try {
            console.log(`  Deleting demo product: ${p.name} (id: ${p.id})`);
            await productService.softDelete(ctx, p.id);
        } catch (err: any) {
            console.log(`  Notice on product ${p.name}: ${err?.message || err}`);
        }
    }

    // 3. Import VAKAA luxury products from CSV
    console.log('✨ Importing VAKAA authentic luxury products...');
    const importer = app.get(Importer);
    const csvContent = await fs.promises.readFile(productsCsvPath, 'utf-8');
    const importResult: any = await new Promise((resolve, reject) => {
        let lastVal: any;
        importer.parseAndImport(csvContent, ctx, false).subscribe({
            next: (val) => { lastVal = val; },
            error: (err) => reject(err),
            complete: () => resolve(lastVal),
        });
    });
    console.log(`  Successfully imported: ${importResult?.imported ?? 0} products. Errors: ${importResult?.errors?.length || 0}`);
    if (importResult?.errors && importResult.errors.length) {
        console.error('  Import errors:', importResult.errors);
    }

    // 4. Create collections via Populator
    console.log('📂 Creating VAKAA collections with facet filters...');
    const populator = app.get(Populator);
    await populator.populateCollections(VAKAA_COLLECTIONS_DATA as any, defaultChannel);

    // 5. Add French translations to products
    console.log('🇫🇷 Adding French translations to products...');
    const allProducts = await productService.findAll(ctx, { take: 100 });
    for (const p of allProducts.items) {
        const tr = FRENCH_PRODUCT_TRANSLATIONS[p.slug];
        if (tr) {
            console.log(`  Updating FR translation for: ${p.name}`);
            await productService.update(ctx, {
                id: p.id,
                translations: [
                    {
                        languageCode: LanguageCode.fr,
                        name: tr.name,
                        slug: p.slug,
                        description: tr.description,
                    },
                ],
            });
        }
    }

    // 6. Add French translations to collections
    console.log('🇫🇷 Adding French translations to collections...');
    const updatedCollections = await collectionService.findAll(ctx, { take: 100 });
    for (const col of updatedCollections.items) {
        const tr = FRENCH_COLLECTION_TRANSLATIONS[col.slug];
        if (tr) {
            console.log(`  Updating FR translation for collection: ${col.name}`);
            await collectionService.update(ctx, {
                id: col.id,
                translations: [
                    {
                        languageCode: LanguageCode.fr,
                        name: tr.name,
                        slug: col.slug,
                        description: tr.description,
                    },
                ],
            });
        }
    }

    // 7. Trigger search reindexing
    console.log('🔍 Reindexing Vendure Search Service...');
    await searchService.reindex(ctx);

    console.log('⏳ Waiting for background job queues to settle...');
    await new Promise(resolve => setTimeout(resolve, 8000));

    await app.close();
    console.log('🎉 VAKAA luxury catalog seeding completed successfully!');
    process.exit(0);
}

run().catch(err => {
    console.error('❌ Error during catalog seeding:', err);
    process.exit(1);
});
