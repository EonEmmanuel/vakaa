import type {Metadata} from 'next';
import {Suspense} from 'react';
import {getRouteLocale} from '@/platform/i18n/server';
import {HeroSection} from '@/site/home/hero-section';
import {RollingTextMarquee} from '@/site/home/rolling-text-marquee';
import {BestSellersPreview} from '@/site/home/best-sellers-preview';
import {FeaturedBagSpotlight} from '@/site/home/featured-bag-spotlight';
import {TrustBar} from '@/site/home/trust-bar';
import {CollectionGridPreview} from '@/site/home/collection-grid-preview';
import {PrivateCircleNewsletter} from '@/site/home/private-circle-newsletter';
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
        <div className="min-h-screen bg-background text-foreground">
            {/* Cinematic Full-Viewport Hero */}
            <HeroSection />

            {/* Architectural Rolling Text Marquee (Exact KVIST Craftsmanship Ticker) */}
            <RollingTextMarquee />

            {/* Category Bento Grid (Exact KVIST 'Find your corner' Section) */}
            <CollectionGridPreview />

            {/* Flagship Product Showcase (Exact KVIST 'This week's favourites' Section) */}
            <Suspense fallback={<div className="h-96 w-full bg-background" />}>
                <BestSellersPreview />
            </Suspense>

            {/* Editorial Product Spotlight — Asymmetric Split */}
            <Suspense fallback={<div className="h-96 w-full bg-background" />}>
                <FeaturedBagSpotlight />
            </Suspense>

            {/* The Promise Bento Strip (Exact KVIST 'Buy once, keep for good' Section) */}
            <TrustBar />

            {/* Fake testimonials + Instagram mosaic sections removed (no real data yet) */}

            {/* FAQ Accordion (commented out per user instruction) */}
            {/* <FaqSection /> */}

            {/* Dark Newsletter CTA */}
            <PrivateCircleNewsletter />
        </div>
    );
}