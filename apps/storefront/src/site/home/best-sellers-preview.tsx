import { Link } from '@/platform/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { getRouteLocale } from '@/platform/i18n/server';
import { getActiveCurrencyCode } from '@/features/currency/currency-server';
import { ArrowRight } from 'lucide-react';
import { query } from '@/platform/vendure/api';
import { SearchProductsQuery } from '@/features/search/graphql';
import { ProductCard } from '@/features/products/components/product-card';
import { FragmentOf } from '@/platform/vendure/graphql';
import { ProductCardFragment } from '@/features/products/graphql';

async function getBestSellerProducts(locale: string, currencyCode: string): Promise<Array<FragmentOf<typeof ProductCardFragment>>> {
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
        return (result.data as any)?.search?.items || [];
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

    return (
        <section className="py-20 sm:py-28 lg:py-36 bg-[#FAF8F5]">
            <div className="max-w-[1360px] mx-auto px-6 sm:px-10 lg:px-14">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
                    <div className="space-y-3 max-w-2xl">
                        <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#A66B2D]">
                            Les Icônes
                        </span>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1D120A] tracking-tight leading-[1.1]">
                            Atelier Bolgatanga
                        </h2>
                    </div>
                    <Link
                        href="/search"
                        className="group inline-flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-[#1D120A] hover:text-[#A66B2D] transition-colors pb-1 border-b border-[#1D120A]/20 hover:border-[#A66B2D]"
                    >
                        <span>Voir la collection complète</span>
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
                    {displayProducts.map((product, idx) => (
                        <ProductCard key={idx} product={product} index={idx} />
                    ))}
                </div>
            </div>
        </section>
    );
}
