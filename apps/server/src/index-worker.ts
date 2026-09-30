import dns from 'dns';
try {
    dns.setDefaultResultOrder('ipv4first');
} catch {}

import { bootstrapWorker } from '@vendure/core';
import { config } from './vendure-config';

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

// Handle transient cloud database/DNS dropouts gracefully without crashing the worker process
process.on('uncaughtException', (err: any) => {
    if (checkTransientNetworkError(err)) {
        console.warn(
            `[Vendure Worker] Transient database/network disconnection (${err.code || err.name || 'TIMEOUT'}): ${err.message || err}. Retrying on next cycle...`
        );
        return;
    }
    console.error('[Vendure Worker] Fatal Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason: any) => {
    if (checkTransientNetworkError(reason)) {
        console.warn(
            `[Vendure Worker] Transient database/network rejection (${reason?.code || reason?.name || 'TIMEOUT'}): ${reason?.message || reason}. Retrying on next cycle...`
        );
        return;
    }
    console.error('[Vendure Worker] Unhandled Rejection:', reason);
});

bootstrapWorker(config)
    .then(worker => worker.startJobQueue())
    .catch(err => {
        console.error('[Vendure Worker] Bootstrap error:', err);
    });
