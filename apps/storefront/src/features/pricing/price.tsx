'use client';

import { useLocale } from 'next-intl';
import { toIntlLocale } from '@/platform/i18n/locale-utils';
import { useCurrency } from '@/features/currency/currency-context';
import { convertFromXaf, formatMoney } from '@/features/currency/currency-conversion';

interface PriceProps {
    value: number;
    currencyCode?: string;
    showReference?: boolean;
    className?: string;
}

export function Price({
    value,
    currencyCode = 'XAF',
    showReference = true,
    className,
}: PriceProps) {
    const locale = useLocale();
    const intlLocale = toIntlLocale(locale);
    const { activeCurrency } = useCurrency();

    const baseAmount = (value || 0) / 100;
    const baseCurrency = (currencyCode || 'XAF').toUpperCase();
    const displayCurrency = (activeCurrency || baseCurrency).toUpperCase();

    // If viewing in the base currency (or between XAF and XOF with 1:1 statutory parity)
    const isBothCfa = (displayCurrency === 'XAF' || displayCurrency === 'XOF') && (baseCurrency === 'XAF' || baseCurrency === 'XOF');
    if (displayCurrency === baseCurrency || isBothCfa) {
        const formatted = formatMoney(baseAmount, displayCurrency, intlLocale);
        return <span className={className}>{formatted}</span>;
    }

    // Reference conversion (e.g. viewing XAF item in EUR or USD)
    const convertedAmount = convertFromXaf(baseAmount, displayCurrency);
    const formattedConverted = formatMoney(convertedAmount, displayCurrency, intlLocale);
    const formattedBase = formatMoney(baseAmount, baseCurrency, intlLocale);

    return (
        <span
            className={className}
            title={`Settlement in boutique base currency: ${formattedBase}`}
        >
            {formattedConverted}
            {showReference && (
                <span className="text-[0.78em] text-muted-foreground ml-1 font-normal opacity-85">
                    ({formattedBase})
                </span>
            )}
        </span>
    );
}
