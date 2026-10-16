import gql from 'graphql-tag';

export const shopReviewsSchema = gql`
    type ProductReview {
        id: ID!
        createdAt: DateTime!
        authorName: String!
        authorLocation: String
        rating: Int!
        title: String!
        comment: String!
        isVerifiedBuyer: Boolean!
        state: String!
        productId: ID!
    }

    type RatingDistribution {
        stars: Int!
        count: Int!
    }

    type ProductReviewSummary {
        averageRating: Float!
        totalReviews: Int!
        distribution: [RatingDistribution!]!
    }

    input SubmitProductReviewInput {
        productId: ID!
        authorName: String!
        authorLocation: String
        rating: Int!
        title: String!
        comment: String!
    }

    extend type Query {
        productReviews(productId: ID!): [ProductReview!]!
        productReviewSummary(productId: ID!): ProductReviewSummary!
    }

    extend type Mutation {
        submitProductReview(input: SubmitProductReviewInput!): ProductReview!
    }
`;

export const adminReviewsSchema = gql`
    ${shopReviewsSchema}

    extend type Query {
        allProductReviews(state: String): [ProductReview!]!
    }

    extend type Mutation {
        updateProductReviewState(id: ID!, state: String!): ProductReview!
        deleteProductReview(id: ID!): Boolean!
    }
`;
