import { Link } from '@/platform/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { getRouteLocale } from '@/platform/i18n/server';
import { getActiveCurrencyCode } from '@/features/currency/currency-server';
import { ArrowRight, MessageSquare } from 'lucide-react';
import { query } from '@/platform/vendure/api';
import { SearchProductsQuery } from '@/features/search/graphql';
import { ProductCard } from '@/features/products/components/product-card';
import { FragmentOf } from '@/platform/vendure/graphql';
import { ProductCardFragment } from '@/features/products/graphql';

async function getBestSellerProducts(locale: string, currencyCode: string) {
    try {
        const result = await query(
            SearchProductsQuery,
            {
                input: {
                    take: 8,
                    skip: 0,
                    groupByProduct: true,
                },
            },
            { languageCode: locale, currencyCode }
        );
        return result.data?.search?.items || [];
    } catch {
        return [];
    }
}

export async function BestSellersPreview() {
    const locale = await getRouteLocale();
    const currencyCode = await getActiveCurrencyCode();
    const t = await getTranslations({ locale, namespace: 'Home' });
    const liveProducts = await getBestSellerProducts(locale, currencyCode);

    // Curated signature pieces ensuring the flagship showcase is immediately visually compelling
    const fallbackProducts = [
        {
            productId: 'vakaa-baguette-savane',
            productName: 'Le Sac Baguette Indigo Savane',
            slug: 'baguette-indigo-savane',
            productAsset: {
                id: 'asset-baguette-1',
                preview: '/images/bags/baguette-indigo-savane-1.jpg',
            },
            priceWithTax: {
                __typename: 'SinglePrice' as const,
                value: 14500000,
            },
            currencyCode: currencyCode || 'XAF',
        },
        {
            productId: 'vakaa-maa-tote',
            productName: 'Le Grand Cabas Maa',
            slug: 'cabas-maa-raphia',
            productAsset: {
                id: 'asset-maa-1',
                preview: '/images/bags/maa-tote.jpg',
            },
            priceWithTax: {
                __typename: 'SinglePrice' as const,
                value: 18500000,
            },
            currencyCode: currencyCode || 'XAF',
        },
        {
            productId: 'vakaa-zuri-clutch',
            productName: 'La Pochette Bijou Zuri',
            slug: 'pochette-zuri-laiton',
            productAsset: {
                id: 'asset-zuri-1',
                preview: '/images/bags/zuri-clutch.jpg',
            },
            priceWithTax: {
                __typename: 'SinglePrice' as const,
                value: 9500000,
            },
            currencyCode: currencyCode || 'XAF',
        },
        {
            productId: 'vakaa-kemi-shoulder',
            productName: 'Le Sac Porté Épaule Kemi',
            slug: 'porte-epaule-kemi',
            productAsset: {
                id: 'asset-kemi-1',
                preview: '/images/bags/kemi-shoulder.jpg',
            },
            priceWithTax: {
                __typename: 'SinglePrice' as const,
                value: 16500000,
            },
            currencyCode: currencyCode || 'XAF',
        },
    ];

    const displayProducts = liveProducts.length > 0 
        ? liveProducts 
        : (fallbackProducts as unknown as Array<FragmentOf<typeof ProductCardFragment>>);

    const filterPills = [
        { label: "Toutes les Pièces", href: "/search", active: true },
        { label: "Nouveautés", href: "/search?sort=createdAt-DESC", active: false },
        { label: "Sacs Cabas", href: "/search?category=tote-bags", active: false },
        { label: "Porté Épaule", href: "/search?category=shoulder-bags", active: false },
        { label: "Pochettes & Bijoux", href: "/search?category=clutches", active: false },
    ];

    return (
        <section className="py-12 sm:py-16 bg-[#FAF8F5] transition-colors border-b border-[#E7DED0]/60">
            <div className="vakaa-container space-y-8 sm:space-y-10">
                
                {/* Visual-First Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="space-y-1.5 max-w-2xl">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#F2ECE4] border border-[#E7DED0]/70 text-[10px] sm:text-[11px] font-semibold text-[#8C5824]">
                            <span>Atelier Bolgatanga & Nairobi</span>
                        </div>
                        <h2 className="font-sans text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1D120A] tracking-tight leading-tight">
                            Les Icônes de l&apos;Atelier
                        </h2>
                        <p className="text-xs sm:text-sm text-[#3A2418]/70 leading-relaxed font-sans">
                            Façonnées à la main en séries exclusives. Sélectionnez vos nuances de cuir et commandez directement.
                        </p>
                    </div>

                    <Link
                        href="/search"
                        className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1D120A] hover:text-[#A66B2D] transition-colors py-1 cursor-pointer"
                    >
                        <span>Voir la collection complète</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                </div>

                {/* Filter Tabs (Interactive Pill Buttons) */}
                <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                    {filterPills.map((tab, idx) => (
                        <Link
                            key={idx}
                            href={tab.href}
                            className={`px-4 sm:px-5 py-2 rounded-full text-xs font-semibold tracking-wide whitespace-nowrap transition-all duration-200 cursor-pointer ${
                                tab.active
                                    ? 'bg-[#1D120A] text-[#FAF8F5] shadow-xs'
                                    : 'bg-white border border-[#E7DED0] text-[#1D120A]/75 hover:border-[#D4A43C]/60 hover:text-[#1D120A]'
                            }`}
                        >
                            {tab.label}
                        </Link>
                    ))}
                </div>

                {/* Live Products Grid in 4 Columns */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                    {displayProducts.map((product, idx) => (
                        <ProductCard key={idx} product={product} index={idx} />
                    ))}
                </div>

                {/* Direct Action Bottom Banner */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-white border border-[#E7DED0]/80 shadow-2xs">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-[#FAF8F5] border border-[#E7DED0] flex items-center justify-center shrink-0">
                            <MessageSquare className="size-4 text-[#A66B2D]" />
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-xs sm:text-sm font-bold text-[#1D120A]">
                                Pièces Rares & Personnalisations d&apos;Atelier
                            </p>
                            <p className="text-[11px] sm:text-xs text-[#3A2418]/65">
                                Vous désirez un monogramme doré ou une nuance sur-mesure ? Échangez directement avec nos maîtres artisans.
                            </p>
                        </div>
                    </div>

                    <a
                        href="https://wa.me/237699000000"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1D120A] hover:bg-[#3A2418] text-[#FAF8F5] text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-xs hover:-translate-y-0.5 shrink-0 cursor-pointer"
                    >
                        <span>Concierge WhatsApp</span>
                        <ArrowRight className="size-3.5" />
                    </a>
                </div>

            </div>
        </section>
    );
}
