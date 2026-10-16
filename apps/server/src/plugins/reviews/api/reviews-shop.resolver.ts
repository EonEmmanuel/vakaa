import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Ctx, ID, RequestContext } from '@vendure/core';
import { ProductReviewService, SubmitReviewInput } from '../product-review.service';
import { ProductReview } from '../entities/product-review.entity';

@Resolver()
export class ProductReviewShopResolver {
    constructor(private reviewService: ProductReviewService) {}

    @Query()
    async productReviews(
        @Ctx() ctx: RequestContext,
        @Args('productId') productId: ID,
    ): Promise<ProductReview[]> {
        return this.reviewService.getReviewsForProduct(ctx, productId);
    }

    @Query()
    async productReviewSummary(
        @Ctx() ctx: RequestContext,
        @Args('productId') productId: ID,
    ) {
        return this.reviewService.getReviewSummary(ctx, productId);
    }

    @Mutation()
    async submitProductReview(
        @Ctx() ctx: RequestContext,
        @Args('input') input: SubmitReviewInput,
    ): Promise<ProductReview> {
        return this.reviewService.submitReview(ctx, input);
    }
}
