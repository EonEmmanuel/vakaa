'use server';

import { getVendureServerUrl } from '@/platform/vendure/api';

export type ContactSubmitResult = {
    ok: boolean;
    reason?: 'invalid' | 'rate_limited' | 'unavailable';
};

/**
 * Relays the contact form to the Vendure contact endpoint, which emails the
 * shop inbox over Brevo SMTP. The backend returns generic 4xx/5xx bodies on
 * purpose — no infrastructure details are passed through to the UI.
 */
export async function sendContactMessage(input: {
    name: string;
    email: string;
    subject: string;
    message: string;
}): Promise<ContactSubmitResult> {
    const name = input.name?.trim() ?? '';
    const email = input.email?.trim() ?? '';
    const subject = input.subject?.trim() ?? '';
    const message = input.message?.trim() ?? '';

    if (!name || !email || !message) {
        return { ok: false, reason: 'invalid' };
    }

    try {
        const res = await fetch(`${getVendureServerUrl()}/contact`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ name, email, subject, message }),
            cache: 'no-store',
        });

        if (res.ok) {
            return { ok: true };
        }
        if (res.status === 400) {
            return { ok: false, reason: 'invalid' };
        }
        if (res.status === 429) {
            return { ok: false, reason: 'rate_limited' };
        }
        return { ok: false, reason: 'unavailable' };
    } catch {
        return { ok: false, reason: 'unavailable' };
    }
}
