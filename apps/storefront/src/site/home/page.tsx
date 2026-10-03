import type {Metadata} from 'next';
import {Suspense} from 'react';
import {getRouteLocale} from '@/platform/i18n/server';
import {HeroSection} from '@/site/home/hero-section';
import {BestSellersPreview} from '@/site/home/best-sellers-preview';
import {FeaturedBagSpotlight} from '@/site/home/featured-bag-spotlight';
import {TrustBar} from '@/site/home/trust-bar';
import {AtelierSpotlightCountdown} from '@/site/home/atelier-spotlight-countdown';
import {CollectionGridPreview} from '@/site/home/collection-grid-preview';
import {FuturisticAtelierReel} from '@/site/home/futuristic-atelier-reel';
import {TestimonialsSection} from '@/site/home/testimonials-section';
import {InstagramFeed} from '@/site/home/instagram-feed';
import {FaqSection} from '@/site/home/faq-section';
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

            {/* Flagship Product Showcase */}
            <Suspense fallback={<div className="h-96 w-full bg-background" />}>
                <BestSellersPreview />
            </Suspense>

            {/* Editorial Product Spotlight — Asymmetric Split */}
            <FeaturedBagSpotlight />

            {/* Minimal Trust Strip */}
            <TrustBar />

            {/* Dark Contrast: Limited Edition Spotlight */}
            <AtelierSpotlightCountdown />

            {/* Lookbook Scroll — Horizontal Product Reel */}
            <FuturisticAtelierReel />

            {/* Category Bento Grid */}
            <CollectionGridPreview />

            {/* Client Testimonials */}
            <TestimonialsSection />

            {/* Instagram Mosaic */}
            <InstagramFeed />

            {/* FAQ Accordion */}
            <FaqSection />

            {/* Dark Newsletter CTA */}
            <PrivateCircleNewsletter />
        </div>
    );
}