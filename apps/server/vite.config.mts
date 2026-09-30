import { vendureDashboardPlugin } from '@vendure/dashboard/vite';
import { join, resolve } from 'path';
import { pathToFileURL } from 'url';
import { defineConfig } from 'vite';

export default defineConfig({
    base: '/dashboard',
    server: {
        host: '0.0.0.0',
        port: 5173,
    },
    publicDir: resolve(__dirname, 'public'),
    build: {
        outDir: join(__dirname, 'dist/dashboard'),
    },
    plugins: [
        vendureDashboardPlugin({
            vendureConfigPath: pathToFileURL('./src/vendure-config.ts'),
            pluginPackageScanner: {
                nodeModulesRoot: resolve(__dirname, 'node_modules'),
            },
            api: process.env.NODE_ENV === 'production'
                ? { host: 'auto', port: 'auto' }
                : { host: 'http://localhost', port: 3000 },
            gqlOutputPath: './src/gql',
            // VAKAA Luxury Artisanal Color Palette (Warm Espresso, Ivory, and Gold)
            theme: {
                light: {
                    background: '#F8F4EE',
                    foreground: '#1D120A',
                    card: '#FFFFFF',
                    'card-foreground': '#1D120A',
                    popover: '#FFFFFF',
                    'popover-foreground': '#1D120A',
                    secondary: '#EFE8DD',
                    'secondary-foreground': '#1D120A',
                    muted: '#EFE8DD',
                    'muted-foreground': '#6B5E55',
                    accent: '#F4E8D1',
                    'accent-foreground': '#1D120A',
                    border: '#E7DED0',
                    input: '#E7DED0',
                    ring: '#D4A43C',
                    sidebar: '#F2EAE0',
                    'sidebar-foreground': '#1D120A',
                    'sidebar-primary': '#1D120A',
                    'sidebar-primary-foreground': '#F8F4EE',
                    'sidebar-accent': '#E7DED0',
                    'sidebar-accent-foreground': '#1D120A',
                    'sidebar-border': '#DDD3C4',
                    'sidebar-ring': '#D4A43C',
                    brand: '#D4A43C',
                    'brand-lighter': '#F4E8D1',
                    'brand-darker': '#BF9232',
                    primary: '#1D120A',
                    'primary-foreground': '#F8F4EE',
                },
                dark: {
                    // Deep warm espresso & charcoal (replaces the blue-tinted dark mode)
                    background: '#140C06',
                    foreground: '#F8F4EE',
                    card: '#1E140C',
                    'card-foreground': '#F8F4EE',
                    popover: '#1E140C',
                    'popover-foreground': '#F8F4EE',
                    secondary: '#2A1C12',
                    'secondary-foreground': '#F8F4EE',
                    muted: '#2A1C12',
                    'muted-foreground': '#A18E81',
                    accent: '#2A1C12',
                    'accent-foreground': '#D4A43C',
                    border: '#352317',
                    input: '#352317',
                    ring: '#D4A43C',
                    sidebar: '#0E0804',
                    'sidebar-foreground': '#F8F4EE',
                    'sidebar-primary': '#D4A43C',
                    'sidebar-primary-foreground': '#140C06',
                    'sidebar-accent': '#22160E',
                    'sidebar-accent-foreground': '#D4A43C',
                    'sidebar-border': '#2B1C12',
                    'sidebar-ring': '#D4A43C',
                    brand: '#D4A43C',
                    'brand-lighter': '#F3E5C8',
                    'brand-darker': '#BF9232',
                    primary: '#D4A43C',
                    'primary-foreground': '#140C06',
                },
                additionalStylesheets: [
                    resolve(__dirname, './src/dashboard-theme.css'),
                ],
            },
        }),
        {
            name: 'vakaa-html-branding',
            transformIndexHtml(html: string) {
                const titleObserverScript = `
    <title>VAKAA Admin Dashboard</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
    <script>
      (function() {
        document.title = 'VAKAA Admin Dashboard';
        function updateTitle() {
          if (document.title.includes('Vendure')) {
            document.title = document.title.replace(/Vendure/g, 'VAKAA');
          }
        }
        updateTitle();
        if (typeof MutationObserver !== 'undefined') {
          const observer = new MutationObserver(updateTitle);
          window.addEventListener('DOMContentLoaded', function() {
            updateTitle();
            var titleEl = document.querySelector('title');
            if (titleEl) {
              observer.observe(titleEl, { childList: true, characterData: true, subtree: true });
            }
          });
        }
      })();
    </script>`;
                return html
                    .replace('<head>', '<head>' + titleObserverScript)
                    .replace(/href="[^"]*favicon\.png"/gi, 'href="/dashboard/vakaa-favicon.svg"')
                    .replace(/content="Vendure Admin Dashboard"/gi, 'content="VAKAA Admin Dashboard"');
            },
        },
        {
            name: 'vakaa-footer-transform',
            enforce: 'pre',
            transform(code: string, id: string) {
                if (id.includes('powered-by-vendure')) {
                    return code.replace(/Vendure/g, 'VAKAA');
                }
            },
        },
    ],
    resolve: {
        alias: {
            '@/gql': resolve(__dirname, './src/gql/graphql.ts'),
        },
    },
});
