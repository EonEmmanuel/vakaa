'use client';

import { useEffect, useRef } from 'react';
import { useCart } from '@/features/cart/context/cart-context';

interface FlutterwaveReconcilerProps {
    transactionId?: string;
    orderCode: string;
}

/**
 * Background reconciler and session cleaner for confirmed orders.
 * Automatically purges the client-side cart snapshot so settled orders do not linger.
 * Asynchronously reconciles Flutterwave transactions if transactionId is present.
 */
export function FlutterwaveReconciler({ transactionId, orderCode }: FlutterwaveReconcilerProps) {
    const executedRef = useRef(false);
    const cartPurgedRef = useRef(false);
    const { clearCart } = useCart();

    useEffect(() => {
        if (!cartPurgedRef.current) {
            cartPurgedRef.current = true;
            try {
                sessionStorage.removeItem('vakaa_cart_snapshot_v1');
            } catch {}
            void clearCart().catch(() => {});
        }
    }, [clearCart]);

    useEffect(() => {
        if (!transactionId || executedRef.current) return;
        executedRef.current = true;

        fetch(
            `/api/payments/verify-flutterwave?id=${encodeURIComponent(transactionId)}&orderCode=${encodeURIComponent(orderCode)}`,
            { method: 'POST' }
        ).catch(() => {
            // Non-blocking: background server webhook handles primary reconciliation guarantee
        });
    }, [transactionId, orderCode]);

    return null;
}
