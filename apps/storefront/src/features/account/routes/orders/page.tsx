import type {Metadata} from 'next';
import Image from 'next/image';
import {query} from '@/platform/vendure/api';
import {GetCustomerOrdersQuery} from '@/features/account/graphql';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import {Price} from '@/features/pricing/price';
import {OrderStatusBadge} from '@/features/orders/order-status-badge';
import {formatDate} from '@/platform/i18n/format';
import { Link, redirect } from '@/platform/i18n/navigation';
import {getRouteLocale} from '@/platform/i18n/server';
import {getTranslations} from 'next-intl/server';
import { Package, ArrowRight, FileDown, ShoppingBag } from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getRouteLocale();
    const t = await getTranslations({locale, namespace: 'Account'});
    return {
        title: t('ordersPageTitle'),
    };
}

const ITEMS_PER_PAGE = 8;

export default async function OrdersPage(props: PageProps<'/[locale]/account/orders'>) {
    const searchParams = await props.searchParams;
    const locale = await getRouteLocale();
    const pageParam = searchParams.page;
    const currentPage = parseInt(Array.isArray(pageParam) ? pageParam[0] : pageParam || '1', 10);
    const skip = (currentPage - 1) * ITEMS_PER_PAGE;

    const {data} = await query(
        GetCustomerOrdersQuery,
        {
            options: {
                take: ITEMS_PER_PAGE,
                skip,
                filter: {
                    state: {
                        notEq: 'AddingItems',
                    },
                },
            },
        },
        {useAuthToken: true}
    );

    if (!data.activeCustomer) {
        return redirect({href: '/sign-in', locale});
    }

    const t = await getTranslations({locale, namespace: 'Account'});

    const orders = data.activeCustomer.orders.items;
    const totalItems = data.activeCustomer.orders.totalItems;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    const shopUrl = process.env.VENDURE_SHOP_API_URL || 'http://localhost:3000/shop-api';
    const serverUrl = shopUrl.replace(/\/shop-api\/?$/, '');
    const customerEmail = data.activeCustomer.emailAddress || '';

    return (
        <div className="space-y-6">
            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
                <div>
                    <h1 className="font-sans text-2xl sm:text-3xl font-bold text-[#1D120A] dark:text-[#F8F4EE] tracking-tight">
                        {t('myOrders')}
                    </h1>
                    <p className="text-xs sm:text-sm text-[#6B5E55] dark:text-[#B5A496] mt-0.5">
                        {t('ordersCount', { count: totalItems })}
                    </p>
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="bg-white dark:bg-[#160E08] border border-[#EAE6DF] dark:border-[#3A291C] rounded-xl p-12 text-center shadow-xs space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-[#FAF8F5] dark:bg-[#22160F] border border-[#EAE6DF] dark:border-[#3A291C] flex items-center justify-center text-[#A66B2D]">
                        <Package className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-sans text-xl font-bold text-[#1D120A] dark:text-[#F8F4EE]">
                            {t('noOrders')}
                        </h3>
                        <p className="text-xs sm:text-sm text-[#6B5E55] dark:text-[#B5A496] max-w-sm mx-auto">
                            Découvrez notre sélection exclusive de sacs de luxe et accessoires.
                        </p>
                    </div>
                    <div className="pt-2">
                        <Link
                            href="/shop"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0F291E] hover:bg-[#1A3D2E] text-white text-sm font-medium shadow-xs transition-colors"
                        >
                            <ShoppingBag className="w-4 h-4" />
                            <span>Découvrir la collection</span>
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => {
                        const invoiceDownloadUrl = `${serverUrl}/api/invoices/download/${order.code}?email=${encodeURIComponent(customerEmail)}`;
                        const latestPayment = order.payments?.[order.payments.length - 1];
                        const paymentMethodLabel = latestPayment?.method
                            ? latestPayment.method === 'flutterwave'
                                ? 'Flutterwave / MoMo'
                                : latestPayment.method
                            : 'Paiement Sécurisé';

                        return (
                            <div
                                key={order.id}
                                className="border border-[#EAE6DF] dark:border-[#3A291C] rounded-xl overflow-hidden shadow-xs bg-white dark:bg-[#160E08]"
                            >
                                {/* FutureCommerce Golden Header Bar */}
                                <div className="bg-[#EAA838] text-white px-5 py-3.5">
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-xs">
                                        <div>
                                            <span className="block text-white/80 font-medium uppercase text-[10px] tracking-wider">
                                                {t('orderNumber')}
                                            </span>
                                            <span className="font-bold text-sm tracking-wide">
                                                #{order.code}
                                            </span>
                                        </div>

                                        <div>
                                            <span className="block text-white/80 font-medium uppercase text-[10px] tracking-wider">
                                                {t('totalPayment')}
                                            </span>
                                            <span className="font-bold text-sm">
                                                <Price value={order.totalWithTax} currencyCode={order.currencyCode} />
                                            </span>
                                        </div>

                                        <div>
                                            <span className="block text-white/80 font-medium uppercase text-[10px] tracking-wider">
                                                {t('paymentMethod')}
                                            </span>
                                            <span className="font-bold text-sm capitalize truncate block">
                                                {paymentMethodLabel}
                                            </span>
                                        </div>

                                        <div>
                                            <span className="block text-white/80 font-medium uppercase text-[10px] tracking-wider">
                                                {t('estimatedDelivery')}
                                            </span>
                                            <span className="font-bold text-sm">
                                                {formatDate(order.createdAt, 'short', locale)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Content Body */}
                                <div className="p-5 sm:p-6 space-y-5">
                                    {/* Line Items List */}
                                    <div className="divide-y divide-[#F0EBE1] dark:divide-[#2A1D15]">
                                        {order.lines.map((line) => {
                                            const product = line.productVariant?.product;
                                            const imageUrl = product?.featuredAsset?.preview;

                                            return (
                                                <div key={line.id} className="py-3 first:pt-0 last:pb-0 flex items-center gap-4">
                                                    {/* Pedestal Thumbnail */}
                                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-[#F3EFE9] dark:bg-[#22160F] border border-[#EAE6DF]/60 dark:border-[#3A291C] flex items-center justify-center p-1.5 shrink-0 overflow-hidden relative">
                                                        {imageUrl ? (
                                                            <Image
                                                                src={imageUrl}
                                                                alt={product?.name || 'Vakaa Bag'}
                                                                fill
                                                                sizes="80px"
                                                                className="object-contain p-1"
                                                            />
                                                        ) : (
                                                            <ShoppingBag className="w-6 h-6 text-[#A66B2D]" />
                                                        )}
                                                    </div>

                                                    {/* Line Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-sans font-bold text-sm sm:text-base text-[#1D120A] dark:text-[#F8F4EE] truncate">
                                                            {product?.name || line.productVariant?.name}
                                                        </h4>
                                                        {line.productVariant?.name && line.productVariant.name !== product?.name && (
                                                            <p className="text-xs text-[#6B5E55] dark:text-[#B5A496] truncate">
                                                                {line.productVariant.name}
                                                            </p>
                                                        )}
                                                        <div className="flex items-center gap-3 mt-1 text-xs text-[#8C7A6B]">
                                                            <span>{t('qty', { quantity: line.quantity })}</span>
                                                            <span>•</span>
                                                            <span className="font-medium text-[#1D120A] dark:text-[#F8F4EE]">
                                                                <Price value={line.unitPriceWithTax} currencyCode={order.currencyCode} />
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Action Footer */}
                                    <div className="pt-4 border-t border-[#F0EBE1] dark:border-[#2A1D15] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <OrderStatusBadge state={order.state} />
                                        </div>

                                        <div className="flex items-center gap-2.5 w-full sm:w-auto">
                                            <Link
                                                href={`/account/orders/${order.code}`}
                                                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#0F291E] dark:border-[#5A4535] text-xs sm:text-sm font-semibold text-[#0F291E] dark:text-[#E8D9C8] hover:bg-[#FAF8F5] dark:hover:bg-[#1E140D] transition-colors"
                                            >
                                                <span>{t('trackOrder')}</span>
                                                <ArrowRight className="w-3.5 h-3.5" />
                                            </Link>

                                            <a
                                                href={invoiceDownloadUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                download
                                                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0F291E] hover:bg-[#1A3D2E] text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors"
                                            >
                                                <FileDown className="w-4 h-4" />
                                                <span>{t('downloadInvoice')}</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="pt-4">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            href={currentPage > 1 ? `/account/orders?page=${currentPage - 1}` : '#'}
                                            className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                                        />
                                    </PaginationItem>

                                    {Array.from({length: totalPages}, (_, i) => i + 1).map((page) => {
                                        if (
                                            page === 1 ||
                                            page === totalPages ||
                                            (page >= currentPage - 1 && page <= currentPage + 1)
                                        ) {
                                            return (
                                                <PaginationItem key={page}>
                                                    <PaginationLink
                                                        href={`/account/orders?page=${page}`}
                                                        isActive={page === currentPage}
                                                    >
                                                        {page}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            );
                                        } else if (page === currentPage - 2 || page === currentPage + 2) {
                                            return (
                                                <PaginationItem key={page}>
                                                    <PaginationEllipsis />
                                                </PaginationItem>
                                            );
                                        }
                                        return null;
                                    })}

                                    <PaginationItem>
                                        <PaginationNext
                                            href={currentPage < totalPages ? `/account/orders?page=${currentPage + 1}` : '#'}
                                            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
