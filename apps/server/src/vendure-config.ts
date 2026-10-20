import {
    dummyPaymentHandler,
    DefaultJobQueuePlugin,
    DefaultSchedulerPlugin,
    DefaultSearchPlugin,
    LanguageCode,
    ProductVariant,
    RequestContext,
    StockDisplayStrategy,
    VendureConfig,
} from '@vendure/core';
import { emailAddressChangeHandler, emailVerificationHandler, EmailPlugin, FileBasedTemplateLoader, orderConfirmationHandler, passwordResetHandler } from '@vendure/email-plugin';
import { AssetServerPlugin } from '@vendure/asset-server-plugin';
import { DashboardPlugin } from '@vendure/dashboard/plugin';
import { GraphiqlPlugin } from '@vendure/graphiql-plugin';
import { VakaaBrandingPlugin } from './plugins/vakaa-branding/vakaa-branding.plugin';
import { ContactPlugin } from './plugins/contact/contact.plugin';
import { SebpayPlugin, sebpayPaymentHandler } from './plugins/sebpay';
import { FlutterwavePlugin, flutterwavePaymentHandler } from './plugins/flutterwave';
import { InvoicePlugin, LocalFileStrategy } from '@pinelab/pinelab-invoice-plugin';
import { LimitedProductsPlugin } from '@pinelab/vendure-plugin-limited-products';
import { VakaaReviewsPlugin } from './plugins/reviews';
import { vakaaInvoiceLoadDataFn, VakaaInvoicePlugin, R2InvoiceStorageStrategy } from './plugins/invoice';
import { configureR2AssetStorage } from './plugins/r2-storage/r2-storage-strategy';
import 'dotenv/config';
import dns from 'dns';
import http from 'http';
import path from 'path';

try {
    dns.setDefaultResultOrder('ipv4first');
} catch {
    // Ignore on older Node runtimes
}

const IS_DEV = process.env.APP_ENV === 'dev';

/* Per-purpose senders (all Brevo-verified senders on vakaa.online):
   order emails FROM orders@ (global default), account emails
   (verification / password reset / address change) FROM compte@.
   Contact-form mail is sent by the contact plugin FROM contact@. */
emailVerificationHandler.setFrom('{{ accountFromAddress }}');
passwordResetHandler.setFrom('{{ accountFromAddress }}');
emailAddressChangeHandler.setFrom('{{ accountFromAddress }}');
orderConfirmationHandler.setSubject('Confirmation de commande #{{ order.code }} — Maison VAKÁA');
const vakaaEmailHandlers = [
    orderConfirmationHandler,
    emailVerificationHandler,
    passwordResetHandler,
    emailAddressChangeHandler,
];
const isPlaceholderSecret = (value?: string) =>
    !value ||
    value === 'vakaa_flw_secret_hash' ||
    value.includes('your-') ||
    value.includes('your_') ||
    value.includes('placeholder');

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

const isNeonOrSsl = (url?: string) =>
    Boolean(url?.includes('neon.tech')) || Boolean(url?.includes('sslmode=require'));

const useSsl =
    process.env.DB_SSL === 'true' ||
    isNeonOrSsl(process.env.DATABASE_URL) ||
    isNeonOrSsl(process.env.DATABASE_DIRECT_URL);

const useR2 = Boolean(
    process.env.R2_BUCKET_NAME &&
    process.env.R2_ENDPOINT &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY
);

/**
 * Vakaa Quiet Luxury Stock Display Strategy:
 * When stock <= 5, returns the exact remaining number (e.g. "2" for "Plus que 2 exemplaires disponibles").
 * When stock > 5, returns 'IN_STOCK' to protect total commercial inventory confidentiality.
 * When stock <= 0, returns 'OUT_OF_STOCK'.
 */
export class VakaaStockDisplayStrategy implements StockDisplayStrategy {
    getStockLevel(ctx: RequestContext, productVariant: ProductVariant, saleableStockLevel: number): string {
        if (saleableStockLevel <= 0) {
            return 'OUT_OF_STOCK';
        }
        if (saleableStockLevel <= 5) {
            return String(saleableStockLevel);
        }
        return 'IN_STOCK';
    }
}

