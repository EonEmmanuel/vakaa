import {Link} from '@/platform/i18n/navigation';
import {getTranslations} from 'next-intl/server';
import {getRouteLocale} from '@/platform/i18n/server';
import {getActiveCurrencyCode} from '@/features/currency/currency-server';
import {ArrowRight, Sparkles} from 'lucide-react';
import {query} from '@/platform/vendure/api';
import {SearchProductsQuery} from '@/features/search/graphql';
import {ProductCard} from '@/features/products/components/product-card';

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
            {languageCode: locale, currencyCode}
        );
        return result.data?.search?.items || [];
    } catch {
        return [];
    }
}

export async function BestSellersPreview() {
    const locale = await getRouteLocale();
    const currencyCode = await getActiveCurrencyCode();
    const t = await getTranslations({locale, namespace: 'Home'});
    const products = await getBestSellerProducts(locale, currencyCode);

    return (
        <section className="py-16 sm:py-20 md:py-28 bg-[#F8F4EE] dark:bg-[#140C06] transition-colors">
            <div className="vakaa-container">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 md:mb-14 gap-4">
                    <div className="space-y-1 sm:space-y-1.5">
                        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[#1D120A] dark:text-[#F8F4EE] uppercase leading-tight">
                            {t('bestSellers.title')}
                        </h2>
                        <p className="text-xs sm:text-sm text-[#A66B2D] dark:text-[#D4A43C] font-serif italic tracking-wide">
                            Les pièces maîtresses façonnées à la main
                        </p>
                    </div>

                    <Link
                        href="/search"
                        className="group inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#1D120A] dark:text-[#D4A43C] hover:text-[#D4A43C] transition-colors py-1"
                    >
                        <span>{t('bestSellers.viewAll')}</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                {/* Live Products Grid in Portrait 3:4 */}
                {products.length > 0 ? (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                        {products.map((product, idx) => (
                            <ProductCard key={idx} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="py-16 text-center border border-dashed border-[#E7DED0] dark:border-[#3A291C] rounded-lg p-8">
                        <p className="font-serif text-lg text-[#1D120A] dark:text-[#F8F4EE]">
                            Collection en cours de confection dans nos ateliers
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Découvrez toutes nos créations d&apos;artisanat dans notre catalogue complet.
                        </p>
                        <div className="mt-6">
                            <Link
                                href="/search"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xs text-xs font-semibold uppercase tracking-wider bg-[#1D120A] text-[#FAF7F2] dark:bg-[#D4A43C] dark:text-[#140C06]"
                            >
                                Explorer le catalogue
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
