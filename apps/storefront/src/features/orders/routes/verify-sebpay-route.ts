import { NextRequest, NextResponse } from 'next/server';

/**
 * Server-to-server fallback settlement for SebPay Mobile Money payments.
 *
 * SebPay settles primarily via webhook. This route lets the storefront ask the
 * Vendure backend to re-query the provider status (using the transaction id or
 * external reference), so a missed/delayed webhook does not leave an order stuck
 * in the "Authorized" state forever.
 */
export async function POST(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ success: false, message: 'Missing payment identifier' }, { status: 400 });
    }

    try {
        const shopUrl =
            process.env.VENDURE_SHOP_API_URL ||
            process.env.NEXT_PUBLIC_VENDURE_SHOP_API_URL ||
            'https://api.vakaa.online/shop-api';
        const serverUrl = shopUrl.replace(/\/shop-api\/?$/, '');

        // Call the Vendure SebPay status/reconciliation endpoint server-to-server.
        const res = await fetch(`${serverUrl}/payments/sebpay/status/${encodeURIComponent(id)}`, {
            method: 'GET',
            cache: 'no-store',
            signal: AbortSignal.timeout(15000),
        });

        const data = await res.json().catch(() => ({}));
        return NextResponse.json({ success: true, data });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error instanceof Error ? error.message : 'Verification request error',
        });
    }
}
