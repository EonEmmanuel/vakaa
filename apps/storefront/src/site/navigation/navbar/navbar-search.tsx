"use client";

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Search, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from '@/platform/i18n/navigation';
import { clientSearch, type ClientSearchResult } from '@/features/search/client-search';
import { readFragment } from '@/platform/vendure/graphql';
import { ProductCardFragment } from '@/features/products/graphql';
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import Image from 'next/image';
import { normalizeAssetUrl } from '@/lib/utils';

export function NavbarSearch() {
    const t = useTranslations('Navigation');
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState('');
    const [results, setResults] = React.useState<ClientSearchResult[]>([]);
    const [loading, setLoading] = React.useState(false);
    const router = useRouter();

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((prev) => !prev);
            }
        };
        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    React.useEffect(() => {
        const trimmed = query.trim();
        if (!trimmed) {
            setResults([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        const timer = setTimeout(() => {
            clientSearch(trimmed)
                .then((items) => {
                    setResults(items || []);
                })
                .catch(() => {
                    setResults([]);
                })
                .finally(() => {
                    setLoading(false);
                });
        }, 220);

        return () => clearTimeout(timer);
    }, [query]);

    const handleSelectProduct = (slug: string) => {
        setOpen(false);
        router.push(`/product/${slug}`);
    };

    const handleSearchSubmit = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && query.trim()) {
            e.preventDefault();
            const q = query.trim();
            setOpen(false);
            router.push(`/search?q=${encodeURIComponent(q)}`);
        }
    };

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                nativeButton={true}
                variant="ghost"
                size="icon"
                className="size-10 rounded-full flex items-center justify-center text-[#1c1b18] dark:text-[#fbfaf7] hover:text-[#D4A43C] dark:hover:text-[#D4A43C] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer shrink-0"
                aria-label={t('searchProducts')}
            >
                <Search className="h-5 w-5 stroke-[1.5]" />
            </Button>

            <CommandDialog open={open} onOpenChange={setOpen} title={t('searchProducts')}>
                <div className="relative">
                    <CommandInput
                        placeholder={t('searchPlaceholder')}
                        value={query}
                        onValueChange={setQuery}
                        onKeyDown={handleSearchSubmit}
                    />
                    {loading && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <Loader2 className="w-4 h-4 text-[#D4A43C] animate-spin" />
                        </div>
                    )}
                </div>

                <CommandList className="max-h-80 overflow-y-auto">
                    <CommandEmpty className="py-8 text-center text-xs text-[#57544c] dark:text-[#a5a195] font-sans">
                        {loading ? t('typeToSearch') : t('noResultsFound')}
                    </CommandEmpty>

                    {results.length > 0 && (
                        <CommandGroup heading={t('searchProducts')}>
                            {results.map((result) => {
                                const product = readFragment(ProductCardFragment, result);
                                const priceVal =
                                    product.priceWithTax?.__typename === 'PriceRange'
                                        ? product.priceWithTax.min
                                        : product.priceWithTax?.value ?? 0;
                                const formattedPrice = new Intl.NumberFormat(undefined, {
                                    style: 'currency',
                                    currency: product.currencyCode || 'XOF',
                                }).format(priceVal / 100);

                                return (
                                    <CommandItem
                                        key={product.productId}
                                        value={product.productName}
                                        onSelect={() => handleSelectProduct(product.slug)}
                                        className="flex items-center gap-3.5 px-3 py-2.5 rounded-lg hover:bg-[#ebe6dc]/60 dark:hover:bg-[#25231f] transition-colors cursor-pointer"
                                    >
                                        <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-[#e8e4dc] dark:bg-[#25231f] border border-[#e2ddd2] dark:border-[#2e2c28] flex-shrink-0 flex items-center justify-center">
                                            {product.productAsset?.preview ? (
                                                <Image
                                                    src={normalizeAssetUrl(product.productAsset.preview)}
                                                    alt={product.productName}
                                                    fill
                                                    sizes="48px"
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <span className="font-serif text-sm font-semibold text-[#D4A43C]">
                                                    {product.productName?.charAt(0) || 'V'}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex flex-col flex-1 min-w-0">
                                            <span className="font-sans text-sm font-medium text-[#1c1b18] dark:text-[#fbfaf7] truncate">
                                                {product.productName}
                                            </span>
                                            <span className="font-sans text-xs text-[#D4A43C] font-semibold tabular-nums mt-0.5">
                                                {formattedPrice}
                                            </span>
                                        </div>
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    )}

                    {query.trim().length > 0 && (
                        <div className="p-2 border-t border-[#e2ddd2] dark:border-[#2e2c28] bg-[#f2efe9]/70 dark:bg-[#1a1916]/70">
                            <button
                                type="button"
                                onClick={() => {
                                    const q = query.trim();
                                    setOpen(false);
                                    router.push(`/search?q=${encodeURIComponent(q)}`);
                                }}
                                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-[#1c1b18] dark:text-[#fbfaf7] hover:text-[#D4A43C] dark:hover:text-[#D4A43C] hover:bg-[#e2ddd2]/40 dark:hover:bg-[#2e2c28]/40 transition-colors cursor-pointer"
                            >
                                <span>{t('viewAllResultsFor', { query: query.trim() })}</span>
                                <ArrowRight className="w-3.5 h-3.5 ml-1 text-[#D4A43C]" />
                            </button>
                        </div>
                    )}
                </CommandList>
            </CommandDialog>
        </>
    );
}
