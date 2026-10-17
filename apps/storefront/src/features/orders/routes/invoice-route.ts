import { NextRequest, NextResponse } from 'next/server';
import { getVendureServerUrl } from '@/platform/vendure/api';
import { extractCustomerEmailFromToken } from '../lib/invoice-security';

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ code: string; locale?: string }> }
) {
    const { code } = await context.params;
    if (!code) {
        return NextResponse.json({ error: 'Code de commande manquant' }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    // Decrypt and cryptographically verify the token against the requested order code
    const customerEmail = extractCustomerEmailFromToken(code, token);
    if (!customerEmail) {
        return NextResponse.json(
            { error: 'Signature cryptographique invalide ou non autorisée pour cette facture' },
            { status: 403 }
        );
    }

    try {
        // Fetch the invoice stream from the private backend API server-to-server.
        // We pass the verified customer email so the existing EC2 container serves the PDF immediately with zero rebuild needed.
        const serverUrl = getVendureServerUrl();
        const backendInvoiceUrl = `${serverUrl}/api/invoices/download/${encodeURIComponent(code)}?email=${encodeURIComponent(customerEmail)}`;

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
        headers.set('Content-Disposition', `inline; filename="Facture-VAKAA-${code}.pdf"`);
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
