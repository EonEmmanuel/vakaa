import { NextRequest, NextResponse } from 'next/server';
import { query, getVendureServerUrl } from '@/platform/vendure/api';
import { graphql } from '@/platform/vendure/graphql';
import { verifyInvoiceToken } from '../lib/invoice-security';

const GetOrderForInvoiceQuery = graphql(`
    query GetOrderForInvoice($code: String!) {
        orderByCode(code: $code) {
            id
            code
            state
            orderPlacedAt
            customer {
                id
                emailAddress
            }
        }
    }
`);

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ code: string }> }
) {
    const { code } = await context.params;
    if (!code) {
        return NextResponse.json({ error: 'Code de commande manquant' }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    // Query order data server-side
    const result = await query(GetOrderForInvoiceQuery, { code }, { useAuthToken: true });
    const order = result.data?.orderByCode;

    const serverUrl = getVendureServerUrl();

    if (!order) {
        // Fallback: If Shop API didn't return the order (e.g. guest session expired or opened from email on a new device),
        // delegate verification to the backend with the HMAC token if provided.
        if (token) {
            try {
                const backendInvoiceUrl = `${serverUrl}/api/invoices/download/${encodeURIComponent(code)}?token=${encodeURIComponent(token)}`;
                const backendResponse = await fetch(backendInvoiceUrl, {
                    headers: { Accept: 'application/pdf' },
                    cache: 'no-store',
                });

                if (backendResponse.ok) {
                    const headers = new Headers();
                    headers.set('Content-Type', 'application/pdf');
                    headers.set('Content-Disposition', `inline; filename="Facture-VAKAA-${code}.pdf"`);
                    headers.set('Cache-Control', 'private, max-age=86400, no-transform');
                    return new NextResponse(backendResponse.body, {
                        status: 200,
                        headers,
                    });
                }
            } catch {
                // fall through to 404
            }
        }
        return NextResponse.json({ error: 'Commande introuvable ou lien non valide' }, { status: 404 });
    }

    const customerEmail = order.customer?.emailAddress;

    // Verify cryptographic signature if token provided
    if (token) {
        const isAuthorized = verifyInvoiceToken(order.code, customerEmail, token);
        if (!isAuthorized) {
            return NextResponse.json(
                { error: 'Signature cryptographique invalide ou expirée pour cette facture' },
                { status: 403 }
            );
        }
    }

    try {
        // Fetch the invoice stream from the private backend API server-to-server
        // Passing email ensures the currently running EC2 container works immediately with zero server rebuild needed.
        const queryParams = new URLSearchParams();
        if (customerEmail) queryParams.set('email', customerEmail);
        if (token) queryParams.set('token', token);
        const backendInvoiceUrl = `${serverUrl}/api/invoices/download/${order.code}?${queryParams.toString()}`;

        const backendResponse = await fetch(backendInvoiceUrl, {
            headers: {
                Accept: 'application/pdf',
            },
            cache: 'no-store',
        });

        if (!backendResponse.ok) {
            const errText = await backendResponse.text().catch(() => 'Erreur inconnue');
            return NextResponse.json(
                { error: 'Impossible de récupérer la facture depuis le serveur atelier', details: errText },
                { status: backendResponse.status }
            );
        }

        const headers = new Headers();
        headers.set('Content-Type', 'application/pdf');
        headers.set('Content-Disposition', `inline; filename="Facture-VAKAA-${order.code}.pdf"`);
        headers.set('Cache-Control', 'private, max-age=86400, no-transform');

        return new NextResponse(backendResponse.body, {
            status: 200,
            headers,
        });
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Erreur lors du téléchargement de la facture', message: error?.message },
            { status: 500 }
        );
    }
}
