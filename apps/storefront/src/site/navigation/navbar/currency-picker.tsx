'use client';

import { useTranslations } from 'next-intl';
import { Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCurrency } from '@/features/currency/currency-context';

interface CurrencyPickerProps {
    availableCurrencyCodes: string[];
    activeCurrencyCode: string;
}

const CURRENCY_METADATA: Record<string, { label: string; badge: string }> = {
    XAF: { label: 'XAF (FCFA)', badge: 'Base' },
    XOF: { label: 'XOF (FCFA)', badge: 'Base' },
    EUR: { label: 'EUR (€)', badge: 'Ref' },
    USD: { label: 'USD ($)', badge: 'Ref' },
    NGN: { label: 'NGN (₦)', badge: 'Ref' },
    GBP: { label: 'GBP (£)', badge: 'Ref' },
};

export function CurrencyPicker({ availableCurrencyCodes, activeCurrencyCode }: CurrencyPickerProps) {
    const t = useTranslations('Navigation');
    const { activeCurrency, isPending, setCurrency } = useCurrency();
    const current = activeCurrency || activeCurrencyCode || 'XAF';

    // Prioritize and present curated store currencies: XAF, EUR, USD, NGN
    const displayCodes = Array.from(
        new Set(['XAF', 'EUR', 'USD', 'NGN', ...(availableCurrencyCodes || [])])
    ).filter((c) => ['XAF', 'EUR', 'USD', 'NGN'].includes(c));

    if (displayCodes.length <= 1) {
        return null;
    }

    const handleCurrencyChange = async (currencyCode: string) => {
        await setCurrency(currencyCode);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1.5 text-xs font-medium"
                        aria-label={t('switchCurrency')}
                    />
                }
            >
                <Coins className="size-3.5 text-[#D4A43C]" />
                <span className="font-semibold">{current}</span>
                {current !== 'XAF' && (
                    <span className="text-[9px] uppercase px-1 py-0.5 rounded bg-secondary text-muted-foreground font-mono">
                        Ref
                    </span>
                )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 p-1">
                {displayCodes.map((code) => {
                    const meta = CURRENCY_METADATA[code] || { label: code, badge: 'Ref' };
                    const isSelected = current === code;
                    return (
                        <DropdownMenuItem
                            key={code}
                            onClick={() => handleCurrencyChange(code)}
                            disabled={isPending}
                            className="flex items-center justify-between text-xs cursor-pointer py-1.5 px-2 rounded-md"
                        >
                            <span className={isSelected ? 'font-semibold text-foreground' : 'text-muted-foreground'}>
                                {meta.label}
                            </span>
                            <div className="flex items-center gap-1.5">
                                <span
                                    className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${
                                        meta.badge === 'Base'
                                            ? 'bg-[#D4A43C]/15 text-[#D4A43C]'
                                            : 'bg-secondary text-muted-foreground'
                                    }`}
                                >
                                    {meta.badge}
                                </span>
                                {isSelected && <span className="text-xs text-[#D4A43C]">✓</span>}
                            </div>
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
