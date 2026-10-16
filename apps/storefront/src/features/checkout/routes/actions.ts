'use server';

import {mutate, query} from '@/platform/vendure/api';
import {
    SetOrderShippingAddressMutation,
    SetOrderBillingAddressMutation,
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
    let shippingOrder: any;
    let billingOrder: any;

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

        shippingOrder = result.data?.setOrderShippingAddress;
        billingOrder = result.data?.setOrderBillingAddress;

        if (!shippingOrder || shippingOrder.__typename !== 'Order') {
            throw new Error('Impossible d\'enregistrer l\'adresse de livraison. Veuillez réessayer.');
        }
        if (!billingOrder || billingOrder.__typename !== 'Order') {
            throw new Error('Impossible d\'enregistrer l\'adresse de facturation. Veuillez réessayer.');
        }
    } else {
        const result = await mutate(
            SetOrderShippingAddressMutation,
            {input: shippingAddress},
            {useAuthToken: true}
        );

        if (result.token) {
            await setAuthToken(result.token);
        }

        shippingOrder = result.data?.setOrderShippingAddress;
        if (!shippingOrder || shippingOrder.__typename !== 'Order') {
            throw new Error('Impossible d\'enregistrer l\'adresse de livraison. Veuillez réessayer.');
        }
    }

    // Refresh eligible shipping methods for the updated shipping destination without full-page revalidation
    let shippingMethods: ShippingMethod[] | undefined;
    try {
        const currencyCode = await getActiveCurrencyCode();
        const methodsRes = await query(
            GetEligibleShippingMethodsQuery,
            {},
            { useAuthToken: true, currencyCode, timeoutMs: 3000 }
        );
        if (methodsRes.data?.eligibleShippingMethods) {
            shippingMethods = methodsRes.data.eligibleShippingMethods as ShippingMethod[];
        }
    } catch {
        // Non-blocking fallback if query times out or fails
    }

    return {
        success: true,
        shippingAddress: shippingOrder.shippingAddress,
        billingAddress: useSameForBilling ? shippingOrder.shippingAddress : billingOrder?.billingAddress,
        shippingMethods,
    };
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

export type PlaceOrderResult = {
    success: true;
    orderCode: string;
    redirectUrl?: string | null;
};

export async function placeOrder(
    paymentMethodCode: string,
    paymentMetadata?: Record<string, unknown>
): Promise<PlaceOrderResult> {
    // 1. Transition the order to ArrangingPayment state
    await transitionToArrangingPayment();

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
        if (orderResult) {
            const errorResult = orderResult;
            const detailedMessage =
                ('paymentErrorMessage' in errorResult && typeof (errorResult as Record<string, unknown>).paymentErrorMessage === 'string'
                    ? ((errorResult as Record<string, unknown>).paymentErrorMessage as string)
                    : null) || errorResult.message;
            throw new Error(
                `Failed to place order: ${errorResult.errorCode} - ${detailedMessage}`
            );
        }
        throw new Error('Le serveur n\'a pas répondu lors de la validation du paiement. Veuillez vérifier votre connexion et réessayer.');
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

    return {
        success: true,
        orderCode,
        redirectUrl:
            paymentMethodCode === 'flutterwave' &&
            typeof paymentLink === 'string' &&
            (paymentLink.startsWith('http://') || paymentLink.startsWith('https://'))
                ? paymentLink
                : null,
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
