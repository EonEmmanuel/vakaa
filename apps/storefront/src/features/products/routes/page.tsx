import type { Metadata } from 'next';
import { Link } from '@/platform/i18n/navigation';
import { query } from '@/platform/vendure/api';
import { GetProductDetailQuery } from '@/features/products/graphql';
import { ProductImageCarousel } from '@/features/products/components/product-image-carousel';
import { ProductInfo } from '@/features/products/components/product-info';
import { getDisplayOptionGroups } from '@/features/products/product-options';
import { RelatedProducts } from '@/features/products/components/related-products';
import { ProductTabs } from '@/features/products/components/product-tabs';
import { TrustBar } from '@/site/home/trust-bar';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { notFound } from 'next/navigation';
import { cacheLife, cacheTag } from 'next/cache';
import { routing } from '@/platform/i18n/routing';
import {
    SITE_NAME,
    truncateDescription,
    buildCanonicalUrl,
    buildOgImages,
} from '@/config/metadata';
import { getTranslations } from 'next-intl/server';
import { toOgLocale } from '@/platform/i18n/locale-utils';
import { getActiveCurrencyCode } from '@/features/currency/currency-server';
import { getRouteLocale } from '@/platform/i18n/server';

function DecorativeDotCluster({ className = "" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 160 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-hidden="true"
        >
            <g fill="#D4A43C" fillOpacity="0.25">
                <circle cx="20" cy="20" r="3" />
                <circle cx="40" cy="15" r="2.5" />
                <circle cx="60" cy="25" r="3" />
                <circle cx="80" cy="18" r="2" />
                <circle cx="100" cy="28" r="3.5" />
                <circle cx="120" cy="16" r="2.5" />
                <circle cx="140" cy="24" r="3" />

                <circle cx="30" cy="45" r="3.5" />
                <circle cx="50" cy="40" r="2" />
                <circle cx="70" cy="50" r="3" />
                <circle cx="90" cy="42" r="2.5" />
                <circle cx="110" cy="52" r="3" />
                <circle cx="130" cy="44" r="2" />

                <circle cx="40" cy="65" r="2.5" />
                <circle cx="60" cy="70" r="3" />
                <circle cx="80" cy="62" r="2" />
                <circle cx="100" cy="68" r="3" />
            </g>
        </svg>
    );
}

async function getProductData(slug: string, currencyCode: string) {
    'use cache';
    cacheLife('hours');

    const locale = await getRouteLocale();
    cacheTag(`product-${slug}-${locale}-${currencyCode}`);
    cacheTag('products');

    try {
        const result = await query(GetProductDetailQuery, {slug}, {languageCode: locale, currencyCode});
        return result;
    } catch {
        return { data: { product: null } };
    }
}

export async function generateMetadata({
    params,
}: PageProps<'/[locale]/product/[slug]'>): Promise<Metadata> {
    const { slug } = await params;
    const locale = await getRouteLocale();
    const currencyCode = await getActiveCurrencyCode();
    const result = await getProductData(slug, currencyCode);
    const product = result.data?.product;

    const t = await getTranslations({locale, namespace: 'Product'});

    if (!product) {
        return {
            title: t('notFound'),
        };
    }

    const description = truncateDescription(product.description);
    const fallbackDescription = t('shopProductAt', {name: product.name, siteName: SITE_NAME});
    const ogImage = product.assets?.[0]?.preview;
    const ogLocale = toOgLocale(locale);
    const productPath = `/product/${product.slug}`;

    return {
        title: product.name,
        description: description || fallbackDescription,
        alternates: {
            canonical: buildCanonicalUrl(`/${locale}${productPath}`),
            languages: Object.fromEntries(
                routing.locales.map((l) => [l, buildCanonicalUrl(`/${l}${productPath}`)])
            ),
        },
        openGraph: {
            title: product.name,
            description: description || fallbackDescription,
            type: 'website',
            locale: ogLocale,
            url: buildCanonicalUrl(`/${locale}${productPath}`),
            images: buildOgImages(ogImage, product.name),
        },
        twitter: {
            card: 'summary_large_image',
            title: product.name,
            description: description || fallbackDescription,
            images: ogImage ? [ogImage] : undefined,
        },
    };
}

