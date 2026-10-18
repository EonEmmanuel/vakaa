'use client';

import { useEffect, useRef } from 'react';

interface SebpayReconcilerProps {
    identifier?: string;
    orderCode: string;
}

const POLL_INTERVAL_MS = 5000;
// Poll for ~90 seconds: SebPay Mobile Money prompts are approved on the
// customer's phone via USSD, which can take a little while to complete.
const MAX_ATTEMPTS = 18;
const TERMINAL_STATUSES = new Set(['approved', 'rejected', 'amount_mismatch', 'not_found']);

/**
 * Background reconciler for SebPay Mobile Money orders.
 *
 * SebPay settles primarily via webhook. This adds a client-side fallback on the
 * order-confirmation page: it periodically asks the backend to re-query the
 * provider status so a missed or delayed webhook does not leave the order stuck
 * in the "Authorized" state. Polling stops as soon as a terminal status is seen.
 */
export function SebpayReconciler({ identifier, orderCode }: SebpayReconcilerProps) {
    const startedRef = useRef(false);

    useEffect(() => {
        if (!identifier || startedRef.current) return;
        startedRef.current = true;

        let cancelled = false;
        let timer: ReturnType<typeof setTimeout> | undefined;
        let attempts = 0;

        const poll = async () => {
            attempts += 1;
            try {
                const res = await fetch(
                    `/api/payments/verify-sebpay?id=${encodeURIComponent(identifier)}&orderCode=${encodeURIComponent(orderCode)}`,
                    { method: 'POST' }
                );
                const payload = (await res.json().catch(() => null)) as
                    | { data?: { settled?: boolean; status?: string } }
                    | null;
                const result = payload?.data;

                if (cancelled) return;
                if (result?.settled === true || (result?.status && TERMINAL_STATUSES.has(result.status))) {
                    return;
                }
            } catch {
                // Non-blocking: ignore transient errors and retry until attempts run out.
            }

            if (!cancelled && attempts < MAX_ATTEMPTS) {
                timer = setTimeout(poll, POLL_INTERVAL_MS);
            }
        };

        void poll();

        return () => {
            cancelled = true;
            if (timer) clearTimeout(timer);
        };
    }, [identifier, orderCode]);

    return null;
}
