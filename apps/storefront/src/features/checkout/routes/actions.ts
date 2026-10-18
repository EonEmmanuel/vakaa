'use server';

import {mutate, query} from '@/platform/vendure/api';
import {
    SetOrderShippingAddressMutation,
    SetOrderShippingAndBillingAddressMutation,
    SetOrderShippingMethodMutation,
    AddPaymentToOrderMutation,
    TransitionOrderToStateMutation,
    SetCustomerForOrderMutation,
    GetEligibleShippingMethodsQuery,
} from '@/features/checkout/graphql';
import {CreateCustomerAddressMutation} from '@/features/account/graphql';
import {updateTag} from 'next/cache';
import {setAuthToken} from '@/platform/vendure/auth-token';
import {getActiveCurrencyCode} from '@/features/currency/currency-server';
import type {ShippingAddress, BillingAddress, CheckoutOrder} from './types';
import type {ShippingMethod} from './checkout-provider';

interface AddressInput {
    fullName: string;
    streetLine1: string;
    streetLine2?: string;
    city: string;
    province: string;
    postalCode: string;
    countryCode: string;
    phoneNumber: string;
    company?: string;
}

export type SetShippingAddressResult = {
    success: true;
    shippingAddress: ShippingAddress;
    billingAddress?: BillingAddress;
    shippingMethods?: ShippingMethod[];
};

export async function setShippingAddress(
    shippingAddress: AddressInput,
    useSameForBilling: boolean
): Promise<SetShippingAddressResult> {
    if (useSameForBilling) {
        const result = await mutate(
            SetOrderShippingAndBillingAddressMutation,
            {
                shippingInput: shippingAddress,
                billingInput: shippingAddress,
            },
            {useAuthToken: true}
        );

        if (result.token) {
            await setAuthToken(result.token);
        }

        const shippingOrder = result.data?.setOrderShippingAddress;
        const billingOrder = result.data?.setOrderBillingAddress;

        if (!shippingOrder || shippingOrder.__typename !== 'Order') {
            throw new Error('Impossible d\'enregistrer l\'adresse de livraison. Veuillez réessayer.');
        }
        if (!billingOrder || billingOrder.__typename !== 'Order') {
            throw new Error('Impossible d\'enregistrer l\'adresse de facturation. Veuillez réessayer.');
        }

        return {
            success: true,
            shippingAddress: shippingOrder.shippingAddress,
            billingAddress: shippingOrder.shippingAddress,
        };
    }

    const result = await mutate(
        SetOrderShippingAddressMutation,
        {input: shippingAddress},
        {useAuthToken: true}
    );

    if (result.token) {
        await setAuthToken(result.token);
    }

    const shippingOrder = result.data?.setOrderShippingAddress;
    if (!shippingOrder || shippingOrder.__typename !== 'Order') {
        throw new Error('Impossible d\'enregistrer l\'adresse de livraison. Veuillez réessayer.');
    }

    return {
        success: true,
        shippingAddress: shippingOrder.shippingAddress,
    };
}

export async function getEligibleShippingMethods(): Promise<ShippingMethod[]> {
    try {
        const currencyCode = await getActiveCurrencyCode();
        const methodsRes = await query(
            GetEligibleShippingMethodsQuery,
            {},
            { useAuthToken: true, currencyCode, timeoutMs: 10000 }
        );
        if (methodsRes.data?.eligibleShippingMethods) {
            return methodsRes.data.eligibleShippingMethods as ShippingMethod[];
        }
        return [];
    } catch (error) {
        console.error('Failed to load eligible shipping methods:', error);
        return [];
    }
}

export type SetShippingMethodResult = {
    success: true;
    shippingWithTax: number;
    totalWithTax: number;
    shippingLines: CheckoutOrder['shippingLines'];
};

