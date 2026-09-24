import type {Metadata} from 'next';
import {Suspense} from 'react';
import {getRouteLocale} from '@/platform/i18n/server';
import {HeroSection} from '@/site/home/hero-section';
import {TrustBar} from '@/site/home/trust-bar';
import {CollectionGridPreview} from '@/site/home/collection-grid-preview';
import {HeritageSavoirFaire} from '@/site/home/heritage-savoir-faire';
import {BestSellersPreview} from '@/site/home/best-sellers-preview';
import {TribeNewsletter} from '@/site/home/tribe-newsletter';
import {SITE_NAME, SITE_URL, buildCanonicalUrl} from '@/config/metadata';
import {getTranslations} from 'next-intl/server';
import {toOgLocale} from '@/platform/i18n/locale-utils';

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getRouteLocale();
    const t = await getTranslations({locale, namespace: 'Home'});
    const ogLocale = toOgLocale(locale);

    return {
        title: {
            absolute: `${SITE_NAME} — ${t('pageTitle')}`,
        },
        description: t('description'),
        alternates: {
            canonical: buildCanonicalUrl('/'),
        },
        openGraph: {
            title: `${SITE_NAME} — ${t('pageTitle')}`,
            description: t('ogDescription'),
            type: 'website',
            locale: ogLocale,
            url: SITE_URL,
        },
    };
}

export default async function Home() {
    return (
        <div className="min-h-screen bg-[#F8F4EE] dark:bg-[#140C06] transition-colors">
            {/* Chapter 1: Cinematic Afro-Futuristic Hero */}
            <HeroSection />

            {/* Chapter 1b: 4-Pillar Artisan & Regional Trust Foundation */}
            <TrustBar />

            {/* Chapter 2: Curated Lines & Asymmetric Editorial Showcase */}
            <CollectionGridPreview />

            {/* Chapter 3: Heritage & Savoir-Faire — The Master Artisans & Slow Luxury */}
            <HeritageSavoirFaire />

            {/* Chapter 4: Curated Catalog — Live Vendure Products in High-Fashion Portrait Ratio */}
            <Suspense fallback={<div className="h-96 w-full animate-pulse bg-[#EFE8DD]/30 dark:bg-[#1A120B]/30" />}>
                <BestSellersPreview />
            </Suspense>

            {/* Chapter 5: Le Cercle Privé — Obsidian & Gold VIP Concierge Invitation */}
            <TribeNewsletter />
        </div>
    );
}
