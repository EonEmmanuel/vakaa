'use server';

export type NewsletterSubscribeResult = {
    ok: boolean;
    reason?: 'invalid' | 'unavailable';
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Subscribes an email to the "Private Circle" list through the Brevo Contacts
 * API. Configuration comes from Vercel env vars:
 *   - BREVO_API_KEY             (v3 API key — NOT the SMTP key)
 *   - BREVO_NEWSLETTER_LIST_ID  (numeric Brevo list id, optional)
 * When the key is missing the request is rejected with an honest error —
 * success is never faked.
 */
export async function subscribeToNewsletter(email: string): Promise<NewsletterSubscribeResult> {
    const normalized = (email ?? '').trim().toLowerCase();
    if (!EMAIL_PATTERN.test(normalized) || normalized.length > 200) {
        return { ok: false, reason: 'invalid' };
    }

    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) {
        console.error('[newsletter] BREVO_API_KEY is not set — subscription request rejected');
        return { ok: false, reason: 'unavailable' };
    }

    const listId = Number(process.env.BREVO_NEWSLETTER_LIST_ID);

    try {
        const res = await fetch('https://api.brevo.com/v3/contacts', {
            method: 'POST',
            headers: {
                'api-key': apiKey,
                'content-type': 'application/json',
                accept: 'application/json',
            },
            body: JSON.stringify({
                email: normalized,
                updateEnabled: true,
                ...(Number.isInteger(listId) && listId > 0 ? { listIds: [listId] } : {}),
            }),
            cache: 'no-store',
        });

        if (res.status === 201 || res.status === 204) {
            return { ok: true };
        }
        if (res.status === 400) {
            return { ok: false, reason: 'invalid' };
        }
        console.error(`[newsletter] Brevo contacts API responded with status ${res.status}`);
        return { ok: false, reason: 'unavailable' };
    } catch (e) {
        console.error('[newsletter] Brevo request failed:', e instanceof Error ? e.message : e);
        return { ok: false, reason: 'unavailable' };
    }
}
