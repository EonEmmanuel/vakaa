import { Body, Controller, HttpException, HttpStatus, Module, Post, Req } from '@nestjs/common';
import { Logger, PluginCommonModule, VendurePlugin } from '@vendure/core';
import * as nodemailer from 'nodemailer';

/**
 * Public contact-form endpoint.
 *
 * Accepts JSON {name, email, subject?, message} at POST /contact and relays it
 * to the shop inbox over the same Brevo SMTP account used for order emails.
 * Validation problems return 400; rate limits return 429; infrastructure
 * problems return 5xx with a generic body — the real reason is only logged.
 */

interface ContactMessageDto {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
}

interface HttpRequest {
    headers?: Record<string, string | string[] | undefined>;
    socket?: { remoteAddress?: string };
    ip?: string;
}

const loggerCtx = 'ContactPlugin';
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const rateBuckets = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const bucket = rateBuckets.get(ip);
    if (!bucket || bucket.resetAt < now) {
        rateBuckets.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
        // Opportunistic cleanup so the map cannot grow unbounded.
        if (rateBuckets.size > 10000) {
            for (const [key, value] of rateBuckets) {
                if (value.resetAt < now) {
                    rateBuckets.delete(key);
                }
            }
        }
        return false;
    }
    bucket.count += 1;
    return bucket.count > RATE_LIMIT_MAX;
}

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

@Controller('contact')
export class ContactController {
    private readonly transporter: nodemailer.Transporter | null;

    constructor() {
        this.transporter =
            process.env.BREVO_SMTP_USER && process.env.BREVO_SMTP_KEY
                ? nodemailer.createTransport({
                      host: process.env.BREVO_SMTP_HOST || 'smtp-relay.brevo.com',
                      port: +(process.env.BREVO_SMTP_PORT || 587),
                      secure: process.env.BREVO_SMTP_SECURE === 'true',
                      auth: {
                          user: process.env.BREVO_SMTP_USER,
                          pass: process.env.BREVO_SMTP_KEY,
                      },
                      pool: true,
                      maxConnections: 2,
                  })
                : null;
    }

    @Post()
    async submit(@Body() body: ContactMessageDto, @Req() req: HttpRequest): Promise<{ ok: boolean }> {
        const name = typeof body?.name === 'string' ? body.name.trim() : '';
        const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
        const subject = typeof body?.subject === 'string' ? body.subject.trim() : '';
        const message = typeof body?.message === 'string' ? body.message.trim() : '';

        if (!name || name.length > 120) {
            throw new HttpException('Invalid name', HttpStatus.BAD_REQUEST);
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) {
            throw new HttpException('Invalid email', HttpStatus.BAD_REQUEST);
        }
        if (subject.length > 200) {
            throw new HttpException('Invalid subject', HttpStatus.BAD_REQUEST);
        }
        if (!message || message.length > 5000) {
            throw new HttpException('Invalid message', HttpStatus.BAD_REQUEST);
        }

        const ip = req.ip || req.socket?.remoteAddress || 'unknown';
        if (isRateLimited(ip)) {
            Logger.warn(`Contact rate limit hit for ${ip}`, loggerCtx);
            throw new HttpException('Too many requests', HttpStatus.TOO_MANY_REQUESTS);
        }

        if (!this.transporter) {
            Logger.error(
                'Contact email transport is not configured (BREVO_SMTP_USER / BREVO_SMTP_KEY missing)',
                loggerCtx,
            );
            throw new HttpException('Unable to send message right now', HttpStatus.SERVICE_UNAVAILABLE);
        }

        const inbox = process.env.CONTACT_INBOX || 'contact@vakaa.online';
        const fromAddress = process.env.CONTACT_FROM_ADDRESS || '"VAKÁA" <contact@vakaa.online>';
        const safeName = escapeHtml(name);
        const safeEmail = escapeHtml(email);
        const safeSubject = escapeHtml(subject) || '—';
        const safeMessage = escapeHtml(message).replace(/\r?\n/g, '<br>');

        try {
            await this.transporter.sendMail({
                from: fromAddress,
                to: inbox,
                replyTo: email,
                subject: `[vakaa.online] Message de ${name}${subject ? ' — ' + subject : ''}`,
                text: [
                    `Nouveau message reçu sur vakaa.online`,
                    ``,
                    `Nom : ${name}`,
                    `E-mail : ${email}`,
                    `Objet : ${subject || '—'}`,
                    ``,
                    message,
                    ``,
                    `---`,
                    `IP : ${ip} · ${new Date().toISOString()}`,
                ].join('\n'),
                html: [
                    `<h2 style="font-family:sans-serif">Nouveau message — vakaa.online</h2>`,
                    `<p style="font-family:sans-serif"><strong>Nom :</strong> ${safeName}</p>`,
                    `<p style="font-family:sans-serif"><strong>E-mail :</strong> ${safeEmail}</p>`,
                    `<p style="font-family:sans-serif"><strong>Objet :</strong> ${safeSubject}</p>`,
                    `<p style="font-family:sans-serif"><strong>Message :</strong></p>`,
                    `<p style="font-family:sans-serif">${safeMessage}</p>`,
                    `<hr>`,
                    `<p style="color:#888;font-size:12px;font-family:sans-serif">IP : ${escapeHtml(ip)} · ${new Date().toISOString()}</p>`,
                ].join(''),
            });
        } catch (err) {
            Logger.error(
                `Failed to send contact message: ${err instanceof Error ? err.message : String(err)}`,
                loggerCtx,
            );
            throw new HttpException('Unable to send message right now', HttpStatus.BAD_GATEWAY);
        }

        Logger.info(`Contact message from ${email} delivered to ${inbox}`, loggerCtx);
        return { ok: true };
    }
}

@VendurePlugin({
    imports: [PluginCommonModule],
    controllers: [ContactController],
})
export class ContactPlugin {}
