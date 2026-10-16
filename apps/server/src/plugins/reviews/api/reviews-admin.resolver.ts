import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Allow, Ctx, ID, Permission, RequestContext } from '@vendure/core';
import { ProductReviewService } from '../product-review.service';
import { ProductReview } from '../entities/product-review.entity';

@Resolver()
export class ProductReviewAdminResolver {
    constructor(private reviewService: ProductReviewService) {}

    @Query()
    @Allow(Permission.ReadCatalog)
    async allProductReviews(
        @Ctx() ctx: RequestContext,
        @Args('state', { nullable: true }) state?: string,
    ): Promise<ProductReview[]> {
        return this.reviewService.getAllReviews(ctx, state);
    }

    @Mutation()
    @Allow(Permission.UpdateCatalog)
    async updateProductReviewState(
        @Ctx() ctx: RequestContext,
        @Args('id') id: ID,
        @Args('state') state: string,
    ): Promise<ProductReview> {
        return this.reviewService.updateReviewState(ctx, id, state);
    }

    @Mutation()
    @Allow(Permission.DeleteCatalog)
    async deleteProductReview(
        @Ctx() ctx: RequestContext,
        @Args('id') id: ID,
    ): Promise<boolean> {
        return this.reviewService.deleteReview(ctx, id);
    }
}
