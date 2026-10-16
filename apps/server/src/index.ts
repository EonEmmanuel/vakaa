import dns from 'dns';
try {
    dns.setDefaultResultOrder('ipv4first');
} catch {}

import { bootstrap, runMigrations } from '@vendure/core';
import { config, migrationConfig } from './vendure-config';
import { syncVakaaAssets } from './sync-assets';

function checkTransientNetworkError(err: any): boolean {
    if (!err) return false;
    const msg = String(err.message || err);
    return (
        err?.code === 'ENOTFOUND' ||
        err?.code === 'ECONNRESET' ||
        err?.code === 'EAI_AGAIN' ||
        err?.code === 'ETIMEDOUT' ||
        err?.name === 'AggregateError' ||
        (Array.isArray(err?.errors) && err.errors.some((e: any) => checkTransientNetworkError(e))) ||
        msg.includes('Connection terminated unexpectedly') ||
        msg.includes('ETIMEDOUT') ||
        msg.includes('ChannelService.allChannels')
    );
}

// Handle transient cloud database/DNS dropouts gracefully without crashing the server process
process.on('uncaughtException', (err: any) => {
    if (checkTransientNetworkError(err)) {
        console.warn(
            `[Vendure Server] Transient database/network disconnection (${err.code || err.name || 'TIMEOUT'}): ${err.message || err}. Retrying on next cycle...`
        );
        return;
    }
    console.error('[Vendure Server] Fatal Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason: any) => {
    if (checkTransientNetworkError(reason)) {
        console.warn(
            `[Vendure Server] Transient database/network rejection (${reason?.code || reason?.name || 'TIMEOUT'}): ${reason?.message || reason}. Retrying on next cycle...`
        );
        return;
    }
    console.error('[Vendure Server] Unhandled Rejection:', reason);
});

// Suppress known TypeORM upstream pg query queue deprecation notice until TypeORM serializes queries in pg 9.0
process.on('warning', (warning) => {
    if (warning.name === 'DeprecationWarning' && warning.message.includes('Calling client.query()')) {
        return;
    }
    console.warn(`[Node Warning] ${warning.name}: ${warning.message}`);
});

// Ensure all product image assets are synchronized to Vendure storage
syncVakaaAssets();

runMigrations(migrationConfig)
    .then(() => bootstrap(config))
    .catch(err => {
        console.error('[Vendure Server] Fatal bootstrap error:', err);
        process.exit(1);
    });
