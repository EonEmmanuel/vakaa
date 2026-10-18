'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { CheckCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { sendContactMessage } from './send-contact-message';

export function ContactForm() {
    const t = useTranslations('Contact');
    const [isPending, startTransition] = useTransition();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.message) {
            toast.error(t('formInvalid'));
            return;
        }

        startTransition(async () => {
            const res = await sendContactMessage({
                name: formData.name,
                email: formData.email,
                subject: formData.subject,
                message: formData.message,
            });

            if (res.ok) {
                setIsSubmitted(true);
                toast.success(t('formSuccess'));
                setFormData({ name: '', email: '', subject: '', message: '' });
                return;
            }

            if (res.reason === 'rate_limited') {
                toast.error(t('formRateLimited'));
            } else if (res.reason === 'invalid') {
                toast.error(t('formInvalid'));
            } else {
                toast.error(t('formUnavailable'));
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#1D120A] block">
                        {t('formName')} *
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={t('formName')}
                        className="w-full bg-white border border-[#E7DED0] px-5 py-3.5 text-xs sm:text-sm rounded-full focus:outline-none focus:border-[#D4A43C] focus:ring-1 focus:ring-[#D4A43C] transition-all placeholder:text-[#3A2418]/30 text-[#1D120A]"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#1D120A] block">
                        {t('formEmail')} *
                    </label>
                    <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder={t('formEmail')}
                        className="w-full bg-white border border-[#E7DED0] px-5 py-3.5 text-xs sm:text-sm rounded-full focus:outline-none focus:border-[#D4A43C] focus:ring-1 focus:ring-[#D4A43C] transition-all placeholder:text-[#3A2418]/30 text-[#1D120A]"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-semibold text-[#1D120A] block">
                    {t('formSubject')} *
                </label>
                <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder={t('formSubject')}
                    className="w-full bg-white border border-[#E7DED0] px-5 py-3.5 text-xs sm:text-sm rounded-full focus:outline-none focus:border-[#D4A43C] focus:ring-1 focus:ring-[#D4A43C] transition-all placeholder:text-[#3A2418]/30 text-[#1D120A]"
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs font-semibold text-[#1D120A] block">
                    {t('formMessage')} *
                </label>
                <textarea
                    rows={6}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={t('formMessage')}
                    className="w-full bg-white border border-[#E7DED0] p-5 text-xs sm:text-sm rounded-2xl sm:rounded-3xl focus:outline-none focus:border-[#D4A43C] focus:ring-1 focus:ring-[#D4A43C] transition-all placeholder:text-[#3A2418]/30 text-[#1D120A] resize-none"
                />
            </div>

            <div>
                <button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex items-center justify-center gap-2 bg-[#1D120A] hover:bg-[#1D120A]/90 text-[#FAF8F5] rounded-full px-9 py-4 text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-sm hover:shadow active:scale-[0.98] cursor-pointer disabled:opacity-50"
                >
                    {isSubmitted ? (
                        <>
                            <CheckCircle2 className="w-4 h-4 text-[#D4A43C]" />
                            <span>{t('formSuccess') || 'Message Envoyé'}</span>
                        </>
                    ) : (
                        <>
                            <span>{isPending ? '...' : t('formSubmit')}</span>
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}

