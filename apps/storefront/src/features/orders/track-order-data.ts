'use server';

import {query} from '@/platform/vendure/api';
import {graphql} from '@/platform/vendure/graphql';

export type TrackedOrderLine = {
    name: string;
    slug: string | null;
    image: string | null;
    quantity: number;
};

export type TrackedOrder = {
    code: string;
    state: string;
    orderPlacedAt: string | null;
    lines: TrackedOrderLine[];
};

export type TrackOrderResult =
    | {success: true; order: TrackedOrder}
    | {success: false; reason: 'invalid-input' | 'not-found' | 'request-failed'};

const FindOrderForTrackingQuery = graphql(`
    query FindOrderForTracking($code: String!) {
        orderByCode(code: $code) {
            code
            state
            orderPlacedAt
            customer {
                emailAddress
            }
            lines {
                id
                quantity
                productVariant {
                    id
                    name
                    product {
                        id
                        slug
                        featuredAsset {
                            id
                            preview
                        }
                    }
                }
            }
        }
    }
`);

const ORDER_CODE_PATTERN = /^[A-Za-z0-9_-]{1,32}$/;

function isLikelyEmail(value: string): boolean {
    return value.includes('@') && value.includes('.') && value.length <= 160;
}

/**
 * Real order lookup for the public tracking page. The order code only
 * returns data when paired with the billing email, mirroring the trust
 * model of the order-confirmation route.
 */
export async function findOrderByCode(rawCode: string, rawEmail: string): Promise<TrackOrderResult> {
    const code = typeof rawCode === 'string' ? rawCode.trim() : '';
    const email = typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : '';

    if (!ORDER_CODE_PATTERN.test(code) || !isLikelyEmail(email)) {
        return {success: false, reason: 'invalid-input'};
    }

    try {
        const result = await query(FindOrderForTrackingQuery, {code});
        const order = result.data?.orderByCode;

        if (!order) {
            return {success: false, reason: 'not-found'};
        }

        const orderEmail = (order.customer?.emailAddress ?? '').toLowerCase();
        if (orderEmail && orderEmail !== email) {
            return {success: false, reason: 'not-found'};
        }

        return {
            success: true,
            order: {
                code: order.code,
                state: order.state,
                orderPlacedAt: order.orderPlacedAt ?? null,
                lines: (order.lines ?? []).map((line) => ({
                    name: line.productVariant.name,
                    slug: line.productVariant.product?.slug ?? null,
                    image: line.productVariant.product?.featuredAsset?.preview ?? null,
                    quantity: line.quantity,
                })),
            },
        };
    } catch {
        return {success: false, reason: 'request-failed'};
    }
}
