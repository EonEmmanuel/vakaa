import Image from 'next/image';
import {FragmentOf, readFragment} from '@/platform/vendure/graphql';
import {ProductCardFragment} from '@/features/products/graphql';
import {Price} from '@/features/pricing/price';
import {Suspense} from 'react';
import {Link} from '@/platform/i18n/navigation';
import {useTranslations} from 'next-intl';
import {Heart, Sparkles} from 'lucide-react';

interface ProductCardProps {
    product: FragmentOf<typeof ProductCardFragment>;
}

export function ProductCard({product: productProp}: ProductCardProps) {
    const t = useTranslations('Product');
    const product = readFragment(ProductCardFragment, productProp);

    return (
        <div className="group relative flex flex-col transition-all duration-500">
            {/* Image Container with Luxury 3:4 Portrait Ratio */}
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-md bg-[#F0EBE1] dark:bg-[#1A120B] shadow-xs group-hover:shadow-xl transition-all duration-700 mb-3.5">
                <Link
                    href={`/product/${product.slug}`}
                    className="relative block w-full h-full"
                >
                    {product.productAsset ? (
                        <Image
                            src={product.productAsset.preview}
                            alt={product.productName}
                            fill
                            className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground text-xs uppercase tracking-widest gap-2 bg-[#EAE3D6] dark:bg-[#1E140C]">
                            <Sparkles className="size-5 text-[#D4A43C]/40" />
                            <span>{t('noImage')}</span>
                        </div>
                    )}
                </Link>

                {/* Subtle Artisan Badge */}
                <div className="absolute top-3 left-3 pointer-events-none">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-xs text-[10px] uppercase tracking-widest font-medium bg-black/40 backdrop-blur-md text-[#FAF7F2] border border-white/10">
                        Atelier
                    </span>
                </div>

                {/* Floating Wishlist Heart */}
                <button
                    type="button"
                    aria-label="Add to wishlist"
                    className="absolute top-3 right-3 size-8 rounded-full flex items-center justify-center bg-white/70 dark:bg-black/50 backdrop-blur-md text-[#1D120A] dark:text-[#F8F4EE] hover:bg-[#D4A43C] hover:text-white transition-all duration-300 opacity-90 group-hover:opacity-100 shadow-sm"
                >
                    <Heart className="w-4 h-4 stroke-[1.5]" />
                </button>

                {/* Quick view / discovery hover accent */}
                <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none hidden sm:block">
                    <div className="w-full py-2 text-center text-[11px] font-semibold tracking-widest uppercase text-[#140C06] bg-[#F8F4EE]/95 dark:bg-[#1A120B]/95 dark:text-[#F8F4EE] backdrop-blur-md rounded-xs border border-[#D4A43C]/30 shadow-md">
                        {t('selectOptions')}
                    </div>
                </div>
            </div>

            {/* Product Meta Info */}
            <div className="flex flex-col space-y-1.5 px-0.5">
                <Link href={`/product/${product.slug}`} className="block group/link">
                    <h3 className="font-serif text-sm sm:text-base font-medium tracking-normal text-[#1D120A] dark:text-[#F8F4EE] group-hover/link:text-[#D4A43C] transition-colors line-clamp-1">
                        {product.productName}
                    </h3>
                </Link>

                {/* Price Display */}
                <Suspense fallback={<div className="h-5 w-24 rounded bg-muted animate-pulse" />}>
                    <div className="text-xs sm:text-sm font-semibold tracking-tight text-[#1D120A]/90 dark:text-[#F8F4EE]/90">
                        {product.priceWithTax.__typename === 'PriceRange' ? (
                            product.priceWithTax.min !== product.priceWithTax.max ? (
                                <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="text-[11px] font-normal text-muted-foreground">{t('from')}</span>
                                    <Price value={product.priceWithTax.min} currencyCode={product.currencyCode} />
                                </div>
                            ) : (
                                <Price value={product.priceWithTax.min} currencyCode={product.currencyCode} />
                            )
                        ) : product.priceWithTax.__typename === 'SinglePrice' ? (
                            <Price value={product.priceWithTax.value} currencyCode={product.currencyCode} />
                        ) : null}
                    </div>
                </Suspense>
            </div>
        </div>
    );
}
