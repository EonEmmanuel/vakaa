'use client';

import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from '@/platform/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useCart } from '@/features/cart/context/cart-context';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

interface CartIconProps {
    cartItemCount: number;
}

export function CartIcon({ cartItemCount }: CartIconProps) {
    const t = useTranslations('Navigation');
    const { totalQuantity, isInitialized, initCount, openCart } = useCart();

    useEffect(() => {
        if (!isInitialized && typeof cartItemCount === 'number') {
            initCount(cartItemCount);
        }
    }, [cartItemCount, isInitialized, initCount]);

    const count = isInitialized ? totalQuantity : Math.max(totalQuantity, cartItemCount || 0);

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        openCart();
    };

    return (
        <button
            id="vakaa-cart-icon"
            data-cart-icon="true"
            type="button"
            onClick={handleClick}
            className="flex h-11 sm:h-12 items-center gap-1.5 sm:gap-2 rounded-full bg-[#1D120A] px-2.5 sm:pl-4 sm:pr-3 text-[14px] font-medium text-white hover:bg-[#3A2418] transition-colors cursor-pointer shadow-xs select-none active:scale-[0.98] shrink-0"
            aria-label={t('shoppingCart')}
        >
            <ShoppingBag className="size-4.5 stroke-[1.75]" />
            <span className="hidden sm:inline font-medium text-[14px]">{t('shoppingCart')}</span>
            <span
                id="vakaa-cart-count-badge"
                className="grid h-5.5 min-w-5.5 sm:h-6 sm:min-w-6 place-items-center rounded-full bg-[#F8F4EE] px-1 sm:px-1.5 text-[11px] sm:text-[12px] font-bold text-[#1D120A] tabular-nums"
            >
                <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                        key={count}
                        initial={{ y: -4, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 4, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                    >
                        {count}
                    </motion.span>
                </AnimatePresence>
            </span>
            <Link id="vakaa-cart-icon-link" data-cart-icon="true" href="/cart" className="sr-only">
                {t('shoppingCart')}
            </Link>
        </button>
    );
}
