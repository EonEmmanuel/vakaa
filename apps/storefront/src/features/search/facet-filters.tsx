'use client';

import { use, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { usePathname, useRouter } from '@/platform/i18n/navigation';
import { ResultOf } from '@/platform/vendure/graphql';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { SlidersHorizontal, Check, RotateCcw } from 'lucide-react';
import { SearchProductsQuery } from '@/features/search/graphql';
import { useCurrency } from '@/features/currency/currency-context';
import { useTranslations } from 'next-intl';

interface FacetFiltersProps {
    productDataPromise: Promise<{
        data: ResultOf<typeof SearchProductsQuery>;
        token?: string;
    }>;
}

export function FacetFilters({ productDataPromise }: FacetFiltersProps) {
    const t = useTranslations('Filters');
    const result = use(productDataPromise);
    const searchResult = result?.data?.search || { facetValues: [] };
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [sheetOpen, setSheetOpen] = useState(false);
    const { activeCurrency } = useCurrency();
    const isEur = activeCurrency === 'EUR';
    const isUsd = activeCurrency === 'USD';

    const bounds = isEur
        ? { min: 0, max: 500, step: 10 }
        : isUsd
        ? { min: 0, max: 500, step: 10 }
        : { min: 0, max: 300000, step: 5000 };

    // Active query states
    const activeCategory = searchParams.get('category') || '';
    const activePrice = searchParams.get('price') || '';
    const activeMinPrice = searchParams.get('minPrice');
    const activeMaxPrice = searchParams.get('maxPrice');
    const activeColor = searchParams.get('color') || '';
    const activeMaterial = searchParams.get('material') || '';
    const activeInStock = searchParams.get('inStock') === 'true';
    const selectedFacets = searchParams.getAll('facets');

    const currentMin = activeMinPrice ? Math.max(bounds.min, Number(activeMinPrice)) : bounds.min;
    const currentMax = activeMaxPrice ? Math.min(bounds.max, Number(activeMaxPrice)) : bounds.max;
    const [sliderValues, setSliderValues] = useState<number[]>([currentMin, currentMax]);

    useEffect(() => {
        const minVal = activeMinPrice ? Math.max(bounds.min, Number(activeMinPrice)) : bounds.min;
        const maxVal = activeMaxPrice ? Math.min(bounds.max, Number(activeMaxPrice)) : bounds.max;
        setSliderValues([minVal, maxVal]);
    }, [activeMinPrice, activeMaxPrice, bounds.min, bounds.max]);

    const formatPriceDisplay = (val: number) => {
        if (isUsd) return `$${val.toLocaleString('en-US')}`;
        if (isEur) return `${val.toLocaleString('fr-FR')} €`;
        return `${val.toLocaleString('fr-FR')} FCFA`;
    };

    const handleSliderChange = (newValues: number | readonly number[]) => {
        if (Array.isArray(newValues)) {
            setSliderValues([...newValues]);
        }
    };

    const handleSliderCommit = (newValues: number | readonly number[]) => {
        if (!Array.isArray(newValues)) return;
        const [minVal, maxVal] = newValues;
        const params = new URLSearchParams(searchParams);
        if (minVal <= bounds.min && maxVal >= bounds.max) {
            params.delete('minPrice');
            params.delete('maxPrice');
        } else {
            params.set('minPrice', minVal.toString());
            params.set('maxPrice', maxVal.toString());
        }
        params.delete('price');
        params.delete('page');
        router.push(`${pathname}?${params.toString()}`);
    };

    const applyPricePreset = (minVal: number, maxVal: number) => {
        setSliderValues([minVal, maxVal]);
        const params = new URLSearchParams(searchParams);
        params.set('minPrice', minVal.toString());
        params.set('maxPrice', maxVal.toString());
        params.delete('price');
        params.delete('page');
        router.push(`${pathname}?${params.toString()}`);
        setSheetOpen(false);
    };

    const resetPriceRange = () => {
        setSliderValues([bounds.min, bounds.max]);
        const params = new URLSearchParams(searchParams);
        params.delete('minPrice');
        params.delete('maxPrice');
        params.delete('price');
        params.delete('page');
        router.push(`${pathname}?${params.toString()}`);
    };

    const updateFilter = (key: string, value: string | null) => {
        const params = new URLSearchParams(searchParams);
        if (value === null || params.get(key) === value) {
            params.delete(key);
        } else {
            params.set(key, value);
        }
        params.delete('page');
        router.push(`${pathname}?${params.toString()}`);
        setSheetOpen(false);
    };

    const toggleFacet = (facetId: string) => {
        const params = new URLSearchParams(searchParams);
        const current = params.getAll('facets');

        if (current.includes(facetId)) {
            params.delete('facets');
            current.filter((id) => id !== facetId).forEach((id) => params.append('facets', id));
        } else {
            params.append('facets', facetId);
        }

        params.delete('page');
        router.push(`${pathname}?${params.toString()}`);
        setSheetOpen(false);
    };

    const clearAll = () => {
        setSliderValues([bounds.min, bounds.max]);
        const params = new URLSearchParams();
        const currentSort = searchParams.get('sort');
        const currentQ = searchParams.get('q');
        if (currentSort) params.set('sort', currentSort);
        if (currentQ) params.set('q', currentQ);

        router.push(`${pathname}?${params.toString()}`);
        setSheetOpen(false);
    };

    const isCustomPriceActive = Boolean(
        activeMinPrice ||
        activeMaxPrice ||
        sliderValues[0] > bounds.min ||
        sliderValues[1] < bounds.max
    );

    const hasActiveFilters = Boolean(
        activeCategory ||
        activePrice ||
        isCustomPriceActive ||
        activeColor ||
        activeMaterial ||
        activeInStock ||
        selectedFacets.length > 0
    );

    const categories = [
        { slug: 'tote-bags', label: 'Sacs Cabas & Totes', count: '12' },
        { slug: 'shoulder-bags', label: 'Porté Épaule & Baguettes', count: '8' },
        { slug: 'clutches', label: 'Pochettes & Soirée', count: '6' },
        { slug: 'small-leather-goods', label: 'Petite Maroquinerie', count: '5' },
    ];

    const priceBrackets = isEur
        ? [
            { id: 'under-120', min: 0, max: 120, label: 'Moins de 120 €' },
            { id: '120-250', min: 120, max: 250, label: '120 € – 250 €' },
            { id: 'over-250', min: 250, max: 500, label: 'Plus de 250 €' },
          ]
        : isUsd
        ? [
            { id: 'under-120', min: 0, max: 120, label: 'Under $120' },
            { id: '120-250', min: 120, max: 250, label: '$120 – $250' },
            { id: 'over-250', min: 250, max: 500, label: 'Over $250' },
          ]
        : [
            { id: 'under-75k', min: 0, max: 75000, label: 'Moins de 75 000 FCFA' },
            { id: '75k-150k', min: 75000, max: 150000, label: '75 000 – 150 000 FCFA' },
            { id: 'over-150k', min: 150000, max: 300000, label: 'Plus de 150 000 FCFA' },
          ];

    const colorSwatches = [
        { id: 'camel', label: 'Camel / Miel', hex: '#C19A6B' },
        { id: 'black', label: 'Noir Ébène', hex: '#1D120A' },
        { id: 'green', label: 'Vert Sauge', hex: '#3D6B51' },
        { id: 'indigo', label: 'Indigo Profond', hex: '#2A4365' },
        { id: 'ochre', label: 'Ocre Safran', hex: '#D97706' },
        { id: 'ecru', label: 'Écru Naturel', hex: '#EFEAE2' },
    ];

    const materials = [
        { id: 'raphia', label: 'Raphia Sauvage Tissé' },
        { id: 'vegetal-leather', label: 'Cuir Pleine Fleur Végétal' },
        { id: 'brass', label: 'Laiton Massif Forgé' },
        { id: 'beads', label: 'Perles & Caoris d’Afrique' },
    ];

    // Vendure Dynamic Facet Groups
    interface FacetGroup {
        id: string;
        name: string;
        values: Array<{ id: string; name: string; count: number }>;
    }

    const dynamicFacetGroups = searchResult.facetValues.reduce((acc: Record<string, FacetGroup>, item) => {
        const facetName = item.facetValue.facet.name;
        if (!acc[facetName]) {
            acc[facetName] = {
                id: item.facetValue.facet.id,
                name: facetName,
                values: [],
            };
        }
        acc[facetName].values.push({
            id: item.facetValue.id,
            name: item.facetValue.name,
            count: item.count,
        });
        return acc;
    }, {});

    const renderFilterBody = () => (
        <div className="space-y-7 text-[#1c1b18]">
            {/* Header: Title & Clear All */}
            <div className="flex items-center justify-between pb-3 border-b border-[#e2ddd2]">
                <h3 className="font-display text-base sm:text-lg font-bold tracking-tight text-[#1c1b18]">
                    {t('title')}
                </h3>
                {hasActiveFilters && (
                    <button
                        type="button"
                        onClick={clearAll}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D4A43C] hover:text-[#1D120A] transition-colors cursor-pointer"
                    >
                        <RotateCcw className="w-3 h-3" />
                        <span>{t('clearAll')}</span>
                    </button>
                )}
            </div>

            {/* 1. Category Filter */}
            <div className="space-y-3">
                <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-[#D4A43C]">
                    {t('categories')}
                </h4>
                <div className="space-y-2">
                    {categories.map((cat) => {
                        const isSelected = activeCategory === cat.slug;
                        return (
                            <div
                                key={cat.slug}
                                onClick={() => updateFilter('category', isSelected ? null : cat.slug)}
                                className={`flex items-center justify-between py-1 px-2 -mx-2 rounded-lg cursor-pointer transition-colors ${
                                    isSelected ? 'bg-[#f2efe9] font-semibold text-[#1c1b18]' : 'hover:bg-[#f2efe9]/60 text-[#57544c]'
                                }`}
                            >
                                <div className="flex items-center gap-2.5">
                                    <div
                                        className={`size-4 rounded border flex items-center justify-center transition-colors ${
                                            isSelected ? 'bg-[#D4A43C] border-[#D4A43C] text-[#1D120A]' : 'border-[#e2ddd2] bg-white'
                                        }`}
                                    >
                                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                                    </div>
                                    <span className="text-xs sm:text-sm">{cat.label}</span>
                                </div>
                                <span className="text-[11px] text-[#7d796f] tabular-nums">({cat.count})</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 2. Interactive Price Range Slider Bar */}
            <div className="space-y-4 pt-2 border-t border-[#e2ddd2]">
                <div className="flex items-center justify-between">
                    <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-[#D4A43C]">
                        {t('priceRange')}
                    </h4>
                    {isCustomPriceActive && (
                        <button
                            type="button"
                            onClick={resetPriceRange}
                            className="text-[11px] font-semibold text-[#D4A43C] hover:text-[#1D120A] underline underline-offset-2 transition-colors cursor-pointer"
                        >
                            {t('reset')}
                        </button>
                    )}
                </div>

                {/* Real-time Dynamic Price Range Tags */}
                <div className="flex items-center justify-between text-xs font-semibold text-[#1c1b18] bg-[#f2efe9] px-3 py-2 rounded-xl border border-[#e2ddd2]">
                    <span className="tabular-nums">{formatPriceDisplay(sliderValues[0])}</span>
                    <span className="text-[#7d796f] font-normal">—</span>
                    <span className="tabular-nums">{formatPriceDisplay(sliderValues[1])}</span>
                </div>

                {/* Dual-Thumb Slider Bar */}
                <div className="px-1 py-1">
                    <Slider
                        min={bounds.min}
                        max={bounds.max}
                        step={bounds.step}
                        value={sliderValues}
                        onValueChange={handleSliderChange}
                        onValueCommitted={handleSliderCommit}
                    />
                </div>

                {/* Quick Presets for 1-Tap Access */}
                <div className="space-y-1.5 pt-1">
                    <p className="text-[10px] uppercase tracking-wider text-[#7d796f] font-medium">
                        Paliers rapides :
                    </p>
                    <div className="grid grid-cols-1 gap-1.5">
                        {priceBrackets.map((bracket) => {
                            const isSelected =
                                (activeMinPrice === bracket.min.toString() &&
                                    activeMaxPrice === bracket.max.toString()) ||
                                activePrice === bracket.id;
                            return (
                                <button
                                    key={bracket.id}
                                    type="button"
                                    onClick={() => applyPricePreset(bracket.min, bracket.max)}
                                    className={`w-full text-left py-1.5 px-2.5 rounded-lg text-xs transition-colors flex items-center justify-between cursor-pointer ${
                                        isSelected
                                            ? 'bg-[#1D120A] text-white font-semibold shadow-xs'
                                            : 'bg-[#f2efe9]/70 text-[#57544c] hover:bg-[#f2efe9]'
                                    }`}
                                >
                                    <span>{bracket.label}</span>
                                    {isSelected && <Check className="w-3 h-3 stroke-[2.5]" />}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* 3. Color Swatches (FutureCommerce Style) */}
            <div className="space-y-3 pt-2 border-t border-[#e2ddd2]">
                <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-[#D4A43C]">
                    {t('colors')}
                </h4>
                <div className="grid grid-cols-2 gap-2">
                    {colorSwatches.map((color) => {
                        const isSelected = activeColor === color.id;
                        return (
                            <button
                                key={color.id}
                                type="button"
                                onClick={() => updateFilter('color', isSelected ? null : color.id)}
                                className={`flex items-center gap-2 p-1.5 rounded-lg text-left text-xs transition-colors cursor-pointer ${
                                    isSelected ? 'bg-[#f2efe9] font-bold text-[#1c1b18]' : 'hover:bg-[#f2efe9]/60 text-[#57544c]'
                                }`}
                            >
                                <span
                                    className="size-4 rounded-full border border-black/15 shrink-0 flex items-center justify-center shadow-xs"
                                    style={{ backgroundColor: color.hex }}
                                >
                                    {isSelected && (
                                        <Check
                                            className={`w-2.5 h-2.5 stroke-[3] ${
                                                color.id === 'black' || color.id === 'indigo' || color.id === 'green'
                                                    ? 'text-white'
                                                    : 'text-[#1c1b18]'
                                            }`}
                                        />
                                    )}
                                </span>
                                <span className="truncate">{color.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 4. Noble Materials Filter */}
            <div className="space-y-3 pt-2 border-t border-[#e2ddd2]">
                <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-[#D4A43C]">
                    {t('materials')}
                </h4>
                <div className="space-y-2">
                    {materials.map((mat) => {
                        const isSelected = activeMaterial === mat.id;
                        return (
                            <div
                                key={mat.id}
                                onClick={() => updateFilter('material', isSelected ? null : mat.id)}
                                className={`flex items-center gap-2.5 py-1 px-2 -mx-2 rounded-lg cursor-pointer transition-colors ${
                                    isSelected ? 'bg-[#f2efe9] font-semibold text-[#1c1b18]' : 'hover:bg-[#f2efe9]/60 text-[#57544c]'
                                }`}
                            >
                                <div
                                    className={`size-4 rounded border flex items-center justify-center transition-colors ${
                                        isSelected ? 'bg-[#D4A43C] border-[#D4A43C] text-[#1D120A]' : 'border-[#e2ddd2] bg-white'
                                    }`}
                                >
                                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                                </div>
                                <span className="text-xs sm:text-sm">{mat.label}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 5. Availability Filter */}
            <div className="space-y-3 pt-2 border-t border-[#e2ddd2]">
                <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-[#D4A43C]">
                    {t('availability')}
                </h4>
                <div className="space-y-2">
                    <div
                        onClick={() => updateFilter('inStock', activeInStock ? null : 'true')}
                        className={`flex items-center gap-2.5 py-1 px-2 -mx-2 rounded-lg cursor-pointer transition-colors ${
                            activeInStock ? 'bg-[#f2efe9] font-semibold text-[#1c1b18]' : 'hover:bg-[#f2efe9]/60 text-[#57544c]'
                        }`}
                    >
                        <div
                            className={`size-4 rounded border flex items-center justify-center transition-colors ${
                                activeInStock ? 'bg-[#D4A43C] border-[#D4A43C] text-[#1D120A]' : 'border-[#e2ddd2] bg-white'
                            }`}
                        >
                            {activeInStock && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="text-xs sm:text-sm">{t('inStock')}</span>
                    </div>
                </div>
            </div>

            {/* 6. Dynamic Vendure Facets (if present) */}
            {Object.keys(dynamicFacetGroups).length > 0 && (
                <div className="space-y-4 pt-2 border-t border-[#e2ddd2]">
                    {Object.entries(dynamicFacetGroups).map(([facetName, facet]) => (
                        <div key={facet.id} className="space-y-2">
                            <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-[#D4A43C]">
                                {facetName}
                            </h4>
                            <div className="space-y-1.5">
                                {facet.values.map((val) => {
                                    const isChecked = selectedFacets.includes(val.id);
                                    return (
                                        <div
                                            key={val.id}
                                            onClick={() => toggleFacet(val.id)}
                                            className={`flex items-center justify-between py-1 px-2 -mx-2 rounded-lg cursor-pointer transition-colors ${
                                                isChecked ? 'bg-[#f2efe9] font-semibold text-[#1c1b18]' : 'hover:bg-[#f2efe9]/60 text-[#57544c]'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <div
                                                    className={`size-4 rounded border flex items-center justify-center transition-colors ${
                                                        isChecked ? 'bg-[#D4A43C] border-[#D4A43C] text-[#1D120A]' : 'border-[#e2ddd2] bg-white'
                                                    }`}
                                                >
                                                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                                                </div>
                                                <span className="text-xs sm:text-sm">{val.name}</span>
                                            </div>
                                            <span className="text-[11px] text-[#7d796f] tabular-nums">({val.count})</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <aside className="w-full">
            {/* Mobile Sheet Trigger */}
            <div className="lg:hidden mb-6">
                <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                    <SheetTrigger
                        render={
                            <Button
                                variant="outline"
                                className="w-full flex items-center justify-between py-3 px-4 rounded-xl border-[#e2ddd2] bg-[#fbfaf7] text-xs font-bold uppercase tracking-wider text-[#1c1b18] shadow-xs cursor-pointer"
                            >
                                <span className="flex items-center gap-2">
                                    <SlidersHorizontal className="h-4 w-4 text-[#D4A43C]" />
                                    <span>{t('filtersButton')}</span>
                                </span>
                                {hasActiveFilters && (
                                    <span className="size-5 rounded-full bg-[#D4A43C] text-[#1D120A] text-[10px] flex items-center justify-center font-bold">
                                        !
                                    </span>
                                )}
                            </Button>
                        }
                    />
                    <SheetContent side="left" data-lenis-prevent className="overflow-y-auto p-6 bg-[#f2efe9]">
                        <SheetHeader className="mb-4 text-left">
                            <SheetTitle className="font-display font-bold text-lg text-[#1c1b18]">
                                {t('title')}
                            </SheetTitle>
                        </SheetHeader>
                        {renderFilterBody()}
                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop Sticky Filter Sidebar */}
            <div className="hidden lg:block sticky top-28 p-6 rounded-2xl bg-[#fbfaf7] border border-[#e2ddd2] shadow-sm">
                {renderFilterBody()}
            </div>
        </aside>
    );
}