export async function setShippingMethod(shippingMethodId: string): Promise<SetShippingMethodResult> {
    const result = await mutate(
        SetOrderShippingMethodMutation,
        {shippingMethodId: [shippingMethodId]},
        {useAuthToken: true}
    );

    if (result.token) {
        await setAuthToken(result.token);
    }

    const order = result.data?.setOrderShippingMethod;
    if (!order || order.__typename !== 'Order') {
        throw new Error('Impossible de sélectionner ce mode de livraison. Veuillez réessayer.');
    }

    return {
        success: true,
        shippingWithTax: order.shippingWithTax,
        totalWithTax: order.totalWithTax,
        shippingLines: (order.shippingLines || []).map((line) => ({
            ...line,
            shippingMethod: {
                ...line.shippingMethod,
                description: line.shippingMethod.description ?? '',
            },
        })) as CheckoutOrder['shippingLines'],
    };
}

export async function createCustomerAddress(address: AddressInput) {
    const result = await mutate(
        CreateCustomerAddressMutation,
        {input: address},
        {useAuthToken: true}
    );

    if (result.token) {
        await setAuthToken(result.token);
    }

    if (!result.data.createCustomerAddress) {
        throw new Error('Failed to create customer address');
    }

    return result.data.createCustomerAddress;
}

export async function transitionToArrangingPayment() {
    const result = await mutate(
        TransitionOrderToStateMutation,
        {state: 'ArrangingPayment'},
        {useAuthToken: true}
    );

    if (result.token) {
        await setAuthToken(result.token);
    }

    const transitionRes = result.data?.transitionOrderToState;
    if (!transitionRes) {
        throw new Error('Impossible d\'initialiser l\'état du paiement. Veuillez réessayer.');
    }

    if (transitionRes.__typename === 'OrderStateTransitionError') {
        const errorResult = transitionRes;
        // If the order is already in ArrangingPayment state, proceed safely without error
        if (errorResult.fromState === 'ArrangingPayment') {
            return;
        }
        throw new Error(
            `Failed to transition order state: ${errorResult.errorCode} - ${errorResult.message}`
        );
    }
}

export type PlaceOrderResult =
    | {
          success: true;
          orderCode: string;
          redirectUrl?: string | null;
      }
    | {
          success: false;
          errorCode: string;
          message: string;
      };

