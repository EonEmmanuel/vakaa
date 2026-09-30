import { Check, ShoppingBag, ClipboardList, AlertCircle, RefreshCw, Truck, MapPin, FileDown } from 'lucide-react';
import { Link } from '@/platform/i18n/navigation';
import Image from 'next/image';
import { Price } from '@/features/pricing/price';
import { notFound } from 'next/navigation';
import { getRouteLocale } from '@/platform/i18n/server';
import { getTranslations } from 'next-intl/server';
import { query } from '@/platform/vendure/api';
import { graphql } from '@/platform/vendure/graphql';
import { OrderStatusBadge } from '@/features/orders/order-status-badge';
import { PrintReceiptButton } from '@/features/orders/print-receipt-button';
import { TrustBar } from '@/site/home/trust-bar';
import { DecorativeDotCluster } from '@/components/ui/decorative-dot-cluster';

const GetOrderByCodeQuery = graphql(`
    query GetOrderByCode($code: String!) {
        orderByCode(code: $code) {
            id
            code
            state
            orderPlacedAt
            totalWithTax
            currencyCode
            lines {
                id
                productVariant {
                    id
                    name
                    product {
                        id
                        name
                        slug
                        featuredAsset {
                            id
                            preview
                        }
                    }
                }
                quantity
                linePriceWithTax
                unitPriceWithTax
            }
            shippingAddress {
                fullName
                streetLine1
                streetLine2
                city
                province
                postalCode
                country
                phoneNumber
            }
            shippingLines {
                shippingMethod {
                    name
                }
                priceWithTax
            }
            payments {
                id
                method
                state
                amount
            }
            customer {
                id
                emailAddress
                firstName
                lastName
            }
        }
    }
`);

interface OrderConfirmationProps {
    paramsPromise: Promise<{ locale: string; code: string }>;
    searchParamsPromise?: Promise<Record<string, string | string[] | undefined>>;
}

