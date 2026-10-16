import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/site/i18n/request.ts');

const nextConfig: NextConfig = {
    cacheComponents: true,
    compress: true,
    poweredByHeader: false,
    images: {
        // Allow local IP for Next.js image optimizer when connecting to local Vendure backend (http://localhost:3000)
        dangerouslyAllowLocalIP: true,
        formats: ['image/avif', 'image/webp'],
        minimumCacheTTL: 60 * 60 * 24 * 30, // Cache optimized images for 30 days
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'api.vakaa.com',
            },
            {
                protocol: 'https',
                hostname: 'pub-30485365286740bc8b98cbdd12721eb6.r2.dev',
            },
            {
                protocol: 'https',
                hostname: '**.r2.dev',
            },
            {
                hostname: 'readonlydemo.vendure.io',
            },
            {
                hostname: 'demo.vendure.io'
            },
            {
                hostname: 'localhost'
            },
            {
                hostname: '127.0.0.1'
            },
            {
                hostname: 'www.my-shop.com'
            },
            {
                hostname: 'my-shop.com'
            }
        ],
    },
};

export default withNextIntl(nextConfig);
