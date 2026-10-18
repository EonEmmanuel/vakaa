'use client';

import { useState } from 'react';
import { Link } from '@/platform/i18n/navigation';
import { Package, Truck, Check, FileText, ClipboardCheck, Clock, XCircle } from "lucide-react";
import { DecorativeDotCluster } from '@/components/ui/decorative-dot-cluster';
import { TrustBar } from '@/components/shared/trust-bar';
import { useLocale, useTranslations } from 'next-intl';
import {
    findOrderByCode,
    type TrackedOrder,
    type TrackOrderResult,
} from '@/features/orders/track-order-data';
import { normalizeAssetUrl } from '@/lib/utils';

const PAYMENT_CONFIRMED = new Set(['PaymentAuthorized', 'PaymentSettled']);
const SHIP_IN_PROGRESS = new Set(['PartiallyShipped']);
const SHIPPED = new Set(['Shipped']);
const DELIVERED = new Set(['PartiallyDelivered', 'Delivered']);
const ORDER_STOPPED = new Set(['Cancelled', 'PaymentDeclined', 'PaymentFailed']);
const REFUNDED = new Set(['Refunded', 'PartiallyRefunded', 'Returned', 'PartiallyReturned']);

type Progress = { step: number } | { cancelled: true; refunded: boolean };

/** Maps the real Vendure order state onto the public stepper. No invented dates. */
function deriveProgress(state: string): Progress {
    if (ORDER_STOPPED.has(state)) return { cancelled: true, refunded: false };
    if (REFUNDED.has(state)) return { cancelled: true, refunded: true };
    if (DELIVERED.has(state)) return { step: 4 };
    if (SHIPPED.has(state) || SHIP_IN_PROGRESS.has(state)) return { step: 3 };
    if (PAYMENT_CONFIRMED.has(state)) return { step: 1 };
    return { step: 0 }; // Created, AddingItems, ArrangingPayment, Modifying...
}

const STATUS_STEPS: Array<{
    labelKey: string;
    icon: typeof FileText;
}> = [
    { labelKey: 'stepPlaced', icon: FileText },
    { labelKey: 'stepPayment', icon: ClipboardCheck },
    { labelKey: 'stepAtelier', icon: Package },
    { labelKey: 'stepShipped', icon: Truck },
    { labelKey: 'stepDelivered', icon: Check },
];

const STATUS_NOTE_KEY: Record<number, string> = {
    0: 'statusPlaced',
    1: 'statusPayment',
    2: 'statusAtelier',
    3: 'statusShipped',
    4: 'statusDelivered',
};

