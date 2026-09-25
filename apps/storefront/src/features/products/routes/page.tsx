import type { Metadata } from 'next';
import { Link } from '@/platform/i18n/navigation';
import { query } from '@/platform/vendure/api';
import {GetProductDetailQuery} from '@/features/products/graphql';
import { ProductImageCarousel } from '@/features/products/components/product-image-carousel';
import { ProductInfo } from '@/features/products/components/product-info';
import {getDisplayOptionGroups} from '@/features/products/product-options';
import { RelatedProducts } from '@/features/products/components/related-products';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { notFound } from 'next/navigation';
import { cacheLife, cacheTag } from 'next/cache';
import { Truck, RotateCcw, ShieldCheck, Clock } from 'lucide-react';
import { routing } from '@/platform/i18n/routing';
import {
    SITE_NAME,
    truncateDescription,
    buildCanonicalUrl,
    buildOgImages,
} from '@/config/metadata';
import {getTranslations} from 'next-intl/server';
import {toOgLocale} from '@/platform/i18n/locale-utils';
import {getActiveCurrencyCode} from '@/features/currency/currency-server';
import {getRouteLocale} from '@/platform/i18n/server';

async function getProductData(slug: string, currencyCode: string) {
    'use cache';
    cacheLife('hours');

    const locale = await getRouteLocale();
    cacheTag(`product-${slug}-${locale}-${currencyCode}`);
    cacheTag('products');

    const result = await query(GetProductDetailQuery, {slug}, {languageCode: locale, currencyCode});
    return result;
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
        <>
            <div className="vakaa-container pt-28 pb-12 sm:pt-32 sm:pb-16">
                {/* Breadcrumb Navigation */}
                <Breadcrumb className="mb-6">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink render={<Link href="/" />}>{t('home')}</BreadcrumbLink>
                        </BreadcrumbItem>
                        {primaryCollection && (
                            <>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink render={<Link href={`/collection/${primaryCollection.slug}`} />}>
                                        {primaryCollection.name}
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                            </>
                        )}
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{product.name}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
                    {/* Left Column: Image Carousel */}
                    <div className="lg:sticky lg:top-24 lg:self-start">
                        <ProductImageCarousel images={product.assets} />
                    </div>

                    {/* Right Column: Product Info */}
                    <div>
                        <ProductInfo product={productForDisplay} searchParams={searchParamsResolved} currencyCode={currencyCode} />
                    </div>
                </div>
            </div>

            {/* Shipping & Trust Badges */}
            <section className="py-8 md:py-10 border-y border-[#E7DED0]/70 dark:border-[#3A291C] bg-[#FAF7F2] dark:bg-[#120B06]">
                <div className="vakaa-container">
                    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 md:gap-8">
                        <div className="inline-flex items-center gap-2.5 rounded-xs bg-[#F8F4EE] dark:bg-[#1A110A] border border-[#E7DED0]/80 dark:border-[#3A291C] px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-[#1D120A] dark:text-[#F8F4EE] shadow-xs">
                            <Truck className="h-4 w-4 text-[#D4A43C]" />
                            {t('trustBadges.fastShipping')}
                        </div>
                        <div className="inline-flex items-center gap-2.5 rounded-xs bg-[#F8F4EE] dark:bg-[#1A110A] border border-[#E7DED0]/80 dark:border-[#3A291C] px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-[#1D120A] dark:text-[#F8F4EE] shadow-xs">
                            <RotateCcw className="h-4 w-4 text-[#D4A43C]" />
                            {t('trustBadges.freeReturns')}
                        </div>
                        <div className="inline-flex items-center gap-2.5 rounded-xs bg-[#F8F4EE] dark:bg-[#1A110A] border border-[#E7DED0]/80 dark:border-[#3A291C] px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-[#1D120A] dark:text-[#F8F4EE] shadow-xs">
                            <ShieldCheck className="h-4 w-4 text-[#D4A43C]" />
                            {t('trustBadges.secureCheckout')}
                        </div>
                        <div className="inline-flex items-center gap-2.5 rounded-xs bg-[#F8F4EE] dark:bg-[#1A110A] border border-[#E7DED0]/80 dark:border-[#3A291C] px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-[#1D120A] dark:text-[#F8F4EE] shadow-xs">
                            <Clock className="h-4 w-4 text-[#D4A43C]" />
                            {t('trustBadges.guarantee')}
                        </div>
                    </div>
                </div>
            </section>

            {/* Store FAQ Section */}
            <section className="py-16 md:py-20 bg-[#F8F4EE] dark:bg-[#140C06]">
                <div className="vakaa-container max-w-3xl">
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-center mb-8 uppercase tracking-tight text-[#1D120A] dark:text-[#F8F4EE]">{t('faq.title')}</h2>
                    <Accordion className="w-full">
                        <AccordionItem value="shipping">
                            <AccordionTrigger>{t('faq.shipping.question')}</AccordionTrigger>
                            <AccordionContent>
                                {t('faq.shipping.answer')}
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="returns">
                            <AccordionTrigger>{t('faq.returns.question')}</AccordionTrigger>
                            <AccordionContent>
                                {t('faq.returns.answer')}
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="tracking">
                            <AccordionTrigger>{t('faq.tracking.question')}</AccordionTrigger>
                            <AccordionContent>
                                {t('faq.tracking.answer')}
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="international">
                            <AccordionTrigger>{t('faq.international.question')}</AccordionTrigger>
                            <AccordionContent>
                                {t('faq.international.answer')}
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </section>

            {primaryCollection && (
                <RelatedProducts
                    collectionSlug={primaryCollection.slug}
                    currentProductId={product.id}
                />
            )}
        </>
    );
}
