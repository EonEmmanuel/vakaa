import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ success: false, message: 'Missing transaction ID' }, { status: 400 });
    }

    try {
        const shopUrl = process.env.VENDURE_SHOP_API_URL || process.env.NEXT_PUBLIC_VENDURE_SHOP_API_URL || 'https://api.vakaa.online/shop-api';
        const serverUrl = shopUrl.replace(/\/shop-api\/?$/, '');

        // Call Vendure server-to-server verification endpoint with a generous 15-second timeout
        const res = await fetch(`${serverUrl}/payments/flutterwave/verify/${encodeURIComponent(id)}`, {
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
