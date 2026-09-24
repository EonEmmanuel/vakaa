'use client';

import React, { createContext, useContext, useState, useTransition, useEffect } from 'react';
import { switchCurrency } from './switch-currency';

interface CurrencyContextValue {
    activeCurrency: string;
    isPending: boolean;
    setCurrency: (code: string) => Promise<void>;
}

const CurrencyContext = createContext<CurrencyContextValue>({
    activeCurrency: 'XAF',
    isPending: false,
    setCurrency: async () => {},
});

export function CurrencyProvider({
    children,
    initialCurrency = 'XAF',
}: {
    children: React.ReactNode;
    initialCurrency?: string;
}) {
    const [activeCurrency, setActiveCurrency] = useState<string>(initialCurrency);
    const [isPending, startTransition] = useTransition();

    // Sync with cookie on mount if available
    useEffect(() => {
        if (typeof document !== 'undefined') {
            const match = document.cookie.match(/(?:^|;\s*)vendure-currency=([^;]+)/);
            if (match && match[1] && match[1] !== activeCurrency) {
                setActiveCurrency(decodeURIComponent(match[1]));
            }
        }
    }, []);

    const setCurrency = async (currencyCode: string) => {
        setActiveCurrency(currencyCode);
        startTransition(async () => {
            try {
                await switchCurrency(currencyCode);
            } catch (err) {
                console.error('[VAKAA Currency] Switch error:', err);
            }
            if (typeof window !== 'undefined') {
                window.location.reload();
            }
        });
    };

    return (
        <CurrencyContext.Provider value={{ activeCurrency, isPending, setCurrency }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    return useContext(CurrencyContext);
}
