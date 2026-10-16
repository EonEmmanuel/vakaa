'use server';

import { cache } from 'react';
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

export async function submitProductReviewAction(payload: SubmitReviewPayload): Promise<{
    success: boolean;
    error?: string;
    review?: ProductReview;
}> {
    if (!payload.authorName.trim() || !payload.title.trim() || !payload.comment.trim()) {
        return { success: false, error: 'Veuillez renseigner tous les champs obligatoires.' };
    }

    try {
        const result = (await mutate(
            SubmitProductReviewMutation as any,
            {
                input: {
                    productId: payload.productId,
                    authorName: payload.authorName.trim(),
                    authorLocation: payload.authorLocation?.trim() || 'Client Vérifié',
                    rating: payload.rating,
                    title: payload.title.trim(),
                    comment: payload.comment.trim(),
                },
            } as any,
            { useAuthToken: true }
        )) as any;

        if (result?.data?.submitProductReview?.id) {
            updateTag('product-reviews');
            return {
                success: true,
                review: result.data.submitProductReview as ProductReview,
            };
        }

        return { success: false, error: 'Une erreur est survenue lors de l’enregistrement de votre avis.' };
    } catch (e: any) {
        return { success: false, error: e?.message || 'Erreur de connexion au serveur.' };
    }
}

const getCachedProductReviews = cache(async (productId: string): Promise<{
    reviews: ProductReview[];
    summary: ProductReviewSummary;
}> => {
    try {
        const result = (await query(
            GetProductReviewsQuery as any,
            { productId } as any,
            { tags: ['product-reviews'] }
        )) as any;

        const reviews: ProductReview[] = (result?.data?.productReviews as ProductReview[]) || [];
        const summary: ProductReviewSummary = (result?.data?.productReviewSummary as ProductReviewSummary) || {
            averageRating: 5.0,
            totalReviews: 0,
            distribution: [
                { stars: 5, count: 0 },
                { stars: 4, count: 0 },
                { stars: 3, count: 0 },
                { stars: 2, count: 0 },
                { stars: 1, count: 0 },
            ],
        };

        return { reviews, summary };
    } catch {
        return {
            reviews: [],
            summary: {
                averageRating: 5.0,
                totalReviews: 0,
                distribution: [
                    { stars: 5, count: 0 },
                    { stars: 4, count: 0 },
                    { stars: 3, count: 0 },
                    { stars: 2, count: 0 },
                    { stars: 1, count: 0 },
                ],
            },
        };
    }
});

export async function fetchProductReviews(productId: string): Promise<{
    reviews: ProductReview[];
    summary: ProductReviewSummary;
}> {
    return getCachedProductReviews(productId);
}