export function TrackOrderPage() {
    const t = useTranslations('Tracking');
    const locale = useLocale();
    const [orderCode, setOrderCode] = useState('');
    const [email, setEmail] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [trackedOrder, setTrackedOrder] = useState<TrackedOrder | null>(null);
    const [progressStep, setProgressStep] = useState(0);
    const [isCancelled, setIsCancelled] = useState(false);
    const [isRefunded, setIsRefunded] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        setIsSearching(true);
        let result: TrackOrderResult;
        try {
            result = await findOrderByCode(orderCode, email);
        } catch {
            result = { success: false, reason: 'request-failed' };
        }
        setIsSearching(false);

        if (result.success) {
            setTrackedOrder(result.order);
            const progress = deriveProgress(result.order.state);
            if ('cancelled' in progress) {
                setIsCancelled(true);
                setIsRefunded(progress.refunded);
            } else {
                setIsCancelled(false);
                setIsRefunded(false);
                setProgressStep(progress.step);
            }
            return;
        }

        setTrackedOrder(null);
        setIsCancelled(false);
        setIsRefunded(false);
        setError(
            result.reason === 'not-found'
                ? t('notFound')
                : result.reason === 'request-failed'
                    ? t('requestFailed')
                    : t('invalidInput'),
        );
    };

    const placedDate = (order: TrackedOrder): string | null => {
        if (!order.orderPlacedAt) return null;
        const date = new Date(order.orderPlacedAt);
        if (Number.isNaN(date.getTime())) return null;
        return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(date);
    };

    return (
        <div className="bg-[#FAF8F5] min-h-screen text-[#1D120A] flex flex-col">
            {/* 1. Centered Breadcrumb Hero Banner */}
            <section className="relative w-full overflow-hidden bg-[#FAF8F5] border-b border-[#E7DED0]/60 pt-28 sm:pt-32 pb-12 sm:pb-16 text-center transition-colors">
                <div className="absolute left-4 sm:left-12 top-1/2 -translate-y-1/2 w-32 sm:w-44 h-20 pointer-events-none opacity-70">
                    <DecorativeDotCluster className="w-full h-full" />
                </div>
                <div className="absolute right-4 sm:right-12 top-1/2 -translate-y-1/2 w-32 sm:w-44 h-20 pointer-events-none opacity-70 transform rotate-180">
                    <DecorativeDotCluster className="w-full h-full" />
                </div>

                <div className="vakaa-container relative z-10 space-y-3 max-w-3xl mx-auto">
                    <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1D120A] leading-tight">
                        {t('title')}
                    </h1>

                    <nav aria-label="Fil d'ariane" className="flex items-center justify-center gap-2 text-xs sm:text-sm text-[#3A2418]/60 pt-1">
                        <Link href="/" className="hover:text-[#D4A43C] transition-colors cursor-pointer">
                            {t('home')}
                        </Link>
                        <span className="text-[#3A2418]/30">/</span>
                        <span className="font-semibold text-[#1D120A]">
                            {t('title')}
                        </span>
                    </nav>
                </div>
            </section>

            {/* 2. Main Tracking Content */}
            <main className="vakaa-container py-14 sm:py-20 flex-1 max-w-4xl mx-auto space-y-12">
                {/* Search Form Card */}
                <div className="bg-[#FAF8F5] border border-[#E7DED0]/80 rounded-3xl p-8 sm:p-10 space-y-6">
                    <p className="text-xs sm:text-sm text-[#3A2418]/80 leading-relaxed font-sans max-w-2xl">
                        {t('subtitle')}
                    </p>

                    <form onSubmit={handleSearch} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-[#1D120A] block">
                                {t('orderIdLabel')}
                            </label>
                            <input
                                type="text"
                                required
                                value={orderCode}
                                onChange={(e) => setOrderCode(e.target.value)}
                                placeholder={t('orderIdPlaceholder')}
                                className="w-full bg-white border border-[#E7DED0] px-5 py-3.5 text-xs sm:text-sm rounded-full focus:outline-none focus:border-[#D4A43C] focus:ring-1 focus:ring-[#D4A43C] transition-all placeholder:text-[#3A2418]/30 text-[#1D120A]"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-[#1D120A] block">
                                {t('emailLabel')}
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={t('emailPlaceholder')}
                                className="w-full bg-white border border-[#E7DED0] px-5 py-3.5 text-xs sm:text-sm rounded-full focus:outline-none focus:border-[#D4A43C] focus:ring-1 focus:ring-[#D4A43C] transition-all placeholder:text-[#3A2418]/30 text-[#1D120A]"
                            />
                        </div>

                        {error && (
                            <p className="text-xs text-rose-600 font-medium">
                                {error}
                            </p>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={isSearching}
                                className="inline-flex items-center justify-center gap-2 bg-[#1D120A] hover:bg-[#1D120A]/90 text-[#FAF8F5] rounded-full px-8 py-3.5 text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-sm hover:shadow active:scale-[0.98] cursor-pointer disabled:opacity-50"
                            >
                                {isSearching ? (
                                    <>
                                        <Clock className="w-4 h-4 animate-spin" />
                                        <span>{t('submitting')}</span>
                                    </>
                                ) : (
                                    <span>{t('submit')}</span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Real Order Results. Only rendered from actual Vendure data. */}
                {trackedOrder && (
                    <div className="space-y-8 pt-6">
                        <div className="bg-[#FAF8F5] border border-[#E7DED0]/80 rounded-3xl p-8 sm:p-10 space-y-8">
                            <div className="space-y-1">
                                <h2 className="font-sans text-xl sm:text-2xl font-bold text-[#1D120A]">
                                    {t('statusTitle')}
                                </h2>
                                <p className="text-xs sm:text-sm text-[#3A2418]/70">
                                    {t('orderPrefix')} : <span className="font-semibold text-[#1D120A]">#{trackedOrder.code}</span>
                                    {placedDate(trackedOrder) && (
                                        <> · {t('placedOn', { date: placedDate(trackedOrder) as string })}</>
                                    )}
                                </p>
                            </div>

                            {isCancelled ? (
                                <div className="flex items-start gap-4 rounded-2xl bg-[#F3EFE9] border border-[#E7DED0] p-6">
                                    <XCircle className="w-6 h-6 text-[#1D120A]/60 shrink-0" />
                                    <div className="space-y-1">
                                        <h3 className="font-sans text-sm font-bold text-[#1D120A]">
                                            {t('cancelledTitle')}
                                        </h3>
                                        <p className="text-xs text-[#3A2418]/70 leading-relaxed">
                                            {isRefunded ? t('refundedNote') : t('cancelledNote')}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {/* Stepper timeline driven by the actual order state */}
                                    <div className="relative pt-4 pb-2">
                                        <div className="grid grid-cols-5 gap-2 relative z-10">
                                            {STATUS_STEPS.map((step, idx) => {
                                                const StepIcon = step.icon;
                                                const isDone = idx <= progressStep;
                                                return (
                                                    <div key={step.labelKey} className="flex flex-col items-center text-center space-y-2">
                                                        {/* Top icon */}
                                                        <div className="size-10 rounded-xl bg-[#F3EFE9] flex items-center justify-center text-[#D4A43C] mb-1">
                                                            <StepIcon className="w-5 h-5" />
                                                        </div>

                                                        <span className="text-xs font-semibold text-[#1D120A] hidden sm:block">
                                                            {t(step.labelKey)}
                                                        </span>

                                                        {/* Status Check / Dot */}
                                                        <div
                                                            className={`size-6 rounded-full flex items-center justify-center text-xs transition-colors ${
                                                                isDone ? 'bg-[#1D120A] text-[#FAF8F5]' : 'bg-[#E7DED0]'
                                                            }`}
                                                        >
                                                            {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <p className="text-xs sm:text-sm text-[#3A2418]/80 leading-relaxed">
                                        {t(STATUS_NOTE_KEY[progressStep] ?? 'statusPlaced')}
                                    </p>
                                </>
                            )}
                        </div>

                        {/* Ordered Products Card — real line items */}
                        <div className="bg-[#FAF8F5] border border-[#E7DED0]/80 rounded-3xl p-8 sm:p-10 space-y-6">
                            <h3 className="font-sans text-lg font-bold text-[#1D120A]">
                                {t('itemsTitle')}
                            </h3>

                            <div className="space-y-4 divide-y divide-[#E7DED0]/60">
                                {trackedOrder.lines.map((line, idx) => (
                                    <div key={idx} className="pt-4 first:pt-0 flex items-center gap-4">
                                        <div className="size-16 rounded-2xl bg-[#F3EFE9] border border-[#E7DED0] overflow-hidden shrink-0">
                                            <img
                                                src={line.image ? normalizeAssetUrl(line.image) : '/images/placeholder-product.svg'}
                                                alt={t('imageAlt')}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="font-sans text-sm font-bold text-[#1D120A]">
                                                {line.name}
                                            </h4>
                                            <p className="text-xs text-[#3A2418]/70">
                                                {line.quantity} {t('qtySuffix')}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* 3. Universal Trust Bar */}
            <TrustBar />
        </div>
    );
}
