import {
    dummyPaymentHandler,
    DefaultJobQueuePlugin,
    DefaultSchedulerPlugin,
    DefaultSearchPlugin,
    VendureConfig,
} from '@vendure/core';
import { defaultEmailHandlers, EmailPlugin, FileBasedTemplateLoader } from '@vendure/email-plugin';
import { AssetServerPlugin } from '@vendure/asset-server-plugin';
import { DashboardPlugin } from '@vendure/dashboard/plugin';
import { GraphiqlPlugin } from '@vendure/graphiql-plugin';
import { VakaaBrandingPlugin } from './plugins/vakaa-branding/vakaa-branding.plugin';
import 'dotenv/config';
import http from 'http';
import path from 'path';

const IS_DEV = process.env.APP_ENV === 'dev';

// Stabilize Dashboard Vite dev server detection to prevent rapid mode-flapping on Windows
if (IS_DEV) {
    let lastViteCheck = 0;
    let lastViteStatus = false;
    let checkPromise: Promise<boolean> | null = null;

    const probe = (host: string, port: number) => new Promise<boolean>((resolve) => {
        const req = http.request({
            hostname: host,
            port: port || 5173,
            path: '/',
            method: 'HEAD',
            timeout: 1500,
        }, (res) => {
            res.resume();
            resolve(res.statusCode !== undefined && res.statusCode < 400);
        });
        req.on('error', () => resolve(false));
        req.on('timeout', () => { req.destroy(); resolve(false); });
        req.end();
    });

    (DashboardPlugin.prototype as any).checkViteDevServer = function (port: number) {
        const now = Date.now();
        if (now - lastViteCheck < (lastViteStatus ? 5000 : 1500)) {
            return Promise.resolve(lastViteStatus);
        }
        if (checkPromise) {
            return checkPromise;
        }
        checkPromise = (async () => {
            let ok = await probe('localhost', port);
            if (!ok) {
                ok = await probe('127.0.0.1', port);
            }
            lastViteStatus = ok;
            lastViteCheck = Date.now();
            return ok;
        })().finally(() => {
            checkPromise = null;
        });
        return checkPromise;
    };
}

// PORT wins because hosting platforms inject it into the environment at runtime, and that
// must take precedence over any value baked into the .env file at scaffold time.
const serverPort = +process.env.PORT || +process.env.VENDURE_SERVER_PORT || 3000;

const useSsl =
    process.env.DB_SSL === 'true' ||
    Boolean(process.env.DATABASE_URL?.includes('neon.tech')) ||
    Boolean(process.env.DATABASE_URL?.includes('sslmode=require'));

export const config: VendureConfig = {
    apiOptions: {
        port: serverPort,
        adminApiPath: 'admin-api',
        shopApiPath: 'shop-api',
        trustProxy: IS_DEV ? false : 1,
        // The following options are useful in development mode,
        // but are best turned off for production for security
        // reasons.
        ...(IS_DEV ? {
            adminApiDebug: true,
            shopApiDebug: true,
        } : {}),
    },
    authOptions: {
        tokenMethod: ['bearer', 'cookie'],
        // When REQUIRE_EMAIL_VERIFICATION is not explicitly set to 'true', allow immediate sign-in without email constraints
        requireVerification: process.env.REQUIRE_EMAIL_VERIFICATION === 'true',
        superadminCredentials: {
            identifier: process.env.SUPERADMIN_USERNAME,
            password: process.env.SUPERADMIN_PASSWORD,
        },
        cookieOptions: {
          secret: process.env.COOKIE_SECRET,
        },
    },
    dbConnectionOptions: {
        type: 'postgres',
        synchronize: process.env.DB_SYNCHRONIZE === 'true',
        migrations: [path.join(__dirname, './migrations/*.+(js|ts)')],
        logging: false,
        schema: process.env.DB_SCHEMA || 'public',
        ...(process.env.DATABASE_URL
            ? {
                  url: process.env.DATABASE_URL,
              }
            : {
                  database: process.env.DB_NAME,
                  host: process.env.DB_HOST,
                  port: process.env.DB_PORT ? +process.env.DB_PORT : 5432,
                  username: process.env.DB_USERNAME,
                  password: process.env.DB_PASSWORD,
              }),
        ...(useSsl
            ? {
                  ssl: {
                      rejectUnauthorized: false,
                  },
              }
            : {}),
        extra: {
            // Keep cloud connection alive with periodic TCP heartbeats
            keepAlive: true,
            keepAliveInitialDelayMillis: 10000,
            // Safely close idle connections before Neon proxy disconnects them
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 10000,
            max: 10,
        },
    },
    paymentOptions: {
        paymentMethodHandlers: [dummyPaymentHandler],
    },
    // When adding or altering custom field definitions, the database will
    // need to be updated. See the "Migrations" section in README.md.
    customFields: {},
    plugins: [
        GraphiqlPlugin.init(),
        AssetServerPlugin.init({
            route: 'assets',
            assetUploadDir: path.join(__dirname, '../static/assets'),
            // For local dev, the correct value for assetUrlPrefix should
            // be guessed correctly, but for production it will usually need
            // to be set manually to match your production url.
            assetUrlPrefix: IS_DEV ? undefined : 'https://www.my-shop.com/assets/',
        }),
        DefaultSchedulerPlugin.init(),
        DefaultJobQueuePlugin.init({ useDatabaseForBuffer: true }),
        DefaultSearchPlugin.init({ bufferUpdates: false, indexStockStatus: true }),
        EmailPlugin.init({
            devMode: true,
            outputPath: path.join(__dirname, '../static/email/test-emails'),
            route: 'mailbox',
            handlers: defaultEmailHandlers,
            templateLoader: new FileBasedTemplateLoader(path.join(__dirname, '../static/email/templates')),
            globalTemplateVars: {
                fromAddress: '"VAKAA" <noreply@vakaa.store>',
                verifyEmailAddressUrl: process.env.STOREFRONT_URL
                    ? `${process.env.STOREFRONT_URL}/verify`
                    : 'http://localhost:3001/verify',
                passwordResetUrl: process.env.STOREFRONT_URL
                    ? `${process.env.STOREFRONT_URL}/reset-password`
                    : 'http://localhost:3001/reset-password',
                changeEmailAddressUrl: process.env.STOREFRONT_URL
                    ? `${process.env.STOREFRONT_URL}/verify-email-address-change`
                    : 'http://localhost:3001/verify-email-address-change',
            },
        }),
        DashboardPlugin.init({
            route: 'dashboard',
            appDir: IS_DEV
                ? path.join(__dirname, '../dist/dashboard')
                : path.join(__dirname, 'dashboard'),
        }),
        VakaaBrandingPlugin,
    ],
};
