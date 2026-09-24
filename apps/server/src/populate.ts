import { bootstrap, DefaultLogger, LogLevel, JobQueueService } from '@vendure/core';
import { populate } from '@vendure/core/cli';
import fs from 'fs';
import path from 'path';
import { config } from './vendure-config';

// Locate demo data from @vendure/create
const vendureCreateAssets = path.join(__dirname, '../node_modules/@vendure/create/assets');
const initialDataPath = path.join(vendureCreateAssets, 'initial-data.json');
const productsCsvPath = path.join(vendureCreateAssets, 'products.csv');
const imagesPath = path.join(vendureCreateAssets, 'images');

if (!fs.existsSync(initialDataPath) || !fs.existsSync(productsCsvPath)) {
    console.error(`Could not locate demo data in ${vendureCreateAssets}. Make sure @vendure/create is installed.`);
    process.exit(1);
}

const populateConfig = {
    ...config,
    dbConnectionOptions: {
        ...config.dbConnectionOptions,
        synchronize: true,
    },
    importExportOptions: {
        importAssetsDir: imagesPath,
    },
    logger: new DefaultLogger({ level: LogLevel.Info }),
};

async function run() {
    console.log('Connecting to database and populating demo content...');
    const dbOpts = config.dbConnectionOptions as any;
    console.log('Database target:', dbOpts.url ? '[DATABASE_URL configured]' : `${dbOpts.username}@${dbOpts.host}:${dbOpts.port}/${dbOpts.database}`);

    const app = await populate(
        async () => {
            const _app = await bootstrap(populateConfig);
            await _app.get(JobQueueService).start();
            return _app;
        },
        initialDataPath,
        productsCsvPath,
    );

    console.log('\n======================================================');
    console.log('Demo content successfully populated into database!');
    console.log('======================================================\n');

    // Give asynchronous asset and index worker jobs a brief moment to settle
    await new Promise(resolve => setTimeout(resolve, 5000));
    await app.close();
    process.exit(0);
}

run().catch(err => {
    console.error('Error during data population:', err);
    process.exit(1);
});