export async function OrderConfirmation({ paramsPromise, searchParamsPromise }: OrderConfirmationProps) {
    const { code } = await paramsPromise;
    const searchParams = searchParamsPromise ? await searchParamsPromise : {};
    const rawStatus = typeof searchParams.status === 'string'
        ? searchParams.status.toLowerCase()
        : Array.isArray(searchParams.status)
        ? searchParams.status[0]?.toLowerCase()
        : undefined;
    const isCancelled = rawStatus === 'cancelled' || rawStatus === 'failed';

    const transactionId = typeof searchParams.transaction_id === 'string'
        ? searchParams.transaction_id
        : Array.isArray(searchParams.transaction_id)
        ? searchParams.transaction_id[0]
        : undefined;

    if (transactionId && (rawStatus === 'successful' || rawStatus === 'completed')) {
        try {
            const shopUrl = process.env.VENDURE_SHOP_API_URL || 'http://localhost:3000/shop-api';
            const serverUrl = shopUrl.replace(/\/shop-api\/?$/, '');
            await fetch(`${serverUrl}/payments/flutterwave/verify/${encodeURIComponent(transactionId)}`, {
                cache: 'no-store',
            });
        } catch {
            // Non-blocking: background verification will also capture it
        }
    }

    const locale = await getRouteLocale();
    const t = await getTranslations({ locale, namespace: 'OrderConfirmation' });
    const tCart = await getTranslations({ locale, namespace: 'Cart' });

    const { data } = await query(GetOrderByCodeQuery, { code }, { useAuthToken: true });
    const order = data?.orderByCode;

    if (!order) {
        notFound();
    }

    // Determine payment method label
    const paymentMethod = order.payments && order.payments.length > 0
        ? order.payments[0].method === 'sebpay'
            ? 'Mobile Money (Orange / MTN)'
            : order.payments[0].method === 'flutterwave'
            ? 'Carte Bancaire / MoMo'
            : order.payments[0].method
        : 'Paiement Sécurisé';

    const shopUrl = process.env.VENDURE_SHOP_API_URL || 'http://localhost:3000/shop-api';
    const serverUrl = shopUrl.replace(/\/shop-api\/?$/, '');
    const customerEmail = order.customer?.emailAddress || '';
    const invoiceDownloadUrl = `${serverUrl}/api/invoices/download/${order.code}${customerEmail ? `?email=${encodeURIComponent(customerEmail)}` : ''}`;

    return (
        <div className="min-h-screen bg-[#FAF8F5] text-[#1D120A] flex flex-col">
            {/* 1. Hero Breadcrumbs Header Banner */}
            <section className="relative w-full overflow-hidden bg-[#FAF8F5] border-b border-[#E7DED0]/60 pt-28 sm:pt-32 pb-12 sm:pb-16 text-center transition-colors">
                <div className="absolute left-4 sm:left-12 top-1/2 -translate-y-1/2 w-32 sm:w-44 h-20 pointer-events-none opacity-70">
                    <DecorativeDotCluster className="w-full h-full" />
                </div>
                <div className="absolute right-4 sm:right-12 top-1/2 -translate-y-1/2 w-32 sm:w-44 h-20 pointer-events-none opacity-70 transform rotate-180">
                    <DecorativeDotCluster className="w-full h-full" />
                </div>

                <div className="vakaa-container relative z-10 space-y-3">
                    <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1D120A] leading-tight">
                        {isCancelled ? t('paymentIncomplete') : t('orderConfirmed')}
                    </h1>

                    <nav aria-label="Fil d'ariane" className="flex items-center justify-center gap-2 text-xs sm:text-sm text-[#3A2418]/60">
                        <Link href="/" className="hover:text-[#A66B2D] transition-colors cursor-pointer">
                            {tCart('home')}
                        </Link>
                        <span className="text-[#3A2418]/30">/</span>
                        <Link href="/account/orders" className="hover:text-[#A66B2D] transition-colors cursor-pointer">
                            Commandes
                        </Link>
                        <span className="text-[#3A2418]/30">/</span>
                        <span className="font-semibold text-[#1D120A]">
                            #{order.code}
                        </span>
                    </nav>
                </div>
            </section>

            {/* 2. Main Order Confirmation Content */}
            <main className="vakaa-container py-10 sm:py-14 max-w-3xl flex-1 space-y-8">
                {/* Visual Status Indicator */}
                <div className="text-center space-y-3">
                    <div className="flex justify-center">
                        {isCancelled ? (
                            <div className="size-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shadow-sm">
                                <AlertCircle className="size-8 text-amber-600" strokeWidth={2.5} />
                            </div>
                        ) : (
                            <div className="size-16 rounded-full bg-[#1B3B2B] text-white flex items-center justify-center shadow-md shadow-[#1B3B2B]/20">
                                <Check className="size-8 text-white" strokeWidth={3} />
                            </div>
                        )}
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
                        {isCancelled ? t('paymentIncomplete') : t('orderConfirmed')}
                    </h2>

                    <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 max-w-lg mx-auto leading-relaxed">
                        {isCancelled ? (
                            t('paymentCancelledMessage')
                        ) : (
                            <>
                                {t('thankYou')}{' '}
                                <span className="font-bold text-stone-900 dark:text-stone-100">#{order.code}</span>.
                            </>
                        )}
                    </p>

                    {!isCancelled && (
                        <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
                            {t('emailConfirmation')}
                        </p>
                    )}
                </div>

                {/* 3. FutureCommerce Golden Header Order Card (Design Reference: 2cacad...) */}
                <div className="rounded-xl overflow-hidden border border-stone-200/80 dark:border-stone-800 shadow-sm bg-white dark:bg-[#1A120B]">
                    {/* Golden Banner Header */}
                    <div className="bg-[#EAA838] dark:bg-[#D4A43C] text-white px-5 py-4 sm:px-7 sm:py-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs sm:text-sm font-medium">
                        <div className="space-y-1">
                            <span className="text-white/80 text-[11px] uppercase tracking-wider block">{t('orderId')}</span>
                            <span className="font-bold text-sm sm:text-base text-white">#{order.code}</span>
                        </div>
                        <div className="space-y-1">
                            <span className="text-white/80 text-[11px] uppercase tracking-wider block">{t('totalPayment')}</span>
                            <span className="font-bold text-sm sm:text-base text-white">
                                <Price value={order.totalWithTax} currencyCode={order.currencyCode} />
                            </span>
                        </div>
                        <div className="space-y-1">
                            <span className="text-white/80 text-[11px] uppercase tracking-wider block">{t('paymentMethod')}</span>
                            <span className="font-bold text-xs sm:text-sm text-white truncate block">{paymentMethod}</span>
                        </div>
                        <div className="space-y-1">
                            <span className="text-white/80 text-[11px] uppercase tracking-wider block">{t('status')}</span>
                            <div>
                                <OrderStatusBadge state={order.state} />
                            </div>
                        </div>
                    </div>

                    {/* Order Body Details */}
                    <div className="p-6 sm:p-7 space-y-6">
                        {/* Status Alert Pill */}
                        {!isCancelled && (
                            <div className="p-3.5 sm:p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm text-emerald-900 dark:text-emerald-200">
                                <div className="flex items-center gap-2.5">
                                    <div className="size-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                                        <Check className="size-3.5" strokeWidth={3} />
                                    </div>
                                    <span className="font-medium">
                                        {t('orderAccepted')}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                                    <PrintReceiptButton label={t('printReceipt')} />
                                    <a
                                        href={invoiceDownloadUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        download={`Facture-${order.code}.pdf`}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/40 text-xs font-semibold text-emerald-800 dark:text-emerald-300 transition-colors cursor-pointer"
                                    >
                                        <FileDown className="size-3.5" />
                                        {t('downloadInvoice')}
                                    </a>
                                </div>
                            </div>
                        )}

                        {/* Items List */}
                        <div className="space-y-4">
                            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 tracking-tight">
                                {t('orderSummary')}
                            </h3>

                            <div className="divide-y divide-stone-100 dark:divide-stone-800">
                                {order.lines.map((line) => (
                                    <div key={line.id} className="py-4 flex items-center gap-4">
                                        {line.productVariant.product.featuredAsset ? (
                                            <Link
                                                href={`/product/${line.productVariant.product.slug}`}
                                                className="size-16 sm:size-20 rounded-lg bg-[#F3EFE9] dark:bg-[#20150E] p-1.5 flex items-center justify-center shrink-0 border border-stone-200/60 dark:border-stone-800 group hover:border-[#1B3B2B]/40 transition-colors"
                                            >
                                                <Image
                                                    src={line.productVariant.product.featuredAsset.preview}
                                                    alt={line.productVariant.name}
                                                    width={80}
                                                    height={80}
                                                    className="object-contain w-full h-full mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform"
                                                />
                                            </Link>
                                        ) : (
                                            <div className="size-16 sm:size-20 rounded-lg bg-[#F3EFE9] dark:bg-[#20150E] flex items-center justify-center shrink-0 border border-stone-200/60 dark:border-stone-800">
                                                <ShoppingBag className="w-6 h-6 text-stone-400" />
                                            </div>
                                        )}

                                        <div className="flex-1 min-w-0">
                                            <Link
                                                href={`/product/${line.productVariant.product.slug}`}
                                                className="font-semibold text-sm sm:text-base text-stone-900 dark:text-stone-100 hover:text-[#1B3B2B] transition-colors line-clamp-1"
                                            >
                                                {line.productVariant.product.name}
                                            </Link>
                                            {line.productVariant.name !== line.productVariant.product.name && (
                                                <p className="text-xs text-stone-500 mt-0.5">
                                                    {line.productVariant.name}
                                                </p>
                                            )}
                                            <div className="mt-1">
                                                <span className="inline-flex text-[11px] font-medium bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 px-2 py-0.5 rounded-full">
                                                    {t('qty', { quantity: line.quantity })}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="text-right shrink-0">
                                            <p className="font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100">
                                                <Price value={line.linePriceWithTax} currencyCode={order.currencyCode} />
                                            </p>
                                            <p className="text-xs text-stone-400 mt-0.5">
                                                <Price value={line.unitPriceWithTax} currencyCode={order.currencyCode} /> / unité
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Shipping Address & Delivery Recap */}
                        {order.shippingAddress && (
                            <div className="pt-4 border-t border-stone-200/80 dark:border-stone-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-4 rounded-lg bg-stone-50/70 dark:bg-stone-900/40 border border-stone-200/60 dark:border-stone-800 space-y-1.5">
                                    <div className="flex items-center gap-2 text-stone-800 dark:text-stone-200 mb-1">
                                        <MapPin className="size-4 text-[#A66B2D]" />
                                        <h4 className="font-semibold text-xs tracking-wider uppercase">{t('shippingAddress')}</h4>
                                    </div>
                                    <p className="font-semibold text-sm text-stone-900 dark:text-stone-100">{order.shippingAddress.fullName}</p>
                                    <p className="text-xs text-stone-600 dark:text-stone-400">
                                        {order.shippingAddress.streetLine1}
                                        {order.shippingAddress.streetLine2 && `, ${order.shippingAddress.streetLine2}`}
                                    </p>
                                    <p className="text-xs text-stone-600 dark:text-stone-400">
                                        {order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.postalCode}
                                    </p>
                                    <p className="text-xs text-stone-600 dark:text-stone-400">{order.shippingAddress.country}</p>
                                    <p className="text-xs font-medium text-stone-700 dark:text-stone-300 pt-0.5">{order.shippingAddress.phoneNumber}</p>
                                </div>

                                <div className="p-4 rounded-lg bg-stone-50/70 dark:bg-stone-900/40 border border-stone-200/60 dark:border-stone-800 space-y-1.5 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 text-stone-800 dark:text-stone-200 mb-1">
                                            <Truck className="size-4 text-[#A66B2D]" />
                                            <h4 className="font-semibold text-xs tracking-wider uppercase">Expédition</h4>
                                        </div>
                                        <p className="font-semibold text-sm text-stone-900 dark:text-stone-100">
                                            {order.shippingLines && order.shippingLines.length > 0
                                                ? order.shippingLines[0].shippingMethod.name
                                                : 'Livraison Express VAKAA'}
                                        </p>
                                        <p className="text-xs text-stone-500 mt-1">
                                            Suivi en temps réel par SMS et e-mail à chaque étape de l'acheminement.
                                        </p>
                                    </div>

                                    <div className="pt-2">
                                        <Link
                                            href={`/track-order?code=${order.code}`}
                                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1B3B2B] dark:text-[#D4A43C] hover:underline"
                                        >
                                            <Truck className="size-3.5" />
                                            {t('trackOrder')}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Grand Total Summary */}
                        <div className="pt-4 border-t border-stone-200/80 dark:border-stone-800 flex justify-between items-baseline">
                            <span className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
                                {t('total')}
                            </span>
                            <span className="text-2xl sm:text-3xl font-bold text-stone-950 dark:text-white tabular-nums">
                                <Price value={order.totalWithTax} currencyCode={order.currencyCode} />
                            </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-4 border-t border-stone-200/80 dark:border-stone-800 flex flex-col sm:flex-row gap-3.5">
                            {isCancelled ? (
                                <>
                                    <Link
                                        href="/checkout"
                                        className="flex-1 h-12 flex items-center justify-center rounded-full bg-[#1B3B2B] hover:bg-[#152e22] text-white text-sm font-semibold transition-all shadow-sm active:scale-[0.99]"
                                    >
                                        <RefreshCw className="mr-2 h-4 w-4" />
                                        {t('retryPayment')}
                                    </Link>
                                    <Link
                                        href="/"
                                        className="flex-1 h-12 flex items-center justify-center rounded-full border border-stone-300 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-sm font-semibold transition-all"
                                    >
                                        <ShoppingBag className="mr-2 h-4 w-4" />
                                        {t('continueShopping')}
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/"
                                        className="flex-1 h-12 flex items-center justify-center rounded-full bg-[#1B3B2B] hover:bg-[#152e22] text-white text-sm font-semibold transition-all shadow-sm active:scale-[0.99]"
                                    >
                                        <ShoppingBag className="mr-2 h-4 w-4" />
                                        {t('continueShopping')}
                                    </Link>
                                    <a
                                        href={invoiceDownloadUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        download={`Facture-${order.code}.pdf`}
                                        className="flex-1 h-12 flex items-center justify-center rounded-full border border-stone-300 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-sm font-semibold transition-all cursor-pointer"
                                    >
                                        <FileDown className="mr-2 h-4 w-4" />
                                        {t('downloadInvoice')}
                                    </a>
                                    <Link
                                        href="/account/orders"
                                        className="flex-1 h-12 flex items-center justify-center rounded-full border border-stone-300 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-sm font-semibold transition-all"
                                    >
                                        <ClipboardList className="mr-2 h-4 w-4" />
                                        {t('viewOrders')}
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* 4. Universal Trust Bar */}
            <TrustBar />
        </div>
    );
}
