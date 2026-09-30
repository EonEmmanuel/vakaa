import { RequestContext, Injector, Order, translateEntity } from '@vendure/core';
import { LoadDataFn } from '@pinelab/pinelab-invoice-plugin';

function formatCurrency(amount: number, currencyCode: string = 'XAF'): string {
    const code = (currencyCode || 'XAF').toUpperCase();
    const isZeroDecimal = ['XAF', 'XOF', 'GNF', 'RWF', 'BIF', 'KMF', 'DJF'].includes(code);

    if (isZeroDecimal) {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: code,
            maximumFractionDigits: 0,
        }).format(amount);
    }

    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: code,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount / 100);
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

        return {
            name: line.productVariant?.product?.name || productName,
            variantName,
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
        paymentMethodName,
        shippingMethodName,
    };
};
