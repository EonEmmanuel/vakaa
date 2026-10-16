import { PluginCommonModule, VendurePlugin } from '@vendure/core';
import { ProductReview } from './entities/product-review.entity';
import { ProductReviewService } from './product-review.service';
import { shopReviewsSchema, adminReviewsSchema } from './api/reviews.graphql';
import { ProductReviewShopResolver } from './api/reviews-shop.resolver';
import { ProductReviewAdminResolver } from './api/reviews-admin.resolver';

@VendurePlugin({
    imports: [PluginCommonModule],
    entities: [ProductReview],
    providers: [ProductReviewService],
    shopApiExtensions: {
        schema: shopReviewsSchema,
        resolvers: [ProductReviewShopResolver],
    },
    adminApiExtensions: {
        schema: adminReviewsSchema,
        resolvers: [ProductReviewAdminResolver],
    },
    compatibility: '^3.0.0',
})
export class VakaaReviewsPlugin {}
