'use client';

import { use } from 'react';
import { ChevronLeft, FileDown, CheckCircle2, Clock, Truck, PackageCheck, Package, ShoppingBag, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Link } from '@/platform/i18n/navigation';
import { Price } from '@/features/pricing/price';
import { OrderStatusBadge } from '@/features/orders/order-status-badge';
import { formatDate } from '@/platform/i18n/format';
import { useLocale, useTranslations } from 'next-intl';
import type { ResultOf } from '@/platform/vendure/graphql';
import type { GetOrderDetailQuery } from '@/features/account/graphql';

type OrderByCode = NonNullable<ResultOf<typeof GetOrderDetailQuery>['orderByCode']>;
type OrderLineItem = OrderByCode['lines'][number];
type OrderDiscount = OrderByCode['discounts'][number];
type OrderPayment = NonNullable<OrderByCode['payments']>[number];
type OrderShippingLine = NonNullable<OrderByCode['shippingLines']>[number];

interface OrderDetailProps {
    orderPromise: Promise<{ data: ResultOf<typeof GetOrderDetailQuery>; token?: string }>;
    serverUrl?: string;
}

export function OrderDetail({ orderPromise, serverUrl = 'http://localhost:3000' }: OrderDetailProps) {
    const { data } = use(orderPromise);
    const locale = useLocale();
    const t = useTranslations('Account');
    const order = data.orderByCode;

    if (!order) {
        return null;
    }

    const customerEmail = order.customer?.emailAddress || '';
    const invoiceDownloadUrl = `${serverUrl}/api/invoices/download/${order.code}?email=${encodeURIComponent(customerEmail)}`;

    // Milestone tracking calculations
    const getActiveStep = (state: string): number => {
        switch (state) {
            case 'AddingItems':
            case 'ArrangingPayment':
                return 1;
            case 'PaymentAuthorized':
            case 'PaymentSettled':
                return 2;
            case 'PartiallyShipped':
                return 3;
            case 'Shipped':
                return 4;
            case 'PartiallyDelivered':
            case 'Delivered':
                return 5;
            case 'Cancelled':
                return -1;
            default:
                return 2;
        }
    };

    const currentStep = getActiveStep(order.state);
    const isCancelled = order.state === 'Cancelled';

    const trackingSteps = [
        { id: 1, label: t('orderPlaced'), icon: Clock },
        { id: 2, label: t('orderAccepted'), icon: CheckCircle2 },
        { id: 3, label: t('orderInProgress'), icon: Package },
        { id: 4, label: t('orderOnTheWay'), icon: Truck },
        { id: 5, label: t('orderDelivered'), icon: PackageCheck },
    ];

    return (
        <div className="space-y-8">
            {/* Top Navigation & Header */}
            <div>
                <Link
                    href="/account/orders"
                    className="inline-flex items-center text-xs font-medium text-[#6B5E55] dark:text-[#B5A496] hover:text-[#1D120A] dark:hover:text-[#F8F4EE] mb-4 transition-colors"
                >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    {t('backToOrders')}
                </Link>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#F0EBE1] dark:border-[#2A1D15]">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="font-sans text-2xl sm:text-3xl font-bold text-[#1D120A] dark:text-[#F8F4EE] tracking-tight">
                                {t('order', { code: order.code })}
                            </h1>
                            <OrderStatusBadge state={order.state} />
                        </div>
                        <p className="text-xs sm:text-sm text-[#6B5E55] dark:text-[#B5A496] mt-1">
                            {t('placedOn', { date: formatDate(order.createdAt, 'long', locale) })}
                        </p>
                    </div>

                    <a
                        href={invoiceDownloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F291E] hover:bg-[#1A3D2E] text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors"
                    >
                        <FileDown className="w-4 h-4" />
                        <span>{t('downloadInvoice')}</span>
                    </a>
                </div>
            </div>

            {/* 5-Step Order Tracking Progress Bar (FutureCommerce reference) */}
            <div className="bg-white dark:bg-[#160E08] border border-[#EAE6DF] dark:border-[#3A291C] rounded-xl p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="font-sans text-lg sm:text-xl font-bold text-[#1D120A] dark:text-[#F8F4EE]">
                            {t('orderStatus')}
                        </h2>
                        <p className="text-xs text-[#6B5E55] dark:text-[#B5A496] mt-0.5">
                            {isCancelled
                                ? t('orderCancelledDesc')
                                : currentStep === 5
                                ? t('orderDeliveredDesc')
                                : currentStep === 4
                                ? t('orderOnTheWayDesc')
                                : t('orderAcceptedDesc')}
                        </p>
                    </div>
                </div>

                {isCancelled ? (
                    <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 flex items-center gap-3 text-red-700 dark:text-red-300">
                        <AlertTriangle className="h-5 w-5 shrink-0 text-red-600" />
                        <span className="text-sm font-medium">{t('orderCancelledDesc')}</span>
                    </div>
                ) : (
                    <div className="relative pt-2 pb-4">
                        {/* Connecting Line */}
                        <div className="hidden sm:block absolute top-6 left-[10%] right-[10%] h-0.5 bg-[#EAE6DF] dark:bg-[#3A291C] -z-0">
                            <div
                                className="h-full bg-[#EAA838] transition-all duration-500"
                                style={{
                                    width: `${Math.max(0, Math.min(100, ((currentStep - 1) / (trackingSteps.length - 1)) * 100))}%`,
                                }}
                            />
                        </div>

                        {/* Step Milestones */}
                        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative z-10">
                            {trackingSteps.map((step) => {
                                const Icon = step.icon;
                                const isPassed = currentStep >= step.id;
                                const isCurrent = currentStep === step.id;

                                return (
                                    <div key={step.id} className="flex sm:flex-col items-center gap-3 sm:gap-2 text-left sm:text-center">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${
                                                isPassed
                                                    ? 'bg-[#EAA838] text-white border-[#EAA838] shadow-xs'
                                                    : 'bg-[#FAF8F5] dark:bg-[#22160F] text-[#8C7A6B] border-[#EAE6DF] dark:border-[#3A291C]'
                                            }`}
                                        >
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p
                                                className={`text-xs font-semibold ${
                                                    isCurrent
                                                        ? 'text-[#EAA838]'
                                                        : isPassed
                                                        ? 'text-[#1D120A] dark:text-[#F8F4EE]'
                                                        : 'text-[#8C7A6B]'
                                                }`}
                                            >
                                                {step.label}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Main Content Grid: Items (Left) + Summaries (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 Cols: Order Items */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-[#160E08] border border-[#EAE6DF] dark:border-[#3A291C] rounded-xl p-6 shadow-xs space-y-4">
                        <h3 className="font-sans text-lg font-bold text-[#1D120A] dark:text-[#F8F4EE] pb-2 border-b border-[#F0EBE1] dark:border-[#2A1D15]">
                            {t('orderItems')} ({order.lines.length})
                        </h3>

                        <div className="divide-y divide-[#F0EBE1] dark:divide-[#2A1D15]">
                            {order.lines.map((line: OrderLineItem) => {
                                const product = line.productVariant.product;
                                const previewUrl = product.featuredAsset?.preview;

                                return (
                                    <div key={line.id} className="py-4 first:pt-2 last:pb-0 flex gap-4 items-center">
                                        {/* Studio Pedestal Image */}
                                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-[#F3EFE9] dark:bg-[#22160F] border border-[#EAE6DF]/60 dark:border-[#3A291C] shrink-0 flex items-center justify-center p-1.5">
                                            {previewUrl ? (
                                                <Image
                                                    src={previewUrl}
                                                    alt={line.productVariant.name}
                                                    fill
                                                    sizes="96px"
                                                    className="object-contain p-1"
                                                />
                                            ) : (
                                                <ShoppingBag className="w-8 h-8 text-[#A66B2D]" />
                                            )}
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-1 min-w-0 space-y-1">
                                            <Link
                                                href={`/product/${product.slug}`}
                                                className="font-sans font-bold text-base text-[#1D120A] dark:text-[#F8F4EE] hover:text-[#EAA838] transition-colors line-clamp-1"
                                            >
                                                {product.name}
                                            </Link>
                                            {line.productVariant.name !== product.name && (
                                                <p className="text-xs text-[#6B5E55] dark:text-[#B5A496]">
                                                    {line.productVariant.name}
                                                </p>
                                            )}
                                            <p className="text-[11px] text-[#8C7A6B]">
                                                {t('skuLabel', { sku: line.productVariant.sku })}
                                            </p>
                                            <p className="text-xs text-[#6B5E55] dark:text-[#B5A496]">
                                                {t('qty', { quantity: line.quantity })} × <Price value={line.unitPriceWithTax} currencyCode={order.currencyCode} />
                                            </p>
                                        </div>

                                        {/* Line Total */}
                                        <div className="text-right shrink-0">
                                            <p className="font-bold text-base text-[#1D120A] dark:text-[#F8F4EE]">
                                                <Price value={line.linePriceWithTax} currencyCode={order.currencyCode} />
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right 1 Col: Financial Summary, Addresses, Payment */}
                <div className="space-y-6">
                    {/* Financial Summary */}
                    <div className="bg-white dark:bg-[#160E08] border border-[#EAE6DF] dark:border-[#3A291C] rounded-xl p-6 shadow-xs space-y-4">
                        <h3 className="font-sans text-lg font-bold text-[#1D120A] dark:text-[#F8F4EE] pb-2 border-b border-[#F0EBE1] dark:border-[#2A1D15]">
                            {t('orderSummary')}
                        </h3>

                        <div className="space-y-2.5 text-xs sm:text-sm">
                            <div className="flex justify-between text-[#6B5E55] dark:text-[#B5A496]">
                                <span>{t('subtotal')}</span>
                                <span className="font-medium text-[#1D120A] dark:text-[#F8F4EE]">
                                    <Price value={order.subTotalWithTax} currencyCode={order.currencyCode} />
                                </span>
                            </div>

                            <div className="flex justify-between text-[#6B5E55] dark:text-[#B5A496]">
                                <span>{t('shipping')}</span>
                                <span className="font-medium text-[#1D120A] dark:text-[#F8F4EE]">
                                    <Price value={order.shippingWithTax} currencyCode={order.currencyCode} />
                                </span>
                            </div>

                            {order.discounts?.length > 0 &&
                                order.discounts.map((discount: OrderDiscount, idx: number) => (
                                    <div key={idx} className="flex justify-between text-emerald-700 dark:text-emerald-400">
                                        <span>{discount.description}</span>
                                        <span>
                                            -<Price value={discount.amountWithTax} currencyCode={order.currencyCode} />
                                        </span>
                                    </div>
                                ))}

                            <div className="pt-3 border-t border-[#F0EBE1] dark:border-[#2A1D15] flex justify-between font-sans font-bold text-lg text-[#1D120A] dark:text-[#F8F4EE]">
                                <span>{t('total')}</span>
                                <span className="text-[#A66B2D]">
                                    <Price value={order.totalWithTax} currencyCode={order.currencyCode} />
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    {order.shippingAddress && (
                        <div className="bg-white dark:bg-[#160E08] border border-[#EAE6DF] dark:border-[#3A291C] rounded-xl p-6 shadow-xs space-y-3">
                            <h3 className="font-sans text-base font-bold text-[#1D120A] dark:text-[#F8F4EE] pb-2 border-b border-[#F0EBE1] dark:border-[#2A1D15]">
                                {t('shippingAddress')}
                            </h3>
                            <div className="text-xs sm:text-sm text-[#4A3728] dark:text-[#D5C7B8] space-y-1">
                                <p className="font-semibold text-[#1D120A] dark:text-[#F8F4EE]">{order.shippingAddress.fullName}</p>
                                {order.shippingAddress.company && <p>{order.shippingAddress.company}</p>}
                                <p>{order.shippingAddress.streetLine1}</p>
                                {order.shippingAddress.streetLine2 && <p>{order.shippingAddress.streetLine2}</p>}
                                <p>
                                    {order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.postalCode}
                                </p>
                                <p>{order.shippingAddress.country}</p>
                                {order.shippingAddress.phoneNumber && (
                                    <p className="pt-1 text-[#8C7A6B] font-mono text-xs">{order.shippingAddress.phoneNumber}</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Payment Info */}
                    {order.payments && order.payments.length > 0 && (
                        <div className="bg-white dark:bg-[#160E08] border border-[#EAE6DF] dark:border-[#3A291C] rounded-xl p-6 shadow-xs space-y-3">
                            <h3 className="font-sans text-base font-bold text-[#1D120A] dark:text-[#F8F4EE] pb-2 border-b border-[#F0EBE1] dark:border-[#2A1D15]">
                                {t('payment')}
                            </h3>
                            {order.payments.map((payment: OrderPayment) => (
                                <div key={payment.id} className="space-y-2 text-xs sm:text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-[#6B5E55] dark:text-[#B5A496]">{t('method')}</span>
                                        <span className="font-medium text-[#1D120A] dark:text-[#F8F4EE] capitalize">{payment.method}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[#6B5E55] dark:text-[#B5A496]">{t('amount')}</span>
                                        <span className="font-medium text-[#1D120A] dark:text-[#F8F4EE]">
                                            <Price value={payment.amount} currencyCode={order.currencyCode} />
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[#6B5E55] dark:text-[#B5A496]">{t('paymentStatus')}</span>
                                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                                            {payment.state}
                                        </span>
                                    </div>
                                    {payment.transactionId && (
                                        <div className="flex justify-between items-center pt-1 border-t border-[#F0EBE1] dark:border-[#2A1D15]">
                                            <span className="text-[#6B5E55] dark:text-[#B5A496] text-[11px]">{t('transactionId')}</span>
                                            <span className="font-mono text-[11px] text-[#8C7A6B] truncate max-w-[140px]">{payment.transactionId}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