export default async function ProductDetailPage({
    params,
    searchParams,
}: PageProps<'/[locale]/product/[slug]'>) {
    const { slug } = await params;
    const searchParamsResolved = await searchParams;
    const locale = await getRouteLocale();
    const currencyCode = await getActiveCurrencyCode();
    const t = await getTranslations({locale, namespace: 'Product'});
    const tSearch = await getTranslations({locale, namespace: 'Search'});

    const result = await getProductData(slug, currencyCode);
    const product = result.data?.product;

    if (!product) {
        notFound();
    }

    // Get the primary collection (prefer deepest nested / most specific)
    const primaryCollection = product.collections?.find((c: any) => c?.parent?.id) ?? product.collections?.[0];

    // Hide options that belong to a shared option group but have no variant on
    // this product (Vendure 3.6 shared/global option groups).
    const productForDisplay = {...product, optionGroups: getDisplayOptionGroups(product)};

    return (
        <div className="min-h-screen bg-[#FAF8F5] text-[#1D120A] flex flex-col">
            {/* 1. Full-Width Hero Breadcrumb Banner (FutureCommerce reference: ff98ca195762505.69ca92c62c826.png) */}
            <section className="relative w-full overflow-hidden bg-[#FAF8F5] border-b border-[#E7DED0]/60 pt-28 sm:pt-32 pb-10 sm:pb-14 text-center transition-colors">
                {/* Decorative dot clusters on left and right */}
                <div className="absolute left-4 sm:left-12 top-1/2 -translate-y-1/2 w-32 sm:w-44 h-20 pointer-events-none opacity-70">
                    <DecorativeDotCluster className="w-full h-full" />
                </div>
                <div className="absolute right-4 sm:right-12 top-1/2 -translate-y-1/2 w-32 sm:w-44 h-20 pointer-events-none opacity-70 transform rotate-180">
                    <DecorativeDotCluster className="w-full h-full" />
                </div>

                <div className="vakaa-container relative z-10 space-y-3">
                    {/* Banner Title */}
                    <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1D120A] leading-tight">
                        {primaryCollection ? primaryCollection.name : tSearch('shop')}
                    </h1>

                    {/* Breadcrumbs */}
                    <nav aria-label="Fil d'ariane" className="flex items-center justify-center gap-2 text-xs sm:text-sm text-[#3A2418]/60 flex-wrap">
                        <Link
                            href="/"
                            className="hover:text-[#A66B2D] transition-colors cursor-pointer"
                        >
                            {t('home')}
                        </Link>
                        <span className="text-[#3A2418]/30">/</span>
                        <Link
                            href="/search"
                            className="hover:text-[#A66B2D] transition-colors cursor-pointer"
                        >
                            {tSearch('shop')}
                        </Link>
                        {primaryCollection && (
                            <>
                                <span className="text-[#3A2418]/30">/</span>
                                <Link
                                    href={`/collection/${primaryCollection.slug}`}
                                    className="hover:text-[#A66B2D] transition-colors cursor-pointer"
                                >
                                    {primaryCollection.name}
                                </Link>
                            </>
                        )}
                        <span className="text-[#3A2418]/30">/</span>
                        <span className="font-semibold text-[#1D120A] truncate max-w-[200px] sm:max-w-xs">
                            {product.name}
                        </span>
                    </nav>
                </div>
            </section>

            {/* 2. Main Two-Column Showcase Area */}
            <main className="vakaa-container py-10 sm:py-14 flex-1">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
                    {/* Left Column: Image Carousel / Studio Pedestal (#F3EFE9) */}
                    <div className="lg:col-span-6 lg:sticky lg:top-24">
                        <ProductImageCarousel images={product.assets} />
                    </div>

                    {/* Right Column: Luxury Buy Box */}
                    <div className="lg:col-span-6">
                        <ProductInfo
                            product={productForDisplay}
                            searchParams={searchParamsResolved}
                            currencyCode={currencyCode}
                        />
                    </div>
                </div>

                {/* 3. Horizontal Information Tabs (Description, Specifications & Materials, Reviews) */}
                <ProductTabs
                    description={product.description}
                    productName={product.name}
                />
            </main>

            {/* 4. Store FAQ Section */}
            <section className="py-12 sm:py-16 bg-[#F8F4EE] border-t border-[#E7DED0]/60">
                <div className="vakaa-container max-w-3xl">
                    <div className="text-center space-y-2 mb-8">
                        <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#A66B2D]">
                            — Informations Essentielles
                        </span>
                        <h2 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-[#1D120A]">
                            {t('faq.title')}
                        </h2>
                    </div>
                    <Accordion className="w-full space-y-3">
                        <AccordionItem value="shipping" className="border border-[#E7DED0]/80 rounded-xl px-5 bg-[#FAF8F5]">
                            <AccordionTrigger className="font-sans font-semibold text-sm sm:text-base text-[#1D120A] hover:no-underline py-4">
                                {t('faq.shipping.question')}
                            </AccordionTrigger>
                            <AccordionContent className="text-xs sm:text-sm text-[#3A2418]/80 leading-relaxed pb-4">
                                {t('faq.shipping.answer')}
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="returns" className="border border-[#E7DED0]/80 rounded-xl px-5 bg-[#FAF8F5]">
                            <AccordionTrigger className="font-sans font-semibold text-sm sm:text-base text-[#1D120A] hover:no-underline py-4">
                                {t('faq.returns.question')}
                            </AccordionTrigger>
                            <AccordionContent className="text-xs sm:text-sm text-[#3A2418]/80 leading-relaxed pb-4">
                                {t('faq.returns.answer')}
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="tracking" className="border border-[#E7DED0]/80 rounded-xl px-5 bg-[#FAF8F5]">
                            <AccordionTrigger className="font-sans font-semibold text-sm sm:text-base text-[#1D120A] hover:no-underline py-4">
                                {t('faq.tracking.question')}
                            </AccordionTrigger>
                            <AccordionContent className="text-xs sm:text-sm text-[#3A2418]/80 leading-relaxed pb-4">
                                {t('faq.tracking.answer')}
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="international" className="border border-[#E7DED0]/80 rounded-xl px-5 bg-[#FAF8F5]">
                            <AccordionTrigger className="font-sans font-semibold text-sm sm:text-base text-[#1D120A] hover:no-underline py-4">
                                {t('faq.international.question')}
                            </AccordionTrigger>
                            <AccordionContent className="text-xs sm:text-sm text-[#3A2418]/80 leading-relaxed pb-4">
                                {t('faq.international.answer')}
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </section>

            {/* 5. Related Products / Similar Creations */}
            {primaryCollection && (
                <RelatedProducts
                    collectionSlug={primaryCollection.slug}
                    currentProductId={product.id}
                />
            )}

            {/* 6. Universal 4-Pillar Trust Bar */}
            <TrustBar />
        </div>
    );
}
