'use client';

import { useSearchParams } from 'next/navigation';
import { usePathname, useRouter } from '@/platform/i18n/navigation';
import { X, RotateCcw } from 'lucide-react';
import { useCurrency } from '@/features/currency/currency-context';
import { useTranslations } from 'next-intl';

export function ActiveFiltersBar() {
    const t = useTranslations('Filters');
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const { activeCurrency } = useCurrency();
    const isEur = activeCurrency === 'EUR';
    const isUsd = activeCurrency === 'USD';

    const formatPrice = (val: number) => {
        if (isUsd) return `$${val.toLocaleString('en-US')}`;
        if (isEur) return `${val.toLocaleString('fr-FR')} €`;
        return `${val.toLocaleString('fr-FR')} FCFA`;
    };

    const activeCategory = searchParams.get('category');
    const activePrice = searchParams.get('price');
    const activeMinPrice = searchParams.get('minPrice');
    const activeMaxPrice = searchParams.get('maxPrice');
    const activeColor = searchParams.get('color');
    const activeMaterial = searchParams.get('material');
    const activeInStock = searchParams.get('inStock') === 'true';
    const selectedFacets = searchParams.getAll('facets');

    const removeFilter = (key: string, valueToRemove?: string) => {
        const params = new URLSearchParams(searchParams);
        if (key === 'priceRange') {
            params.delete('minPrice');
            params.delete('maxPrice');
            params.delete('price');
        } else if (key === 'facets' && valueToRemove) {
            params.delete('facets');
            selectedFacets.filter((id) => id !== valueToRemove).forEach((id) => params.append('facets', id));
        } else {
            params.delete(key);
        }
        params.delete('page');
        router.push(`${pathname}?${params.toString()}`);
    };

    const clearAll = () => {
        const params = new URLSearchParams();
        const currentSort = searchParams.get('sort');
        const currentQ = searchParams.get('q');
        if (currentSort) params.set('sort', currentSort);
        if (currentQ) params.set('q', currentQ);
        router.push(`${pathname}?${params.toString()}`);
    };

    const categoryLabels: Record<string, string> = {
        'tote-bags': 'Sacs Cabas & Totes',
        'shoulder-bags': 'Porté Épaule & Baguettes',
        'clutches': 'Pochettes & Soirée',
        'small-leather-goods': 'Petite Maroquinerie',
    };

    const priceLabels: Record<string, string> = {
        'under-75k': '< 75 000 FCFA',
        '75k-150k': '75 000 – 150 000 FCFA',
        'over-150k': '> 150 000 FCFA',
    };

    const colorLabels: Record<string, string> = {
        camel: 'Camel / Miel',
        black: 'Noir Ébène',
        green: 'Vert Sauge',
        indigo: 'Indigo Profond',
        ochre: 'Ocre Safran',
        ecru: 'Écru Naturel',
    };

    const materialLabels: Record<string, string> = {
        raphia: 'Raphia Sauvage',
        'vegetal-leather': 'Cuir Végétal',
        brass: 'Laiton Massif',
        beads: 'Perles d’Art',
    };

    const filterPills: Array<{ key: string; label: string; value?: string }> = [];

    if (activeCategory) {
        filterPills.push({
            key: 'category',
            label: `Ligne : ${categoryLabels[activeCategory] || activeCategory}`,
        });
    }

    if (activeMinPrice || activeMaxPrice) {
        let label = 'Prix : ';
        if (activeMinPrice && activeMaxPrice) {
            label += `${formatPrice(Number(activeMinPrice))} – ${formatPrice(Number(activeMaxPrice))}`;
        } else if (activeMaxPrice) {
            label += `< ${formatPrice(Number(activeMaxPrice))}`;
        } else if (activeMinPrice) {
            label += `> ${formatPrice(Number(activeMinPrice))}`;
        }
        filterPills.push({
            key: 'priceRange',
            label,
        });
    } else if (activePrice) {
        filterPills.push({
            key: 'price',
            label: `Prix : ${priceLabels[activePrice] || activePrice}`,
        });
    }

    if (activeColor) {
        filterPills.push({
            key: 'color',
            label: `Teinte : ${colorLabels[activeColor] || activeColor}`,
        });
    }

    if (activeMaterial) {
        filterPills.push({
            key: 'material',
            label: `Matière : ${materialLabels[activeMaterial] || activeMaterial}`,
        });
    }

    if (activeInStock) {
        filterPills.push({
            key: 'inStock',
            label: t('inStock'),
        });
    }

    selectedFacets.forEach((facetId) => {
        filterPills.push({
            key: 'facets',
            label: `Filtre : ${facetId}`,
            value: facetId,
        });
    });

    if (filterPills.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-wrap items-center gap-2 pt-1 pb-4">
            <span className="text-xs font-medium text-[#3A2418]/60 mr-1">
                {t('activeFilters')}
            </span>

            {filterPills.map((pill, idx) => (
                <button
                    key={idx}
                    type="button"
                    onClick={() => removeFilter(pill.key, pill.value)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4A43C] hover:bg-[#BF9232] text-white text-xs font-medium shadow-2xs transition-all hover:scale-[1.02] cursor-pointer"
                >
                    <span>{pill.label}</span>
                    <X className="w-3 h-3 stroke-[2.5]" />
                </button>
            ))}

            <button
                type="button"
                onClick={clearAll}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#A66B2D] hover:text-[#1D120A] underline underline-offset-4 ml-1 cursor-pointer"
            >
                <RotateCcw className="w-3 h-3" />
                <span>{t('clearAll')}</span>
            </button>
        </div>
    );
}
