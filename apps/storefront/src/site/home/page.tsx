import type {Metadata} from 'next';
import {Suspense} from 'react';
import {getRouteLocale} from '@/platform/i18n/server';
import {HeroSection} from '@/site/home/hero-section';
import {BestSellersPreview} from '@/site/home/best-sellers-preview';
import {FeaturedBagSpotlight} from '@/site/home/featured-bag-spotlight';
import {TrustBar} from '@/site/home/trust-bar';
import {AtelierSpotlightCountdown} from '@/site/home/atelier-spotlight-countdown';
import {CollectionGridPreview} from '@/site/home/collection-grid-preview';
import {HeritageSavoirFaire} from '@/site/home/heritage-savoir-faire';
import {TestimonialsSection} from '@/site/home/testimonials-section';
import {InstagramFeed} from '@/site/home/instagram-feed';
import {FaqSection} from '@/site/home/faq-section';
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
        <div className="min-h-screen bg-[#FAF8F5] text-[#1D120A] transition-colors">
            {/* 1. Iconic Hero with Character Model, Title Case & Ratings */}
            <HeroSection />

            {/* 2. The Flagship Atelier: Direct-to-Consumer Product Showcase with Borderless Pedestal Cards, Interactive Swatches & 1-Click Buy */}
            <Suspense fallback={<div className="h-96 w-full bg-[#FAF8F5]" />}>
                <BestSellersPreview />
            </Suspense>

            {/* 3. Extraordinary Section 1: L'Éloge du Détail (Large-Format 60/40 Split Spotlight on Baguette Terre Émeraude & Cabas Maa) */}
            <FeaturedBagSpotlight />

            {/* 4. Sleek 1-Line Luxury Atelier Guarantee Strip */}
            <TrustBar />

            {/* 5. Extraordinary Section 2: L'Excellence de la Série Limitée (Numbered Atelier Drop 14/50 ex., Authenticity Certificate, Batch Allocation) */}
            <AtelierSpotlightCountdown />

            {/* 6. Asymmetric Bento Category Showcase */}
            <CollectionGridPreview />

            {/* 7. Editorial 50/50 Visual Savoir-Faire (Tight Narrative & Master Craft Seals) */}
            <HeritageSavoirFaire />

            {/* 8. Client Reviews & Social Proof */}
            <TestimonialsSection />

            {/* 9. Instagram Community Lifestyle Grid */}
            <InstagramFeed />

            {/* 10. High-Conversion FAQ Accordion with Schema.org JSON-LD (Anchored at end) */}
            <FaqSection />

            {/* 11. Le Cercle Privé VIP Newsletter (Anchored at very end) */}
            <TribeNewsletter />
        </div>
    );
}
