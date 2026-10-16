import { DeepPartial, ID, VendureEntity } from '@vendure/core';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Product } from '@vendure/core';

@Entity()
export class ProductReview extends VendureEntity {
    constructor(input?: DeepPartial<ProductReview>) {
        super(input);
    }

    @Column()
    authorName: string;

    @Column({ nullable: true })
    authorLocation: string;

    @Column({ type: 'int', default: 5 })
    rating: number;

    @Column()
    title: string;

    @Column('text')
    comment: string;

    @Column({ default: true })
    isVerifiedBuyer: boolean;

    @Column({ default: 'APPROVED' })
    state: string;

    @ManyToOne(() => Product, { onDelete: 'CASCADE' })
    product: Product;

    @Column()
    productId: ID;
}
