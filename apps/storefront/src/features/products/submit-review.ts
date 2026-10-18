'use server';

import { cache } from 'react';
import type { TadaDocumentNode } from 'gql.tada';
import { mutate, query } from '@/platform/vendure/api';
import { SubmitProductReviewMutation, GetProductReviewsQuery } from './reviews-graphql';
import { updateTag } from 'next/cache';

export interface SubmitReviewPayload {
    productId: string;
    authorName: string;
    authorLocation?: string;
    rating: number;
    title: string;
    comment: string;
}

export interface ProductReview {
    id: string;
    createdAt?: string;
    authorName: string;
    authorLocation?: string | null;
    rating: number;
    title: string;
    comment: string;
    isVerifiedBuyer?: boolean;
}

export interface ProductReviewSummary {
    averageRating: number;
    totalReviews: number;
    distribution: Array<{ stars: number; count: number }>;
}

/**
 * The gql.tada schema snapshot (`src/graphql-env.d.ts`) predates the
 * reviews plugin, so the generated document types resolve these fields to
 * `never`. The documents are re-declared with their real runtime shapes
 * here; drop the casts once the schema snapshot is regenerated.
 */
type SubmitReviewResult = { submitProductReview: ProductReview | null };
type SubmitReviewVariables = {
    input: {
        productId: string;
        authorName: string;
        authorLocation?: string;
        rating: number;
        title: string;
        comment: string;
    };
};
const submitReviewDocument = SubmitProductReviewMutation as unknown as TadaDocumentNode<
    SubmitReviewResult,
    SubmitReviewVariables
>;

export async function submitProductReviewAction(payload: SubmitReviewPayload): Promise<{
    success: boolean;
    error?: string;
    review?: ProductReview;
}> {
    if (!payload.authorName.trim() || !payload.title.trim() || !payload.comment.trim()) {
        return { success: false, error: 'Veuillez renseigner tous les champs obligatoires.' };
    }

    try {
        const result = await mutate(
            submitReviewDocument,
            {
                input: {
                    productId: payload.productId,
                    authorName: payload.authorName.trim(),
                    authorLocation: payload.authorLocation?.trim() || undefined,
                    rating: payload.rating,
                    title: payload.title.trim(),
                    comment: payload.comment.trim(),
                },
            },
            { useAuthToken: true }
        );

        const review = result?.data?.submitProductReview;
        if (review?.id) {
            updateTag('product-reviews');
            return { success: true, review };
        }

        return { success: false, error: 'Une erreur est survenue lors de l’enregistrement de votre avis.' };
    } catch (e) {
        return { success: false, error: e instanceof Error ? e.message : 'Erreur de connexion au serveur.' };
    }
}

type ProductReviewsResult = {
    productReviews: ProductReview[] | null;
    productReviewSummary: ProductReviewSummary | null;
};
const productReviewsDocument = GetProductReviewsQuery as unknown as TadaDocumentNode<
    ProductReviewsResult,
    { productId: string }
>;

const getCachedProductReviews = cache(async (productId: string): Promise<{
    reviews: ProductReview[];
    summary: ProductReviewSummary | null;
}> => {
    try {
        const result = await query(
            productReviewsDocument,
            { productId },
            { tags: ['product-reviews'] },
        );

        return {
            reviews: result?.data?.productReviews ?? [],
            summary: result?.data?.productReviewSummary ?? null,
        };
    } catch {
        // Honest empty state — never fabricate a summary.
        return { reviews: [], summary: null };
    }
});

export async function fetchProductReviews(productId: string): Promise<{
    reviews: ProductReview[];
    summary: ProductReviewSummary | null;
}> {
    return getCachedProductReviews(productId);
}