export const config: VendureConfig = {
    apiOptions: {
        port: serverPort,
        adminApiPath: 'admin-api',
        shopApiPath: 'shop-api',
        trustProxy: IS_DEV ? false : 1,
        cors: {
            origin: [
                'http://localhost:3001',
                'https://vakaa.online',
                'https://www.vakaa.online',
                'https://vakaa.com',
                'https://www.vakaa.com',
                /\.vercel\.app$/,
                ...(process.env.STOREFRONT_URL ? [process.env.STOREFRONT_URL] : []),
            ],
            credentials: true,
        },
        // The following options are useful in development mode,
        // but are best turned off for production for security
        // reasons.
        ...(IS_DEV ? {
            adminApiDebug: true,
            shopApiDebug: true,
        } : {}),
    },
    catalogOptions: {
        stockDisplayStrategy: new VakaaStockDisplayStrategy(),
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
            // Reap idle connections before Neon serverless proxy terminates them (30s)
            idleTimeoutMillis: 30000,
            // 45 seconds provides adequate buffer for Neon cold-starts and cross-region latency
            connectionTimeoutMillis: 45000,
            max: 10,
        },
    },
    paymentOptions: {
        paymentMethodHandlers: [dummyPaymentHandler, sebpayPaymentHandler, flutterwavePaymentHandler],
    },
    customFields: {
        Product: [
            {
                name: 'material',
                type: 'localeString',
                label: [
                    { languageCode: LanguageCode.fr, value: 'Matière Principale' },
                    { languageCode: LanguageCode.en, value: 'Primary Material' },
                ],
            },
            {
                name: 'leatherOrigin',
                type: 'localeString',
                label: [
                    { languageCode: LanguageCode.fr, value: 'Origine Cuir & Finitions' },
                    { languageCode: LanguageCode.en, value: 'Leather Origin' },
                ],
            },
            {
                name: 'dimensions',
                type: 'string',
                label: [
                    { languageCode: LanguageCode.fr, value: 'Dimensions Estimées (H × L × P)' },
                    { languageCode: LanguageCode.en, value: 'Estimated Dimensions' },
                ],
            },
            {
                name: 'strapDrop',
                type: 'string',
                label: [
                    { languageCode: LanguageCode.fr, value: 'Hauteur Bandoulière (Strap Drop)' },
                    { languageCode: LanguageCode.en, value: 'Strap Drop' },
                ],
            },
            {
                name: 'weight',
                type: 'string',
                label: [
                    { languageCode: LanguageCode.fr, value: 'Poids Léger' },
                    { languageCode: LanguageCode.en, value: 'Weight' },
                ],
            },
            {
                name: 'artisanOrigin',
                type: 'localeString',
                label: [
                    { languageCode: LanguageCode.fr, value: 'Origine de Confection' },
                    { languageCode: LanguageCode.en, value: 'Craftsmanship Origin' },
                ],
            },
            {
                name: 'careInstructions',
                type: 'localeText',
                label: [
                    { languageCode: LanguageCode.fr, value: 'Conseils d\'Entretien' },
                    { languageCode: LanguageCode.en, value: 'Care Instructions' },
                ],
            },
            {
                name: 'isLimitedEdition',
                type: 'boolean',
                defaultValue: false,
                label: [
                    { languageCode: LanguageCode.fr, value: 'Édition Limitée' },
                    { languageCode: LanguageCode.en, value: 'Limited Edition' },
                ],
            },
            {
                name: 'curatorBadge',
                type: 'string',
                label: [
                    { languageCode: LanguageCode.fr, value: 'Badge Éditorial' },
                    { languageCode: LanguageCode.en, value: 'Curator Badge' },
                ],
            },
        ],
        ProductVariant: [
            {
                name: 'allowPreOrder',
                type: 'boolean',
                defaultValue: false,
                label: [
                    { languageCode: LanguageCode.fr, value: 'Précommande / Confection sur Mesure' },
                    { languageCode: LanguageCode.en, value: 'Allow Pre-Order' },
                ],
            },
            {
                name: 'preOrderLeadTime',
                type: 'localeString',
                label: [
                    { languageCode: LanguageCode.fr, value: 'Délai de Confection Atelier' },
                    { languageCode: LanguageCode.en, value: 'Pre-Order Lead Time' },
                ],
            },
        ],
    },
    plugins: [
        LimitedProductsPlugin,
        VakaaReviewsPlugin,
        ContactPlugin,
        GraphiqlPlugin.init(),
        AssetServerPlugin.init({
            route: 'assets',
            assetUploadDir: path.join(__dirname, '../static/assets'),
            assetUrlPrefix:
                process.env.ASSET_URL_PREFIX ||
                process.env.R2_PUBLIC_URL ||
                (process.env.VENDURE_HOST
                    ? `${process.env.VENDURE_HOST}/assets/`
                    : `http://localhost:${serverPort}/assets/`),
            ...(useR2
                ? {
                      storageStrategyFactory: configureR2AssetStorage({
                          bucket: process.env.R2_BUCKET_NAME!,
                          endpoint: process.env.R2_ENDPOINT!,
                          accessKeyId: process.env.R2_ACCESS_KEY_ID!,
                          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
                          region: process.env.R2_REGION || 'auto',
                      }) as any,
                  }
                : {}),
        }),
        DefaultSchedulerPlugin.init(),
        DefaultJobQueuePlugin.init({ useDatabaseForBuffer: true }),
        DefaultSearchPlugin.init({ bufferUpdates: true, indexStockStatus: true }),
        EmailPlugin.init(
            process.env.EMAIL_DEV_MODE === 'true' ||
            !process.env.BREVO_SMTP_KEY ||
            !process.env.BREVO_SMTP_USER
                ? {
                      devMode: true,
                      outputPath: path.join(__dirname, '../static/email/test-emails'),
                      route: 'mailbox',
                      handlers: vakaaEmailHandlers,
                      templateLoader: new FileBasedTemplateLoader(path.join(__dirname, '../static/email/templates')),
                      globalTemplateVars: {
                          fromAddress: process.env.EMAIL_FROM_ADDRESS || '"VAKÁA" <orders@vakaa.online>',
                          accountFromAddress: process.env.ACCOUNT_FROM_ADDRESS || '"VAKÁA" <compte@vakaa.online>',
                          storefrontUrl: process.env.STOREFRONT_URL || 'http://localhost:3001',
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
                  }
                : {
                      transport: {
                          type: 'smtp',
                          host: process.env.BREVO_SMTP_HOST || 'smtp-relay.brevo.com',
                          port: +(process.env.BREVO_SMTP_PORT || 587),
                          secure: process.env.BREVO_SMTP_SECURE === 'true',
                          auth: {
                              user: process.env.BREVO_SMTP_USER,
                              pass: process.env.BREVO_SMTP_KEY,
                          },
                          pool: true,
                          maxConnections: 5,
                          logging: IS_DEV,
                      },
                      handlers: vakaaEmailHandlers,
                      templateLoader: new FileBasedTemplateLoader(path.join(__dirname, '../static/email/templates')),
                      globalTemplateVars: {
                          fromAddress: process.env.EMAIL_FROM_ADDRESS || '"VAKÁA" <orders@vakaa.online>',
                          accountFromAddress: process.env.ACCOUNT_FROM_ADDRESS || '"VAKÁA" <compte@vakaa.online>',
                          storefrontUrl: process.env.STOREFRONT_URL || 'http://localhost:3001',
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
                  }
        ),
        DashboardPlugin.init({
            route: 'dashboard',
            appDir: IS_DEV
                ? path.join(__dirname, '../dist/dashboard')
                : path.join(__dirname, 'dashboard'),
        }),
        VakaaBrandingPlugin,
        SebpayPlugin.init({
            publicKey: process.env.SEBPAY_PUBLIC_KEY || '',
            secretKey: process.env.SEBPAY_SECRET_KEY || '',
            isSandbox: process.env.SEBPAY_SANDBOX === 'true' || IS_DEV,
            webhookUrl: process.env.SEBPAY_WEBHOOK_URL || '',
            mockMode: !process.env.SEBPAY_SECRET_KEY && IS_DEV,
            // Paused by default until the provider is verified. Flip
            // SEBPAY_ENABLED=true to re-enable the payment method.
            enabled: process.env.SEBPAY_ENABLED === 'true',
        }),
        FlutterwavePlugin.init({
            publicKey: process.env.FLW_PUBLIC_KEY || '',
            secretKey: process.env.FLW_SECRET_KEY || '',
            // A known fallback must only exist for local sandbox testing. In
            // production a missing secret causes webhook verification to fail closed.
            secretHash: !isPlaceholderSecret(process.env.FLW_SECRET_HASH)
                ? process.env.FLW_SECRET_HASH!
                : (IS_DEV ? 'vakaa_flw_secret_hash' : ''),
            isSandbox: process.env.FLW_SANDBOX === 'true' || IS_DEV,
            webhookUrl: process.env.FLW_WEBHOOK_URL || '',
            mockMode: !process.env.FLW_SECRET_KEY && IS_DEV,
        }),
        InvoicePlugin.init({
            vendureHost: process.env.VENDURE_HOST || `http://localhost:${serverPort}`,
            loadDataFn: vakaaInvoiceLoadDataFn,
            storageStrategy: useR2
                ? new R2InvoiceStorageStrategy({
                      bucket: process.env.R2_BUCKET_NAME!,
                      endpoint: process.env.R2_ENDPOINT!,
                      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
                      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
                      region: process.env.R2_REGION || 'auto',
                  })
                : new LocalFileStrategy(),
            puppeteerLaunchOptions: {
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-gpu',
                    '--disable-software-rasterizer',
                    '--no-first-run',
                ],
            },
        }),
        VakaaInvoicePlugin,
    ],
};

/**
 * Configuration specifically for schema migrations.
 * In Neon, PgBouncer connection pooling operates in transaction mode. Schema migrations
 * (DDL statements, locks, and session-level commands) should run via the direct connection
 * (DATABASE_DIRECT_URL) to bypass transaction-mode limitations.
 * If DATABASE_DIRECT_URL is not set, it gracefully falls back to the primary DATABASE_URL.
 */
export const migrationConfig: VendureConfig = {
    ...config,
    dbConnectionOptions: {
        ...config.dbConnectionOptions,
        ...(process.env.DATABASE_DIRECT_URL
            ? {
                  url: process.env.DATABASE_DIRECT_URL,
              }
            : {}),
    },
};
