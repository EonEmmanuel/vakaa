import { RequestContext, Injector, Order, translateEntity } from '@vendure/core';
import { LoadDataFn } from '@pinelab/pinelab-invoice-plugin';

const ZERO_DECIMAL_CURRENCIES = new Set(['XAF', 'XOF', 'GNF', 'RWF', 'BIF', 'KMF', 'DJF']);

/**
 * Formats a Vendure amount (stored in minor units, x100) for display.
 * Zero-decimal currencies (FCFA family) print as "35 000 FCFA"; others
 * print with two decimals.
 */
function formatCurrency(amount: number, currencyCode: string = 'XAF'): string {
    const code = (currencyCode || 'XAF').toUpperCase();
    const major = amount / 100;
    const label = code === 'XAF' || code === 'XOF' ? 'FCFA' : code;

    if (ZERO_DECIMAL_CURRENCIES.has(code)) {
        return `${new Intl.NumberFormat('fr-FR', {
            maximumFractionDigits: 0,
        }).format(major)} ${label}`;
    }

    return `${new Intl.NumberFormat('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(major)} ${label}`;
}

export const vakaaInvoiceLoadDataFn: LoadDataFn = async (
    ctx: RequestContext,
    injector: Injector,
    order: Order,
    mostRecentInvoiceNumber?: number,
    shouldGenerateCreditInvoice?: any
) => {
    let newInvoiceNumber = mostRecentInvoiceNumber || 1000;
    newInvoiceNumber += 1;

    const dateToFormat = order.orderPlacedAt || order.updatedAt || new Date();
    const orderDate = new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    }).format(new Date(dateToFormat));

    // Translate lines
    order.lines.forEach((line) => {
        if (line.productVariant) {
            line.productVariant = translateEntity(line.productVariant, ctx.languageCode);
        }
    });

    const currency = order.currencyCode || 'XAF';

    // Format line items
    const formattedLines = order.lines.map((line) => {
        const productName = line.productVariant?.name || 'Article VAKÁA';
        const variantName = line.productVariant?.product?.name && line.productVariant?.name !== line.productVariant?.product?.name
            ? line.productVariant.name
            : '';
        const customFields = line.productVariant?.customFields as { material?: string } | undefined;

        return {
            name: line.productVariant?.product?.name || productName,
            variantName,
            sku: line.productVariant?.sku || 'VAK-ART',
            thumbnail: line.productVariant?.featuredAsset?.preview || line.featuredAsset?.preview || '',
            // Only the real atelier material, never an invented claim.
            material: customFields?.material || '',
            quantity: line.quantity,
            unitPrice: formatCurrency(line.unitPriceWithTax, currency),
            linePrice: formatCurrency(line.linePriceWithTax, currency),
        };
    });

    // Determine payment method label
    const payment = order.payments && order.payments.length > 0 ? order.payments[0] : null;
    let paymentMethodName = 'Paiement Sécurisé';
    if (payment) {
        if (payment.method === 'sebpay') {
            paymentMethodName = 'Mobile Money (Orange / MTN / Moov / Wave)';
        } else if (payment.method === 'flutterwave') {
            paymentMethodName = 'Carte Bancaire / Mobile Money';
        } else {
            paymentMethodName = payment.method;
        }
    }

    // Shipping method
    const shippingMethodName = order.shippingLines && order.shippingLines.length > 0
        ? order.shippingLines[0].shippingMethod.name
        : 'Livraison Express VAKÁA';

    // Discounts
    const discountTotal = (order.subTotalWithTax + order.shippingWithTax) - order.totalWithTax;
    const formattedDiscount = discountTotal > 0 ? formatCurrency(discountTotal, currency) : null;

    if (!shouldGenerateCreditInvoice) {
        return {
            orderDate,
            invoiceNumber: newInvoiceNumber,
            invoicePrefix: 'VAK-',
            order,
            formattedLines,
            formattedSubTotal: formatCurrency(order.subTotalWithTax, currency),
            formattedShipping: formatCurrency(order.shippingWithTax, currency),
            formattedDiscount,
            formattedTotal: formatCurrency(order.totalWithTax, currency),
            paymentTransactionId: payment?.transactionId || null,
            paymentMethodName,
            shippingMethodName,
        };
    }

    // Credit invoice handling
    const { previousInvoice, reversedOrderTotals } = shouldGenerateCreditInvoice;
    return {
        orderDate,
        invoiceNumber: newInvoiceNumber,
        invoicePrefix: 'AV-',
        isCreditInvoice: true,
        originalInvoiceNumber: previousInvoice.invoiceNumber,
        order: {
            ...order,
            total: reversedOrderTotals.total,
            totalWithTax: reversedOrderTotals.totalWithTax,
        },
        formattedLines,
        formattedSubTotal: formatCurrency(order.subTotalWithTax, currency),
        formattedShipping: formatCurrency(order.shippingWithTax, currency),
        formattedDiscount,
        formattedTotal: formatCurrency(-order.totalWithTax, currency),
        paymentTransactionId: payment?.transactionId || null,
        paymentMethodName,
        shippingMethodName,
    };
};
