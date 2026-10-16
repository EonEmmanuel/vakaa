'use client';

import { Minus, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCart } from '../context/cart-context';

interface CartItemQuantityProps {
    lineId: string;
    initialQuantity: number;
    productName: string;
}

export function CartItemQuantity({
    lineId,
    initialQuantity,
    productName,
}: CartItemQuantityProps) {
    const t = useTranslations('Cart');
    const { order, updateQuantity } = useCart();

    // Prefer live optimistic quantity from cart context, fallback to initialQuantity
    const line = order?.lines.find((l) => l.id === lineId);
    const quantity = line ? line.quantity : initialQuantity;

    const handleIncrement = () => {
        updateQuantity(lineId, quantity + 1);
    };

    const handleDecrement = () => {
        if (quantity <= 1) return;
        updateQuantity(lineId, quantity - 1);
    };

    return (
        <div className="inline-flex items-center border border-stone-200 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-900 overflow-hidden shadow-2xs">
            <button
                type="button"
                onClick={handleDecrement}
                disabled={quantity <= 1}
                className="w-8 sm:w-9 h-8 sm:h-9 flex items-center justify-center text-stone-500 hover:text-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                aria-label={`${t('decreaseQuantity')} ${productName}`}
            >
                <Minus className="w-3.5 h-3.5" />
            </button>
            <span
                className="w-9 sm:w-10 text-center text-xs font-semibold tabular-nums text-stone-900 dark:text-stone-100 flex items-center justify-center select-none"
                aria-live="polite"
            >
                {quantity}
            </span>
            <button
                type="button"
                onClick={handleIncrement}
                className="w-8 sm:w-9 h-8 sm:h-9 flex items-center justify-center text-stone-500 hover:text-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                aria-label={`${t('increaseQuantity')} ${productName}`}
            >
                <Plus className="w-3.5 h-3.5" />
            </button>
        </div>
    );
}