export async function placeOrder(
    paymentMethodCode: string,
    paymentMetadata?: Record<string, unknown>,
    currentState?: string
): Promise<PlaceOrderResult> {
    // 1. Transition the order to ArrangingPayment state if not already in that state.
    //    Failures are returned (never thrown) so the real reason is visible in
    //    production instead of being masked as a generic React error #441.
    if (currentState !== 'ArrangingPayment') {
        try {
            await transitionToArrangingPayment();
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'Impossible d\'initialiser l\'état du paiement. Veuillez réessayer.';
            console.error(
                `[placeOrder] Order state transition failed (method="${paymentMethodCode}"): ${message}`
            );
            return { success: false, errorCode: 'STATE_TRANSITION_FAILED', message };
        }
    }

    // 2. Prepare metadata based on payment method
    const metadata: Record<string, unknown> = {
        ...(paymentMetadata || {}),
    };

    // For standard payment, include the required fields
    if (paymentMethodCode === 'standard-payment') {
        metadata.shouldDecline = false;
        metadata.shouldError = false;
        metadata.shouldErrorOnSettle = false;
    }

    // 3. Add payment to the order
    const result = await mutate(
        AddPaymentToOrderMutation,
        {
            input: {
                method: paymentMethodCode,
                metadata,
            },
        },
        {useAuthToken: true}
    );

    if (result.token) {
        await setAuthToken(result.token);
    }

    const orderResult = result.data?.addPaymentToOrder;
    if (!orderResult || orderResult.__typename !== 'Order') {
        let errorCode = 'PAYMENT_FAILED';
        let message: string;

        if (orderResult) {
            errorCode = orderResult.errorCode;
            message =
                ('paymentErrorMessage' in orderResult &&
                typeof (orderResult as Record<string, unknown>).paymentErrorMessage === 'string'
                    ? ((orderResult as Record<string, unknown>).paymentErrorMessage as string)
                    : null) || orderResult.message;
        } else if (result.error?.message) {
            errorCode =
                result.error.kind === 'graphql'
                    ? 'GRAPHQL_ERROR'
                    : result.error.kind.toUpperCase();
            message = result.error.message;
        } else {
            message =
                'Le serveur n\'a pas répondu lors de la validation du paiement. Veuillez vérifier votre connexion et réessayer.';
        }

        // Log the real cause server-side (visible in the Next.js/Vercel function
        // logs) so a production failure is diagnosable rather than a masked error.
        console.error(
            `[placeOrder] Payment failed (method="${paymentMethodCode}", code="${errorCode}"): ${message}`
        );

        return { success: false, errorCode, message };
    }

    const order = orderResult;
    const orderCode = order.code;

    // Invalidate cached cart and active-order tags
    updateTag('cart');
    updateTag('active-order');

    // If payment method provided an external checkout link (e.g. Flutterwave hosted payment)
    const payments = order.payments;
    const latestPayment = payments && payments.length > 0 ? payments[payments.length - 1] : null;

    let parsedMetadata: unknown = latestPayment?.metadata;
    if (typeof parsedMetadata === 'string') {
        try {
            parsedMetadata = JSON.parse(parsedMetadata);
        } catch {}
    }
    const metaRecord = typeof parsedMetadata === 'object' && parsedMetadata !== null ? (parsedMetadata as Record<string, unknown>) : null;
    const metaPublic = metaRecord && typeof metaRecord.public === 'object' && metaRecord.public !== null ? (metaRecord.public as Record<string, unknown>) : null;
    const paymentLink = (typeof metaRecord?.link === 'string' ? metaRecord.link : null) || (typeof metaPublic?.link === 'string' ? metaPublic.link : null);
    // SebPay returns a `provider_link` (e.g. Wave) that the customer MUST open to
    // validate the payment.
    const sebpayProviderLink =
        (typeof metaRecord?.providerLink === 'string' ? metaRecord.providerLink : null) ||
        (typeof metaPublic?.providerLink === 'string' ? metaPublic.providerLink : null);

    const isHttpUrl = (value: unknown): value is string =>
        typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://'));

    const redirectUrl =
        paymentMethodCode === 'flutterwave' && isHttpUrl(paymentLink)
            ? paymentLink
            : paymentMethodCode === 'sebpay' && isHttpUrl(sebpayProviderLink)
            ? sebpayProviderLink
            : null;

    return {
        success: true,
        orderCode,
        redirectUrl,
    };
}

interface GuestCustomerInput {
    emailAddress: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
}

export type SetCustomerForOrderResult =
    | {
          success: true;
          customer?: {
              id: string;
              firstName: string;
              lastName: string;
              emailAddress: string;
              phoneNumber?: string | null;
          };
      }
    | { success: false; errorCode: 'EMAIL_CONFLICT'; message: string }
    | { success: false; errorCode: 'GUEST_CHECKOUT_DISABLED'; message: string }
    | { success: false; errorCode: 'NO_ACTIVE_ORDER'; message: string }
    | { success: false; errorCode: 'UNKNOWN'; message: string };

export async function setCustomerForOrder(
    input: GuestCustomerInput
): Promise<SetCustomerForOrderResult> {
    const result = await mutate(
        SetCustomerForOrderMutation,
        { input },
        { useAuthToken: true }
    );

    if (result.token) {
        await setAuthToken(result.token);
    }

    const response = result.data?.setCustomerForOrder;
    if (!response) {
        return { success: false, errorCode: 'UNKNOWN', message: 'Le serveur n\'a pas répondu à temps. Veuillez réessayer.' };
    }

    switch (response.__typename) {
        case 'Order': {
            return {
                success: true,
                customer: response.customer || undefined,
            };
        }
        case 'AlreadyLoggedInError':
            return { success: true };
        case 'EmailAddressConflictError':
            return { success: false, errorCode: 'EMAIL_CONFLICT', message: response.message };
        case 'GuestCheckoutError':
            return { success: false, errorCode: 'GUEST_CHECKOUT_DISABLED', message: response.message };
        case 'NoActiveOrderError':
            return { success: false, errorCode: 'NO_ACTIVE_ORDER', message: response.message };
        default:
            return { success: false, errorCode: 'UNKNOWN', message: 'Unknown error' };
    }
}
