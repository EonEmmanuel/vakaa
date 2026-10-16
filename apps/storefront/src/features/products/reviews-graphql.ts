import { graphql } from '@/platform/vendure/graphql';

export const GetProductReviewsQuery = graphql(`
    query GetProductReviews($productId: ID!) {
        productReviews(productId: $productId) {
            id
            createdAt
            authorName
            authorLocation
            rating
            title
            comment
            isVerifiedBuyer
        }
        productReviewSummary(productId: $productId) {
            averageRating
            totalReviews
            distribution {
                stars
                count
            }
        }
    }
`);

export const SubmitProductReviewMutation = graphql(`
    mutation SubmitProductReview($input: SubmitProductReviewInput!) {
        submitProductReview(input: $input) {
            id
            createdAt
            authorName
            rating
            title
            comment
        }
    }
`);
